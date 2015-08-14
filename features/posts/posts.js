(function() {
  'use strict';

  function Posts() {
    var _url = '/posts/fetch',
        _sort = '',
        _start = 0,
        _$el = {
          list: $('.posts-list'),
          imageTemplate: $('#post-image').html(),
          videoTemplate: $('#post-video').html(),
          headerTemplate: $('#post-header').html(),
          footerTemplate: $('#post-footer').html()
        },
        _common = window.GAG.Common;

    function _fetch(callback) {
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

    function _getHeader(post) {
      var $meta = $(_$el.headerTemplate),
          $caption = $meta.find('.caption');

      $caption.find('a')
        .text(post.caption.text)
        .attr('href', post.caption.link + '/#' + post.caption.tag);

      return $meta;
    }

    function _getFooter(post) {
      var $meta = $(_$el.footerTemplate),
          createdTime = parseInt(post.createdTime, 10) * 1000;

      $meta.find('.likes').find('span').text(post.likeCount);
      $meta.find('.comments').find('span').text(post.commentCount);
      $meta.find('.timestamp')
        .attr('href', post.link)
        .find('span').text(moment(createdTime).fromNow());

      return $meta;
    }

    function _addImagePost(post) {
      var $post = $(_$el.imageTemplate);

      $post.find('img')
        .attr('src', post.image.url)
        .attr('width', post.image.width)
        .attr('height', post.image.height);

      $post.prepend(_getHeader(post)).append(_getFooter(post));
      _$el.list.append($post);
    }

    function _addVideoPost(post) {
      var $post = $(_$el.videoTemplate);

      $post.find('video')
        .attr('src', post.video.url)
        .attr('width', post.video.width)
        .attr('height', post.video.height)
        .attr('poster', post.image.url);

      $post.prepend(_getHeader(post)).append(_getFooter(post));
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
