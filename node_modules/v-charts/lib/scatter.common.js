'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utils = require('./utils');
var utilsLite = require('utils-lite');
var constants = require('./constants');
require('echarts/lib/chart/scatter');
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

function getLineXAxis(args) {
  var dimension = args.dimension,
      rows = args.rows,
      xAxisName = args.xAxisName,
      axisVisible = args.axisVisible,
      xAxisType = args.xAxisType;

  return dimension.map(function (item, index) {
    return {
      type: xAxisType,
      nameLocation: 'middle',
      nameGap: 22,
      name: xAxisName[index] || '',
      axisTick: { show: true, lineStyle: { color: '#eee' } },
      data: rows.map(function (row) {
        return row[item];
      }),
      show: axisVisible
    };
  });
}

function getLineSeries(args) {
  var rows = args.rows,
      axisSite = args.axisSite,
      metrics = args.metrics,
      area = args.area,
      stack = args.stack,
      nullAddZero = args.nullAddZero,
      labelMap = args.labelMap,
      label = args.label,
      itemStyle = args.itemStyle,
      lineStyle = args.lineStyle,
      areaStyle = args.areaStyle,
      dimension = args.dimension;

  var series = [];
  var dataTemp = {};
  var stackMap = stack && utils.getStackMap(stack);
  metrics.forEach(function (item) {
    dataTemp[item] = [];
  });
  rows.forEach(function (row) {
    metrics.forEach(function (item) {
      var value = null;
      if (row[item] != null) {
        value = row[item];
      } else if (nullAddZero) {
        value = 0;
      }
      dataTemp[item].push([row[dimension[0]], value]);
    });
  });
  metrics.forEach(function (item) {
    var seriesItem = {
      name: labelMap[item] != null ? labelMap[item] : item,
      type: 'line',
      data: dataTemp[item]
    };

    if (area) seriesItem.areaStyle = { normal: {} };
    if (axisSite.right) {
      seriesItem.yAxisIndex = ~axisSite.right.indexOf(item) ? 1 : 0;
    }

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item];

    if (label) seriesItem.label = label;
    if (itemStyle) seriesItem.itemStyle = itemStyle;
    if (lineStyle) seriesItem.lineStyle = lineStyle;
    if (areaStyle) seriesItem.areaStyle = areaStyle;

    series.push(seriesItem);
  });
  return series;
}

function getLineYAxis(args) {
  var yAxisName = args.yAxisName,
      yAxisType = args.yAxisType,
      axisVisible = args.axisVisible,
      scale = args.scale,
      min = args.min,
      max = args.max,
      digit = args.digit;

  var yAxisBase = {
    type: 'value',
    axisTick: {
      show: false
    },
    show: axisVisible
  };
  var yAxis = [];

  var _loop = function _loop(i) {
    if (yAxisType[i]) {
      yAxis[i] = _extends({}, yAxisBase, {
        axisLabel: {
          formatter: function formatter(val) {
            return utils.getFormated(val, yAxisType[i], digit);
          }
        }
      });
    } else {
      yAxis[i] = _extends({}, yAxisBase);
    }
    yAxis[i].name = yAxisName[i] || '';
    yAxis[i].scale = scale[i] || false;
    yAxis[i].min = min[i] || null;
    yAxis[i].max = max[i] || null;
  };

  for (var i = 0; i < 2; i++) {
    _loop(i);
  }
  return yAxis;
}

