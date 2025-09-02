import express from "express";
import fetch from "node-fetch";
import { Client } from "@gradio/client";
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173", // your React app URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

async function requestToSummarize(text){
    const client = await Client.connect("AventIQ-AI/T5-Text-Summarizer");
    const result = await client.predict("/predict", { 		
		input_text: text, 
    });
console.log(result.data);
return result.data;
}

app.get("/", (req, res)=>{
      res.json({ message: "Backend is running!" });
})

app.get("/animes", async (req, res) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?page=1&limit=10`);
    const data = await response.json(); // parse JSON

    const cleaned = data.data.map((anime)=>({
      id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english,
      episodes: anime.episodes,
      score: anime.score,
      rank: anime.rank,
      synopsis: anime.synopsis,
      image: anime.images.jpg.large_image_url,
      trailer: anime.trailer?.url,
      genres: anime.genres.map(g => g.name),
    }));
    
    /*
    const animeSynopsis = cleaned.synopsis;

    const summary = await requestToSummarize(animeSynopsis);

    res.json({summary: summary});*/

    res.json(cleaned);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" , error});
  }
});

app.get


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
