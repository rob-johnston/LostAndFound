/**
 * Created by johnstrobe on 29/08/16.
 */
//this file is for figuring out what we should do with a edit db post, it basically just checks which method should be executed and then does so, also provides the appropriate response
// message that the page should render afterwards
var db = require('./db.js');
var fs = require('fs');

(function(){

    module.exports = {
        editdb:editdb
    };

    function editdb(req, cb){


        //each method is a different form, so check which one has been used an then call appropriate database method
        if(req.body.addCategory!= null){
            //add category
            db.addCategory(req.body.addCategory,function (err, res) {
                if(err){
                    console.log(err);
                    cb(err);
                } else {
                    cb("Category has been added");
                }
            })
        } else if (req.body.removeCategory!= null){
            db.removeCategory(req.body.removeCategory,function (err, res) {
                if(err){
                    console.log(err);
                    cb(err);
                } else {
                   cb("Category has been removed");
                }
            })

        } else if (req.body.addCampus!=null){
            //add a campus
            db.addCampus(req.body.addCampus, function(err,res){
                if(err){
                    console.log(err);
                    cb(err);
                } else {
                    cb("Campus has been added");
                }
            })
        } else if(req.body.removeCampus!=null){
            //remove a campus
            db.removeCampus(req.body.removeCampus,function (err, res) {
                if(err){
                    console.log(err);
                    cb(err);
                } else {
                    cb("Campus has been removed");
                }
            })
        } else if(req.body.addColName!=null) {
            //remove a campus
            db.addCol(req.body.addColName, req.body.addColType, function (err, res) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb("New Column has been added to items tabel");
                }
            })
        }
        else if(req.body.removeColName!=null) {
            //remove a campus
            db.removeCol(req.body.removeColName, function (err, res) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb("Column has been dropped from the items table");
                }
            })
        }
        else if(req.body.itemRemoveID!=null) {
            //remove an Item by ID
            db.deleteItem(req.body.itemRemoveID, function (err, res) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb("Item has been deleted from the database");
                }
            })
        }
        else if(req.body.itemRemoveDate!=null) {
            //remove all items before a given date
            db.deleteItemsBeforeDate(req.body.itemRemoveDate, function (err, res) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    cb("All items from before " + req.body.itemRemoveDate + " have been deleted");
                }
            })
        }
        else if(req.body.publish!=null){
            console.log("requesting snapshot");


            db.getRestrictedJSONSnapshot(function(err,res){

                if(err){
                    console.error(err);
                }else {
                    console.log("successful snapshot created");
                    fs.writeFile("../static/jsondb.json",res,function(err,data){
                        if(err){
                            console.error(err);
                        }
                        cb("static file created");
                    });
                }
            })

        }
    }




})();


