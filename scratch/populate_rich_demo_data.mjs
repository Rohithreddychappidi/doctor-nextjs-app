import fs from "fs";

let content = fs.readFileSync("lib/db.js", "utf8");

// 1. Seed Questions
const questionsData = `  // 9. Question Bank Items (High-Yield Pediatric & Neonatal Board Questions)
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
      explanation_incorrect: "Distractor Rationale:\\n• Option A (Routine intubation): Early routine intubation exposes fragile preterm lungs to barotrauma and volutrauma.\\n• Option C (Blow-by 100% O2): Hyperoxia induces severe oxidative lung injury and retinopathy of prematurity (ROP).\\n• Option D (Antibiotics alone): Positive end-expiratory pressure is mandatory to prevent atelectasis.",
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
      explanation_incorrect: "Distractor Rationale:\\n• Option B (Steroids & amoxicillin): Steroids are adjuncts reserved for IVIG-refractory disease.\\n• Option C (Anticoagulation): Anticoagulation is indicated only after confirmation of large/giant aneurysms.\\n• Option D (Antimicrobial therapy): Antimicrobials have no therapeutic effect in Kawasaki vasculitis.",
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
      explanation_correct: "Correct: Experimental Event Rate (EER) = 20/200 = 0.10. Control Event Rate (CER) = 40/200 = 0.20. Absolute Risk Reduction (ARR) = CER - EER = 0.20 - 0.10 = 0.10 (10%). NNT = 1 / ARR = 1 / 0.10 = 10. Treating 10 preterm infants with delayed cord clamping prevents 1 case of intraventricular hemorrhage.",
      explanation_incorrect: "Distractor Rationale:\\n• Option A (5): Incorrectly doubles ARR.\\n• Option C (20): Uses 1/0.05 instead of 1/0.10.\\n• Option D (50): Uses 1/0.02.",
      bookmarks_count: 28
    },
    {
      id: "q_4",
      exam: "USMLE Step 2 CK / Peds Shelf",
      subject: "Pediatrics",
      system: "Respiratory / Infectious Disease",
      level: 1,
      stem: "An 8-month-old infant presents in January with low-grade fever, rhinorrhea, wheezing, and tachypnea (RR 56/min). Nasal swab confirms Respiratory Syncytial Virus (RSV) bronchiolitis. SpO2 is 94% on room air. The child is drinking oral fluids adequately without signs of severe dehydration. What is the standard evidence-based management according to AAP guidelines?",
      options: [
        "Supportive care with nasal suctioning, hydration maintenance, and close monitoring",
        "Nebulized albuterol every 4 hours and oral dexamethasone for 5 days",
        "Nebulized 3% hypertonic saline every 2 hours and prophylactic amoxicillin",
        "Immediate intramuscular palivizumab single dose"
      ],
      correct_index: 0,
      explanation_correct: "Correct: AAP bronchiolitis clinical practice guidelines recommend supportive care alone (nasal saline suctioning, hydration, and supplemental oxygen ONLY if SpO2 drops <90%). Routine bronchodilators, systemic corticosteroids, hypertonic saline in outpatient settings, and antibiotics are not recommended due to lack of demonstrated benefit.",
      explanation_incorrect: "Distractor Rationale:\\n• Option B (Albuterol & steroids): Large clinical trials demonstrate no benefit in acute viral bronchiolitis.\\n• Option C (Hypertonic saline & antibiotics): Routine antibiotics are not indicated without bacterial co-infection.\\n• Option D (Palivizumab): Palivizumab is used exclusively for monthly prophylaxis in high-risk infants.",
      bookmarks_count: 67
    }
  ],

  // 10. Student Bookmarks
  bookmarks: [
    { id: "bm_1", student_id: "usr_student_jvm", question_id: "q_1", note: "Review early CPAP vs. surfactant LISA indications" }
  ],

  // 11. Test Attempts
  test_attempts: [
    {
      id: "att_demo_1",
      student_id: "usr_student_jvm",
      title: "Pediatric & Neonatal Core Block 1",
      mode: "Timed",
      score_percent: 75,
      total_questions: 4,
      correct_count: 3,
      time_spent_seconds: 240,
      completed_at: "2026-09-12T16:20:00Z",
      answers: [
        { question_id: "q_1", selected_index: 1, is_correct: true },
        { question_id: "q_2", selected_index: 0, is_correct: true },
        { question_id: "q_3", selected_index: 1, is_correct: true },
        { question_id: "q_4", selected_index: 1, is_correct: false }
      ]
    }
  ],`;

content = content.replace(
  /\/\/ 9\. Question Bank Items[\s\S]*?\/\/ 12\. Clinical Rotations/,
  questionsData + "\n\n  // 12. Clinical Rotations"
);

