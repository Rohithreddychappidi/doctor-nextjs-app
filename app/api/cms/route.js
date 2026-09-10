import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key) {
      return NextResponse.json({ error: "CMS key is required" }, { status: 400 });
    }
    const data = await db.getCmsData(key);
    return NextResponse.json({ key, data });
  } catch (err) {
    console.error("Fetch CMS error:", err);
    return NextResponse.json({ error: "Failed to fetch CMS content" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { key, data } = await request.json();
    if (!key || !data) {
      return NextResponse.json({ error: "CMS key and data are required" }, { status: 400 });
    }
    await db.saveCmsData(key, data);
    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error("Save CMS error:", err);
    return NextResponse.json({ error: "Failed to save CMS content" }, { status: 500 });
  }
}
