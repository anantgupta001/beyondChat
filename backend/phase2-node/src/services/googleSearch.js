import axios from "axios";

export async function searchCompetitors(title) {
  const res = await axios.post(
    "https://google.serper.dev/search",
    { q: title, num: 5 },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.organic
    .filter(r => r.link && !r.link.includes("beyondchats"))
    .slice(0, 2)
    .map(r => r.link);
}
