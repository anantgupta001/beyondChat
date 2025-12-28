import { searchCompetitors } from "./services/googleSearch.js";
import { scrapeArticle } from "./services/scraper.js";
import { enhance } from "./services/llm.js";
import { updateArticle } from "./api/articleApi.js";

export async function enhanceArticle(article) {
  console.log(`🔍 Enhancing: ${article.title}`);

  const links = await searchCompetitors(article.title);
  if (!links.length) return;

  const contents = [];
  for (const link of links) {
    const text = await scrapeArticle(link);
    if (text) contents.push(text);
  }

  if (!contents.length) return;

  const enhanced = await enhance(
    article.content,
    contents,
    links
  );

  await updateArticle(article.id, {
    enhanced_content: enhanced,
    phase2_done: true
  });

  console.log("✅ Updated");
}
