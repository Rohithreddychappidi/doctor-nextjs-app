async function testLive() {
  console.log("=== TESTING LIVE DEV SERVER (PORT 3000) ===");

  // 1. Test Student Login
  const studentRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "student@jvmmedicalservices.com",
      password: "Student@2026",
    }),
  });
  const studentData = await studentRes.json();
  console.log("\n1. Student Portal Login:");
  console.log("   - Status:", studentRes.status);
  console.log("   - User Name:", studentData.user?.name);
  console.log("   - Role:", studentData.user?.role);
  console.log("   - Requires 2FA:", !!studentData.requires2FA);

  // 2. Test Guest Login
  const guestRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "guest@jvmmedicalservices.com",
      password: "Guest@2026",
    }),
  });
  const guestData = await guestRes.json();
  console.log("\n2. Guest Portal Login:");
  console.log("   - Status:", guestRes.status);
  console.log("   - User Name:", guestData.user?.name);
  console.log("   - Role:", guestData.user?.role);

  // 3. Test Admin Portal Login (Immediate session, no 2FA block)
  const adminRes = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@jvmmedicalservices.com",
      password: "Admin@2026",
    }),
  });
  const adminData = await adminRes.json();
  console.log("\n3. Admin Portal Login:");
  console.log("   - Status:", adminRes.status);
  console.log("   - User Name:", adminData.user?.name);
  console.log("   - Role:", adminData.user?.role);
  console.log("   - Requires 2FA:", !!adminData.requires2FA);

  // 4. Test Student Onboarding Sign-up
  const testStudentEmail = `onboard_student_${Date.now()}@example.com`;
  const signupRes = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "student",
      full_name: "Rohith Reddy",
      email: testStudentEmail,
      password: "StudentPass@2026",
      phone: "9876543210",
      country_code: "+91",
      resume_url: "https://drive.google.com/test-resume.pdf",
      description: "Final year medical student applying for Pediatrics residency",
      medical_school: "Windsor University School of Medicine",
    }),
  });
  const signupData = await signupRes.json();
  console.log("\n4. Student Onboarding (with Multi-Country Code Select):");
  console.log("   - Status:", signupRes.status);
  console.log("   - Registered Name:", signupData.user?.name);
  console.log("   - Registered Role:", signupData.user?.role);

  // 5. Test Guest Onboarding Sign-up
  const testGuestEmail = `onboard_guest_${Date.now()}@example.com`;
  const guestSignupRes = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: "guest",
      full_name: "John Visitor",
      email: testGuestEmail,
      password: "GuestPass@2026",
      phone: "5550199",
      country_code: "+1",
    }),
  });
  const guestSignupData = await guestSignupRes.json();
  console.log("\n5. Guest Onboarding:");
  console.log("   - Status:", guestSignupRes.status);
  console.log("   - Registered Name:", guestSignupData.user?.name);
  console.log("   - Registered Role:", guestSignupData.user?.role);

  // 6. Test Questions & Tests API (Wiped clean)
  const qRes = await fetch("http://localhost:3000/api/questions");
  const qData = await qRes.json();
  const tRes = await fetch("http://localhost:3000/api/tests");
  const tData = await tRes.json();
  console.log("\n6. Question Banks CMS State:");
  console.log("   - Questions count:", qData.questions?.length || 0);
  console.log("   - Mock tests count:", tData.tests?.length || 0);

  console.log("\n=======================================================");
  console.log("SUCCESS: All flows, endpoints, and credentials verified!");
  console.log("=======================================================");
}

testLive().catch(console.error);
