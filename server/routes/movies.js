// proxies requests to TMDB so the api key stays on server and never reaches browser
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

// GET /api/movies/popular
router.get("/popular", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/popular`, {
      params: {
        api_key: API_KEY,
        page: req.query.page || 1,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "couldnt fetch popular movies" });
  }
});

// GET /api/movies/search?query=inception
router.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "search query required" });
  }

  try {
    const response = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "search failed" });
  }
});

// GET /api/movies/:id  -> details for one movie
// keep this one last, otherwise it would grab "popular" and "search" as if they were ids
router.get("/:id", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE}/movie/${req.params.id}`, {
      params: { api_key: API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    // send 404 if movie id doesnt exist
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: "movie not found" });
    }
    console.log(err.message);
    res.status(500).json({ message: "couldnt get movie details" });
  }
});

module.exports = router;