function getLineTooltip(args) {
  var axisSite = args.axisSite,
      yAxisType = args.yAxisType,
      digit = args.digit,
      labelMap = args.labelMap,
      tooltipFormatter = args.tooltipFormatter;

  var rightItems = axisSite.right || [];
  var rightList = labelMap ? rightItems.map(function (item) {
    return labelMap[item] === undefined ? item : labelMap[item];
  }) : rightItems;
  return {
    trigger: 'axis',
    formatter: function formatter(items) {
      if (tooltipFormatter) {
        return tooltipFormatter.apply(null, arguments);
      }
      var tpl = [];
      var _items$ = items[0],
          name = _items$.name,
          axisValueLabel = _items$.axisValueLabel;

      var title = name || axisValueLabel;
      tpl.push(title + '<br>');
      items.forEach(function (_ref) {
        var seriesName = _ref.seriesName,
            data = _ref.data,
            marker = _ref.marker;

        var showData = null;
        var type = ~rightList.indexOf(seriesName) ? yAxisType[1] : yAxisType[0];
        var itemData = utilsLite.isArray(data) ? data[1] : data;
        showData = utils.getFormated(itemData, type, digit);
        tpl.push(marker);
        tpl.push(seriesName + ': ' + showData);
        tpl.push('<br>');
      });
      return tpl.join('');
    }
  };
}

