var express = require('express');
var router = express.Router();
var Song = require('../models/song.js');

//HOME PAGE- DISPLAY EVERY SINGLE SONG
router.get("/songs", function (req, res) {
    //Get all songs from database
    Song.find({}, function (err, allSongs) {
        if (err) {
            console.log(err);
        } else {
            res.render("songs/index", { songs: allSongs })
        }
    });
});

//RENDER ADD A NEW SONG PAGE
router.get('/songs/new', function(req, res) {
	res.render('songs/new');
});

//CREATE
router.post('/songs', function(req, res) {
	//get data from form and make a song
	var name = req.body.name;
	var image = req.body.image;
	var type = req.body.type;
	var newSong = {
		name: name,
		image: image,
		type: type,
	};
	// Create a new song and save to DB
	Song.create(newSong, function(err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to songs home page
			res.redirect('/songs');
		}
	});
});

router.post("/songs", function (req, res) {
    res.render("songs");
});



module.exports = router;