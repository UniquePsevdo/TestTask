'use strict'
var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    consolidate = require('consolidate');

var db = mongoose.connect('mongodb://testtaskuser:testtaskpass@ds045734.mongolab.com:45734/test_task_db');
var Verse = require('./models/verseModel');

var app = express();

var routes = require('./routes/index');

app.engine('.html', consolidate.swig);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var versesRouter = require('./routes/verseRoutes')(Verse);
app.use('/api/verses/', versesRouter);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

      res.render('error', {
      message: err.message,
      error: {}
    });
});


module.exports = app;
