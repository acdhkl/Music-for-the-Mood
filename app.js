var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    request = require('request'),
    methodOverride = require('method-override'),
    Song = require('./models/song.js');


var songRoutes = require('./routes/songs'),
    indexRoutes = require('./routes/index');



mongoose.connect("mongodb://localhost/song_reccomender", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});





app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(indexRoutes);
app.use(songRoutes);


//STARTING SERVER
app.listen(3000, function () {
    console.log("Server has started");
});