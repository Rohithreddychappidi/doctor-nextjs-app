// Default/dummy data for the front-end prototype.
// Everything here is placeholder content — real doctor bio, photos,
// exact numbers, meetings, and testimonials will be supplied by the
// client later and swapped in via /admin.
//
// ARCHITECTURE: this file is the single source of truth for every
// piece of editable text and structured content on the site. It is
// loaded into DataContext as the initial state, and every field here
// has a corresponding editor somewhere under /admin — see
// app/admin/content/page.js for the generic editors and
// components/RepeatingList.js for the reusable add/edit/delete UI
// used for every array of items (accordion entries, curriculum rows,
// question bank topics, service cards, etc.).
//
// Nothing on the public site should read a hardcoded string directly
// from a page component — it should come from this object via
// useSiteData().content.<pageKey>.<field>, so that editing it in
// /admin actually changes what visitors see.

export const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "education", label: "Education & Training", href: "/education-training" },
  { key: "clinical", label: "Clinical Services", href: "/clinical-services" },
  { key: "advisory", label: "Advisory Services", href: "/advisory-services" },
  { key: "research", label: "Research", href: "/research" },
  { key: "community", label: "Community Impact", href: "/community-impact" },
  { key: "testimonials", label: "Testimonials", href: "/testimonials" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export const DEFAULT_STATS = {
  studentsHelped: 900,
  consultationsGiven: 1450,
  hospitalsWorked: 6,
  researchesPublished: 40,
};

export const DEFAULT_MEETINGS = [
  {
    id: "m1",
    title: "Neonatal Case Review — Live Group Session",
    description: "A weekly live walkthrough of real (de-identified) neonatal cases, open to students following the mentorship track.",
    price: 0,
    isFree: true,
    date: "Every Tuesday · 7:00 PM IST",
    imageUrl: "",
    joinLink: "",
  },
  {
    id: "m2",
    title: "Pediatric Step 2 CK Strategy Workshop",
    description: "A focused, small-group workshop on approaching pediatric vignettes for Step 2 CK — includes a practice set and Q&A.",
    price: 25,
    isFree: false,
    date: "First Saturday of the month · 10:00 AM IST",
    imageUrl: "",
    joinLink: "",
  },
  {
    id: "m3",
    title: "OSCE Practice Session — Newborn Counseling",
    description: "Small-group OSCE practice on feeding, jaundice, safe sleep, and follow-up counseling, with structured feedback.",
    price: 0,
    isFree: true,
    date: "Every other Thursday · 6:00 PM IST",
    imageUrl: "",
    joinLink: "",
  },
  {
    id: "m4",
    title: "1:1 Mentorship Session",
    description: "A one-on-one video session for personalized guidance on rotations, research, or residency applications.",
    price: 40,
    isFree: false,
    date: "By request — flexible scheduling",
    imageUrl: "",
    joinLink: "",
  },
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: "t1",
    quote: "Placeholder testimonial — a student or mentee's real quote will go here once shared by the client.",
    name: "Student Name",
    role: "Medical Student, Class of 2027",
  },
  {
    id: "t2",
    quote: "Placeholder testimonial — a second real quote will replace this once available.",
    name: "Student Name",
    role: "IMG, Residency Applicant",
  },
  {
    id: "t3",
    quote: "Placeholder testimonial — a third real quote will replace this once available.",
    name: "Student Name",
    role: "Tele-Rotation Participant",
  },
];

export const CONTACT_CATEGORIES = [
  "Education & Training",
  "Clinical Services",
  "Advisory Services",
  "Research",
  "Community Impact",
  "General Inquiry",
];

export const DEFAULT_REQUESTS = [
  { id: "r1", name: "Aiden Cole", contact: "aiden@example.com", reason: "Education & Training — tele-rotation interest", preferredTime: "Weekday evenings, IST", submitted: "Aug 24, 2026", status: "new", notes: "First-time contact, 3rd-year medical student." },
  { id: "r2", name: "Priya Nair", contact: "priya@example.com", reason: "Research — pediatric study opportunity", preferredTime: "Flexible", submitted: "Aug 23, 2026", status: "progress", notes: "Interested in joining an ongoing NICU outcomes study." },
  { id: "r3", name: "Marcus Odiaka", contact: "marcus@example.com", reason: "Education & Training — tele-rotation application", preferredTime: "Weekend mornings", submitted: "Aug 22, 2026", status: "done", notes: "Confirmed for the next Tele-Rotation cohort." },
];

