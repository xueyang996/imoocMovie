var express = require('express');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty')();
var mongoose = require('mongoose');
var session = require('express-session');
var mongoStore = require("connect-mongo")(session)
var logger = require('morgan');
var app = express()
var path = require('path');
app.set("views", './app/view/pages');
app.set("view engine","jade");
var dburl = "mongodb://localhost/imooc";
mongoose.connect(dburl);
app.use(bodyParser.urlencoded({extended:true}));
app.use(multipart);
// app.use(express.cookieParse());
app.use(session({
	secret: 'imooc',
	resave:false,//
    saveUninitialized:true,
	store: new mongoStore({
		url : dburl,
		collection: "session"
	})
}))


app.use(express.static(path.join(__dirname, "public")));
app.locals.moment = require("moment");
app.listen(port);

console.log(app.get('env'))
if ("development" === app.get('env')) {

	app.set("showStackError", true)
	app.use(logger(":method :url :status"))
	app.locals.pretty = true;
	mongoose.set('debug', true)
}
require('./config/routes')(app);
console.log("is lisenting"+ port);
// index page
