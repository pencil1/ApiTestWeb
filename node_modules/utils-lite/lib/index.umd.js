(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.UtilsLite = {})));
}(this, (function (exports) { 'use strict';

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var self = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(self, args);
      }, delay);
    };
  }

  function throttle(fn, wait, delay) {
    var timer = null;
    var previous = null;

    return function () {
      var self = this;
      var args = arguments;
      var now = Date.now();
      if (!previous) previous = now;
      if (now - previous > wait) {
        fn.apply(self, args);
        previous = now;
      } else if (delay) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(self, args);
        }, delay);
      }
    };
  }

  function set(target, path, value) {
    if (!path) return;
    var targetTemp = target;
    var pathArr = path.split('.');
    pathArr.forEach(function (item, index) {
      if (index === pathArr.length - 1) {
        targetTemp[item] = value;
      } else {
        if (!targetTemp[item]) targetTemp[item] = {};
        targetTemp = targetTemp[item];
      }
    });
  }

  function get(target, path, defaultValue) {
    if (!path) return target;
    var pathArr = path.split('.');
    var targetTemp = target;
    pathArr.some(function (item, index) {
      if (targetTemp[item] === undefined) {
        targetTemp = defaultValue;
        return true;
      } else {
        targetTemp = targetTemp[item];
      }
    });
    return targetTemp;
  }

  function getStore(name) {
    try {
      return JSON.parse(window.localStorage.getItem(name));
    } catch (e) {}
  }

  function setStore(name, data) {
    try {
      window.localStorage.setItem(name, JSON.stringify(data));
    } catch (e) {}
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function getType(v) {
    return Object.prototype.toString.call(v);
  }

  function getTypeof(v) {
    return typeof v === 'undefined' ? 'undefined' : _typeof(v);
  }

  function isObject(v) {
    return getType(v) === '[object Object]';
  }

  function isArray(v) {
    return getType(v) === '[object Array]';
  }

  function isFunction(v) {
    return getType(v) === '[object Function]';
  }

  function isString(v) {
    return getType(v) === '[object String]';
  }

  function isBoolean(v) {
    return getType(v) === '[object Boolean]';
  }

  function isEmptyObj(v) {
    return isObject(v) && !Object.keys(v).length;
  }

  function isNumber(v) {
    return getType(v) === '[object Number]';
  }

  function clone(v) {
    if (isObject(v)) return Object.assign({}, v);
    if (isArray(v)) return v.slice();
  }

  function cloneDeep(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function kebabToCamel(s) {
    return s.replace(/-(\w)/g, function (_, c) {
      return c.toUpperCase();
    });
  }

  function camelToKebab(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function unique(arr) {
    var result = [];
    arr.forEach(function (item) {
      if (!~result.indexOf(item)) result.push(item);
    });
    return result;
  }

  function getLinearValue(x1, y1, x2, y2, x3) {
    var k = (y2 - y1) / (x2 - x1);
    var b = y1 - x1 * k;
    if (x3 == null) {
      return { k: k, b: b };
    } else {
      return x3 * k + b;
    }
  }

  function getFnAndObjValue(target, key) {
    return isFunction(target) ? target(key) : !isObject(target) ? key : target[key] != null ? target[key] : key;
  }

  function arrDelItem(arr, diffItem) {
    return arr.filter(function (item) {
      return diffItem !== item;
    });
  }

  var arrDelArrItem = function arrDelArrItem(arr, diffArr) {
    return arr.filter(function (item) {
      return !~diffArr.indexOf(item);
    });
  };

  function getArrMin(arr) {
    return Math.min.apply(null, arr);
  }

  function getArrMax(arr) {
    return Math.max.apply(null, arr);
  }

  function toArray(v) {
    return Array.prototype.slice.call(v);
  }

  function noop() {}

  function hasOwn(source, target) {
    return Object.prototype.hasOwnProperty.call(source, target);
  }

  var extend = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (hasOwn(source, key)) target[key] = source[key];
      }
    }
    return target;
  };

  function isEqual(alice, bob) {
    if (alice === bob) return true;
    if (alice === null || bob === null || getTypeof(alice) !== 'object' || getTypeof(bob) !== 'object') {
      return alice === bob;
    }

    for (var key in alice) {
      if (!hasOwn(alice, key)) continue;
      var aliceValue = alice[key];
      var bobValue = bob[key];
      var aliceType = getTypeof(aliceValue);

      if (getTypeof(bobValue) === 'undefined') {
        return false;
      } else if (aliceType === 'object') {
        if (!isEqual(aliceValue, bobValue)) return false;
      } else if (aliceValue !== bobValue) {
        return false;
      }
    }
    for (var _key in bob) {
      if (!hasOwn(bob, _key)) continue;
      if (getTypeof(alice)[_key] === 'undefined') return false;
    }

    return true;
  }

  exports.debounce = debounce;
  exports.throttle = throttle;
  exports.set = set;
  exports.get = get;
  exports.getStore = getStore;
  exports.setStore = setStore;
  exports.clone = clone;
  exports.cloneDeep = cloneDeep;
  exports.getType = getType;
  exports.getTypeof = getTypeof;
  exports.isObject = isObject;
  exports.isArray = isArray;
  exports.isFunction = isFunction;
  exports.isString = isString;
  exports.isBoolean = isBoolean;
  exports.isEmptyObj = isEmptyObj;
  exports.isNumber = isNumber;
  exports.kebabToCamel = kebabToCamel;
  exports.camelToKebab = camelToKebab;
  exports.unique = unique;
  exports.getLinearValue = getLinearValue;
  exports.getFnAndObjValue = getFnAndObjValue;
  exports.arrDelItem = arrDelItem;
  exports.arrDelArrItem = arrDelArrItem;
  exports.getArrMin = getArrMin;
  exports.getArrMax = getArrMax;
  exports.toArray = toArray;
  exports.noop = noop;
  exports.extend = extend;
  exports.isEqual = isEqual;
  exports.hasOwn = hasOwn;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
