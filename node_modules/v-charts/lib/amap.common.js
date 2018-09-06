'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utils = require('./utils');
require('echarts-amap');
var Core = _interopDefault(require('./core'));

var amap = function amap(_, __, settings, extra) {
  var key = settings.key,
      v = settings.v,
      amap = settings.amap,
      useOuterMap = settings.useOuterMap;
  var _once = extra._once;

  var registerSign = 'amap_register';
  if (!key && !useOuterMap) console.warn('settings.key must be a string.');
  if (_once[registerSign]) return {};
  _once[registerSign] = true;
  if (useOuterMap) return { amap: amap };
  return utils.getAmap(key, v).then(function (_) {
    return { amap: amap };
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
  name: 'VeAmap',
  data: function data() {
    this.chartHandler = amap;
    return {};
  }
});

module.exports = index;
