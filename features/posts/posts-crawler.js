(function() {
  'use strict';

  var https = require('https'),
      redisClient = require('../common/common-db.js'),
      flatten = require('flat'),
      config = require('./posts-config.js'),
      POSTS_NUMBER = 200;

  function Crawler() {

    // instagram url
    var endpoint = 'https://api.instagram.com/v1/users/259220806/media/recent/?client_id=f8cb5a0be45b49ed9c3037f001c55826',
        results = [];

    function _fetch(url) {
      https.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
          body += chunk;
        });

        res.on('end', function() {
          _parseResult(body);
        });
      })
        .on('error', function(error) {
          console.error(error);
        });
    }

    function _parseResult(data) {
      var result = JSON.parse(data),
          nextUrl = result.pagination.next_url;

      result.data.forEach(function(element) {
        var el = {
          commentCount: element.comments.count,
          likeCount: element.likes.count,
          createdTime: element.created_time,
          link: element.link,
          user: element.user.username, // element.id?
          image: element.images.standard_resolution,
          caption: {
            text: element.caption.text,
            user: element.caption.from.id
          }
        };

        if (element.type == 'video') {
          el.video = element.videos.standard_resolution;
        }

        results.push(el);
      });

      console.log('fetched ' + results.length + ' / ' + POSTS_NUMBER);

      if (results.length >= POSTS_NUMBER) {
        _done();
      }
      else {
        _fetch(nextUrl);
      }
    }

    function _done() {
      var multi = redisClient.multi();

      for (var i = 0; i < results.length; i++) {
        var result = results[i],
            key = 'post-' + i;

        // for querying
        multi.zadd([config.sort.like, result.likeCount, key]);
        multi.zadd([config.sort.comment, result.commentCount, key]);
        multi.zadd([config.sort.date, result.createdTime, key]);

        multi.hmset(key, flatten(results[i]));
      }

      multi.exec(function(err) {
        if (err) {
          throw err;
        }
        else {
          redisClient.quit();
        }
      });

    }

    // first call
    _fetch(endpoint);
  }

  module.exports = new Crawler();

})();
