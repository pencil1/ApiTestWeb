(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('echarts/lib/echarts'), require('echarts/lib/component/tooltip'), require('echarts/lib/component/legend'), require('echarts/lib/chart/scatter')) :
  typeof define === 'function' && define.amd ? define(['echarts/lib/echarts', 'echarts/lib/component/tooltip', 'echarts/lib/component/legend', 'echarts/lib/chart/scatter'], factory) :
  (global.VeScatter = factory(global.echarts));
}(this, (function (echartsLib) { 'use strict';

  echartsLib = echartsLib && echartsLib.hasOwnProperty('default') ? echartsLib['default'] : echartsLib;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
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

  function set$1(target, path, value) {
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

  var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  };

  function getType(v) {
    return Object.prototype.toString.call(v);
  }

  function getTypeof(v) {
    return typeof v === 'undefined' ? 'undefined' : _typeof$1(v);
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

  function cloneDeep(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function camelToKebab(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function hasOwn(source, target) {
    return Object.prototype.hasOwnProperty.call(source, target);
  }

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

  var DEFAULT_THEME = {
    categoryAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    },
    valueAxis: {
      axisLine: { show: false }
    },
    line: {
      smooth: true
    },
    grid: {
      containLabel: true,
      left: 10,
      right: 10
    }
  };

  var DEFAULT_COLORS = ['#19d4ae', '#5ab1ef', '#fa6e86', '#ffb980', '#0067a6', '#c4b4e4', '#d87a80', '#9cbbff', '#d9d0c7', '#87a997', '#d49ea2', '#5b4947', '#7ba3a8'];

  var itemPoint = function itemPoint(color) {
    return ['<span style="', 'background-color:' + color + ';', 'display: inline-block;', 'width: 10px;', 'height: 10px;', 'border-radius: 50%;', 'margin-right:2px;', '"></span>'].join('');
  };

  var STATIC_PROPS = ['initOptions', 'loading', 'dataEmpty', 'judgeWidth', 'widthChangeDelay'];

  var ECHARTS_SETTINGS = ['grid', 'dataZoom', 'visualMap', 'toolbox', 'title', 'legend', 'xAxis', 'yAxis', 'radar', 'tooltip', 'axisPointer', 'brush', 'geo', 'timeline', 'graphic', 'series', 'backgroundColor', 'textStyle'];

  var ABBR = {
    th: 3,
    mi: 6,
    bi: 9,
    tr: 12
  };

  var DEFAULT_OPTIONS = {
    zeroFormat: null,
    nullFormat: null,
    defaultFormat: '0,0',
    scalePercentBy100: true,
    abbrLabel: {
      th: 'k',
      mi: 'm',
      bi: 'b',
      tr: 't'
    }
  };

  var TRILLION = 1e12;
  var BILLION = 1e9;
  var MILLION = 1e6;
  var THOUSAND = 1e3;

  function numIsNaN(value) {
    return typeof value === 'number' && isNaN(value);
  }

  function toFixed(value, maxDecimals, roundingFunction, optionals) {
    var splitValue = value.toString().split('.');
    var minDecimals = maxDecimals - (optionals || 0);
    var boundedPrecision = splitValue.length === 2 ? Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals) : minDecimals;
    var power = Math.pow(10, boundedPrecision);
    var output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

    if (optionals > maxDecimals - boundedPrecision) {
      var optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
      output = output.replace(optionalsRegExp, '');
    }

    return output;
  }

  function numberToFormat(options, value, format, roundingFunction) {
    var abs = Math.abs(value);
    var negP = false;
    var optDec = false;
    var abbr = '';
    var decimal = '';
    var neg = false;
    var abbrForce = void 0;
    var signed = void 0;
    format = format || '';

    value = value || 0;

    if (~format.indexOf('(')) {
      negP = true;
      format = format.replace(/[(|)]/g, '');
    } else if (~format.indexOf('+') || ~format.indexOf('-')) {
      signed = ~format.indexOf('+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
      format = format.replace(/[+|-]/g, '');
    }
    if (~format.indexOf('a')) {
      abbrForce = format.match(/a(k|m|b|t)?/);

      abbrForce = abbrForce ? abbrForce[1] : false;

      if (~format.indexOf(' a')) abbr = ' ';
      format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

      if (abs >= TRILLION && !abbrForce || abbrForce === 't') {
        abbr += options.abbrLabel.tr;
        value = value / TRILLION;
      } else if (abs < TRILLION && abs >= BILLION && !abbrForce || abbrForce === 'b') {
        abbr += options.abbrLabel.bi;
        value = value / BILLION;
      } else if (abs < BILLION && abs >= MILLION && !abbrForce || abbrForce === 'm') {
        abbr += options.abbrLabel.mi;
        value = value / MILLION;
      } else if (abs < MILLION && abs >= THOUSAND && !abbrForce || abbrForce === 'k') {
        abbr += options.abbrLabel.th;
        value = value / THOUSAND;
      }
    }
    if (~format.indexOf('[.]')) {
      optDec = true;
      format = format.replace('[.]', '.');
    }
    var int = value.toString().split('.')[0];
    var precision = format.split('.')[1];
    var thousands = format.indexOf(',');
    var leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

    if (precision) {
      if (~precision.indexOf('[')) {
        precision = precision.replace(']', '');
        precision = precision.split('[');
        decimal = toFixed(value, precision[0].length + precision[1].length, roundingFunction, precision[1].length);
      } else {
        decimal = toFixed(value, precision.length, roundingFunction);
      }

      int = decimal.split('.')[0];
      decimal = ~decimal.indexOf('.') ? '.' + decimal.split('.')[1] : '';
      if (optDec && +decimal.slice(1) === 0) decimal = '';
    } else {
      int = toFixed(value, 0, roundingFunction);
    }
    if (abbr && !abbrForce && +int >= 1000 && abbr !== ABBR.trillion) {
      int = '' + +int / 1000;
      abbr = ABBR.million;
    }
    if (~int.indexOf('-')) {
      int = int.slice(1);
      neg = true;
    }
    if (int.length < leadingCount) {
      for (var i = leadingCount - int.length; i > 0; i--) {
        int = '0' + int;
      }
    }

    if (thousands > -1) {
      int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
    }

    if (!format.indexOf('.')) int = '';

    var output = int + decimal + (abbr || '');

    if (negP) {
      output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
    } else {
      if (signed >= 0) {
        output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
      } else if (neg) {
        output = '-' + output;
      }
    }

    return output;
  }

  function extend$1(target, sub) {
    Object.keys(sub).forEach(function (key) {
      target[key] = sub[key];
    });
  }

  var numerifyPercent = {
    regexp: /%/,
    format: function format(value, formatType, roundingFunction, numerify) {
      var space = ~formatType.indexOf(' %') ? ' ' : '';
      var output = void 0;

      if (numerify.options.scalePercentBy100) value = value * 100;

      formatType = formatType.replace(/\s?%/, '');

      output = numerify._numberToFormat(value, formatType, roundingFunction);

      if (~output.indexOf(')')) {
        output = output.split('');
        output.splice(-1, 0, space + '%');
        output = output.join('');
      } else {
        output = output + space + '%';
      }

      return output;
    }
  };

  var options = {};
  var formats = {};

  extend$1(options, DEFAULT_OPTIONS);

  function format(value, formatType, roundingFunction) {
    formatType = formatType || options.defaultFormat;
    roundingFunction = roundingFunction || Math.round;
    var output = void 0;
    var formatFunction = void 0;

    if (value === 0 && options.zeroFormat !== null) {
      output = options.zeroFormat;
    } else if (value === null && options.nullFormat !== null) {
      output = options.nullFormat;
    } else {
      for (var kind in formats) {
        if (formats[kind] && formatType.match(formats[kind].regexp)) {
          formatFunction = formats[kind].format;
          break;
        }
      }
      formatFunction = formatFunction || numberToFormat.bind(null, options);
      output = formatFunction(value, formatType, roundingFunction, numerify);
    }

    return output;
  }

  function numerify(input, formatType, roundingFunction) {
    var value = void 0;

    if (input === 0 || typeof input === 'undefined') {
      value = 0;
    } else if (input === null || numIsNaN(input)) {
      value = null;
    } else if (typeof input === 'string') {
      if (options.zeroFormat && input === options.zeroFormat) {
        value = 0;
      } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
        value = null;
      } else {
        value = +input;
      }
    } else {
      value = +input || null;
    }

    return format(value, formatType, roundingFunction);
  }

  numerify.options = options;
  numerify._numberToFormat = numberToFormat.bind(null, options);
  numerify.register = function (name, format) {
    formats[name] = format;
  };
  numerify.unregister = function (name) {
    formats[name] = null;
  };
  numerify.setOptions = function (opts) {
    extend$1(options, opts);
  };
  numerify.reset = function () {
    extend$1(options, DEFAULT_OPTIONS);
  };

  numerify.register('percentage', numerifyPercent);

  var getFormated = function getFormated(val, type, digit) {
    var defaultVal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';

    if (isNaN(val)) return defaultVal;
    if (!type) return val;
    if (isFunction(type)) return type(val, numerify);

    digit = isNaN(digit) ? 0 : ++digit;
    var digitStr = '.[' + new Array(digit).join(0) + ']';
    var formatter = type;
    switch (type) {
      case 'KMB':
        formatter = digit ? '0,0' + digitStr + 'a' : '0,0a';
        break;
      case 'normal':
        formatter = digit ? '0,0' + digitStr : '0,0';
        break;
      case 'percent':
        formatter = digit ? '0,0' + digitStr + '%' : '0,0.[00]%';
        break;
    }
    return numerify(val, formatter);
  };

  var getStackMap = function getStackMap(stack) {
    var stackMap = {};
    Object.keys(stack).forEach(function (item) {
      stack[item].forEach(function (name) {
        stackMap[name] = item;
      });
    });
    return stackMap;
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
    var stackMap = stack && getStackMap(stack);
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
              return getFormated(val, yAxisType[i], digit);
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
          var itemData = isArray(data) ? data[1] : data;
          showData = getFormated(itemData, type, digit);
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
    rows = isArray(rows) ? rows : [];
    columns = isArray(columns) ? columns : [];
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

    var legend$$1 = legendVisible && getLegend({ metrics: metrics, legendName: legendName, labelMap: labelMap });
    var tooltip$$1 = tooltipVisible && getLineTooltip({
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
    var options = { legend: legend$$1, xAxis: xAxis, series: series, yAxis: yAxis, tooltip: tooltip$$1 };
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
        if (isArray(item)) {
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

    tpl.push(itemPoint(color) + ' ' + seriesName + '<br>');
    value.forEach(function (d, i) {
      var name = labelMap[columns[i]] || columns[i];
      var num = isNaN(d) ? d : getFormated(d, dataType[columns[i]], digit);
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
          return getFormated(val, dataType[metrics[0]], digit);
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


    if (isArray(rows)) {
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

    var legend$$1 = legendVisible && getScatterLegend(dataLabels, legendName);
    var tooltip$$1 = tooltipVisible && getScatterTooltip({
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
    return { legend: legend$$1, tooltip: tooltip$$1, xAxis: xAxis, yAxis: yAxis, series: series };
  };

  var Loading = { render: function render() {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "v-charts-component-loading" }, [_c('div', { staticClass: "loader" }, [_c('div', { staticClass: "loading-spinner" }, [_c('svg', { staticClass: "circular", attrs: { "viewBox": "25 25 50 50" } }, [_c('circle', { staticClass: "path", attrs: { "cx": "50", "cy": "50", "r": "20", "fill": "none" } })])])])]);
    }, staticRenderFns: []
  };

  var DataEmpty = { render: function render() {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "v-charts-data-empty" }, [_vm._v(" 暂无数据 ")]);
    }, staticRenderFns: []
  };

  function setExtend (options, extend$$1) {
    Object.keys(extend$$1).forEach(function (attr) {
      var value = extend$$1[attr];
      if (~attr.indexOf('.')) {
        // eg: a.b.c a.1.b
        set$1(options, attr, value);
      } else if (typeof value === 'function') {
        // get callback value
        options[attr] = value(options[attr]);
      } else {
        // mixin extend value
        if (isArray(options[attr]) && isObject(options[attr][0])) {
          // eg: [{ xx: 1 }, { xx: 2 }]
          options[attr].forEach(function (option, index) {
            options[attr][index] = _extends({}, option, value);
          });
        } else if (isObject(options[attr])) {
          // eg: { xx: 1, yy: 2 }
          options[attr] = _extends({}, options[attr], value);
        } else {
          options[attr] = value;
        }
      }
    });
  }

  function setMark (seriesItem, marks) {
    Object.keys(marks).forEach(function (key) {
      if (marks[key]) seriesItem[key] = marks[key];
    });
  }

  function setAnimation (options, animation) {
    Object.keys(animation).forEach(function (key) {
      options[key] = animation[key];
    });
  }

  var Core = {
    render: function render(h) {
      return h('div', {
        class: [camelToKebab(this.$options.name || this.$options._componentTag)],
        style: this.canvasStyle
      }, [h('div', {
        style: this.canvasStyle,
        class: { 'v-charts-mask-status': this.dataEmpty || this.loading },
        ref: 'canvas'
      }), h(DataEmpty, {
        style: { display: this.dataEmpty ? '' : 'none' }
      }), h(Loading, {
        style: { display: this.loading ? '' : 'none' }
      }), this.$slots.default]);
    },


    props: {
      data: { type: [Object, Array], default: function _default() {
          return {};
        }
      },
      settings: { type: Object, default: function _default() {
          return {};
        }
      },
      width: { type: String, default: 'auto' },
      height: { type: String, default: '400px' },
      beforeConfig: { type: Function },
      afterConfig: { type: Function },
      afterSetOption: { type: Function },
      afterSetOptionOnce: { type: Function },
      events: { type: Object },
      grid: { type: [Object, Array] },
      colors: { type: Array },
      tooltipVisible: { type: Boolean, default: true },
      legendVisible: { type: Boolean, default: true },
      legendPosition: { type: String },
      markLine: { type: Object },
      markArea: { type: Object },
      markPoint: { type: Object },
      visualMap: { type: [Object, Array] },
      dataZoom: { type: [Object, Array] },
      toolbox: { type: [Object, Array] },
      initOptions: { type: Object, default: function _default() {
          return {};
        }
      },
      title: [Object, Array],
      legend: [Object, Array],
      xAxis: [Object, Array],
      yAxis: [Object, Array],
      radar: Object,
      tooltip: Object,
      axisPointer: [Object, Array],
      brush: [Object, Array],
      geo: [Object, Array],
      timeline: [Object, Array],
      graphic: [Object, Array],
      series: [Object, Array],
      backgroundColor: [Object, String],
      textStyle: [Object, Array],
      animation: Object,
      theme: Object,
      themeName: String,
      loading: Boolean,
      dataEmpty: Boolean,
      extend: Object,
      judgeWidth: { type: Boolean, default: false },
      widthChangeDelay: { type: Number, default: 300 },
      tooltipFormatter: { type: Function },
      resizeable: { type: Boolean, default: true },
      resizeDelay: { type: Number, default: 200 },
      changeDelay: { type: Number, default: 0 },
      setOptionOpts: { type: [Boolean, Object], default: true },
      cancelResizeCheck: Boolean,
      notSetUnchange: Array
    },

    watch: {
      data: {
        deep: true,
        handler: function handler(v) {
          if (v) {
            this.changeHandler();
          }
        }
      },

      settings: {
        deep: true,
        handler: function handler(v) {
          if (v.type && this.chartLib) this.chartHandler = this.chartLib[v.type];
          this.changeHandler();
        }
      },

      width: 'nextTickResize',
      height: 'nextTickResize',

      events: {
        deep: true,
        handler: 'createEventProxy'
      },

      theme: {
        deep: true,
        handler: 'themeChange'
      },

      themeName: 'themeChange',

      resizeable: 'resizeableHandler'
    },

    computed: {
      canvasStyle: function canvasStyle() {
        return {
          width: this.width,
          height: this.height,
          position: 'relative'
        };
      },
      chartColor: function chartColor() {
        return this.colors || this.theme && this.theme.color || DEFAULT_COLORS;
      }
    },

    methods: {
      dataHandler: function dataHandler() {
        if (!this.chartHandler) return;
        var data = this.data;
        var _data = data,
            _data$columns = _data.columns,
            columns = _data$columns === undefined ? [] : _data$columns,
            _data$rows = _data.rows,
            rows = _data$rows === undefined ? [] : _data$rows;

        var extra = {
          tooltipVisible: this.tooltipVisible,
          legendVisible: this.legendVisible,
          echarts: this.echarts,
          color: this.chartColor,
          tooltipFormatter: this.tooltipFormatter,
          _once: this._once
        };
        if (this.beforeConfig) data = this.beforeConfig(data);

        var options = this.chartHandler(columns, rows, this.settings, extra);
        if (options) {
          if (typeof options.then === 'function') {
            options.then(this.optionsHandler);
          } else {
            this.optionsHandler(options);
          }
        }
      },
      nextTickResize: function nextTickResize() {
        this.$nextTick(this.resize);
      },
      resize: function resize() {
        if (!this.cancelResizeCheck) {
          if (this.$el && this.$el.clientWidth && this.$el.clientHeight) {
            this.echartsResize();
          }
        } else {
          this.echartsResize();
        }
      },
      echartsResize: function echartsResize() {
        this.echarts && this.echarts.resize();
      },
      optionsHandler: function optionsHandler(options) {
        var _this = this;

        // legend
        if (this.legendPosition && options.legend) {
          options.legend[this.legendPosition] = 10;
          if (~['left', 'right'].indexOf(this.legendPosition)) {
            options.legend.top = 'middle';
            options.legend.orient = 'vertical';
          }
        }
        // color
        options.color = this.chartColor;
        // echarts self settings
        ECHARTS_SETTINGS.forEach(function (setting) {
          if (_this[setting]) options[setting] = _this[setting];
        });
        // animation
        if (this.animation) setAnimation(options, this.animation);
        // marks
        if (this.markArea || this.markLine || this.markPoint) {
          var marks = {
            markArea: this.markArea,
            markLine: this.markLine,
            markPoint: this.markPoint
          };
          var series = options.series;
          if (isArray(series)) {
            series.forEach(function (item) {
              setMark(item, marks);
            });
          } else if (isObject(series)) {
            setMark(series, marks);
          }
        }
        // change inited echarts settings
        if (this.extend) setExtend(options, this.extend);
        if (this.afterConfig) options = this.afterConfig(options);
        var setOptionOpts = this.setOptionOpts;
        // map chart not merge
        if ((this.settings.bmap || this.settings.amap) && !isObject(setOptionOpts)) {
          setOptionOpts = false;
        }
        // exclude unchange options
        if (this.notSetUnchange && this.notSetUnchange.length) {
          this.notSetUnchange.forEach(function (item) {
            var value = options[item];
            if (value) {
              if (isEqual(value, _this._store[item])) {
                options[item] = undefined;
              } else {
                _this._store[item] = cloneDeep(value);
              }
            }
          });
          if (isObject(setOptionOpts)) {
            setOptionOpts.notMerge = false;
          } else {
            setOptionOpts = false;
          }
        }
        if (this._isDestroyed) return;
        this.echarts.setOption(options, setOptionOpts);
        this.$emit('ready', this.echarts, options, echartsLib);
        if (!this._once['ready-once']) {
          this._once['ready-once'] = true;
          this.$emit('ready-once', this.echarts, options, echartsLib);
        }
        if (this.judgeWidth) this.judgeWidthHandler(options);
        if (this.afterSetOption) this.afterSetOption(this.echarts, options, echartsLib);
        if (this.afterSetOptionOnce && !this._once['afterSetOptionOnce']) {
          this._once['afterSetOptionOnce'] = true;
          this.afterSetOptionOnce(this.echarts, options, echartsLib);
        }
      },
      judgeWidthHandler: function judgeWidthHandler(options) {
        var _this2 = this;

        var widthChangeDelay = this.widthChangeDelay,
            resize = this.resize;

        if (this.$el.clientWidth || this.$el.clientHeight) {
          resize();
        } else {
          this.$nextTick(function (_) {
            if (_this2.$el.clientWidth || _this2.$el.clientHeight) {
              resize();
            } else {
              setTimeout(function (_) {
                resize();
                if (!_this2.$el.clientWidth || !_this2.$el.clientHeight) {
                  console.warn(' Can\'t get dom width or height ');
                }
              }, widthChangeDelay);
            }
          });
        }
      },
      resizeableHandler: function resizeableHandler(resizeable) {
        if (resizeable && !this._once.onresize) this.addResizeListener();
        if (!resizeable && this._once.onresize) this.removeResizeListener();
      },
      init: function init() {
        if (this.echarts) return;
        var themeName = this.themeName || this.theme || DEFAULT_THEME;
        this.echarts = echartsLib.init(this.$refs.canvas, themeName, this.initOptions);
        if (this.data) this.changeHandler();
        this.createEventProxy();
        if (this.resizeable) this.addResizeListener();
      },
      addResizeListener: function addResizeListener() {
        window.addEventListener('resize', this.resizeHandler);
        this._once.onresize = true;
      },
      removeResizeListener: function removeResizeListener() {
        window.removeEventListener('resize', this.resizeHandler);
        this._once.onresize = false;
      },
      addWatchToProps: function addWatchToProps() {
        var _this3 = this;

        var watchedVariable = this._watchers.map(function (watcher) {
          return watcher.expression;
        });
        Object.keys(this.$props).forEach(function (prop) {
          if (!~watchedVariable.indexOf(prop) && !~STATIC_PROPS.indexOf(prop)) {
            var opts = {};
            if (~['[object Object]', '[object Array]'].indexOf(getType(_this3.$props[prop]))) {
              opts.deep = true;
            }
            _this3.$watch(prop, function () {
              _this3.changeHandler();
            }, opts);
          }
        });
      },
      createEventProxy: function createEventProxy() {
        var _this4 = this;

        // 只要用户使用 on 方法绑定的事件都做一层代理，
        // 是否真正执行相应的事件方法取决于该方法是否仍然存在 events 中
        // 实现 events 的动态响应
        var self = this;
        var keys = Object.keys(this.events || {});
        keys.length && keys.forEach(function (ev) {
          if (_this4.registeredEvents.indexOf(ev) === -1) {
            _this4.registeredEvents.push(ev);
            _this4.echarts.on(ev, function (ev) {
              return function () {
                if (ev in self.events) {
                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }

                  self.events[ev].apply(null, args);
                }
              };
            }(ev));
          }
        });
      },
      themeChange: function themeChange(theme) {
        this.clean();
        this.echarts = null;
        this.init();
      },
      clean: function clean() {
        if (this.resizeable) this.removeResizeListener();
        this.echarts.dispose();
      }
    },

    created: function created() {
      this.echarts = null;
      this.registeredEvents = [];
      this._once = {};
      this._store = {};
      this.resizeHandler = debounce(this.resize, this.resizeDelay);
      this.changeHandler = debounce(this.dataHandler, this.changeDelay);
      this.addWatchToProps();
    },
    mounted: function mounted() {
      this.init();
    },
    beforeDestroy: function beforeDestroy() {
      this.clean();
    },


    _numerify: numerify
  };

  var index = _extends({}, Core, {
    name: 'VeScatter',
    data: function data() {
      this.chartHandler = scatter$1;
      return {};
    }
  });

  return index;

})));
