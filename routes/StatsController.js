/**
 * Created by borthwstan on 15/08/16.
 */
(function(){
    var pg = require('pg');
    //needed to connect to heroku
    pg.defaults.ssl= true;
    //location of our heroku DB
    var db = "postgres://kwumrsivhgpwme:OkWx2rA84KLrjTPOmSkOc2CIna@ec2-23-21-234-201.compute-1.amazonaws.com:5432/d54qeacf1ad3fc";



    function getXPosJan() {
        Date startJan = new Date().setFullYear(new Date().getFullYear(),0,0);
        Date startFeb = new Date().setFullYear(new Date().getFullYear(),1,0);
        Date startMarch = new Date().setFullYear(new Date().getFullYear(),2,0);
        Date startApril = new Date().setFullYear(new Date().getFullYear(),3,0);
        Date startMay = new Date().setFullYear(new Date().getFullYear(),4,0);
        Date startJune = new Date().setFullYear(new Date().getFullYear(),5,0);
        Date startJuly = new Date().setFullYear(new Date().getFullYear(),6,0);
        Date startAug = new Date().setFullYear(new Date().getFullYear(),7,0);
        Date startSept = new Date().setFullYear(new Date().getFullYear(),8,0);
        Date startOct = new Date().setFullYear(new Date().getFullYear(),9,0)
        Date startNov = new Date().setFullYear(new Date().getFullYear(),10,0)
        Date startDec = new Date().setFullYear(new Date().getFullYear(),11,0)

        var queryJan = 'SELECT DateCollected, COUNT(DateCollected) AS collectedCount'
        queryJan += ' FROM items'
        queryJan += ' WHERE DateCollected >= '

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