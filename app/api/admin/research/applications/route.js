import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.role !== "super_admin" && session.role !== "sub_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await db.getResearchApplications();
    return NextResponse.json({ success: true, applications });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.role !== "super_admin" && session.role !== "sub_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, assigned_group_id, notes, tier_type = "free", fee = 0 } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Application ID and status are required." }, { status: 400 });
    }

    const updated = await db.updateResearchApplicationStatus(id, status, assigned_group_id, notes, tier_type, fee);
    if (!updated) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Simulated Resend email dispatch
    const resendDispatch = {
      service: "Resend",
      to: updated.email,
      from: "research-admissions@jvmmedicalservices.com",
      subject:
        status === "Approved"
          ? "JVM Medical Services: Research Mentorship Application Approved"
          : "JVM Medical Services: Research Mentorship Application Update",
      status: "delivered",
      timestamp: new Date().toISOString(),
      preview:
        status === "Approved"
          ? `Dear ${updated.full_name}, Dr. Janardhan Mydam has approved your research mentorship application. You have been assigned to collaboration group #${assigned_group_id || "Active Study"}.`
          : `Dear ${updated.full_name}, thank you for your interest in JVM Medical Services Research. Your application status has been updated.`,
    };

    return NextResponse.json({
      success: true,
      application: updated,
      resend_dispatch: resendDispatch,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
