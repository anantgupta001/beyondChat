import "dotenv/config";

import { fetchArticles, updateArticle } from "./api/articleApi.js";
import { googleSearch } from "./search/googleSearch.js";
import { scrapeArticle } from "./scraper/scrapeArticle.js";
import { enhanceArticle } from "./llm/enhance.js";

const articles = await fetchArticles();

for (const article of articles) {
  console.log(`\n🔍 Processing: ${article.title}`);

  // 🧠 Fetch competitor links
  const competitors = await googleSearch(article.title);

  if (!Array.isArray(competitors) || competitors.length < 2) {
    console.log("❌ Not enough competitors from search");
    continue;
  }

  // 🔍 Scrape competitor content safely
  for (const c of competitors) {
    try {
      c.content = await scrapeArticle(c.url);
    } catch (err) {
      c.content = "";
    }
  }

  // ✅ Keep only valid scraped content
  const validCompetitors = competitors.filter(
    c => typeof c.content === "string" && c.content.length > 200
  );

  if (validCompetitors.length < 2) {
    console.log("❌ Not enough valid competitor content");
    continue;
  }

  // 🧠 Extract only text for LLM
  const competitorTexts = validCompetitors.map(c => c.content);

  // 🚀 Enhance article
  const enhanced = await enhanceArticle(
    article.content,
    competitorTexts
  );

  if (!enhanced || enhanced.length < 200) {
    console.log("❌ Enhancement failed or too short");
    continue;
  }

  // 💾 Save enhanced article
  await updateArticle(article.id, {
    enhanced_content: enhanced,
    phase2_done: true,
  });

  console.log("✅ Article enhanced & updated");
}

console.log("\n🚀 Phase-2 completed successfully");
