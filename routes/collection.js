const router = require("express").Router();
const { response } = require("express");
const CollectionModel = require("../models/collections");

// Function that returns users wine list
router.get("/my-wines", async (req, res) => {
  try {
    // Mongoose function to get object with wine list using User ID
    const response = await CollectionModel.findOne({
      user_id: req.user.user_id,
    });
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

router.post("/my-wines", async (req, res) => {
  try {
    const { wine_id, quantity } = req.body;
    // Get object containing wine list
    const response = await CollectionModel.findOne({
      user_id: req.user.user_id,
    }).then(async (response) => {
      // filter used to check if wine already exists
      const wine = response.wineList.filter((item) => item.wine_id === wine_id);
      if (wine.length > 0) {
        const newQuantity = wine[0].quantity + +quantity;
        // if wine exists update quantity
        await CollectionModel.findOneAndUpdate(
          { wineList: { $elemMatch: { _id: wine[0]._id } } },
          {
            $set: {
              "wineList.$.quantity": newQuantity,
            },
          }
        );
        return res.send("Updated quantity");
      } else {
        // if wine does not exist, add new entry
        const response = await CollectionModel.findOneAndUpdate(
          { user_id: req.user.user_id },
          { $push: { wineList: { wine_id, quantity } } }
        );
        console.log(response);
        return res.send("Added new wine");
      }
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
