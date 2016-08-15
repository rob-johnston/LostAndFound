/**
 * Created by johnstrobe on 8/08/16.
 */
(function(){

    var pg = require('pg');
    //needed to connect to heroku
    pg.defaults.ssl= true;
    //location of our heroku DB
    var db = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";



    //all the functions we can use here
    module.exports = {
        db: db,
        getAllItems: getAllItems,
        getCategories: getCategories,
        getCampuses: getCampuses,
        addItem: addItem,
        search: search,
        simpleSearch: simpleSearch,
        advancedSearch: advancedSearch,
        addCategory: addCategory,
        addCampus: addCampus,
        //example:example
        viewItem: viewItem,
        editItem: editItem
    };



    /**
     * Returns all the active items from the database
     * @param cb callback
     */
    function getAllItems(cb) {

        //the sql statement we need
        var stmt = 'SELECT * FROM items';
        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //submit the statement we want
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                cb(false,result);
            });
        });
    }

     /**
     * Returns all possible categories for an item to have
      * used when populating the dropdown menu when adding a new item
     * @param cb callback
     */
    function getCategories(cb) {

        //the sql statement we need
        var stmt = 'SELECT * FROM category';
        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //submit the statement we want
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                cb(false,result);
            });
        });
    }

    /**
     * Returns all the possible campuses
     * used for populating the dropdown menu when adding a new item
     * @param cb callback
     */
    function getCampuses(cb) {

        //the sql statement we need
        var stmt = 'SELECT * FROM campus';
        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //submit the statement we want
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                cb(false,result);
            });
        });
    }

    /**
     * Used to add an item to our database
     * @param data the required fields to add for the item
     * @param cb callback
     */
    function addItem(data,cb) {
        //the sql statement we need
        //last arg is image, need to do get that working
        var args = '(\''+ data.itemName + '\',\'' + data.itemDescription +'\',\''+data.category+'\',\''+ data.dateFound +'\',\'' +
            data.locationFound +'\',\'' + data.campus + '\');'
        //three unconsidered values here. those are DateReturned,DateDiscarded,ImageID - still need to figure out what we are doing with images??
        var stmt = 'INSERT INTO items(itemName,Description,Category,DateFound,LocationFound,Campus) VALUES ' +
            args;
        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //submit the statement we want
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                cb(false,result);
            });
        });
    }

    /**
     * Used to search our db
     * @param search query
     * @param cb callback
     */
    function search(data,cb) {

       //figure out search logic here
        var stmt = '';

        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //execute the search
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                //use call back with out search results
                cb(false,result);
            });
        });
    }

    /**
     * a simple search function that takes text from the search bar and uses it to search the DB
     ** @param search query
     * @param cb callback
     */
    function simpleSearch(data,cb) {

        var words =  data.split(" ");
        //base of the statement
        var stmt = 'SELECT * FROM items WHERE ';
        //loop through to flesh out the query
        for(var i =0; i< words.length; i++){
            stmt = stmt + "ItemName LIKE '%" +words[i]+"%'" +  ' OR Description LIKE ' + "'%" + words[i]+"%' OR ";
        }
        //end of loop, remove trailing OR and replace with semicolon to finish query - is there a better way to do this??
        stmt=stmt.substring(0,stmt.length-4);
        stmt+=' AND datediscarded IS NULL;';


        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //execute the search
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                //use call back with out search results
                cb(false,result);
            });
        });
    }


    /**
     * a more advanced search query that makes use of filters to search the DB
     ** @param search query
     * @param cb callback
     */
    function advancedSearch(data,cb) {

        //need to build this out to make a super complicated SQL query

        var words =  data.split(" ");
        //base of the statement
        var stmt = 'SELECT * FROM items WHERE ';
        //loop through to flesh out the query
        for(var i =0; i< words.length; i++){
            stmt = stmt + "ItemName LIKE '%" +words[i]+"%'" +  ' OR Description LIKE ' + "'%" + words[i]+"%' OR ";
        }
        //end of loop, remove trailing OR and replace with semicolon to finish query - is there a better way to do this??
        stmt=stmt.substring(0,stmt.length-4);
        stmt+=' AND datediscarded IS NULL;';


        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //execute the search
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                //use call back with out search results
                cb(false,result);
            });
        });
    }
    /**
     * this method is used to add a category to the Categories table in the database
     * this should only be accessed by a superuser
     * @param search category to add
     * @param cb callback
     */
    function addCategory(data,cb) {

        var stmt = "INSERT INTO category (cateogy) VALUES ('"+data+"');";
        console.log(stmt);
        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //execute the search
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                //use call back with out search results
                cb(false,result);
            });
        });
    }

    /**
     * this method is used to add a campus to the Campus table in the database
     * this should only be accessed by a superuser
     * @param search campus to add
     * @param cb callback
     */
    function addCampus(data,cb) {

        var stmt = "INSERT INTO campus (campus) VALUES ('"+data+"');";
        console.log(stmt);
        //connect to db
        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //execute the search
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                //use call back with out search results
                cb(false,result);
            });
        });
    }

    // Created by gelidotris 15/08/16
    /**
     * Function which is used to view details about an item in the database
     * @param cb callback
     */
    function viewItem(cb) {
        var stmt = "SELECT * FROM items WHERE itemid = 6";

        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }

            console.log("connection successful");
            //will change to get item id when item links are working in db view
            client.query(stmt, function(error,result){

                var q = JSON.stringify(result.rows);
                var queryResult = JSON.parse(q);

                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }

                cb(false,queryResult[0]);

            });
        });
    }

    // Created by gelidotris 15/08/16
    /**
     * Function which is used to edit details about an item in the database
     * @param cb callback
     */
    function editItem(data,cb) {
        // var convertedDate = new Date(data.dateFound);


        //BUGS -- will be fixing
        //# Can't update date yet - keep getting [error: invalid input syntax for type date: "Invalid Date"] >> left it out of query for now
        //# Changing category causes value to be [object Object] >> same issue occurs when changing campus value
        var stmt = 'UPDATE  items SET itemName =  \''+ data.itemName + '\', Description =  \'' + data.itemDescription + '\', Category = \''
             + data.category + '\', LocationFound = \'' + data.locationFound + '\', Campus = \'' + data.campus + '\'  WHERE itemid = 6;';

        // var stmt = 'UPDATE  items SET itemName =  \''+ data.itemName + '\', Description =  \'' + data.itemDescription + '\', Category = \''
        //     + data.category + '\', DateFound = \''+ convertedDate +'\', LocationFound = \'' + data.locationFound + '\', Campus = \'' + data.campus + '\'  WHERE itemid = 6;';


        pg.connect(db,function(err,client,done){
            if(err){
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return ;
            }
            console.log("connection successful");
            //submit the statement we want
            client.query(stmt, function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                cb(false,result);
            });
        });
        // });
    }


})();