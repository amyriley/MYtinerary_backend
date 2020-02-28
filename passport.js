const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const userModel = require("../server/model/userModel");
const key = require("../server/keys");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const HttpError = require("../server/model/http-error");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      userModel
        .findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
  passport.use(
    new GoogleStrategy(
      {
        callbackURL: "http://localhost:5000/api/users/auth/google/callback",
        clientID: key.googleClientId,
        clientSecret: key.googleClientSecret
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("passport callback function fired");
        let existingUser;

        try {
          existingUser = userModel.findOne({ email: email });
        } catch (err) {
          const error = new HttpError(
            "Signup failed, please try again later.",
            500
          );
          return error;
        }

        if (existingUser) {
          const error = new HttpError(
            "User already exists. Please choose another email.",
            422
          );
          return error;
        }

        const verifiedEmail =
          profile.emails.find(email => email.verified) || profile.emails[0];
        const newUser = User({
          email: verifiedEmail,
          profilePicture: profile._json.image.url
        });

        newUser.save().then(newUser => {
          done(null, newUser);
        });
      }
    )
  );
};
