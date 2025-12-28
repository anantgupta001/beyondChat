import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function enhance(content, competitorContents, competitorLinks) {
  try {
    const { data } = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "user",
            content: `Enhance the following article content with competitor information:
            Article Content:
            ${content}

            Competitor Contents:
            ${competitorContents.join("\n\n")}

            Competitor Links:
            ${competitorLinks.join("\n")}`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const dom = new JSDOM(data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    return article?.textContent || null;
  } catch {
    return null;
  }
}
