// src/api/articles.js

export const fetchArticles = async () => {
  const res = await fetch("/api/articles");

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ API did not return JSON:", text);
    throw new Error("Invalid JSON response from backend");
  }
};


export const resetArticles = async () => {
  const res = await fetch("/api/admin/reset-articles", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Reset failed");
  }

  return res.json();
};

export const enhanceArticle = async (id) => {
  const res = await fetch(`/api/articles/${id}/enhance`, {
    method: "POST",
  });

  return res.json();
};

export const enhanceAllArticles = async () => {
  const res = await fetch(`/api/articles/enhance-all`, {
    method: "POST",
  });

  return res.json();
};

