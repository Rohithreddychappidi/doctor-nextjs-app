import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["admin", "super_admin"]);

    const enriched = memoryStore.enrollments.map((e) => {
      const user = memoryStore.users.find((u) => u.id === e.student_id);
      const profile = memoryStore.student_profiles.find((p) => p.user_id === e.student_id);
      const program = memoryStore.programs.find((p) => p.id === e.program_id);

      return {
        ...e,
        student_name: profile ? `${profile.first_name} ${profile.last_name}` : user?.email || e.student_id,
        student_email: user?.email || "",
        program_name: program?.name || e.program_id,
        program_key: program?.key || "",
      };
    });

    return NextResponse.json({
      success: true,
      enrollments: enriched,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const body = await request.json();

    const created = await db.createEnrollment(body);
    await db.logAudit(
      "ENROLLMENT_CREATED",
      session.id,
      session.email,
      "127.0.0.1",
      { enrollment_id: created.id, student_id: body.student_id, program_id: body.program_id }
    );

    return NextResponse.json({
      success: true,
      enrollment: created,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function PUT(request) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const { id, updates } = await request.json();

    const updated = await db.updateEnrollment(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    await db.logAudit(
      "ENROLLMENT_MODIFIED",
      session.id,
      session.email,
      "127.0.0.1",
      { enrollment_id: id, updates }
    );

    return NextResponse.json({
      success: true,
      enrollment: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function DELETE(request) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const { id } = await request.json();

    const success = await db.deleteEnrollment(id);
    if (!success) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    await db.logAudit(
      "ENROLLMENT_DELETED",
      session.id,
      session.email,
      "127.0.0.1",
      { enrollment_id: id }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
