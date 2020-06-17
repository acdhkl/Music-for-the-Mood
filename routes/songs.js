var helpers = require("../helpers.js");
var express = require('express');

require('dotenv').config();
var router = express.Router();
var Song = require('../models/song.js');
var User = require("../models/user.js");
const song = require("../models/song.js");
Spotify = require('node-spotify-api');
var genres = helpers.genres;


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
                genres: genres,
                currentUser: req.user
            })
        }
    });
});

//RENDER ADD A NEW SONG PAGE
router.get('/songs/new', helpers.isLoggedIn, function (req, res) {
    res.render('songs/new', {
        genres: genres
    });
});

//Create a new song
router.post('/songs', helpers.isLoggedIn, function (req, res) {
    // Extract spotify track ID from link
    // Start of every spotify track ID starts at index 31 of link
    var link = req.body.link;
    var endOfId = 0;
    for (var i = 31; i < link.length; i++) {
        if (link.charAt(i) == '?') {
            endOfId = i;
            break;
        }
    }
    var songId = link.slice(31, endOfId);

    //check if song exists in same genre already
    Song.find({ spotifyId: songId }, function (err, matchingSongs) {
        var exists = false;
        var matchingSong;
        for (var i = 0; i < matchingSongs.length; i++) {
            if (matchingSongs[i].type == req.body.genre) {
                exists = true;
                matchingSong = matchingSongs[i];
                break;
            }
        };

        //if song doesnt exist yet, get data from form and make a song
        if (!exists) {
            spotify.request('https://api.spotify.com/v1/tracks/' + songId).then(function (data) {
                name = data['name'];
                artist = data['artists'][0]['name'];
                image = data['album']['images'][0]['url'];
                previewUrl = data['preview_url'];

                var author = {
                    id: req.user._id,
                    username: req.user.username
                }
                var newSong = {
                    name: name,
                    image: image,
                    type: req.body.genre,
                    artist: artist,
                    spotifyId: songId,
                    previewUrl: previewUrl,
                    authors: [author]
                };



                //Create a new song and save to DB
                Song.create(newSong, function (err, newlyCreated) {
                    if (err) {
                        console.log(err);
                    } else {
                        // save and redirect back to songs home page
                        req.user.songs.push(newlyCreated);
                        req.user.save();
                        res.redirect('/songs');
                    }
                });
            }).catch(function (err) {
                console.error('Error occurred: ' + err);
            });

        } else {
            //Check if the user owns song already
            var userOwns = false;
            console.log(matchingSong.authors)
            if ( matchingSong.authors.filter(e => e.username === req.user.username).length > 0) {
                userOwns = true;
            }

            //if user owns song, redirect
            if (userOwns) {
                //flash saying user already has added
                res.redirect("/songs");
            } else { //else add to their profile
                addSongToUser(req, res, matchingSong);
            }
        }
    }
    );
});

//UPVOTING A SONG
router.put("/songs/:id", helpers.isLoggedIn, function(req, res){
    Song.findById(req.params.id, function(err, song){
        addSongToUser(req, res, song);
    });  
});

//DESTROY
router.delete("/songs/:id", helpers.isLoggedIn, function (req, res) {
    Song.findOneAndDelete({ _id: req.params.id }, function (err) {
        if (err) {
            res.redirect('/songs');
        } else {
            res.redirect('/songs');
        }
    })
});

router.get("/test", function (req, res) {
    spotify.request('https://api.spotify.com/v1/tracks/' + "2z3htsNRuhDN923ITatc56").then(function (data) {
        res.send(data);

    })
});


module.exports = router;


function addSongToUser(req, res, song) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };


    Song.findById(song.id, function (err, song) {
        User.findById(req.user._id, function (err, user) {
            if (song.authors.filter(e => e.username === user.username).length === 0) {
                song.authors.push(author);
                song.save();
                req.user.songs.push(song);
                req.user.save();
                res.redirect('/songs');
                console.log(song.authors);
                console.log(req.user.songs);
            } else {
                //FLASH SAYING YOU HAVE ALREADY UPVOTED THIS SONG
                res.redirect('/songs');
            }
        });
    })
}