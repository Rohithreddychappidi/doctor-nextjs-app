import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await requireRole(["admin", "super_admin"]);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const program = searchParams.get("program");

    let students = await db.getAllStudents();

    if (search) {
      students = students.filter(
        (s) =>
          s.first_name.toLowerCase().includes(search) ||
          s.last_name.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search) ||
          s.medical_school?.toLowerCase().includes(search)
      );
    }

    if (program && program !== "all") {
      students = students.filter((s) =>
        s.active_enrollments.some((e) => e.program_id === program || e.program_id === `prog_${program}`)
      );
    }

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
