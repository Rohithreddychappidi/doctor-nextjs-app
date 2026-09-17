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
    const userRegs = memoryStore.student_class_registrations.filter(
      (r) => r.student_id === session.id || r.student_email === session.email
    );

    // Initial clinical classes with realistic future timing for proper 15-minute lock testing
    if (!memoryStore.live_classes_catalog) {
      const now = new Date();
      // Class 1: Free class tomorrow at 18:00 CST (~24 hours away -> locked)
      const tomorrow18 = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      // Class 2: Paid lecture in 3 days ($25 -> requires payment checkout, locked until 15 min prior)
      const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      // Class 3: High-yield cardiology masterclass next week ($35)
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      memoryStore.live_classes_catalog = [
        {
          id: "cls_live_1",
          title: "Golden Hour Resuscitation & Neonatal Intubation Workshop",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          scheduled_time: tomorrow18,
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
          scheduled_time: inThreeDays,
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
      const reg = userRegs.find((r) => r.class_id === c.id);
      return {
        ...c,
        is_registered: !!reg,
        registered_at: reg?.registered_at || null,
        payment_status: reg?.payment_status || (c.is_free ? "Free" : "Unpaid")
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
    const { action, class_id, payment_details } = body;

    if (!class_id) {
      return NextResponse.json({ error: "class_id is required." }, { status: 400 });
    }

    if (!memoryStore.student_class_registrations) memoryStore.student_class_registrations = [];
    if (!memoryStore.payment_transactions) memoryStore.payment_transactions = [];

    const liveCatalog = memoryStore.live_classes_catalog || [];
    const targetClass = liveCatalog.find((c) => c.id === class_id);
    if (!targetClass) {
      return NextResponse.json({ error: "Class not found in active catalog." }, { status: 404 });
    }

    const existing = memoryStore.student_class_registrations.find(
      (r) => (r.student_id === session.id || r.student_email === session.email) && r.class_id === class_id
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already registered for this clinical lecture.",
        registration: existing
      });
    }

    const isPaid = action === "pay" || !targetClass.is_free;
    const amount = isPaid ? targetClass.price || payment_details?.amount || 25 : 0;
    const transactionId = isPaid
      ? `tx_cls_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      : null;

    if (isPaid) {
      // Record payment transaction
      memoryStore.payment_transactions.push({
        id: transactionId,
        student_id: session.id,
        student_name: session.name || "Enrolled Trainee",
        student_email: session.email,
        item_type: "live_class",
        item_id: class_id,
        item_title: targetClass.title,
        amount,
        payment_method: payment_details?.payment_method || "Credit Card (Simulated / Stripe)",
        card_last4: payment_details?.card_last4 || "4242",
        status: "succeeded",
        created_at: new Date().toISOString()
      });
    }

    const newRegistration = {
      id: `reg_cls_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      student_id: session.id,
      student_name: session.name || "Enrolled Trainee",
      student_email: session.email,
      class_id,
      class_title: targetClass.title,
      scheduled_time: targetClass.scheduled_time,
      is_free: targetClass.is_free,
      paid_amount: amount,
      payment_status: isPaid ? "Paid" : "Free",
      transaction_id: transactionId,
      registered_at: new Date().toISOString()
    };

    memoryStore.student_class_registrations.push(newRegistration);

    return NextResponse.json({
      success: true,
      message: isPaid
        ? `Payment of $${amount} confirmed! Your seat is reserved. Microsoft Teams link will unlock 15 minutes before class.`
        : "Registration confirmed for this free clinical lecture! Teams link will unlock 15 minutes before class.",
      registration: newRegistration
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
