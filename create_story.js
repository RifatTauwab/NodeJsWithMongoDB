var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/form', function (req, res) {
   res.sendFile( __dirname + "/" + "story_form.html" );
})

app.post('/create_story', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      story_title:req.body.story_title,
      story_description:req.body.story_description,
	  story_author:req.body.story_author,
	  story_date:req.body.story_date
   };
   console.log(response);
   var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb://localhost:27017/news";

   MongoClient.connect(url, function(err, db) {
   if (err) throw err;
  
   db.collection("story").insertOne(response, function(err, res) {
       if (err) throw err;
       console.log("1 document inserted");
       db.close();
    });
    });
   res.end(JSON.stringify(response));
})

app.get('/story', function (req, res) {
   res.sendFile( __dirname + "/" + "story_list.html" );
})
app.get('/get_story', function (req, res) {
	
	var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/news";
    var stories = "";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        //Find all documents in the customers collection:
        db.collection("story").find({},
		{
		 _id: false, 
		 story_title: true, 
		 story_description: true,
		 story_author: true,
		 story_date: true
		}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
		res.send(result);
        db.close();
        });
    });
   //res.sendFile( __dirname + "/" + "story_list.html" );
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)

})