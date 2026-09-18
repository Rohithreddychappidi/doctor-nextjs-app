import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("public") === "true";

    const classes = await db.getClasses();
    const registrations = (memoryStore.student_class_registrations || []).map((r) => ({
      ...r,
      registered_at: r.registered_at || new Date().toISOString()
    }));

    if (publicOnly) {
      // Public presentation: only published, active classes, without sensitive URLs
      const publicClasses = classes
        .filter((c) => c.is_published !== false && c.is_active !== false)
        .map((c) => ({
          id: c.id,
          week_number: c.week_number,
          title: c.title,
          description: c.description,
          doctor_name: c.doctor_name || c.instructor || "Dr. Janardhan Mydam, MD, FAAP",
          date_time: c.date_time,
          duration_minutes: c.duration_minutes || 60,
          meeting_platform: c.meeting_platform || "Microsoft Teams",
          is_free: c.is_free ?? true,
          price: c.price || 0,
          max_students: c.max_students || null,
          registered_count: registrations.filter((r) => r.class_id === c.id).length,
        }));
      return NextResponse.json({ success: true, classes: publicClasses });
    }

    const enrichedClasses = classes.map((c) => {
      const attendees = registrations.filter((r) => r.class_id === c.id);
      return {
        ...c,
        is_published: c.is_published !== false,
        doctor_name: c.doctor_name || c.instructor || "Dr. Janardhan Mydam, MD, FAAP",
        is_free: c.is_free ?? true,
        price: c.price || 0,
        registered_count: attendees.length,
        attendees: attendees.map((a) => ({
          student_id: a.student_id,
          student_name: a.student_name || "Enrolled Trainee",
          student_email: a.student_email,
          registered_at: a.registered_at,
          payment_status: a.payment_status || "Free",
        })),
      };
    });

    return NextResponse.json({ classes: enrichedClasses, registrations });
  } catch (err) {
    console.error("Fetch classes error:", err);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const data = await request.json();

    const {
      week_number,
      title,
      description,
      doctor_name,
      date_time,
      duration_minutes,
      meeting_platform,
      meeting_link,
      meeting_passcode,
      teams_meeting_id,
      recording_url,
      notes_url,
      notes_title,
      assignment_title,
      assignment_description,
      assignment_due_date,
      is_published = true,
      is_free = true,
      price = 0,
      max_students = null,
    } = data;

    // Mandatory fields check
    if (!title || !week_number || !date_time) {
      return NextResponse.json(
        { error: "Class title, week number, and scheduled date/time are mandatory (*)." },
        { status: 400 }
      );
    }

    const newClass = {
      id: `cls_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      week_number: Number(week_number),
      title: title.trim(),
      description: description?.trim() || "",
      doctor_name: doctor_name?.trim() || "Dr. Janardhan Mydam, MD, FAAP",
      date_time,
      duration_minutes: Number(duration_minutes) || 60,
      meeting_platform: meeting_platform || "Microsoft Teams",
      meeting_link: meeting_link?.trim() || "",
      meeting_passcode: meeting_passcode?.trim() || "",
      teams_meeting_id: teams_meeting_id?.trim() || "",
      recording_url: recording_url?.trim() || "",
      notes_url: notes_url?.trim() || "",
      notes_title: notes_title?.trim() || "",
      assignment_title: assignment_title?.trim() || "",
      assignment_description: assignment_description?.trim() || "",
      assignment_due_date: assignment_due_date || null,
      is_published: Boolean(is_published),
      is_free: Boolean(is_free),
      price: Number(price) || 0,
      max_students: max_students ? Number(max_students) : null,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const saved = await db.addClass(newClass);

    await db.logAudit(
      "CLASS_CREATED",
      user?.id || "admin",
      user?.email || "admin@jvmmedicalservices.com",
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { title: saved.title, week: saved.week_number, is_published: saved.is_published }
    );

    return NextResponse.json({ success: true, class: saved });
  } catch (err) {
    console.error("Create class error:", err);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, action, ...updates } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Class id is required" }, { status: 400 });
    }

    let updated = null;
    if (action === "toggle_publish") {
      const existing = (await db.getClasses()).find((c) => c.id === id);
      if (!existing) {
        return NextResponse.json({ error: "Class not found" }, { status: 404 });
      }
      const newStatus = existing.is_published === false ? true : false;
      updated = await db.updateClass(id, { is_published: newStatus });
    } else {
      updated = await db.updateClass(id, updates);
    }

    return NextResponse.json({ success: true, class: updated });
  } catch (err) {
    console.error("Patch class error:", err);
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}
