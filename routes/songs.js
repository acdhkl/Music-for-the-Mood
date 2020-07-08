var helpers = require("../helpers.js");
var express = require('express');

require('dotenv').config();
var router = express.Router();
var Song = require('../models/song.js');
var User = require("../models/user.js");
const song = require("../models/song.js");
const { isLoggedIn } = require("../helpers.js");
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
                genres: helpers.shuffle(genres),
                currentUser: req.user
            })
        }
    });
});

//RENDER ADD A NEW SONG PAGE
router.get('/songs/new', helpers.isLoggedIn, function (req, res) {
    res.render('songs/new', {
        genres: genres.sort()
    });
});

router.get('/songs/new', isLoggedIn, function (req, res) {
    res.render('songs/new', {
        genres: genres.sort()
    });
})

//Results page
router.post("/songs/results", function (req, res) {
    spotify
        .search({ type: 'track', query: req.body.query, limit: 12 })
        .then(function (response) {
            res.render("songs/results.ejs", {
                data: response.tracks.items,
                genre: req.body.genre
            })
        })
        .catch(function (err) {
            req.flash("error", "cannot find anything")
            res.redirect("/songs");
        });

})

//Create a new song
router.post('/songs/:id/:genre', helpers.isLoggedIn, function (req, res) {
    //need to pass a different way
    var songId = req.params.id

    //check if song exists in same genre already
    Song.find({ spotifyId: songId }, function (err, matchingSongs) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/songs/new");
        } else {
            var exists = false;
            var matchingSong;
            for (var i = 0; i < matchingSongs.length; i++) {
                if (matchingSongs[i].type == req.params.genre) {
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
                        username: req.user.username,
                        firstName: req.user.firstName,
                        lastName: req.user.lastName
                    }
                    var newSong = {
                        name: name,
                        image: image,
                        type: req.params.genre,
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
                            req.flash("success", "Added new song to your collection!")
                            res.redirect('/songs');
                        }
                    });
                }).catch(function (err) {
                    req.flash("error", "Something went wrong");
                    res.redirect("/songs/new");
                });

            } else {
                //Check if the user owns song already
                var userOwns = false;
                if (matchingSong.authors.filter(e => e.username === req.user.username).length > 0) {
                    userOwns = true;
                }
                //if user owns song, redirect
                if (userOwns) {
                    req.flash("error", "\'" + matchingSong.name + "\' is already part of your " + matchingSong.type + " collection!");
                    res.redirect("/songs");
                } else { //else add to their profile
                    addSongToUser(req, res, matchingSong);
                }
            }
        }
    }
    );
});

//UPVOTING A SONG
router.put("/songs/:id", helpers.isLoggedIn, function (req, res) {
    Song.findById(req.params.id, function (err, song) {
        addSongToUser(req, res, song);
    });
});

//DESTROY
router.delete("/songs/:id", helpers.isLoggedIn, function (req, res) {
    Song.findById(req.params.id, function (err, song) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/profile/" + req.user.id);
        } else {
            for (var i = song.authors.length - 1; i >= 0; --i) {
                if (song.authors[i].id == req.user.id) {
                    song.authors.splice(i, 1);
                    song.save();
                    const index = req.user.songs.indexOf(song.id);
                    if (index > -1) {
                        req.user.songs.splice(index, 1);
                        req.user.save();
                    }
                }
            }
            if (song.authors.length === 0) {
                Song.findOneAndDelete({ _id: req.params.id }, function (err) {
                    if (err) {
                        req.flash("error", err.message);
                        return res.redirect('/songs');
                    }
                })
            }
            req.flash("success", "Successfully removed");
            res.redirect("/profile/" + req.user.id);
        }
    })

});

router.get("/songs/:id", function (req, res) {
    Song.findById(req.params.id, function (err, song) {
        if (err) {
            console.log(err);
        } else {
            res.render("songs/show", {
                song: song
            });
        }
    });
});

router.get("/test", function (req, res) {
    spotify.request('https://api.spotify.com/v1/tracks/' + "2z3htsNRuhDN923ITatc56").then(function (data) {
        res.send(data);
    })
});

router.get("/genres/:name", function (req, res) {
    Song.find({ type: req.params.name }, function (err, songsOfGenre) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/songs');
        } else {
            if (genres.includes(req.params.name)) {
                res.render("songs/genreShow", {
                    genre: req.params.name,
                    genres: genres,
                    songs: songsOfGenre
                });
            } else {
                req.flash("error", "That genre does not exist yet!");
                res.redirect('/songs');
            }
        }
    });
});


module.exports = router;


function addSongToUser(req, res, song) {
    var author = {
        id: req.user._id,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName
    };
    Song.findById(song.id, function (err, song) {
        User.findById(req.user._id, function (err, user) {
            if (song.authors.filter(e => e.username === user.username).length === 0) {
                song.authors.push(author);
                song.save();
                req.user.songs.push(song);
                req.user.save();
                req.flash("success", "Added " + "\'" + song.name + "\' to your " + song.type + " songs");
                res.redirect('/songs');
            } else {
                //FLASH SAYING YOU HAVE ALREADY UPVOTED THIS SONG
                req.flash("error", "\'" + song.name + "\' is already part of your " + song.type + " collection!");
                res.redirect('/songs');
            }
        });
    })
}

function querySt(ji) {

    hu = window.location.search.substring(1);
    gy = hu.split("&");

    for (i=0;i<gy.length;i++) {
        ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
}