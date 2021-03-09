'use strict';

/**
 * Module dependencies.
 */
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var boolParser = require('express-query-boolean');
var compress = require('compression');
var methodOverride = require('method-override');
var config = require('./config');
var path = require('path');
var cors = require('cors');
var qs = require('qs');
var packageJson = require('../package.json');

module.exports = function(db) {
  // Initialize express app
  var app = express();

  // default query parser has a limit for arrays 20 or less.
  app.set('query parser', str =>
    qs.parse(str, { arrayLimit: 1000, depth: 10 })
  );

  // Globbing model files
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });

  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  // Remove 'X-FRAME-OPTIONS' header
  app.use(function(req, res, next) {
    res.removeHeader('X-Frame-Options');
    next();
  });

  // Should be placed before express.static
  app.use(
    compress({
      filter: function(req, res) {
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
      },
      level: 9
    })
  );

  // Showing stack errors
  app.set('showStackError', true);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './app/views');

  // Enable logger (morgan)
  morgan.token('x-forwarded-for', function (req, res) { return req.headers['x-forwarded-for']; });
  morgan.token('route', function(req, res) { return req.route ? req.route.path : '-'; });
  app.use(morgan(':remote-addr - :x-forwarded-for - :remote-user [:date[clf]] \':method :url HTTP/:http-version\' :status :res[content-length] \':referrer\' \':user-agent\' :response-time ms \':route\''));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
  app.use(boolParser());
  app.use(methodOverride());

  // Enable jsonp
  app.enable('jsonp callback');

  app.use(cors());

  // Setting the app router and static folder
  app.use(express.static(path.resolve('./public')));

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  app.use(require('./../app/middlewares/error')());

  // Assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).send({
      message: 'Route Not Found'
    });
  });

  return app;
};
