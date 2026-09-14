import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { full_name, email, institution, research_topic, topic_description, resume_url, team_members } = body;

    if (!full_name || !email || !research_topic) {
      return NextResponse.json(
        { error: "Full name, email, and research topic of interest are required." },
        { status: 400 }
      );
    }

    const application = await db.createResearchApplication({
      full_name,
      email,
      institution,
      research_topic,
      topic_description,
      resume_url,
      team_members,
    });

    return NextResponse.json({
      success: true,
      message: "Your research mentorship application has been submitted to Dr. Janardhan Mydam for review.",
      application,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
