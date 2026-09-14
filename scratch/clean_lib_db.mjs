import fs from "fs";

let content = fs.readFileSync("lib/db.js", "utf8");

// 1. Clean roles to include role_guest
const guestRoleStr = `{ id: "role_guest", name: "guest", description: "Community guest user" },\n  `;
if (!content.includes('"role_guest"')) {
  content = content.replace('roles: [\n', 'roles: [\n    ' + guestRoleStr);
}

// 2. Replace users array
const targetUsersStart = "  users: [";
const targetUsersEnd = "  // 4. User Roles Mapping";
const newUsersContent = `  users: [
    {
      id: "usr_admin_jvm",
      email: "admin@jvmmedicalservices.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z"
    },
    {
      id: "usr_dr_mydam",
      email: "dr.mydam@jvmmedicalservices.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z"
    },
    {
      id: "usr_student_jvm",
      email: "student@jvmmedicalservices.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-01T00:00:00Z",
      created_at: "2026-02-01T00:00:00Z"
    },
    {
      id: "usr_guest_jvm",
      email: "guest@jvmmedicalservices.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-01T00:00:00Z",
      created_at: "2026-02-01T00:00:00Z"
    }
  ],

  // 4. User Roles Mapping`;

const uStart = content.indexOf(targetUsersStart);
const uEnd = content.indexOf(targetUsersEnd);
if (uStart !== -1 && uEnd !== -1) {
  content = content.slice(0, uStart) + newUsersContent + content.slice(uEnd + targetUsersEnd.length);
}

// 3. Replace user_roles array
const targetRolesStart = "  user_roles: [";
const targetRolesEnd = "  // 5. Student Profiles";
const newRolesContent = `  user_roles: [
    { user_id: "usr_admin_jvm", role_id: "role_super_admin" },
    { user_id: "usr_admin_jvm", role_id: "role_admin" },
    { user_id: "usr_dr_mydam", role_id: "role_physician" },
    { user_id: "usr_dr_mydam", role_id: "role_mentor" },
    { user_id: "usr_dr_mydam", role_id: "role_instructor" },
    { user_id: "usr_student_jvm", role_id: "role_student" },
    { user_id: "usr_guest_jvm", role_id: "role_guest" }
  ],

  // 5. Student Profiles`;

const rStart = content.indexOf(targetRolesStart);
const rEnd = content.indexOf(targetRolesEnd);
if (rStart !== -1 && rEnd !== -1) {
  content = content.slice(0, rStart) + newRolesContent + content.slice(rEnd + targetRolesEnd.length);
}

// 4. Replace student_profiles array
const targetProfilesStart = "  student_profiles: [";
const targetProfilesEnd = "  // 6. Enrollments";
const newProfilesContent = `  student_profiles: [
    {
      user_id: "usr_admin_jvm",
      first_name: "Dr. Janardhan",
      last_name: "Mydam, MD, FAAP",
      medical_school: "Wayne State University / Cook County Health",
      country: "United States",
      graduation_year: 2000,
      usmle_stage: "Double Board Certified",
      specialty_interest: "Neonatal-Perinatal Medicine & System Administration",
      phone: "+1 (312) 555-0100",
      avatar_url: "/images/dr-janardhan-mydam.jpg",
      bio: "Chief Medical Director & Primary System Administrator for JVM Medical Services."
    },
    {
      user_id: "usr_dr_mydam",
      first_name: "Janardhan",
      last_name: "Mydam, MD, FAAP",
      medical_school: "Wayne State University / Cook County Health",
      country: "United States",
      graduation_year: 2000,
      usmle_stage: "Double Board Certified",
      specialty_interest: "Pediatrics & Neonatal-Perinatal Medicine",
      phone: "+1 (312) 555-0150",
      avatar_url: "/images/dr-janardhan-mydam.jpg",
      bio: "Attending Neonatologist, Chair of Pediatrics at Humboldt Park Health, NIH PREMOD2 Trial Investigator."
    },
    {
      user_id: "usr_student_jvm",
      first_name: "Medical",
      last_name: "Student",
      medical_school: "Windsor University School of Medicine",
      country: "United States",
      graduation_year: 2026,
      usmle_stage: "Step 2 CK Candidate",
      specialty_interest: "Pediatrics & Neonatology",
      phone: "+1 (312) 555-0199",
      avatar_url: null,
      bio: "Active medical student preparing for US pediatric clerkships, question bank training, and clinical tele-rotations."
    },
    {
      user_id: "usr_guest_jvm",
      first_name: "Guest",
      last_name: "Visitor",
      medical_school: "General Inquirer",
      country: "United States",
      graduation_year: null,
      usmle_stage: "Guest",
      specialty_interest: "Pediatric Medicine & Community Care",
      phone: "+1 (555) 000-1122",
      avatar_url: null,
      bio: "Registered community guest participating in research discussions and clinical services overview."
    }
  ],

  // 6. Enrollments`;

const pStart = content.indexOf(targetProfilesStart);
const pEnd = content.indexOf(targetProfilesEnd);
if (pStart !== -1 && pEnd !== -1) {
  content = content.slice(0, pStart) + newProfilesContent + content.slice(pEnd + targetProfilesEnd.length);
}

