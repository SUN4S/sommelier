const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  // Connecting to the database
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.rgrkl.mongodb.net/${process.env.DB_DBNAME}?retryWrites=true&w=majority`
    );
  } catch (error) {
    console.log(error);
  }
};
