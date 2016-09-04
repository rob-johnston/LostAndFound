/**
 * Created by pangaaro on 5/09/16.
 */
var express = require('express');
var router = express.Router();

/*GET login page*/
router.get('/',function(req,res,next){
    res.render('login',{title:'Login'})
});

router.post('/', function(req,res,next){
    console.log("Attempting to log in");
    var USERNAME = req.body.user;
    var PASSWORD = req.body.password;
    username = req.body.user;
});