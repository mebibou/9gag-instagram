(function() {
  'use strict';

  var express = require('express'),
      partials = require('express-partials'),
      app = express(),
      path = require('path'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compression = require('compression');

  app.use(partials());
  app.use(compression({
    threshold: 64
  }));

  // view engine setup
  app.set('views', path.join(__dirname, 'features'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/features', express.static(path.join(__dirname, 'features')));
  app.use('/vendor', express.static(path.join(__dirname, 'vendor')));

  require('./features/common/common-db.js');

  app.use('/', require('./features/common/common-controller.js'));
  app.use('/posts', require('./features/posts/posts-controller.js'));

  process.on('uncaughtException', function(err) {
    console.error('WARNING: UNCAUGHT EXCEPTION');
    console.error('Inside \'uncaughtException\' event');
    console.error(err.message);
    console.error(err.stack);
  });

  app.set('port', process.env.PORT || 5000);

  var server = app.server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });

  module.exports = app;

})();
