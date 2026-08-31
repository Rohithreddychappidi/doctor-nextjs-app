// Default/dummy data for the front-end prototype.
// All of this is placeholder content — real doctor bio, photos, exact
// numbers and past meetings will be supplied by the client later.
// Admin-editable pieces (stats, meetings, testimonials) are seeded here
// and then persisted to localStorage once someone edits them in /admin.
//
// Site structure follows the client-supplied "Website Front End V2"
// document: Home, About, Education & Training (hub: Live Learning,
// Question Banks, Tele-Rotations, Physical Rotations), Clinical
// Services, Advisory Services (hub: NICU Development & Expansion,
// Curriculum Development), Research, Community Impact, Testimonials,
// Contact — with Student Login as a utility button outside the main nav.

// ---------------------------------------------------------------------
// SITE_CONTENT — the editable-text backbone of the site.
//
// This is the architecture for "everything editable from admin": every
// hero/intro block and the Home page's service cards live here as data,
// not hardcoded JSX strings. Pages read their text via useSiteData().content
// instead of writing it inline, and /admin/content provides one generic
// editor (grouped by page) that edits this same object — so adding a new
// editable field anywhere just means adding a key here + one input in the
// admin editor, not writing a new bespoke form each time.
//
// This does not yet cover deeply nested repeatable content (e.g. every
// accordion entry on /about, every curriculum row) — those stay in their
// dedicated data structures above (PROFILE_SECTIONS, TELE_ROTATION_CURRICULUM,
// etc.) since they're structured data, not prose. Making those admin-editable
// too is a natural next step once the client's real content makes clear
// which fields actually need to change often.
// ---------------------------------------------------------------------
export const DEFAULT_CONTENT = {
  home: {
    bannerSlides: [
      {
        tag: "Free Consultations · Phone Call Based",
        heading: "From India, to students and families everywhere.",
        body: "Every consultation is free. This site is our record book — a way to track and share how many people we've been able to help, one phone call at a time.",
        ctaLabel: "Request a Free Consultation",
      },
      {
        tag: "Neonatology & Pediatrics",
        heading: "Mentorship focused on one thing, done well.",
        body: "Research, rotations and question bank content are all built around neonatology and pediatrics — not a general catalog.",
        ctaLabel: "See Research Opportunities",
      },
      {
        tag: "Support the Work",
        heading: "Help keep this practice free for the next student.",
        body: "Donations go toward website maintenance, mentorship resources and keeping every consultation free of charge.",
        ctaLabel: "See Community Impact",
      },
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
  },
  educationTraining: {
    eyebrow: "Education & Training",
    heading: "All learning services, in one place",
    body: "Live Learning, Question Banks, Tele-Rotations, and Physical Rotations — review eligibility, schedules, and requirements, and apply or log in from here.",
  },
  clinicalServices: {
    eyebrow: "Clinical Services",
    heading: "Pediatric & neonatal consultations through approved clinical pathways",
    body: "Every consultation offered here is a free phone call — no cost, no obligation. This page explains how scheduling works, who is eligible, and what to do in an emergency.",
  },
  advisoryServices: {
    eyebrow: "Advisory Services",
    heading: "Professional guidance for hospitals & educational institutions",
    body: "NICU development and expansion, and pediatrics/neonatology curriculum development — advisory work for institutions, not individual patient care.",
  },
  communityImpact: {
    eyebrow: "Community Impact",
    heading: "Community health, outreach, and global initiatives",
    body: "From India to communities around the world — outreach work, volunteer opportunities, and partnerships that sit alongside the clinical and educational sides of this practice.",
  },
  research: {
    eyebrow: "Research",
    heading: "Neonatology & pediatrics research — the only areas we work in",
    body: "Every study here is focused on newborn and child health. If you're a student looking for a research opportunity outside neonatology or pediatrics, this isn't the right fit — and we'll say so honestly during your free consultation.",
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
  },
};

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

// "Live Learning" sessions — lectures, meetings, case discussions,
// workshops, OSCE prep. Admin-editable (title/description/date/price).
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

// Accordion content for the About page — all placeholder,
// structured to hold "vast data" once the client shares the real bio.
export const PROFILE_SECTIONS = [
  {
    key: "employment",
    label: "Employment",
    items: [
      { title: "Attending Neonatologist — Placeholder Hospital, City", meta: "2018 – Present", body: "Placeholder description of current clinical role, responsibilities and unit." },
      { title: "Pediatric Attending — Placeholder Hospital, City", meta: "2014 – 2018", body: "Placeholder description of prior clinical appointment." },
      { title: "Resident Physician — Placeholder Hospital, India", meta: "2010 – 2014", body: "Placeholder description of residency training." },
    ],
  },
  {
    key: "education",
    label: "Education",
    items: [
      { title: "Fellowship, Neonatal-Perinatal Medicine", meta: "Placeholder Institution", body: "Placeholder description of fellowship training and focus areas." },
      { title: "Residency, Pediatrics", meta: "Placeholder Institution", body: "Placeholder description of residency program." },
      { title: "MD", meta: "Placeholder Medical College, India", body: "Placeholder description of medical degree and honors." },
    ],
  },
  {
    key: "leadership",
    label: "Leadership & Teaching",
    items: [
      { title: "Program Director, Pediatrics & Neonatology Tele-Rotation", meta: "Ongoing", body: "Placeholder description of curriculum oversight and learner safety responsibility." },
      { title: "Faculty, Case-Based Teaching", meta: "Ongoing", body: "Placeholder description of bedside and case-conference teaching role." },
    ],
  },
  {
    key: "research",
    label: "Research",
    items: [
      { title: "Neonatal outcomes in low-resource settings", meta: "Ongoing", body: "Placeholder summary of an active research project." },
      { title: "Pediatric follow-up care protocols", meta: "Ongoing", body: "Placeholder summary of a second active research project." },
      { title: "Tele-mentorship effectiveness in rotation training", meta: "In analysis", body: "Placeholder summary of a study evaluating remote mentorship outcomes." },
    ],
  },
  {
    key: "publications",
    label: "Publications",
    items: [
      { title: "Placeholder publication title on neonatal care", meta: "Journal Name, 2025", body: "Placeholder one-line summary of the publication's findings." },
      { title: "Placeholder publication title on pediatric education", meta: "Journal Name, 2024", body: "Placeholder one-line summary of the publication's findings." },
      { title: "Placeholder publication title on mentorship outcomes", meta: "Journal Name, 2023", body: "Placeholder one-line summary of the publication's findings." },
    ],
  },
  {
    key: "helping",
    label: "Helping Students",
    items: [
      { title: "Free phone consultations", meta: "1,450+ to date", body: "Ongoing free phone consultations for students and families — the core purpose of this practice's outreach." },
      { title: "Rotation mentorship (Tele + Physical)", meta: "900+ students", body: "Structured remote and in-person rotation mentorship for medical students and IMGs, focused on neonatology and pediatrics." },
      { title: "Student co-authorship on research", meta: "22+ students", body: "Students mentored into co-authorship roles on active neonatology/pediatrics research." },
    ],
  },
];

// Question Bank — 6 topics, each with sub-topics (neonatology/pediatrics focus)
export const QUESTION_BANK_TOPICS = [
  {
    key: "neo-basics",
    label: "Neonatology Fundamentals",
    count: 180,
    subtopics: ["Newborn resuscitation", "Prematurity & NICU care", "Neonatal jaundice", "Feeding & growth"],
  },
  {
    key: "peds-cardio",
    label: "Pediatric Cardiology",
    count: 96,
    subtopics: ["Congenital heart disease", "Murmurs & screening", "Pediatric arrhythmias", "Cyanotic vs acyanotic lesions"],
  },
  {
    key: "peds-pulm",
    label: "Pediatric Pulmonology",
    count: 88,
    subtopics: ["Respiratory distress syndrome", "Asthma in children", "Bronchiolitis", "Cystic fibrosis basics"],
  },
  {
    key: "growth-dev",
    label: "Growth & Development",
    count: 74,
    subtopics: ["Developmental milestones", "Failure to thrive", "Nutrition & growth charts", "Developmental red flags"],
  },
  {
    key: "peds-emergency",
    label: "Pediatric Emergency Medicine",
    count: 102,
    subtopics: ["Pediatric sepsis", "Seizures in children", "Trauma in pediatrics", "Dehydration & fluid management"],
  },
  {
    key: "neo-resus",
    label: "Neonatal Resuscitation & NICU Procedures",
    count: 64,
    subtopics: ["NRP algorithm", "Umbilical line placement", "Surfactant administration", "Therapeutic hypothermia"],
  },
];

// Education & Training hub — links to the four subpages
export const EDUCATION_TRAINING_SUBPAGES = [
  {
    key: "live-learning",
    label: "Live Learning",
    href: "/education-training/live-learning",
    blurb: "Lectures, professional meetings, case discussions, workshops, and OSCE preparation — all on one platform.",
  },
  {
    key: "question-banks",
    label: "Question Banks",
    href: "/education-training/question-banks",
    blurb: "Structured questions for shelf exams, USMLE, pediatrics boards, and neonatology boards, organized by topic.",
  },
  {
    key: "tele-rotations",
    label: "Tele-Rotations",
    href: "/education-training/tele-rotations",
    blurb: "A structured 6-week remote clinical learning program — cases, OSCEs, documentation, and exam preparation.",
  },
  {
    key: "physical-rotations",
    label: "Physical Rotations",
    href: "/education-training/physical-rotations",
    blurb: "Institution-approved, in-person pediatric and neonatal learning experiences.",
  },
];

// Advisory Services hub — links to the two subpages
export const ADVISORY_SERVICES_SUBPAGES = [
  {
    key: "nicu-development",
    label: "NICU Development & Expansion",
    href: "/advisory-services/nicu-development",
    blurb: "Guidance on level of care, workflows, staffing, training, transfer pathways, equipment planning, and quality measures.",
  },
  {
    key: "curriculum-development",
    label: "Pediatric & Neonatology Curriculum Development",
    href: "/advisory-services/curriculum-development",
    blurb: "Support with learning objectives, topic sequencing, cases, question banks, simulation, OSCEs, and assessment plans.",
  },
];

// Tele-Rotation curriculum — summarized from the client-supplied
// "Pediatrics & Neonatology Tele-Rotation Curriculum" document.
export const TELE_ROTATION_CURRICULUM = {
  overview: {
    duration: "6 weeks (adaptable to 4–8 weeks)",
    timeCommitment: "10–12 hours weekly (approx. 60–72 hours total)",
    delivery: "Live sessions plus guided independent work",
    platform: "One secure platform — Zoom or Google Meet",
    learners: "Medical students, graduates, residents, and physicians (assignments adjusted by level)",
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
    { week: "Week 1", focus: "Orientation; well child; growth, development, prevention; normal newborn", products: "Baseline quiz; pediatric history OSCE; EMR foundations" },
    { week: "Week 2", focus: "Fever/infection; respiratory disease; neonatal sepsis and respiratory distress", products: "Case discussions; pediatric H&P" },
    { week: "Week 3", focus: "GI, nutrition, fluids, renal/endocrine; jaundice and hypoglycemia", products: "Case discussions; newborn H&P; EMR comparison" },
    { week: "Week 4", focus: "Neuro, behavioral/adolescent, hematology, cardiovascular, multisystem", products: "Adolescent OSCE; progress note" },
    { week: "Week 5", focus: "Prematurity, NICU complications, feeding, congenital disorders, discharge", products: "NICU note; family-update OSCE; research mini-proposal" },
    { week: "Week 6", focus: "Integrated emergency reasoning; Shelf/USMLE review; presentation", products: "Discharge summary; final OSCE; final quiz; research presentation" },
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
};
