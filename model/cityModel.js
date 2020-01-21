const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    cityName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    }
});

module.exports = mongoose.model("city", citySchema);