import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const discussions = await db.getResearchDiscussions();
    return NextResponse.json({ success: true, discussions });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { category, title, content, author_name, author_role } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const newDisc = await db.createResearchDiscussion({
      category: category || "General Research",
      title,
      content,
      author_name: author_name || "Guest Learner",
      author_role: author_role || "guest",
    });

    return NextResponse.json({ success: true, discussion: newDisc });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
