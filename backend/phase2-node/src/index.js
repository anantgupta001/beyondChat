import "dotenv/config";

import { fetchArticles } from "./api/articleApi.js";

const articles = await fetchArticles();
console.log("Fetched articles:", articles.length);
