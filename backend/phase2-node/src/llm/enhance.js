import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Safe text cleaner
 */
function safeText(text, maxChars = 1500) {
  if (typeof text !== "string") return "";
  return text.replace(/\s+/g, " ").trim().slice(0, maxChars);
}

/**
 * Detect CSS / junk text
 */
function looksLikeCSS(text) {
  if (!text || typeof text !== "string") return true;
  return (
    text.includes("{") &&
    text.includes("}") &&
    text.includes(":") &&
    text.includes("@media")
  );
}

/**
 * Enhance article using competitor references
 */
export async function enhanceArticle(original, competitors) {
  const cleanOriginal = safeText(original, 1500);

  const competitorText = competitors
    .filter(
      c =>
        typeof c === "string" &&
        c.length > 200 &&
        !looksLikeCSS(c)
    )
    .map((c, i) => `Competitor ${i + 1}:\n${safeText(c, 1500)}`)
    .join("\n\n");

  // 🛑 If no usable data, return original
  if (!cleanOriginal || !competitorText) {
    return cleanOriginal;
  }

  const prompt = `
Rewrite the article below to match the tone, structure, and depth
of the competitor articles.

ORIGINAL ARTICLE:
${cleanOriginal}

${competitorText}

Rules:
- Improve clarity and flow
- Add clear headings and subheadings
- Do NOT copy sentences verbatim
- Expand explanations where useful
- Add a short "References" section at the end
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1800,
  });

  return response.choices[0].message.content;
}
