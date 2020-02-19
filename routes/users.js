const express = require("express");
const router = express.Router();

const userModel = require("../model/userModel");
const HttpError = require("../model/http-error");

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", async (req, res, next) => {
  const { email, password, profilePicture } = req.body;

  var hash = bcrypt.hashSync(password, saltRounds);

  let existingUser;

  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists. Please choose another email.",
      422
    );
    return next(error);
  }

  const newUser = new userModel({
    email: email,
    password: hash,
    profilePicture: profilePicture
  });

  newUser
    .save()
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.status(500).send("Server Error");
    });
});

module.exports = router;
