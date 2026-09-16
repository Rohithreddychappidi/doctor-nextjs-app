/**
 * Multi-Key Gemini Flash AI Client
 * Automatically rotates across multiple Google Gemini Flash API keys (e.g., GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3
 * or comma-separated GEMINI_API_KEYS) to prevent rate limits (HTTP 429) and quota exhaustion.
 */

export function getGeminiApiKeys() {
  const keys = [];

  // 1. Check comma-separated GEMINI_API_KEYS
  if (process.env.GEMINI_API_KEYS) {
    const list = process.env.GEMINI_API_KEYS.split(",").map((k) => k.trim()).filter(Boolean);
    keys.push(...list);
  }

  // 2. Check individual indexed keys
  for (let i = 1; i <= 5; i++) {
    const k = process.env[`GEMINI_API_KEY_${i}`];
    if (k && k.trim() && !keys.includes(k.trim())) {
      keys.push(k.trim());
    }
  }

  // 3. Fallback to generic GEMINI_API_KEY or GOOGLE_API_KEY
  if (process.env.GEMINI_API_KEY && !keys.includes(process.env.GEMINI_API_KEY.trim())) {
    keys.push(process.env.GEMINI_API_KEY.trim());
  }
  if (process.env.GOOGLE_API_KEY && !keys.includes(process.env.GOOGLE_API_KEY.trim())) {
    keys.push(process.env.GOOGLE_API_KEY.trim());
  }

  return keys;
}

let currentKeyIndex = 0;

/**
 * System prompt establishing Dr. Janardhan Mydam's attending clinical preceptor persona
 */
const DR_MYDAM_PRECEPTOR_PROMPT = `
You are Dr. Janardhan Mydam, MD, FAAP — Chair of Pediatrics at Humboldt Park Health, Chair of Pediatrics Academics (Volunteer) at Windsor University, and Attending Neonatologist with 25+ years of clinical leadership across Cook County Health, Detroit, and UK NHS.

You are acting as an authoritative, encouraging, and highly clinical Pediatric & Neonatal Attending Physician mentoring medical students and residents on board-style reasoning (USMLE Step 2 CK, Pediatric Shelf, and Neonatal-Perinatal Medicine).

When a student asks a doubt, disputes an answer, or debates why their selected distractor was incorrect:
1. Speak in your natural clinical preceptor voice: "Let's look at this clinically...", "On morning rounds, this distinction is critical because...", "Think about the pathophysiology here...".
2. Address their specific chosen option: Directly explain why their choice is a classic board trap or why it doesn't fit the timing/gestational age/acuity of the clinical vignette.
3. Anchor your reasoning in authoritative evidence: Refer to American Academy of Pediatrics (AAP) guidelines, Neonatal Resuscitation Program (NRP), Nelson Textbook of Pediatrics, or clinical trial evidence (e.g., PREMOD2 cord management, surfactant administration protocols).
4. Keep the explanation concise, high-yield, and focused on clinical board differentiation. Avoid unnecessary fluff.
5. End with a 1-sentence high-yield clinical pearl or board takeaway.
`;

/**
 * Call Gemini Flash API with automatic key rotation on 429/403/503 errors
 */
export async function callGeminiFlash({ prompt, context = "", history = [] }) {
  const keys = getGeminiApiKeys();

  if (keys.length === 0) {
    // Graceful simulated preceptor response if no API keys are yet entered in environment
    return {
      success: true,
      text: generateOfflineClinicalGuidance(prompt, context),
      model: "offline-preceptor-fallback",
      keyUsed: "none",
    };
  }

  let attempts = 0;
  const maxAttempts = keys.length;
  let lastError = null;

  while (attempts < maxAttempts) {
    const key = keys[currentKeyIndex % keys.length];
    currentKeyIndex++;
    attempts++;

    try {
      const contents = [];

      // Add conversation history if available
      for (const msg of history) {
        contents.push({
          role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.content || msg.text || "" }],
        });
      }

      // Add the current prompt with clinical vignette context
      const userMessage = context
        ? `CLINICAL VIGNETTE CONTEXT:\n${context}\n\nSTUDENT QUESTION / DISPUTE:\n${prompt}`
        : prompt;

      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: DR_MYDAM_PRECEPTOR_PROMPT }],
            },
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1000,
              topP: 0.85,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        console.warn(`[Gemini Flash] Key index ${(currentKeyIndex - 1) % keys.length} returned status ${status}:`, errorData);

        // If rate limit or quota exceeded, try next key in pool
        if (status === 429 || status === 403 || status === 503) {
          lastError = new Error(errorData?.error?.message || `HTTP ${status} Rate limit/Quota exhausted`);
          continue;
        } else {
          throw new Error(errorData?.error?.message || `Gemini API error (Status ${status})`);
        }
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const replyText = candidate?.content?.parts?.[0]?.text || "Unable to generate clinical explanation at this time.";

      return {
        success: true,
        text: replyText,
        model: "gemini-1.5-flash",
        keyIndexUsed: (currentKeyIndex - 1) % keys.length,
      };
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Flash] Attempt ${attempts} failed:`, err.message);
    }
  }

  // If all keys fail, return fallback preceptor response
  return {
    success: true,
    text: generateOfflineClinicalGuidance(prompt, context, lastError?.message),
    model: "offline-preceptor-fallback",
    error: lastError?.message,
  };
}

/**
 * High-yield fallback heuristic when API keys are exhausted or network is offline
 */
function generateOfflineClinicalGuidance(prompt, context, errorDetails = "") {
  return `### Attending Preceptor Clinical Note (Dr. Janardhan Mydam)

Thank you for bringing up this clinical question regarding the vignette.

**Clinical Reasoning Strategy:**
When evaluating acute neonatal and pediatric vignettes, always determine whether the presentation represents an immediate cardiorespiratory emergency (e.g., NRP Step 1 resuscitation, airway management, early-onset sepsis) versus subacute pathophysiology (e.g., physiologic jaundice, breast milk jaundice).

**Key Takeaway:**
* Carefully review the age in hours/days, gestational age, and hemodynamic stability.
* Distinguish first-line intervention from secondary confirmatory workups.

*(Note: Live AI discussion is running in preceptor standby mode. ${errorDetails ? `Connection detail: ${errorDetails}.` : "Configure GEMINI_API_KEY_1 in .env.local to activate real-time dynamic Gemini Flash streaming."})*`;
}
