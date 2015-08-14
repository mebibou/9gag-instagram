(function() {
  'use strict';

  var express = require('express'),
      redisClient = require('../common/common-db.js'),
      router = express.Router(),
      config = require('./posts-config.js'),
      unflatten = require('flat').unflatten;

  router.get('/', function(req, res) {
    res.render('posts/posts');
  });

  router.get('/fetch', function(req, res) {
    var sort = req.param('sort') || 'date',
        start = parseInt(req.param('start'), 10) || 0;

    redisClient.zrevrange(config.sort[sort], start, start + config.size, function(error, results) {
      if (error) {
        console.error(error);
        res.send({
          error: error,
          posts: []
        });
      }
      else {
        var multi = redisClient.multi();
        for (var i = 0; i < results.length; i++) {
          multi.hgetall(results[i]);
        }
        multi.exec(function(err, posts) {
          posts = posts.map(function(post) {
            return unflatten(post);
          });

          res.json({
            error: null,
            posts: posts
          });
        });
      }
    });
  });

  module.exports = router;

})();
