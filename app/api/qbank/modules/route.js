import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specId = searchParams.get("specialization_id");
    const modules = await db.getQBankModules(specId);
    return NextResponse.json({ success: true, modules });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, specialization_id, description, is_free, price } = body;
    if (!name || !specialization_id) {
      return NextResponse.json({ error: "Module name and Specialization are required" }, { status: 400 });
    }
    const created = await db.createQBankModule({
      name,
      specialization_id,
      description,
      is_free,
      price,
    });
    return NextResponse.json({ success: true, module: created });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "Module ID required" }, { status: 400 });
    const updated = await db.updateQBankModule(id, updates);
    return NextResponse.json({ success: true, module: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Module ID required" }, { status: 400 });
    const ok = await db.deleteQBankModule(id);
    return NextResponse.json({ success: ok });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
