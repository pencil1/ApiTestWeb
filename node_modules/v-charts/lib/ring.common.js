'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var constants = require('./constants');
var utils = require('./utils');
var utilsLite = require('utils-lite');
require('echarts/lib/chart/pie');
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

var pieRadius = 100;
var ringRadius = [80, 100];
var roseRingRadius = [20, 100];
var pieOffsetY = 200;

function getPieSeries(args) {
  var innerRows = args.innerRows,
      dataType = args.dataType,
      percentShow = args.percentShow,
      dimension = args.dimension,
      metrics = args.metrics,
      radius = args.radius,
      offsetY = args.offsetY,
      selectedMode = args.selectedMode,
      hoverAnimation = args.hoverAnimation,
      digit = args.digit,
      roseType = args.roseType,
      label = args.label,
      level = args.level,
      limitShowNum = args.limitShowNum,
      isRing = args.isRing,
      labelLine = args.labelLine,
      itemStyle = args.itemStyle;


  var series = [];
  var levelTemp = {};
  var rowsTemp = [];
  if (level) {
    level.forEach(function (levelItems, index) {
      levelItems.forEach(function (item) {
        levelTemp[item] = index;
      });
    });
    innerRows.forEach(function (row) {
      var itemLevel = levelTemp[row[dimension]];
      if (itemLevel !== undefined) {
        if (rowsTemp[itemLevel]) {
          rowsTemp[itemLevel].push(row);
        } else {
          rowsTemp[itemLevel] = [row];
        }
      }
    });
  } else {
    rowsTemp.push(innerRows);
  }
  var seriesBase = {
    type: 'pie',
    selectedMode: selectedMode,
    hoverAnimation: hoverAnimation,
    roseType: roseType,
    center: ['50%', offsetY]
  };
  var rowsTempLength = rowsTemp.length;
  rowsTemp.forEach(function (dataRows, index) {
    var seriesItem = _extends({ data: [] }, seriesBase);
    var centerWidth = radius / rowsTempLength;
    if (!index) {
      seriesItem.radius = isRing ? radius : centerWidth;
    } else {
      var outerWidth = centerWidth + radius / (2 * rowsTempLength) * (2 * index - 1);
      var innerWidth = outerWidth + radius / (2 * rowsTempLength);
      seriesItem.radius = [outerWidth, innerWidth];
    }
    if (rowsTempLength > 1 && index === 0) {
      seriesItem.label = {
        normal: { position: 'inner' }
      };
    }
    if (label) seriesItem.label = label;
    if (labelLine) seriesItem.labelLine = labelLine;
    if (itemStyle) seriesItem.itemStyle = itemStyle;
    if (percentShow) {
      seriesItem.label = {
        normal: {
          show: true,
          position: rowsTempLength > 1 && index === 0 ? 'inner' : 'outside',
          formatter: function formatter(item) {
            var tpl = [];
            tpl.push(item.name + ':');
            tpl.push(utils.getFormated(item.value, dataType, digit));
            tpl.push('(' + item.percent + '%)');
            return tpl.join(' ');
          }
        }
      };
    }
    seriesItem.data = dataRows.map(function (row) {
      return {
        name: row[dimension],
        value: row[metrics]
      };
    });
    series.push(seriesItem);
  });
  if (limitShowNum && limitShowNum < series[0].data.length) {
    var firstData = series[0].data;
    var remainArr = firstData.slice(limitShowNum, firstData.length);
    var sum = 0;
    remainArr.forEach(function (item) {
      sum += item.value;
    });
    series[0].data = firstData.slice(0, limitShowNum);
    series[0].data.push({ name: '其他', value: sum });
  }
  return series;
}

function getPieLegend(args) {
  var innerRows = args.innerRows,
      dimension = args.dimension,
      legendLimit = args.legendLimit,
      legendName = args.legendName,
      level = args.level,
      limitShowNum = args.limitShowNum;

  var legend = [];
  var levelTemp = [];
  if (level) {
    level.forEach(function (levelItem) {
      levelItem.forEach(function (item) {
        levelTemp.push(item);
      });
    });
    legend = levelTemp;
  } else if (limitShowNum && limitShowNum < innerRows.length) {
    for (var i = 0; i < limitShowNum; i++) {
      legend.push(innerRows[i][dimension]);
    }
    legend.push('其他');
  } else {
    legend = innerRows.map(function (row) {
      return row[dimension];
    });
  }
  if (legend.length) {
    return {
      data: legend,
      show: legend.length < legendLimit,
      formatter: function formatter(name) {
        return legendName[name] != null ? legendName[name] : name;
      }
    };
  } else {
    return false;
  }
}

