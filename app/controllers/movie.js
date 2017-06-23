var Movie  = require('../models/movie');
var Category  = require('../models/category');
var Comment = require('../models/comment');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

exports.detail = function(req, res) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		Comment
		.find({movie:id})
		.populate("from", "name")
		.populate("reply.from reply.to", "name")
		.exec(function(err, comments) {
			res.render("detail", {
				title: 'imooc 详情页',
				movie: movie,
				comments: comments
			})
		})
	})
}
exports.saveposter = function(req, res, next) {
	var posterData = req.files.uploadPoster

	var filePath = posterData.path
	var fileName = posterData.originalFilename
	console.log(req.files)
	if (fileName) {
		fs.readFile(filePath, function(err, data) {
			var timeStamp = Date.now()
			var type = posterData.type.split("/")[1]
			var poster = timeStamp + '.' +type;
			var newPath = path.join(__dirname, "../../", "/public/upload/"+poster)

			fs.writeFile(newPath, data, function(err) {
				req.poster = poster
				next()
			})
		})
	}else {
		next()
	}
}
exports.save =  function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;

	var _movie ;
	if (req.poster) {
		movieObj.poster = req.poster
	}
	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect("/movie/"+movie._id)
			})
		})
	}else {
		_movie = new Movie(movieObj)
		categoryId = _movie.category;
		var categoryName = movieObj.categoryName;
		_movie.save(function(err, movie) {
			if (err) {
				console.log("chucuole", err)
			}
			if (categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id)
					category.save(function(err, category) {
						res.redirect("/movie/"+movie._id)		
					})
				})
			}else {
				var category = new Category({
					name :categoryName,
					movies: [movie._id]
				})
				category.save(function(err, category) {
					movie.category = category._id
					movie.save(function(err, movie) {
						res.redirect("/movie/"+movie._id)
					})
					
				})
			}			
		})
	}

}
// admin page

exports.new = function(req, res) {
	Category.fetch(function(err, categories) {
		if(err){
			console.log(err)
		}
		res.render("admin", {
			title: 'imooc 录入页面',
			categories:categories,
			movie:{}
		})	
	})
	
}

// detial page

exports.update = function(req, res) {

	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			Category.fetch(function(err, categories) {
				res.render("admin", {
					title: 'imooc 详情页',
					movie: movie,
					categories:categories
				})	
			})
		})	
	}
	
}

// list page

exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render("list", {
			title: 'imooc 列表页',
			movies:movies
		})	
	})
}

exports.delete = function(req, res) {
	var id = req.query.id
	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err)
			}else {
				res.json({success: 1})
			}
		})
	}
}