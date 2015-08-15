(function() {
  'use strict';

  var redisClient = require('../common/common-db.js'),
      config = require('./posts-config.js'),
      unflatten = require('flat').unflatten;

  function PostsService() {

  }

  PostsService.prototype.search = function(sort, start, length, callback) {
    var end = start + (length > 0 ? length - 1 : config.size);
    redisClient.zrevrange(config.sort[sort], start, end, function(error, results) {
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
