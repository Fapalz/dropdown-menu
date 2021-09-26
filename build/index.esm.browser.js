/**
 * DropdownMenu  1.0.0
 * GitHub template for starting new projects
 * https://github.com/Fapalz/dropdown-menu#readme
 *
 * Copyright 2020-2021 Gladikov Kirill - Fapalz <blacesmot@gmail.com>
 *
 * Released under the MIT License
 *
 * Released on: September 26, 2021
 */

var MenuItem = /*#__PURE__*/function () {
  function MenuItem(item, options) {
    if (options === void 0) {
      options = {};
    }

    this.element = item;
    this.timeoutOver = null;
    this.timeoutOut = null;
    this.options = MenuItem.mergeSettings(options);
  }

  MenuItem.mergeSettings = function mergeSettings(options) {
    var settings = {
      out: function out() {},
      over: function over() {},
      delayOver: 100,
      delayOut: 250
    };
    return Object.assign(settings, options);
  };

  var _proto = MenuItem.prototype;

  _proto.itemOver = function itemOver() {
    var _this = this;

    if (this.timeoutOver) {
      clearTimeout(this.timeoutOver);
    }

    this.opening = true;
    this.timeoutOver = setTimeout(function () {
      if (_this.opening) {
        _this.options.over(_this.element);
      }
    }, this.options.delayOver);
  };

  _proto.itemOut = function itemOut() {
    var _this2 = this;

    if (this.timeoutOut) {
      clearTimeout(this.timeoutOut);
    }

    this.opening = false;
    this.timeoutOut = setTimeout(function () {
      if (!_this2.opening) {
        _this2.options.out(_this2.element);
      }
    }, this.options.delayOut);
  };

  return MenuItem;
}();

var inBrowser = typeof window !== 'undefined';
var inWeex = // eslint-disable-next-line no-undef
typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform; // eslint-disable-next-line no-undef

var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
UA && /chrome\/\d+/.test(UA) && !isEdge;
UA && /phantomjs/.test(UA);
UA && UA.match(/firefox\/(\d+)/);

/* eslint-disable import/no-mutable-exports */
var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation'; // Transition property/event sniffing

var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';

if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }

  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
} // binding to window is necessary to make hot reload work in IE in strict mode


var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : function (fn) {
  return fn();
}; // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors

function toMs(s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}

function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    // eslint-disable-next-line no-param-reassign
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
}

var transformRE = /\b(transform|all)(,|$)/;
function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  var transitionDelays = (styles[transitionProp + "Delay"] || '').split(', ');
  var transitionDurations = (styles[transitionProp + "Duration"] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + "Delay"] || '').split(', ');
  var animationDurations = (styles[animationProp + "Duration"] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);
  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }

  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + "Property"]);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}
function whenTransitionEnds(el, expectedType, cb) {
  var _getTransitionInfo = getTransitionInfo(el, expectedType),
      type = _getTransitionInfo.type,
      timeout = _getTransitionInfo.timeout,
      propCount = _getTransitionInfo.propCount;

  if (!type) return cb();
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;

  var end = function end() {
    // eslint-disable-next-line no-use-before-define
    el.removeEventListener(event, onEnd);
    cb();
  };

  var onEnd = function onEnd(e) {
    if (e.target === el) {
      ended += 1;

      if (ended >= propCount) {
        end();
      }
    }
  };

  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
  return el;
}
function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

var DropdownMenu = /*#__PURE__*/function () {
  function DropdownMenu(element) {
    this.element = element;
    this.isShow = false;
  }

  var _proto = DropdownMenu.prototype;

  _proto.show = function show() {
    var _this = this;

    this.isShow = true;
    this.element.classList.add('is-enter');
    nextFrame(function () {
      _this.element.classList.add('is-enter-active');
    });
  };

  _proto.hide = function hide() {
    var _this2 = this;

    this.isShow = false;
    this.element.classList.remove('is-enter-active');
    whenTransitionEnds(this.element, '', function () {
      if (_this2.isShow) return;

      _this2.element.classList.remove('is-enter');
    });
  };

  return DropdownMenu;
}();

