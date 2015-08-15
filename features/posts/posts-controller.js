(function() {
  'use strict';

  var express = require('express'),
      router = express.Router(),
      PostsService = require('./posts-service.js');

  router.get('/', function(req, res) {
    res.render('posts/posts');
  });

  router.get('/fetch', function(req, res) {
    var sort = req.param('sort') || 'date',
        start = parseInt(req.param('start'), 10) || 0,
        length = parseInt(req.param('length'), 10) || 0;

    PostsService.search(sort, start, length, function(error, posts) {
      res.json({
        error: error,
        posts: posts,
      });
    });
  });

  module.exports = router;

})();
