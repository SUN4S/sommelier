const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    token: { type: String },
    ex_date: {
      type: Date,
      default: +new Date() + 7 * 24 * 60 * 60 * 1000,
    },
  },
  { collection: "refreshTokens" }
);

module.exports = mongoose.model("RefreshTokenModel", refreshTokenSchema);
