import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const inquiries = await db.getInquiries();
    return NextResponse.json({ inquiries });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, category, reason, preferred_time, notes } = data;

    // Mandatory fields validation
    if (!name || !email || !category) {
      return NextResponse.json(
        { error: "Full name, email address, and inquiry category are mandatory fields (*)." },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      category: category.trim(),
      reason: reason?.trim() || "",
      preferred_time: preferred_time?.trim() || "",
      notes: notes?.trim() || "",
      status: "new",
      submitted_at: new Date().toISOString(),
    };

    const saved = await db.addInquiry(newInquiry);

    await db.logAudit(
      "INQUIRY_SUBMITTED",
      null,
      saved.email,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { category: saved.category, name: saved.name }
    );

    return NextResponse.json({ success: true, inquiry: saved });
  } catch (err) {
    console.error("Submit inquiry error:", err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status, notes } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }
    const updated = await db.updateInquiryStatus(id, status, notes);
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update inquiry status" }, { status: 500 });
  }
}
