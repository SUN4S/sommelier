const mongoose = require("mongoose");

const wineCollectionArray = new mongoose.Schema({
  wine_id: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const collectionSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    wineList: [wineCollectionArray],
  },
  { collection: "collectionData" }
);

module.exports = mongoose.model("CollectionModel", collectionSchema);
