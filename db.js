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
        studentSearch : studentSearch
        //example:example
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
        //base of the statement
        console.log(data);
        var words = data.keywords.split(" ");
        var stmt = 'SELECT * FROM items WHERE ';
        //loop through to flesh out the query
        for(var i =0; i< words.length; i++){
            stmt = stmt + "ItemName LIKE '%" +words[i]+"%'" +  ' OR Description LIKE ' + "'%" + words[i]+"%' OR ";
        }
        //end of loop, remove trailing OR and replace with semicolon to finish query - is there a better way to do this??
        stmt=stmt.substring(0,stmt.length-4);
        stmt+=' AND datediscarded IS NULL ';
        stmt+= 'AND category LIKE ' + "'"+data.category+"' ";
        stmt+= 'AND campus LIKE ' + "'"+ data.campus + "';";


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


    /**
     * this method is used to perform a "student search"
     * this is a search that only uses a category and 2 dates to perform a restricted search
     * @param search category + date range
     * @param cb callback
     */
    function studentSearch(data,cb) {
        //format to get info is... data.query.xxxx   where xxxx is category, from , to;
        //base of the statement
        var stmt = "SELECT * FROM items WHERE category LIKE '" + data.query.category + "' ;";

       // stmt+=' AND datediscarded IS NULL;';


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





})();