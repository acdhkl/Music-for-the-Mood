var helpersObj = {};

// All genres of music
helpersObj.genres = ["Workout", "Sad"];

// Function to check if a user is logged in
helpersObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = helpersObj;