// 2. Seed Mock Tests
const mockTestsData = `  // 26. Mock Tests
  mock_tests: [
    {
      id: "tst_ped_shelf",
      title: "Pediatric Clinical Shelf Examination Simulation",
      subject: "Pediatrics & Neonatology",
      duration_minutes: 60,
      passing_score: 70,
      is_free: true,
      description: "Timed clinical simulation covering core outpatient pediatrics, developmental milestones, and neonatal emergencies.",
      question_ids: ["q_1", "q_2", "q_3", "q_4"],
      created_at: "2026-09-01T00:00:00Z"
    },
    {
      id: "tst_usmle_step2",
      title: "USMLE Step 2 CK Pediatric Diagnostic Block",
      subject: "USMLE Step 2 CK",
      duration_minutes: 45,
      passing_score: 75,
      is_free: true,
      description: "High-yield multi-step clinical decision vignettes curated by Dr. Janardhan Mydam.",
      question_ids: ["q_1", "q_3"],
      created_at: "2026-09-05T00:00:00Z"
    }
  ],`;

content = content.replace(
  /\/\/ 26\. Mock Tests[\s\S]*?\/\/ 27\. Student Submissions/,
  mockTestsData + "\n\n  // 27. Student Submissions"
);

// 3. Seed Rotation Applications
const rotAppsData = `  rotation_applications: [
    {
      id: "app_rot_1",
      student_id: "usr_student_jvm",
      applicant_name: "Alex Rivera",
      applicant_email: "student@jvmmedicalservices.com",
      applicant_phone: "+1 (555) 234-5678",
      medical_school: "Windsor University School of Medicine",
      graduation_year: "2026",
      usmle_step1_status: "Pass",
      usmle_step2_score: "248",
      program_type: "tele_rotation",
      target_start_date: "2026-10-01",
      cv_url: "https://drive.google.com/alex-rivera-cv.pdf",
      personal_statement: "Dedicated final-year medical student seeking intensive neonatal-perinatal clinical tele-rotation with Dr. Janardhan Mydam to master NICU clinical reasoning.",
      status: "Approved",
      assigned_cohort: "Fall 2026 Alpha Cohort",
      teams_meeting_url: "https://teams.microsoft.com/l/meetup-join/jva-tele-neonatology-fall2026",
      teams_meeting_id: "904 812 7730",
      teams_passcode: "NICU2026",
      tuition_fee: 1200,
      payment_status: "Paid",
      lor_status: "Eligible (Pending Final OSCE)",
      applied_at: "2026-09-01T10:00:00Z"
    },
    {
      id: "app_rot_2",
      student_id: "usr_applicant_2",
      applicant_name: "Sarah Jenkins",
      applicant_email: "sarah.jenkins@example.com",
      applicant_phone: "+1 (312) 555-0188",
      medical_school: "Northwestern University Feinberg School of Medicine",
      graduation_year: "2027",
      usmle_step1_status: "Pass",
      usmle_step2_score: "In Progress",
      program_type: "tele_rotation",
      target_start_date: "2026-11-01",
      cv_url: "https://drive.google.com/sarah-jenkins-cv.pdf",
      personal_statement: "Interested in pediatric critical care and respiratory distress syndrome management in preterm infants.",
      status: "Pending Review",
      assigned_cohort: null,
      teams_meeting_url: null,
      tuition_fee: 1200,
      payment_status: "Unpaid",
      lor_status: "Not Started",
      applied_at: "2026-09-12T14:30:00Z"
    }
  ],`;

content = content.replace(
  /rotation_applications:\s*\[\],/,
  rotAppsData
);

