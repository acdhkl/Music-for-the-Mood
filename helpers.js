var helpersObj = {};
const genres = ["Workout", 
                "Summer Vibes",
                "Chill",
                "Heartbreak",
                "Late Night Drive",
                "Clubbing",
                "House Party",
                "Study"
];

// All genres of music
helpersObj.genres = genres;

// Function to check if a user is logged in
helpersObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

//Fisher-Yates shuffle algorithm
helpersObj.shuffle = function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

helpersObj.compare = function (a, b) {
    if (a.authors.length < b.authors.length) {
        return 1;
    }
    if (a.authors.length > b.authors.length) {
        return -1;
    }
    return 0;
}

module.exports = helpersObj;