'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var constants = require('./constants');
var utils = require('./utils');
require('echarts/lib/chart/radar');
var Core = _interopDefault(require('./core'));

function getRadarLegend(rows, dimension, legendName) {
  var legendData = rows.map(function (row) {
    return row[dimension];
  });

  return {
    data: legendData,
    formatter: function formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

function getRadarTooltip(dataType, radar$$1, digit) {
  var typeTemp = [];
  var nameTemp = [];
  radar$$1.indicator.map(function (item, index) {
    typeTemp[index] = dataType[item.name];
    nameTemp[index] = item.name;
  });
  return {
    formatter: function formatter(item) {
      var tpl = [];
      tpl.push(constants.itemPoint(item.color));
      tpl.push(item.name + '<br />');
      item.data.value.forEach(function (val, index) {
        tpl.push(nameTemp[index] + ': ');
        tpl.push(utils.getFormated(val, typeTemp[index], digit) + '<br />');
      });
      return tpl.join('');
    }
  };
}

function getRadarSetting(rows, metrics, labelMap) {
  var settingBase = {
    indicator: [],
    shape: 'circle',
    splitNumber: 5
  };
  var indicatorTemp = {};
  rows.forEach(function (items) {
    metrics.forEach(function (item) {
      var key = labelMap[item] != null ? labelMap[item] : item;
      if (!indicatorTemp[key]) {
        indicatorTemp[key] = [items[item]];
      } else {
        indicatorTemp[key].push(items[item]);
      }
    });
  });
  settingBase.indicator = Object.keys(indicatorTemp).map(function (key) {
    return {
      name: key,
      max: Math.max.apply(null, indicatorTemp[key])
    };
  });
  return settingBase;
}

function getRadarSeries(args) {
  var rows = args.rows,
      dimension = args.dimension,
      metrics = args.metrics,
      radar$$1 = args.radar,
      label = args.label,
      itemStyle = args.itemStyle,
      lineStyle = args.lineStyle,
      labelMap = args.labelMap,
      areaStyle = args.areaStyle;

  var radarIndexObj = {};
  radar$$1.indicator.forEach(function (item, index) {
    var name = item.name;
    radarIndexObj[name] = index;
  });

  var seriesData = rows.map(function (row) {
    var serieData = {
      value: [],
      name: row[dimension]
    };
    Object.keys(row).forEach(function (key) {
      if (~metrics.indexOf(key)) {
        var k = labelMap[key] != null ? radarIndexObj[labelMap[key]] : radarIndexObj[key];
        serieData.value[k] = row[key];
      }
    });
    return serieData;
  });
  var result = {
    name: dimension,
    type: 'radar',
    data: seriesData
  };
  if (label) result.label = label;
  if (itemStyle) result.itemStyle = itemStyle;
  if (lineStyle) result.lineStyle = lineStyle;
  if (areaStyle) result.areaStyle = areaStyle;
  return [result];
}

var radar$1 = function radar$$1(columns, rows, settings, extra) {
  var _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? {} : _settings$dataType,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      label = settings.label,
      itemStyle = settings.itemStyle,
      lineStyle = settings.lineStyle,
      areaStyle = settings.areaStyle;
  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible;

  var metrics = columns.slice();
  if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    metrics.splice(columns.indexOf(dimension), 1);
  }
  var legend = legendVisible && getRadarLegend(rows, dimension, legendName);
  var radar$$1 = getRadarSetting(rows, metrics, labelMap);
  var tooltip = tooltipVisible && getRadarTooltip(dataType, radar$$1, digit);
  var series = getRadarSeries({
    rows: rows,
    dimension: dimension,
    metrics: metrics,
    radar: radar$$1,
    label: label,
    itemStyle: itemStyle,
    lineStyle: lineStyle,
    labelMap: labelMap,
    areaStyle: areaStyle
  });
  var options = { legend: legend, tooltip: tooltip, radar: radar$$1, series: series };
  return options;
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
  name: 'VeRadar',
  data: function data() {
    this.chartHandler = radar$1;
    return {};
  }
});

module.exports = index;
