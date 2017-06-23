
var Movie  = require('../models/movie');
var Category  = require('../models/Category');

exports.index = function(req, res) {
	Category.find({})
		.populate({path:"movies",options:{limit: 5}})
		.exec(function(err, categories) {
			if (err) {
				console.log(err);
			}
			res.render("index", {
				title: 'imooc 首页',
				categories: categories
			})
		})
}

exports.search = function(req, res) {
	var pageSize = 2;
	var catId = req.query.cat;
	var q = req.query.q;
	var page = parseInt(req.query.p, 10) || 0;
	var index = page*pageSize;
	var count = 0;
	if (catId) {
		Movie.count({category: catId},function(err, count){
			Category.find({_id: catId})
				.populate({
					path:"movies",
					select:"title poster",
					options:{limit: 2, skip: index}
				})
				.exec(function(err, categories) {
					if (err) {
						console.log(err);
					}
					var category = categories[0] || [];
					var movies = category.movies;
					res.render("result", {
						title: 'imooc 结果列表',
						keyword: category.name,
						movies: movies,
						currentPage: page,
						totalPage: Math.ceil(count/pageSize),
						query: "cat="+catId
					})
				})
		})
	}else {
		Movie.count({title: new RegExp(q+".*", "i")},function(err, count){
			Movie.find({title: new RegExp(q+".*", "i")})
				.skip(index)
				.limit(pageSize)
				// .populate({
				// 	select:"title poster",
				// 	options:{limit: 2, skip: index}
				// })
				.exec(function(err, movies) {
					if (err) {
						console.log(err);
					}
					res.render("result", {
						title: 'imooc 结果列表',
						keyword: q,
						movies: movies,
						currentPage: page,
						totalPage: Math.ceil(count/pageSize),
						query: "q="+q
					})

				})
		})
	}
}