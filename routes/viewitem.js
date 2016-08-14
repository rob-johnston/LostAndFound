//Created by gelidotris on 8/08/16


module.exports = {
    /*
     Create function to return and display information about a product
     */
    view : function (req, res, database, pg) {
        pg.connect(database, function (err, client, done) {
            if (err) {
                console.error('Could not connect to the database');
                console.error(err);
                return;
            }

            console.log("connection successful");
            //submit the statement we want
            client.query("SELECT * FROM items WHERE itemid = 1", function(error,result){
                done();
                if(error){
                    console.log("query failed");
                    console.log(error);
                    return;
                }

                var q = JSON.stringify(result.rows);
                var queryResult = JSON.parse(q);

                var name = queryResult[0].itemname;
                var desc = queryResult[0].description;
                var dateFound = queryResult[0].datefound;
                var locFound = queryResult[0].locationfound;
                var campusloc = queryResult[0].campus;
                var category = queryResult[0].category;



                res.render('viewItem', {itemName: name, itemCategory: category, itemDesc: desc, itemDateFound: dateFound,
                    itemLocFound: locFound, itemCampusLoc: campusloc});

            });
        });
    }

}