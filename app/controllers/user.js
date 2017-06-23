
var User  = require('../models/user');

exports.showSignIn = function(req, res) {
	res.render("signin", {
		title: "登录页面"
	})
}
exports.showSignUp = function(req, res) {
	res.render("signup", {
		title: "注册页面"
	})
}
exports.signup = function(req, res) {
	var _user = req.body.user;
	
	User.findOne({name: _user.name}, function(err, user) {
		if (err) {console.log(err)}
		if (user) {
			return res.redirect("/signin")
		}else {
			var user = new User(_user);		
			user.save(function(err, user) {
				if (err) {console.log(err)}
				res.redirect("/")
			})
		}
	})
}
exports.logout =  function(req, res) {
	delete req.session.user;
	// delete app.locals.user;
	res.redirect("/");
}
exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: _user.name}, function(err, user) {
		if (err) {console.log(err)}			
		if (!user) {
			return res.redirect("/signup")
		}
		user.comparePwd(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}
			if (isMatch) {
				req.session.user = user;
				return res.redirect("/")
			}else {
				return res.redirect("/signup")
			}
		})
	})
}

exports.signInRequired = function(req, res, next) {
	var user = req.session.user
	if (!user) {
		return res.redirect("/signin")
	}
	next()
}

exports.signInAdmin = function(req, res, next) {
	var user = req.session.user
	console.log(user.role)
	if (user.role < 10) {
		return res.redirect("/signin")
	}
	next()
}