/* eslint-disable no-plusplus */

var NavigationMenu = function NavigationMenu(options) {
  var DEFAULTS = {
    dropDown: '.dropdown',
    dropDownMenu: '.dropdown-menu',
    container: '.dropdown-container',
    toRightClass: 'toright',
    delayOver: 100,
    delayOut: 250
  };
  var settings = Object.assign(DEFAULTS, options);
  var state = {
    items: {},
    dropdowns: {},
    idCnt: 1,
    currentItem: null,
    overItem: null,
    outItem: null
  };

  function getDropdown(dropdown) {
    if (!dropdown) return null;
    var id = !dropdown.dataset.dropdownMenuIndex ? dropdown.dataset.dropdownMenuIndex = state.idCnt++ : dropdown.dataset.dropdownMenuIndex;
    if (!state.dropdowns[id]) state.dropdowns[id] = new DropdownMenu(dropdown);
    return state.dropdowns[id];
  }

  function findDropdow(item) {
    return item.querySelector(settings.dropDownMenu);
  }

  function cleardropdownStyle(el) {
    el.style.left = null;
    el.style.right = null;
    el.classList.remove(settings.toRightClass);
  }

  function setPopupAlign(dropdown) {
    if (!dropdown) return;
    var container = document.querySelector(settings.container);
    cleardropdownStyle(dropdown);
    var isHasParentdropdownMenu = !!dropdown.parentElement.closest(settings.dropDownMenu);
    var isToRight = !!dropdown.parentElement.closest(settings.dropDownMenu + "." + settings.toRightClass);
    var dropdownRightEdge = dropdown.getBoundingClientRect().left + dropdown.offsetWidth;
    var containerRightEdge = container.getBoundingClientRect().left + container.offsetWidth;

    if (dropdownRightEdge > containerRightEdge || isToRight) {
      var addleft = containerRightEdge - dropdownRightEdge;

      if (isHasParentdropdownMenu || isToRight) {
        dropdown.style.left = 'auto';
        dropdown.style.right = '100%';
        dropdown.classList.add(settings.toRightClass);
      } else {
        var style = getComputedStyle(dropdown);
        var currentLeft = parseInt(style.left, 10);
        dropdown.style.left = currentLeft + addleft + "px";
      }
    }
  }

  function dropdownShow(item) {
    var dropdown = findDropdow(item);
    var dropdownInstance = getDropdown(dropdown);

    if (!dropdownInstance) {
      return;
    }

    dropdownInstance.show();
    setPopupAlign(dropdown);
  }

  function dropdownHide(item) {
    var dropdown = findDropdow(item);
    var dropdownInstance = getDropdown(dropdown);

    if (!dropdownInstance) {
      return;
    }

    dropdownInstance.hide();
  }

  function getItem(item) {
    if (!item) return null;
    var id = !item.dataset.dropdownItemIndex ? item.dataset.dropdownItemIndex = state.idCnt++ : item.dataset.dropdownItemIndex;
    if (!state.items[id]) state.items[id] = new MenuItem(item, {
      over: function over() {
        dropdownShow(item);
      },
      out: function out() {
        dropdownHide(item);
      },
      delayOver: settings.delayOver,
      delayOut: settings.delayOut
    });
    return state.items[id];
  }

  function itemOver(item) {
    var menuItem = getItem(item);
    if (!menuItem) return;
    state.overItem = menuItem;
    menuItem.itemOver();
  }

  function itemOut(item) {
    var menuItem = getItem(item);
    if (!menuItem) return;
    state.outItem = menuItem;
    menuItem.itemOut();
  }

  var items = Array.prototype.slice.call(document.querySelectorAll(settings.dropDown));
  items.forEach(function (element) {
    element.addEventListener('mouseenter', function () {
      itemOver(this);
    });
    element.addEventListener('mouseleave', function () {
      itemOut(this);
    });
  });
};

export default NavigationMenu;
