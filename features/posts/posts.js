(function() {
  'use strict';

  function Posts() {
    var _url = '/posts/fetch',
        _sort = '',
        _start = 0,
        _$el = {
          list: $('.posts-list'),
          imageTemplate: $('#post-image').html(),
          videoTemplate: $('#post-video').html()
        },
        _common = window.GAG.Common;

    function _fetch(callback) {
      console.log('_fetch', {
        start: _start,
        sort: _sort
      });

      $.ajax({
        type: 'GET',
        url: _url,
        data: {
          start: _start,
          sort: _sort
        }
      })
        .success(function(data) {
          if (callback) {
            callback(data.posts);
          }

          _addPosts(data.posts);
        })
        .error(function() {
          console.error(arguments);
        });
    }

    this.init = function() {
      // initial fetch with initial sort
      _sort = _common.sort();
      _fetch();

      _common
        .on('sortChanged', function(args) {
          _sort = args.sort;
          _start = 0;
          _fetch(function() {
            // restart at 0
            _removePosts();
          });
        })
        .on('infiniteScrollStart', function() {
          _fetch();
        });
    };

    function _addImagePost(post) {
      var $post = $(_$el.imageTemplate);

      $post.find('img').attr('src', post.image.url);

      _$el.list.append($post);
    }

    function _addVideoPost(post) {
      var $post = $(_$el.videoTemplate);

      $post.find('video').attr('src', post.video.url);

      _$el.list.append($post);
    }

    function _removePosts() {
      _$el.list.empty();
    }

    function _addPosts(posts) {
      $.each(posts, function(index, post) {
        if (post.video) {
          _addVideoPost(post);
        }
        else {
          _addImagePost(post);
        }
      });

      _start += posts.length;

      _common.fire('infiniteScrollEnd');
    }
  }

  new Posts().init();

})();
