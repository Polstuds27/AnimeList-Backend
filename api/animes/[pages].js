import fetch from "node-fetch";

export default async function handler(req, res) {
  const { pages } = req.query;

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?page=${pages}&limit=25`);
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: "Unexpected API response", details: data });
    }

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
