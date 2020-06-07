var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    request = require('request');
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


// Song.create({
//     name: "Righteous",
//     image: "https://static.stereogum.com/uploads/2020/04/unnamed-54-1587734342.jpg",
//     type: "SAD"
// }, function (err, song) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("New song");
//         console.log(song);
//     }
// })








app.use(indexRoutes);
app.use(songRoutes);


//STARTING SERVER
app.listen(3000, function () {
    console.log("Server has started");
});