// ---------------------------------------------------------------------
// DEFAULT_CONTENT — every editable text block and structured list on
// the site, organized by page. See the architecture note at the top
// of this file.
// ---------------------------------------------------------------------
export const DEFAULT_CONTENT = {
  home: {
    bannerSlides: [
      { tag: "Free Consultations · Phone Call Based", heading: "From India, to students and families everywhere.", body: "Every consultation is free. This site is our record book — a way to track and share how many people we've been able to help, one phone call at a time.", ctaLabel: "Request a Free Consultation" },
      { tag: "Neonatology & Pediatrics", heading: "Mentorship focused on one thing, done well.", body: "Research, rotations and question bank content are all built around neonatology and pediatrics — not a general catalog.", ctaLabel: "See Research Opportunities" },
      { tag: "Support the Work", heading: "Help keep this practice free for the next student.", body: "Donations go toward website maintenance, mentorship resources and keeping every consultation free of charge.", ctaLabel: "See Community Impact" },
    ],
    offersEyebrow: "What this practice offers",
    offersHeading: "One free practice, built around students, families & institutions",
    offersSubtext: "Every patient consultation is free. What you see here is our record — of who we've helped, and how — not a paywall.",
    cards: [
      { heading: "About", body: "Mission, credentials, leadership, teaching, and research — organized so you can explore exactly what interests you." },
      { heading: "Education & Training", body: "Live Learning, Question Banks, Tele-Rotations, and Physical Rotations — all in one hub." },
      { heading: "Clinical Services", body: "Free phone consultations for students and families — no cost, no obligation." },
      { heading: "Research", body: "Neonatology and pediatrics research only — ongoing studies students can join." },
      { heading: "Advisory Services", body: "NICU development and curriculum design guidance for hospitals and educational institutions." },
      { heading: "Community Impact", body: "Outreach, volunteer opportunities, and partnerships — from India to the world." },
    ],
    liveLearningEyebrow: "Education & Training · Live Learning",
    liveLearningHeading: "Join a live session",
    promoHeading: "Help keep this practice free",
    promoBody: "Community support covers website maintenance and program resources — not the doctor's time, which is given freely.",
    testimonialsEyebrow: "Testimonials",
    testimonialsHeading: "From students and families",
    closingEyebrow: "Ready when you are",
    closingHeading: "Request your free consultation today",
    closingBody: "Every request is logged and followed up personally by phone — no cost, no obligation.",
  },

  about: {
    eyebrow: "About",
    heading: "Dr. Doctor Name",
    tagline: "From India, to the world.",
    intro: "Neonatology & Pediatrics — mission, credentials, leadership, teaching, and research behind this practice.",
    note: "Every number below is a real record of this practice's work — click any section further down the page to see the detail behind it.",
    sections: [
      { key: "employment", label: "Employment", items: [
        { title: "Attending Neonatologist — Placeholder Hospital, City", meta: "2018 – Present", body: "Placeholder description of current clinical role, responsibilities and unit." },
        { title: "Pediatric Attending — Placeholder Hospital, City", meta: "2014 – 2018", body: "Placeholder description of prior clinical appointment." },
        { title: "Resident Physician — Placeholder Hospital, India", meta: "2010 – 2014", body: "Placeholder description of residency training." },
      ]},
      { key: "education", label: "Education", items: [
        { title: "Fellowship, Neonatal-Perinatal Medicine", meta: "Placeholder Institution", body: "Placeholder description of fellowship training and focus areas." },
        { title: "Residency, Pediatrics", meta: "Placeholder Institution", body: "Placeholder description of residency program." },
        { title: "MD", meta: "Placeholder Medical College, India", body: "Placeholder description of medical degree and honors." },
      ]},
      { key: "leadership", label: "Leadership & Teaching", items: [
        { title: "Program Director, Pediatrics & Neonatology Tele-Rotation", meta: "Ongoing", body: "Placeholder description of curriculum oversight and learner safety responsibility." },
        { title: "Faculty, Case-Based Teaching", meta: "Ongoing", body: "Placeholder description of bedside and case-conference teaching role." },
      ]},
      { key: "research", label: "Research", items: [
        { title: "Neonatal outcomes in low-resource settings", meta: "Ongoing", body: "Placeholder summary of an active research project." },
        { title: "Pediatric follow-up care protocols", meta: "Ongoing", body: "Placeholder summary of a second active research project." },
        { title: "Tele-mentorship effectiveness in rotation training", meta: "In analysis", body: "Placeholder summary of a study evaluating remote mentorship outcomes." },
      ]},
      { key: "publications", label: "Publications", items: [
        { title: "Placeholder publication title on neonatal care", meta: "Journal Name, 2025", body: "Placeholder one-line summary of the publication's findings." },
        { title: "Placeholder publication title on pediatric education", meta: "Journal Name, 2024", body: "Placeholder one-line summary of the publication's findings." },
        { title: "Placeholder publication title on mentorship outcomes", meta: "Journal Name, 2023", body: "Placeholder one-line summary of the publication's findings." },
      ]},
      { key: "helping", label: "Helping Students", items: [
        { title: "Free phone consultations", meta: "1,450+ to date", body: "Ongoing free phone consultations for students and families — the core purpose of this practice's outreach." },
        { title: "Rotation mentorship (Tele + Physical)", meta: "900+ students", body: "Structured remote and in-person rotation mentorship for medical students and IMGs, focused on neonatology and pediatrics." },
        { title: "Student co-authorship on research", meta: "22+ students", body: "Students mentored into co-authorship roles on active neonatology/pediatrics research." },
      ]},
    ],
  },

  educationTraining: {
    eyebrow: "Education & Training",
    heading: "All learning services, in one place",
    body: "Live Learning, Question Banks, Tele-Rotations, and Physical Rotations — review eligibility, schedules, and requirements, and apply or log in from here.",
    subpages: [
      { label: "Live Learning", href: "/education-training/live-learning", blurb: "Lectures, professional meetings, case discussions, workshops, and OSCE preparation — all on one platform." },
      { label: "Question Banks", href: "/education-training/question-banks", blurb: "Structured questions for shelf exams, USMLE, pediatrics boards, and neonatology boards, organized by topic." },
      { label: "Tele-Rotations", href: "/education-training/tele-rotations", blurb: "A structured 6-week remote clinical learning program — cases, OSCEs, documentation, and exam preparation." },
      { label: "Physical Rotations", href: "/education-training/physical-rotations", blurb: "Institution-approved, in-person pediatric and neonatal learning experiences." },
    ],
  },

  liveLearning: {
    eyebrow: "Education & Training · Live Learning",
    heading: "Lectures, meetings, case discussions & OSCE prep",
    body: "All live sessions run on one secure platform — Zoom or Google Meet. Most sessions are free; some — like small-group workshops — carry a price set by the admin, shown clearly on each card. Live sessions are never recorded without explicit program approval and participant consent.",
  },

  questionBanks: {
    eyebrow: "Education & Training · Question Banks",
    heading: "Shelf, USMLE, pediatrics & neonatology boards — organized by topic",
    body: "Six focused topic areas, each broken into sub-topics — built around real neonatal and pediatric case presentations, mapped to the Pediatrics Shelf and USMLE Step 2 CK content outlines.",
    topics: [
      { label: "Neonatology Fundamentals", count: 180, subtopics: ["Newborn resuscitation", "Prematurity & NICU care", "Neonatal jaundice", "Feeding & growth"] },
      { label: "Pediatric Cardiology", count: 96, subtopics: ["Congenital heart disease", "Murmurs & screening", "Pediatric arrhythmias", "Cyanotic vs acyanotic lesions"] },
      { label: "Pediatric Pulmonology", count: 88, subtopics: ["Respiratory distress syndrome", "Asthma in children", "Bronchiolitis", "Cystic fibrosis basics"] },
      { label: "Growth & Development", count: 74, subtopics: ["Developmental milestones", "Failure to thrive", "Nutrition & growth charts", "Developmental red flags"] },
      { label: "Pediatric Emergency Medicine", count: 102, subtopics: ["Pediatric sepsis", "Seizures in children", "Trauma in pediatrics", "Dehydration & fluid management"] },
      { label: "Neonatal Resuscitation & NICU Procedures", count: 64, subtopics: ["NRP algorithm", "Umbilical line placement", "Surfactant administration", "Therapeutic hypothermia"] },
    ],
  },

  teleRotations: {
    eyebrow: "Education & Training · Tele-Rotations",
    heading: "A structured, 6-week remote rotation in pediatrics & neonatology",
    body: "Live teaching, case-based discussion, simulated documentation, de-identified EMR orientation, research education, and exam-focused review — built around real clinical reasoning, not passive lectures.",
    overview: {
      duration: "6 weeks (adaptable to 4–8 weeks)",
      timeCommitment: "10–12 hours weekly (approx. 60–72 hours total)",
      platform: "One secure platform — Zoom or Google Meet",
      cohortSize: "6–12 learners, for meaningful participation and feedback",
    },
    purpose: [
      "Integrate pediatric and neonatal knowledge with clinical reasoning and communication.",
      "Teach a reproducible approach to history-taking, presentation, differential diagnosis, investigation, management, counseling, and follow-up.",
      "Develop safe, concise clinical documentation and familiarity with common EMR workflows.",
      "Connect clinical cases to Pediatric Shelf and USMLE-style tested competencies.",
      "Introduce responsible research, critical appraisal, quality improvement, and scholarly presentation.",
    ],
    outcomes: [
      "Obtain an age-appropriate pediatric or neonatal history using patient-centered communication.",
      "Organize a focused virtual examination plan and identify when in-person or urgent evaluation is required.",
      "Create a prioritized problem representation, differential diagnosis, diagnostic plan, and initial management plan.",
      "Recognize common pediatric emergencies and neonatal stabilization priorities.",
      "Write a structured pediatric admission note, progress note, newborn note, NICU progress note, and discharge summary.",
      "Apply examination strategies to Pediatrics Shelf and USMLE-style vignettes.",
      "Maintain privacy, professionalism, scope-of-role boundaries, and appropriate escalation.",
    ],
    schedule: [
      { week: "Week 1", focus: "Orientation; well child; growth, development, prevention; normal newborn", products: "Baseline quiz; pediatric history OSCE; EMR foundations", sessionDate: "", joinLink: "" },
      { week: "Week 2", focus: "Fever/infection; respiratory disease; neonatal sepsis and respiratory distress", products: "Case discussions; pediatric H&P", sessionDate: "", joinLink: "" },
      { week: "Week 3", focus: "GI, nutrition, fluids, renal/endocrine; jaundice and hypoglycemia", products: "Case discussions; newborn H&P; EMR comparison", sessionDate: "", joinLink: "" },
      { week: "Week 4", focus: "Neuro, behavioral/adolescent, hematology, cardiovascular, multisystem", products: "Adolescent OSCE; progress note", sessionDate: "", joinLink: "" },
      { week: "Week 5", focus: "Prematurity, NICU complications, feeding, congenital disorders, discharge", products: "NICU note; family-update OSCE; research mini-proposal", sessionDate: "", joinLink: "" },
      { week: "Week 6", focus: "Integrated emergency reasoning; Shelf/USMLE review; presentation", products: "Discharge summary; final OSCE; final quiz; research presentation", sessionDate: "", joinLink: "" },
    ],
    assessment: [
      { component: "Attendance, preparation, and professionalism", weight: "10%" },
      { component: "Ten case discussions / worksheets", weight: "20%" },
      { component: "Five clinical notes with revision", weight: "20%" },
      { component: "Two formal OSCEs", weight: "20%" },
      { component: "EMR comparison assignment", weight: "10%" },
      { component: "Research mini-proposal and presentation", weight: "10%" },
      { component: "Baseline-to-final knowledge assessment", weight: "10%" },
    ],
    completionStandard: [
      "At least 80% attendance and completion of all required safety/privacy training.",
      "Submission of all five notes, both formal OSCEs, the EMR assignment, the research product, and the final assessment.",
      "Overall score of at least 70%, with no serious professionalism or privacy violation.",
    ],
    safety: [
      "This tele-rotation is an educational experience and does not replace a formally approved clinical clerkship or hands-on rotation.",
      "No independent diagnosis, treatment, prescribing, procedures, or patient contact is permitted unless separately authorized by the responsible institution.",
      "No identifiable patient information may be used in sessions, assignments, screenshots, recordings, or messaging.",
      "Recording requires explicit program approval and participant consent; clinical material is never recorded from a live chart.",
      "Academic credit, recommendation letters, certificates, residency outcomes, and visa support are not guaranteed and are stated accurately at enrollment.",
    ],
  },

  physicalRotations: {
    eyebrow: "Education & Training · Physical Rotations",
    heading: "Institution-approved, in-person pediatric & neonatal learning",
    body: "Every placement clearly states whether it is observational or hands-on, along with required documents, health clearance, privacy expectations, fees, dates, and supervision arrangements.",
    tracks: [
      { pill: "Observational", heading: "NICU Shadowing", body: "Observed rounds and bedside teaching in a neonatal intensive care setting, under direct supervision." },
      { pill: "Institution-dependent", heading: "Pediatric Outpatient Clinic", body: "Continuity clinic exposure — well-child visits, growth monitoring and follow-up care, per the host institution's policy on hands-on involvement." },
      { pill: "By arrangement", heading: "Elective Placement", body: "A focused elective within neonatology or pediatrics, arranged with an approved host institution." },
    ],
    whatToExpect: [
      { heading: "Documents & health clearance", body: "Required paperwork, immunization records, and any host-institution health clearance are confirmed before placement begins." },
      { heading: "Supervision", body: "Every placement has a named supervising physician and clearly defined scope — observational vs. hands-on is stated up front, never assumed." },
      { heading: "Privacy", body: "Patient privacy and institutional policy apply throughout — no identifiable patient information leaves the clinical setting." },
    ],
    eligibilityHeading: "Eligibility & fees",
    eligibilityBody: "Open to medical students (clinical years) and IMGs preparing for residency applications, subject to the host institution's requirements. Any applicable fees, dates, and documentation requirements are confirmed during the application process — nothing is charged without being stated upfront.",
  },

  clinicalServices: {
    eyebrow: "Clinical Services",
    heading: "Pediatric & neonatal consultations through approved clinical pathways",
    body: "Every consultation offered here is a free phone call — no cost, no obligation. This page explains how scheduling works, who is eligible, and what to do in an emergency.",
    features: [
      { heading: "Scheduling", body: "Consultations are arranged by phone call, at a time that works for you — submit the form below and we'll call you back, usually within a few days." },
      { heading: "Telehealth Eligibility", body: "Phone consultations are available to students, families, and clinicians anywhere — no geographic restriction for an educational or advisory conversation." },
      { heading: "Emergency Guidance", body: "This is not an emergency service. If this is a medical emergency, contact your local emergency services or nearest emergency department immediately — do not wait for a callback." },
    ],
    privacyHeading: "Privacy",
    privacyBody: "Details shared during a consultation request are used only to arrange and follow up on that consultation, and are kept as an internal record of the practice's outreach. No identifiable patient information is shared beyond what is needed to provide the consultation itself.",
  },

  advisoryServices: {
    eyebrow: "Advisory Services",
    heading: "Professional guidance for hospitals & educational institutions",
    body: "NICU development and expansion, and pediatrics/neonatology curriculum development — advisory work for institutions, not individual patient care.",
    subpages: [
      { label: "NICU Development & Expansion", href: "/advisory-services/nicu-development", blurb: "Guidance on level of care, workflows, staffing, training, transfer pathways, equipment planning, and quality measures." },
      { label: "Pediatric & Neonatology Curriculum Development", href: "/advisory-services/curriculum-development", blurb: "Support with learning objectives, topic sequencing, cases, question banks, simulation, OSCEs, and assessment plans." },
    ],
  },

  nicuDevelopment: {
    eyebrow: "Advisory Services · NICU Development & Expansion",
    heading: "Guidance for hospitals building or expanding NICU care",
    body: "Advisory support across the full scope of NICU planning — from level-of-care decisions to staffing, training, and readiness for implementation.",
    services: [
      { heading: "Level of Care", body: "Determining the appropriate NICU level for a given institution's patient population and resources." },
      { heading: "Workflows & Policies", body: "Designing clinical workflows and policies aligned with best practice and institutional capacity." },
      { heading: "Staffing & Training", body: "Guidance on staffing models and structured training for nursing and physician teams." },
      { heading: "Transfer Pathways", body: "Establishing clear transfer and escalation pathways to higher levels of care when needed." },
      { heading: "Equipment Planning", body: "Advisory input on equipment needs aligned with the target level of care." },
      { heading: "Quality Measures", body: "Setting up quality measures and implementation readiness checks before launch." },
    ],
  },

  curriculumDevelopment: {
    eyebrow: "Advisory Services · Curriculum Development",
    heading: "Pediatric & neonatology curriculum design for educational institutions",
    body: "The same rigor behind this practice's own Tele-Rotation program, applied to building a curriculum for your institution — from learning objectives through assessment.",
    services: [
      { heading: "Learning Objectives", body: "Defining clear, measurable learning objectives mapped to recognized content outlines." },
      { heading: "Topic Sequencing", body: "Structuring topic order for progressive, reinforcing learning." },
      { heading: "Case Development", body: "Building structured, de-identified cases for case-based teaching." },
      { heading: "Question Banks", body: "Original, faculty-written question sets aligned with exam blueprints." },
      { heading: "Simulation & OSCEs", body: "Designing simulation stations and OSCE scenarios with scoring rubrics." },
      { heading: "Faculty Guides & Assessment", body: "Faculty facilitation guides, assessment plans, and feedback frameworks." },
    ],
  },

  communityImpact: {
    eyebrow: "Community Impact",
    heading: "Community health, outreach, and global initiatives",
    body: "From India to communities around the world — outreach work, volunteer opportunities, and partnerships that sit alongside the clinical and educational sides of this practice.",
    initiatives: [
      { heading: "India Initiatives", body: "Community health outreach and mentorship programs based in India — placeholder detail, to be filled in with real program information." },
      { heading: "Global Reach", body: "Extending free consultations and mentorship to students and families beyond India — placeholder detail, to be filled in." },
      { heading: "Volunteer With Us", body: "Opportunities for students and professionals to volunteer time toward outreach and mentorship efforts." },
    ],
    supportHeading: "Support Our Work",
    supportBody: "A formal donation option for website maintenance and program support is planned for this page, once the practice's legal donation process (nonprofit registration and payment compliance) is confirmed. Nothing is collected here yet.",
    supportNote: "No consultation, rotation, or mentorship ever requires a donation — this is entirely optional and separate from clinical services.",
  },

  research: {
    eyebrow: "Research",
    heading: "Neonatology & pediatrics research — the only areas we work in",
    body: "Every study here is focused on newborn and child health. If you're a student looking for a research opportunity outside neonatology or pediatrics, this isn't the right fit — and we'll say so honestly during your free consultation.",
    ongoing: [
      { status: "Recruiting students", heading: "Neonatal Outcomes in Low-Resource NICUs", body: "Evaluating outcomes for premature infants across resource-limited neonatal units, with a focus on protocol adherence." },
      { status: "In analysis", heading: "Pediatric Follow-Up Care Effectiveness", body: "Assessing structured follow-up protocols for pediatric patients after discharge, and their effect on readmission rates." },
      { status: "Design phase", heading: "Tele-Mentorship Learning Outcomes", body: "Comparing clinical reasoning growth between tele-rotation and in-person rotation students, in neonatology and pediatrics." },
    ],
    publications: [
      { title: "Placeholder: Neonatal resuscitation protocol adherence", focus: "Neonatology", year: "2025", status: "done" },
      { title: "Placeholder: Case-based learning in pediatric education", focus: "Medical Education", year: "2024", status: "done" },
      { title: "Placeholder: Remote mentorship outcomes in NICU training", focus: "Tele-education", year: "2024", status: "done" },
      { title: "Placeholder: Growth monitoring in early childhood clinics", focus: "Pediatrics", year: "2026", status: "progress" },
      { title: "Placeholder: Tele-rotation learning outcomes study", focus: "Tele-education", year: "2026", status: "new" },
    ],
  },

  testimonials: {
    eyebrow: "Testimonials",
    heading: "What students and families say",
    body: "Real feedback from people who've gone through a free consultation, rotation or mentorship session — managed from the admin panel.",
  },

  contact: {
    eyebrow: "Contact",
    heading: "One form for every kind of inquiry",
    body: "Education & Training, Clinical Services, Advisory Services, Research, Community Impact, or a general question — select the category that fits and we'll route it appropriately.",
    email: "care@example.com",
  },
};
