var mongoose = require("mongoose");
var Song = require("./models/song");
var User = require("./models/user");
const user = require("./models/user");

var sampleData = [
    {
        name: "I get lonely",
        image: "https://i.scdn.co/image/ab67616d0000b2739c1e02d4becb7c5bbca01e2a",
        artist: "Drake",
        spotifyId: "3sMC6vfTTSa0mMAPTwzDVD",
        type: "sad"
    },
    {
        name: "Shine a light",
        image: "https://i.scdn.co/image/ab67616d0000b2733739660524149aef20ddd20c",
        artist: "Hardwell",
        spotifyId: "1ml3DHDWKMYaAjWy1NI5n2",
        type: "workout"
    },
    {
        name: "Superman",
        image:"https://i.scdn.co/image/ab67616d0000b2730b4cc1764151dfb06fd7b06d",
        artist: "Coone",
        spotifyId: "2rPj7LoFWCYE0i3bqF73eS",
        type: "workout"
    }
]

function seedDB(){
    //Remove all songs
    Song.deleteMany({}, function(err){
         if(err){
             console.log(err);
         }
         console.log("removed all songs");
              //add a few songs
             sampleData.forEach(function(seed){
                 Song.create(seed, function(err, tune){
                     if(err){
                         console.log(err)
                     } else {
                         console.log("added a song");
                     }
                 });
             });
         });
         User.deleteMany({}, function(err){
             if(err) {
                 console.log(err);
             }
             console.log("deleted all users");
         });
     };

     module.exports = seedDB;