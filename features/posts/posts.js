(function() {
  'use strict';

  function Posts() {
    var _url = '/posts/fetch',
        _sort = '',
        _start = 0,
        _size = 10,
        _$el = {
          list: $('.posts-list')
        },
        _postTemplate = $('#post').html(),
        _common = window.GAG.Common,
        _virtualized = new window.GAG.VirtualizedList();

    function _addFakePosts() {
      var $posts = [];

      for (var i = 0; i < _size; i++) {
        var $post = $(_postTemplate);
        $posts.push($post);
        _$el.list.append($post);
      }

      return $posts;
    }

    function _fetch(callback) {
      var $posts = _addFakePosts();

      $.ajax({
        type: 'GET',
        url: _url,
        data: {
          start: _start,
          sort: _sort,
          length: _size
        }
      })
        .success(function(data) {
          if (callback) {
            callback(data.posts);
          }

          _addPosts($posts, data.posts);
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
            // restart at 0
          _removePosts();
          _virtualized.reset();
          _fetch();
        })
        .on('infiniteScrollStart', function() {
          _fetch();
        });
    };

    function _setHeader($post, data) {
      var $meta = $post.find('.header'),
          $caption = $meta.find('.caption');

      $caption.find('a')
        .text(data.caption.text)
        .attr('href', data.caption.link + '/#' + data.caption.tag);
    }

    function _setFooter($post, data) {
      var $meta = $post.find('.footer'),
          createdTime = parseInt(data.createdTime, 10) * 1000;

      $meta.find('.likes').find('span').text(data.likeCount);
      $meta.find('.comments').find('span').text(data.commentCount);
      $meta.find('.timestamp')
        .attr('href', data.link)
        .find('span').text(moment(createdTime).fromNow());
    }

    function _setImagePost($post, data) {
      $post.find('.replace-content')
        .css({
          width: data.image.width,
          height: data.image.height
        })
        .html('<img src="' + data.image.url + '" width="' + data.image.width + '" height="' + data.image.height + '" />');
    }

    function _setVideoPost($post, data) {
      $post.find('.replace-content')
        .css({
          width: data.video.width,
          height: data.video.height
        })
        .html('<video controls src="' + data.video.url + '" width="' + data.video.width + '" height="' + data.video.height + '" poster="' + data.image.url + '" />');
    }

    function _removePosts() {
      _$el.list.empty();
    }

    function _addPosts($posts, posts) {
      $.each($posts, function(index, $post) {
        var post = posts[index];
        if (post) {
          _setHeader($post, post);
          _setFooter($post, post);

          if (post.video) {
            _setVideoPost($post, post);
          }
          else {
            _setImagePost($post, post);
          }

          // post is set, display real information
          $post.removeClass('loading');
        }
        // no data for this post, remove it
        else {
          $post.remove();
        }
      });

      _virtualized.elements($posts);

      _start += posts.length;

      _common.fire('infiniteScrollEnd');
    }
  }

  new Posts().init();

})();
