import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await db.getSupportTickets(session.id);

    return NextResponse.json({
      success: true,
      tickets,
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

    const { subject, message, ticket_id } = await request.json();

    if (ticket_id) {
      // Reply to existing ticket
      const profile = await db.getStudentProfile(session.id);
      const senderName = profile ? `${profile.first_name} ${profile.last_name}` : "Student";
      const updated = await db.replySupportTicket(ticket_id, senderName, "student", message);
      return NextResponse.json({ success: true, ticket: updated });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const ticket = await db.createSupportTicket(session.id, subject, message);

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
