import fs from "fs";

let content = fs.readFileSync("lib/db.js", "utf8");

const cleanEnrollments = `  enrollments: [
    {
      id: "enr_student_rot",
      student_id: "usr_student_jvm",
      program_id: "prog_tele_rotation",
      plan: "6-Week Intensive",
      access_start_date: "2026-08-15T00:00:00Z",
      access_expiry_date: "2026-11-15T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        rotation_site: "JVA Tele-Neonatology Clinical Network",
        preceptor: "Dr. Janardhan Mydam, MD, FAAP",
        cohort: "Fall 2026 Alpha Cohort",
        current_week: 4,
        meeting_link: "https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-tele-rotation"
      },
      created_at: "2026-08-10T10:00:00Z",
      last_accessed_at: "2026-09-09T14:30:00Z"
    },
    {
      id: "enr_student_qb",
      student_id: "usr_student_jvm",
      program_id: "prog_qbank",
      plan: "12-Month Access",
      access_start_date: "2026-07-01T00:00:00Z",
      access_expiry_date: "2027-07-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        target_exam: "USMLE Step 1 & Step 2 CK",
        questions_completed: 0,
        overall_accuracy: 0
      },
      created_at: "2026-07-01T08:00:00Z",
      last_accessed_at: "2026-09-09T18:00:00Z"
    },
    {
      id: "enr_student_live",
      student_id: "usr_student_jvm",
      program_id: "prog_live_learning",
      plan: "Weekly Seminars",
      access_start_date: "2026-08-01T00:00:00Z",
      access_expiry_date: "2026-12-31T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        cohort: "Thursday Evening Clinical Rounds",
        teams_link: "https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-week1"
      },
      created_at: "2026-08-01T00:00:00Z",
      last_accessed_at: "2026-09-08T19:00:00Z"
    },
    {
      id: "enr_student_res",
      student_id: "usr_student_jvm",
      program_id: "prog_research",
      plan: "Clinical Research Cohort",
      access_start_date: "2026-08-01T00:00:00Z",
      access_expiry_date: "2026-12-31T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        project_title: "Neonatal Clinical Outcomes Research",
        current_stage: "Protocol Review"
      },
      created_at: "2026-08-01T00:00:00Z",
      last_accessed_at: "2026-09-08T19:00:00Z"
    }
  ],

  // 7. Specialization Tracks`;

const startIdx = content.indexOf("  enrollments: [");
const endIdx = content.indexOf("  // 7. Specialization Tracks");
if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + cleanEnrollments + content.slice(endIdx + "  // 7. Specialization Tracks".length);
  fs.writeFileSync("lib/db.js", content, "utf8");
  console.log("Cleaned enrollments successfully!");
} else {
  console.error("Could not find start or end index for enrollments");
}
