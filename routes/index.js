var express = require('express');
var router = express.Router();
var pg = require('pg');
//needed to connect to heroku
pg.defaults.ssl= true;
//location of our heroku DB
var database = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";
//our js file for interacting with the db
var db = require('../db.js');
var viewitem = require('../routes/viewitem');
var url = require('url');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET listing page. */
router.get('/search', function(req, res, next) {

  //search logic goes here
  //extract from url search query
 var  urlparts = url.parse(req.url,true);
  //at the moment use simple search
  db.simpleSearch(urlparts.query.mysearch,function(err,result){
    if(err){
      console.log.print(err);
      res.render('index', { title: 'Express' });
    }
    console.log(result);
    res.render('index', { title: 'Express' });
  })

});

/* GET add item page. */
router.get('/addItem', function(req, res, next) {
  //need to get categories and campus options from DB to give user the current correct options to use
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
      //render page with info from db
      res.render('addItem', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows});
    })
  })
});

router.post('/addItem', function (req,res){
  //get info from table for re-rendering ad page + add the item to the db
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
      db.addItem(req.body,function(err,result){
        res.render('addItem', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows});
      })
    })
  })
});

/* GET view item page. */
router.get('/advancedSearch', function (req, res) {
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
        res.render('advancedSearch', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows});
    })
  })
});


/* GET view item page. */
router.get('/viewItem', function (req, res) {
  // res.render('viewItem', { title: 'Item View' });
  viewitem.view(req, res, database, pg);
});

/* GET edit item page. */
router.get('/editItem', function (req, res, next) {
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
      //render page with info from db
      res.render('editItem', { title: 'Edit Item', categories: categoryresult.rows, campus: campusresult.rows});
    })
  })
});

// router.get('/editItem', function (req,res){
//   res.render('viewItem', { title: 'Item View' /*, categories: categories, campus: campus*/});
//   //console.log(req.body);
// });

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

/*GET student view page. */
router.get('/studentView', function(req,res,next){
  res.render('studentView', {title: 'Student View'});
});

router.get('/studentSearchResults', function(req,res,next){
  res.render('studentSearchResults', {title: 'Search Results'});
});

/*GET statistics view page. */
router.get('/statistics', function(req,res,next){
  res.render('statistics', {title: 'Statistics'});
});

module.exports = router;
