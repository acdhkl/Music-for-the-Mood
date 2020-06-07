var express = require("express");
var router  =  express.Router();


//LANDING PAGE- NO INFO JUST WELCOME
router.get("/", function (req, res) {
    res.render("landing");
});


module.exports = router;