var express = require('express');

require('dotenv').config();
var router = express.Router();
var Song = require('../models/song.js');
Spotify = require('node-spotify-api');
var genres = ["Workout", "Sad"];

var spotify = new Spotify({
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
});

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
    var songId = req.body.songId;
    spotify.request('https://api.spotify.com/v1/tracks/' + songId).then(function (data) {
        name = data['name'];
        artist = data['artists'][0]['name'];
        image = data['album']['images'][0]['url'];
        previewUrl = data['preview_url'];

        var newSong = {
            name: name,
            image: image,
            type: req.body.type,
            artist: artist,
            spotifyId: songId,
            previewUrl: previewUrl
        }

        //Create a new song and save to DB
        Song.create(newSong, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to songs home page
                res.redirect('/songs');
            }
        });
    }).catch(function (err) {
        console.error('Error occurred: ' + err);
    });
});

//DESTROY
router.delete("/songs/:id", function (req, res) {
    Song.findOneAndDelete({_id: req.params.id}, function (err) {
        if (err) {
            res.redirect('/songs');
        } else {
            res.redirect('/songs');
        }
    })
});

router.get("/test", function(req,res) {
    spotify.request('https://api.spotify.com/v1/tracks/' + "2BJpuAoDeQ1QuPvnryfAWK").then(function (data) {
       res.send(data);

})});


module.exports = router;