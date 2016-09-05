/**
 * Created by johnstrobe on 8/08/16.
 */
(function(){


    var pg = require('pg');
    //needed to connect to heroku
    pg.defaults.ssl= true;
    //location of our heroku DB
    var db = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";

    //var names of the tables we have
    var ITEMS_TABLE = 'items ';
    var CAMPUSES_TABLE = 'campus ';
    var CATEGORIES_TABLE = 'category ';

    //going to use some vars for building our sql queries
    var SELECT_ALL = 'SELECT * FROM ';
    var INSERT = 'INSERT INTO ';
    var UPDATE = 'UPDATE ';
    var WHERE = "WHERE ";
    var DELETE_FROM = "DELETE FROM ";
    var ALTER = "ALTER ";
    var TABLE = "TABLE ";
    var ADD_COLUMN = "ADD COLUMN ";
    var DROP_COLUMN = "DROP COLUMN ";



    //all the functions we can use here
    module.exports = {
        db: db,
        getAllItems: getAllItems,
        getCategories: getCategories,
        getCampuses: getCampuses,
        addItem: addItem,
        addCategory: addCategory,
        removeCategory: removeCategory,
        addCampus: addCampus,
        removeCampus: removeCampus,
        //example:example
        viewItem: viewItem,
        editItem: editItem,
        addCol: addCol,
        removeCol: removeCol,
        countItems: countItems
    };



    /**
     * Returns all the active items from the database
     * @param cb callback
     */
    function getAllItems(cb) {

        //the sql statement we need
        var stmt = SELECT_ALL + ITEMS_TABLE +';';
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
        var stmt = SELECT_ALL + CATEGORIES_TABLE + ';';
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
        var stmt = SELECT_ALL + CAMPUSES_TABLE + ';';
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
     * Used to add a Column to items table in our db
     * @param new column name and the type it should hold
     * @param cb callback
     */
    function addCol(name,type,cb) {
        var stmt = ALTER + TABLE + ITEMS_TABLE + ADD_COLUMN + name + " " + type + ";";
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
     * Used to remove a Column from items table in our db
     * @param column name to remove
     * @param cb callback
     */
    function removeCol(name,cb) {
        var stmt = ALTER + TABLE + ITEMS_TABLE + DROP_COLUMN + name + ";";
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
     * Used to add an item to our database
     * @param data the required fields to add for the item
     * @param cb callback
     */
    function addItem(data,cb) {
        //the sql statement we need
        var args = '(\''+ data.itemName + '\',\'' + data.itemDescription +'\',\''+data.category+'\',\''+ data.dateFound +'\',\'' +
            data.locationFound +'\',\'' + data.campus + '\',\'' + data.photourl + '\');'
        //two unconsidered values here. those are DateReturned,DateDiscarded

        //Sets default photo if no photo url entered
        if (data.photourl = null){
            data.photourl = ' ';
        }

        var stmt = /*'SET datestyle = \"ISO,DMY\";*/ INSERT + ITEMS_TABLE + '(itemName,Description,Category,DateFound,LocationFound,Campus,photourl) VALUES ' +
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
     * this method is used to add a category to the Categories table in the database
     * this should only be accessed by a superuser
     * @param search category to add
     * @param cb callback
     */
    function addCategory(data,cb) {

        var stmt = INSERT + CATEGORIES_TABLE + " (cateogy) VALUES ('"+data+"');";
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
     * this method is used to remove a category from the category table in the database
     * this should only be accessed by a superuser
     * @param search category to remove
     * @param cb callback
     */
    function removeCategory(data,cb) {

        var stmt = DELETE_FROM + CATEGORIES_TABLE+ " WHERE category LIKE '"+data+"';";
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

        var stmt = INSERT + CAMPUSES_TABLE + " (campus) VALUES ('"+data+"');";
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
     * this method is used to remove a campus from the Campus table in the database
     * this should only be accessed by a superuser
     * @param search campus to remove
     * @param cb callback
     */
    function removeCampus(data,cb) {

        var stmt = DELETE_FROM + CAMPUSES_TABLE + " WHERE CAMPUS LIKE '"+data+"';";
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
    function viewItem(id,cb) {
        if(typeof id === "function" || id==null){
            //use a default thing
            cb(true);
            //if the params arent right here i think we should just bail and not do anything
        }

        var stmt = SELECT_ALL + ITEMS_TABLE + " WHERE itemid = " + id;
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
        var stmt = 'UPDATE  items SET itemName =  \''+ data.itemName + '\', Description =  \'' + data.itemDescription + '\', Category = \''
            + data.category + '\', DateFound = \''+ data.dateFound +'\', LocationFound = \'' + data.locationFound + '\', Campus = \'' + data.campus + '\', photourl = \'' + data.photourl + '\'  WHERE itemid = ' + data.itemid + ' ;';

        pg.connect(db,function(err,client,done){
            if(err){
                console.log('cant connect to db');
                console.log(err);
                return ;
            }

            console.log("Category: " + data.category);
            console.log("connection successful");
            client.query(stmt, function(error,result){

                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }
                cb(false,result);
        });
    })};

    function countItems(cb) {

        var startJan = new Date().setFullYear(new Date().getFullYear(),0,0);
        var startFeb = new Date().setFullYear(new Date().getFullYear(),1,0);
        var startMarch = new Date().setFullYear(new Date().getFullYear(),2,0);
        var startApril = new Date().setFullYear(new Date().getFullYear(),3,0);
        var startMay = new Date().setFullYear(new Date().getFullYear(),4,0);
        var startJune = new Date().setFullYear(new Date().getFullYear(),5,0);
        var startJuly = new Date().setFullYear(new Date().getFullYear(),6,0);
        var startAug = new Date().setFullYear(new Date().getFullYear(),7,0);
        var startSept = new Date().setFullYear(new Date().getFullYear(),8,0);
        var startOct = new Date().setFullYear(new Date().getFullYear(),9,0);
        var startNov = new Date().setFullYear(new Date().getFullYear(),10,0);
        var startDec = new Date().setFullYear(new Date().getFullYear(),11,0);

        var stmt = 'SELECT DateCollected, COUNT(DateCollected) AS collectedCount FROM items WHERE (DateCollected >= :startJan) && (DateCollected < :startFeb);';

        pg.connect(db,function(err,client,done){
            if(err){
                console.log('cant connect to db');
                console.log(err);
                return ;
            }

            console.log("connection successful");

            var listCount = [0,1,2,3,4,5,6,7,8,9,10,11];

            for (i=0;i<listCount.length;i++) {
                client.query(stmt, function (error, result) {
                    done();
                    if (error) {
                        console.log("query failed");
                        console.log(error);
                        return;
                    }
                    listCount[i]=result;
                });
            }
            cb(false,listCount);
        })};
})();