function getPieTooltip(args) {
  var dataType = args.dataType,
      innerRows = args.innerRows,
      limitShowNum = args.limitShowNum,
      digit = args.digit,
      metrics = args.metrics,
      dimension = args.dimension;

  var sum = 0;
  var remainArr = innerRows.map(function (row) {
    sum += row[metrics];
    return {
      name: row[dimension],
      value: row[metrics]
    };
  }).slice(limitShowNum, innerRows.length);
  return {
    formatter: function formatter(item) {
      var tpl = [];
      tpl.push(constants.itemPoint(item.color));
      if (limitShowNum && item.name === '其他') {
        tpl.push('其他:');
        remainArr.forEach(function (_ref) {
          var name = _ref.name,
              value = _ref.value;

          var percent = utils.getFormated(value / sum, 'percent');
          tpl.push('<br>' + name + ':');
          tpl.push(utils.getFormated(value, dataType, digit));
          tpl.push('(' + percent + ')');
        });
      } else {
        tpl.push(item.name + ':');
        tpl.push(utils.getFormated(item.value, dataType, digit));
        tpl.push('(' + item.percent + '%)');
      }
      return tpl.join(' ');
    }
  };
}

var pie$1 = function pie$$1(columns, rows, settings, extra, isRing) {
  var innerRows = utilsLite.cloneDeep(rows);
  var _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? 'normal' : _settings$dataType,
      percentShow = settings.percentShow,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? columns[1] : _settings$metrics,
      _settings$roseType = settings.roseType,
      roseType = _settings$roseType === undefined ? false : _settings$roseType,
      _settings$radius = settings.radius,
      radius = _settings$radius === undefined ? isRing ? roseType ? roseRingRadius : ringRadius : pieRadius : _settings$radius,
      _settings$offsetY = settings.offsetY,
      offsetY = _settings$offsetY === undefined ? pieOffsetY : _settings$offsetY,
      _settings$legendLimit = settings.legendLimit,
      legendLimit = _settings$legendLimit === undefined ? 30 : _settings$legendLimit,
      _settings$selectedMod = settings.selectedMode,
      selectedMode = _settings$selectedMod === undefined ? false : _settings$selectedMod,
      _settings$hoverAnimat = settings.hoverAnimation,
      hoverAnimation = _settings$hoverAnimat === undefined ? true : _settings$hoverAnimat,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$label = settings.label,
      label = _settings$label === undefined ? false : _settings$label,
      _settings$level = settings.level,
      level = _settings$level === undefined ? false : _settings$level,
      _settings$limitShowNu = settings.limitShowNum,
      limitShowNum = _settings$limitShowNu === undefined ? 0 : _settings$limitShowNu,
      labelLine = settings.labelLine,
      itemStyle = settings.itemStyle;
  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible;

  if (limitShowNum) innerRows.sort(function (a, b) {
    return b[metrics] - a[metrics];
  });
  var seriesParams = {
    innerRows: innerRows,
    dataType: dataType,
    percentShow: percentShow,
    dimension: dimension,
    metrics: metrics,
    radius: radius,
    offsetY: offsetY,
    selectedMode: selectedMode,
    hoverAnimation: hoverAnimation,
    digit: digit,
    roseType: roseType,
    label: label,
    level: level,
    legendName: legendName,
    limitShowNum: limitShowNum,
    isRing: isRing,
    labelLine: labelLine,
    itemStyle: itemStyle
  };
  var series = getPieSeries(seriesParams);
  var legendParams = {
    innerRows: innerRows,
    dimension: dimension,
    legendLimit: legendLimit,
    legendName: legendName,
    level: level,
    limitShowNum: limitShowNum
  };
  var legend = legendVisible && getPieLegend(legendParams);
  var tooltip = tooltipVisible && getPieTooltip({
    dataType: dataType,
    innerRows: innerRows,
    limitShowNum: limitShowNum,
    digit: digit,
    metrics: metrics,
    dimension: dimension
  });
  var options = { series: series, legend: legend, tooltip: tooltip };
  return options;
};

var ring = function ring(columns, rows, settings, extra) {
  return pie$1(columns, rows, settings, extra, true);
};

var index = _extends({}, Core, {
  name: 'VeRing',
  data: function data() {
    this.chartHandler = ring;
    return {};
  }
});

module.exports = index;
