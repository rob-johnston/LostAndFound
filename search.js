/**
 * Created by johnstrobe on 15/08/16.
 */
(function(){

    var pg = require('pg');
    //needed to connect to heroku
    pg.defaults.ssl= true;
    //location of our heroku DB
    var db = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";
    //var names of the tables we have
    var itemtable = 'items';
    var campustable = 'campus';
    var categoriestable = 'category';


    //all the functions we can use here
    module.exports = {
        search: search,
        simpleSearch: simpleSearch,
        advancedSearch: advancedSearch,
        studentSearch : studentSearch,
        //example:example
    };

    /**
     * this method is used to perform a "student search"
     * this is a search that only uses a category and  (possibly) 2 dates to perform a restricted search
     * @param search category + date range
     * @param cb callback
     */
    function studentSearch(data,cb) {
        //format to get info is... data.query.xxxx   where xxxx is category, from , to;
        //base of the statement - set datestyle and match category
        if(data.query.category=='All Categories'){
            data.query.category = '%'
        }
        var stmt = /*"SET datestyle = \"ISO,DMY\";*/ "SELECT * FROM "+ itemtable +" WHERE category LIKE '" + data.query.category + "' ";
        //if 'from' date is included, add it to the statement
        if(data.query.from!=''){
            stmt += " AND datefound > '"+data.query.from+"' ";
        }
        //if 'to' date is included then add to statement
        if(data.query.to != ''){
            stmt += " AND datefound < '"+data.query.to + "'";
        }
        //adding the final semi colon
        stmt += ";";
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
        var stmt = 'SELECT * FROM ' + itemtable + ' WHERE ';
        //loop through to flesh out the query
        stmt+="(";
        for(var i =0; i< words.length; i++){
            stmt = stmt + "ItemName LIKE '%" +words[i]+"%'" +  ' OR Description LIKE ' + "'%" + words[i]+"%' OR ";
        }

        //end of loop, remove trailing OR and replace with semicolon to finish query - is there a better way to do this??
        stmt=stmt.substring(0,stmt.length-4);
        stmt+=")";
        //include discarded items in search?
        stmt+=' AND datediscarded IS NULL ';
        //add category if included
        if(data.category != "All Categories"){
            stmt+= 'AND category LIKE ' + "'"+data.category+"' ";
        }
        //add campus if included
        if(data.campus != "All Campuses"){
            stmt+= 'AND campus LIKE ' + "'"+ data.campus + "' ";
        }
        if(data.from!=''){
            stmt += " AND datefound > '"+data.from+"' ";
        }
        //if 'to' date is included then add to statement
        if(data.to != ''){
            stmt += " AND datefound < '" + data.to + "'";
        }

        //add final semi cln
        stmt += ';';
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
     * a simple search function that takes text from the search bar and uses it to search the DB
     ** @param search query
     * @param cb callback
     */
    function simpleSearch(data,cb) {

        var words =  data.split(" ");
        //base of the statement
        var stmt = 'SELECT * FROM ' + itemtable + ' WHERE ';
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


})();