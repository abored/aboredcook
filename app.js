var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var passport = require('passport');

//load models
require('./models/Recipes');
require('./models/Comments');
require('./models/Users');

//load vores passport strats (local, facebook og google)
require('./config/passport');

//forbind til mongoDB
mongoose.connect('mongodb://admin:admin@ds147497.mlab.com:47497/cookbook');

//load alle routes
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Sæt favicon
app.use(favicon(path.join(__dirname, 'public', 'fav.ico')));

//log http requests til access.log OG console
var logStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(logger('combined', {stream: logStream}));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

//serve alle static filer (css, javascript, images etc.) i public folderen
app.use(express.static(path.join(__dirname, 'public')));

//initialize authentication with passport
app.use(passport.initialize());

//inject routes ind i express-app
app.use('/', index);

// catch 404 og forward til error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = app.listen(3000, function () {
   var port = server.address().port
   console.log("Server listening at http://localhost:" + port)
})
