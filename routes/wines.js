const auth = require("../middleware/auth");
const router = require("express").Router();
const WineModel = require("../models/wines");

// Get all wine list
router.get("/wines", async (req, res) => {
  try {
    const response = await WineModel.find();
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// Get wine list by page, starts at 0, 5 items per page
router.get("/wines/:page", async (req, res) => {
  try {
    const page = req.params.page;
    const response = await WineModel.find()
      .limit(5)
      .skip(page * 5);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

// authenticate and post new wine
router.post("/wines", auth, async (req, res) => {
  try {
    const { title, region, year } = req.body;
    const response = await WineModel.create({ title, region, year });
    res.status(200).send("Created entry");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
