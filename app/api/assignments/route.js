import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");
    const submissions = await db.getSubmissions(classId);
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error("Fetch submissions error:", err);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const data = await request.json();
    const { class_id, submission_text, file_url } = data;

    if (!class_id || (!submission_text && !file_url)) {
      return NextResponse.json(
        { error: "Class ID and submission content (text or attached file) are mandatory (*)." },
        { status: 400 }
      );
    }

    const studentId = user?.id || `anon_${Date.now()}`;
    const studentName = user?.name || data.student_name || "Student";

    const newSub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      class_id,
      student_id: studentId,
      student_name: studentName,
      submission_text: submission_text?.trim() || "",
      file_url: file_url?.trim() || "",
      submitted_at: new Date().toISOString(),
      grade: null,
      feedback: null,
    };

    const saved = await db.addSubmission(newSub);
    return NextResponse.json({ success: true, submission: saved });
  } catch (err) {
    console.error("Submit assignment error:", err);
    return NextResponse.json({ error: "Failed to submit assignment" }, { status: 500 });
  }
}
