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
  return result.data;
}

app.get("/", (req, res)=>{
      res.json({ message: "Backend is running!" });
})

app.get("/animes/:pages", async (req, res) => {// for home
  try {
    //const pageNumber = Math.floor(Math.random() * 100) + 1;

    const response = await fetch(`https://api.jikan.moe/v4/anime?page=${req.params.pages}&limit=25`);
    const data = await response.json(); // parse JSON

    const cleaned = data.data.map((anime)=>({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.large_image_url,
    }));
    
    res.json(cleaned);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" , error});
  }
});

app.get("/animes/info/:id", async (req,res)=>{//

  try{

    const response = await fetch(`https://api.jikan.moe/v4/anime/${req.params.id}`); 
    const data = await response.json(); // parse JSON

    const anime = data.data

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

    const animeSynopsis = cleaned.synopsis;

    const summary = await requestToSummarize(animeSynopsis);

    cleaned.summary = summary;

    res.json(cleaned);
  }catch(error){
    res.status(500).json({error: "something went wrong", error});
  }

});

app.get("/animes/search/:q", async (req, res)=>{
    try{
      const name = req.params.q; 
      
      if(!name) return res.status(400).json({error: "anime name is required"});

      const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(name)}&limit=25&page=1`
    );

    const data = await response.json();

    const cleaned = data.data.map((anime)=>({
      id: anime.mal_id,
      title: anime.title,
      image: anime.images.jpg.large_image_url
    }));

    res.json(cleaned);

    }catch(error){
      res.status(500).json({error: "something went wrong"});
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
