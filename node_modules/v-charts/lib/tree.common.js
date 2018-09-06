'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utilsLite = require('utils-lite');
require('echarts/lib/chart/tree');
var Core = _interopDefault(require('./core'));

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

function getTreeLegend(args) {
  var dimension = args.dimension,
      rows = args.rows;

  var result = rows.map(function (row) {
    return row[dimension];
  });
  return { data: result };
}

function getTreeTooltip(args) {
  var tooltipFormatter = args.tooltipFormatter;


  return {
    trigger: 'item',
    triggerOn: 'mousemove',
    formatter: tooltipFormatter
  };
}

function getTreeSeries(args) {
  var dimension = args.dimension,
      metrics = args.metrics,
      rows = args.rows,
      seriesMap = args.seriesMap;


  var series = [];
  rows.forEach(function (row) {
    var label = row[dimension];
    var seriesItem = seriesMap[label];
    var result = {
      type: 'tree',
      name: row[dimension],
      data: row[metrics]
    };
    if (seriesMap[row[dimension]]) {
      Object.keys(seriesItem).forEach(function (key) {
        if (utilsLite.isObject(result[key])) {
          _extends(result[key], seriesItem[key]);
        } else {
          result[key] = seriesItem[key];
        }
      });
    }
    series.push(result);
  });

  return series;
}

var tree$1 = function tree$$1(columns, rows, settings, extra) {
  var _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? columns[1] : _settings$metrics,
      _settings$seriesMap = settings.seriesMap,
      seriesMap = _settings$seriesMap === undefined ? {} : _settings$seriesMap;
  var legendVisible = extra.legendVisible,
      tooltipFormatter = extra.tooltipFormatter,
      tooltipVisible = extra.tooltipVisible;


  var series = getTreeSeries({
    dimension: dimension,
    metrics: metrics,
    rows: rows,
    seriesMap: seriesMap
  });
  var legend = legendVisible && rows.length > 1 && getTreeLegend({
    dimension: dimension,
    rows: rows
  });
  var tooltip = tooltipVisible && getTreeTooltip({
    tooltipFormatter: tooltipFormatter
  });
  return { series: series, legend: legend, tooltip: tooltip };
};

var index = _extends({}, Core, {
  name: 'VeTree',
  data: function data() {
    this.chartHandler = tree$1;
    return {};
  }
});

module.exports = index;
