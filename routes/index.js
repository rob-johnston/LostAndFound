var express = require('express');
var router = express.Router();
var pg = require('pg').native;
var database = "postgres://johnstrobe:@depot:5432/SWEN302";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET listing page. */
router.get('/search', function(req, res, next) {

  //search logic goes here
 // var urlparts = url.parse(req.url,true);

  pg.connect(database,function(err,client,done){
    if(err){
      console.log('cant connect to db');
      console.log(err);
      return ;
    }
    console.log("connection successful");
    //hardcoded example query here, will need to build it properly for searching
    client.query("SELECT * FROM items;", function(error,result){
      done();
      if(error){
        console.log("query failed");
        console.log(error);
        return;
      }
      //console log the results, which at the moment is one half filled item
      console.log(result);
    });
  });

  res.render('index', { title: 'Express' });
});


module.exports = router;
