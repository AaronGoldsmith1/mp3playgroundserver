var express                = require('express');
var path                   = require('path');
var favicon                = require('serve-favicon');
var logger                 = require('morgan');
var cookieParser           = require('cookie-parser');
var bodyParser             = require('body-parser');
var cors                   = require('cors');
var passport               = require('passport');
var userController         = require('./controllers/users')
var authenticateController = require('./controllers/authenticate')

// Load env variables from .env file
require('dotenv').config();

var routes = require('./config/routes');
var mongoose = require('./config/database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Auth middleware
app.use('/api/users', authenticateController.authenticate)
app.use('/api/songs', authenticateController.authenticate)
app.use('/api/playlists', authenticateController.authenticate)

// Routes
app.use('/api/authenticate', routes.authenticate);
app.use('/api/songs/', routes.songs);
app.use('/api/playlists/', routes.playlists);
app.use('/api/users/', routes.users);
app.use('/', routes.other);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

function validateContentType(req, res, next) {
  var methods = ['PUT', 'PATCH', 'POST'];
  if (                                    // If the request is
    methods.indexOf(req.method) !== -1 && // one of PUT, PATCH or POST, and
    Object.keys(req.body).length !== 0 && // has a body that is not empty, and
    !req.is('json')                       // does not have an application/json
  ) {                                     // Content-Type header, then …
    var message = 'Content-Type header must be application/json.';
    res.status(400).json(message);
  } else {
    next();
  }
}

// When there is a 401 Unauthorized, the repsonse shall include a header
// WWW-Authenticate that tells the client how they must authenticate
// their requests.
function addFailedAuthHeader(err, req, res, next) {
  var header = {'WWW-Authenticate': 'Bearer'};
  if (err.status === 401) {
    if (err.realm) header['WWW-Authenticate'] += ` realm="${err.realm}"`;
    res.set(header);
  }
  next(err);
}

module.exports = app;
