const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  cost: {
    type: String,
    required: true
  },
  hashtags: {
    type: [String],
    required: true
  },
  profilePicture: {
    type: String,
    required: false
  },
  rating: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  activities: [
    {
      title: {
        type: String,
        required: true
      },
      picture: {
        type: String,
        required: false
      }
    }
  ]
});

module.exports = mongoose.model("itinerary", itinerarySchema);
