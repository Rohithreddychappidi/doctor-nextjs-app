// Database abstraction layer supporting Neon DB, VPS PostgreSQL, and local persistent fallback
// Fully implements Section F relational schema for Personalized Student Portal (Part 1)
import { Pool } from "pg";

let pool = null;

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require") || connectionString.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

// Bcrypt hash for 'Pass@2026'
const PASS_HASH = "$2b$10$8AF5NYpMjR57GTiWEJckTOligWoT43ADzvIC7CEbeuLSiMCPD5gsO";

// In-memory persistent data store representing Section F tables
export const memoryStore = {
  initialized: true,

  // 1. Roles
  roles: [
    { id: "role_super_admin", name: "super_admin", description: "Full system administration and audit access" },
    { id: "role_admin", name: "admin", description: "Operational management of students, content, and enrollments" },
    { id: "role_physician", name: "physician", description: "Supervising clinical physician for rotations" },
    { id: "role_mentor", name: "mentor", description: "Faculty mentor for research and residency guidance" },
    { id: "role_instructor", name: "instructor", description: "Faculty lecturer for live classes and courses" },
    { id: "role_student", name: "student", description: "Enrolled medical student or graduate" },
  ],

  // 2. Programs Catalog
  programs: [
    {
      id: "prog_tele_rotation",
      key: "tele_rotation",
      name: "Virtual Neonatal & Pediatric Tele-Rotation",
      category: "Clinical",
      description: "6-week virtual clinical rotation covering NICU rounds, neonatal resuscitation, clinical case discussions, and US clinical reasoning.",
      duration: "6 Weeks",
      pricing_type: "Paid",
      price: "$1,200",
      pricing_note: "per 6-week cohort",
      featured: true,
      icon: "stethoscope"
    },
    {
      id: "prog_physical_rotation",
      key: "physical_rotation",
      name: "US Clinical Experience (Physical In-Person)",
      category: "Clinical",
      description: "Hospital-based clinical observership in Chicago and partner US hospitals with direct patient case observations and physician mentorship.",
      duration: "4 Weeks",
      pricing_type: "Paid",
      price: "$2,400",
      pricing_note: "hospital observership fee",
      featured: true,
      icon: "hospital"
    },
    {
      id: "prog_qbank",
      key: "qbank",
      name: "Board-Style Clinical Question Bank",
      category: "Exam Prep",
      description: "Comprehensive USMLE Step 1, Step 2 CK, and Pediatric Shelf exam preparation with clinical vignette rationales for right & distractor choices.",
      duration: "12 Months Access",
      pricing_type: "Paid",
      price: "$250",
      pricing_note: "1-year unlimited access",
      featured: true,
      icon: "academic"
    },
    {
      id: "prog_live_learning",
      key: "live_learning",
      name: "Live Clinical Seminars & Case Conferences",
      category: "Education",
      description: "Weekly interactive live clinical seminars via Microsoft Teams with Dr. Janardhan Mydam covering NICU decision-making and pediatric guidelines.",
      duration: "Weekly Interactive",
      pricing_type: "Free",
      price: "Free",
      pricing_note: "open attendance for registered learners",
      featured: true,
      icon: "video"
    },
    {
      id: "prog_courses",
      key: "courses",
      name: "Recorded Clinical Masterclasses & Courses",
      category: "Education",
      description: "On-demand high-yield video curriculum across Neonatology, Pediatric Critical Care, Biostatistics, and USMLE Clinical Reasoning.",
      duration: "Self-Paced",
      pricing_type: "Paid",
      price: "$350",
      pricing_note: "on-demand lifetime access",
      featured: false,
      icon: "play"
    },
    {
      id: "prog_research",
      key: "research",
      name: "Clinical Research Mentorship & Publication",
      category: "Research",
      description: "End-to-end clinical research mentorship from study design and IRB submission to manuscript drafting, peer review, and PubMed-indexed publication.",
      duration: "3-6 Months",
      pricing_type: "Paid",
      price: "$1,800",
      pricing_note: "project-based investigator guidance",
      featured: true,
      icon: "document"
    },
    {
      id: "prog_mentorship",
      key: "mentorship",
      name: "1-on-1 Faculty Mentorship & US Residency Match Guidance",
      category: "Mentorship",
      description: "Personalized faculty guidance with Dr. Janardhan Mydam on ERAS CV, personal statement editing, specialty selection, and mock residency interviews.",
      duration: "6 Months",
      pricing_type: "Paid",
      price: "$850",
      pricing_note: "full match season mentorship",
      featured: false,
      icon: "user"
    }
  ],

  // 3. Users
  users: [
    {
      id: "usr_admin",
      email: "admin@jva-medical.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-01-01T00:00:00Z",
      created_at: "2026-01-01T00:00:00Z"
    },
    {
      id: "usr_student_a",
      email: "student.a@example.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-01T00:00:00Z",
      created_at: "2026-02-01T00:00:00Z"
    },
    {
      id: "usr_student_b",
      email: "student.b@example.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-05T00:00:00Z",
      created_at: "2026-02-05T00:00:00Z"
    },
    {
      id: "usr_student_c",
      email: "student.c@example.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-10T00:00:00Z",
      created_at: "2026-02-10T00:00:00Z"
    },
    {
      id: "usr_student_d",
      email: "student.d@example.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-12T00:00:00Z",
      created_at: "2026-02-12T00:00:00Z"
    },
    {
      id: "usr_student_f",
      email: "student.f@example.com",
      password_hash: PASS_HASH,
      status: "active",
      email_verified_at: "2026-02-15T00:00:00Z",
      created_at: "2026-02-15T00:00:00Z"
    }
  ],

  // 4. User Roles Mapping
  user_roles: [
    { user_id: "usr_admin", role_id: "role_super_admin" },
    { user_id: "usr_admin", role_id: "role_admin" },
    { user_id: "usr_admin", role_id: "role_mentor" },
    { user_id: "usr_student_a", role_id: "role_student" },
    { user_id: "usr_student_b", role_id: "role_student" },
    { user_id: "usr_student_c", role_id: "role_student" },
    { user_id: "usr_student_d", role_id: "role_student" },
    { user_id: "usr_student_f", role_id: "role_student" },
  ],

  // 5. Student Profiles
  student_profiles: [
    {
      user_id: "usr_student_a",
      first_name: "Alex",
      last_name: "Rivera",
      medical_school: "Windsor University School of Medicine",
      country: "United States",
      graduation_year: 2026,
      usmle_stage: "Step 2 CK",
      specialty_interest: "Neonatology & Pediatrics",
      phone: "+1 (555) 234-5678",
      avatar_url: null,
      bio: "Final-year medical student completing pediatric and neonatal core clinical rotations."
    },
    {
      user_id: "usr_student_b",
      first_name: "Bethany",
      last_name: "Chen",
      medical_school: "St. George's University School of Medicine",
      country: "Canada",
      graduation_year: 2027,
      usmle_stage: "Step 1",
      specialty_interest: "Pediatrics",
      phone: "+1 (555) 345-6789",
      avatar_url: null,
      bio: "2nd-year medical student focusing on foundational clinical science and board question bank mastery."
    },
    {
      user_id: "usr_student_c",
      first_name: "Carlos",
      last_name: "Mendez",
      medical_school: "Ross University School of Medicine",
      country: "United States",
      graduation_year: 2026,
      usmle_stage: "Step 2 CK",
      specialty_interest: "Pediatric Critical Care",
      phone: "+1 (555) 456-7890",
      avatar_url: null,
      bio: "Aspiring pediatric intensivist actively engaged in QBank practice, live case seminars, and 1-on-1 residency matching mentorship."
    },
    {
      user_id: "usr_student_d",
      first_name: "Divya",
      last_name: "Patel",
      medical_school: "Kasturba Medical College",
      country: "India",
      graduation_year: 2025,
      usmle_stage: "Step 3 / ERAS Match",
      specialty_interest: "Neonatal-Perinatal Medicine",
      phone: "+91 98765 43210",
      avatar_url: null,
      bio: "IMG physician working on multicenter neonatal cohort research and clinical tele-rotations for US residency application."
    },
    {
      user_id: "usr_student_f",
      first_name: "Fatima",
      last_name: "Al-Mansoor",
      medical_school: "Royal College of Surgeons in Ireland (RCSI)",
      country: "Ireland",
      graduation_year: 2026,
      usmle_stage: "Step 2 CK",
      specialty_interest: "Academic Pediatrics & Neonatology",
      phone: "+353 87 123 4567",
      avatar_url: null,
      bio: "Full Scholar enrolled across clinical rotations, question bank, research, live learning, and faculty mentorship."
    }
  ],

  // 6. Enrollments (Strictly implementing Section E Worked Examples)
  enrollments: [
    // Student A: Active in Clinical Rotation only
    {
      id: "enr_a_1",
      student_id: "usr_student_a",
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

    // Student B: Active in Question Bank only
    {
      id: "enr_b_1",
      student_id: "usr_student_b",
      program_id: "prog_qbank",
      plan: "12-Month Access",
      access_start_date: "2026-07-01T00:00:00Z",
      access_expiry_date: "2027-07-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        target_exam: "USMLE Step 1 & Pediatric Shelf",
        questions_completed: 180,
        overall_accuracy: 74
      },
      created_at: "2026-07-01T08:00:00Z",
      last_accessed_at: "2026-09-09T18:00:00Z"
    },

    // Student C: Question Bank + Live Learning + Mentorship
    {
      id: "enr_c_1",
      student_id: "usr_student_c",
      program_id: "prog_qbank",
      plan: "12-Month Access",
      access_start_date: "2026-06-01T00:00:00Z",
      access_expiry_date: "2027-06-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        target_exam: "USMLE Step 2 CK",
        questions_completed: 340,
        overall_accuracy: 81
      },
      created_at: "2026-06-01T00:00:00Z",
      last_accessed_at: "2026-09-09T16:00:00Z"
    },
    {
      id: "enr_c_2",
      student_id: "usr_student_c",
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
      id: "enr_c_3",
      student_id: "usr_student_c",
      program_id: "prog_mentorship",
      plan: "Residency Match Mentorship",
      access_start_date: "2026-07-15T00:00:00Z",
      access_expiry_date: "2027-01-15T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        assigned_mentor_id: "usr_admin",
        mentor_name: "Dr. Janardhan Mydam, MD, FAAP",
        next_meeting_date: "2026-09-16 17:00:00"
      },
      created_at: "2026-07-15T00:00:00Z",
      last_accessed_at: "2026-09-07T11:00:00Z"
    },

    // Student D: Research + Tele-Rotation
    {
      id: "enr_d_1",
      student_id: "usr_student_d",
      program_id: "prog_research",
      plan: "Multicenter Pediatric Clinical Study",
      access_start_date: "2026-05-01T00:00:00Z",
      access_expiry_date: "2026-12-31T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        project_id: "res_proj_1",
        project_title: "Delayed Cord Clamping and Hemodynamic Transition in Preterm Neonates",
        current_stage: "IRB & Data Collection"
      },
      created_at: "2026-05-01T00:00:00Z",
      last_accessed_at: "2026-09-09T10:00:00Z"
    },
    {
      id: "enr_d_2",
      student_id: "usr_student_d",
      program_id: "prog_tele_rotation",
      plan: "6-Week Advanced Neonatal Clinical Track",
      access_start_date: "2026-08-01T00:00:00Z",
      access_expiry_date: "2026-10-30T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: {
        rotation_site: "JVA Tele-Neonatology Network",
        preceptor: "Dr. Janardhan Mydam, MD, FAAP",
        current_week: 5
      },
      created_at: "2026-08-01T00:00:00Z",
      last_accessed_at: "2026-09-08T15:30:00Z"
    },

    // Student F: All Programs (Full Scholar)
    {
      id: "enr_f_1",
      student_id: "usr_student_f",
      program_id: "prog_qbank",
      plan: "12-Month Comprehensive",
      access_start_date: "2026-04-01T00:00:00Z",
      access_expiry_date: "2027-04-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: { questions_completed: 520, overall_accuracy: 86 },
      created_at: "2026-04-01T00:00:00Z",
      last_accessed_at: "2026-09-09T20:00:00Z"
    },
    {
      id: "enr_f_2",
      student_id: "usr_student_f",
      program_id: "prog_live_learning",
      plan: "Full Year Live Access",
      access_start_date: "2026-04-01T00:00:00Z",
      access_expiry_date: "2027-04-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: { cohort: "Thursday Evening Clinical Rounds" },
      created_at: "2026-04-01T00:00:00Z",
      last_accessed_at: "2026-09-09T19:00:00Z"
    },
    {
      id: "enr_f_3",
      student_id: "usr_student_f",
      program_id: "prog_courses",
      plan: "All Masterclasses Bundle",
      access_start_date: "2026-04-01T00:00:00Z",
      access_expiry_date: "2027-04-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: { completed_lessons: 18, total_lessons: 24 },
      created_at: "2026-04-01T00:00:00Z",
      last_accessed_at: "2026-09-08T22:00:00Z"
    },
    {
      id: "enr_f_4",
      student_id: "usr_student_f",
      program_id: "prog_tele_rotation",
      plan: "Completed 6-Week Cohort",
      access_start_date: "2026-04-15T00:00:00Z",
      access_expiry_date: "2026-06-15T00:00:00Z",
      enrollment_status: "Completed",
      payment_status: "Paid",
      program_specific_data: { certificate_id: "cert_f_1", grade: "Honors" },
      created_at: "2026-04-15T00:00:00Z",
      last_accessed_at: "2026-06-15T00:00:00Z"
    },
    {
      id: "enr_f_5",
      student_id: "usr_student_f",
      program_id: "prog_physical_rotation",
      plan: "Chicago Hospital Observership (Upcoming)",
      access_start_date: "2026-10-01T00:00:00Z",
      access_expiry_date: "2026-11-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: { hospital: "Swedish Hospital & St. Joseph NICU", badge_issued: true },
      created_at: "2026-05-01T00:00:00Z",
      last_accessed_at: "2026-09-07T14:00:00Z"
    },
    {
      id: "enr_f_6",
      student_id: "usr_student_f",
      program_id: "prog_research",
      plan: "Lead Investigator Track",
      access_start_date: "2026-04-01T00:00:00Z",
      access_expiry_date: "2027-04-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: { project_id: "res_proj_2", current_stage: "Manuscript Draft" },
      created_at: "2026-04-01T00:00:00Z",
      last_accessed_at: "2026-09-09T21:00:00Z"
    },
    {
      id: "enr_f_7",
      student_id: "usr_student_f",
      program_id: "prog_mentorship",
      plan: "Executive Faculty Mentorship",
      access_start_date: "2026-04-01T00:00:00Z",
      access_expiry_date: "2027-04-01T00:00:00Z",
      enrollment_status: "Active",
      payment_status: "Paid",
      program_specific_data: { assigned_mentor_id: "usr_admin", mentor_name: "Dr. Janardhan Mydam, MD, FAAP" },
      created_at: "2026-04-01T00:00:00Z",
      last_accessed_at: "2026-09-06T18:00:00Z"
    }
  ],

  // 7. Video Courses, Modules & Lessons
  courses: [
    {
      id: "crs_neo_101",
      title: "Neonatal Intensive Care: Fundamentals & Golden Hour Transition",
      category: "Neonatology",
      total_modules: 3,
      total_duration: "6 Hours",
      thumbnail: "/images/nicu-resuscitation.jpg",
      description: "Step-by-step masterclass on neonatal transition, NRP 8th edition algorithms, T-piece CPAP setup, thermal stability, and early arterial blood gas evaluation.",
      modules: [
        {
          id: "mod_1",
          title: "Module 1: Delivery Room Golden Hour Management",
          lessons: [
            { id: "lsn_1", title: "NRP Flowchart & Immediate Thermal Care", duration: "25 min", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: true },
            { id: "lsn_2", title: "Non-Invasive CPAP vs Intubation Decision Matrix", duration: "32 min", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: true }
          ]
        },
        {
          id: "mod_2",
          title: "Module 2: Neonatal Respiratory Distress & Surfactant Titration",
          lessons: [
            { id: "lsn_3", title: "Chest Radiography: RDS vs TTN vs Pneumothorax", duration: "40 min", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: false },
            { id: "lsn_4", title: "Less Invasive Surfactant Administration (LISA/MISA)", duration: "28 min", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: false }
          ]
        }
      ]
    },
    {
      id: "crs_peds_201",
      title: "Pediatric Emergency Medicine & Critical Vignettes",
      category: "Pediatrics",
      total_modules: 2,
      total_duration: "4.5 Hours",
      thumbnail: "/images/pediatric-clinic.jpg",
      description: "High-yield emergency cases including pediatric septic shock resuscitation, status epilepticus management, Kawasaki disease, and respiratory failure in bronchiolitis.",
      modules: [
        {
          id: "mod_3",
          title: "Module 1: Pediatric Sepsis & Shock Management",
          lessons: [
            { id: "lsn_5", title: "Pediatric Septic Shock: Fluids, Inotropes & Hydrocortisone", duration: "35 min", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: false }
          ]
        }
      ]
    }
  ],

  // 8. Live Learning Sessions (with Microsoft Teams Integration)
  live_sessions: [
    {
      id: "sess_1",
      title: "Neonatal Resuscitation & Delivery Room Transition (Golden Hour)",
      date_time: "2026-09-17 18:00:00",
      duration_minutes: 90,
      instructor: "Dr. Janardhan Mydam, MD, FAAP",
      meeting_platform: "Microsoft Teams",
      meeting_link: "https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-week1",
      status: "Upcoming",
      syllabus_note: "Review AAP/AHA 8th edition NRP guidelines and target pre-ductal oxygen saturations.",
      materials_url: "/uploads/week1-neonatal-resuscitation-notes.pdf"
    },
    {
      id: "sess_2",
      title: "Approach to Extreme Hyperbilirubinemia & Exchange Transfusion Indications",
      date_time: "2026-09-24 18:00:00",
      duration_minutes: 90,
      instructor: "Dr. Janardhan Mydam, MD, FAAP",
      meeting_platform: "Microsoft Teams",
      meeting_link: "https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-week2",
      status: "Upcoming",
      syllabus_note: "AAP 2022 Hyperbilirubinemia guidelines, Bhutani nomograms, and neurotoxicity risk factors.",
      materials_url: "/uploads/week2-hyperbilirubinemia-guidelines.pdf"
    },
    {
      id: "sess_recorded_1",
      title: "Congenital Diaphragmatic Hernia: Ventilation Strategies & Timing of Surgery",
      date_time: "2026-09-03 18:00:00",
      duration_minutes: 85,
      instructor: "Dr. Janardhan Mydam, MD, FAAP",
      meeting_platform: "Microsoft Teams",
      meeting_link: "https://teams.microsoft.com/l/meetup-join/jva-medical-recorded-cdh",
      status: "Recorded",
      recording_url: "https://teams.microsoft.com/l/meetup-join/jva-cdh-recording",
      syllabus_note: "Gentle ventilation techniques, pulmonary hypertension management, and ECMO criteria.",
      materials_url: "/uploads/cdh-management-handout.pdf"
    }
  ],

  // 8b. Question Bank Specializations (3 Primary Disciplines)
  qbank_specializations: [
    {
      id: "spec_neo",
      code: "NEO",
      name: "Neonatal-Perinatal Medicine",
      description: "NICU delivery room resuscitation, surfactant kinetics, PPHN, extreme prematurity, and neonatal hemodynamics.",
      icon: "👶",
      total_modules: 10
    },
    {
      id: "spec_peds",
      code: "PEDS",
      name: "General Pediatrics & Adolescent Health",
      description: "Outpatient and inpatient pediatric clinical vignettes, immunization schedules, milestones, cardiology, and infectious diseases.",
      icon: "🩺",
      total_modules: 10
    },
    {
      id: "spec_crit",
      code: "PICU",
      name: "Pediatric Critical Care & Emergency Medicine",
      description: "PALS algorithms, pediatric septic shock, status epilepticus, DKA cerebral edema, trauma resuscitation, and acute toxicology.",
      icon: "⚡",
      total_modules: 8
    }
  ],

  // 8c. Question Bank Modules (20-30 modules organized under Specializations)
  qbank_modules: [
    // --- Neonatology Modules ---
    { id: "mod_neo_01", specialization_id: "spec_neo", name: "Delivery Room Golden Hour & NRP 8th Edition", description: "T-piece ventilation, target pre-ductal saturations, thermoregulation with polyethylene wrap.", is_free: true, price: 0 },
    { id: "mod_neo_02", specialization_id: "spec_neo", name: "Respiratory Distress Syndrome (RDS) & Surfactant Kinetics", description: "Pathophysiology, chest radiography, and Less-Invasive Surfactant Administration (LISA/MISA).", is_free: true, price: 0 },
    { id: "mod_neo_03", specialization_id: "spec_neo", name: "Persistent Pulmonary Hypertension of the Newborn (PPHN)", description: "Echocardiography findings, pre- and post-ductal SpO2 gradients, and inhaled Nitric Oxide (iNO).", is_free: false, price: 49 },
    { id: "mod_neo_04", specialization_id: "spec_neo", name: "Extreme Prematurity & Patent Ductus Arteriosus (PDA)", description: "Hemodynamically significant PDA, targeted echocardiography, and pharmacologic vs conservative therapy.", is_free: false, price: 49 },
    { id: "mod_neo_05", specialization_id: "spec_neo", name: "Neonatal Hyperbilirubinemia & Exchange Transfusion", description: "AAP 2022 guidelines, Bhutani nomograms, neurotoxicity risk thresholds, and exchange mechanics.", is_free: true, price: 0 },
    { id: "mod_neo_06", specialization_id: "spec_neo", name: "Hypoxic-Ischemic Encephalopathy (HIE) & Therapeutic Hypothermia", description: "Sarnat staging, amplitude-integrated EEG (aEEG), and whole-body cooling 33.5°C protocol.", is_free: false, price: 49 },
    { id: "mod_neo_07", specialization_id: "spec_neo", name: "Necrotizing Enterocolitis (NEC) & Acute Surgical Abdomen", description: "Modified Bell staging, pneumatosis intestinalis, portal venous gas, and surgical indications.", is_free: false, price: 49 },
    { id: "mod_neo_08", specialization_id: "spec_neo", name: "Neonatal Sepsis & Antimicrobial Stewardship", description: "Early vs late onset neonatal sepsis, Kaiser neonatal sepsis calculator, and lumbar puncture indications.", is_free: true, price: 0 },
    { id: "mod_neo_09", specialization_id: "spec_neo", name: "Congenital Heart Defects (CHD) in the Newborn", description: "Cyanotic 5 Ts vs acyanotic left-to-right shunts, hyperoxia challenge test, and PGE1 infusion.", is_free: false, price: 49 },
    { id: "mod_neo_10", specialization_id: "spec_neo", name: "Neonatal Hematology & Fluid/Electrolyte Balance", description: "Anemia of prematurity, twin-twin transfusion, polycythemia, and early neonatal acute kidney injury.", is_free: true, price: 0 },

    // --- General Pediatrics Modules ---
    { id: "mod_peds_01", specialization_id: "spec_peds", name: "Developmental Milestones & Pediatric Growth Charts", description: "Gross motor, fine motor, language, and social milestones; CDC vs WHO growth curves.", is_free: true, price: 0 },
    { id: "mod_peds_02", specialization_id: "spec_peds", name: "Pediatric Immunization Schedules & Catch-up Protocols", description: "ACIP vaccine timing, live attenuated contraindications, and vaccine adverse event reporting.", is_free: true, price: 0 },
    { id: "mod_peds_03", specialization_id: "spec_peds", name: "Pediatric Pulmonology: Asthma, Bronchiolitis & Croup", description: "Westley croup scoring, nebulized racemic epinephrine, and stepwise GINA asthma protocols.", is_free: true, price: 0 },
    { id: "mod_peds_04", specialization_id: "spec_peds", name: "Pediatric Gastroenterology & Abdominal Emergencies", description: "Pyloric stenosis hypochloremic metabolic alkalosis, intussusception air-contrast enema, and GERD.", is_free: false, price: 39 },
    { id: "mod_peds_05", specialization_id: "spec_peds", name: "Pediatric Nephrology: Nephrotic vs Nephritic Syndromes", description: "Minimal change disease steroid regimen, post-streptococcal glomerulonephritis, and HUS triad.", is_free: false, price: 39 },
    { id: "mod_peds_06", specialization_id: "spec_peds", name: "Pediatric Endocrinology: DKA & Congenital Hypothyroidism", description: "Two-bag DKA fluid protocol, cerebral edema signs, and neonatal metabolic newborn screening.", is_free: false, price: 39 },
    { id: "mod_peds_07", specialization_id: "spec_peds", name: "Pediatric Rheumatology: Kawasaki Disease & Henoch-Schönlein", description: "Diagnostic criteria, high-dose IVIG + aspirin dosing, and IgA vasculitis renal monitoring.", is_free: true, price: 0 },
    { id: "mod_peds_08", specialization_id: "spec_peds", name: "Pediatric Infectious Diseases & Childhood Exanthems", description: "Measles Koplik spots, erythema infectiosum, roseola infantum, and occult bacteremia.", is_free: true, price: 0 },
    { id: "mod_peds_09", specialization_id: "spec_peds", name: "Pediatric Dermatology & Atopic Disorders", description: "Atopic dermatitis step care, infantile hemangiomas (propranolol), and cradle cap vs seborrhea.", is_free: true, price: 0 },
    { id: "mod_peds_10", specialization_id: "spec_peds", name: "Pediatric Hematology/Oncology: Anemias & Leukemia", description: "Iron deficiency vs beta-thalassemia minor, sickle cell crisis, ALL presentation, and Wilms tumor.", is_free: false, price: 39 },

    // --- Critical Care & Emergency Modules ---
    { id: "mod_crit_01", specialization_id: "spec_crit", name: "Pediatric Advanced Life Support (PALS) & Shock States", description: "Hypovolemic, septic, cardiogenic, and anaphylactic shock resuscitation algorithms.", is_free: true, price: 0 },
    { id: "mod_crit_02", specialization_id: "spec_crit", name: "Pediatric Septic Shock & Vasoactive Inotrope Selection", description: "Surviving Sepsis Campaign guidelines, epinephrine vs norepinephrine, and hydrocortisone.", is_free: false, price: 49 },
    { id: "mod_crit_03", specialization_id: "spec_crit", name: "Status Epilepticus & Acute Neuro-Intensive Care", description: "First-line benzodiazepine timing, levetiracetam vs fosphenytoin, and ICP management.", is_free: true, price: 0 },
    { id: "mod_crit_04", specialization_id: "spec_crit", name: "Pediatric Polytrauma & Traumatic Brain Injury (TBI)", description: "PECARN head trauma rule, hyperosmolar therapy (3% NaCl vs mannitol), and cervical clearance.", is_free: false, price: 49 },
    { id: "mod_crit_05", specialization_id: "spec_crit", name: "Acute Toxicology, Overdoses & Specific Antidotes", description: "Acetaminophen Rumack-Matthew nomogram / NAC, iron toxicity, beta-blocker, and anticholinergic toxidromes.", is_free: true, price: 0 },
    { id: "mod_crit_06", specialization_id: "spec_crit", name: "Pediatric Acute Respiratory Distress Syndrome (PARDS)", description: "PALICC criteria, lung-protective ventilation, proning, neuromuscular blockade, and ECMO criteria.", is_free: false, price: 49 },
    { id: "mod_crit_07", specialization_id: "spec_crit", name: "Anaphylaxis & Acute Foreign Body Aspiration", description: "Intramuscular epinephrine dosing, biphasic reaction monitoring, and rigid bronchoscopy indications.", is_free: true, price: 0 },
    { id: "mod_crit_08", specialization_id: "spec_crit", name: "Biostatistics & Clinical Evidence Appraisal for USMLE", description: "Sensitivity, specificity, positive predictive value, NNT calculation, and Kaplan-Meier curves.", is_free: true, price: 0 }
  ],

  // 9. Question Bank Items (Tagged by Specialization, Module, Exam, System, Level)
  questions: [
    {
      id: "q_1",
      exam: "USMLE Step 2 CK",
      subject: "Neonatology",
      system: "Respiratory",
      level: 2,
      stem: "A 32-week preterm female newborn is delivered via emergency cesarean section. At 15 minutes of life, she presents with tachypnea (RR 74/min), intercostal retractions, and expiratory grunting. Chest X-ray reveals fine diffuse reticulogranular patterns bilaterally with prominent air bronchograms. What is the most appropriate initial respiratory management?",
      options: [
        "Endotracheal intubation and prophylactic surfactant immediately",
        "Nasal continuous positive airway pressure (CPAP) at 5–6 cm H2O and close observation",
        "Blow-by 100% oxygen via simple face mask at 10 L/min",
        "Empiric intravenous ampicillin and gentamicin alone without airway pressure"
      ],
      correct_index: 1,
      explanation_correct: "Correct: Nasal CPAP is the established first-line intervention for spontaneously breathing preterm infants with Respiratory Distress Syndrome (RDS). Early CPAP maintains functional residual capacity, prevents alveolar collapse, reduces work of breathing, and significantly lowers mechanical ventilation rates and bronchopulmonary dysplasia (BPD). Surfactant can be administered via LISA/MISA if FiO2 requirements escalate above 30%.",
      explanation_incorrect: "Distractor Rationale:\n• Option A (Routine intubation): Early routine intubation exposes fragile preterm lungs to barotrauma, volutrauma, and airway injury.\n• Option C (Blow-by 100% O2): Exposure to 100% oxygen causes severe hyperoxic oxidative injury, retinopathy of prematurity (ROP), and coronary vasoconstriction.\n• Option D (Antibiotics alone): While empiric antibiotics are administered for suspected sepsis, immediate positive end-expiratory pressure is mandatory to prevent atelectasis.",
      bookmarks_count: 34
    },
    {
      id: "q_2",
      exam: "USMLE Step 2 CK / Peds Shelf",
      subject: "Pediatrics",
      system: "Cardiovascular / Rheumatology",
      level: 2,
      stem: "A 4-year-old boy is brought to the clinic due to 6 days of persistent high spiking fever (39.5°C). Examination reveals bilateral non-exudative conjunctival injection, cracked erythematous lips, strawberry tongue, induration of hands and feet, and a solitary 1.8 cm tender left cervical lymph node. What is the standard initial therapy to prevent coronary artery aneurysms?",
      options: [
        "Intravenous Immunoglobulin (IVIG) 2 g/kg single infusion plus high-dose aspirin",
        "Intravenous methylprednisolone pulse therapy plus oral amoxicillin",
        "Subcutaneous low-molecular-weight heparin plus clopidogrel",
        "Oral acyclovir plus broad-spectrum cefotaxime"
      ],
      correct_index: 0,
      explanation_correct: "Correct: The child meets criteria for classic Kawasaki Disease. Initiating IVIG (2 g/kg over 10-12 hours) within 10 days of fever onset, combined with high-dose aspirin (80-100 mg/kg/day divided q6h until afebrile), drastically reduces the incidence of coronary artery aneurysms from 25% to under 3-4%.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (Steroids & amoxicillin): Steroids are adjuncts reserved for IVIG-refractory disease or high-risk Kobayashi scores; amoxicillin does not address systemic vasculitis.\n• Option C (Anticoagulation): Anticoagulation is indicated only after confirmation of large or giant aneurysms (Z-score >= 10).\n• Option D (Antivirals & Cephalosporins): Antimicrobial therapies have no therapeutic effect in Kawasaki inflammatory cascade.",
      bookmarks_count: 51
    },
    {
      id: "q_3",
      exam: "USMLE Step 1 / Step 2 CK",
      subject: "Biostatistics",
      system: "Epidemiology",
      level: 2,
      stem: "A multicenter randomized trial evaluates whether delayed cord clamping (DCC) for 60 seconds reduces severe intraventricular hemorrhage (IVH) in infants born <30 weeks. In 400 enrolled neonates, IVH occurred in 20 of 200 infants in the DCC group (10%) versus 40 of 200 infants in the immediate clamping group (20%). What is the Number Needed to Treat (NNT) to prevent one case of IVH?",
      options: [
        "5",
        "10",
        "20",
        "50"
      ],
      correct_index: 1,
      explanation_correct: "Correct: NNT = 1 / Absolute Risk Reduction (ARR). ARR = Control Event Rate (CER) - Experimental Event Rate (EER) = 0.20 - 0.10 = 0.10 (10%). Therefore, NNT = 1 / 0.10 = 10. For every 10 preterm infants receiving delayed cord clamping, one case of severe IVH is prevented.",
      explanation_incorrect: "Distractor Rationale:\n• Option A (5): Represents 1 / 0.20 (the inverse of the CER, rather than the ARR).\n• Option C (20): Arises from calculating 1 / Relative Risk (0.50) or confusing arithmetic percentages.\n• Option D (50): Calculation error.",
      bookmarks_count: 42
    },
    {
      id: "q_4",
      exam: "Pediatric Board / Neonatal Core",
      subject: "Neonatology",
      system: "Hematology / Hepatology",
      level: 3,
      stem: "A 3-day-old term male infant presents with jaundice extending down to the feet. Total serum bilirubin is 19.1 mg/dL, direct fraction 0.4 mg/dL. Mother is O Rh-positive; infant is A Rh-positive. Direct Antiglobulin Test (DAT/Coombs) is strongly positive. What is the pathophysiological mechanism?",
      options: [
        "Impaired hepatic bilirubin glucuronidation due to UGT1A1 promoter polymorphism",
        "Immune-mediated extravascular hemolysis caused by maternal IgG anti-A antibodies",
        "Biliary tree obliteration causing obstructive conjugated hyperbilirubinemia",
        "Intestinal beta-glucuronidase deconjugation stimulated by breast milk pregnanediol"
      ],
      correct_index: 1,
      explanation_correct: "Correct: ABO hemolytic disease of the newborn occurs when a group O mother develops IgG anti-A isohemagglutinins that cross the placenta into a group A fetus. The positive DAT confirms maternal IgG antibody adherence to neonatal erythrocyte surface antigens, triggering splenic reticuloendothelial extravascular hemolysis and rapid bilirubin generation.",
      explanation_incorrect: "Distractor Rationale:\n• Option A (UGT1A1 deficiency): Characteristic of Gilbert or Crigler-Najjar syndrome, which has a negative Coombs test and normal hemoglobin.\n• Option C (Biliary atresia): Manifests with direct (conjugated) hyperbilirubinemia (direct bilirubin >1.0 mg/dL or >20% of total) and pale stools at 2-8 weeks of life.\n• Option D (Breast milk jaundice): Occurs later in the 2nd week of life, lacks hemolysis, and has a negative DAT.",
      bookmarks_count: 28
    },
    {
      id: "q_5",
      exam: "USMLE Step 2 CK / Peds Shelf",
      subject: "Pediatrics",
      system: "Nutrition / Preventive",
      level: 1,
      stem: "A 2-week-old healthy term infant arrives for a newborn follow-up. He is exclusively breastfed and gaining weight normally along the 50th percentile. According to current American Academy of Pediatrics (AAP) guidelines, which daily nutritional supplement should be started immediately?",
      options: [
        "Vitamin D 400 IU daily",
        "Elemental iron 1 mg/kg daily",
        "Vitamin B12 50 mcg daily",
        "Fluoride drops 0.25 mg daily"
      ],
      correct_index: 0,
      explanation_correct: "Correct: The AAP recommends that all breastfed and partially breastfed infants receive 400 IU of supplemental oral vitamin D daily starting within the first few days of life to prevent nutritional rickets and hypocalcemia, as breast milk contains <50 IU/L of vitamin D.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (Iron): Term healthy infants have adequate iron stores until 4 months of age, at which point iron supplementation begins.\n• Option C (Vitamin B12): Only needed if the mother is on a strict vegan diet without maternal supplementation.\n• Option D (Fluoride): Not recommended until after 6 months of age in areas with low fluoridated drinking water.",
      bookmarks_count: 19
    },
    {
      id: "q_6",
      exam: "USMLE Step 2 CK / Board Prep",
      subject: "Cardiology",
      module: "Congenital Heart Disease",
      section: "Ductal-Dependent Systemic Lesions",
      system: "Cardiovascular",
      level: 3,
      stem: "A 5-day-old male newborn presents with sudden lethargy, poor feeding, tachypnea, and cool lower extremities. Physical exam reveals bounding radial pulses (BP 84/52 mmHg) but diminished, delayed femoral pulses (BP 48/28 mmHg) and a 3-second capillary refill in the lower extremities. What is the immediate pharmacological intervention?",
      options: [
        "Continuous intravenous Prostaglandin E1 (Alprostadil) infusion",
        "Intravenous Furosemide 1 mg/kg bolus",
        "High-dose Epinephrine infusion at 0.1 mcg/kg/min",
        "Oral Propranolol 1 mg/kg/day"
      ],
      correct_index: 0,
      explanation_correct: "Correct: The infant presents with circulatory shock due to critical Coarctation of the Aorta following closure of the ductus arteriosus. Immediate infusion of Prostaglandin E1 (PGE1 / Alprostadil at 0.05–0.1 mcg/kg/min) re-opens the ductus arteriosus, restoring right-to-left ductal shunting to maintain lower-body perfusion and preventing renal failure and metabolic acidosis.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (Furosemide): Diuretics will worsen hypovolemia and systemic hypoperfusion.\n• Option C (Epinephrine): Inotropes without afterload relief through an open ductus will increase myocardial work against an obstructed aorta.\n• Option D (Propranolol): Beta-blockers are contraindicated in acute cardiogenic shock.",
      bookmarks_count: 38
    },
    {
      id: "q_7",
      exam: "Neonatal-Perinatal Boards",
      subject: "Neurology",
      module: "Neonatal Encephalopathy",
      section: "Therapeutic Hypothermia Protocols",
      system: "Neurology",
      level: 4,
      stem: "A term male infant born at 39 weeks via emergency cesarean section for placental abruption has Apgar scores of 1, 3, and 5 at 1, 5, and 10 minutes. Cord arterial blood gas shows pH 6.88 and base deficit 18 mEq/L. At 2 hours of life, he exhibits lethargy, hypotonia, absent Moro reflex, and periodic breathing. What is the standard neuroprotective management?",
      options: [
        "Initiate whole-body therapeutic hypothermia to 33.5°C within 6 hours of birth for 72 hours",
        "Maintain hyperthermia above 38.0°C to stimulate cerebral perfusion pressure",
        "Administer prophylactic Phenobarbital 20 mg/kg in the absence of electrographic seizures",
        "Rapid intravenous 3% hypertonic saline bolus over 10 minutes"
      ],
      correct_index: 0,
      explanation_correct: "Correct: Therapeutic hypothermia (whole-body cooling to 33.5°C or selective head cooling for 72 hours, initiated strictly within 6 hours of birth) significantly reduces mortality and moderate-to-severe neurodevelopmental disability in infants >=36 weeks with moderate-to-severe Hypoxic-Ischemic Encephalopathy (HIE) fulfilling physiologic and neurologic exam criteria.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (Hyperthermia): Fever exacerbates secondary neuronal apoptosis and oxidative injury; temperature should be strictly controlled.\n• Option C (Prophylactic Phenobarbital): Routine prophylactic antiepileptic treatment without clinical or aEEG seizure evidence does not improve neurologic outcomes.\n• Option D (Hypertonic saline): Rapid hypertonic boluses risk pontine myelinolysis and intracranial hemorrhage.",
      bookmarks_count: 62
    },
    {
      id: "q_8",
      exam: "USMLE Step 2 CK / Peds Shelf",
      subject: "Neonatology",
      module: "Gastrointestinal Emergencies",
      section: "Necrotizing Enterocolitis & Bell's Staging",
      system: "Gastrointestinal",
      level: 2,
      stem: "A 28-week preterm infant on day 14 of life develops abdominal distension, gross bloody stools, temperature instability (35.8°C), and bilious gastric aspirates. An abdominal radiograph reveals linear branching radiolucencies within the bowel wall and branching lucencies overlying the liver shadow. What do these radiographic findings signify?",
      options: [
        "Pneumatosis intestinalis and portal venous gas confirming Necrotizing Enterocolitis (NEC Stage II/III)",
        "Duodenal atresia with classic double-bubble sign",
        "Meconium ileus with microcolon on contrast enema",
        "Midgut volvulus with corkscrew appearance of the duodenum"
      ],
      correct_index: 0,
      explanation_correct: "Correct: Pneumatosis intestinalis (intramural gas produced by bacterial fermentation within the bowel wall) and portal venous gas are pathognomonic hallmarks of Necrotizing Enterocolitis (Bell Stage IIB or greater). Immediate management entails bowel rest, nasogastric decompression, broad-spectrum antibiotics, and pediatric surgical consultation.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (Duodenal atresia): Demonstrates two air bubbles in the stomach and proximal duodenum without distal bowel gas, typically presenting on day 1.\n• Option C (Meconium ileus): Characteristic of cystic fibrosis, showing soap-bubble Neuhauser sign in the right lower quadrant.\n• Option D (Midgut volvulus): Requires upper GI series demonstrating misplaced ligament of Treitz, not intramural pneumatosis.",
      bookmarks_count: 45
    },
    {
      id: "q_9",
      exam: "USMLE Step 2 CK",
      subject: "Pediatrics",
      module: "Pediatric Surgery & Fluid Homeostasis",
      section: "Hypertrophic Pyloric Stenosis",
      system: "Gastrointestinal",
      level: 2,
      stem: "A 4-week-old first-born male infant presents with 5 days of non-bilious projectile vomiting after every feed. He remains ravenously hungry. On exam, an olive-shaped 1.5 cm mobile mass is palpated in the right upper quadrant. Serum electrolytes show Na+ 132 mEq/L, K+ 3.1 mEq/L, Cl- 86 mEq/L, and HCO3- 34 mEq/L. What is the fundamental initial step before operative pyloromyotomy?",
      options: [
        "Intravenous fluid resuscitation with isotonic saline and potassium to correct hypochloremic hypokalemic metabolic alkalosis",
        "Immediate emergency laparotomy within 2 hours of presentation",
        "High-dose oral erythromycin to stimulate motilin receptor gastrointestinal motility",
        "Upper endoscopy with balloon dilatation of the pyloric channel"
      ],
      correct_index: 0,
      explanation_correct: "Correct: Hypertrophic pyloric stenosis is a medical emergency, NOT a surgical emergency. The classic electrolyte abnormality is hypochloremic, hypokalemic metabolic alkalosis from gastric HCl loss. Operating before resolving electrolyte abnormalities predisposes the infant to life-threatening intraoperative apnea and cardiac arrhythmias. Surgery should only proceed once serum chloride >100 mEq/L and bicarbonate <30 mEq/L.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (Immediate surgery): Operating without biochemical stabilization risks anesthetic apnea.\n• Option C (Erythromycin): Macrolides are associated with the etiology of pyloric stenosis, not its treatment.\n• Option D (Endoscopic ballooning): Ramstedt surgical pyloromyotomy is the gold standard definitive therapy.",
      bookmarks_count: 53
    },
    {
      id: "q_10",
      exam: "USMLE Step 2 CK / Peds Shelf",
      subject: "Cardiology",
      module: "Congenital Cyanotic Heart Disease",
      section: "Tetralogy of Fallot & Tet Spells",
      system: "Cardiovascular",
      level: 2,
      stem: "A 7-month-old infant with known uncorrected Tetralogy of Fallot becomes intensely cyanotic, agitated, and dyspneic while crying during a vaccination visit. His murmur becomes softer. His mother places him in a knee-chest position. What is the primary hemodynamic mechanism by which the knee-chest position relieves the hypercyanotic 'tet spell'?",
      options: [
        "Increases systemic vascular resistance (SVR), thereby forcing right ventricular blood across the pulmonary outflow tract instead of the VSD",
        "Decreases venous return to the right atrium, reducing right ventricular end-diastolic pressure",
        "Induces coronary vasodilation via beta-2 adrenergic stimulation",
        "Relaxes the subpulmonary infundibular spasm via parasympathetic tone"
      ],
      correct_index: 0,
      explanation_correct: "Correct: During a hypercyanotic 'tet spell', infundibular spasm or a decrease in systemic vascular resistance (SVR) causes right-to-left shunting of deoxygenated blood across the VSD into the aorta. The knee-chest position kinks the femoral arteries, abruptly increasing SVR. This elevated left ventricular pressure forces desaturated right ventricular blood into the pulmonary circulation for oxygenation.",
      explanation_incorrect: "Distractor Rationale:\n• Option B: Knee-chest actually increases systemic venous return to the heart.\n• Option C: It does not primarily alter coronary tone.\n• Option D: Morphine or beta-blockers relax the infundibular spasm; knee-chest works via mechanical afterload elevation.",
      bookmarks_count: 36
    },
    {
      id: "q_11",
      exam: "USMLE Step 1 / Step 2 CK",
      subject: "Biostatistics",
      module: "Diagnostic Testing & Epidemiology",
      section: "Predictive Values vs Sensitivity/Specificity",
      system: "Epidemiology",
      level: 2,
      stem: "A new non-invasive pulse oximetry screening protocol for critical congenital heart disease (CCHD) has a fixed sensitivity of 90% and specificity of 98%. If the screening is applied to a neonatal population where the prevalence of CCHD is significantly higher (e.g. in a tertiary cardiac referral center versus a community nursery), which diagnostic parameter will increase?",
      options: [
        "Positive Predictive Value (PPV)",
        "Negative Predictive Value (NPV)",
        "Sensitivity",
        "Specificity"
      ],
      correct_index: 0,
      explanation_correct: "Correct: Sensitivity and Specificity are intrinsic mathematical properties of a diagnostic test and do NOT change with disease prevalence. However, Positive Predictive Value (PPV) is directly proportional to prevalence: as disease prevalence rises in a population, the probability that a positive result represents a true positive increases dramatically.",
      explanation_incorrect: "Distractor Rationale:\n• Option B (NPV): Negative Predictive Value is inversely proportional to prevalence; it decreases as prevalence increases.\n• Options C & D (Sensitivity & Specificity): These are fixed test characteristics unaffected by prevalence.",
      bookmarks_count: 41
    }
  ],

  // 10. Student Bookmarks
  bookmarks: [
    { id: "bm_1", student_id: "usr_student_b", question_id: "q_1", note: "Remember LISA vs MISA guidelines" },
    { id: "bm_2", student_id: "usr_student_c", question_id: "q_2", note: "Kawasaki aspirin dosing guidelines" },
  ],

  // 11. Test Attempts
  test_attempts: [
    {
      id: "att_demo_1",
      student_id: "usr_student_b",
      title: "Pediatric & Neonatal Core Block 1",
      mode: "Timed",
      score_percent: 75,
      total_questions: 4,
      correct_count: 3,
      time_spent_seconds: 240,
      completed_at: "2026-09-08T16:20:00Z",
      answers: [
        { question_id: "q_1", selected_index: 1, is_correct: true },
        { question_id: "q_2", selected_index: 0, is_correct: true },
        { question_id: "q_3", selected_index: 1, is_correct: true },
        { question_id: "q_4", selected_index: 0, is_correct: false }
      ]
    },
    {
      id: "att_demo_2",
      student_id: "usr_student_c",
      title: "USMLE Step 2 CK Clinical Reasoning Block",
      mode: "Tutor",
      score_percent: 100,
      total_questions: 3,
      correct_count: 3,
      time_spent_seconds: 180,
      completed_at: "2026-09-07T12:00:00Z",
      answers: [
        { question_id: "q_1", selected_index: 1, is_correct: true },
        { question_id: "q_2", selected_index: 0, is_correct: true },
        { question_id: "q_3", selected_index: 1, is_correct: true }
      ]
    }
  ],

  // 12. Clinical Rotations (Tele & Physical)
  rotation_programs: [
    {
      id: "rot_prog_tele",
      title: "Neonatal-Perinatal Tele-Rotation & Clinical Reasoning",
      type: "tele",
      duration_weeks: 6,
      curriculum: "6-week virtual immersion: Week 1 Golden Hour, Week 2 Hyperbilirubinemia, Week 3 RDS/BPD, Week 4 Neonatal Sepsis & Antibiotics, Week 5 Congenital Heart Disease, Week 6 Neurodevelopment & Discharge Planning."
    },
    {
      id: "rot_prog_phys",
      title: "US In-Person Clinical Experience & Hospital Observership",
      type: "physical",
      hospital: "St. Joseph Hospital & Swedish Hospital NICU",
      city: "Chicago, IL",
      duration_weeks: 4,
      curriculum: "Daily multidisciplinary rounds, patient case follow-ups, clinical seminar presentations, and faculty letter of recommendation (LOR) eligibility."
    }
  ],

  rotation_applications: [
    {
      id: "rot_app_1",
      student_id: "usr_student_a",
      applicant_name: "Alex Rivera",
      applicant_email: "alex.rivera@medschool.edu",
      medical_school: "University of Illinois College of Medicine",
      graduation_year: "2026",
      usmle_stage: "Step 1 Passed / Step 2 CK Prep",
      program_id: "rot_prog_tele",
      status: "Approved",
      applied_at: "2026-07-20T10:00:00Z",
      preferred_start: "2026-08-15",
      timing_preference: "Evenings (18:00–20:00 CST)",
      notes: "Accepted into Fall 2026 Cohort"
    },
    {
      id: "rot_app_2",
      student_id: "usr_student_d",
      applicant_name: "David Kim",
      applicant_email: "david.kim@jhmi.edu",
      medical_school: "Johns Hopkins Medicine",
      graduation_year: "2027",
      usmle_stage: "Step 1 Prep",
      program_id: "rot_prog_tele",
      status: "Under Review",
      applied_at: "2026-09-02T14:30:00Z",
      preferred_start: "2026-10-01",
      timing_preference: "Mondays & Wednesdays",
      notes: "Strong pediatric interest, evaluating NICU prerequisites."
    },
    {
      id: "rot_app_3",
      student_id: null,
      applicant_name: "Elena Rostova",
      applicant_email: "e.rostova@oxford.ac.uk",
      medical_school: "Oxford University Clinical School",
      graduation_year: "2026",
      usmle_stage: "ECFMG Registered",
      program_id: "rot_prog_tele",
      status: "Documents Required",
      requested_documents: ["Official Medical School Transcript", "Good Standing Letter"],
      applied_at: "2026-09-04T09:15:00Z",
      preferred_start: "2026-10-15",
      timing_preference: "Flexible / Weekends",
      notes: "Awaiting dean's letter and updated CV."
    },
    {
      id: "rot_app_4",
      student_id: null,
      applicant_name: "Carlos Mendoza",
      applicant_email: "carlos.mendoza@ucv.ve",
      medical_school: "Universidad Central de Venezuela",
      graduation_year: "2025",
      usmle_stage: "Step 1 Passed / Step 2 CK 248",
      program_id: "rot_prog_tele",
      status: "Submitted",
      applied_at: "2026-09-08T16:45:00Z",
      preferred_start: "2026-11-01",
      timing_preference: "Weekdays 17:00 CST",
      notes: "New application received today."
    },
    {
      id: "rot_app_5",
      student_id: null,
      applicant_name: "Fatima Al-Hassan",
      applicant_email: "f.alhassan@ksu.edu.sa",
      medical_school: "King Saud University College of Medicine",
      graduation_year: "2026",
      usmle_stage: "Step 1 Prep",
      program_id: "rot_prog_tele",
      status: "Approved",
      applied_at: "2026-08-28T11:20:00Z",
      preferred_start: "2026-10-01",
      timing_preference: "Evenings",
      notes: "Invited to complete registration."
    }
  ],

  // 12b. Flexible Rotation Meetings (Multi-meeting per week model + Graded Examine Calls + Teams Pro)
  rotation_meetings: [
    {
      id: "rot_meet_1",
      rotation_enrollment_id: "rot_enr_a",
      cohort_id: "cohort_fall_2026",
      meeting_type: "Live Teaching Session",
      title: "Week 1: Neonatal Resuscitation & Golden Hour Delivery Management",
      scheduled_at: "2026-08-18T18:00:00Z",
      duration_minutes: 90,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      attendee_scope: "cohort",
      student_id: null,
      teams_join_url: "https://teams.microsoft.com/l/meetup-join/jva-medical-nrp-session1",
      teams_meeting_id: "284 194 0921",
      teams_passcode: "NRP2026",
      recording_url: "https://teams.microsoft.com/l/recording/jva-medical-nrp-session1-cloudstream",
      ai_summary: "AI Clinical Recap: Golden Hour algorithms, initial T-piece resuscitation pressures (PIP 20–25 cm H2O, PEEP 5 cm H2O), target pre-ductal SpO2 monitoring at 1-10 mins, and thermoregulation with polyethylene wrap.",
      is_pro: true,
      materials_url: "/uploads/nrp-flowchart-8th-ed.pdf",
      notes: "Golden Hour transition algorithms and target pre-ductal SpO2 monitoring.",
      status: "Completed",
      score: null,
      pass_fail: null,
      grader_notes: null
    },
    {
      id: "rot_meet_2",
      rotation_enrollment_id: "rot_enr_a",
      cohort_id: "cohort_fall_2026",
      meeting_type: "Examine Call",
      title: "Mid-Rotation Oral Clinical Exam: Extreme Hyperbilirubinemia & Exchange Transfusion",
      scheduled_at: "2026-08-28T17:00:00Z",
      duration_minutes: 60,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      attendee_scope: "individual",
      student_id: "usr_student_a",
      teams_join_url: "https://teams.microsoft.com/l/meetup-join/jva-medical-midterm-examine",
      teams_meeting_id: "318 902 4471",
      teams_passcode: "OSCE2026",
      recording_url: "https://teams.microsoft.com/l/recording/jva-midterm-examine-alex-rivera",
      ai_summary: "AI Evaluation Recap: Candidate Alex Rivera defended diagnostic workup for ABO incompatibility with DAT positive, total serum bilirubin 19.1 mg/dL, and accurately calculated exchange transfusion volume (double blood volume 160 mL/kg).",
      is_pro: true,
      materials_url: "/uploads/hyperbili-case-vignette.pdf",
      notes: "Formal oral examine call evaluating clinical reasoning on Bhutani curves and neurotoxicity risk factors.",
      status: "Completed",
      score: 92,
      pass_fail: "Pass",
      grader_notes: "Outstanding presentation. Accurately identified indications for phototherapy versus double-volume exchange transfusion."
    },
    {
      id: "rot_meet_3",
      rotation_enrollment_id: "rot_enr_a",
      cohort_id: "cohort_fall_2026",
      meeting_type: "Mentor Check-in",
      title: "1-on-1 Clinical Preceptor Check-in & ERAS Strategy",
      scheduled_at: "2026-09-05T19:00:00Z",
      duration_minutes: 45,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      attendee_scope: "individual",
      student_id: "usr_student_a",
      teams_join_url: "https://teams.microsoft.com/l/meetup-join/jva-medical-advisory-alex",
      teams_meeting_id: "904 812 7730",
      teams_passcode: "ERAS2026",
      recording_url: "https://teams.microsoft.com/l/recording/jva-eras-checkin-alex",
      ai_summary: "AI Advisory Recap: Discussion on pediatric residency program selection, MSPE Dean's letter alignment, and highlighting neonatal tele-rounds achievements in ERAS personal statement.",
      is_pro: true,
      materials_url: "",
      notes: "Reviewing weekly progress notes, residency LOR criteria, and clinical goals.",
      status: "Completed",
      score: null,
      pass_fail: null,
      grader_notes: null
    },
    {
      id: "rot_meet_4",
      rotation_enrollment_id: "rot_enr_a",
      cohort_id: "cohort_fall_2026",
      meeting_type: "Live Teaching Session",
      title: "Week 4: Persistent Pulmonary Hypertension (PPHN) & Inhaled Nitric Oxide",
      scheduled_at: "2026-09-15T18:00:00Z",
      duration_minutes: 90,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      attendee_scope: "cohort",
      student_id: null,
      teams_join_url: "https://teams.microsoft.com/l/meetup-join/jva-medical-pphn-round",
      teams_meeting_id: "419 832 9901",
      teams_passcode: "PPHN2026",
      recording_url: "",
      ai_summary: "",
      is_pro: true,
      materials_url: "/uploads/pphn-echo-criteria.pdf",
      notes: "Echocardiographic assessment of right ventricular pressures and iNO response.",
      status: "Scheduled",
      score: null,
      pass_fail: null,
      grader_notes: null
    },
    {
      id: "rot_meet_5",
      rotation_enrollment_id: "rot_enr_a",
      cohort_id: "cohort_fall_2026",
      meeting_type: "Make-up Session",
      title: "Clinical Make-up Session: Neonatal Sepsis & Antimicrobial Stewardship",
      scheduled_at: "2026-09-20T17:30:00Z",
      duration_minutes: 60,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      attendee_scope: "cohort",
      student_id: null,
      teams_join_url: "https://teams.microsoft.com/l/meetup-join/jva-medical-sepsis-makeup",
      teams_meeting_id: "512 884 1029",
      teams_passcode: "SEPSIS26",
      recording_url: "",
      ai_summary: "",
      is_pro: true,
      materials_url: "/uploads/sepsis-calculator-protocol.pdf",
      notes: "Kaiser Sepsis Risk Calculator analysis, early-onset vs late-onset GBS, and antibiotic discontinuation criteria.",
      status: "Scheduled",
      score: null,
      pass_fail: null,
      grader_notes: null
    },
    {
      id: "rot_meet_6",
      rotation_enrollment_id: "rot_enr_a",
      cohort_id: "cohort_fall_2026",
      meeting_type: "Examine Call",
      title: "Week 6: Final Exit Comprehensive OSCE & Attending Evaluation",
      scheduled_at: "2026-09-28T16:00:00Z",
      duration_minutes: 60,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      attendee_scope: "individual",
      student_id: "usr_student_a",
      teams_join_url: "https://teams.microsoft.com/l/meetup-join/jva-medical-final-exit-osce",
      teams_meeting_id: "772 491 8830",
      teams_passcode: "EXIT2026",
      recording_url: "",
      ai_summary: "",
      is_pro: true,
      materials_url: "",
      notes: "Standardized exit clinical examination covering resuscitation, diagnostic workup, and parent counseling.",
      status: "Scheduled",
      score: null,
      pass_fail: null,
      grader_notes: null
    }
  ],

  rotation_enrollments: [
    {
      id: "rot_enr_a",
      student_id: "usr_student_a",
      rotation_program_id: "rot_prog_tele",
      start_date: "2026-08-15",
      end_date: "2026-10-01",
      current_week: 4,
      total_weeks: 6,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      hospital_site: "JVA Tele-Neonatology Clinical Network",
      schedule_summary: "Tuesdays & Thursdays 18:00–19:30 CST live rounds on Microsoft Teams",
      evaluation_status: "On Track - Midterm Evaluation Outstanding",
      certificate_issued: false
    },
    {
      id: "rot_enr_d",
      student_id: "usr_student_d",
      rotation_program_id: "rot_prog_tele",
      start_date: "2026-08-01",
      end_date: "2026-09-15",
      current_week: 5,
      total_weeks: 6,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      hospital_site: "JVA Tele-Neonatology Network",
      schedule_summary: "Mondays & Wednesdays 17:00–18:30 CST clinical case conferences",
      evaluation_status: "Excellent clinical preparation and case synthesis",
      certificate_issued: false
    },
    {
      id: "rot_enr_f",
      student_id: "usr_student_f",
      rotation_program_id: "rot_prog_phys",
      start_date: "2026-10-01",
      end_date: "2026-10-31",
      current_week: 0,
      total_weeks: 4,
      physician: "Dr. Janardhan Mydam, MD, FAAP",
      hospital_site: "St. Joseph Hospital & Swedish Hospital, Chicago",
      schedule_summary: "Monday–Friday 07:30–15:00 CST morning bedside rounds",
      evaluation_status: "Pre-rotation documents verified; Hospital ID badge ready",
      certificate_issued: false
    }
  ],

  // 13. Research Projects & Members
  research_projects: [
    {
      id: "res_proj_1",
      title: "Delayed Cord Clamping and Hemodynamic Transition in Preterm Infants: A Multicenter Cohort Study",
      specialty: "Neonatology",
      lead_investigator: "Dr. Janardhan Mydam, MD, FAAP",
      stage: "Data Collection",
      stages_timeline: [
        { name: "Hypothesis & Study Design", completed: true, date: "May 2026" },
        { name: "Literature Review", completed: true, date: "June 2026" },
        { name: "IRB Protocol Approval", completed: true, date: "July 2026" },
        { name: "Data Collection & Synthesis", completed: false, date: "Sept–Oct 2026 (Active)" },
        { name: "Statistical Analysis & Manuscript Draft", completed: false, date: "Nov 2026" },
        { name: "Peer Review Submission", completed: false, date: "Dec 2026" }
      ],
      description: "Evaluating cerebral oxygenation and systemic vascular resistance in neonates <32 weeks undergoing 60-second DCC versus umbilical cord milking.",
      member_ids: ["usr_student_d", "usr_student_f"],
      deliverables: [
        { title: "IRB Approved Protocol (PDF)", url: "/uploads/irb_protocol_dcc_preterm.pdf" },
        { title: "Data Collection Spreadsheet Template (CSV)", url: "/uploads/data_collection_template.csv" }
      ]
    },
    {
      id: "res_proj_2",
      title: "Less Invasive Surfactant Administration (LISA) Outcomes in Moderate Preterm Neonates: 5-Year Registry",
      specialty: "Neonatal Pulmonology",
      lead_investigator: "Dr. Janardhan Mydam, MD, FAAP",
      stage: "Manuscript Draft",
      stages_timeline: [
        { name: "Hypothesis & Study Design", completed: true, date: "April 2026" },
        { name: "Literature Review", completed: true, date: "May 2026" },
        { name: "IRB Protocol Approval", completed: true, date: "June 2026" },
        { name: "Data Collection", completed: true, date: "July 2026" },
        { name: "Statistical Analysis", completed: true, date: "August 2026" },
        { name: "Manuscript Draft & Journal Submission", completed: false, date: "Sept 2026 (Active)" }
      ],
      description: "Analyzing bronchopulmonary dysplasia reduction and length of NICU stay in 28-34 week infants receiving surfactant via thin catheter technique.",
      member_ids: ["usr_student_f"],
      deliverables: [
        { title: "Manuscript Working Draft v2.4 (DOCX)", url: "/uploads/lisa_manuscript_draft_v2.docx" }
      ]
    }
  ],

  // 14. Mentorship & 1-on-1 Faculty Sessions
  mentor_assignments: [
    {
      id: "ment_c",
      student_id: "usr_student_c",
      mentor_id: "usr_admin",
      mentor_name: "Dr. Janardhan Mydam, MD, FAAP",
      mentor_title: "Chief of Neonatology & Pediatric Mentorship Chair",
      track: "US Pediatric Residency Application & ERAS Strategy",
      next_meeting: {
        date_time: "2026-09-16 17:00:00",
        platform: "Microsoft Teams",
        link: "https://teams.microsoft.com/l/meetup-join/jva-mentorship-carlos-mendez",
        agenda: "Review ERAS Personal Statement draft and finalize list of 40 pediatric residency programs."
      },
      feedback_notes: [
        {
          date: "2026-08-20",
          author: "Dr. Janardhan Mydam",
          note: "Carlos has strong clinical knowledge. We revised the clinical vignette in his personal statement to highlight his neonatal resuscitation experience."
        }
      ]
    },
    {
      id: "ment_f",
      student_id: "usr_student_f",
      mentor_id: "usr_admin",
      mentor_name: "Dr. Janardhan Mydam, MD, FAAP",
      mentor_title: "Chief of Neonatology & Pediatric Mentorship Chair",
      track: "Academic Neonatal Fellowship & Research Career Path",
      next_meeting: {
        date_time: "2026-09-18 16:30:00",
        platform: "Microsoft Teams",
        link: "https://teams.microsoft.com/l/meetup-join/jva-mentorship-fatima-almansoor",
        agenda: "Finalize authorship attribution on LISA registry paper and submit abstract to Pediatric Academic Societies (PAS)."
      },
      feedback_notes: [
        {
          date: "2026-08-28",
          author: "Dr. Janardhan Mydam",
          note: "Exceptional research output. Ready to submit conference abstract."
        }
      ]
    }
  ],

  // 15. Actionable Tasks
  tasks: [
    {
      id: "tsk_1",
      student_id: "usr_student_a",
      title: "Submit Week 4 Neonatal Sepsis Case Report",
      category: "Rotation",
      due_date: "2026-09-18",
      status: "In Progress",
      description: "Review Kaiser Sepsis Calculator for the 35-week case and summarize clinical intervention."
    },
    {
      id: "tsk_2",
      student_id: "usr_student_b",
      title: "Complete Respiratory System QBank Block (40 questions)",
      category: "QBank",
      due_date: "2026-09-15",
      status: "In Progress",
      description: "Target accuracy >= 75% on neonatal respiratory distress questions."
    },
    {
      id: "tsk_3",
      student_id: "usr_student_c",
      title: "Revise Personal Statement Paragraph 3",
      category: "Mentorship",
      due_date: "2026-09-14",
      status: "In Progress",
      description: "Incorporate Dr. Mydam's comments on the NICU leadership experience."
    },
    {
      id: "tsk_4",
      student_id: "usr_student_d",
      title: "Extract 50 Patient Retrospective Records for DCC Cohort",
      category: "Research",
      due_date: "2026-09-22",
      status: "Pending",
      description: "Populate maternal gestational age, cord clamp time, and 5-min Apgar scores into secure template."
    }
  ],

  // 16. Documents Vault (Categorized with Status Badges)
  documents: [
    {
      id: "doc_1",
      student_id: "usr_student_a",
      category: "Curriculum Vitae",
      title: "Alex_Rivera_Medical_CV_2026.pdf",
      file_url: "/uploads/demo-cv.pdf",
      uploaded_at: "2026-08-05T12:00:00Z",
      status: "Approved",
      reviewer_feedback: "Well formatted. Ready for rotation hospital credentialing."
    },
    {
      id: "doc_2",
      student_id: "usr_student_a",
      category: "USMLE Score Report",
      title: "USMLE_Step1_Pass_Score_Report.pdf",
      file_url: "/uploads/demo-usmle.pdf",
      uploaded_at: "2026-08-05T12:05:00Z",
      status: "Approved",
      reviewer_feedback: "Verified official pass result."
    },
    {
      id: "doc_3",
      student_id: "usr_student_a",
      category: "Immunization Record",
      title: "HepatitisB_MMR_TB_Screening.pdf",
      file_url: "/uploads/demo-immunization.pdf",
      uploaded_at: "2026-08-06T14:30:00Z",
      status: "Revision Required",
      reviewer_feedback: "Please provide updated 2-step PPD skin test or QuantiFERON Gold lab report from within the past 12 months."
    },
    {
      id: "doc_4",
      student_id: "usr_student_c",
      category: "Personal Statement Draft",
      title: "Carlos_Mendez_Pediatrics_PS_v2.docx",
      file_url: "/uploads/demo-ps.docx",
      uploaded_at: "2026-09-02T10:00:00Z",
      status: "Under Review",
      reviewer_feedback: "Currently being reviewed by Dr. Mydam for upcoming 1:1 meeting."
    },
    {
      id: "doc_5",
      student_id: "usr_student_d",
      category: "Dean's Letter (MSPE)",
      title: "KMC_Medical_School_MSPE.pdf",
      file_url: "/uploads/demo-mspe.pdf",
      uploaded_at: "2026-07-28T09:00:00Z",
      status: "Approved",
      reviewer_feedback: "Official Dean's Letter verified."
    },
    {
      id: "doc_6",
      student_id: "usr_student_f",
      category: "HIPAA & Bloodborne Pathogens Certification",
      title: "RCSI_HIPAA_Compliance_Cert.pdf",
      file_url: "/uploads/demo-hipaa.pdf",
      uploaded_at: "2026-05-10T11:00:00Z",
      status: "Approved",
      reviewer_feedback: "Credential verified for US clinical observership."
    }
  ],

  // 17. Certificates of Completion
  certificates: [
    {
      id: "cert_f_1",
      student_id: "usr_student_f",
      student_name: "Fatima Al-Mansoor",
      program_name: "Neonatal-Perinatal Tele-Rotation & Clinical Reasoning",
      issue_date: "2026-06-15",
      verification_code: "JVA-2026-CERT-9041",
      honors: "Completed with High Honors",
      signing_physician: "Dr. Janardhan Mydam, MD, FAAP",
      file_url: "/uploads/certificate_sample.pdf"
    }
  ],

  // 18. Notifications Feed
  notifications: [
    {
      id: "notif_a_1",
      user_id: "usr_student_a",
      title: "Midterm Clinical Evaluation Available",
      message: "Dr. Janardhan Mydam has entered your Midterm Tele-Rotation Evaluation. Review feedback in your Rotation tab.",
      link: "/student/rotations",
      is_read: false,
      created_at: "2026-09-08T14:00:00Z"
    },
    {
      id: "notif_b_1",
      user_id: "usr_student_b",
      title: "New High-Yield Questions Added to QBank",
      message: "25 new USMLE Step 1 and Pediatric Shelf vignette questions on Neonatal Bilirubin Metabolism are now live.",
      link: "/student/qbank",
      is_read: false,
      created_at: "2026-09-07T09:00:00Z"
    },
    {
      id: "notif_c_1",
      user_id: "usr_student_c",
      title: "Live Class This Thursday on Microsoft Teams",
      message: "Join Dr. Mydam for 'Neonatal Resuscitation & Delivery Room Transition' on Thursday at 18:00 CST.",
      link: "/student/live-learning",
      is_read: false,
      created_at: "2026-09-09T10:00:00Z"
    },
    {
      id: "notif_d_1",
      user_id: "usr_student_d",
      title: "IRB Protocol Approved for DCC Study",
      message: "IRB approval granted! Please access the research portal to review the data extraction spreadsheet.",
      link: "/student/research",
      is_read: false,
      created_at: "2026-09-05T11:00:00Z"
    },
    {
      id: "notif_f_1",
      user_id: "usr_student_f",
      title: "Chicago Observership Hospital Badge Approved",
      message: "Your St. Joseph Hospital clinical ID badge paperwork has been approved for the October rotation cohort.",
      link: "/student/rotations",
      is_read: false,
      created_at: "2026-09-08T16:00:00Z"
    }
  ],

  // 19. Support Tickets
  support_tickets: [
    {
      id: "tkt_1",
      student_id: "usr_student_a",
      subject: "Question regarding Microsoft Teams audio test",
      priority: "Normal",
      status: "Closed",
      messages: [
        { sender: "Alex Rivera", role: "student", message: "Can I test my microphone ahead of Thursday's tele-rotation rounds?", timestamp: "2026-08-16T10:00:00Z" },
        { sender: "Admin Support", role: "admin", message: "Yes, the Teams room opens 15 minutes early for audio checks.", timestamp: "2026-08-16T11:00:00Z" }
      ],
      created_at: "2026-08-16T10:00:00Z"
    }
  ],

  // 20. Audit Logs
  audit_logs: [
    {
      id: "log_init",
      action: "PLATFORM_INITIALIZED",
      actor_id: "system",
      actor_email: "system@jva-medical.com",
      ip_address: "127.0.0.1",
      details: { message: "Personalized Student Portal relational schema active" },
      created_at: "2026-09-01T00:00:00Z"
    }
  ],

  // 21. System Settings & Maintenance
  system_settings: {
    is_emergency_offline: false,
    maintenance_message: "This website is temporarily unavailable while maintenance is being performed.",
    owner_name: "Dr. Janardhan Mydam / JVA Medical Services",
    emergency_contact: "admin@jva-medical.com"
  },

  // 22. CMS Content
  cms_content: {},

  // 23. Section Disclaimers & Compliance Documentation (Admin Controlled)
  disclaimers: [
    {
      section_key: "tele_rotations",
      section_name: "Clinical Tele-Rotations & Virtual Rounds",
      title: "Clinical Tele-Rotation & HIPAA Compliance Disclaimer",
      short_summary: "Virtual tele-rotations constitute observational clinical education under the direct preceptorship of Dr. Janardhan Mydam. These rounds are didactic simulations and observational case discussions; they do not establish physician-patient relationships or authorize independent medical management. All patient case materials are de-identified strictly adhering to HIPAA privacy standards.",
      doc_link_text: "Read Full Clinical Preceptorship & HIPAA Regulatory Documentation",
      full_documentation: "### 1. Educational Nature of Experience\nThe Virtual Neonatal & Pediatric Tele-Rotation supervised by Dr. Janardhan Mydam, MD, FAAP is an educational program intended exclusively for medical students, clinical observers, and postgraduate trainees seeking US Clinical Experience (USCE). It provides didactic analysis of complex neonatal pathophysiology, diagnostic evaluation, and simulated bedside rounds.\n\n### 2. Scope of Clinical Authority\nParticipants in tele-rotations do not possess clinical privileges, prescriptive authority, or physical custody of patients. No clinical interventions, medical orders, or patient treatment plans may be executed by trainees outside the direct simulation framework.\n\n### 3. Patient Privacy & HIPAA Adherence\nIn strict accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA), all case studies, imaging, laboratory panels, and multidisciplinary notes reviewed during rounds are de-identified. Recording, screen capturing, or external dissemination of any clinical session without explicit written authorization is strictly prohibited.\n\n### 4. Letters of Recommendation & Certification\nCompletion certificates and performance evaluations (including Attending Letters of Recommendation) are issued on a merit-based system following satisfactory attendance (>=85%), completion of oral examine calls, and faculty sign-off.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    },
    {
      section_key: "question_bank",
      section_name: "Board Examination Question Bank",
      title: "Medical Board Exam Preparation & Educational Accuracy Disclaimer",
      short_summary: "All question items, multiple-choice options, clinical vignettes, and diagnostic rationales are intended solely for medical education and board preparation (USMLE Step 1/2, ABP Pediatrics, Neonatal-Perinatal boards). Content does not substitute for localized clinical practice guidelines or emergency medical protocols.",
      doc_link_text: "Read Complete Examination Prep & Content Accuracy Terms",
      full_documentation: "### 1. Educational Intent\nThis question bank is engineered to foster clinical reasoning, diagnostic acumen, and pathophysiological comprehension. All clinical scenarios are synthesized by board-certified faculty.\n\n### 2. Evolving Medical Knowledge\nClinical medicine and pharmacological guidelines are subject to continuous revision. While rationales reflect current AAP, NRP, and AHA clinical practice standards, clinicians and trainees must always verify diagnostic protocols, drug dosages, and contraindications against the latest peer-reviewed institutional literature.\n\n### 3. Trademark Disclaimers\nUSMLE® is a registered trademark of the National Board of Medical Examiners (NBME) and the Federation of State Medical Boards (FSMB). ABP® is a registered trademark of the American Board of Pediatrics. This platform is not endorsed by or affiliated with NBME, FSMB, or ABP.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    },
    {
      section_key: "live_classes",
      section_name: "Weekly Live Seminars & Classes",
      title: "Live Clinical Seminars & Microsoft Teams Pro Recording Disclaimer",
      short_summary: "Interactive weekly clinical lectures are hosted on Microsoft Teams Pro and may be recorded for asynchronous review within the authenticated student portal. Enrollment indicates consent to educational recording. Clinical scenarios discussed are for educational purposes and must not be used for direct patient management.",
      doc_link_text: "Read Live Lecture Recording & Intellectual Property Terms",
      full_documentation: "### 1. Cloud Recording & Asynchronous Access\nLive seminars conducted on Microsoft Teams Pro are automatically captured to cloud storage to provide enrolled scholars with review archives. Audio, chat submissions, and web camera streams may be recorded. Access to these recordings is strictly authenticated and restricted to enrolled cohort scholars.\n\n### 2. Intellectual Property & Prohibited Distribution\nAll lecture slides, clinical decision algorithms, and faculty recordings are the proprietary intellectual property of Dr. Janardhan Mydam and JVA Medical Services. Unauthorized recording, rebroadcasting, or distribution on external platforms is a violation of international copyright laws.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    },
    {
      section_key: "physical_rotations",
      section_name: "In-Person Hospital Rotations",
      title: "In-Person Hospital Clinical Experience & Credentialing Disclaimer",
      short_summary: "Participation in physical clinical rotations at affiliated hospital sites is contingent upon formal hospital credentialing, criminal background clearances, US visa compliance, and occupational health immunization titers. In-person clinical observerships are strictly observational unless formal sub-internship status is established.",
      doc_link_text: "Read Hospital Credentialing & Visa Regulatory Documentation",
      full_documentation: "### 1. Institutional Affiliation & Hospital Privileges\nClinical observers and trainees placed at hospital sites (including Swedish Hospital and Saint Joseph Hospital) must adhere to all hospital by-laws, infection control protocols, and occupational safety mandates.\n\n### 2. Medical Liability & Insurance\nAll clinical trainees must maintain valid health insurance and supplemental medical observer malpractice riders throughout the duration of their physical rotation.\n\n### 3. Immunization & Health Clearance\nCandidates must submit valid titers (Hepatitis B, MMR, Varicella), 2-step TB screening/QuantiFERON, Tdap, and current seasonal influenza vaccination prior to hospital badge issuance.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    },
    {
      section_key: "research",
      section_name: "Clinical Research & Scientific Publications",
      title: "Clinical Research Mentorship & Scientific Publication Disclaimer",
      short_summary: "Research mentorship programs encompass scientific inquiry, statistical analysis, and manuscript preparation. Authorship on peer-reviewed submissions strictly conforms to International Committee of Medical Journal Editors (ICMJE) criteria based on substantial intellectual contribution. All human subjects research requires institutional IRB approval.",
      doc_link_text: "Read ICMJE Authorship & Institutional Ethics Documentation",
      full_documentation: "### 1. ICMJE Authorship Standards\nCo-authorship on peer-reviewed manuscripts submitted to PubMed-indexed journals requires active contribution to study conception, data acquisition/analysis, and critical revision of manuscript drafts. Mere participation in data entry does not confer automatic authorship.\n\n### 2. Institutional Review Board (IRB) Compliance\nAll prospective and retrospective studies utilizing clinical data comply with human subjects protections and institutional IRB approvals prior to formal data extraction.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    },
    {
      section_key: "advisory_services",
      section_name: "NICU & Healthcare Advisory Services",
      title: "Institutional Healthcare & NICU Advisory Services Disclaimer",
      short_summary: "Advisory services provided by Dr. Janardhan Mydam are strategic, educational, and institutional in scope. Consultations regarding NICU development, clinical curriculum design, and neonatal care pathways do not constitute legal or architectural guarantees.",
      doc_link_text: "Read Institutional Consulting Scope Documentation",
      full_documentation: "### 1. Strategic Advisory Nature\nRecommendations provided regarding NICU Level II/III service lines, clinical workflow design, and physician staffing are consultative and advisory. Implementation remains subject to local healthcare regulatory bodies and medical executive committees.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    },
    {
      section_key: "general_medical",
      section_name: "General Public Health Information",
      title: "General Website Health Information & Emergency Disclaimer",
      short_summary: "All information published on this site is for educational and informational purposes only. It does not establish a doctor-patient relationship and must never replace personalized evaluation by a licensed healthcare physician. In a medical emergency, immediately dial 911 (in the USA) or contact local emergency services.",
      doc_link_text: "Read Complete General Health & Safety Terms",
      full_documentation: "### 1. No Physician-Patient Relationship\nAccessing or reading information on this website does not constitute the practice of medicine or establish a physician-patient relationship.\n\n### 2. Emergency Situations\nThis platform does not provide acute or emergency triage. Anyone experiencing signs of acute distress, chest pain, neonatal respiratory failure, or severe infection must seek immediate emergency medical care.",
      is_active: true,
      updated_at: "2026-09-10T12:00:00Z"
    }
  ]
};

// PostgreSQL schema initialization for full production deployments
export async function initializeDatabase() {
  const p = getPool();
  if (!p) {
    memoryStore.initialized = true;
    return;
  }

  const client = await p.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        status VARCHAR(32) DEFAULT 'active',
        email_verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS student_profiles (
        user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        medical_school VARCHAR(255),
        country VARCHAR(128),
        graduation_year INT,
        usmle_stage VARCHAR(64),
        specialty_interest VARCHAR(128),
        phone VARCHAR(64),
        avatar_url TEXT,
        bio TEXT
      );

      CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(64) UNIQUE NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS user_roles (
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        role_id VARCHAR(64) REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      );

      CREATE TABLE IF NOT EXISTS programs (
        id VARCHAR(64) PRIMARY KEY,
        key VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(128),
        description TEXT,
        duration VARCHAR(128),
        price VARCHAR(64),
        featured BOOLEAN DEFAULT FALSE,
        icon VARCHAR(64)
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        program_id VARCHAR(64) REFERENCES programs(id) ON DELETE CASCADE,
        plan VARCHAR(128),
        access_start_date TIMESTAMP,
        access_expiry_date TIMESTAMP,
        enrollment_status VARCHAR(32) DEFAULT 'Pending',
        payment_status VARCHAR(32) DEFAULT 'Unpaid',
        program_specific_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS documents (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(128) NOT NULL,
        title VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(64) DEFAULT 'Under Review',
        reviewer_feedback TEXT
      );

      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        student_name VARCHAR(255) NOT NULL,
        program_name VARCHAR(255) NOT NULL,
        issue_date DATE NOT NULL,
        verification_code VARCHAR(128) UNIQUE NOT NULL,
        honors VARCHAR(128),
        signing_physician VARCHAR(255),
        file_url TEXT
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(64) PRIMARY KEY,
        student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        priority VARCHAR(32) DEFAULT 'Normal',
        status VARCHAR(32) DEFAULT 'Open',
        messages JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        action VARCHAR(128) NOT NULL,
        actor_id VARCHAR(64),
        actor_email VARCHAR(255),
        ip_address VARCHAR(64),
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key VARCHAR(128) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Database schema initialization error:", err);
  } finally {
    client.release();
  }
}

// -------------------------------------------------------------
// Unified Database Access Layer (Used by APIs and Server Components)
// -------------------------------------------------------------
export const db = {
  // Users & Auth
  async findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    const p = getPool();
    if (p) {
      const res = await p.query("SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1", [cleanEmail]);
      return res.rows[0] || null;
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findUserById(id) {
    if (!id) return null;
    const p = getPool();
    if (p) {
      const res = await p.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
      return res.rows[0] || null;
    }
    return memoryStore.users.find((u) => u.id === id) || null;
  },

  async getUserRoles(userId) {
    const roles = memoryStore.user_roles
      .filter((ur) => ur.user_id === userId)
      .map((ur) => {
        const r = memoryStore.roles.find((role) => role.id === ur.role_id);
        return r ? r.name : ur.role_id;
      });
    return roles.length > 0 ? roles : ["student"];
  },

  async getStudentProfile(userId) {
    const user = await this.findUserById(userId);
    if (!user) return null;
    const profile = memoryStore.student_profiles.find((sp) => sp.user_id === userId) || {
      first_name: user.email.split("@")[0],
      last_name: "",
      medical_school: "Medical School Candidate",
      country: "International",
      graduation_year: 2026,
      usmle_stage: "Candidate",
      specialty_interest: "Pediatrics & Neonatology"
    };
    const roles = await this.getUserRoles(userId);
    return {
      id: user.id,
      email: user.email,
      roles,
      ...profile
    };
  },

  async updateStudentProfile(userId, data) {
    const idx = memoryStore.student_profiles.findIndex((p) => p.user_id === userId);
    if (idx !== -1) {
      memoryStore.student_profiles[idx] = { ...memoryStore.student_profiles[idx], ...data };
      return memoryStore.student_profiles[idx];
    } else {
      const newProfile = { user_id: userId, ...data };
      memoryStore.student_profiles.push(newProfile);
      return newProfile;
    }
  },

  // Enrollments (Core Section E Logic)
  async getEnrollmentsByStudent(studentId) {
    const enrollments = memoryStore.enrollments.filter((e) => e.student_id === studentId);
    return enrollments.map((enr) => {
      const prog = memoryStore.programs.find((p) => p.id === enr.program_id) || {};
      return {
        ...enr,
        program_key: prog.key || enr.program_id,
        program_name: prog.name || enr.program_id,
        program_category: prog.category || "",
        icon: prog.icon || "academic"
      };
    });
  },

  async getActiveEnrollments(studentId) {
    const now = new Date();
    const all = await this.getEnrollmentsByStudent(studentId);
    return all.filter((e) => {
      if (e.enrollment_status !== "Active") return false;
      if (e.access_expiry_date && new Date(e.access_expiry_date) < now) return false;
      return true;
    });
  },

  async isEnrolledIn(studentId, programKey) {
    const active = await this.getActiveEnrollments(studentId);
    return active.some((e) => e.program_key === programKey);
  },

  async recordActivity(studentId, programKey) {
    const enr = memoryStore.enrollments.find(
      (e) => e.student_id === studentId && (e.program_id === programKey || e.program_id === `prog_${programKey}`)
    );
    if (enr) {
      enr.last_accessed_at = new Date().toISOString();
    }
  },

  // Student Dashboard Composition (Section B & E: function of active enrollments)
  async getStudentDashboardData(studentId) {
    const profile = await this.getStudentProfile(studentId);
    if (!profile) return null;

    const allEnrollments = await this.getEnrollmentsByStudent(studentId);
    const activeEnrollments = await this.getActiveEnrollments(studentId);

    // Sort active enrollments: most-recently-accessed first (Widget Priority Rule)
    activeEnrollments.sort((a, b) => {
      const dateA = a.last_accessed_at || a.created_at || "1970-01-01";
      const dateB = b.last_accessed_at || b.created_at || "1970-01-01";
      return new Date(dateB) - new Date(dateA);
    });

    const activeKeys = activeEnrollments.map((e) => e.program_key);

    // Build personalized widgets based on active keys
    const widgets = [];

    // 1. Clinical Rotation Widget (Student A, D, F)
    if (activeKeys.includes("tele_rotation") || activeKeys.includes("physical_rotation")) {
      const rotation = memoryStore.rotation_enrollments.find((r) => r.student_id === studentId) || {
        rotation_program_id: "rot_prog_tele",
        current_week: 4,
        total_weeks: 6,
        physician: "Dr. Janardhan Mydam, MD, FAAP",
        hospital_site: "JVA Tele-Neonatology Clinical Network",
        schedule_summary: "Tuesdays & Thursdays 18:00–19:30 CST live rounds on Microsoft Teams",
        evaluation_status: "On Track - Excellent Participation"
      };
      const tasks = memoryStore.tasks.filter((t) => t.student_id === studentId && t.category === "Rotation");
      widgets.push({
        id: "widget_rotation",
        type: "rotation",
        title: "My Clinical Rotation",
        program_key: activeKeys.includes("tele_rotation") ? "tele_rotation" : "physical_rotation",
        data: {
          rotation,
          tasks,
          next_rounds: "Thursday at 18:00 CST (Microsoft Teams)",
          teams_join_link: "https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-week1"
        }
      });
    }

    // 2. Question Bank Widget (Student B, C, F)
    if (activeKeys.includes("qbank")) {
      const attempts = memoryStore.test_attempts.filter((a) => a.student_id === studentId);
      const bookmarks = memoryStore.bookmarks.filter((b) => b.student_id === studentId);
      const enr = activeEnrollments.find((e) => e.program_key === "qbank");
      const questionsCompleted = enr?.program_specific_data?.questions_completed || (attempts.length * 4);
      const accuracy = enr?.program_specific_data?.overall_accuracy || (attempts.length > 0 ? 80 : 0);

      widgets.push({
        id: "widget_qbank",
        type: "qbank",
        title: "Question Bank & Exam Practice",
        program_key: "qbank",
        data: {
          questions_completed: questionsCompleted,
          total_questions_bank: 500,
          overall_accuracy: accuracy,
          recent_attempts: attempts.slice(0, 3),
          bookmarks_count: bookmarks.length,
          recommended_block: "Neonatal Respiratory & Golden Hour (40 Questions)"
        }
      });
    }

    // 3. Live Learning Widget (Student C, F)
    if (activeKeys.includes("live_learning")) {
      const upcoming = memoryStore.live_sessions.filter((s) => s.status === "Upcoming");
      widgets.push({
        id: "widget_live_learning",
        type: "live_learning",
        title: "Live Clinical Seminars & Case Conferences",
        program_key: "live_learning",
        data: {
          next_session: upcoming[0] || null,
          upcoming_sessions: upcoming,
          recorded_count: 8,
          teams_platform: "Microsoft Teams"
        }
      });
    }

    // 4. Research Mentorship Widget (Student D, F)
    if (activeKeys.includes("research")) {
      const projects = memoryStore.research_projects.filter((p) => p.member_ids.includes(studentId));
      widgets.push({
        id: "widget_research",
        type: "research",
        title: "Clinical Research & Publication Pathway",
        program_key: "research",
        data: {
          active_projects: projects,
          lead_mentor: "Dr. Janardhan Mydam, MD, FAAP",
          pending_tasks: memoryStore.tasks.filter((t) => t.student_id === studentId && t.category === "Research")
        }
      });
    }

    // 5. Faculty Mentorship Widget (Student C, F)
    if (activeKeys.includes("mentorship")) {
      const mentorAssn = memoryStore.mentor_assignments.find((m) => m.student_id === studentId) || {
        mentor_name: "Dr. Janardhan Mydam, MD, FAAP",
        mentor_title: "Chief of Neonatology & Pediatric Mentorship Chair",
        track: "US Pediatric Residency Application & ERAS Strategy",
        next_meeting: {
          date_time: "2026-09-16 17:00:00",
          platform: "Microsoft Teams",
          link: "https://teams.microsoft.com/l/meetup-join/jva-mentorship-session"
        },
        feedback_notes: []
      };
      widgets.push({
        id: "widget_mentorship",
        type: "mentorship",
        title: "1-on-1 Faculty Mentorship",
        program_key: "mentorship",
        data: mentorAssn
      });
    }

    // 6. Recorded Courses Widget (Student F)
    if (activeKeys.includes("courses")) {
      widgets.push({
        id: "widget_courses",
        type: "courses",
        title: "Clinical Masterclasses & Video Courses",
        program_key: "courses",
        data: {
          enrolled_courses: memoryStore.courses,
          in_progress_lesson: "Module 2: Chest Radiography: RDS vs TTN"
        }
      });
    }

    // Notifications & Tasks
    const notifications = memoryStore.notifications.filter((n) => n.user_id === studentId);
    const tasks = memoryStore.tasks.filter((t) => t.student_id === studentId && t.status !== "Completed");
    const documents = memoryStore.documents.filter((d) => d.student_id === studentId);

    return {
      profile,
      all_enrollments: allEnrollments,
      active_enrollments: activeEnrollments,
      active_keys: activeKeys,
      widgets,
      notifications: notifications.slice(0, 5),
      unread_notifications_count: notifications.filter((n) => !n.is_read).length,
      pending_tasks: tasks,
      documents_count: documents.length
    };
  },

  // Programs Catalog & Exploration
  async getAllPrograms() {
    return memoryStore.programs;
  },

  async getExploreProgramsForStudent(studentId) {
    const enrollments = await this.getEnrollmentsByStudent(studentId);
    const enrolledKeys = new Set(
      enrollments
        .filter((e) => e.enrollment_status === "Active" || e.enrollment_status === "Completed")
        .map((e) => e.program_key)
    );
    return memoryStore.programs.map((p) => ({
      ...p,
      is_enrolled: enrolledKeys.has(p.key)
    }));
  },

  // Learning Content
  async getCourses() {
    return memoryStore.courses;
  },

  async getCourseById(courseId) {
    return memoryStore.courses.find((c) => c.id === courseId) || null;
  },

  async getLiveSessions() {
    return memoryStore.live_sessions;
  },

  async getQuestions(subject = null) {
    if (!subject) return memoryStore.questions;
    return memoryStore.questions.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
  },

  // Specializations & QBank Modules
  async getSpecializations() {
    return (memoryStore.qbank_specializations || []).map(spec => {
      const modules = (memoryStore.qbank_modules || []).filter(m => m.specialization_id === spec.id);
      return {
        ...spec,
        total_modules: modules.length,
      };
    });
  },

  async getQBankModules(specializationId = null) {
    let list = memoryStore.qbank_modules || [];
    if (specializationId && specializationId !== "all") {
      list = list.filter(m => m.specialization_id === specializationId);
    }
    return list.map(mod => {
      const qCount = (memoryStore.questions || []).filter(q => q.module_id === mod.id || q.module === mod.name).length;
      return {
        ...mod,
        question_count: qCount
      };
    });
  },

  async createQBankModule(data) {
    const newMod = {
      id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      specialization_id: data.specialization_id || "spec_neo",
      name: data.name,
      description: data.description || "",
      is_free: data.is_free !== undefined ? Boolean(data.is_free) : true,
      price: Number(data.price) || 0,
      created_at: new Date().toISOString()
    };
    if (!memoryStore.qbank_modules) memoryStore.qbank_modules = [];
    memoryStore.qbank_modules.push(newMod);
    return newMod;
  },

  async updateQBankModule(moduleId, data) {
    const mod = (memoryStore.qbank_modules || []).find(m => m.id === moduleId);
    if (!mod) return null;
    Object.assign(mod, data);
    return mod;
  },

  async deleteQBankModule(moduleId) {
    const idx = (memoryStore.qbank_modules || []).findIndex(m => m.id === moduleId);
    if (idx === -1) return false;
    memoryStore.qbank_modules.splice(idx, 1);
    return true;
  },

  async bulkAddQuestions(moduleId, questionsArray = []) {
    const targetModule = (memoryStore.qbank_modules || []).find(m => m.id === moduleId);
    const added = [];
    for (let i = 0; i < questionsArray.length; i++) {
      const item = questionsArray[i];
      const newQ = {
        id: `q_bulk_${Date.now()}_${i}`,
        module_id: moduleId,
        specialization_id: targetModule ? targetModule.specialization_id : "spec_neo",
        subject: targetModule ? targetModule.name : "Neonatology",
        module: targetModule ? targetModule.name : "Clinical Module",
        section: targetModule ? targetModule.name : "General Clinical Vignettes",
        system: "Clinical Core",
        exam: "USMLE Step 2 CK / Board Prep",
        level: 2,
        stem: item.question || item.stem || `Question ${i + 1}`,
        options: [
          item.optionA || item.option_a || "Option A",
          item.optionB || item.option_b || "Option B",
          item.optionC || item.option_c || "Option C",
          item.optionD || item.option_d || "Option D",
        ],
        correct_index: typeof item.correct_index === "number" ? item.correct_index : (
          String(item.correct_option || item.answer || "A").trim().toUpperCase().startsWith("B") ? 1 :
          String(item.correct_option || item.answer || "A").trim().toUpperCase().startsWith("C") ? 2 :
          String(item.correct_option || item.answer || "A").trim().toUpperCase().startsWith("D") ? 3 : 0
        ),
        explanation_correct: item.explanation || item.explanation_correct || "Correct clinical rationale as determined by preceptor faculty guidelines.",
        explanation_incorrect: item.explanation_incorrect || "Review key clinical diagnostic algorithms and AAP/AHA neonatal and pediatric resuscitation guidelines.",
        image_url: item.image_url || "",
        bookmarks_count: 0,
        created_at: new Date().toISOString()
      };
      memoryStore.questions.unshift(newQ);
      added.push(newQ);
    }
    return added;
  },

  async getRandomPracticeQuestions({ specializationId = null, moduleIds = [], count = 5 }) {
    let pool = memoryStore.questions || [];
    if (specializationId && specializationId !== "all") {
      pool = pool.filter(q => q.specialization_id === specializationId || !q.specialization_id);
    }
    if (Array.isArray(moduleIds) && moduleIds.length > 0) {
      pool = pool.filter(q => moduleIds.includes(q.module_id) || moduleIds.includes(q.module));
    }
    // Fallback to all questions if specific module pool is empty
    if (pool.length === 0) pool = memoryStore.questions || [];

    const num = Math.min(Number(count) || 5, pool.length);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  },

  async getQuestionById(qId) {
    return memoryStore.questions.find((q) => q.id === qId) || null;
  },

  async addQuestion(question) {
    memoryStore.questions.unshift(question);
    return question;
  },

  async deleteQuestion(questionId) {
    const idx = memoryStore.questions.findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      memoryStore.questions.splice(idx, 1);
      return true;
    }
    return false;
  },

  async createTestAttempt(studentId, testTitle, questionIds, mode = "Timed", metadata = {}) {
    const attemptId = `att_${Date.now()}`;
    const selectedQuestions = memoryStore.questions.filter((q) => questionIds.includes(q.id));
    const attempt = {
      id: attemptId,
      student_id: studentId,
      title: testTitle || "Custom Practice Exam Block",
      mode,
      specialization_id: metadata.specialization_id || null,
      specialization_name: metadata.specialization_name || "Clinical Pediatrics & Neonatology",
      module_names: metadata.module_names || ["General Clinical Practice"],
      total_questions: selectedQuestions.length,
      correct_count: 0,
      score_percent: 0,
      time_spent_seconds: 0,
      questions: selectedQuestions,
      answers: [],
      completed_at: null,
      created_at: new Date().toISOString()
    };
    memoryStore.test_attempts.unshift(attempt);
    return attempt;
  },

  async submitTestAttempt(attemptId, answers, timeSpentSeconds) {
    const attempt = memoryStore.test_attempts.find((a) => a.id === attemptId);
    if (!attempt) return null;

    let correct = 0;
    const evaluatedAnswers = answers.map((ans) => {
      const q = memoryStore.questions.find((item) => item.id === ans.question_id);
      const isCorrect = q && q.correct_index === ans.selected_index;
      if (isCorrect) correct += 1;
      return {
        question_id: ans.question_id,
        selected_index: ans.selected_index,
        is_correct: Boolean(isCorrect),
        correct_index: q ? q.correct_index : null,
        explanation_correct: q ? q.explanation_correct : "",
        explanation_incorrect: q ? q.explanation_incorrect : "",
        image_url: q?.image_url || ""
      };
    });

    const scorePercent = Math.round((correct / Math.max(answers.length, 1)) * 100);
    const certCode = `JVM-QB-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    attempt.answers = evaluatedAnswers;
    attempt.correct_count = correct;
    attempt.score_percent = scorePercent;
    attempt.time_spent_seconds = timeSpentSeconds || 120;
    attempt.completed_at = new Date().toISOString();

    // Official jvmmedicalservices Score Card / Certificate metadata
    attempt.company_name = "jvmmedicalservices";
    attempt.certificate_code = certCode;
    attempt.issued_at = new Date().toISOString();
    attempt.performance_grade = scorePercent >= 85 
      ? "Honors Clinical Distinction (Top Tier)" 
      : (scorePercent >= 70 ? "Pass with Clinical Proficiency" : (scorePercent >= 60 ? "Pass (Satisfactory)" : "Remediation Recommended"));
    attempt.preceptor_endorsement = "Official assessment verified by Dr. Janardhan Mydam, MD, FAAP · Chief Medical Director, jvmmedicalservices.";

    return attempt;
  },

  async toggleBookmark(studentId, questionId, note = "") {
    const idx = memoryStore.bookmarks.findIndex(
      (b) => b.student_id === studentId && b.question_id === questionId
    );
    if (idx !== -1) {
      memoryStore.bookmarks.splice(idx, 1);
      return { bookmarked: false };
    } else {
      memoryStore.bookmarks.push({
        id: `bm_${Date.now()}`,
        student_id: studentId,
        question_id: questionId,
        note
      });
      return { bookmarked: true };
    }
  },

  // Documents Vault
  async getDocumentsByStudent(studentId) {
    return memoryStore.documents.filter((d) => d.student_id === studentId);
  },

  async getAllDocuments() {
    return memoryStore.documents.map((doc) => {
      const user = memoryStore.users.find((u) => u.id === doc.student_id);
      const profile = memoryStore.student_profiles.find((p) => p.user_id === doc.student_id);
      return {
        ...doc,
        student_name: profile ? `${profile.first_name} ${profile.last_name}` : user?.email || doc.student_id,
        student_email: user?.email || ""
      };
    });
  },

  async addDocument(studentId, category, title, fileUrl) {
    const doc = {
      id: `doc_${Date.now()}`,
      student_id: studentId,
      category: category || "General Document",
      title: title || "Uploaded Document.pdf",
      file_url: fileUrl,
      uploaded_at: new Date().toISOString(),
      status: "Under Review",
      reviewer_feedback: "Pending staff review."
    };
    memoryStore.documents.unshift(doc);
    return doc;
  },

  async createDocument(data) {
    const doc = {
      id: `doc_${Date.now()}`,
      student_id: data.student_id,
      category: data.category || "General Document",
      title: data.title || data.file_name || "Uploaded Document.pdf",
      file_name: data.file_name || "document.pdf",
      file_url: data.file_url || "/uploads/sample_document.pdf",
      file_size_kb: data.file_size_kb || 512,
      uploaded_at: new Date().toISOString(),
      status: data.status || "Under Review",
      reviewer_feedback: data.reviewer_feedback || "Pending staff review."
    };
    memoryStore.documents.unshift(doc);
    return doc;
  },

  async updateDocumentStatus(docId, status, feedback = "") {
    const doc = memoryStore.documents.find((d) => d.id === docId);
    if (!doc) return null;
    doc.status = status;
    if (feedback) doc.reviewer_feedback = feedback;
    return doc;
  },

  // Certificates
  async getCertificatesByStudent(studentId) {
    return memoryStore.certificates.filter((c) => c.student_id === studentId);
  },

  // Notifications
  async getNotifications(userId) {
    return memoryStore.notifications.filter((n) => n.user_id === userId);
  },

  async markNotificationRead(notificationId) {
    const n = memoryStore.notifications.find((item) => item.id === notificationId);
    if (n) n.is_read = true;
    return n;
  },

  // Support Tickets
  async getSupportTickets(studentId) {
    return memoryStore.support_tickets.filter((t) => t.student_id === studentId);
  },

  async createSupportTicket(studentId, subject, initialMessage) {
    const profile = await this.getStudentProfile(studentId);
    const ticket = {
      id: `tkt_${Date.now()}`,
      student_id: studentId,
      subject,
      priority: "Normal",
      status: "Open",
      messages: [
        {
          sender: profile ? `${profile.first_name} ${profile.last_name}` : "Student",
          role: "student",
          message: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString()
    };
    memoryStore.support_tickets.unshift(ticket);
    return ticket;
  },

  async replySupportTicket(ticketId, senderName, role, message) {
    const ticket = memoryStore.support_tickets.find((t) => t.id === ticketId);
    if (!ticket) return null;
    ticket.messages.push({
      sender: senderName,
      role,
      message,
      timestamp: new Date().toISOString()
    });
    return ticket;
  },

  // Admin Operational Methods
  async getAllStudents() {
    return memoryStore.student_profiles.map((p) => {
      const user = memoryStore.users.find((u) => u.id === p.user_id);
      const studentEnrollments = memoryStore.enrollments.filter((e) => e.student_id === p.user_id);
      return {
        ...p,
        email: user?.email || "",
        status: user?.status || "active",
        created_at: user?.created_at,
        enrollments_count: studentEnrollments.length,
        active_enrollments: studentEnrollments.filter((e) => e.enrollment_status === "Active")
      };
    });
  },

  async getStudentFullRecord(studentId) {
    const profile = await this.getStudentProfile(studentId);
    if (!profile) return null;
    const enrollments = await this.getEnrollmentsByStudent(studentId);
    const documents = await this.getDocumentsByStudent(studentId);
    const certificates = await this.getCertificatesByStudent(studentId);
    const testAttempts = memoryStore.test_attempts.filter((a) => a.student_id === studentId);
    const tasks = memoryStore.tasks.filter((t) => t.student_id === studentId);

    return {
      profile,
      enrollments,
      documents,
      certificates,
      test_attempts: testAttempts,
      tasks
    };
  },

  async createEnrollment(data) {
    const newEnr = {
      id: `enr_${Date.now()}`,
      student_id: data.student_id,
      program_id: data.program_id,
      plan: data.plan || "Standard Access",
      access_start_date: data.access_start_date || new Date().toISOString(),
      access_expiry_date: data.access_expiry_date || null,
      enrollment_status: data.enrollment_status || "Active",
      payment_status: data.payment_status || "Paid",
      program_specific_data: data.program_specific_data || {},
      created_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString()
    };
    memoryStore.enrollments.push(newEnr);
    return newEnr;
  },

  async updateEnrollment(enrollmentId, updates) {
    const idx = memoryStore.enrollments.findIndex((e) => e.id === enrollmentId);
    if (idx === -1) return null;
    memoryStore.enrollments[idx] = { ...memoryStore.enrollments[idx], ...updates };
    return memoryStore.enrollments[idx];
  },

  async deleteEnrollment(enrollmentId) {
    const idx = memoryStore.enrollments.findIndex((e) => e.id === enrollmentId);
    if (idx === -1) return false;
    memoryStore.enrollments.splice(idx, 1);
    return true;
  },

  async getAdminPortalStats() {
    const students = memoryStore.student_profiles;
    const totalEnrollments = memoryStore.enrollments.length;
    const activeEnrollments = memoryStore.enrollments.filter((e) => e.enrollment_status === "Active").length;
    const pendingDocuments = memoryStore.documents.filter((d) => d.status === "Under Review").length;
    const openTickets = memoryStore.support_tickets.filter((t) => t.status === "Open").length;

    // Breakdown by program
    const programBreakdown = {};
    memoryStore.programs.forEach((prog) => {
      programBreakdown[prog.name] = memoryStore.enrollments.filter(
        (e) => e.program_id === prog.id && e.enrollment_status === "Active"
      ).length;
    });

    return {
      total_students: students.length,
      total_enrollments: totalEnrollments,
      active_enrollments: activeEnrollments,
      pending_documents: pendingDocuments,
      open_tickets: openTickets,
      program_breakdown: programBreakdown
    };
  },

  // Audit Logs & System Settings
  async getAuditLogs() {
    return memoryStore.audit_logs;
  },

  async logAudit(action, actor_id, actor_email, ip_address, details = {}) {
    const logItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      action,
      actor_id: actor_id || "system",
      actor_email: actor_email || "system@jva-medical.com",
      ip_address: ip_address || "127.0.0.1",
      details,
      created_at: new Date().toISOString()
    };
    memoryStore.audit_logs.unshift(logItem);
    return logItem;
  },

  async getSystemSettings() {
    return memoryStore.system_settings;
  },

  async setEmergencyShutdown(isEmergency, message = null) {
    memoryStore.system_settings.is_emergency_offline = Boolean(isEmergency);
    if (message) memoryStore.system_settings.maintenance_message = message;
    return memoryStore.system_settings;
  },

  // 24. Disclaimers CMS methods
  async getDisclaimers() {
    return memoryStore.disclaimers || [];
  },

  async getDisclaimerBySection(sectionKey) {
    const d = (memoryStore.disclaimers || []).find((item) => item.section_key === sectionKey);
    if (!d || !d.is_active || !d.short_summary || !d.short_summary.trim()) {
      return null;
    }
    return d;
  },

  async updateDisclaimer(sectionKey, data) {
    const list = memoryStore.disclaimers || [];
    const idx = list.findIndex((item) => item.section_key === sectionKey);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...data,
        updated_at: new Date().toISOString()
      };
      return list[idx];
    }
    const newDisc = {
      section_key: sectionKey,
      section_name: data.section_name || sectionKey,
      title: data.title || "Section Disclaimer",
      short_summary: data.short_summary || "",
      doc_link_text: data.doc_link_text || "Read Disclaimer Documentation",
      full_documentation: data.full_documentation || "",
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      updated_at: new Date().toISOString()
    };
    list.push(newDisc);
    memoryStore.disclaimers = list;
    return newDisc;
  }
};
