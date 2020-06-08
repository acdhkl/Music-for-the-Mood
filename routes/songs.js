var express = require('express');
var router = express.Router();
var Song = require('../models/song.js');
var genres = ["Workout", "Sad"];

//HOME PAGE- DISPLAY EVERY SINGLE SONG
router.get("/songs", function (req, res) {
    //Get all songs from database
    Song.find({}, function (err, allSongs) {
        if (err) {
            console.log(err);
        } else {
            res.render("songs/index", {
                songs: allSongs,
                genres: genres
            })
        }
    });
});

//RENDER ADD A NEW SONG PAGE
router.get('/songs/new', function (req, res) {
    res.render('songs/new');
});

//CREATE
router.post('/songs', function (req, res) {
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
    Song.create(newSong, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to songs home page
            res.redirect('/songs');
        }
    });
});

//DESTROY
router.delete("/songs/:id", function (req, res) {
    Song.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/songs');
        } else {
            res.redirect('/songs');
        }
    })
})



module.exports = router;