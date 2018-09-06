'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utils = require('./utils');
require('echarts/extension/bmap/bmap');
var Core = _interopDefault(require('./core'));

var bmap$1 = function bmap$$1(_, __, settings, extra) {
  var key = settings.key,
      v = settings.v,
      bmap$$1 = settings.bmap,
      useOuterMap = settings.useOuterMap;
  var _once = extra._once;

  var registerSign = 'bmap_register';
  if (!key && !useOuterMap) console.warn('settings.key must be a string.');
  if (_once[registerSign]) return {};
  _once[registerSign] = true;
  if (useOuterMap) return { bmap: bmap$$1 };
  return utils.getBmap(key, v).then(function (_) {
    return { bmap: bmap$$1 };
  });
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var index = _extends({}, Core, {
  name: 'VeBmap',
  data: function data() {
    this.chartHandler = bmap$1;
    return {};
  }
});

module.exports = index;
