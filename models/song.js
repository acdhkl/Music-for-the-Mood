var mongoose = require("mongoose");

//SCHEMA SETUP
var songSchema = new mongoose.Schema({
    name: String,
    image: String,
    type: String
});

module.exports = mongoose.model("Song", songSchema);