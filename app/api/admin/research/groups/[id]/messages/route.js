import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const groups = await db.getResearchGroups();
    const grp = groups.find((g) => g.id === id);

    if (!grp) {
      return NextResponse.json({ error: "Research group not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, messages: grp.messages || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const messageText = body.message || body.content || "";
    const { attachments } = body;

    if (!messageText && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: "Message or attachment is required." }, { status: 400 });
    }

    const isDoctor = session.role === "admin" || session.role === "super_admin";
    const sender_name = isDoctor
      ? "Dr. Janardhan Mydam, MD, FAAP"
      : session.name || "Student Researcher";
    const sender_role = isDoctor ? "doctor" : "student";

    const newMsg = await db.addResearchGroupMessage(id, {
      sender_name,
      sender_role,
      sender_email: session.email,
      message: messageText,
      attachments: attachments || [],
    });

    if (!newMsg) {
      return NextResponse.json({ error: "Research group not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: newMsg });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
