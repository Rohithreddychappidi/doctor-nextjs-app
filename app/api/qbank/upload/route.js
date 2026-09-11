import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper to parse CSV lines taking into account quoted cells containing commas
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, "_"));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 4) {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] !== undefined ? values[idx].trim() : "";
      });
      records.push(obj);
    }
  }

  return records;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { module_id, csv_text, questions: directQuestions } = body;

    if (!module_id) {
      return NextResponse.json({ error: "Target Module ID is required." }, { status: 400 });
    }

    let parsedQuestions = [];

    if (Array.isArray(directQuestions) && directQuestions.length > 0) {
      parsedQuestions = directQuestions;
    } else if (csv_text && typeof csv_text === "string") {
      const rows = parseCSV(csv_text);
      parsedQuestions = rows.map(r => {
        // Find question stem
        const questionStem = r.question || r.stem || r.question_stem || r.vignette || "";
        // Find options
        const optA = r.option_a || r.optiona || r.a || "";
        const optB = r.option_b || r.optionb || r.b || "";
        const optC = r.option_c || r.optionc || r.c || "";
        const optD = r.option_d || r.optiond || r.d || "";
        // Correct option
        const correctRaw = r.correct_option || r.correct || r.answer || r.correct_answer || "A";
        // Explanation
        const explanation = r.explanation || r.rationale || r.answer_explanation || "";

        return {
          question: questionStem,
          optionA: optA,
          optionB: optB,
          optionC: optC,
          optionD: optD,
          correct_option: correctRaw,
          explanation: explanation,
        };
      }).filter(q => q.question && (q.optionA || q.optionB));
    }

    if (parsedQuestions.length === 0) {
      return NextResponse.json(
        { error: "No valid questions found in upload. Please check that your file has columns: Question, Option A, Option B, Option C, Option D, Correct Option, Explanation." },
        { status: 400 }
      );
    }

    const added = await db.bulkAddQuestions(module_id, parsedQuestions);

    return NextResponse.json({
      success: true,
      count: added.length,
      module_id,
      questions: added
    });
  } catch (err) {
    console.error("Bulk upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
