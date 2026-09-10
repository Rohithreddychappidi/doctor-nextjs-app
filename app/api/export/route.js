import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function arrayToCSV(headers, rows) {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = typeof val === "object" ? JSON.stringify(val) : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerLine = headers.map(escapeCell).join(",");
  const dataLines = rows.map((row) => row.map(escapeCell).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "students";

    let csvContent = "";
    let filename = `export_${type}_${Date.now()}.csv`;

    if (type === "students") {
      const users = await db.getUsers();
      const headers = ["ID", "Email", "Full Name", "Role", "Specialty", "Created At", "Last Login"];
      const rows = users.map((u) => [
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.specialty,
        u.created_at,
        u.last_login_at,
      ]);
      csvContent = arrayToCSV(headers, rows);
    } else if (type === "tests") {
      const attempts = await db.getTestAttempts();
      const headers = ["Attempt ID", "Student ID", "Test ID", "Score (%)", "Total Questions", "Passed", "Time Spent (s)", "Completed At"];
      const rows = attempts.map((a) => [
        a.id,
        a.student_id,
        a.test_id,
        a.score,
        a.total_questions,
        a.passed ? "YES" : "NO",
        a.time_spent_seconds,
        a.completed_at,
      ]);
      csvContent = arrayToCSV(headers, rows);
    } else if (type === "classes") {
      const classes = await db.getClasses();
      const headers = ["Class ID", "Week", "Title", "Date & Time", "Duration (min)", "Platform", "Meeting Link", "Notes Title", "Assignment Title"];
      const rows = classes.map((c) => [
        c.id,
        c.week_number,
        c.title,
        c.date_time,
        c.duration_minutes,
        c.meeting_platform,
        c.meeting_link,
        c.notes_title,
        c.assignment_title,
      ]);
      csvContent = arrayToCSV(headers, rows);
    } else if (type === "inquiries") {
      const inquiries = await db.getInquiries();
      const headers = ["Inquiry ID", "Name", "Email", "Phone", "Category", "Reason", "Preferred Time", "Status", "Submitted At"];
      const rows = inquiries.map((i) => [
        i.id,
        i.name,
        i.email,
        i.phone,
        i.category,
        i.reason,
        i.preferred_time,
        i.status,
        i.submitted_at,
      ]);
      csvContent = arrayToCSV(headers, rows);
    } else if (type === "audit") {
      const logs = await db.getAuditLogs();
      const headers = ["Log ID", "Action", "Actor ID", "Actor Email", "IP Address", "Timestamp", "Details"];
      const rows = logs.map((l) => [
        l.id,
        l.action,
        l.actor_id,
        l.actor_email,
        l.ip_address,
        l.created_at,
        l.details,
      ]);
      csvContent = arrayToCSV(headers, rows);
    } else {
      return NextResponse.json({ error: "Invalid export type requested" }, { status: 400 });
    }

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
