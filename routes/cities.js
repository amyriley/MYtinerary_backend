const express = require("express");
const router = express.Router();

const cityModel = require("../model/cityModel");
const itineraryModel = require("../model/itineraryModel");
const HttpError = require("../model/http-error");

router.get("/all", (req, res) => {
  cityModel
    .find({})
    .then(files => {
      res.send(files);
    })
    .catch(err => console.log(err));
});

router.post("/", async (req, res, next) => {
  const { cityName, country, imageUrl } = req.body;

  let existingCity;

  try {
    existingCity = await cityModel.findOne({ cityName: cityName });
  } catch (err) {
    const error = new HttpError(
      "Adding a new city failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingCity) {
    const error = new HttpError(
      "City already exists. Please choose another city to add.",
      422
    );
    return next(error);
  }

  const newCity = new cityModel({
    cityName: req.body.cityName,
    country: req.body.country
  });

  newCity
    .save()
    .then(city => {
      res.send(city);
    })
    .catch(err => {
      res.status(500).send("Server Error");
    });
});

router.get("/:cityId", (req, res) => {
  let cityRequested = req.params.cityId;

  itineraryModel
    .find({ city: cityRequested })
    .then(itineraries => {
      res.send(itineraries);
    })
    .catch(err => console.log(err));
});

module.exports = router;
