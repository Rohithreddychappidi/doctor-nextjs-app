import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMarketingEmail } from "@/lib/email";

export async function GET() {
  try {
    const promotions = await db.getPromotions();
    return NextResponse.json({ promotions });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, title, message, cta_text, cta_link, is_active } = data;
    if (!id || !title || !message) {
      return NextResponse.json({ error: "ID, title, and message are required" }, { status: 400 });
    }
    const updated = await db.updatePromotion(id, { title, message, cta_text, cta_link, is_active });
    return NextResponse.json({ success: true, promotion: updated });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update promotion" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { subject, headline, bodyText, ctaText, ctaUrl } = await request.json();

    if (!subject || !headline || !bodyText) {
      return NextResponse.json({ error: "Subject, headline, and message body are required (*)" }, { status: 400 });
    }

    const users = await db.getUsers();
    const studentEmails = users
      .filter((u) => u.email && u.role === "student")
      .map((u) => u.email);

    if (studentEmails.length === 0) {
      studentEmails.push("student@example.com");
    }

    const res = await sendMarketingEmail({
      recipients: studentEmails,
      subject,
      headline,
      bodyText,
      ctaText,
      ctaUrl,
    });

    await db.logAudit(
      "MARKETING_EMAIL_BROADCAST",
      "admin",
      "admin@jva-medical.com",
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { subject, recipientCount: studentEmails.length }
    );

    return NextResponse.json({ success: true, count: studentEmails.length, result: res });
  } catch (err) {
    console.error("Marketing broadcast error:", err);
    return NextResponse.json({ error: "Failed to send email broadcast" }, { status: 500 });
  }
}
