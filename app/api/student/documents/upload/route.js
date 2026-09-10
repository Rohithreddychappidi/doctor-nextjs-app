import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { uploadToStorage } from "@/lib/storage";

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") || "Academic Document";
    const category = formData.get("category") || "General";
    const file = formData.get("file");

    let fileUrl = "/uploads/sample_document.pdf";
    let fileName = "document.pdf";
    let fileSizeKb = 512;

    if (file && typeof file === "object") {
      fileName = file.name || "document.pdf";
      fileSizeKb = Math.round((file.size || 512000) / 1024);
      const buffer = Buffer.from(await file.arrayBuffer());
      const storageResult = await uploadToStorage(
        buffer,
        fileName,
        file.type || "application/pdf",
        session.id
      );
      fileUrl = storageResult.url;
    }

    const newDoc = await db.createDocument({
      student_id: session.id,
      title,
      category,
      file_name: fileName,
      file_url: fileUrl,
      file_size_kb: fileSizeKb,
      status: "Under Review",
    });

    await db.logAudit("DOCUMENT_UPLOADED", session.id, session.email, "127.0.0.1", {
      document_id: newDoc.id,
      title,
      category,
    });

    return NextResponse.json({
      success: true,
      document: newDoc,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
