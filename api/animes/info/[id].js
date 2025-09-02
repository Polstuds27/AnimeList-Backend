import fetch from "node-fetch";
import { Client } from "@gradio/client";

async function requestToSummarize(text) {
  const client = await Client.connect("AventIQ-AI/T5-Text-Summarizer");
  const result = await client.predict("/predict", { input_text: text });
  return result.data;
}

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await response.json();
    const anime = data.data;

    const cleaned = {
      id: anime.mal_id,
      title_english: anime.title_english,
      title: anime.title,
      image: anime.images.jpg.large_image_url,
      episodes: anime.episodes,
      score: anime.score,
      rank: anime.rank,
      synopsis: anime.synopsis,
      trailer: anime.trailer?.url,
      genres: anime.genres.map(g => g.name),
    };

    const summary = await requestToSummarize(cleaned.synopsis);
    cleaned.summary = summary;

    res.status(200).json(cleaned);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.toString() });
  }
}