// 5. Replace enrollments array
const targetEnrStart = "  enrollments: [";
const targetEnrEnd = "  // 7. Specialization Tracks";
const newEnrContent = `  enrollments: [
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

const eStart = content.indexOf(targetEnrStart);
const eEnd = content.indexOf(targetEnrEnd);
if (eStart !== -1 && eEnd !== -1) {
  content = content.slice(0, eStart) + newEnrContent + content.slice(eEnd + targetEnrEnd.length);
}

// 6. Wipe questions, bookmarks, test_attempts
const targetQStart = "  // 9. Question Bank Items";
const targetQEnd = "  // 12. Clinical Rotations (Tele & Physical)";
const newQContent = `  // 9. Question Bank Items (Cleaned for fresh admin entry)
  questions: [],

  // 10. Student Bookmarks
  bookmarks: [],

  // 11. Test Attempts
  test_attempts: [],

  // 12. Clinical Rotations (Tele & Physical)`;

const qStart = content.indexOf(targetQStart);
const qEnd = content.indexOf(targetQEnd);
if (qStart !== -1 && qEnd !== -1) {
  content = content.slice(0, qStart) + newQContent + content.slice(qEnd + targetQEnd.length);
}

// 7. Wipe mock_tests
const targetMStart = "  // 26. Mock Tests\n  mock_tests: [";
const targetMEnd = "  // 27. Student Submissions";
const newMContent = `  // 26. Mock Tests (Cleaned for fresh admin entry)
  mock_tests: [],

  // 27. Student Submissions`;

const mStart = content.indexOf(targetMStart);
const mEnd = content.indexOf(targetMEnd);
if (mStart !== -1 && mEnd !== -1) {
  content = content.slice(0, mStart) + newMContent + content.slice(mEnd + targetMEnd.length);
}

// 8. Add createUser method to db if not present
if (!content.includes("async createUser(")) {
  const dbStart = "export const db = {";
  const createUserMethod = `export const db = {
  async createUser({ id, email, password_hash, full_name, role = "student", phone = "", resume_url = "", description = "", specialty = "" }) {
    const cleanEmail = (email || "").toLowerCase().trim();
    const newUser = {
      id: id || \`usr_\${Date.now()}_\${Math.random().toString(36).slice(2, 6)}\`,
      email: cleanEmail,
      password_hash: password_hash || PASS_HASH,
      status: "active",
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    if (!memoryStore.users) memoryStore.users = [];
    memoryStore.users.push(newUser);

    const roleName = role === "guest" ? "guest" : "student";
    const roleId = roleName === "guest" ? "role_guest" : "role_student";
    if (!memoryStore.user_roles) memoryStore.user_roles = [];
    memoryStore.user_roles.push({ user_id: newUser.id, role_id: roleId });

    const nameParts = (full_name || "").trim().split(" ");
    const firstName = nameParts[0] || (roleName === "guest" ? "Guest" : "Student");
    const lastName = nameParts.slice(1).join(" ") || "";

    const profile = {
      user_id: newUser.id,
      first_name: firstName,
      last_name: lastName,
      medical_school: roleName === "guest" ? "General Community Visitor" : (specialty || "Medical Candidate"),
      country: "United States",
      graduation_year: roleName === "guest" ? null : 2026,
      usmle_stage: roleName === "guest" ? "N/A" : "Candidate",
      specialty_interest: specialty || (roleName === "guest" ? "Pediatric Medicine" : "Pediatrics & Neonatology"),
      phone: phone || "",
      resume_url: resume_url || "",
      avatar_url: null,
      bio: description || (roleName === "guest" ? "Community guest user." : "Enrolled student.")
    };
    if (!memoryStore.student_profiles) memoryStore.student_profiles = [];
    memoryStore.student_profiles.push(profile);

    if (roleName === "student") {
      if (!memoryStore.enrollments) memoryStore.enrollments = [];
      const defaultProgs = ["prog_tele_rotation", "prog_qbank", "prog_live_learning", "prog_research"];
      for (const pId of defaultProgs) {
        memoryStore.enrollments.push({
          id: \`enr_\${newUser.id}_\${pId}\`,
          student_id: newUser.id,
          program_id: pId,
          plan: "Full Access",
          access_start_date: new Date().toISOString(),
          access_expiry_date: new Date(Date.now() + 365 * 86400000).toISOString(),
          enrollment_status: "Active",
          payment_status: "Paid",
          created_at: new Date().toISOString(),
          program_specific_data: {}
        });
      }
    }

    const p = getPool();
    if (p) {
      try {
        await p.query(
          "INSERT INTO users (id, email, password_hash, status, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (email) DO NOTHING",
          [newUser.id, cleanEmail, newUser.password_hash, "active"]
        );
      } catch (err) {
        console.warn("Neon user insert notice:", err.message);
      }
    }

    return { ...newUser, full_name, role: roleName, specialty: profile.specialty_interest, phone, resume_url, description };
  },
`;
  content = content.replace(dbStart, createUserMethod);
}

// 9. Update rotation_meetings student_id to usr_student_jvm instead of usr_student_a
content = content.replaceAll('"usr_student_a"', '"usr_student_jvm"');

fs.writeFileSync("lib/db.js", content, "utf8");
console.log("Successfully cleaned lib/db.js!");
