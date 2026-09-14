async function runTests() {
  console.log("=== VERIFYING CLEAN SYSTEM & 3 TEST ACCOUNTS ===");

  // 1. Check memoryStore state directly
  const { memoryStore, db } = await import("../lib/db.js");
  console.log("\n1. Data Store Status:");
  console.log("   - Questions count:", memoryStore.questions.length);
  console.log("   - Mock tests count:", memoryStore.mock_tests.length);
  console.log("   - Submissions count:", memoryStore.submissions.length);
  console.log("   - Registered accounts:", memoryStore.users.map(u => u.email));

  if (memoryStore.questions.length !== 0 || memoryStore.mock_tests.length !== 0) {
    throw new Error("Question banks still contain test data!");
  }

  // 2. Test Login API endpoint for all 3 credentials
  const { POST: loginPOST } = await import("../app/api/auth/login/route.js");

  // Test Student Login
  const studentReq = new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "student@jvmmedicalservices.com",
      password: "Student@2026",
    }),
  });
  const studentRes = await loginPOST(studentReq);
  const studentData = await studentRes.json();
  console.log("\n2. Student Login Test:");
  console.log("   - Status:", studentRes.status);
  console.log("   - Role:", studentData.user?.role);
  console.log("   - Requires 2FA:", !!studentData.requires2FA);
  if (studentRes.status !== 200 || studentData.user?.role !== "student") {
    throw new Error("Student login failed!");
  }

  // Test Guest Login
  const guestReq = new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "guest@jvmmedicalservices.com",
      password: "Guest@2026",
    }),
  });
  const guestRes = await loginPOST(guestReq);
  const guestData = await guestRes.json();
  console.log("\n3. Guest Login Test:");
  console.log("   - Status:", guestRes.status);
  console.log("   - Role:", guestData.user?.role);
  if (guestRes.status !== 200 || guestData.user?.role !== "guest") {
    throw new Error("Guest login failed!");
  }

  // Test Admin Login (direct access without 2FA barrier)
  const adminReq = new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@jvmmedicalservices.com",
      password: "Admin@2026",
    }),
  });
  const adminRes = await loginPOST(adminReq);
  const adminData = await adminRes.json();
  console.log("\n4. Admin Login Test:");
  console.log("   - Status:", adminRes.status);
  console.log("   - Role:", adminData.user?.role);
  console.log("   - Requires 2FA:", !!adminData.requires2FA);
  if (adminRes.status !== 200 || !adminData.user?.role.includes("admin")) {
    throw new Error("Admin login failed!");
  }

  // 3. Test Student & Guest Signup API
  const { POST: signupPOST } = await import("../app/api/auth/signup/route.js");
  const testNewStudentEmail = `newstudent_${Date.now()}@example.com`;
  const signupReq = new Request("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "student",
      full_name: "Rohith Reddy",
      email: testNewStudentEmail,
      password: "Password@123",
      phone: "9876543210",
      country_code: "+91",
      resume_url: "https://drive.google.com/test-resume.pdf",
      description: "Final year medical student aspiring for Pediatric Residency Match",
      medical_school: "Windsor University School of Medicine"
    }),
  });
  const signupRes = await signupPOST(signupReq);
  const signupData = await signupRes.json();
  console.log("\n5. New Student Onboarding Flow Test:");
  console.log("   - Status:", signupRes.status);
  console.log("   - User ID:", signupData.user?.id);
  console.log("   - Name:", signupData.user?.name);
  console.log("   - Role:", signupData.user?.role);
  if (signupRes.status !== 200 || signupData.user?.role !== "student") {
    throw new Error("Signup flow failed!");
  }

  // Check saved profile
  const savedProfile = await db.getStudentProfile(signupData.user?.id);
  console.log("   - Stored Phone with Country Code:", savedProfile?.phone);
  console.log("   - Stored Resume:", savedProfile?.resume_url);
  console.log("   - Stored Bio:", savedProfile?.bio);
  if (savedProfile?.phone !== "+91 9876543210") {
    throw new Error("Country code phone was not properly saved!");
  }

  // 4. Verify no /admin exposed in Footer.js or student layout
  const fs = await import("fs");
  const footerContent = fs.readFileSync("components/Footer.js", "utf8");
  const studentLayoutContent = fs.readFileSync("app/student/layout.js", "utf8");
  
  const footerHasAdmin = footerContent.includes('href="/admin"');
  const layoutHasAdmin = studentLayoutContent.includes('href="/admin"');
  console.log("\n6. Admin Link Redirection Verification:");
  console.log("   - Footer exposes /admin link:", footerHasAdmin);
  console.log("   - Student Layout exposes /admin link:", layoutHasAdmin);

  if (footerHasAdmin || layoutHasAdmin) {
    throw new Error("Admin portal link still leaked in public/student views!");
  }

  console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY! The portal is completely clean, test accounts are ready, and admin portal is completely hidden from public & student eyes.");
}

runTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
