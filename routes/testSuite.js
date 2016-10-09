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
;
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
            });

            //testing the ability to add and remove categories
        } else if(subPath =="addremovecategory"){
            db.countCategories(function(err,result){
                console.log(result);
                var initialCount = result;
                db.addCategory("testcategory",function(err,result){
                    db.countCategories(function(err2,result2){
                        var firstConditional = (result2-initialCount==1);
                        db.removeCategory("testCategory", function(err,result){
                            db.countCategories(function(err3,result3){
                                var secondConditional = (result3==initialCount);
                                var toReturn = {first: firstConditional,
                                    second: secondConditional
                                };
                                cb(false,toReturn);
                            })
                        })
                    })
                });
            })

        } else if (subPath =="addremovecampus"){
            db.countCampuses(function(err,result){
                console.log(result);
                var initialCount = result;
                db.addCampus("testcampus",function(err,result){
                    db.countCampuses(function(err2,result2){
                        var firstConditional = (result2-initialCount==1);
                        db.removeCampus("testcampus", function(err,result){
                            db.countCampuses(function(err3,result3){
                                var secondConditional = (result3==initialCount);
                                var toReturn = {first: firstConditional,
                                    second: secondConditional
                                };
                                cb(false,toReturn);
                            })
                        })
                    })
                });
            })

        }

        else if (subPath == "addremoveitem"){
            db.countItems(function(err,result){
                console.log(result);
                var initialCount = result;
                db.addItemTest("testitemname",function(err,result){
                    db.countItems(function(err2,result2){
                        var firstConditional = (result2-initialCount==1);
                        db.deleteItemTest("testitemname", function(err,result){
                            db.countItems(function(err3,result3){
                                var secondConditional = (result3==initialCount);
                                var toReturn = {first: firstConditional,
                                    second: secondConditional
                                }
                                cb(false,toReturn);
                            })
                        })
                    })
                });
            })
        }


    }


})();