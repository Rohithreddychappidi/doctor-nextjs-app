// lib/email.js
// Transactional Email Service integration via Resend (with development fallback)

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "Dr. Janardhan Mydam Education <admissions@jva-medical.com>";

/**
 * Dispatch an email through Resend API
 */
export async function sendEmail({ to, subject, html, text }) {
  if (RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text,
        }),
      });

      const data = await response.json();
      return { success: response.ok, id: data.id, error: data.error };
    } catch (err) {
      console.error("[Email] Resend dispatch error:", err);
      return { success: false, error: err.message };
    }
  }

  // Development mock fallback: logs to console
  console.log(`[Email Mock Sent via Resend Abstraction]`);
  console.log(`  To: ${to}`);
  console.log(`  Subject: ${subject}`);
  return { success: true, id: `mock_email_${Date.now()}`, is_mock: true };
}

/**
 * Welcome email sent upon student registration
 */
export async function sendWelcomeEmail(toEmail, studentName) {
  return sendEmail({
    to: toEmail,
    subject: "Welcome to Dr. Janardhan Mydam Healthcare & Education Hub",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to the Portal, ${studentName || "Candidate"}!</h2>
        <p>Your student profile has been created. You can now explore board exam preparation banks, neonatal tele-rotations, and faculty mentorship.</p>
        <p><a href="http://localhost:3000/student/dashboard" style="background:#0f766e;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Go to Portal Dashboard</a></p>
      </div>
    `,
    text: `Welcome to Dr. Janardhan Mydam Healthcare & Education Hub, ${studentName}!`,
  });
}

/**
 * Exam/test attempt results email
 */
export async function sendTestResultEmail(toEmail, studentName, testTitle, score, passed) {
  return sendEmail({
    to: toEmail,
    subject: `Exam Score Report: ${testTitle} (${score}%)`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Practice Exam Completed</h2>
        <p>Hello ${studentName || "Student"},</p>
        <p>You completed <strong>${testTitle}</strong> with a score of <strong>${score}%</strong> (${passed ? "PASSED" : "REVIEW RECOMMENDED"}).</p>
        <p>Full answer explanations and dual-level rationales are now available in your Question Bank review tab.</p>
      </div>
    `,
    text: `You scored ${score}% on ${testTitle}.`,
  });
}

/**
 * Promotional & marketing broadcast email
 */
export async function sendMarketingEmail(toEmail, studentName, promoTitle) {
  return sendEmail({
    to: toEmail,
    subject: `Special Educational Announcement: ${promoTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Clinical Cohort Available</h2>
        <p>Hello ${studentName || "Doctor Candidate"},</p>
        <p>${promoTitle}</p>
        <p><a href="http://localhost:3000/education-training" style="background:#0f766e;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Explore Curricula</a></p>
      </div>
    `,
    text: `New educational announcement: ${promoTitle}`,
  });
}

/**
 * High-priority student notifications via email
 */
export async function sendNotificationEmail(toEmail, studentName, title, message, actionUrl) {
  const subject = `[JVA Medical Portal] ${title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f766e; margin-top: 0;">Dr. Janardhan Mydam Healthcare & Education Hub</h2>
      <p style="font-size: 16px; color: #1e293b;">Hello ${studentName || "Student"},</p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0f766e; padding: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 16px;">${title}</h3>
        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.5;">${message}</p>
      </div>
      ${actionUrl ? `
        <div style="margin: 24px 0;">
          <a href="${actionUrl}" style="background-color: #0f766e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
            View in Student Portal
          </a>
        </div>
      ` : ""}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">
        This is an automated notification from JVA Medical Education. Please do not reply directly to this email.
      </p>
    </div>
  `;
  return sendEmail({ to: toEmail, subject, html, text: `${title}: ${message}` });
}

export const emailService = {
  sendEmail,
  sendWelcomeEmail,
  sendTestResultEmail,
  sendMarketingEmail,
  sendNotificationEmail,
};
