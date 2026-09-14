import { readFileSync } from "fs";

// Load .env.local manually if not in process.env
if (!process.env.DATABASE_URL) {
  try {
    const envContent = readFileSync(".env.local", "utf8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2]?.trim() || "";
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  } catch (e) {
    console.error("Could not load .env.local", e);
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set!");
  process.exit(1);
}

const parsed = new URL(DATABASE_URL);
const NEON_SQL_ENDPOINT = `https://${parsed.host}/sql`;

import { execFileSync } from "child_process";

async function neonQuery(sql, params = []) {
  const body = JSON.stringify({ query: sql, params });
  const stdout = execFileSync("curl", [
    "-4", "-s", "-X", "POST", NEON_SQL_ENDPOINT,
    "-H", `Neon-Connection-String: ${DATABASE_URL}`,
    "-H", "Content-Type: application/json",
    "-d", body,
  ], { maxBuffer: 10 * 1024 * 1024 });

  const text = stdout.toString();
  try {
    const json = JSON.parse(text);
    if (json.message && json.message.includes("error")) {
      throw new Error(json.message);
    }
    return json;
  } catch (err) {
    throw new Error(`Neon SQL failed: ${text}`);
  }
}

async function main() {
  console.log("=== Starting Neon DB Migration & Seeding ===");
  console.log("Neon Host:", parsed.host);

  // 1. Create Schema Tables
  console.log("\n1. Creating Tables in Neon DB...");
  const tableStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      status VARCHAR(32) DEFAULT 'active',
      email_verified_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS student_profiles (
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
    );`,
    `CREATE TABLE IF NOT EXISTS roles (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(64) UNIQUE NOT NULL,
      description TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS user_roles (
      user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      role_id VARCHAR(64) REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );`,
    `CREATE TABLE IF NOT EXISTS programs (
      id VARCHAR(64) PRIMARY KEY,
      key VARCHAR(64) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(128),
      description TEXT,
      duration VARCHAR(128),
      price VARCHAR(64),
      featured BOOLEAN DEFAULT FALSE,
      icon VARCHAR(64)
    );`,
    `CREATE TABLE IF NOT EXISTS enrollments (
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS applications (
      id VARCHAR(64) PRIMARY KEY,
      student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      program_type VARCHAR(64) NOT NULL,
      desired_month VARCHAR(64),
      year INT,
      cv_file_url TEXT,
      statement_of_intent TEXT,
      admin_notes TEXT,
      status VARCHAR(32) DEFAULT 'Pending',
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS live_classes (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      instructor_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
      topic VARCHAR(255),
      description TEXT,
      scheduled_at TIMESTAMP NOT NULL,
      duration_minutes INT DEFAULT 60,
      meeting_url TEXT,
      recording_url TEXT,
      pricing_type VARCHAR(32) DEFAULT 'Free',
      price VARCHAR(64) DEFAULT '$0',
      materials JSONB,
      status VARCHAR(32) DEFAULT 'Scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS live_class_registrations (
      id VARCHAR(64) PRIMARY KEY,
      class_id VARCHAR(64) REFERENCES live_classes(id) ON DELETE CASCADE,
      student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      attendance_status VARCHAR(32) DEFAULT 'Registered',
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (class_id, student_id)
    );`,
    `CREATE TABLE IF NOT EXISTS question_modules (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      specialization VARCHAR(128) NOT NULL,
      is_paid BOOLEAN DEFAULT FALSE,
      price VARCHAR(64) DEFAULT '$0',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS questions (
      id VARCHAR(64) PRIMARY KEY,
      module_id VARCHAR(64) REFERENCES question_modules(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_index INT NOT NULL,
      explanation TEXT,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS student_test_sessions (
      id VARCHAR(64) PRIMARY KEY,
      student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      module_id VARCHAR(64) REFERENCES question_modules(id) ON DELETE CASCADE,
      mode VARCHAR(32) DEFAULT 'practice',
      question_count INT NOT NULL,
      score_percentage NUMERIC(5,2),
      answers JSONB,
      certificate_issued BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS system_settings (
      key VARCHAR(128) PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const sql of tableStatements) {
    await neonQuery(sql);
  }
  console.log(`✓ All ${tableStatements.length} core tables created successfully in Neon DB!`);

  // 2. Seed Roles
  console.log("\n2. Seeding Roles...");
  const roles = [
    ["role_super_admin", "super_admin", "Full system administration and audit access"],
    ["role_admin", "admin", "Operational management of students, content, and enrollments"],
    ["role_physician", "physician", "Supervising clinical physician for rotations"],
    ["role_mentor", "mentor", "Faculty mentor for research and residency guidance"],
    ["role_instructor", "instructor", "Faculty lecturer for live classes and courses"],
    ["role_student", "student", "Enrolled medical student or graduate"],
  ];
  for (const [id, name, desc] of roles) {
    await neonQuery(
      `INSERT INTO roles (id, name, description) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;`,
      [id, name, desc]
    );
  }
  console.log("✓ Seeded 6 Roles");

  // 3. Seed Users
  console.log("\n3. Seeding Accounts...");
  // Bcrypt hash for 'Pass@2026'
  const PASS_HASH = "$2b$10$8AF5NYpMjR57GTiWEJckTOligWoT43ADzvIC7CEbeuLSiMCPD5gsO";

  const users = [
    {
      id: "usr_admin_jvm",
      email: "admin@jvmmedicalservices.com",
      role: "role_super_admin",
      first: "JVM Admin",
      last: "Officer",
      school: "Cook County Health",
      spec: "Administration",
    },
    {
      id: "usr_dr_mydam",
      email: "dr.mydam@jvmmedicalservices.com",
      role: "role_physician",
      first: "Janardhan",
      last: "Mydam, MD, FAAP",
      school: "Wayne State / Cook County Stroger",
      spec: "Neonatal-Perinatal Medicine & Pediatrics",
    },
    {
      id: "usr_student_jvm",
      email: "student@jvmmedicalservices.com",
      role: "role_student",
      first: "Alex",
      last: "Rivera",
      school: "Windsor University School of Medicine",
      spec: "Pediatrics & Neonatology",
    },
    {
      id: "usr_admin_legacy",
      email: "admin@jva-medical.com",
      role: "role_admin",
      first: "System",
      last: "Admin",
      school: "JVA Medical",
      spec: "Administration",
    },
    {
      id: "usr_student_legacy",
      email: "student.a@example.com",
      role: "role_student",
      first: "Alex",
      last: "Rivera",
      school: "Windsor University School of Medicine",
      spec: "Pediatrics",
    },
  ];

  for (const u of users) {
    await neonQuery(
      `INSERT INTO users (id, email, password_hash, status, email_verified_at)
       VALUES ($1, $2, $3, 'active', CURRENT_TIMESTAMP)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;`,
      [u.id, u.email, PASS_HASH]
    );

    await neonQuery(
      `INSERT INTO student_profiles (user_id, first_name, last_name, medical_school, country, graduation_year, usmle_stage, specialty_interest, phone, bio)
       VALUES ($1, $2, $3, $4, 'United States', 2026, 'Step 2 CK', $5, '+1 (312) 555-0199', 'Clinical candidate preparing for US pediatric residency match.')
       ON CONFLICT (user_id) DO UPDATE SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name;`,
      [u.id, u.first, u.last, u.school, u.spec]
    );

    await neonQuery(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, role_id) DO NOTHING;`,
      [u.id, u.role]
    );
  }
  console.log(`✓ Seeded ${users.length} authenticated users & profiles`);

  // 4. Seed Programs
  console.log("\n4. Seeding Clinical & Educational Programs...");
  const programs = [
    {
      id: "prog_tele_rotation",
      key: "tele_rotation",
      name: "Virtual Neonatal & Pediatric Tele-Rotation",
      category: "Clinical",
      description: "6-week virtual clinical rotation covering NICU rounds, neonatal resuscitation, clinical case discussions, and US clinical reasoning with Dr. Janardhan Mydam.",
      duration: "6 Weeks",
      price: "$1,200",
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
      price: "$2,400",
      featured: true,
      icon: "hospital"
    },
    {
      id: "prog_qbank",
      key: "qbank",
      name: "Board-Style Clinical Question Bank",
      category: "Exam Prep",
      description: "Comprehensive USMLE Step 1, Step 2 CK, and Pediatric Shelf exam preparation with clinical vignette rationales.",
      duration: "12 Months Access",
      price: "$250",
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
      price: "Free",
      featured: true,
      icon: "video"
    },
  ];

  for (const p of programs) {
    await neonQuery(
      `INSERT INTO programs (id, key, name, category, description, duration, price, featured, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price;`,
      [p.id, p.key, p.name, p.category, p.description, p.duration, p.price, p.featured, p.icon]
    );
  }
  console.log(`✓ Seeded ${programs.length} Educational & Clinical Programs`);

  // 5. Seed Question Modules (3 Specializations, 28 Modules)
  console.log("\n5. Seeding Question Modules...");
  const modules = [
    // Pediatrics
    { id: "mod_ped_1", title: "Pediatric Cardiology & Congenital Heart Defects", spec: "Pediatrics", paid: false, price: "$0" },
    { id: "mod_ped_2", title: "Pediatric Pulmonology & Asthma Management", spec: "Pediatrics", paid: false, price: "$0" },
    { id: "mod_ped_3", title: "Pediatric Infectious Diseases & Immunizations", spec: "Pediatrics", paid: true, price: "$29" },
    { id: "mod_ped_4", title: "Pediatric Gastroenterology & Nutrition", spec: "Pediatrics", paid: true, price: "$29" },
    { id: "mod_ped_5", title: "Pediatric Nephrology & Fluid Electrolytes", spec: "Pediatrics", paid: true, price: "$29" },
    { id: "mod_ped_6", title: "Pediatric Endocrinology & Growth Disorders", spec: "Pediatrics", paid: true, price: "$29" },
    { id: "mod_ped_7", title: "Pediatric Neurology & Seizure Disorders", spec: "Pediatrics", paid: true, price: "$29" },
    { id: "mod_ped_8", title: "Pediatric Hematology-Oncology", spec: "Pediatrics", paid: true, price: "$35" },
    { id: "mod_ped_9", title: "Developmental Milestones & Behavioral Pediatrics", spec: "Pediatrics", paid: false, price: "$0" },
    { id: "mod_ped_10", title: "Pediatric Emergency Medicine & Resuscitation", spec: "Pediatrics", paid: true, price: "$35" },

    // Neonatology
    { id: "mod_neo_1", title: "Neonatal Resuscitation Program (NRP Guidelines)", spec: "Neonatology", paid: false, price: "$0" },
    { id: "mod_neo_2", title: "Respiratory Distress Syndrome & Surfactant Therapy", spec: "Neonatology", paid: false, price: "$0" },
    { id: "mod_neo_3", title: "Hypoxic Ischemic Encephalopathy & Therapeutic Hypothermia", spec: "Neonatology", paid: true, price: "$39" },
    { id: "mod_neo_4", title: "Necrotizing Enterocolitis (NEC) Diagnosis & Management", spec: "Neonatology", paid: true, price: "$39" },
    { id: "mod_neo_5", title: "Neonatal Sepsis & Antimicrobial Stewardship", spec: "Neonatology", paid: true, price: "$35" },
    { id: "mod_neo_6", title: "Patent Ductus Arteriosus (PDA) in Preterm Infants", spec: "Neonatology", paid: true, price: "$35" },
    { id: "mod_neo_7", title: "Bronchopulmonary Dysplasia & Chronic Lung Disease", spec: "Neonatology", paid: true, price: "$35" },
    { id: "mod_neo_8", title: "Retinopathy of Prematurity (ROP) Screening & Care", spec: "Neonatology", paid: true, price: "$29" },
    { id: "mod_neo_9", title: "Neonatal Hyperbilirubinemia & Phototherapy", spec: "Neonatology", paid: false, price: "$0" },
    { id: "mod_neo_10", title: "Neonatal Nutrition, TPN & Fluid Management", spec: "Neonatology", paid: true, price: "$35" },

    // USMLE Step 2 CK
    { id: "mod_usmle_1", title: "High-Yield Pediatric Shelf & Step 2 CK Vignettes", spec: "USMLE Step 2 CK", paid: false, price: "$0" },
    { id: "mod_usmle_2", title: "Neonatal High-Risk Vignettes & Critical Decisions", spec: "USMLE Step 2 CK", paid: false, price: "$0" },
    { id: "mod_usmle_3", title: "Obstetric & Perinatal Medicine Clinical Vignettes", spec: "USMLE Step 2 CK", paid: true, price: "$39" },
    { id: "mod_usmle_4", title: "Biostatistics, Epidemiology & Diagnostic Testing", spec: "USMLE Step 2 CK", paid: true, price: "$29" },
    { id: "mod_usmle_5", title: "Medical Ethics, Patient Safety & Communication", spec: "USMLE Step 2 CK", paid: false, price: "$0" },
    { id: "mod_usmle_6", title: "Clinical Pharmacology & Pediatric Therapeutics", spec: "USMLE Step 2 CK", paid: true, price: "$29" },
    { id: "mod_usmle_7", title: "Infectious Disease Diagnostic Algorithms", spec: "USMLE Step 2 CK", paid: true, price: "$35" },
    { id: "mod_usmle_8", title: "Comprehensive Step 2 CK Diagnostic Simulation Block", spec: "USMLE Step 2 CK", paid: true, price: "$49" },
  ];

  for (const m of modules) {
    await neonQuery(
      `INSERT INTO question_modules (id, title, description, specialization, is_paid, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price;`,
      [m.id, m.title, `Board-style clinical module covering ${m.title} curated by Dr. Janardhan Mydam.`, m.spec, m.paid, m.price]
    );
  }
  console.log(`✓ Seeded ${modules.length} Question Modules across 3 specializations`);

  // 6. Seed High-Yield Clinical Questions
  console.log("\n6. Seeding High-Yield Questions...");
  const questions = [
    {
      id: "q_neo_101",
      module_id: "mod_neo_1",
      question_text: "A 38-week gestational age male infant is delivered via emergency cesarean section due to fetal bradycardia. At birth, the infant is apneic and limp with a heart rate of 52 bpm despite 30 seconds of drying, positioning, and stimulating. What is the immediate next step in resuscitation according to NRP 8th Edition guidelines?",
      options: JSON.stringify([
        "Initiate chest compressions with a 3:1 compression-to-ventilation ratio",
        "Administer intravenous epinephrine 0.02 mg/kg via umbilical venous catheter",
        "Initiate positive-pressure ventilation (PPV) with 21% FiO2 at 40-60 breaths/min",
        "Apply continuous positive airway pressure (CPAP) at 5 cm H2O with 100% oxygen",
        "Perform immediate endotracheal intubation and administer intratracheal surfactant"
      ]),
      correct_index: 2,
      explanation: "According to NRP guidelines, if an infant remains apneic or gasping or has a heart rate < 100 bpm after initial steps, the single most critical intervention is immediate positive pressure ventilation (PPV). For term and late preterm infants (≥35 weeks), PPV should be initiated with room air (21% FiO2). Chest compressions are indicated ONLY if the heart rate remains < 60 bpm after at least 30 seconds of effective PPV that moves the chest.",
      image_url: null,
    },
    {
      id: "q_neo_102",
      module_id: "mod_neo_2",
      question_text: "A 28-week preterm female infant develops tachypnea, grunting, nasal flaring, and subcostal retractions at 20 minutes of life. Chest radiography demonstrates diffuse 'ground-glass' appearance with prominent air bronchograms and low lung volumes. Which of the following pathophysiological mechanisms primary accounts for this patient's findings?",
      options: JSON.stringify([
        "Delayed clearance of fetal alveolar fluid through pulmonary epithelial sodium channels",
        "Deficiency of dipalmitoylphosphatidylcholine leading to increased alveolar surface tension",
        "Meconium aspiration causing chemical pneumonitis and mechanical airway obstruction",
        "Persistent pulmonary hypertension due to failure of systemic and pulmonary vascular transition",
        "Impaired surfactant catabolism secondary to an ATP-binding cassette transporter A3 mutation"
      ]),
      correct_index: 1,
      explanation: "The clinical presentation and classic radiographic findings (fine reticulogranular 'ground-glass' pattern with air bronchograms) are diagnostic of Respiratory Distress Syndrome (RDS) caused by surfactant deficiency. Pulmonary surfactant is primarily composed of dipalmitoylphosphatidylcholine (DPPC). Without adequate surfactant, alveolar surface tension increases, resulting in diffuse microatelectasis and ventilation-perfusion mismatch.",
      image_url: null,
    },
    {
      id: "q_ped_201",
      module_id: "mod_ped_1",
      question_text: "A 2-week-old male infant is brought to the pediatric emergency department for poor feeding and lethargy. Physical examination reveals tachypnea, hepatomegaly, a gallop rhythm, and absent femoral pulses with cool lower extremities. Upper extremity blood pressure is 94/62 mmHg, while lower extremity blood pressure is undetectable. What is the most critical immediate pharmacologic intervention?",
      options: JSON.stringify([
        "Intravenous Furosemide to reduce preload in heart failure",
        "Intravenous Prostaglandin E1 (Alprostadil) infusion",
        "Intravenous Milrinone to increase myocardial contractility",
        "Intravenous Indomethacin to promote ductal closure",
        "Immediate surgical balloon angioplasty"
      ]),
      correct_index: 1,
      explanation: "This infant presents with severe critical coarctation of the aorta presenting in hemodynamic shock as the ductus arteriosus closes in the second week of life. In ductal-dependent systemic blood flow lesions, an immediate continuous infusion of Prostaglandin E1 (Alprostadil) must be initiated to reopen and maintain patency of the ductus arteriosus, restoring perfusion to the lower body and kidneys.",
      image_url: null,
    },
    {
      id: "q_usmle_301",
      module_id: "mod_usmle_1",
      question_text: "A 4-year-old girl is brought to the clinic due to a 6-day history of high fever (39.8°C / 103.6°F) refractory to antipyretics. On examination, she has bilateral non-exudative conjunctivitis, fissured erythematous lips with a strawberry tongue, a polymorphous maculopapular rash on her trunk, erythema and induration of her hands and feet, and a unilateral tender 1.8 cm cervical lymph node. What is the principal indication for prompt medical management in this patient?",
      options: JSON.stringify([
        "Prevention of coronary artery aneurysm formation with IVIG and high-dose aspirin",
        "Prevention of post-streptococcal glomerulonephritis with intramuscular benzathine penicillin",
        "Prevention of acute rheumatic fever carditis with high-dose corticosteroids",
        "Reduction of secondary staphylococcal bacteremia with intravenous cefazolin",
        "Alleviation of sterile pyuria and hepatic transaminitis"
      ]),
      correct_index: 0,
      explanation: "This patient meets clinical diagnostic criteria for Kawasaki Disease (fever ≥5 days plus at least 4 of 5 classic clinical criteria: bilateral non-purulent conjunctival injection, oral mucosal changes, polymorphous rash, peripheral extremity changes, and cervical lymphadenopathy >1.5 cm). The primary purpose of treatment with Intravenous Immunoglobulin (IVIG, 2 g/kg) and aspirin within the first 10 days of fever onset is to reduce the risk of coronary artery aneurysms from 25% to less than 4%.",
      image_url: null,
    }
  ];

  for (const q of questions) {
    await neonQuery(
      `INSERT INTO questions (id, module_id, question_text, options, correct_index, explanation, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, explanation = EXCLUDED.explanation;`,
      [q.id, q.module_id, q.question_text, q.options, q.correct_index, q.explanation, q.image_url]
    );
  }
  console.log(`✓ Seeded ${questions.length} High-Yield Clinical Questions with USMLE Rationales`);

  // 7. Seed Live Classes
  console.log("\n7. Seeding Live Clinical Classes...");
  const classes = [
    {
      id: "cls_live_1",
      title: "Interactive NICU Bedside Rounds & Case Discussions",
      topic: "Neonatal Resuscitation & High-Risk Case Vignettes",
      instructor_id: "usr_dr_mydam",
      scheduled_at: "2026-09-18T16:00:00Z",
      duration: 75,
      meeting_url: "https://teams.microsoft.com/l/meetup-join/jvm-nicu-rounds",
      pricing_type: "Free",
      price: "$0",
    },
    {
      id: "cls_live_2",
      title: "Pediatric Board Review: Cardiac & Respiratory Emergencies",
      topic: "USMLE Step 2 CK & Pediatric Shelf High-Yield Masterclass",
      instructor_id: "usr_dr_mydam",
      scheduled_at: "2026-09-22T17:30:00Z",
      duration: 90,
      meeting_url: "https://teams.microsoft.com/l/meetup-join/jvm-ped-board",
      pricing_type: "Paid",
      price: "$45",
    },
  ];

  for (const c of classes) {
    await neonQuery(
      `INSERT INTO live_classes (id, title, topic, description, instructor_id, scheduled_at, duration_minutes, meeting_url, pricing_type, price, status)
       VALUES ($1, $2, $3, 'Live interactive lecture with Dr. Janardhan Mydam', $4, $5, $6, $7, $8, $9, 'Scheduled')
       ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, pricing_type = EXCLUDED.pricing_type, price = EXCLUDED.price;`,
      [c.id, c.title, c.topic, c.instructor_id, c.scheduled_at, c.duration, c.meeting_url, c.pricing_type, c.price]
    );
  }
  console.log(`✓ Seeded ${classes.length} Live Clinical Classes (Free and Paid)`);

  // 8. Verify Table Counts
  console.log("\n8. Verifying Seeding in Neon DB...");
  const tables = await neonQuery(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log("   Active Tables in Neon DB:");
  for (const r of tables.rows) {
    const countRes = await neonQuery(`SELECT COUNT(*) as cnt FROM ${r.table_name};`);
    console.log(`   - ${r.table_name.padEnd(28)} : ${countRes.rows[0].cnt} rows`);
  }

  console.log("\n=== NEON DB MIGRATION & SEEDING COMPLETED SUCCESSFULLY! ===");
}

main().catch((err) => {
  console.error("Migration / Seeding Error:", err);
  process.exit(1);
});
