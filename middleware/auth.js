const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    // Split authentication string 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    //JWt inbuilt function to verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;
