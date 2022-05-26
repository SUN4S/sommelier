const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const CollectionModel = require("../models/collections");
const RefreshTokenModel = require("../models/refreshToken");
const router = require("express").Router();
const auth = require("../middleware/auth");

// Function to generate new token, expiration time-15min
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: "15min" });
};

// Route to Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate inputs
    if (!(username && email && password)) {
      res.status(400).send("All input is required");
    }

    // Validate if user exist in our database
    const oldUser = await UserModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username }],
    });
    if (oldUser) {
      return res.status(409).json({ msg: "Username or Email already in use" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await UserModel.create({
      username,
      email: email.toLowerCase(), // convert email to lowercase
      password: encryptedPassword,
    });

    // create wine-collection collection
    await CollectionModel.create({ user_id: user._id, wineList: [] });

    // Create token
    const token = generateAccessToken({ user_id: user._id, email });
    // save user token
    user.token = token;
    // return new user
    res.status(201).json(user);
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All inputs are required");
    }
    // Validate if user exist in my database
    const user = await UserModel.findOne({ username: username });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const accessToken = generateAccessToken({
        user_id: user._id,
        username: username,
      });

      // generate a refresh token
      const refreshToken = jwt.sign(
        { user_id: user._id, username },
        process.env.JWT_REFRESH_TOKEN_SECRET
      );

      // When logged in save refresh token to database
      RefreshTokenModel.update(
        { user_id: user._id, token: refreshToken },
        { upsert: true }
      );
      return res.status(200).json({ accessToken, refreshToken });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    res.send(error);
  }
});

// loggout
router.delete("/logout", async (req, res) => {
  // Delete refresh token from database
  const deleteRefresh = await RefreshTokenModel.findOneAndDelete({
    token: req.body.token,
  });
  const response = await deleteRefresh;
  return res.status(204).send("Delete successfull");
});

// authenticate user and change password
router.post("/change-password", auth, async (req, res) => {
  try {
    const user = req.user;
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    const serverUser = await UserModel.findOne({ _id: user.user_id });
    // check if old password and password saved on database match
    if (
      serverUser &&
      (await bcrypt.compare(req.body.oldPassword, serverUser.password))
    ) {
      // update user password
      await UserModel.findOneAndUpdate(
        { _id: user.user_id },
        { password: newPassword }
      );
      return res.send("Password updated");
    }
  } catch (error) {
    res.send(error);
  }
});

// Function to generate a new token from Refresh Token
router.post("/token", async (req, res) => {
  // get refresh token from body
  const refreshToken = req.body.token;
  // get refresh token from database
  const serverToken = await RefreshTokenModel.findOne({
    token: refreshToken,
  });

  // Check if Refresh token is expired
  if (serverToken.ex_date < new Date()) {
    // if token is expired, remove refresh token from database
    // and send text to user
    await RefreshTokenModel.findOneAndDelete({ token: serverToken.token });
    return res.send("Token Expired");
  }

  // If body token or server token does not exist, error
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  if (!serverToken) {
    return res.sendStatus(401);
  }

  // check if both refresh tokens match
  if (refreshToken !== serverToken.token) {
    return res.sendStatus(401);
  }

  // verify token
  jwt.verify(
    serverToken.token,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // generate new token from refresh token
      const accessToken = generateAccessToken({
        user_id: user.user_id,
        username: user.username,
      });

      res.json({
        accessToken,
      });
    }
  );
});

module.exports = router;