// 4. Seed Research Discussions, Applications, and Groups
const researchData = `  // 28. Global Research Discussions
  research_discussions: [
    {
      id: "disc_1",
      title: "Optimal Timing of Therapeutic Hypothermia in Moderate vs. Severe Neonatal HIE",
      author_name: "Dr. Elena Rostova",
      author_role: "Neonatal Fellow",
      author_email: "elena.rostova@example.com",
      category: "Neonatal Neuroprotection",
      content: "When initiating therapeutic whole-body hypothermia (target 33.5°C) within the 6-hour golden window, what are the most reliable amplitude-integrated EEG (aEEG) predictive biomarkers for neurodevelopmental recovery at 18-24 months?",
      tags: ["HIE", "Hypothermia", "aEEG", "Neonatology"],
      likes: 18,
      views: 142,
      created_at: "2026-09-10T11:00:00Z",
      replies: [
        {
          id: "rep_1",
          author_name: "Dr. Janardhan Mydam, MD, FAAP",
          author_role: "Chief Medical Director & Neonatologist",
          content: "Continuous aEEG background pattern evolution in the first 24 to 48 hours is critical. Transition from burst-suppression or continuous low voltage to continuous normal voltage within 36 hours shows a high negative predictive value for severe cerebral palsy.",
          created_at: "2026-09-10T14:20:00Z"
        }
      ]
    },
    {
      id: "disc_2",
      title: "Permissive Hypercapnia & Target SpO2 in Preterm RDS to Minimize BPD",
      author_name: "Marcus Vance",
      author_role: "Medical Trainee",
      author_email: "marcus.vance@example.com",
      category: "Pulmonology & NICU",
      content: "What arterial pCO2 thresholds (e.g. 50-65 mmHg) are currently recommended while maintaining pH > 7.22 in extremely preterm infants (<28 weeks) managed on non-invasive nasal CPAP?",
      tags: ["RDS", "BPD", "Permissive Hypercapnia", "Nasal CPAP"],
      likes: 12,
      views: 98,
      created_at: "2026-09-12T09:15:00Z",
      replies: [
        {
          id: "rep_2",
          author_name: "Dr. Janardhan Mydam, MD, FAAP",
          author_role: "Chief Medical Director & Neonatologist",
          content: "In our protocols, targeting pCO2 50–60 mmHg with pH >= 7.22 during days 1–3, gradually allowing up to 65 mmHg after day 3 if hemodynamically stable, prevents lung overdistension while maintaining cerebral autoregulation.",
          created_at: "2026-09-12T16:45:00Z"
        }
      ]
    }
  ],

  // 29. Research Mentorship Applications
  research_applications: [
    {
      id: "app_res_1",
      applicant_name: "Divya Patel",
      applicant_email: "divya.patel@example.com",
      applicant_phone: "+1 (555) 345-6789",
      medical_school: "Kasturba Medical College",
      graduation_year: "2025",
      research_topic: "Comparative Outcomes of Delayed Cord Clamping vs. Umbilical Cord Milking in Premature Infants",
      resume_url: "https://drive.google.com/divya-patel-cv.pdf",
      description: "Seeking faculty mentorship under Dr. Janardhan Mydam to draft a retrospective cohort study protocol and prepare manuscript for peer-reviewed publication.",
      tuition_fee: 0,
      pricing_type: "Free Tier Mentorship",
      status: "Approved",
      assigned_group_id: "grp_res_1",
      applied_at: "2026-09-11T12:00:00Z"
    }
  ],

  // 30. Collaborative Research Groups & Active Group Chat
  research_groups: [
    {
      id: "grp_res_1",
      title: "Neonatal Outcomes & Cord Transition Study Group",
      topic: "Delayed Cord Clamping & Hemodynamic Transition in Preterm Neonates",
      lead_mentor: "Dr. Janardhan Mydam, MD, FAAP",
      members: [
        { id: "usr_dr_mydam", name: "Dr. Janardhan Mydam, MD, FAAP", role: "Lead Investigator" },
        { id: "usr_student_jvm", name: "Medical Student", role: "Student Researcher" },
        { id: "usr_applicant_res1", name: "Divya Patel", role: "Research Fellow" }
      ],
      current_stage: "Protocol Draft & IRB Preparation",
      messages: [
        {
          id: "msg_1",
          sender_name: "Dr. Janardhan Mydam, MD, FAAP",
          sender_role: "Lead Investigator",
          content: "Welcome everyone to our neonatal transition research cohort! Please review the preliminary IRB template and statistical analysis plan attached in the group files.",
          attachment_url: "https://drive.google.com/neonatal-irb-protocol-draft.pdf",
          timestamp: "2026-09-13T10:00:00Z"
        },
        {
          id: "msg_2",
          sender_name: "Medical Student",
          sender_role: "Student Researcher",
          content: "Thank you Dr. Mydam! I have extracted 45 retrospective cases for preliminary power calculation. Ready for our weekly discussion.",
          attachment_url: null,
          timestamp: "2026-09-13T14:30:00Z"
        }
      ],
      created_at: "2026-09-11T14:00:00Z"
    }
  ]`;

content = content.replace(
  /\/\/ 28\. Global Research Discussions[\s\S]*?research_groups:\s*\[\]/,
  researchData
);

// 5. Seed Student Submissions in submissions array
const submissionsData = `  // 27. Student Submissions & Grading
  submissions: [
    {
      id: "sub_1",
      student_id: "usr_student_jvm",
      student_name: "Alex Rivera",
      assignment_title: "Preterm RDS Surfactant Protocol Vignette",
      module: "Neonatology Intensive Care",
      submitted_at: "2026-09-12T18:00:00Z",
      status: "Graded",
      score: 95,
      feedback: "Excellent pathophysiological reasoning and accurate LISA surfactant administration guidelines.",
      content_url: "https://drive.google.com/alex-vignette-1.pdf"
    },
    {
      id: "sub_2",
      student_id: "usr_student_jvm",
      student_name: "Alex Rivera",
      assignment_title: "Kawasaki Disease Cardiac Ultrasound Risk Stratification",
      module: "Pediatric Rheumatology",
      submitted_at: "2026-09-13T20:00:00Z",
      status: "Pending Review",
      score: null,
      feedback: null,
      content_url: "https://drive.google.com/alex-vignette-2.pdf"
    }
  ],`;

content = content.replace(
  /\/\/ 27\. Student Submissions & Grading[\s\S]*?submissions:\s*\[\],/,
  submissionsData
);

fs.writeFileSync("lib/db.js", content, "utf8");
console.log("Successfully seeded rich demo data into lib/db.js!");
