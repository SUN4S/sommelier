const express = require("express");
const auth = require("./middleware/auth");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/database").connect();
require("dotenv").config();

// import Routes
const user = require("./routes/user");
const wines = require("./routes/wines");
const collection = require("./routes/collection");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// use Routes
app.use("/api/user", user);
app.use("/api/wine", wines);
app.use("/api/collection", auth, collection);

// Request for testing purposes
app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
