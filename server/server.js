const express = require("express");
const cors = require("cors");
require("dotenv").config();

// importing this just to trigger the db connection check
require("./db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("letterboxd clone api is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});