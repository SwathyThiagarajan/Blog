var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));



var dbPath  = "mongodb://localhost/MyDB";


db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");

});



var Blog = require('./blogModel.js');

var blogModel = mongoose.model('Blog');
var middleWares = require('./myMiddleware');

app.get('/blogs',middleWares.ageFilter,function(req,res){

	console.log("Shows the blog");
	
    blogModel.find(function(err,result){
		if(err){
			res.send(err)
		}
		else{
			res.send(result)
		}
   });

});


app.get('/blogs/:id',function(req, res) {

	blogModel.findOne({'_id':req.params.id},function(err,result){
		if(err){
			console.log("some error");
			res.send(err);
		}
		else{
			//console.log(result);
			res.send(result)
		}


	});// end user model find 
  
});

app.post('/blog/create',function(req,res){

		var newBlog = new blogModel({

			title 		: req.body.title,
			subTitle 	: req.body.subTitle,
			blogBody 	: req.body.blogBody

		}); 

		
		var today = Date.now();
		newBlog.created = today;

		
		var allTags = (req.body.allTags!=undefined && req.body.allTags!=null)?req.body.allTags.split(','):''
		newBlog.tags = allTags;

		
		var authorInfo = {fullName: req.body.authorFullName,email:req.body.authorEmail};
		newBlog.authorInfo = authorInfo;

		
		newBlog.save(function(error){
			if(error){
				console.log(error);
				res.send(error);

			}
			else{
				
				res.send(newBlog);
			}

		}); 

	  
	});
	app.get('*', function(request,response,next){
	response.status = 404;
	next("Path not found");
});
    app.use(function(err,req,res,next){
	console.log("error handler was used");
	if(res.status == 404){
		res.send("I have not created this page. why dont you go away!!");
	}
	else{
		res.send(err);
	}
});


app.put('/blogs/:id/edit',function(req, res) {

	var update = req.body;

	blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

		if(err){
			console.log("some error");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});
  
});

app.post('/blogs/:id/delete',function(req, res) {

	blogModel.remove({'_id':req.params.id},function(err,result){

		if(err){
			console.log("some error");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});
  
});
	app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});