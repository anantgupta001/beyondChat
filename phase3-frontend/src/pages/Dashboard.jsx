import { useEffect, useState } from "react";
import {
  fetchArticles,
  resetArticles,
  enhanceAllArticles,
} from "../api/articles";
import ArticleCard from "../components/articleCard";

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadArticles = async () => {
    const data = await fetchArticles();
    setArticles(data);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // 🔄 Reset DB + Fetch Oldest 5
  const handleReset = async () => {
    const ok = window.confirm(
      "This will DELETE all articles and fetch the oldest 5 again. Continue?"
    );
    if (!ok) return;

    try {
      setLoading(true);
      await resetArticles();
      await loadArticles();
      alert("Oldest 5 articles fetched successfully!");
    } catch (err) {
      alert("Failed to reset articles");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Enhance ALL articles
  const handleEnhanceAll = async () => {
    const ok = window.confirm("Enhance ALL articles?");
    if (!ok) return;

    try {
      setLoading(true);
      await enhanceAllArticles();
      alert("All articles queued for enhancement");
    } catch (err) {
      alert("Failed to enhance all articles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>BeyondChats – Phase 3</h1>

      {/* 🔘 TOP ACTION BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            padding: "10px 16px",
            background: loading ? "#9ca3af" : "#111827",
            color: "white",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          🔄 Reset & Fetch Oldest 5
        </button>

        <button
          onClick={handleEnhanceAll}
          disabled={loading}
          style={{
            padding: "10px 16px",
            background: loading ? "#9ca3af" : "#16a34a",
            color: "white",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          🚀 Enhance All
        </button>
      </div>

      {/* 📄 ARTICLES LIST */}
      {articles.length === 0 && <p>No articles found.</p>}

      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
