var mongoose = require("mongoose");



//SCHEMA SETUP
var songSchema = new mongoose.Schema({
    name: String,
    image: String,
    artist: String,
    spotifyId: String,
    type: String,
    authors: [{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
    username: String
    }]
});


module.exports = mongoose.model("Song", songSchema);