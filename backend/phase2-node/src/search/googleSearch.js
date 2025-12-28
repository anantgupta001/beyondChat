import axios from "axios";

export async function googleSearch(query) {
  const res = await axios.post(
    "https://google.serper.dev/search",
    { q: query, num: 5 },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.organic
    .filter(r => r.link && !r.link.includes("beyondchats.com"))
    .slice(0, 2)
    .map(r => ({
      title: r.title,
      url: r.link
    }));
}
