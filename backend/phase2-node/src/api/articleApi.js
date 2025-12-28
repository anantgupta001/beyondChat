import axios from "axios";

const api = axios.create({
  baseURL: process.env.LARAVEL_API_BASE,
  timeout: 10000,
});

export async function fetchArticles() {
  const res = await api.get("/articles");
  return res.data;
}

export async function updateArticle(id, payload) {
  const res = await api.put(`/articles/${id}`, payload);
  return res.data;
}
