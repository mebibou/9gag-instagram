(function() {
  'use strict';

  var redisClient = require('../common/common-db.js'),
      config = require('./posts-config.js'),
      unflatten = require('flat').unflatten;

  function PostsService() {

  }

  PostsService.prototype.search = function(sort, start, callback) {
    redisClient.zrevrange(config.sort[sort], start, start + config.size, function(error, results) {
      if (error) {
        callback(error);
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

          callback(null, posts);
        });
      }
    });
  };

  module.exports = new PostsService();

})();
