var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    User = require("./models/user.js"),
    seedDB = require('./seeds');
Song = require('./models/song.js');

require('dotenv').config();

// seedDB();
var songRoutes = require('./routes/songs'),
    indexRoutes = require('./routes/index');



// mongoose.connect("mongodb://localhost/song_reccomender", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
mongoose.connect("mongodb+srv://dhakalavinav:" + process.env.password + "@musicforthemood.kpi2s.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        console.log("Connected to DB!");
    }).catch(err => {
        console.log("Error:", err.message);
    });

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG

app.use(require("cookie-session")({
    secret: "This is a secret shh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");


app.use(indexRoutes);
app.use(songRoutes);


//STARTING SERVER
app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started");
});