/**
 * Created by johnstrobe on 29/08/16.
 */
//this file is for figuring out what we should do with a edit db post,
var db = require('./db.js');

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
        } else if(req.body. removeCampus!=null){
            //remove a campus
            db.removeCampus(req.body.removeCampus,function (err, res) {
                if(err){
                    console.log(err);
                    cb(err);
                } else {
                    cb("Campus has been removed");
                }
            })
        }

    }





})();


