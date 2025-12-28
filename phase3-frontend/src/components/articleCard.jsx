import { enhanceArticle } from "../api/articles";

export default function ArticleCard({ article }) {
  const handleEnhance = async () => {
    try {
      await enhanceArticle(article.id);
      alert("Article queued for enhancement");
    } catch (err) {
      alert("Failed to enhance article");
    }
  };

  return (
    <div className="card">
      <h2>{article.title}</h2>

      <span className={article.enhanced_content ? "badge done" : "badge pending"}>
        {article.enhanced_content ? "Enhanced" : "Pending"}
      </span>

      <div className="content">
        <div>
          <h3>Original</h3>
          <p>{article.content.slice(0, 400)}...</p>
        </div>

        <div>
          <h3>Enhanced</h3>
          <p>
            {article.enhanced_content
              ? article.enhanced_content.slice(0, 400)
              : "Not enhanced yet"}
          </p>
        </div>
      </div>

      {/* 🔥 ENHANCE BUTTON */}
      <button
        disabled={article.phase2_done}
        onClick={handleEnhance}
        style={{
          marginTop: "10px",
          padding: "6px 12px",
          background: article.phase2_done ? "#9ca3af" : "#2563eb",
          color: "white",
          borderRadius: "6px",
          cursor: article.phase2_done ? "not-allowed" : "pointer",
        }}
      >
        ⚡ Enhance
      </button>
    </div>
  );
}
