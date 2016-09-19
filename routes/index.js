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
var editdb = require("../editdb.js");
var url = require('url');
//setting up express session
router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//passport login stuff
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

//example user, will need to actually use db
const user = {
    username: 'admin',
    password: 'admin',
    id: 1
}

router.use(passport.initialize());
router.use(passport.session());

//this is our strategy for logging in, used by passport
passport.use(new LocalStrategy(
    function(USERNAME, PASSWORD, done) {
        /////////////////////////////////////////////////////
        ///////////////////////////////////////////////////
        //example check, need to do real password check here!\\
        ///////////////////////////////////////////////////
        ///////////////////////////////////////////////////////
        console.log(USERNAME+ " " + PASSWORD);
        pg.connect(database,function(err,client){
            if(err) {
                return console.error('could not connect to postgres', err);
            }
            console.log('Connected to database');
            var query = "SELECT * FROM users WHERE username='%NAME%' AND password='%PASSWORD%';".replace("%NAME%", USERNAME).replace("%PASSWORD%", PASSWORD);
            console.log(query);
            client.query(query, function(error, result){
                if(error) {
                    console.error(error);
                    return done(null, false);
                }
                else if (result.rowCount === 0){
                    console.log("Fail");
                    return done(null, false);
                } else {
                    console.log("Success!");
                    const newUser = {
                        username: USERNAME,
                        password: PASSWORD,
                        id: 1
                    }
                    return done(null,newUser);
                }
            })
        });
       /* if(username=='admin' && password == 'admin'){
            return done(null,user);
        }

        return done(null, false);*/

    }
));

//the serialize functions are needed by passport to check the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
//this method is passed as middleware to see if the user is logged in
function ensureAuthenticated() {
    return function(req,res,next){
        if (req.isAuthenticated()) {
            return next();
        }
        var urlparts = url.parse(req.url,true);
       if(urlparts.pathname=='/search'){
           console.log(urlparts.search);
           res.redirect('/studentsearchresults');
       } else {
           //redirect to login if not logged in
           res.redirect('/login');
       }
    }
}

/* login method*/
router.post('/login', passport.authenticate('local', {failureRedirect: '/login',
        failureFlash: true
    }),function(req,res){
        res.render('index', { title: 'Welcome to VUWSA Lost and Found' });
    }
);


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('index', { title: 'Welcome to VUWSA Lost and Found' });
});


/* GET listing page. */
router.get('/search',ensureAuthenticated(), function(req, res, next) {

    //search logic goes here
    //extract from url search query
    var  urlparts = url.parse(req.url,true);
    //at the moment use simple search
    search.simpleSearch(urlparts.query.mysearch,function(err,result){
        db.getCampuses(function(err,campusresult){
            db.getCategories(function(err,categoryresult){
                if(err){
                    console.log.print(err);
                    res.render('index', { title: 'Search - VUWSA Lost and Found' });
                }
                res.render('advancedSearch', { title: 'Search - VUWSA Lost and Found', results : result.rows, campus: campusresult.rows, categories: categoryresult.rows});
            })
        })
    })


});

