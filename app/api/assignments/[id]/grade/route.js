import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { grade, feedback } = await request.json();

    if (!grade) {
      return NextResponse.json({ error: "Grade is mandatory (*)" }, { status: 400 });
    }

    const updated = await db.gradeSubmission(id, grade, feedback || "");
    if (!updated) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (err) {
    console.error("Grading error:", err);
    return NextResponse.json({ error: "Failed to submit grade" }, { status: 500 });
  }
}
