// Default/dummy data for the front-end prototype.
// All of this is placeholder content — real doctor bio, photos, exact
// numbers and past meetings will be supplied by the client later.
// Admin-editable pieces (stats, meetings, testimonials) are seeded here
// and then persisted to localStorage once someone edits them in /admin.

export const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "doctor", label: "Doctor Profile", href: "/doctor-profile" },
  { key: "research", label: "Research", href: "/research" },
  { key: "qbank", label: "Question Bank", href: "/question-bank" },
  { key: "tele", label: "Tele-Rotation", href: "/tele-rotation" },
  { key: "physical", label: "Physical Rotation", href: "/physical-rotation" },
  { key: "meetings", label: "Meetings", href: "/meetings" },
  { key: "donate", label: "Donate", href: "/donate" },
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
  },
  {
    id: "m2",
    title: "Pediatric Step 2 CK Strategy Workshop",
    description: "A focused, small-group workshop on approaching pediatric vignettes for Step 2 CK — includes a practice set and Q&A.",
    price: 25,
    isFree: false,
    date: "First Saturday of the month · 10:00 AM IST",
    imageUrl: "",
  },
  {
    id: "m3",
    title: "1:1 Mentorship Session",
    description: "A one-on-one video session for personalized guidance on rotations, research, or residency applications.",
    price: 40,
    isFree: false,
    date: "By request — flexible scheduling",
    imageUrl: "",
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

export const DEFAULT_REQUESTS = [
  { id: "r1", name: "Aiden Cole", contact: "aiden@example.com", reason: "Neonatology mentorship — general guidance", preferredTime: "Weekday evenings, IST", submitted: "Aug 24, 2026", status: "new", notes: "First-time contact, 3rd-year medical student." },
  { id: "r2", name: "Priya Nair", contact: "priya@example.com", reason: "Pediatric research opportunity", preferredTime: "Flexible", submitted: "Aug 23, 2026", status: "progress", notes: "Interested in joining an ongoing NICU outcomes study." },
  { id: "r3", name: "Marcus Odiaka", contact: "marcus@example.com", reason: "Tele-rotation application", preferredTime: "Weekend mornings", submitted: "Aug 22, 2026", status: "done", notes: "Confirmed for the next Tele-Rotation cohort." },
];

// Accordion content for the Doctor Profile page — all placeholder,
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
      { title: "Rotation mentorship (Clinical + Tele)", meta: "900+ students", body: "Structured clinical and remote rotation mentorship for medical students and IMGs, focused on neonatology and pediatrics." },
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
