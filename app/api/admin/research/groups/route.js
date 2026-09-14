import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await db.getResearchGroups();
    return NextResponse.json({ success: true, groups });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "admin" && session.role !== "super_admin" && session.role !== "sub_admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, focus_area, teams_link, members } = body;

    if (!title) {
      return NextResponse.json({ error: "Group title is required." }, { status: 400 });
    }

    const newGroup = await db.createResearchGroup({
      title,
      focus_area,
      teams_link,
      members,
    });

    return NextResponse.json({ success: true, group: newGroup });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
