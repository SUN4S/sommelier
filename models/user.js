const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    registration_date: { type: Date, default: new Date() },
  },
  { collection: "userData" }
);

module.exports = mongoose.model("UserModel", userSchema);
