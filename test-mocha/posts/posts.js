(function() {
  'use strict';

  process.env.PORT = 5001;

  var expect = require('chai').expect,
      request = require('supertest'),
      app = require('../../app.js');

  describe('Posts Tests', function() {

    before(function() {
      expect(app).not.to.be.null;
    });

    function _get(sort, start, callback) {
      request(app.server)
        .get('/posts/fetch?sort=' + (sort || 'date') + '&start=' + (start || '0'))
        .end(function(err, res) {
          expect(res.body.error).to.be.null;

          callback(res.body.posts);
        });
    }

    function _date(post) {
      return parseInt(post.createdTime, 10);
    }

    function _likes(post) {
      return parseInt(post.likeCount, 10);
    }

    function _comments(post) {
      return parseInt(post.commentCount, 10);
    }

    it('should sort posts by date', function(done) {
      _get('date', null, function(posts) {
        for (var i = 0; i < posts.length - 1; i++) {
          expect(_date(posts[i + 1]) > _date(posts[i])).to.be.true;
        }

        done();
      });
    });

    it('should sort posts by likes', function(done) {
      _get('likes', null, function(posts) {
        for (var i = 0; i < posts.length - 1; i++) {
          expect(_likes(posts[i + 1]) > _likes(posts[i])).to.be.true;
        }

        done();
      });
    });

    it('should sort posts by comments', function(done) {
      _get('comments', null, function(posts) {
        for (var i = 0; i < posts.length - 1; i++) {
          expect(_comments(posts[i + 1]) > _comments(posts[i])).to.be.true;
        }

        done();
      });
    });

    it('should paginate results', function(done) {
      _get(null, 0, function(posts) {
        expect(posts.length).to.equal(10);

        var firstPosts = posts;

        _get(null, 10, function(posts) {
          expect(posts.length).to.equal(10);

          // no post should be the same as before
          posts.forEach(function(post) {
            firstPosts.forEach(function(firstPost) {
              expect(firstPost).not.to.be.equals(post);
            });
          });

          done();
        });
      });
    });

  });
})();
