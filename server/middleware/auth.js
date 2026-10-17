// checks authorization header for a valid token 
// before letting request through
const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "no token provided" });
  }

  // grab second part, no bearer prefix
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "invalid token" });
    }
    // now routes after this can use req.user.id
    // if this is correct :
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;