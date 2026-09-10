import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.getDocumentsByStudent(session.id);

    return NextResponse.json({
      success: true,
      documents,
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

    const { category, title, file_url } = await request.json();
    if (!category || !file_url) {
      return NextResponse.json({ error: "Category and file URL are required" }, { status: 400 });
    }

    const doc = await db.addDocument(session.id, category, title, file_url);

    return NextResponse.json({
      success: true,
      document: doc,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
