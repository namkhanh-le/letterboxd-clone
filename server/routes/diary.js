const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

// POST /api/diary
// logs a movie: date + rating are required, review text is optional
router.post("/", verifyToken, async (req, res) => {
  const { movieId, movieTitle, posterPath, watchedDate, rating, reviewText, rewatch } = req.body;

  if (!movieId || !watchedDate || !rating) {
    return res.status(400).json({ message: "movieId, watchedDate and rating are required" });
  }

  try {
    const entry = await pool.query(
      `INSERT INTO diary (user_id, movie_id, movie_title, poster_path, watched_date, rating, review_text, rewatch)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, movieId, movieTitle, posterPath, watchedDate, rating, reviewText || null, rewatch || false]
    );
    res.json(entry.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "couldnt save diary entry" });
  }
});

// GET /api/diary/user/:userId  -> every logs from one person
router.get("/user/:userId", async (req, res) => {
  try {
    const entries = await pool.query(
      "SELECT * FROM diary WHERE user_id = $1 ORDER BY watched_date DESC",
      [req.params.userId]
    );
    res.json(entries.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

// GET /api/diary/movie/:movieId  -> reviews on a movie page
// only entries that actually have review text, with the username attached
router.get("/movie/:movieId", async (req, res) => {
  try {
    const reviews = await pool.query(
      `SELECT diary.*, users.username
       FROM diary
       JOIN users ON diary.user_id = users.id
       WHERE diary.movie_id = $1 AND diary.review_text IS NOT NULL
       ORDER BY diary.created_at DESC`,
      [req.params.movieId]
    );
    res.json(reviews.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

// DELETE /api/diary/:id  (protected, only your own entries)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const entry = await pool.query("SELECT * FROM diary WHERE id = $1", [req.params.id]);

    if (entry.rows.length === 0) {
      return res.status(404).json({ message: "entry not found" });
    }

    if (entry.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "not your entry" });
    }

    await pool.query("DELETE FROM diary WHERE id = $1", [req.params.id]);
    res.json({ message: "deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;