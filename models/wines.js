const mongoose = require("mongoose");

const wineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    region: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { collection: "wineData" }
);

module.exports = mongoose.model("WineModel", wineSchema);
