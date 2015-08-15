(function() {
  'use strict';

  var isMobile = false;
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true

  function VirtualizedList() {

    // Mobile devices handle the setInterval / scroll event very badly as they only get triggered after a while,
    // therefore we cannot use a virtualized list to free up memory.
    // we could try to use other UI elements to handle the list faster, like draggable elements.
    var _enabled = !isMobile;

    var VisibleElement = function(position) {

      var _this = this,
          _visible = true,
          _$element = null,
          _top = 0,
          _height = 0,
          _index = 0;

      this.hide = function() {
        _visible = false;
        _hideElement(_$element);
      };

      this.show = function() {
        _visible = true;
        _showElement(_$element);
      };

      this.element = function($element, top, height, index) {
        _$element = $element;
        _top = top || $element.offset().top;
        _height = height || $element.outerHeight();
        _index = index || $element.index();
      };

      function _previousElement() {
        if (_index <= 0) {
          return false;
        }

        _$element = _$element.prev();
        _height = _$element.outerHeight();
        _top -= _height;
        _index -= 1;
        return true;
      }

      function _nextElement() {
        if (_index >= (_size - 1)) {
          return;
        }

        _$element = _$element.next();
        _top += _height;
        _height = _$element.outerHeight();
        _index += 1;
        return true;
      }

      this.scroll = function(scrollTop) {
        var scrollBottom = scrollTop + _viewport.height,
            bottom = _top + _height;

        if (position == 'top') {
          if (_visible) {

            // element goes above viewport
            if (bottom < (scrollTop - MIN_DISTANCE)) {
              _this.hide();
              if (_nextElement()) {
                _this.show();
              }
            }
            else if (_top > (scrollTop - MIN_DISTANCE)) {
              if (_previousElement()) {
                _this.show();
              }
            }

          }
          else {

            if (bottom > (scrollTop - MIN_DISTANCE)) {
              _this.show();
            }

          }
        }

        if (position == 'bottom') {
          if (_visible) {

            // element goes below viewport
            if (_top > (scrollBottom + MIN_DISTANCE)) {
              _this.hide();
              if (_previousElement()) {
                _this.show();
              }
            }
            else if (bottom < (scrollBottom + MIN_DISTANCE)) {
              if (_nextElement()) {
                _this.show();
              }
            }

          }
          else {

            if (_top < (scrollBottom + MIN_DISTANCE)) {
              _this.show();
            }

          }
        }

      };

    };

    var _this = this,
        _viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        },
        _topVisibleElement = null,
        _bottomVisibleElement = null,
        _scrollTop = -1,
        _scrollInterval = null,
        _size = 0,
        MIN_DISTANCE = 50;

    function _hideElement($element) {
      $element.css('visibility', 'hidden');
    }
    function _showElement($element) {
      $element.css('visibility', 'visible');
    }

    function _refreshScroll() {
      var scrollTop = $(window).scrollTop();
      if (scrollTop != _scrollTop) {
        _scrollTop = scrollTop;
        _topVisibleElement.scroll(_scrollTop);
        _bottomVisibleElement.scroll(_scrollTop);
      }
    }

    this.reset = function() {
      if (!_enabled) {
        return;
      }

      _size = 0;
      _topVisibleElement = new VisibleElement('top');
      _bottomVisibleElement = new VisibleElement('bottom');
    };

    this.elements = function($elements) {
      if (!_enabled) {
        return;
      }

      // first loading
      if (_size === 0) {
        _size = $elements.length;

        // find the first non-visible element to be the bottom one,
        // and hide the others
        var top = 0,
            bottom = 0,
            topElement = false,
            bottomElement = false,
            scrollTop = $(window).scrollTop();

        for (var i in $elements) {
          var $element = $($elements[i]),
              outerHeight = $element.outerHeight();

          top = bottom;
          bottom = top + outerHeight;

          if (bottom > (scrollTop + MIN_DISTANCE) && !topElement) {
            _topVisibleElement.element($element, top, outerHeight);
            topElement = true;
          }
          else if (top > (scrollTop + _viewport.height - MIN_DISTANCE) && !bottomElement) {
            _bottomVisibleElement.element($element, top, outerHeight);
            bottomElement = true;
          }
          // element is between top and bottom
          else if (topElement && !bottomElement) {
            _showElement($element);
          }
          else {
            _hideElement($element);
          }
        }

        if (_scrollInterval) {
          clearInterval(_scrollInterval);
        }
        _scrollInterval = setInterval(function() {
          _refreshScroll();
        });
      }
      else {
        _size += $elements.length;
        for (var i in $elements) {
          _hideElement($($elements[i]));
        }
      }
    };

    this.reset();
  }

  window.GAG = window.GAG || {};
  window.GAG.VirtualizedList = VirtualizedList;

})();
