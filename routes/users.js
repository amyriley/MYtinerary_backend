const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const userModel = require("../model/userModel");
const HttpError = require("../model/http-error");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const key = require("../keys");
const jwt = require("jsonwebtoken");

router.post(
  "/register",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  async (req, res, next) => {
    const { email, password, profilePicture } = req.body;

    var hash = bcrypt.hashSync(password, saltRounds);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new HttpError(
        "Invalid inputs passed, please check your data.",
        422
      );
      return next(error);
    }

    let existingUser;

    try {
      existingUser = await userModel.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Signup failed, please try again later.",
        500
      );
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
  }
);

router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 5 })],
  async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new HttpError(
        "Invalid inputs passed, please check your data.",
        422
      );
      return next(error);
    }

    let existingUser;

    try {
      existingUser = await userModel.findOne({ email: email });
    } catch (err) {
      const error = new HttpError("Login failed, please try again later.", 500);
      return next(error);
    }

    if (existingUser) {
      bcrypt.compare(password, existingUser.password, function(err, result) {
        if (result) {
          const payload = {
            id: existingUser._id,
            email: existingUser.email,
            profilePicture: existingUser.profilePicture
          };
          const options = { expiresIn: 2592000 };
          jwt.sign(payload, key.secretOrKey, options, (err, token) => {
            if (err) {
              res.json({
                success: false,
                token: "There was an error"
              });
            } else {
              res.json({
                success: true,
                token: token
              });
            }
          });
        } else {
          const error = new HttpError("Password invalid.", 400);
          return next(error);
        }
      });
    }
  }
);

module.exports = router;
