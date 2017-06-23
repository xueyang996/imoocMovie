var index = require('../app/controllers/index');
var user = require('../app/controllers/user');
var movie = require('../app/controllers/movie');
var comment = require('../app/controllers/comment');
var category = require('../app/controllers/category');

module.exports = function(app) {
	app.use(function(req, res, next) {
		var _user = req.session.user
			app.locals.user = _user;
		next()
	})
	app.get("/", index.index)

	// detial page

	app.get("/movie/:id", movie.detail)
	app.post("/admin/movie/new", user.signInRequired, user.signInAdmin, movie.saveposter, movie.save)
	// admin page

	app.get("/admin/movie", user.signInRequired, user.signInAdmin, movie.new)

	// detial page

	app.get("/admin/update/:id", movie.update)

	// list page

	app.get("/admin/list", user.signInRequired, user.signInAdmin, movie.list)

	app.delete("/admin/list", movie.delete)

	app.post("/user/signup", user.signup)
	app.get("/logout", user.logout)
	app.post("/user/signin", user.signin)
	app.get("/signin", user.showSignIn)
	app.get("/signup", user.showSignUp);

	// comment
	app.post("/user/comment",user.signInRequired, comment.save)

	// category
	app.get("/admin/category/new", user.signInRequired, user.signInAdmin, category.new)
	app.post("/admin/category", user.signInRequired, user.signInAdmin, category.save)
	app.get("/admin/category/list", user.signInRequired, user.signInAdmin, category.list)

	// result
	app.get("/results", index.search)

}
