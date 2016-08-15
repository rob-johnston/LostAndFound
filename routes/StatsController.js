/**
 * Created by borthwstan on 15/08/16.
 */
(function(){
    var pg = require('pg');
    //needed to connect to heroku
    pg.defaults.ssl= true;
    //location of our heroku DB
    var db = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";

    Date curYear = new Date().getFullYear();
    Date curMonth = new Date().getMonth();

    function getXPosJan() {
        var queryJan = 'SELECT DateCollected, COUNT(DateCollected) AS collectedCount'
        queryJan += 'FROM items'
        queryJan += 'WHERE DateCollected >= '

        //connect to db
        pg.connect(db, function (err, client, done) {
            if (err) {
                //deal with db connection issues
                console.log('cant connect to db');
                console.log(err);
                return;
            }
            console.log("connection successful");
            //execute the search
            client.query(queryJan, function (error, result) {
                done();
                if (error) {
                    console.log("query failed");
                    console.log(error);
                    return;
                }
            });
        });
    }

}