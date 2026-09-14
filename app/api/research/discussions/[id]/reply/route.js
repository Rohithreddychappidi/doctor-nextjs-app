import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { author_name, author_role, content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Reply content cannot be empty." }, { status: 400 });
    }

    const newReply = await db.addDiscussionReply(id, {
      author_name: author_name || "Community Participant",
      author_role: author_role || "guest",
      content: content.trim(),
    });

    if (!newReply) {
      return NextResponse.json({ error: "Discussion not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, reply: newReply });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
