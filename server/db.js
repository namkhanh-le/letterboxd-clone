// connection to postgres, other files just import this
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// quick check on startup so we know if the db is reachable
pool.connect((err) => {
  if (err) {
    console.error("could not connect to db", err.message);
  } else {
    console.log("connected to postgres");
  }
});

module.exports = pool;