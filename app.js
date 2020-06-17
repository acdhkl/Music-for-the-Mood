var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js"),
    seedDB     = require('./seeds');
    Song = require('./models/song.js');

    seedDB();
var songRoutes = require('./routes/songs'),
    indexRoutes = require('./routes/index');



mongoose.connect("mongodb://localhost/song_reccomender", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIG

app.use(require("express-session")({
    secret: "This is a secret shh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");


app.use(indexRoutes);
app.use(songRoutes);


//STARTING SERVER
app.listen(3000, function () {
    console.log("Server has started");
});