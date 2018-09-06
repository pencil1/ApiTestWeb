'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utils = require('./utils');
require('echarts/lib/chart/bar');
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

function getWaterfallTooltip(dataType, digit) {
  return {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: function formatter(items) {
      var item = items[1];
      return [item.name + '<br/>' + item.seriesName + ' :', '' + utils.getFormated(item.value, dataType, digit)].join('');
    }
  };
}

function getWaterfallXAxis(args) {
  var dimension = args.dimension,
      rows = args.rows,
      remainStatus = args.remainStatus,
      totalName = args.totalName,
      remainName = args.remainName,
      labelMap = args.labelMap,
      xAxisName = args.xAxisName,
      axisVisible = args.axisVisible;

  var xAxisData = [totalName].concat(rows.map(function (row) {
    return row[dimension];
  }));
  if (remainStatus === 'have-remain') {
    xAxisData = xAxisData.concat([remainName]);
  }

  return {
    type: 'category',
    name: labelMap && labelMap[xAxisName] || xAxisName,
    splitLine: { show: false },
    data: xAxisData,
    show: axisVisible
  };
}

function getWaterfallYAxis(args) {
  var dataType = args.dataType,
      yAxisName = args.yAxisName,
      axisVisible = args.axisVisible,
      digit = args.digit,
      labelMap = args.labelMap;

  return {
    type: 'value',
    name: labelMap[yAxisName] != null ? labelMap[yAxisName] : yAxisName,
    axisTick: { show: false },
    axisLabel: {
      formatter: function formatter(val) {
        return utils.getFormated(val, dataType, digit);
      }
    },
    show: axisVisible
  };
}

function getWaterfallSeries(args) {
  var dataType = args.dataType,
      rows = args.rows,
      metrics = args.metrics,
      totalNum = args.totalNum,
      remainStatus = args.remainStatus,
      dataSum = args.dataSum,
      digit = args.digit;

  var seriesBase = { type: 'bar', stack: '总量' };
  var dataSumTemp = dataSum;
  var totalNumTemp = totalNum;
  var assistData = void 0;
  var mainData = void 0;
  var rowData = rows.map(function (row) {
    return row[metrics];
  });

  if (remainStatus === 'have-remain') {
    assistData = [0].concat(rows.map(function (row) {
      totalNumTemp -= row[metrics];
      return totalNumTemp;
    })).concat([0]);
    mainData = [totalNum].concat(rowData).concat([totalNum - dataSum]);
  } else {
    assistData = [0].concat(rows.map(function (row) {
      dataSumTemp -= row[metrics];
      return dataSumTemp;
    }));
    mainData = [dataSum].concat(rowData);
  }
  var series = [];

  series.push(_extends({
    name: '辅助',
    itemStyle: {
      normal: { opacity: 0 },
      emphasis: { opacity: 0 }
    },
    data: assistData
  }, seriesBase));

  series.push(_extends({
    name: '数值',
    label: {
      normal: {
        show: true,
        position: 'top',
        formatter: function formatter(item) {
          return utils.getFormated(item.value, dataType, digit);
        }
      }
    },
    data: mainData
  }, seriesBase));
  return series;
}

function getWaterfallRemainStatus(dataSum, totalNum) {
  if (!totalNum) return 'not-total';
  return totalNum > dataSum ? 'have-remain' : 'none-remain';
}

var waterfall = function waterfall(columns, rows, settings, extra) {
  var _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? 'normal' : _settings$dataType,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$totalName = settings.totalName,
      totalName = _settings$totalName === undefined ? '总计' : _settings$totalName,
      totalNum = settings.totalNum,
      _settings$remainName = settings.remainName,
      remainName = _settings$remainName === undefined ? '其他' : _settings$remainName,
      _settings$xAxisName = settings.xAxisName,
      xAxisName = _settings$xAxisName === undefined ? dimension : _settings$xAxisName,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      _settings$axisVisible = settings.axisVisible,
      axisVisible = _settings$axisVisible === undefined ? true : _settings$axisVisible,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit;
  var tooltipVisible = extra.tooltipVisible;

  var metricsTemp = columns.slice();
  metricsTemp.splice(metricsTemp.indexOf(dimension), 1);
  var metrics = metricsTemp[0];
  var yAxisName = metrics;
  var tooltip = tooltipVisible && getWaterfallTooltip(dataType, digit);
  var dataSum = parseFloat(rows.reduce(function (pre, cur) {
    return pre + Number(cur[metrics]);
  }, 0).toFixed(digit));
  var remainStatus = getWaterfallRemainStatus(dataSum, totalNum);
  var xAxisParams = {
    dimension: dimension,
    rows: rows,
    remainStatus: remainStatus,
    totalName: totalName,
    remainName: remainName,
    xAxisName: xAxisName,
    labelMap: labelMap,
    axisVisible: axisVisible
  };
  var xAxis = getWaterfallXAxis(xAxisParams);
  var yAxis = getWaterfallYAxis({ dataType: dataType, yAxisName: yAxisName, axisVisible: axisVisible, digit: digit, labelMap: labelMap });
  var seriesParams = {
    dataType: dataType,
    rows: rows,
    dimension: dimension,
    metrics: metrics,
    totalNum: totalNum,
    remainStatus: remainStatus,
    dataSum: dataSum,
    digit: digit
  };
  var series = getWaterfallSeries(seriesParams);
  var options = { tooltip: tooltip, xAxis: xAxis, yAxis: yAxis, series: series };
  return options;
};

var index = _extends({}, Core, {
  name: 'VeWaterfall',
  data: function data() {
    this.chartHandler = waterfall;
    return {};
  }
});

module.exports = index;
