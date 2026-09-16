import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!memoryStore.student_class_registrations) memoryStore.student_class_registrations = [];
    const userRegs = memoryStore.student_class_registrations.filter((r) => r.student_id === session.id);

    // Initial rich clinical classes
    if (!memoryStore.live_classes_catalog) {
      const now = new Date();
      // One class starting in 10 minutes (to demonstrate unlocked live Teams button)
      const liveSoon = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
      // One class tomorrow evening
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      // One class next Tuesday
      const nextWeek = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

      memoryStore.live_classes_catalog = [
        {
          id: "cls_live_1",
          title: "Golden Hour Resuscitation & Neonatal Intubation Workshop",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          scheduled_time: liveSoon,
          duration: "75 Minutes",
          is_free: true,
          price: 0,
          description: "Hands-on video analysis of premature infant resuscitation, T-piece titration, and endotracheal tube depth landmarks.",
          teams_url: "https://teams.microsoft.com/l/meetup-join/jva-nrp-intubation-workshop",
          meeting_id: "819 402 1109",
          passcode: "GOLDEN2026",
          tags: ["NRP", "NICU", "Resuscitation"]
        },
        {
          id: "cls_live_2",
          title: "Pediatric Sepsis, Meningitis & Shock Resuscitation (PALS / AAP)",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          scheduled_time: tomorrow,
          duration: "90 Minutes",
          is_free: false,
          price: 25,
          description: "Evidence-based pediatric septic shock management, fluid bolus thresholds in cardiogenic shock, and inotrope selection.",
          teams_url: "https://teams.microsoft.com/l/meetup-join/jva-pediatric-sepsis-grandrounds",
          meeting_id: "902 314 5581",
          passcode: "SEPSIS2026",
          tags: ["PALS", "Critical Care", "Pediatrics"]
        },
        {
          id: "cls_live_3",
          title: "Congenital Heart Disease Masterclass: Cyanotic vs Acyanotic Defects",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          scheduled_time: nextWeek,
          duration: "90 Minutes",
          is_free: false,
          price: 35,
          description: "Hyperoxia challenge test, ductal-dependent lesions, prostaglandin E1 administration, and board vignette breakdown.",
          teams_url: "https://teams.microsoft.com/l/meetup-join/jva-chd-cardiology-masterclass",
          meeting_id: "721 884 9012",
          passcode: "CARDIAC2026",
          tags: ["Cardiology", "USMLE Step 2 CK"]
        }
      ];
    }

    const classes = memoryStore.live_classes_catalog.map((c) => {
      const isRegistered = userRegs.some((r) => r.class_id === c.id);
      return {
        ...c,
        is_registered: isRegistered || c.is_free, // Free classes allow immediate visibility/registration
      };
    });

    const recorded = [
      {
        id: "rec_cls_1",
        title: "Neonatal Jaundice: Transcutaneous Screening & Exchange Transfusion Indications",
        preceptor: "Dr. Janardhan Mydam, MD, FAAP",
        recorded_at: "2026-09-02",
        duration: "1 hr 15 min",
        video_url: "https://teams.microsoft.com/l/recording/jaundice-aap-screening",
        notes: "Detailed review of AAP 2022 hour-specific nomogram and phototherapy irradiance.",
        tags: ["Hyperbilirubinemia", "AAP 2022"]
      },
      {
        id: "rec_cls_2",
        title: "Pediatric Asthma Exacerbations & Pediatric Emergency Clinical Pathways",
        preceptor: "Dr. Janardhan Mydam, MD, FAAP",
        recorded_at: "2026-09-06",
        duration: "1 hr 30 min",
        video_url: "https://teams.microsoft.com/l/recording/pediatric-asthma-pathways",
        notes: "Continuous albuterol, ipratropium, IV magnesium sulfate, and biphasic anaphylaxis precautions.",
        tags: ["Asthma", "Emergency", "Pediatrics"]
      }
    ];

    return NextResponse.json({
      success: true,
      classes,
      recorded
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
    const { action, class_id } = body;

    if (!class_id) {
      return NextResponse.json({ error: "class_id is required." }, { status: 400 });
    }

    if (!memoryStore.student_class_registrations) memoryStore.student_class_registrations = [];

    const existing = memoryStore.student_class_registrations.find(
      (r) => r.student_id === session.id && r.class_id === class_id
    );

    if (!existing) {
      memoryStore.student_class_registrations.push({
        id: `reg_cls_${Date.now()}`,
        student_id: session.id,
        class_id,
        registered_at: new Date().toISOString(),
        payment_status: action === "pay" ? "Paid" : "Free"
      });
    }

    return NextResponse.json({
      success: true,
      message: action === "pay"
        ? "Class tuition confirmed! You are registered for the live lecture."
        : "You are successfully registered for this free clinical class!"
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
