import sqlite3 from "sqlite3";
import { open } from "sqlite"

const db = await open({
    filename: "./anime.db",
    driver: sqlite3.Database
})

await db.exec(`
  CREATE TABLE IF NOT EXISTS summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    animeId INTEGER UNIQUE,
    title TEXT,
    summary TEXT,
    cachedAt TEXT
  )
`);

export default db;