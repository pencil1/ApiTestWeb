'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var constants = require('./constants');
var utils = require('./utils');
var utilsLite = require('utils-lite');
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/chart/candlestick');
require('echarts/lib/component/visualMap');
require('echarts/lib/component/dataZoom');
var Core = _interopDefault(require('./core'));

var DEFAULT_MA = [5, 10, 20, 30];
var DEFAULT_K_NAME = '日K';
var DEFAULT_DOWN_COLOR = '#ec0000';
var DEFAULT_UP_COLOR = '#00da3c';
var DEFAULT_START = 50;
var DEFAULT_END = 100;
var SHOW_FALSE = { show: false };

function getCandleLegend(args) {
  var showMA = args.showMA,
      MA = args.MA,
      legendName = args.legendName,
      labelMap = args.labelMap;

  var data = [DEFAULT_K_NAME];
  if (showMA) data = data.concat(MA.map(function (v) {
    return 'MA' + v;
  }));
  if (labelMap) data = data.map(function (v) {
    return labelMap[v] == null ? v : labelMap[v];
  });
  return {
    data: data,
    formatter: function formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

function getCandleTooltip(args) {
  var metrics = args.metrics,
      dataType = args.dataType,
      digit = args.digit,
      labelMap = args.labelMap;

  return {
    trigger: 'axis',
    axisPointer: { type: 'cross' },
    position: function position(pos, params, el, elRect, size) {
      var result = { top: 10 };
      var side = pos[0] < size.viewSize[0] / 2 ? 'right' : 'left';
      result[side] = 60;
      return result;
    },
    formatter: function formatter(options) {
      var tpl = [];
      tpl.push(options[0].axisValue + '<br>');
      options.forEach(function (option) {
        var data = option.data,
            seriesName = option.seriesName,
            componentSubType = option.componentSubType,
            color = option.color;

        var name = labelMap[seriesName] == null ? seriesName : labelMap[seriesName];
        tpl.push(constants.itemPoint(color) + ' ' + name + ': ');
        if (componentSubType === 'candlestick') {
          tpl.push('<br>');
          metrics.slice(0, 4).forEach(function (m, i) {
            var name = labelMap[m] != null ? labelMap[m] : m;
            var val = utils.getFormated(data[i + 1], dataType, digit);
            tpl.push('- ' + name + ': ' + val + '<br>');
          });
        } else if (componentSubType === 'line') {
          var val = utils.getFormated(data, dataType, digit);
          tpl.push(val + '<br>');
        } else if (componentSubType === 'bar') {
          var _val = utils.getFormated(data[1], dataType, digit);
          tpl.push(_val + '<br>');
        }
      });
      return tpl.join('');
    }
  };
}

function getCandleVisualMap(args) {
  var downColor = args.downColor,
      upColor = args.upColor,
      MA = args.MA,
      showMA = args.showMA;

  return {
    show: false,
    seriesIndex: showMA ? 1 + MA.length : 1,
    dimension: 2,
    pieces: [{ value: 1, color: downColor }, { value: -1, color: upColor }]
  };
}

function getCandleGrid(args) {
  var showVol = args.showVol;

  return [{
    left: '10%',
    right: '8%',
    top: '10%',
    height: showVol ? '50%' : '65%',
    containLabel: false
  }, {
    left: '10%',
    right: '8%',
    top: '65%',
    height: '16%',
    containLabel: false
  }];
}

function getCandleXAxis(args) {
  var data = args.dims;

  var type = 'category';
  var scale = true;
  var boundaryGap = false;
  var splitLine = SHOW_FALSE;
  var axisLine = { onZero: false };
  var axisTick = SHOW_FALSE;
  var axisLabel = SHOW_FALSE;
  var min = 'dataMin';
  var max = 'dataMax';
  var gridIndex = 1;

  return [{ type: type, data: data, scale: scale, boundaryGap: boundaryGap, axisLine: axisLine, splitLine: splitLine, min: min, max: max }, { type: type, gridIndex: gridIndex, data: data, scale: scale, boundaryGap: boundaryGap, axisLine: axisLine, axisTick: axisTick, splitLine: splitLine, axisLabel: axisLabel, min: min, max: max }];
}

function getCandleYAxis(args) {
  var dataType = args.dataType,
      digit = args.digit;

  var scale = true;
  var gridIndex = 1;
  var splitNumber = 2;
  var axisLine = SHOW_FALSE;
  var axisTick = SHOW_FALSE;
  var axisLabel = SHOW_FALSE;
  var splitLine = SHOW_FALSE;
  var formatter = function formatter(val) {
    return utils.getFormated(val, dataType, digit);
  };

  return [{ scale: scale, axisTick: axisTick, axisLabel: { formatter: formatter } }, { scale: scale, gridIndex: gridIndex, splitNumber: splitNumber, axisLine: axisLine, axisTick: axisTick, splitLine: splitLine, axisLabel: axisLabel }];
}

function getCandleDataZoom(args) {
  var start = args.start,
      end = args.end;


  return [{
    type: 'inside',
    xAxisIndex: [0, 1],
    start: start,
    end: end
  }, {
    show: true,
    xAxisIndex: [0, 1],
    type: 'slider',
    top: '85%',
    start: start,
    end: end
  }];
}

function getCandleSeries(args) {
  var values = args.values,
      volumes = args.volumes,
      upColor = args.upColor,
      downColor = args.downColor,
      showMA = args.showMA,
      MA = args.MA,
      showVol = args.showVol,
      labelMap = args.labelMap,
      digit = args.digit,
      itemStyle = args.itemStyle;

  var style = itemStyle || {
    normal: {
      color: upColor,
      color0: downColor,
      borderColor: null,
      borderColor0: null
    }
  };
  var lineStyle = { normal: { opacity: 0.5 } };
  var series = [{
    name: labelMap[DEFAULT_K_NAME] == null ? DEFAULT_K_NAME : labelMap[DEFAULT_K_NAME],
    type: 'candlestick',
    data: values,
    itemStyle: style
  }];

  if (showMA) {
    MA.forEach(function (d) {
      var name = 'MA' + d;
      series.push({
        name: labelMap[name] == null ? name : labelMap[name],
        data: calculateMA(d, values, digit),
        type: 'line',
        lineStyle: lineStyle,
        smooth: true
      });
    });
  }

  if (showVol) {
    series.push({
      name: 'Volume',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: volumes
    });
  }

  return series;
}

function calculateMA(dayCount, data, digit) {
  var result = [];
  data.forEach(function (d, i) {
    if (i < dayCount) {
      result.push('-');
    } else {
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data[i - j][1];
      }result.push(+(sum / dayCount).toFixed(digit));
    }
  });
  return result;
}

var candle = function candle(columns, rows, settings, status) {
  var _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? columns.slice(1, 6) : _settings$metrics,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      itemStyle = settings.itemStyle,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$MA = settings.MA,
      MA = _settings$MA === undefined ? DEFAULT_MA : _settings$MA,
      _settings$showMA = settings.showMA,
      showMA = _settings$showMA === undefined ? false : _settings$showMA,
      _settings$showVol = settings.showVol,
      showVol = _settings$showVol === undefined ? false : _settings$showVol,
      _settings$showDataZoo = settings.showDataZoom,
      showDataZoom = _settings$showDataZoo === undefined ? false : _settings$showDataZoo,
      _settings$downColor = settings.downColor,
      downColor = _settings$downColor === undefined ? DEFAULT_DOWN_COLOR : _settings$downColor,
      _settings$upColor = settings.upColor,
      upColor = _settings$upColor === undefined ? DEFAULT_UP_COLOR : _settings$upColor,
      _settings$start = settings.start,
      start = _settings$start === undefined ? DEFAULT_START : _settings$start,
      _settings$end = settings.end,
      end = _settings$end === undefined ? DEFAULT_END : _settings$end,
      dataType = settings.dataType;
  var tooltipVisible = status.tooltipVisible,
      legendVisible = status.legendVisible;


  var isLiteData = utilsLite.isArray(rows[0]);
  var dims = [];
  var values = [];
  var volumes = [];
  var candleMetrics = metrics.slice(0, 4);
  var volumeMetrics = metrics[4];

  if (isLiteData) {
    rows.forEach(function (row) {
      var itemResult = [];
      dims.push(row[columns.indexOf(dimension)]);
      candleMetrics.forEach(function (item) {
        itemResult.push(row[columns.indexOf(item)]);
      });
      values.push(itemResult);
      if (volumeMetrics) volumes.push(row[columns.indexOf(volumeMetrics)]);
    });
  } else {
    rows.forEach(function (row, index) {
      var itemResult = [];
      dims.push(row[dimension]);
      candleMetrics.forEach(function (item) {
        itemResult.push(row[item]);
      });
      values.push(itemResult);
      if (volumeMetrics) {
        var _status = row[metrics[0]] > row[metrics[1]] ? 1 : -1;
        volumes.push([index, row[volumeMetrics], _status]);
      }
    });
  }

  var legend = legendVisible && getCandleLegend({ showMA: showMA, MA: MA, legendName: legendName, labelMap: labelMap });
  var tooltip = tooltipVisible && getCandleTooltip({ metrics: metrics, dataType: dataType, digit: digit, labelMap: labelMap });
  var visualMap$$1 = showVol && getCandleVisualMap({ downColor: downColor, upColor: upColor, MA: MA, showMA: showMA });
  var dataZoom$$1 = showDataZoom && getCandleDataZoom({ start: start, end: end });
  var grid = getCandleGrid({ showVol: showVol });
  var xAxis = getCandleXAxis({ dims: dims });
  var yAxis = getCandleYAxis({ dataType: dataType, digit: digit });
  var series = getCandleSeries({
    values: values,
    volumes: volumes,
    upColor: upColor,
    downColor: downColor,
    showMA: showMA,
    MA: MA,
    showVol: showVol,
    labelMap: labelMap,
    digit: digit,
    itemStyle: itemStyle
  });
  var axisPointer = { link: { xAxisIndex: 'all' } };
  return { legend: legend, tooltip: tooltip, visualMap: visualMap$$1, grid: grid, xAxis: xAxis, yAxis: yAxis, dataZoom: dataZoom$$1, series: series, axisPointer: axisPointer };
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
  name: 'VeCandle',
  data: function data() {
    this.chartHandler = candle;
    return {};
  }
});

module.exports = index;
