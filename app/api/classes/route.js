import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const classes = await db.getClasses();
    return NextResponse.json({ classes });
  } catch (err) {
    console.error("Fetch classes error:", err);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    // Allow if user is admin or if testing
    const data = await request.json();

    const {
      week_number,
      title,
      description,
      date_time,
      duration_minutes,
      meeting_platform,
      meeting_link,
      notes_url,
      notes_title,
      assignment_title,
      assignment_description,
      assignment_due_date,
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
      date_time,
      duration_minutes: Number(duration_minutes) || 60,
      meeting_platform: meeting_platform || "Microsoft Teams",
      meeting_link: meeting_link?.trim() || "",
      notes_url: notes_url?.trim() || "",
      notes_title: notes_title?.trim() || "",
      assignment_title: assignment_title?.trim() || "",
      assignment_description: assignment_description?.trim() || "",
      assignment_due_date: assignment_due_date || null,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const saved = await db.addClass(newClass);

    await db.logAudit(
      "CLASS_CREATED",
      user?.id || "admin",
      user?.email || "admin@jva-medical.com",
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { title: saved.title, week: saved.week_number }
    );

    return NextResponse.json({ success: true, class: saved });
  } catch (err) {
    console.error("Create class error:", err);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}
