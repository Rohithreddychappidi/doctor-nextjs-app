import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const consultations = await db.getConsultationRequests();
    return NextResponse.json({ success: true, consultations });
  } catch (error) {
    console.error("GET /api/consultation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, institution, stage, focus_area, cv_url, preferred_time, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone number are required." }, { status: 400 });
    }

    const consultation = await db.createConsultationRequest({
      name,
      email,
      phone,
      institution: institution || "Not specified",
      stage: stage || "Candidate",
      focus_area: focus_area || "General Mentorship",
      cv_url: cv_url || "",
      preferred_time: preferred_time || "Flexible",
      message: message || ""
    });

    // Optional email dispatch via Resend if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_api_key")) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "JVM Medical Services <admissions@jvmmedicalservices.com>",
            to: [email],
            subject: "Consultation Request Received — Dr. Janardhan Mydam",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #12203B; margin-bottom: 8px;">JVM Medical Services</h2>
                <h3 style="color: #8A2A34; margin-top: 0;">Faculty Consultation Request Received</h3>
                <p>Dear <strong>${name}</strong>,</p>
                <p>Thank you for requesting a 1-on-1 consultation with <strong>Dr. Janardhan Mydam, MD, FAAP</strong> regarding <em>${focus_area || "Academic & Clinical Guidance"}</em>.</p>
                <p>Your academic background and submitted materials have been forwarded to Dr. Mydam's executive calendar team. We will review your preferred timing (<strong>${preferred_time || "Flexible"}</strong>) and dispatch a calendar invitation containing your Microsoft Teams meeting link shortly.</p>
                <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; margin: 20px 0;">
                  <strong style="color: #0f172a;">Requested Focus:</strong> ${focus_area}<br />
                  <strong style="color: #0f172a;">Institution:</strong> ${institution || "N/A"}
                </div>
                <p style="color: #64748b; font-size: 13px;">Warm regards,<br />Executive Administration · JVM Medical Services</p>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.warn("Resend email dispatch notice:", emailErr.message);
      }
    }

    return NextResponse.json({ success: true, consultation });
  } catch (error) {
    console.error("POST /api/consultation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "admin" && user.role !== "super_admin" && user.role !== "sub_admin")) {
      return NextResponse.json({ error: "Unauthorized faculty access." }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, scheduled_date, scheduled_time, meeting_link, meeting_platform, admin_notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Consultation ID is required." }, { status: 400 });
    }

    const updated = await db.updateConsultationRequest(id, {
      ...(status && { status }),
      ...(scheduled_date !== undefined && { scheduled_date }),
      ...(scheduled_time !== undefined && { scheduled_time }),
      ...(meeting_link !== undefined && { meeting_link }),
      ...(meeting_platform !== undefined && { meeting_platform }),
      ...(admin_notes !== undefined && { admin_notes })
    });

    if (!updated) {
      return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
    }

    // If meeting is scheduled, send calendar confirmation email to candidate
    if (status === "scheduled" && meeting_link && process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your_api_key")) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Dr. Janardhan Mydam <admissions@jvmmedicalservices.com>",
            to: [updated.email],
            subject: `Confirmed: Consultation with Dr. Janardhan Mydam on ${scheduled_date || "Upcoming Date"}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #12203B; margin-bottom: 8px;">JVM Medical Services</h2>
                <h3 style="color: #0F766E; margin-top: 0;">Your Consultation Call is Confirmed</h3>
                <p>Dear <strong>${updated.name}</strong>,</p>
                <p>Dr. Janardhan Mydam has scheduled your personal 1-on-1 consultation session.</p>
                <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${scheduled_date || "As scheduled"}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${scheduled_time || "Confirmed Time"}</p>
                  <p style="margin: 0 0 8px 0;"><strong>Platform:</strong> ${meeting_platform || "Microsoft Teams"}</p>
                  <p style="margin: 0;"><strong>Meeting Link:</strong> <a href="${meeting_link}" style="color: #0284c7; font-weight: bold;">Join Video Conference</a></p>
                </div>
                <p>Please test your audio and microphone 5 minutes prior to the meeting. We look forward to speaking with you.</p>
                <p style="color: #64748b; font-size: 13px;">Warm regards,<br />Dr. Janardhan Mydam, MD, FAAP<br />JVM Medical Services</p>
              </div>
            `
          })
        });
      } catch (e) {
        console.warn("Resend email scheduling notice:", e.message);
      }
    }

    return NextResponse.json({ success: true, consultation: updated });
  } catch (error) {
    console.error("PATCH /api/consultation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
