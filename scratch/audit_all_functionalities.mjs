async function runComprehensiveAudit() {
  console.log("==================================================================");
  console.log("  COMPREHENSIVE AUDIT: ADMIN PANEL, PUBLIC PAGES & STUDENT PORTAL ");
  console.log("==================================================================");

  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, url, options = {}) {
    try {
      const res = await fetch(url, options);
      const isHtml = res.headers.get("content-type")?.includes("text/html");
      const isJson = res.headers.get("content-type")?.includes("application/json");

      let bodySummary = "";
      if (isJson) {
        const json = await res.json();
        bodySummary = `JSON (${Object.keys(json).length} keys: ${Object.keys(json).slice(0, 4).join(", ")})`;
      } else if (isHtml) {
        const text = await res.text();
        bodySummary = `HTML (${text.length} bytes)`;
      }

      if (res.status >= 200 && res.status < 400) {
        console.log(`  ✓ [${res.status}] ${name.padEnd(42)} -> ${bodySummary}`);
        passed++;
        return true;
      } else {
        console.log(`  ✗ [${res.status}] ${name.padEnd(42)} -> Failed`);
        failed++;
        return false;
      }
    } catch (e) {
      console.log(`  ✗ [ERR] ${name.padEnd(42)} -> ${e.message}`);
      failed++;
      return false;
    }
  }

  // A. AUTH TOKENS FOR TESTING
  console.log("\n[SECTION 1: AUTHENTICATION TOKENS]");
  // Admin login
  const adminLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@jvmmedicalservices.com", password: "Admin@2026" })
  });
  const adminCookie = adminLoginRes.headers.get("set-cookie") || "";
  console.log("  Admin Login Status:", adminLoginRes.status, "| Cookie received:", !!adminCookie);

  // Student login
  const studentLoginRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "student@jvmmedicalservices.com", password: "Student@2026" })
  });
  const studentCookie = studentLoginRes.headers.get("set-cookie") || "";
  console.log("  Student Login Status:", studentLoginRes.status, "| Cookie received:", !!studentCookie);

  const adminHeaders = { Cookie: adminCookie };
  const studentHeaders = { Cookie: studentCookie };

  // B. PUBLIC PAGES
  console.log("\n[SECTION 2: PUBLIC MARKETING & CONTENT PAGES]");
  await testEndpoint("Public: Home Page", "http://localhost:3000/");
  await testEndpoint("Public: About Main Page", "http://localhost:3000/about");
  await testEndpoint("Public: About Doctor (Dr. Mydam)", "http://localhost:3000/about/doctor");
  await testEndpoint("Public: About Company", "http://localhost:3000/about/company");
  await testEndpoint("Public: Doctor Portfolio", "http://localhost:3000/doctor-portfolio");
  await testEndpoint("Public: Clinical Services", "http://localhost:3000/clinical-services");
  await testEndpoint("Public: Education & Training", "http://localhost:3000/education-training");
  await testEndpoint("Public: Research Hub", "http://localhost:3000/research");
  await testEndpoint("Public: Question Banks Explorer", "http://localhost:3000/question-banks");
  await testEndpoint("Public: Community Impact", "http://localhost:3000/community-impact");
  await testEndpoint("Public: Testimonials", "http://localhost:3000/testimonials");
  await testEndpoint("Public: Contact & Booking", "http://localhost:3000/contact");

  // C. PUBLIC & STUDENT RESEARCH APIS
  console.log("\n[SECTION 3: PUBLIC / SHARED APIS]");
  await testEndpoint("API: Global Research Discussions", "http://localhost:3000/api/research/discussions");
  await testEndpoint("API: Question Banks Listing", "http://localhost:3000/api/questions");
  await testEndpoint("API: Mock Exams Listing", "http://localhost:3000/api/tests");
  await testEndpoint("API: Live Classes Schedule", "http://localhost:3000/api/classes");
  await testEndpoint("API: Disclaimers", "http://localhost:3000/api/disclaimers");
  await testEndpoint("API: Marketing & Promos", "http://localhost:3000/api/marketing");

  // D. STUDENT PORTAL PAGES & APIS
  console.log("\n[SECTION 4: STUDENT PORTAL (LOGGED IN AS STUDENT)]");
  await testEndpoint("Student: Dashboard UI", "http://localhost:3000/student/dashboard", { headers: studentHeaders });
  await testEndpoint("Student: Dashboard API", "http://localhost:3000/api/student/dashboard", { headers: studentHeaders });
  await testEndpoint("Student: Rotations UI", "http://localhost:3000/student/rotations", { headers: studentHeaders });
  await testEndpoint("Student: Rotations API", "http://localhost:3000/api/student/rotations", { headers: studentHeaders });
  await testEndpoint("Student: QBank UI", "http://localhost:3000/student/qbank", { headers: studentHeaders });
  await testEndpoint("Student: QBank API", "http://localhost:3000/api/student/qbank", { headers: studentHeaders });
  await testEndpoint("Student: Live Learning UI", "http://localhost:3000/student/live-learning", { headers: studentHeaders });
  await testEndpoint("Student: Live Learning API", "http://localhost:3000/api/student/live-learning", { headers: studentHeaders });
  await testEndpoint("Student: Research Mentorship UI", "http://localhost:3000/student/research", { headers: studentHeaders });
  await testEndpoint("Student: Research Mentorship API", "http://localhost:3000/api/student/research", { headers: studentHeaders });
  await testEndpoint("Student: Documents Vault UI", "http://localhost:3000/student/documents", { headers: studentHeaders });
  await testEndpoint("Student: Documents API", "http://localhost:3000/api/student/documents", { headers: studentHeaders });
  await testEndpoint("Student: Certificates UI", "http://localhost:3000/student/certificates", { headers: studentHeaders });
  await testEndpoint("Student: Profile UI", "http://localhost:3000/student/profile", { headers: studentHeaders });
  await testEndpoint("Student: Profile API", "http://localhost:3000/api/student/profile", { headers: studentHeaders });
  await testEndpoint("Student: Support & Helpdesk UI", "http://localhost:3000/student/support", { headers: studentHeaders });
  await testEndpoint("Student: Support API", "http://localhost:3000/api/student/support", { headers: studentHeaders });

  // E. ADMIN PANEL PAGES & APIS
  console.log("\n[SECTION 5: ADMIN PORTAL (LOGGED IN AS DOCTOR / SUPER ADMIN)]");
  await testEndpoint("Admin: Dashboard Overview UI", "http://localhost:3000/admin", { headers: adminHeaders });
  await testEndpoint("Admin: Reports & KPIs API", "http://localhost:3000/api/admin/reports", { headers: adminHeaders });
  await testEndpoint("Admin: Research Hub UI", "http://localhost:3000/admin/research", { headers: adminHeaders });
  await testEndpoint("Admin: Research Applications API", "http://localhost:3000/api/admin/research/applications", { headers: adminHeaders });
  await testEndpoint("Admin: Research Groups API", "http://localhost:3000/api/admin/research/groups", { headers: adminHeaders });
  await testEndpoint("Admin: Tele-Rotations Pipeline UI", "http://localhost:3000/admin/rotations", { headers: adminHeaders });
  await testEndpoint("Admin: Tele-Rotations API", "http://localhost:3000/api/admin/rotations", { headers: adminHeaders });
  await testEndpoint("Admin: Live Classes UI", "http://localhost:3000/admin/classes", { headers: adminHeaders });
  await testEndpoint("Admin: Question Bank CMS UI", "http://localhost:3000/admin/tests", { headers: adminHeaders });
  await testEndpoint("Admin: Sub-Admins & 2FA Controls UI", "http://localhost:3000/admin/subadmins", { headers: adminHeaders });
  await testEndpoint("Admin: Sub-Admins API", "http://localhost:3000/api/admin/subadmins", { headers: adminHeaders });
  await testEndpoint("Admin: Emergency Maintenance UI", "http://localhost:3000/admin/emergency", { headers: adminHeaders });
  await testEndpoint("Admin: Emergency API", "http://localhost:3000/api/emergency", { headers: adminHeaders });
  await testEndpoint("Admin: Students Directory UI", "http://localhost:3000/admin/students", { headers: adminHeaders });
  await testEndpoint("Admin: Students API", "http://localhost:3000/api/admin/students", { headers: adminHeaders });
  await testEndpoint("Admin: Enrollments Manager UI", "http://localhost:3000/admin/enrollments", { headers: adminHeaders });
  await testEndpoint("Admin: Enrollments API", "http://localhost:3000/api/admin/enrollments", { headers: adminHeaders });
  await testEndpoint("Admin: Documents Queue UI", "http://localhost:3000/admin/documents", { headers: adminHeaders });
  await testEndpoint("Admin: Documents API", "http://localhost:3000/api/admin/documents", { headers: adminHeaders });
  await testEndpoint("Admin: Student Submissions UI", "http://localhost:3000/admin/submissions", { headers: adminHeaders });
  await testEndpoint("Admin: Assignments API", "http://localhost:3000/api/assignments", { headers: adminHeaders });
  await testEndpoint("Admin: Programs CMS UI", "http://localhost:3000/admin/programs", { headers: adminHeaders });
  await testEndpoint("Admin: Site Content CMS UI", "http://localhost:3000/admin/content", { headers: adminHeaders });
  await testEndpoint("Admin: About Dr. Mydam CMS UI", "http://localhost:3000/admin/about", { headers: adminHeaders });
  await testEndpoint("Admin: Section Disclaimers CMS UI", "http://localhost:3000/admin/disclaimers", { headers: adminHeaders });
  await testEndpoint("Admin: Marketing & Promos UI", "http://localhost:3000/admin/marketing", { headers: adminHeaders });
  await testEndpoint("Admin: Consultation Requests UI", "http://localhost:3000/admin/requests", { headers: adminHeaders });

  // F. INTERACTIVE POST / UPDATE ACTIONS
  console.log("\n[SECTION 6: INTERACTIVE MUTATION ACTIONS]");

  // 1. Post a new research discussion
  const postDiscRes = await fetch("http://localhost:3000/api/research/discussions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Interactive Audit: Biomarkers in Neonatal Encephalopathy",
      author_name: "Dr. Audit Tester",
      author_role: "Pediatric Fellow",
      author_email: "audit@example.com",
      category: "Neonatology",
      content: "Evaluating serum S100B and NSE as early surrogate markers for MRI injury patterns.",
      tags: ["Biomarkers", "Neonatal"]
    })
  });
  console.log("  Action: Post Research Discussion -> Status:", postDiscRes.status);

  // 2. Post a reply to research discussion
  const replyRes = await fetch("http://localhost:3000/api/research/discussions/disc_1/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author_name: "Dr. Janardhan Mydam, MD, FAAP",
      author_role: "Chief Medical Director",
      content: "Serum S100B peaking at 24-48 hours correlates strongly with deep gray matter injury."
    })
  });
  console.log("  Action: Post Reply to Discussion -> Status:", replyRes.status);

  // 3. Post a message to research group chat
  const chatRes = await fetch("http://localhost:3000/api/admin/research/groups/grp_res_1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender_name: "Medical Student",
      sender_role: "Researcher",
      content: "Updated data collection sheet uploaded to the cohort drive folder."
    })
  });
  console.log("  Action: Send Message to Research Group -> Status:", chatRes.status);

  // 4. Create a new question in Question Bank
  const addQuestionRes = await fetch("http://localhost:3000/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: "Neonatology",
      module: "Neonatal Resuscitation Program (NRP)",
      system: "Cardiopulmonary",
      exam: "USMLE Step 2 CK",
      level: 2,
      stem: "A full-term male newborn is apneic and limp after delivery. Drying and stimulation for 30 seconds fail to elicit spontaneous breathing. Heart rate is 84 beats/min. What is the most appropriate next step according to NRP 8th Edition?",
      options: [
        "Administer blow-by 100% oxygen via face mask",
        "Initiate positive pressure ventilation (PPV) with room air (21% O2) at 40-60 breaths/min",
        "Immediately perform chest compressions at 3:1 compression-to-ventilation ratio",
        "Administer intravenous epinephrine 0.02 mg/kg via umbilical venous catheter"
      ],
      correct_index: 1,
      explanation_correct: "Correct: According to NRP 8th Edition guidelines, if an infant remains apneic, gasping, or has a heart rate < 100 bpm after initial drying and stimulation, positive pressure ventilation (PPV) must be initiated immediately within the 'Golden Minute' using room air (21% O2 for >=35 weeks). Chest compressions are only indicated if heart rate remains < 60 bpm after 30 seconds of effective PPV.",
      explanation_incorrect: "Distractor Rationale: Compressions are premature; blow-by oxygen does not provide ventilation; epinephrine is reserved for persistent HR < 60 bpm despite compressions."
    })
  });
  console.log("  Action: Add New Question in QBank CMS -> Status:", addQuestionRes.status);

  console.log("\n==================================================================");
  console.log(`  AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");
}

runComprehensiveAudit().catch(console.error);
