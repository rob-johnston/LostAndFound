/**
 * Created by pangaaro on 5/09/16.
 */
var express = require('express');
var router = express.Router();
var database = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";
var pg = require('pg').native;
var username = null;

/*GET login page*/
router.get('/',function(req,res,next){
    res.render('login',{title:'Login'})
});

router.post('/', function(req,res,next){
    console.log("Attempting to log in");
    var USERNAME = req.body.user;
    var PASSWORD = req.body.password;
    username = req.body.user;
    console.log(USERNAME + " " + PASSWORD);
    var query = "SELECT * FROM Users WHERE username='%NAME%' AND password='%PASSWORD%';".replace("%NAME%", USERNAME).replace("%PASSWORD%", PASSWORD);
    pg.connect(database, function(err,client,done){
        
    })
});