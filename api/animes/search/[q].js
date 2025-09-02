import fetch from "node-fetch";

export default async function handler(req, res) {

    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
    }

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Anime name is required" });
  }

  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=25&page=1`
    );
    const data = await response.json();

    const cleaned = data.data.map(anime => ({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.large_image_url,
    }));

    res.status(200).json(cleaned);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.toString() });
  }
}
