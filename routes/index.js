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
    var newUser = new User({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, function () {
            req.flash("success", "Welcome to Song Reccomender, " + req.user.username);
            res.redirect('/profile/' + req.user.id);
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
    req.flash("success", "Logged you out");
    res.redirect("/songs");
});

//Show a profile page of a user
router.get("/profile/:id", function (req, res) {
    var userToPopulate = User.findById(req.params.id, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/songs');
        } else if (!user) {
            req.flash("error", "Looks like this user does not exist!")
            res.redirect('/songs')
        } else {
            userToPopulate.populate('songs').exec((err, user) => {
                if (err) {
                    req.flash("error", err.message);
                    res.redirect("/songs");
                } else {
                    Song.find({}, function (err, allSongs) {
                        if (err) {
                            req.flash("error", err.message);
                        } else {
                            res.render("profile", {
                                songs: allSongs,
                                currentUser: req.user,
                                user: user,
                                genres: helpers.shuffle(genres)
                            });
                        }
                    });
                }
            });
        }
    });
});



module.exports = router;