/* GET edit db page. */
router.get('/editdb',
    ensureAuthenticated(),
    function(req, res, next) {
        console.log(req);
        //need to get categories and campus options from DB to give user the current correct options to use
        db.getCampuses(function(err,campusresult){
            db.getCategories(function(err,categoryresult){
                //render page with info from db
                res.render('editdb', { title: 'Edit Database - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows});
            })
        })
    });

//this is where we deal with posts from the edit db page
router.post('/editdb', ensureAuthenticated(), function (req,res){
    //get info from table for re-rendering ad page + add the item to the db
    db.getCampuses(function(err,campusresult){
        db.getCategories(function(err,categoryresult){
            editdb.editdb(req, function(msg){
                res.render('editdb', { title: 'Add Item - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows, message: msg});
            });
        })
    })
});




/* GET add item page. */
router.get('/addItem', ensureAuthenticated(), function(req, res, next) {
    //need to get categories and campus options from DB to give user the current correct options to use
    db.getCampuses(function(err,campusresult){
        db.getCategories(function(err,categoryresult){
            //render page with info from db
            res.render('addItem', { title: 'Add Item - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows});
        })
    })
});

router.post('/addItem', ensureAuthenticated(), function (req,res){
    //get info from table for re-rendering ad page + add the item to the db
    db.getCampuses(function(err,campusresult){
        db.getCategories(function(err,categoryresult){
            db.addItem(req.body,function(err,result){
                if(err){
                    res.render('addItem', { title: 'Add Item - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows, message: "Error when adding item"});
                }else {
                    res.render('addItem', { title: 'Add Item - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows, message: "Item added successfuly"});
                }

            })
        })
    })
});

/* GET advanced search page. */
router.get('/advancedSearch', ensureAuthenticated(), function (req, res) {
    db.getCampuses(function(err,campusresult){
        db.getCategories(function(err,categoryresult){
            //blank load with no search
            if(url.parse(req.url,true).search ==''){
                res.render('advancedSearch', { title: 'Search Results - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows});
            } else {
                search.advancedSearch(url.parse(req.url,true).query, function(err,result){
                    if(err) {
                        console.log(err);
                    } else {
                        res.render('advancedSearch', { title: 'Search Results - VUWSA Lost and Found', categories: categoryresult.rows, campus: campusresult.rows, results: result.rows});
                    }
                })
            }
        })
    })
});

/* GET view item page. */
router.get('/viewItem', ensureAuthenticated(), function (req, res) {
    var id = url.parse(req.url, true).query.itemid;
    db.viewItem(id,function(err,itemresult){
        //format from timestamp to date
        var yy =itemresult.datefound.substring(0,4);
        var mm = itemresult.datefound.substring(5,7);
        var dd = itemresult.datefound.substring(8,10);
        var ddNew = Number(dd) + Number(1);
        var mmNew = Number(mm);
        // var leapYearCount = Number(0);

        //For months with 30 days -- 4, 6, 9, 11
        if (dd == 30) {
            if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
                mmNew = Number(mm) + Number(1);
                ddNew = Number(1);
                itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
            }
        }

        //For months with 31 days -- 1, 3, 5, 7, 8, 10, 12
        else if (dd == 31){
            if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12){
                mmNew = Number(mm) + Number(1);
                ddNew = Number(1);
                itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
            }
        }

        // If current year is a leap year
        else if (dd == 29 && mm == 2 && Number(yy) % 4 == 0) {
            mmNew = Number(mm) + Number(1);
            ddNew = Number(1);
            itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
        }

        // If current year is not a leap year
        else if (dd == 28 && mm == 2 && Number(yy) % 4 != 0){
            mmNew = Number(mm) + Number(1);
            ddNew = Number(1);
            itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
        }


        // !--- FOR TESTING PURPOSES ---!
        // console.log("VIEWGET dd: " + dd);
        // console.log("VIEWGET ddNew: " + ddNew);
        // console.log("VIEWGET mm: " + mm);
        // console.log("VIEWGET mmNew: " + mmNew);

        itemresult.datefound= ddNew+'-'+mmNew+"-"+yy;
        res.render('viewItem', {
            title: 'View Item - VUWSA Lost and Found',
            itemName: itemresult.itemname,
            itemCategory: itemresult.category,
            itemDesc: itemresult.description,
            itemDateFound: itemresult.datefound,
            itemLocFound: itemresult.locationfound,
            itemCampusLoc: itemresult.campus,
            photoSRC: itemresult.photourl,
            itemid: itemresult.itemid,
            itemReturnStatus: itemresult.returnstatus,
            itemDateReturned: itemresult.datereturned
        });
    })
});


/* GET edit item page. */
router.get('/editItem', ensureAuthenticated(), function (req, res) {
    db.getCampuses(function(err,campusresult){
        db.getCategories(function(err,categoryresult){
            db.viewItem(req.query.id, function(err,itemresult){
                //format from timestamp to date
                var yy =itemresult.datefound.substring(0,4);
                var mm = itemresult.datefound.substring(5,7);
                var dd = itemresult.datefound.substring(8,10);
                var ddNew = Number(dd) + Number(1);
                var mmNew = Number(mm);
                // var leapYearCount = Number(0);

                //For months with 30 days -- 4, 6, 9, 11
                if (dd == 30) {
                    if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
                        mmNew = Number(mm) + Number(1);
                        ddNew = Number(1);
                        itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                    }
                }

                //For months with 31 days -- 1, 3, 5, 7, 8, 10, 12
                else if (dd == 31){
                    if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12){
                        mmNew = Number(mm) + Number(1);
                        ddNew = Number(1);
                        itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                    }
                }

                // If current year is a leap year
                else if (dd == 29 && mm == 2 && Number(yy) % 4 == 0) {
                    mmNew = Number(mm) + Number(1);
                    ddNew = Number(1);
                    itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                }

                // If current year is not a leap year
                else if (dd == 28 && mm == 2 && Number(yy) % 4 != 0){
                    mmNew = Number(mm) + Number(1);
                    ddNew = Number(1);
                    itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                }


                // !--- FOR TESTING PURPOSES ---!
                // console.log("EDITGET dd: " + dd);
                // console.log("EDITGET ddNew: " + ddNew);
                // console.log("EDITGET mm: " + mm);
                // console.log("EDITGET mmNew: " + mmNew);

                itemresult.datefound= ddNew+'-'+mmNew+"-"+yy;
                res.render('editItem', {
                    title: 'Edit Item - VUWSA Lost and Found',
                    categories: categoryresult.rows,
                    campus: campusresult.rows,
                    itemName: itemresult.itemname,
                    itemCategory: itemresult.category,
                    itemDesc: itemresult.description,
                    itemDateFound: itemresult.datefound,
                    itemLocFound: itemresult.locationfound,
                    itemCampusLoc: itemresult.campus,
                    photoSRC: itemresult.photourl,
                    itemid: itemresult.itemid,
                    itemReturnStatus: itemresult.returnstatus,
                    itemDateReturned: itemresult.datereturned
                });
            })
        })
    })
});

router.post('/viewItem', ensureAuthenticated(), function (req,res){
    //get info from table for re-rendering page + add edited info to the db
    db.getCampuses(function(err,campusresult){
        db.getCategories(function(err,categoryresult){
            db.editItem(req.body,function(err2,result){
                db.viewItem(req.body.itemid,function(err,itemresult){
                    //format from timestamp to date
                    var yy =itemresult.datefound.substring(0,4);
                    var mm = itemresult.datefound.substring(5,7);
                    var dd = itemresult.datefound.substring(8,10);
                    var ddNew = Number(dd) + Number(1);
                    var mmNew = Number(mm);
                    // var leapYearCount = Number(0);

                    //For months with 30 days -- 4, 6, 9, 11
                    if (dd == 30) {
                        if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
                            mmNew = Number(mm) + Number(1);
                            ddNew = Number(1);
                            itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                        }
                    }

                    //For months with 31 days -- 1, 3, 5, 7, 8, 10, 12
                    else if (dd == 31){
                        if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12){
                            mmNew = Number(mm) + Number(1);
                            ddNew = Number(1);
                            itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                        }
                    }

                    // If current year is a leap year
                    else if (dd == 29 && mm == 2 && Number(yy) % 4 == 0) {
                        mmNew = Number(mm) + Number(1);
                        ddNew = Number(1);
                        itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                    }

                    // If current year is not a leap year
                    else if (dd == 28 && mm == 2 && Number(yy) % 4 != 0){
                        mmNew = Number(mm) + Number(1);
                        ddNew = Number(1);
                        itemresult.datefound = ddNew + '-' + mmNew + "-" + yy;
                    }

                    // !--- FOR TESTING PURPOSES ---!
                    // console.log("VIEWPOST dd: " + dd);
                    // console.log("VIEWPOST ddNew: " + ddNew);
                    // console.log("VIEWPOST mm: " + mm);
                    // console.log("VIEWPOST mmNew: " + mmNew);

                    itemresult.datefound= ddNew+'-'+mmNew+"-"+yy;
                    res.render('viewItem', {
                        title: 'View Item - VUWSA Lost and Found',
                        itemName: itemresult.itemname, itemCategory:
                        itemresult.category,
                        itemDesc: itemresult.description,
                        itemDateFound: itemresult.datefound,
                        itemLocFound: itemresult.locationfound,
                        itemCampusLoc: itemresult.campus,
                        photoSRC: itemresult.photourl,
                        itemid:itemresult.itemid,
                        itemReturnStatus: itemresult.returnstatus,
                        itemDateReturned: itemresult.datereturned
                    });
                })
            })
        })
    })
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Log In - VUWSA Lost and Found' });
});

/*GET student view page. */
router.get('/studentView', function(req,res,next){
    res.render('studentView', {title: 'Student View - VUWSA Lost and Found'});
});

//deals with performing a restricted student search
router.get('/studentSearchResults', function(req,res,next){
        db.getCategories(function (err, categoryresult) {
            //if no url params then just load
            if (url.parse(req.url, true).search == '') {
                //render the page without results!
                res.render('studentSearchResults', {title: 'Student Search - VUWSA Lost and Found', categories: categoryresult.rows, results: 0});
            } else {
                //otherwise perform a student search
                search.studentSearch(url.parse(req.url, true), function (err, result) {
                    if (err) {
                        console.log("error performing student search");
                    } else {
                        //render student results page with the results from the DB
                        console.log(result.rows.length);
                        res.render('studentSearchResults', {title: 'Search Results - VUWSA Lost and Found', categories:categoryresult.rows, results: result.rows.length});
                    }
                });
            }
        })
});

/*GET statistics view page. */  //MUST FIX ONLY WORKS FOR 2016
router.get('/statistics', function(req,res,next){
    db.countItems(function (err, arrResult) {
        var jan = 450 - ((JSON.stringify(arrResult[0]).match(/\d+/)[0])*30);
        var feb = 450 - ((JSON.stringify(arrResult[1]).match(/\d+/)[0])*30);
        var mar = 450 - ((JSON.stringify(arrResult[2]).match(/\d+/)[0])*30);
        var apr = 450 - ((JSON.stringify(arrResult[3]).match(/\d+/)[0])*30);
        var may = 450 - ((JSON.stringify(arrResult[4]).match(/\d+/)[0])*30);
        var jun = 450 - ((JSON.stringify(arrResult[5]).match(/\d+/)[0])*30);
        var jul = 450 - ((JSON.stringify(arrResult[6]).match(/\d+/)[0])*30);
        var aug = 450 - ((JSON.stringify(arrResult[7]).match(/\d+/)[0])*30);
        var sep = 450 - ((JSON.stringify(arrResult[8]).match(/\d+/)[0])*30);
        var oct = 450 - ((JSON.stringify(arrResult[9]).match(/\d+/)[0])*30);
        var nov = 450 - ((JSON.stringify(arrResult[10]).match(/\d+/)[0])*30);
        var dec = 450 - ((JSON.stringify(arrResult[11]).match(/\d+/)[0])*30);

        res.render('statistics', {title: 'Statistics - VUWSA Lost and Found', january: jan, february: feb, march: mar, april: apr, may: may, june: jun, july: jul, august: aug, september: sep, october: oct, november: nov, december: dec});
    })

});

module.exports = router;
