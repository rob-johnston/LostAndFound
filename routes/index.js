var express = require('express');
var router = express.Router();
var pg = require('pg');
//needed to connect to heroku
pg.defaults.ssl= true;
//location of our heroku DB
var database = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";
//dummy data for categories, will need to extract available categories from the database at some point
var categories = ["phone","clothing","wallet","other"];
var campus = ["Kelburn","Pipitea","Karori","Design School"];

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
    client.query("SELECT * FROM Items", function(error,result){
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


/* GET add item page. */
router.get('/addItem', function(req, res, next) {
  res.render('addItem', { title: 'Express', categories: categories, campus: campus});
});
router.post('/addItem', function (req,res){
  res.render('addItem', { title: 'Express', categories: categories, campus: campus});
  console.log(req.body);
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Log In' });
});

module.exports = router;
