import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await db.getStudentResearchApplication(session.id, session.email);

    const isApproved = application?.status === "Approved" || application?.status === "Approved - Paid";
    const isPaidOrFree = application?.tier_type === "free" || application?.payment_status === "Paid" || application?.payment_status === "Free Access";
    const isEnrolled = !!(isApproved && isPaidOrFree);

    // Initial default research cohort messages
    if (!memoryStore.research_chat_messages) {
      memoryStore.research_chat_messages = [
        {
          id: "msg_1",
          sender_id: "usr_admin",
          sender_name: "Dr. Janardhan Mydam, MD, FAAP",
          sender_role: "doctor",
          sender_avatar: null,
          text: "Welcome to the Pediatric & Neonatal Research Collaborative. Please review the PREMOD2 and delayed cord management literature in our documents vault. On our Thursday meeting, we will discuss SBAR presentation of study findings.",
          created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          attachments: []
        },
        {
          id: "msg_2",
          sender_id: "usr_fellow_1",
          sender_name: "Dr. Marcus Vance (Research Fellow)",
          sender_role: "student",
          sender_avatar: null,
          text: "Thank you Dr. Mydam. I have updated the inclusion criteria spreadsheet for preterm infants <32 weeks gestational age.",
          created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          attachments: []
        }
      ];
    }

    // Initial research documents
    if (!memoryStore.research_documents) {
      memoryStore.research_documents = [
        {
          id: "doc_res_1",
          title: "IRB Approved Research Protocol & Informed Consent Template",
          category: "IRB / Protocol",
          uploaded_by: "Dr. Janardhan Mydam, MD, FAAP",
          file_url: "https://drive.google.com/jva-irb-protocol-template.pdf",
          uploaded_at: "2026-09-01",
          size: "1.4 MB"
        },
        {
          id: "doc_res_2",
          title: "Literature Review: PREMOD2 Delayed Cord Clamping in Premature Infants",
          category: "Literature Synthesis",
          uploaded_by: "Faculty Research Office",
          file_url: "https://drive.google.com/jva-premod2-synthesis.pdf",
          uploaded_at: "2026-09-05",
          size: "2.1 MB"
        },
        {
          id: "doc_res_3",
          title: "De-identified Neonatal Transition Dataset & SPSS Variable Codebook",
          category: "Dataset / Statistics",
          uploaded_by: "Dr. Janardhan Mydam, MD, FAAP",
          file_url: "https://drive.google.com/jva-spontaneous-breathing-data.xlsx",
          uploaded_at: "2026-09-10",
          size: "850 KB"
        }
      ];
    }

    // Doctor Scheduled Research Meetings
    if (!memoryStore.research_scheduled_meetings) {
      const now = new Date();
      const thisFriday = new Date(now.getTime() + 2 * 24 * 3600 * 1000).toISOString();
      const nextWeek = new Date(now.getTime() + 9 * 24 * 3600 * 1000).toISOString();

      memoryStore.research_scheduled_meetings = [
        {
          id: "meet_res_1",
          title: "Weekly Research Roundtable: Literature Analysis & Methodology Review",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          scheduled_time: thisFriday,
          duration: "60 Minutes",
          teams_url: "https://teams.microsoft.com/l/meetup-join/jva-research-roundtable-dr-mydam",
          meeting_id: "840 219 9931",
          passcode: "RESEARCH2026",
          agenda: "Review of statistical methods, risk ratio calculations, and drafting the manuscript introduction."
        },
        {
          id: "meet_res_2",
          title: "IRB Ethics & Multi-Center Abstract Submission Planning",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          scheduled_time: nextWeek,
          duration: "60 Minutes",
          teams_url: "https://teams.microsoft.com/l/meetup-join/jva-research-roundtable-dr-mydam",
          meeting_id: "840 219 9931",
          passcode: "RESEARCH2026",
          agenda: "Formatting submission for Pediatric Academic Societies (PAS) / AAP National Conference."
        }
      ];
    }

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      application: application || null,
      messages: memoryStore.research_chat_messages,
      documents: memoryStore.research_documents,
      meetings: memoryStore.research_scheduled_meetings
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // 1. Submit Research Intake Form
    if (action === "apply_intake") {
      const {
        full_name,
        email,
        phone,
        institution,
        research_topic,
        proposal_summary,
        cv_url,
        prior_experience
      } = body;

      if (!full_name || !email || !research_topic || !proposal_summary || !cv_url) {
        return NextResponse.json(
          { error: "Full name, email, research topic, proposal summary, and CV link are mandatory." },
          { status: 400 }
        );
      }

      const existing = await db.getStudentResearchApplication(session.id, session.email);
      if (existing) {
        const updated = await db.updateResearchApplication(existing.id, {
          applicant_name: full_name,
          phone,
          institution,
          research_topic,
          proposal_summary,
          cv_url,
          prior_experience,
          status: "Under Review"
        });
        return NextResponse.json({ success: true, application: updated });
      }

      const newApp = await db.createResearchApplication({
        student_id: session.id,
        applicant_name: full_name,
        applicant_email: email || session.email,
        phone,
        institution,
        research_topic,
        proposal_summary,
        cv_url,
        prior_experience
      });

      return NextResponse.json({ success: true, application: newApp });
    }

    // 2. Pay Research Fee if Doctor Designated as Paid
    if (action === "pay_tuition") {
      const app = await db.getStudentResearchApplication(session.id, session.email);
      if (!app) {
        return NextResponse.json({ error: "No research application found." }, { status: 404 });
      }

      const updated = await db.updateResearchApplication(app.id, {
        status: "Approved - Paid",
        payment_status: "Paid",
        paid_at: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: "Research mentorship tuition confirmed! Your collaborative research workspace is active.",
        application: updated
      });
    }

    // 3. Send Group Chat Message
    if (action === "send_message") {
      const { text, attachment_url, attachment_name } = body;
      if (!text && !attachment_url) {
        return NextResponse.json({ error: "Message text or attachment is required." }, { status: 400 });
      }

      if (!memoryStore.research_chat_messages) memoryStore.research_chat_messages = [];

      const newMsg = {
        id: `msg_${Date.now()}`,
        sender_id: session.id,
        sender_name: session.name || "Medical Trainee",
        sender_role: "student",
        sender_avatar: null,
        text: text || "",
        created_at: new Date().toISOString(),
        attachments: attachment_url ? [{ name: attachment_name || "Attachment", url: attachment_url }] : []
      };

      memoryStore.research_chat_messages.push(newMsg);
      return NextResponse.json({ success: true, message: newMsg });
    }

    // 4. Upload / Share Document to Vault
    if (action === "upload_document") {
      const { title, category, file_url } = body;
      if (!title || !file_url) {
        return NextResponse.json({ error: "Document title and URL are required." }, { status: 400 });
      }

      if (!memoryStore.research_documents) memoryStore.research_documents = [];

      const newDoc = {
        id: `doc_res_${Date.now()}`,
        title,
        category: category || "Study Protocol",
        uploaded_by: session.name || "Medical Trainee",
        file_url,
        uploaded_at: new Date().toISOString().split("T")[0],
        size: "Shared Link"
      };

      memoryStore.research_documents.unshift(newDoc);
      return NextResponse.json({ success: true, document: newDoc });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
