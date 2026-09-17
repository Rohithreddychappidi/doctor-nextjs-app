import fs from "fs";
import path from "path";

const rootDir = process.cwd();

console.log("==================================================================");
console.log("  PUBLIC SITE & ADMIN CMS VERIFICATION TEST SUITE");
console.log("==================================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

// 1. Verify Navbar.js
console.log("--- 1. Testing Navbar Brand, Dropdown & Navigation Structure ---");
const navbarPath = path.join(rootDir, "components/Navbar.js");
const navbarContent = fs.readFileSync(navbarPath, "utf-8");

assert(navbarContent.includes("JVM Medical Services"), "Navbar includes professional brand name 'JVM Medical Services'");
assert(navbarContent.includes("Dr. Janardhan Mydam"), "Navbar brand includes Dr. Janardhan Mydam credentials subtitle");
assert(navbarContent.includes("href: \"/education-training\"") && navbarContent.includes("isDropdown: true"), "Education & Training has an interactive dropdown");
assert(navbarContent.includes("Live Clinical Classes & Seminars"), "Education dropdown includes 'Live Clinical Classes & Seminars'");
assert(navbarContent.includes("Virtual NICU & Tele-Rotations"), "Education dropdown includes 'Virtual NICU & Tele-Rotations'");
assert(navbarContent.includes("Clinical Question Banks"), "Education dropdown includes 'Clinical Question Banks'");
assert(navbarContent.includes("Research Mentorship & Publications"), "Education dropdown includes 'Research Mentorship & Publications'");
assert(navbarContent.includes("General Consultation"), "Navbar includes 'General Consultation' link");
assert(!navbarContent.includes('{ key: "question-banks", label: "Question Banks"'), "Standalone 'Question Banks' removed from root navbar items");
assert(!navbarContent.includes('{ key: "research", label: "Research"'), "Standalone 'Research' removed from root navbar items");
assert(navbarContent.includes("Book Consultation"), "Navbar action button includes 'Book Consultation'");

// 2. Verify Zero-Pricing on Public Education Pages
console.log("\n--- 2. Testing Strict Zero-Pricing Display on Education Pages ---");
const eduRoot = fs.readFileSync(path.join(rootDir, "app/education-training/page.js"), "utf-8");
assert(!eduRoot.includes("$1,200") && !eduRoot.includes("priceDisplay"), "Education & Training root does not display dollar amounts or price badges");
assert(eduRoot.includes("/student-login") || eduRoot.includes("/student"), "Education & Training root links to student portal");

const telePage = fs.readFileSync(path.join(rootDir, "app/education-training/tele-rotations/page.js"), "utf-8");
assert(!telePage.includes("$1,200"), "Tele-rotations page does not display $1,200 fee");
assert(telePage.includes("/student/rotations"), "Tele-rotations page CTAs direct to /student/rotations");

const meetingCard = fs.readFileSync(path.join(rootDir, "components/MeetingCard.js"), "utf-8");
assert(!meetingCard.includes("PAID · $"), "MeetingCard does not display 'PAID · $' badges");

// 3. Verify General Consultation Page & Route
console.log("\n--- 3. Testing General Consultation Page & API Route ---");
const consultPage = fs.readFileSync(path.join(rootDir, "app/consultation/page.js"), "utf-8");
assert(consultPage.includes("Dr. Janardhan Mydam"), "Consultation page features Dr. Janardhan Mydam");
assert(consultPage.includes("cv_url"), "Consultation page collects candidate CV link");
assert(consultPage.includes("/api/consultation"), "Consultation page posts to /api/consultation");

const consultRoute = fs.readFileSync(path.join(rootDir, "app/api/consultation/route.js"), "utf-8");
assert(consultRoute.includes("export async function GET"), "API /api/consultation supports GET");
assert(consultRoute.includes("export async function POST"), "API /api/consultation supports POST");
assert(consultRoute.includes("export async function PATCH"), "API /api/consultation supports PATCH for scheduling");

// 4. Verify Admin Consultation Manager
console.log("\n--- 4. Testing Admin Requests & Consultation Manager ---");
const adminReq = fs.readFileSync(path.join(rootDir, "app/admin/requests/page.js"), "utf-8");
assert(adminReq.includes("fetchConsultations") || adminReq.includes("/api/consultation"), "Admin Requests page fetches from /api/consultation");
assert(adminReq.includes("Schedule Consultation Call"), "Admin Requests includes interactive call scheduler");
assert(adminReq.includes("meetingLink") || adminReq.includes("meeting_link"), "Admin Requests supports video meeting link generation");
assert(adminReq.includes("cv_url"), "Admin Requests displays candidate CV / portfolio link");

// 5. Verify Complete Site Content CMS in Admin Panel
console.log("\n--- 5. Testing Complete Site Content CMS for All Navbar Sections ---");
const adminContent = fs.readFileSync(path.join(rootDir, "app/admin/content/page.js"), "utf-8");
assert(adminContent.includes("1. Home Page"), "CMS includes Home Page");
assert(adminContent.includes("2. About Dr. Mydam & Company"), "CMS includes About Dr. Mydam & Company");
assert(adminContent.includes("3. Education & Training"), "CMS includes Education & Training");
assert(adminContent.includes("3.1 Live Clinical Classes"), "CMS includes Live Clinical Classes");
assert(adminContent.includes("3.2 Virtual NICU & Tele-Rotations"), "CMS includes Virtual Tele-Rotations");
assert(adminContent.includes("3.3 Clinical Question Banks"), "CMS includes Question Banks");
assert(adminContent.includes("3.4 Research Mentorship & Publications"), "CMS includes Research Mentorship");
assert(adminContent.includes("4. Clinical Guidance"), "CMS includes Clinical Guidance");
assert(adminContent.includes("5. Newborn Care Programs"), "CMS includes Newborn Care Programs");
assert(adminContent.includes("6. Community Health"), "CMS includes Community Health");
assert(adminContent.includes("7. General Consultation"), "CMS includes General Consultation");
assert(adminContent.includes("8. Contact & Online Inquiries"), "CMS includes Contact");

// 6. Verify Mobile View CSS Grid
console.log("\n--- 6. Testing Mobile View Responsive CSS ---");
const globalsCss = fs.readFileSync(path.join(rootDir, "app/globals.css"), "utf-8");
assert(globalsCss.includes(".clinical-gallery-grid"), "globals.css defines .clinical-gallery-grid");
assert(globalsCss.includes("repeat(2, minmax(0, 1fr))"), "globals.css enforces side-by-side 2-column mobile cards");

console.log("\n==================================================================");
console.log(`  FINAL RESULT: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
console.log("==================================================================");

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
