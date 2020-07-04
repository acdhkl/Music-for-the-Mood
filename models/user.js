var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);