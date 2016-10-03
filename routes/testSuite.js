/**
 * Created by johnstrobe on 3/10/16.
 */

(function(){

    var pg = require('pg');
    //needed to connect to heroku
    pg.defaults.ssl = true;
    //location of our heroku DB
    var db = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";
    var db = require('./db.js');
    var search = require('./search.js');
    var editdb = require("./editdb.js");



    module.exports ={
        test: test,
        testAll : testAll
    }

    function testAll(){
        return;
    }

    function test(subPath, cb){

        //do the actions we actually need to be testing -call back with the results

        //count items test
        if(subPath=="countitems"){
            //do stuff
            db.countItems(function(err,result){
                if(err){
                    console.error(err);
                } else {
                    //format our result nicely for testing
                    var array = [0,0,0,0,0,0,0,0,0,0,0,0];
                    for(var i = 0; i<array.length; i++){
                        array[i]=parseInt(result[i][0].count);
                    }
                    console.log(array[0]);

                    cb(false, array);
                }
            })


        } else if(subPath =="second"){
            //do stuff
            cb(false, "test failed");
        }

    }


})();