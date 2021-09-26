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

'use strict';

var transition = require('@fapalz/utils/src/utils/transition');

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
    transition.nextFrame(function () {
      _this.element.classList.add('is-enter-active');
    });
  };

  _proto.hide = function hide() {
    var _this2 = this;

    this.isShow = false;
    this.element.classList.remove('is-enter-active');
    transition.whenTransitionEnds(this.element, '', function () {
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

module.exports = NavigationMenu;
