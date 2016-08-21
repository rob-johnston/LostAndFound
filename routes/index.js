var express = require('express');
var router = express.Router();
var pg = require('pg');
//needed to connect to heroku
pg.defaults.ssl= true;
//location of our heroku DB
var database = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";
//our js file for interacting with the db
var db = require('../db.js');
var search = require('../search.js');
var url = require('url');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/datetest', function(req, res, next) {
    res.render('datetest', {});
});

/* GET listing page. */
router.get('/search', function(req, res, next) {

  //search logic goes here
  //extract from url search query
 var  urlparts = url.parse(req.url,true);
  //at the moment use simple search
  search.simpleSearch(urlparts.query.mysearch,function(err,result){
      db.getCampuses(function(err,campusresult){
          db.getCategories(function(err,categoryresult){
              if(err){
                  console.log.print(err);
                  res.render('index', { title: 'Express' });
              }
              res.render('advancedSearch', { title: 'Express', results : result.rows, campus: campusresult.rows, categories: categoryresult.rows});
          })
      })
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
          if(err){
              res.render('addItem', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows, message: "Error when adding item"});
          }else {
              res.render('addItem', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows, message: "Item added successfuly"});
          }

      })
    })
  })
});

/* GET advanced search page. */
router.get('/advancedSearch', function (req, res) {
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
        //blank load with no search
        if(url.parse(req.url,true).search ==''){
            res.render('advancedSearch', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows});
        } else {
            search.advancedSearch(url.parse(req.url,true).query, function(err,result){
                if(err) {
                    console.log(err);
                } else {
                    res.render('advancedSearch', { title: 'Express', categories: categoryresult.rows, campus: campusresult.rows, results: result.rows});
                }
            })
        }
    })
  })
});

/* GET view item page. */
router.get('/viewItem', function (req, res) {
      db.viewItem(function(err,itemresult){
        res.render('viewItem', {title: 'View Item', itemName: itemresult.itemname, itemCategory: itemresult.category, itemDesc: itemresult.description, itemDateFound: itemresult.datefound,
          itemLocFound: itemresult.locationfound, itemCampusLoc: itemresult.campus});
      })
});

/* GET edit item page. */
router.get('/editItem', function (req, res) {
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
      db.viewItem(function(err,itemresult){
        res.render('editItem', {title: 'Edit Item', categories: categoryresult.rows, campus: campusresult.rows, itemName: itemresult.itemname, itemCategory: itemresult.category, itemDesc: itemresult.description, itemDateFound: itemresult.datefound,
          itemLocFound: itemresult.locationfound, itemCampusLoc: itemresult.campus});
      })
    })
  })
});

router.post('/editItem', function (req,res){
  //get info from table for re-rendering ad page + add edited info to the db
  db.getCampuses(function(err,campusresult){
    db.getCategories(function(err,categoryresult){
      db.editItem(req.body,function(err,result){
        db.viewItem(function(err,itemresult){
          res.render('editItem', {title: 'Edit Item', categories: categoryresult.rows, campus: campusresult.rows, itemName: itemresult.itemname, itemCategory: itemresult.category, itemDesc: itemresult.description, itemDateFound: itemresult.datefound,
            itemLocFound: itemresult.locationfound, itemCampusLoc: itemresult.campus});
        })
      })
    })
  })
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

/*GET student view page. */
router.get('/studentView', function(req,res,next){
  res.render('studentView', {title: 'Student View'});
});

//deals with performing a restricted student search
router.get('/studentSearchResults', function(req,res,next){
    db.getCampuses(function(err,campusresult) {
        db.getCategories(function (err, categoryresult) {
            //if no url params then just load
            if (url.parse(req.url, true).search == '') {
                //render the page without results!
                res.render('studentSearchResults', {title: 'Student Search', categories: categoryresult.rows, campus: campusresult.rows, results: null});
            } else {
                //otherwise perform a student search
                search.studentSearch(url.parse(req.url, true), function (err, result) {
                    if (err) {
                        console.log("error performing student search");
                    } else {
                        //render student results page with the results from the DB
                        res.render('studentSearchResults', {title: 'Search Results', categories: categoryresult.rows, campus: campusresult.rows, results: result.rows});
                    }
                });
            }
        })
    })
});

/*GET statistics view page. */
router.get('/statistics', function(req,res,next){
  res.render('statistics', {title: 'Statistics'});
});

module.exports = router;
