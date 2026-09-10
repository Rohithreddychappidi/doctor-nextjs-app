import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const adminMode = searchParams.get("admin") === "true";

    if (section) {
      if (adminMode) {
        const disclaimers = await db.getDisclaimers();
        const disc = disclaimers.find((d) => d.section_key === section);
        return NextResponse.json({ success: true, disclaimer: disc || null });
      }
      const disc = await db.getDisclaimerBySection(section);
      return NextResponse.json({ success: true, disclaimer: disc || null });
    }

    const disclaimers = await db.getDisclaimers();
    return NextResponse.json({ success: true, disclaimers });
  } catch (err) {
    console.error("Disclaimers GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      section_key,
      section_name,
      title,
      short_summary,
      doc_link_text,
      full_documentation,
      is_active,
    } = body;

    if (!section_key) {
      return NextResponse.json({ error: "Section key is required" }, { status: 400 });
    }

    const updated = await db.updateDisclaimer(section_key, {
      section_name,
      title,
      short_summary,
      doc_link_text,
      full_documentation,
      is_active,
    });

    return NextResponse.json({ success: true, disclaimer: updated });
  } catch (err) {
    console.error("Disclaimers POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
