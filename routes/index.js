var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Song = require('../models/song.js');
var helpers = require("../helpers.js");
var genres = helpers.genres;

//LANDING PAGE- NO INFO JUST WELCOME
router.get("/", function (req, res) {
    res.render("landing");
});

// =========
// AUTH ROUTES
// ========

// Show register form
router.get('/register', function (req, res) {
    res.render('register');
});


//handle sign up logic
router.post('/register', function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/songs');
        });
    });
});


//show login form
router.get('/login', function (req, res) {
    res.render('login');
});

//handling login logic
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/songs',
        failureRedirect: '/login'
    }),
    function (req, res) {
    });

//logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/songs");
});

//Show a profile page of a user
router.get("/profile/:id", function (req, res) {
    var userToPopulate = User.findById(req.params.id, function (err, user) {
        if (err || !user) {
            res.redirect('/songs');
        } else {
            userToPopulate.populate('songs').exec((err, user) => {
                if (err) {
                    res.redirect("/songs");
                } else {
                    Song.find({}, function (err, allSongs) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("profile", {
                                songs: allSongs,
                                currentUser: req.user,
                                user: user,
                                genres: helpers.genres
                            });
                        }
                    });

                }
            });
        }
    });
});



    module.exports = router;