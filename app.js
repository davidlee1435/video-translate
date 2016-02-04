"use strict";

var config = require('./config/config');
var express = require('express')
var path = require('path');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? config.appPort.dev : process.env.PORT;

var mongooseURL = isDeveloping ? config.mongoose.dev : config.mongoose.prod

var mongoose = require('mongoose');
mongoose.connect(mongooseURL);

app.set('views', path.join(__dirname, 'public/view'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'jade')

var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'cookiezcookiezcookiez',
    name: 'this_cookie',
    proxy: true,
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./scripts/chat/chat')(io);
require('./scripts/routes')(app, passport);

server.listen(port, function () {
    console.log("*****************************");
    console.log("* Rayos running at port: " + port + " *");
    console.log("*****************************");
});

