var Comment  = require('../models/comment');

exports.save =  function(req, res) {
	var _comment = req.body.comment;
	var movieId  = _comment.movie;

	if (_comment.cid) {
		console.log("老评论")
		Comment.findById(_comment.cid, function(err, comment) {
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content:_comment.content
			}			
			comment.reply.push(reply)
			comment.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
				res.redirect("/movie/"+movieId)
			})
		})
	}else {
		console.log("新评论")
		var comment = new Comment(_comment)
		comment.save(function(err, movie) {
			if (err) {
				console.log(err)
			}
			res.redirect("/movie/"+movieId)
		})
	}	
}
