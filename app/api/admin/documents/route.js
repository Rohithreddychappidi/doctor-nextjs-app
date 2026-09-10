import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["admin", "super_admin", "mentor"]);
    const documents = await db.getAllDocuments();
    return NextResponse.json({ success: true, documents });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function PUT(request) {
  try {
    const session = await requireRole(["admin", "super_admin"]);
    const { id, status, feedback } = await request.json();

    const updated = await db.updateDocumentStatus(id, status, feedback);
    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await db.logAudit(
      "DOCUMENT_STATUS_UPDATED",
      session.id,
      session.email,
      "127.0.0.1",
      { document_id: id, status, feedback }
    );

    return NextResponse.json({ success: true, document: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