function getLegend(args) {
  var metrics = args.metrics,
      legendName = args.legendName,
      labelMap = args.labelMap;

  if (!legendName && !labelMap) return { data: metrics };
  var data = labelMap ? metrics.map(function (item) {
    return labelMap[item] == null ? item : labelMap[item];
  }) : metrics;
  return {
    data: data,
    formatter: function formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

var line = function line(columns, rows, settings, extra) {
  rows = utilsLite.isArray(rows) ? rows : [];
  columns = utilsLite.isArray(columns) ? columns : [];
  var _settings$axisSite = settings.axisSite,
      axisSite = _settings$axisSite === undefined ? {} : _settings$axisSite,
      _settings$yAxisType = settings.yAxisType,
      yAxisType = _settings$yAxisType === undefined ? ['normal', 'normal'] : _settings$yAxisType,
      _settings$xAxisType = settings.xAxisType,
      xAxisType = _settings$xAxisType === undefined ? 'category' : _settings$xAxisType,
      _settings$yAxisName = settings.yAxisName,
      yAxisName = _settings$yAxisName === undefined ? [] : _settings$yAxisName,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? [columns[0]] : _settings$dimension,
      _settings$xAxisName = settings.xAxisName,
      xAxisName = _settings$xAxisName === undefined ? [] : _settings$xAxisName,
      _settings$axisVisible = settings.axisVisible,
      axisVisible = _settings$axisVisible === undefined ? true : _settings$axisVisible,
      area = settings.area,
      stack = settings.stack,
      _settings$scale = settings.scale,
      scale = _settings$scale === undefined ? [false, false] : _settings$scale,
      _settings$min = settings.min,
      min = _settings$min === undefined ? [null, null] : _settings$min,
      _settings$max = settings.max,
      max = _settings$max === undefined ? [null, null] : _settings$max,
      _settings$nullAddZero = settings.nullAddZero,
      nullAddZero = _settings$nullAddZero === undefined ? false : _settings$nullAddZero,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      label = settings.label,
      itemStyle = settings.itemStyle,
      lineStyle = settings.lineStyle,
      areaStyle = settings.areaStyle;
  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible,
      tooltipFormatter = extra.tooltipFormatter;

  var metrics = columns.slice();

  if (axisSite.left && axisSite.right) {
    metrics = axisSite.left.concat(axisSite.right);
  } else if (axisSite.left && !axisSite.right) {
    metrics = axisSite.left;
  } else if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    metrics.splice(columns.indexOf(dimension[0]), 1);
  }

  var legend = legendVisible && getLegend({ metrics: metrics, legendName: legendName, labelMap: labelMap });
  var tooltip = tooltipVisible && getLineTooltip({
    axisSite: axisSite,
    yAxisType: yAxisType,
    digit: digit,
    labelMap: labelMap,
    xAxisType: xAxisType,
    tooltipFormatter: tooltipFormatter
  });
  var xAxis = getLineXAxis({
    dimension: dimension,
    rows: rows,
    xAxisName: xAxisName,
    axisVisible: axisVisible,
    xAxisType: xAxisType
  });
  var yAxis = getLineYAxis({
    yAxisName: yAxisName,
    yAxisType: yAxisType,
    axisVisible: axisVisible,
    scale: scale,
    min: min,
    max: max,
    digit: digit
  });
  var series = getLineSeries({
    rows: rows,
    axisSite: axisSite,
    metrics: metrics,
    area: area,
    stack: stack,
    nullAddZero: nullAddZero,
    labelMap: labelMap,
    label: label,
    itemStyle: itemStyle,
    lineStyle: lineStyle,
    areaStyle: areaStyle,
    xAxisType: xAxisType,
    dimension: dimension
  });
  var options = { legend: legend, xAxis: xAxis, series: series, yAxis: yAxis, tooltip: tooltip };
  return options;
};

function getScatterLegend(dataLabels, legendName) {
  return {
    data: dataLabels,
    formatter: function formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

function getScatterTooltip(args) {
  var tooltipTrigger = args.tooltipTrigger;

  return {
    trigger: tooltipTrigger,
    formatter: function formatter(item) {
      if (utilsLite.isArray(item)) {
        return item.map(function (i) {
          return getTooltipContent(i, args);
        }).join('');
      } else {
        return getTooltipContent(item, args);
      }
    }
  };
}

function getTooltipContent(item, args) {
  var labelMap = args.labelMap,
      columns = args.columns,
      dataType = args.dataType,
      digit = args.digit;

  var tpl = [];
  var color = item.color,
      seriesName = item.seriesName,
      value = item.data.value;

  tpl.push(constants.itemPoint(color) + ' ' + seriesName + '<br>');
  value.forEach(function (d, i) {
    var name = labelMap[columns[i]] || columns[i];
    var num = isNaN(d) ? d : utils.getFormated(d, dataType[columns[i]], digit);
    tpl.push(name + ': ' + num + '<br>');
  });
  return tpl.join('');
}

function getScatterXAxis(args) {
  var xAxisName = args.xAxisName,
      axisVisible = args.axisVisible,
      xAxisType = args.xAxisType,
      rows = args.rows,
      dataLabels = args.dataLabels,
      dimension = args.dimension;

  var data = [];
  dataLabels.forEach(function (dataLabel) {
    var itemData = rows[dataLabel];
    itemData.forEach(function (item) {
      var name = item[dimension];
      if (name && !~data.indexOf(name)) data.push(name);
    });
  });

  return [{
    type: xAxisType,
    show: axisVisible,
    name: xAxisName,
    data: data
  }];
}

function getScatterYAxis(args) {
  var min = args.min,
      max = args.max,
      scale = args.scale,
      yAxisName = args.yAxisName,
      dataType = args.dataType,
      metrics = args.metrics,
      digit = args.digit,
      axisVisible = args.axisVisible;


  return {
    type: 'value',
    show: axisVisible,
    scale: scale,
    min: min,
    max: max,
    axisTick: { show: false },
    name: yAxisName,
    axisLabel: {
      formatter: function formatter(val) {
        return utils.getFormated(val, dataType[metrics[0]], digit);
      }
    }
  };
}

function getScatterSeries(args) {
  var rows = args.rows,
      dataLabels = args.dataLabels,
      columns = args.columns,
      metrics = args.metrics,
      dimension = args.dimension,
      label = args.label,
      itemStyle = args.itemStyle,
      symbol = args.symbol,
      symbolSizeMax = args.symbolSizeMax,
      symbolSize = args.symbolSize,
      symbolRotate = args.symbolRotate,
      symbolOffset = args.symbolOffset,
      cursor = args.cursor;

  var extraMetrics = columns.filter(function (column) {
    return !~metrics.indexOf(column) && column !== dimension;
  });
  var numbers = [];
  dataLabels.forEach(function (dataLabel) {
    rows[dataLabel].forEach(function (row) {
      numbers.push(row[metrics[1]]);
    });
  });
  var maxNum = Math.max.apply(null, numbers);

  var series = [];
  dataLabels.forEach(function (dataLabel) {
    var result = [];
    var itemData = rows[dataLabel];
    itemData.forEach(function (item) {
      var itemResult = { value: [] };
      itemResult.value.push(item[dimension], item[metrics[0]], item[metrics[1]]);
      extraMetrics.forEach(function (ext) {
        itemResult.value.push(item[ext]);
      });
      itemResult.symbolSize = symbolSize || item[metrics[1]] / maxNum * symbolSizeMax;
      result.push(itemResult);
    });
    series.push({
      type: 'scatter',
      data: result,
      name: dataLabel,
      label: label,
      itemStyle: itemStyle,
      symbol: symbol,
      symbolRotate: symbolRotate,
      symbolOffset: symbolOffset,
      cursor: cursor
    });
  });
  return series;
}

var scatter$1 = function scatter$$1(columns, rows, settings, extra) {
  var _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? [columns[1], columns[2]] : _settings$metrics,
      _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? {} : _settings$dataType,
      _settings$xAxisType = settings.xAxisType,
      xAxisType = _settings$xAxisType === undefined ? 'category' : _settings$xAxisType,
      xAxisName = settings.xAxisName,
      yAxisName = settings.yAxisName,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      _settings$tooltipTrig = settings.tooltipTrigger,
      tooltipTrigger = _settings$tooltipTrig === undefined ? 'item' : _settings$tooltipTrig,
      _settings$axisVisible = settings.axisVisible,
      axisVisible = _settings$axisVisible === undefined ? true : _settings$axisVisible,
      _settings$symbolSizeM = settings.symbolSizeMax,
      symbolSizeMax = _settings$symbolSizeM === undefined ? 50 : _settings$symbolSizeM,
      symbol = settings.symbol,
      symbolSize = settings.symbolSize,
      symbolRotate = settings.symbolRotate,
      symbolOffset = settings.symbolOffset,
      cursor = settings.cursor,
      min = settings.min,
      max = settings.max,
      scale = settings.scale,
      label = settings.label,
      itemStyle = settings.itemStyle;


  if (utilsLite.isArray(rows)) {
    var lineSettings = _extends({}, settings, {
      xAxisName: xAxisName ? [xAxisName] : undefined,
      yAxisName: yAxisName ? [yAxisName] : undefined,
      scale: scale ? [scale] : undefined,
      min: min ? [min] : undefined,
      max: max ? [max] : undefined,
      dimension: dimension ? [dimension] : undefined
    });
    var options = line(columns, rows, lineSettings, extra);
    if (!options || !options.series) return {};
    options.series.forEach(function (item) {
      _extends(item, {
        type: 'scatter',
        symbol: symbol,
        symbolSize: symbolSize || 10,
        symbolRotate: symbolRotate,
        symbolOffset: symbolOffset,
        cursor: cursor,
        label: label,
        itemStyle: itemStyle
      });
    });
    return options;
  }

  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible;

  var dataLabels = Object.keys(rows);

  var legend = legendVisible && getScatterLegend(dataLabels, legendName);
  var tooltip = tooltipVisible && getScatterTooltip({
    tooltipTrigger: tooltipTrigger,
    labelMap: labelMap,
    columns: columns,
    dataType: dataType,
    digit: digit
  });
  var xAxis = getScatterXAxis({
    xAxisName: xAxisName,
    axisVisible: axisVisible,
    xAxisType: xAxisType,
    dataLabels: dataLabels,
    dimension: dimension,
    rows: rows
  });
  var yAxis = getScatterYAxis({
    min: min,
    max: max,
    scale: scale,
    yAxisName: yAxisName,
    dataType: dataType,
    metrics: metrics,
    digit: digit,
    axisVisible: axisVisible
  });
  var series = getScatterSeries({
    rows: rows,
    dataLabels: dataLabels,
    columns: columns,
    metrics: metrics,
    dimension: dimension,
    label: label,
    itemStyle: itemStyle,
    symbol: symbol,
    symbolSizeMax: symbolSizeMax,
    symbolSize: symbolSize,
    symbolRotate: symbolRotate,
    symbolOffset: symbolOffset,
    cursor: cursor
  });
  return { legend: legend, tooltip: tooltip, xAxis: xAxis, yAxis: yAxis, series: series };
};

var index = _extends({}, Core, {
  name: 'VeScatter',
  data: function data() {
    this.chartHandler = scatter$1;
    return {};
  }
});

module.exports = index;
