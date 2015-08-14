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

    function _elementSort($element) {
      return $element.attr('href').substring(1);
    }

    this.sort = function(sort) {
      if (typeof sort != 'undefined') {
        _sort = sort;
        _this.fire('sortChanged', {
          sort: sort
        });
      }

      return _sort;
    };

    this.init = function() {
      _this.sort(_elementSort(_$el.sort.find('li.active a')));

      _$el.sort.find('.dropdown a').mousedown(function() {
        _this.sort(_elementSort($(this)));
      });
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
      _scrollTop = $(window).scrollTop();
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

    $(window).scroll(function() {
      _refreshScroll();
      if (_maxHeight - _scrollTop < 100) {
        _infiniteScroll();
      }
    });

    _refreshScroll();
    _refreshMaxHeight();
  }

  window.GAG = window.GAG || {};
  window.GAG.Common = new Common();

  window.GAG.Common.init();

})();
