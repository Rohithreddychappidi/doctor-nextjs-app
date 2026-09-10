import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attempt = memoryStore.test_attempts.find((a) => a.id === id);
    if (!attempt) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers, time_spent_seconds } = await request.json();
    const evaluated = await db.submitTestAttempt(id, answers, time_spent_seconds);

    if (!evaluated) {
      return NextResponse.json({ error: "Test attempt not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      result: evaluated,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
