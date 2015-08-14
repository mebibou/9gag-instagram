(function() {
  'use strict';

  function Common() {

    window.EventsManager.call(this);

    var _this = this,
        _sort = '',
        _$el = {
          container: $('.container'),
          sort: $('.sort-dropdown')
        };

    this.sort = function(sort) {
      if (typeof sort != 'undefined') {
        _sort = sort;
        _this.fire('sortChanged', {
          sort: sort
        });
      }

      return _sort;
    };

    function _elementSort(hash) {
      return hash.substring(1);
    }

    this.init = function() {
      // get sort from existing hash or from default activated element
      _sort = _elementSort(location.hash) || _elementSort(_$el.sort.find('li.active a').attr('href'));

      window.onhashchange = function() {
        _this.sort(_elementSort(location.hash));
      };
    };

    // Handle Infinite scroll

    var _scrollTop = 0,
        _maxHeight = _$el.container.height(),
        _infineScrollingRequested = false,
        _requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.setTimeout;

    function _refreshScroll() {
      _scrollTop = $(window).scrollTop() + $(window).height();
    }
    function _refreshMaxHeight() {
      _maxHeight = _$el.container.height();
    }
    function _infiniteScroll() {
      if (_infineScrollingRequested) {
        return;
      }

      _infineScrollingRequested = true;
      _requestAnimationFrame(function() {
        _this.fire('infiniteScrollStart');
      });
    }

    _this.on('infiniteScrollEnd', function() {
      _infineScrollingRequested = false;
      _refreshMaxHeight();
    });

    $(window)
      .on('scroll', function() {
        _refreshScroll();
        if (_maxHeight - _scrollTop < 100) {
          _infiniteScroll();
        }
      })
      .on('resize', function() {
        _refreshScroll();
        _refreshMaxHeight();
      });

    _refreshScroll();
    _refreshMaxHeight();
  }

  window.GAG = window.GAG || {};
  window.GAG.Common = new Common();

  window.GAG.Common.init();

})();
