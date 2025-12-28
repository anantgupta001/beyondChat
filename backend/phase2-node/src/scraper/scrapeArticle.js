import axios from "axios";
import https from "https";
import { JSDOM } from "jsdom";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // 🔥 fix SSL issues
});

export async function scrapeArticle(url) {
  try {
    const { data: rawHtml } = await axios.get(url, {
      timeout: 25000,
      httpsAgent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        Accept: "text/html",
      },
    });

    // 🔥🔥 CRITICAL FIX: REMOVE STYLE TAGS BEFORE JSDOM 🔥🔥
    const html = rawHtml.replace(
      /<style[\s\S]*?<\/style>/gi,
      ""
    );

    // ✅ Now jsdom will NEVER try to parse CSS
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove remaining noise
    document
      .querySelectorAll("script, noscript, iframe, svg, link")
      .forEach(el => el.remove());

    const selectors = [
      "article",
      "main",
      ".post-content",
      ".entry-content",
      ".blog-content",
      ".content",
      "[role='main']",
    ];

    let text = "";

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el?.textContent?.length > 500) {
        text = el.textContent;
        break;
      }
    }

    if (!text) {
      text = document.body?.textContent || "";
    }

    text = text.replace(/\s+/g, " ").trim();

    // ❌ Filter CSS-like garbage
    const looksLikeCSS =
      text.includes("{") &&
      text.includes("}") &&
      text.includes(":") &&
      text.includes("@media");

    if (looksLikeCSS || text.length < 200) {
      return "";
    }

    return text.slice(0, 4000);
  } catch (err) {
    console.log(`❌ Scraping failed: ${url}`, err.message);
    return "";
  }
}
