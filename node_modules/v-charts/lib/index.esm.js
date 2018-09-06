import echartsLib from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/funnel';
import 'echarts/lib/chart/radar';
import 'echarts/lib/chart/map';
import 'echarts/extension/bmap/bmap';
import 'echarts-amap';
import 'echarts/lib/chart/sankey';
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/chart/tree';

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

var HEAT_MAP_COLOR = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];

var HEAT_BMAP_COLOR = ['blue', 'blue', 'green', 'yellow', 'red'];

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

function extend(target, sub) {
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

extend(options, DEFAULT_OPTIONS);

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
  extend(options, opts);
};
numerify.reset = function () {
  extend(options, DEFAULT_OPTIONS);
};

numerify.register('percentage', numerifyPercent);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
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

function get$1(target, path, defaultValue) {
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

var $get = function $get(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send(null);
    xhr.onload = function () {
      resolve(JSON.parse(xhr.responseText));
    };
    xhr.onerror = function () {
      reject(JSON.parse(xhr.responseText));
    };
  });
};

var mapPromise = {};

var getMapJSON = function getMapJSON(_ref) {
  var position = _ref.position,
      positionJsonLink = _ref.positionJsonLink,
      beforeRegisterMapOnce = _ref.beforeRegisterMapOnce,
      mapURLProfix = _ref.mapURLProfix;

  var link = positionJsonLink || '' + mapURLProfix + position + '.json';
  if (!mapPromise[link]) {
    mapPromise[link] = $get(link).then(function (res) {
      if (beforeRegisterMapOnce) res = beforeRegisterMapOnce(res);
      return res;
    });
  }
  return mapPromise[link];
};

var bmapPromise = null;
var amapPromise = null;

var getBmap = function getBmap(key, v) {
  if (!bmapPromise) {
    bmapPromise = new Promise(function (resolve, reject) {
      var callbackName = 'bmap' + Date.now();
      window[callbackName] = resolve;
      var script = document.createElement('script');
      script.src = ['https://api.map.baidu.com/api?v=' + (v || '2.0'), 'ak=' + key, 'callback=' + callbackName].join('&');

      document.body.appendChild(script);
    });
  }
  return bmapPromise;
};

var getAmap = function getAmap(key, v) {
  if (!amapPromise) {
    amapPromise = new Promise(function (resolve, reject) {
      var callbackName = 'amap' + Date.now();
      window[callbackName] = resolve;
      var script = document.createElement('script');
      script.src = ['https://webapi.amap.com/maps?v=' + (v || '1.4.3'), 'key=' + key, 'callback=' + callbackName].join('&');

      document.body.appendChild(script);
    });
  }
  return amapPromise;
};

// default opacity of bar while dim-axis type is 'value'
var VALUE_AXIS_OPACITY = 0.5;

function getBarDimAxis(args) {
  var innerRows = args.innerRows,
      dimAxisName = args.dimAxisName,
      dimension = args.dimension,
      axisVisible = args.axisVisible,
      dimAxisType = args.dimAxisType,
      dims = args.dims;

  return dimension.map(function (item) {
    return {
      type: 'category',
      name: dimAxisName,
      nameLocation: 'middle',
      nameGap: 22,
      data: dimAxisType === 'value' ? getValueAxisData(dims) : innerRows.map(function (row) {
        return row[item];
      }),
      axisLabel: {
        formatter: function formatter(v) {
          return String(v);
        }
      },
      show: axisVisible
    };
  });
}

function getValueAxisData(dims) {
  var max = Math.max.apply(null, dims);
  var min = Math.min.apply(null, dims);
  var result = [];
  for (var i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
}

function getBarMeaAxis(args) {
  var meaAxisName = args.meaAxisName,
      meaAxisType = args.meaAxisType,
      axisVisible = args.axisVisible,
      digit = args.digit,
      scale = args.scale,
      min = args.min,
      max = args.max;

  var meaAxisBase = {
    type: 'value',
    axisTick: {
      show: false
    },
    show: axisVisible
  };
  var meaAxis = [];

  var _loop = function _loop(i) {
    if (meaAxisType[i]) {
      meaAxis[i] = _extends({}, meaAxisBase, {
        axisLabel: {
          formatter: function formatter(val) {
            return getFormated(val, meaAxisType[i], digit);
          }
        }
      });
    } else {
      meaAxis[i] = _extends({}, meaAxisBase);
    }
    meaAxis[i].name = meaAxisName[i] || '';
    meaAxis[i].scale = scale[i] || false;
    meaAxis[i].min = min[i] || null;
    meaAxis[i].max = max[i] || null;
  };

  for (var i = 0; i < 2; i++) {
    _loop(i);
  }

  return meaAxis;
}

function getBarTooltip(args) {
  var axisSite = args.axisSite,
      isHistogram = args.isHistogram,
      meaAxisType = args.meaAxisType,
      digit = args.digit,
      labelMap = args.labelMap;

  var secondAxis = isHistogram ? axisSite.right || [] : axisSite.top || [];
  if (labelMap) {
    secondAxis = secondAxis.map(function (item) {
      return labelMap[item] === undefined ? item : labelMap[item];
    });
  }
  return {
    trigger: 'axis',
    formatter: function formatter(items) {
      var tpl = [];
      tpl.push(items[0].name + '<br>');
      items.forEach(function (item) {
        var seriesName = item.seriesName;
        var type = ~secondAxis.indexOf(seriesName) ? meaAxisType[1] : meaAxisType[0];
        tpl.push(itemPoint(item.color));
        tpl.push(seriesName + ': ');
        tpl.push(getFormated(item.value, type, digit));
        tpl.push('<br>');
      });

      return tpl.join('');
    }
  };
}

function getValueData(seriesTemp, dims) {
  var max = Math.max.apply(null, dims);
  var min = Math.min.apply(null, dims);
  var result = [];
  for (var i = min; i <= max; i++) {
    var index = dims.indexOf(i);
    if (~index) {
      result.push(seriesTemp[index]);
    } else {
      result.push(null);
    }
  }
  return result;
}

function getBarSeries(args) {
  var innerRows = args.innerRows,
      metrics = args.metrics,
      stack = args.stack,
      axisSite = args.axisSite,
      isHistogram = args.isHistogram,
      labelMap = args.labelMap,
      itemStyle = args.itemStyle,
      label = args.label,
      _args$showLine = args.showLine,
      showLine = _args$showLine === undefined ? [] : _args$showLine,
      dimAxisType = args.dimAxisType,
      barGap = args.barGap,
      opacity = args.opacity,
      dims = args.dims;

  var series = [];
  var seriesTemp = {};
  var secondAxis = isHistogram ? axisSite.right || [] : axisSite.top || [];
  var secondDimAxisIndex = isHistogram ? 'yAxisIndex' : 'xAxisIndex';
  var stackMap = stack && getStackMap(stack);
  metrics.forEach(function (item) {
    seriesTemp[item] = [];
  });
  innerRows.forEach(function (row) {
    metrics.forEach(function (item) {
      seriesTemp[item].push(row[item]);
    });
  });
  series = Object.keys(seriesTemp).map(function (item, index) {
    var data = dimAxisType === 'value' ? getValueData(seriesTemp[item], dims) : seriesTemp[item];
    var seriesItem = defineProperty({
      name: labelMap[item] != null ? labelMap[item] : item,
      type: ~showLine.indexOf(item) ? 'line' : 'bar',
      data: data
    }, secondDimAxisIndex, ~secondAxis.indexOf(item) ? '1' : '0');

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item];

    if (label) seriesItem.label = label;
    if (itemStyle) seriesItem.itemStyle = itemStyle;

    var itemOpacity = opacity || get$1(seriesItem, 'itemStyle.normal.opacity');
    if (dimAxisType === 'value') {
      seriesItem.barGap = barGap;
      seriesItem.barCategoryGap = '1%';
      if (itemOpacity == null) itemOpacity = VALUE_AXIS_OPACITY;
    }

    if (itemOpacity != null) {
      set$1(seriesItem, 'itemStyle.normal.opacity', itemOpacity);
    }

    return seriesItem;
  });

  return series.length ? series : false;
}

function getLegend(args) {
  var metrics = args.metrics,
      labelMap = args.labelMap,
      legendName = args.legendName;

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

function getDims(rows, dimension) {
  return rows.map(function (row) {
    return row[dimension[0]];
  });
}

var bar = function bar(columns, rows, settings, extra) {
  var innerRows = cloneDeep(rows);
  var _settings$axisSite = settings.axisSite,
      axisSite = _settings$axisSite === undefined ? {} : _settings$axisSite,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? [columns[0]] : _settings$dimension,
      _settings$stack = settings.stack,
      stack = _settings$stack === undefined ? {} : _settings$stack,
      _settings$axisVisible = settings.axisVisible,
      axisVisible = _settings$axisVisible === undefined ? true : _settings$axisVisible,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$dataOrder = settings.dataOrder,
      dataOrder = _settings$dataOrder === undefined ? false : _settings$dataOrder,
      _settings$scale = settings.scale,
      scale = _settings$scale === undefined ? [false, false] : _settings$scale,
      _settings$min = settings.min,
      min = _settings$min === undefined ? [null, null] : _settings$min,
      _settings$max = settings.max,
      max = _settings$max === undefined ? [null, null] : _settings$max,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      label = settings.label,
      itemStyle = settings.itemStyle,
      showLine = settings.showLine,
      _settings$barGap = settings.barGap,
      barGap = _settings$barGap === undefined ? '-100%' : _settings$barGap,
      opacity = settings.opacity;
  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible;

  var metrics = columns.slice();
  if (axisSite.top && axisSite.bottom) {
    metrics = axisSite.top.concat(axisSite.bottom);
  } else if (axisSite.bottom && !axisSite.right) {
    metrics = axisSite.bottom;
  } else if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    metrics.splice(columns.indexOf(dimension[0]), 1);
  }
  var meaAxisType = settings.xAxisType || ['normal', 'normal'];
  var dimAxisType = settings.yAxisType || 'category';
  var meaAxisName = settings.xAxisName || [];
  var dimAxisName = settings.yAxisName || '';
  var isHistogram = false;

  if (dataOrder) {
    var _label = dataOrder.label,
        order = dataOrder.order;

    if (!_label || !order) {
      console.warn('Need to provide name and order parameters');
    } else {
      innerRows.sort(function (a, b) {
        if (order === 'desc') {
          return a[_label] - b[_label];
        } else {
          return b[_label] - a[_label];
        }
      });
    }
  }
  var dims = getDims(innerRows, dimension);

  var legend = legendVisible && getLegend({ metrics: metrics, labelMap: labelMap, legendName: legendName });
  var yAxis = getBarDimAxis({
    innerRows: innerRows,
    dimAxisName: dimAxisName,
    dimension: dimension,
    axisVisible: axisVisible,
    dimAxisType: dimAxisType,
    dims: dims
  });
  var xAxis = getBarMeaAxis({
    meaAxisName: meaAxisName,
    meaAxisType: meaAxisType,
    axisVisible: axisVisible,
    digit: digit,
    scale: scale,
    min: min,
    max: max
  });
  var series = getBarSeries({
    innerRows: innerRows,
    metrics: metrics,
    stack: stack,
    axisSite: axisSite,
    isHistogram: isHistogram,
    labelMap: labelMap,
    itemStyle: itemStyle,
    label: label,
    showLine: showLine,
    dimAxisType: dimAxisType,
    dimension: dimension,
    barGap: barGap,
    opacity: opacity,
    dims: dims
  });
  var tooltipParams = { axisSite: axisSite, isHistogram: isHistogram, meaAxisType: meaAxisType, digit: digit, labelMap: labelMap };
  var tooltip = tooltipVisible && getBarTooltip(tooltipParams);
  var options = { legend: legend, yAxis: yAxis, series: series, xAxis: xAxis, tooltip: tooltip };
  return options;
};

var histogram = function histogram(columns, rows, settings, status) {
  var innerRows = cloneDeep(rows);
  var _settings$axisSite2 = settings.axisSite,
      axisSite = _settings$axisSite2 === undefined ? {} : _settings$axisSite2,
      _settings$dimension2 = settings.dimension,
      dimension = _settings$dimension2 === undefined ? [columns[0]] : _settings$dimension2,
      _settings$stack2 = settings.stack,
      stack = _settings$stack2 === undefined ? {} : _settings$stack2,
      _settings$axisVisible2 = settings.axisVisible,
      axisVisible = _settings$axisVisible2 === undefined ? true : _settings$axisVisible2,
      _settings$digit2 = settings.digit,
      digit = _settings$digit2 === undefined ? 2 : _settings$digit2,
      _settings$dataOrder2 = settings.dataOrder,
      dataOrder = _settings$dataOrder2 === undefined ? false : _settings$dataOrder2,
      _settings$scale2 = settings.scale,
      scale = _settings$scale2 === undefined ? [false, false] : _settings$scale2,
      _settings$min2 = settings.min,
      min = _settings$min2 === undefined ? [null, null] : _settings$min2,
      _settings$max2 = settings.max,
      max = _settings$max2 === undefined ? [null, null] : _settings$max2,
      _settings$labelMap2 = settings.labelMap,
      labelMap = _settings$labelMap2 === undefined ? {} : _settings$labelMap2,
      _settings$legendName2 = settings.legendName,
      legendName = _settings$legendName2 === undefined ? {} : _settings$legendName2,
      label = settings.label,
      itemStyle = settings.itemStyle,
      showLine = settings.showLine,
      _settings$barGap2 = settings.barGap,
      barGap = _settings$barGap2 === undefined ? '-100%' : _settings$barGap2,
      opacity = settings.opacity;


  if (dataOrder) {
    var _label2 = dataOrder.label,
        order = dataOrder.order;

    if (!_label2 || !order) {
      console.warn('Need to provide name and order parameters');
    } else {
      innerRows.sort(function (a, b) {
        if (order === 'desc') {
          return a[_label2] - b[_label2];
        } else {
          return b[_label2] - a[_label2];
        }
      });
    }
  }

  var tooltipVisible = status.tooltipVisible,
      legendVisible = status.legendVisible;

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
  var meaAxisType = settings.yAxisType || ['normal', 'normal'];
  var dimAxisType = settings.xAxisType || 'category';
  var meaAxisName = settings.yAxisName || [];
  var dimAxisName = settings.xAxisName || '';
  var isHistogram = true;
  var dims = getDims(innerRows, dimension);

  var legend = legendVisible && getLegend({ metrics: metrics, labelMap: labelMap, legendName: legendName });
  var xAxis = getBarDimAxis({
    innerRows: innerRows,
    dimAxisName: dimAxisName,
    dimension: dimension,
    axisVisible: axisVisible,
    dimAxisType: dimAxisType,
    dims: dims
  });
  var yAxis = getBarMeaAxis({
    meaAxisName: meaAxisName,
    meaAxisType: meaAxisType,
    axisVisible: axisVisible,
    digit: digit,
    scale: scale,
    min: min,
    max: max
  });
  var series = getBarSeries({
    innerRows: innerRows,
    metrics: metrics,
    stack: stack,
    axisSite: axisSite,
    isHistogram: isHistogram,
    labelMap: labelMap,
    itemStyle: itemStyle,
    label: label,
    showLine: showLine,
    dimAxisType: dimAxisType,
    dimension: dimension,
    barGap: barGap,
    opacity: opacity,
    dims: dims
  });
  var tooltipParams = { axisSite: axisSite, isHistogram: isHistogram, meaAxisType: meaAxisType, digit: digit, labelMap: labelMap };
  var tooltip = tooltipVisible && getBarTooltip(tooltipParams);
  var options = { legend: legend, yAxis: yAxis, series: series, xAxis: xAxis, tooltip: tooltip };
  return options;
};

var Loading = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "v-charts-component-loading" }, [_c('div', { staticClass: "loader" }, [_c('div', { staticClass: "loading-spinner" }, [_c('svg', { staticClass: "circular", attrs: { "viewBox": "25 25 50 50" } }, [_c('circle', { staticClass: "path", attrs: { "cx": "50", "cy": "50", "r": "20", "fill": "none" } })])])])]);
  }, staticRenderFns: []
};

var DataEmpty = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "v-charts-data-empty" }, [_vm._v(" 暂无数据 ")]);
  }, staticRenderFns: []
};

function setExtend (options, extend) {
  Object.keys(extend).forEach(function (attr) {
    var value = extend[attr];
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

var VeBar = _extends({}, Core, {
  name: 'VeBar',
  data: function data() {
    this.chartHandler = bar;
    return {};
  }
});

var VeHistogram = _extends({}, Core, {
  name: 'VeHistogram',
  data: function data() {
    this.chartHandler = histogram;
    return {};
  }
});

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

function getLegend$1(args) {
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

  var legend = legendVisible && getLegend$1({ metrics: metrics, legendName: legendName, labelMap: labelMap });
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

var VeLine = _extends({}, Core, {
  name: 'VeLine',
  data: function data() {
    this.chartHandler = line;
    return {};
  }
});

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
            tpl.push(getFormated(item.value, dataType, digit));
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
      tpl.push(itemPoint(item.color));
      if (limitShowNum && item.name === '其他') {
        tpl.push('其他:');
        remainArr.forEach(function (_ref) {
          var name = _ref.name,
              value = _ref.value;

          var percent = getFormated(value / sum, 'percent');
          tpl.push('<br>' + name + ':');
          tpl.push(getFormated(value, dataType, digit));
          tpl.push('(' + percent + ')');
        });
      } else {
        tpl.push(item.name + ':');
        tpl.push(getFormated(item.value, dataType, digit));
        tpl.push('(' + item.percent + '%)');
      }
      return tpl.join(' ');
    }
  };
}

var pie = function pie(columns, rows, settings, extra, isRing) {
  var innerRows = cloneDeep(rows);
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
  return pie(columns, rows, settings, extra, true);
};

var VePie = _extends({}, Core, {
  name: 'VePie',
  data: function data() {
    this.chartHandler = pie;
    return {};
  }
});

var VeRing = _extends({}, Core, {
  name: 'VeRing',
  data: function data() {
    this.chartHandler = ring;
    return {};
  }
});

function getWaterfallTooltip(dataType, digit) {
  return {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: function formatter(items) {
      var item = items[1];
      return [item.name + '<br/>' + item.seriesName + ' :', '' + getFormated(item.value, dataType, digit)].join('');
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
        return getFormated(val, dataType, digit);
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
          return getFormated(item.value, dataType, digit);
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

var VeWaterfall = _extends({}, Core, {
  name: 'VeWaterfall',
  data: function data() {
    this.chartHandler = waterfall;
    return {};
  }
});

function getFunnelTooltip(dataType, digit) {
  return {
    trigger: 'item',
    formatter: function formatter(item) {
      var tpl = [];
      tpl.push(itemPoint(item.color));
      tpl.push(item.name + ': ' + getFormated(item.data.realValue, dataType, digit));
      return tpl.join('');
    }
  };
}

function getFunnelLegend(args) {
  var data = args.data,
      legendName = args.legendName;

  return {
    data: data,
    formatter: function formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

function getFunnelSeries(args) {
  var dimension = args.dimension,
      metrics = args.metrics,
      rows = args.rows,
      sequence = args.sequence,
      ascending = args.ascending,
      label = args.label,
      labelLine = args.labelLine,
      itemStyle = args.itemStyle,
      filterZero = args.filterZero,
      useDefaultOrder = args.useDefaultOrder;

  var series = { type: 'funnel' };
  var innerRows = rows.sort(function (a, b) {
    return sequence.indexOf(a[dimension]) - sequence.indexOf(b[dimension]);
  });

  if (filterZero) {
    innerRows = innerRows.filter(function (row) {
      return row[metrics];
    });
  }

  var falseFunnel = false;
  innerRows.some(function (row, index) {
    if (index && row[metrics] > innerRows[index - 1][metrics]) {
      falseFunnel = true;
      return true;
    }
  });

  var step = 100 / innerRows.length;

  if (falseFunnel && !useDefaultOrder) {
    series.data = innerRows.slice().reverse().map(function (row, index) {
      return {
        name: row[dimension],
        value: (index + 1) * step,
        realValue: row[metrics]
      };
    });
  } else {
    series.data = innerRows.map(function (row) {
      return {
        name: row[dimension],
        value: row[metrics],
        realValue: row[metrics]
      };
    });
  }

  if (ascending) series.sort = 'ascending';
  if (label) series.label = label;
  if (labelLine) series.labelLine = labelLine;
  if (itemStyle) series.itemStyle = itemStyle;
  return series;
}

var funnel = function funnel(outerColumns, outerRows, settings, extra) {
  var columns = outerColumns.slice();
  var rows = outerRows.slice();
  var _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? 'normal' : _settings$dataType,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$sequence = settings.sequence,
      sequence = _settings$sequence === undefined ? rows.map(function (row) {
    return row[dimension];
  }) : _settings$sequence,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      ascending = settings.ascending,
      label = settings.label,
      labelLine = settings.labelLine,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      itemStyle = settings.itemStyle,
      filterZero = settings.filterZero,
      useDefaultOrder = settings.useDefaultOrder;
  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible;

  var metrics = void 0;
  if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    var metricsTemp = columns.slice();
    metricsTemp.splice(columns.indexOf(dimension), 1);
    metrics = metricsTemp[0];
  }

  var tooltip = tooltipVisible && getFunnelTooltip(dataType, digit);
  var legend = legendVisible && getFunnelLegend({ data: sequence, legendName: legendName });
  var series = getFunnelSeries({
    dimension: dimension,
    metrics: metrics,
    rows: rows,
    sequence: sequence,
    ascending: ascending,
    label: label,
    labelLine: labelLine,
    itemStyle: itemStyle,
    filterZero: filterZero,
    useDefaultOrder: useDefaultOrder
  });
  var options = { tooltip: tooltip, legend: legend, series: series };
  return options;
};

var VeFunnel = _extends({}, Core, {
  name: 'VeFunnel',
  data: function data() {
    this.chartHandler = funnel;
    return {};
  }
});

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

function getRadarTooltip(dataType, radar, digit) {
  var typeTemp = [];
  var nameTemp = [];
  radar.indicator.map(function (item, index) {
    typeTemp[index] = dataType[item.name];
    nameTemp[index] = item.name;
  });
  return {
    formatter: function formatter(item) {
      var tpl = [];
      tpl.push(itemPoint(item.color));
      tpl.push(item.name + '<br />');
      item.data.value.forEach(function (val, index) {
        tpl.push(nameTemp[index] + ': ');
        tpl.push(getFormated(val, typeTemp[index], digit) + '<br />');
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
      radar = args.radar,
      label = args.label,
      itemStyle = args.itemStyle,
      lineStyle = args.lineStyle,
      labelMap = args.labelMap,
      areaStyle = args.areaStyle;

  var radarIndexObj = {};
  radar.indicator.forEach(function (item, index) {
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

var radar = function radar(columns, rows, settings, extra) {
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
  var radar = getRadarSetting(rows, metrics, labelMap);
  var tooltip = tooltipVisible && getRadarTooltip(dataType, radar, digit);
  var series = getRadarSeries({
    rows: rows,
    dimension: dimension,
    metrics: metrics,
    radar: radar,
    label: label,
    itemStyle: itemStyle,
    lineStyle: lineStyle,
    labelMap: labelMap,
    areaStyle: areaStyle
  });
  var options = { legend: legend, tooltip: tooltip, radar: radar, series: series };
  return options;
};

var VeRadar = _extends({}, Core, {
  name: 'VeRadar',
  data: function data() {
    this.chartHandler = radar;
    return {};
  }
});

var VeChart = _extends({}, Core, {
  name: 'VeChart',
  data: function data() {
    this.chartLib = {
      bar: bar,
      histogram: histogram,
      line: line,
      pie: pie,
      ring: ring,
      funnel: funnel,
      radar: radar,
      waterfall: waterfall
    };
    this.chartHandler = this.chartLib[this.settings.type];
    return {};
  }
});

function getTooltip(dataType, digit, dataStore, metrics, color, labelMap) {
  return {
    formatter: function formatter(item) {
      var tpl = [];
      tpl.push(item.name + '<br>');
      metrics.forEach(function (label, index) {
        var title = labelMap[label] != null ? labelMap[label] : label;
        tpl.push(itemPoint(color[index]) + ' ' + title + ' : ');
        if (dataStore[item.name]) {
          tpl.push(getFormated(dataStore[item.name][label], dataType[label], digit));
        } else {
          tpl.push('-');
        }
        tpl.push('<br>');
      });
      return tpl.join(' ');
    }
  };
}

function getSeries(args) {
  var position = args.position,
      selectData = args.selectData,
      dimension = args.dimension,
      metrics = args.metrics,
      rows = args.rows,
      label = args.label,
      itemStyle = args.itemStyle,
      selectedMode = args.selectedMode,
      roam = args.roam,
      center = args.center,
      aspectScale = args.aspectScale,
      boundingCoords = args.boundingCoords,
      zoom = args.zoom,
      labelMap = args.labelMap,
      scaleLimit = args.scaleLimit,
      mapGrid = args.mapGrid;

  var result = [];
  var mapBase = {
    type: 'map',
    mapType: position
  };

  metrics.forEach(function (itemName) {
    var itemResult = _extends({
      name: labelMap[itemName] != null ? labelMap[itemName] : itemName,
      data: [],
      selectedMode: selectedMode,
      roam: roam,
      center: center,
      aspectScale: aspectScale,
      boundingCoords: boundingCoords,
      zoom: zoom,
      scaleLimit: scaleLimit
    }, mapBase);

    if (mapGrid) {
      Object.keys(mapGrid).forEach(function (key) {
        itemResult[key] = mapGrid[key];
      });
    }

    setGeoLabel(itemStyle, itemResult, 'itemStyle');
    setGeoLabel(label, itemResult, 'label');

    rows.forEach(function (row) {
      itemResult.data.push({
        name: row[dimension],
        value: row[itemName],
        selected: selectData
      });
    });
    result.push(itemResult);
  });

  return result;
}

function setGeoLabel(value, target, label) {
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    target[label] = value;
  } else if (value) {
    target[label] = {
      normal: { show: true },
      emphasis: { show: true }
    };
  }
}

function getLegendMap(args) {
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

function registerMap(args, mapOrigin) {
  var _once = args._once,
      registerSign = args.registerSign,
      beforeRegisterMap = args.beforeRegisterMap,
      beforeRegisterMapOnce = args.beforeRegisterMapOnce,
      registerSignOnce = args.registerSignOnce,
      position = args.position,
      specialAreas = args.specialAreas;

  if (!_once[registerSign]) {
    if (beforeRegisterMap) mapOrigin = beforeRegisterMap(mapOrigin);
    if (beforeRegisterMapOnce && !_once[registerSignOnce]) {
      _once[registerSignOnce] = true;
      mapOrigin = beforeRegisterMapOnce(mapOrigin);
    }
    _once[registerSign] = true;
    echartsLib.registerMap(position, mapOrigin, specialAreas);
  }
}

var map = function map(columns, rows, settings, extra) {
  var _settings$position = settings.position,
      position = _settings$position === undefined ? 'china' : _settings$position,
      _settings$selectData = settings.selectData,
      selectData = _settings$selectData === undefined ? false : _settings$selectData,
      selectedMode = settings.selectedMode,
      _settings$label = settings.label,
      label = _settings$label === undefined ? true : _settings$label,
      _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? {} : _settings$dataType,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      roam = settings.roam,
      center = settings.center,
      aspectScale = settings.aspectScale,
      boundingCoords = settings.boundingCoords,
      zoom = settings.zoom,
      scaleLimit = settings.scaleLimit,
      _settings$legendName = settings.legendName,
      legendName = _settings$legendName === undefined ? {} : _settings$legendName,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      mapGrid = settings.mapGrid,
      itemStyle = settings.itemStyle,
      positionJsonLink = settings.positionJsonLink,
      beforeRegisterMap = settings.beforeRegisterMap,
      beforeRegisterMapOnce = settings.beforeRegisterMapOnce,
      _settings$mapURLProfi = settings.mapURLProfix,
      mapURLProfix = _settings$mapURLProfi === undefined ? 'https://unpkg.com/echarts@3.6.2/map/json/' : _settings$mapURLProfi,
      _settings$specialArea = settings.specialAreas,
      specialAreas = _settings$specialArea === undefined ? {} : _settings$specialArea;

  var mapOrigin = settings.mapOrigin;
  var metrics = columns.slice();
  if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    metrics.splice(columns.indexOf(dimension), 1);
  }
  var tooltipVisible = extra.tooltipVisible,
      legendVisible = extra.legendVisible,
      color = extra.color,
      _once = extra._once;

  var dataStore = {};
  rows.forEach(function (row) {
    dataStore[row[dimension]] = row;
  });
  var tooltip = tooltipVisible && getTooltip(dataType, digit, dataStore, metrics, color, labelMap);
  var legend = legendVisible && getLegendMap({ metrics: metrics, legendName: legendName, labelMap: labelMap });
  var seriesParams = {
    position: position,
    selectData: selectData,
    label: label,
    itemStyle: itemStyle,
    dimension: dimension,
    metrics: metrics,
    rows: rows,
    selectedMode: selectedMode,
    roam: roam,
    center: center,
    aspectScale: aspectScale,
    boundingCoords: boundingCoords,
    zoom: zoom,
    labelMap: labelMap,
    scaleLimit: scaleLimit,
    mapGrid: mapGrid
  };
  var series = getSeries(seriesParams);
  var registerOptions = {
    _once: _once,
    beforeRegisterMap: beforeRegisterMap,
    beforeRegisterMapOnce: beforeRegisterMapOnce,
    registerSign: 'MAP_REGISTER_' + position,
    registerSignOnce: 'ONCE_MAP_REGISTER_' + position,
    position: position,
    specialAreas: specialAreas
  };
  if (mapOrigin) {
    registerMap(registerOptions, mapOrigin);
    return { series: series, tooltip: tooltip, legend: legend };
  } else {
    return getMapJSON({
      position: position,
      positionJsonLink: positionJsonLink,
      beforeRegisterMapOnce: beforeRegisterMapOnce,
      mapURLProfix: mapURLProfix
    }).then(function (json) {
      registerMap(registerOptions, json);
      return { series: series, tooltip: tooltip, legend: legend };
    });
  }
};

var VeMap = _extends({}, Core, {
  name: 'VeMap',
  data: function data() {
    this.chartHandler = map;
    return {};
  }
});

var bmap = function bmap(_, __, settings, extra) {
  var key = settings.key,
      v = settings.v,
      bmap = settings.bmap,
      useOuterMap = settings.useOuterMap;
  var _once = extra._once;

  var registerSign = 'bmap_register';
  if (!key && !useOuterMap) console.warn('settings.key must be a string.');
  if (_once[registerSign]) return {};
  _once[registerSign] = true;
  if (useOuterMap) return { bmap: bmap };
  return getBmap(key, v).then(function (_) {
    return { bmap: bmap };
  });
};

var VeBmap = _extends({}, Core, {
  name: 'VeBmap',
  data: function data() {
    this.chartHandler = bmap;
    return {};
  }
});

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
  return getAmap(key, v).then(function (_) {
    return { amap: amap };
  });
};

var VeAmap = _extends({}, Core, {
  name: 'VeAmap',
  data: function data() {
    this.chartHandler = amap;
    return {};
  }
});

function getTooltip$1(args) {
  var itemDataType = args.itemDataType,
      linksDataType = args.linksDataType,
      digit = args.digit;

  return {
    trigger: 'item',
    formatter: function formatter(item) {
      var tpl = [];
      var name = item.name,
          data = item.data,
          value = item.value,
          color = item.color;

      tpl.push(itemPoint(color));
      tpl.push(name + ' : ');
      if (data && data.source) {
        tpl.push(getFormated(value, linksDataType, digit) + '<br />');
      } else {
        tpl.push(getFormated(value, itemDataType, digit) + '<br />');
      }
      return tpl.join('');
    }
  };
}

function getSeries$1(args) {
  var rows = args.rows,
      dimension = args.dimension,
      metrics = args.metrics,
      links = args.links,
      valueFull = args.valueFull,
      useDataValue = args.useDataValue,
      label = args.label,
      itemStyle = args.itemStyle,
      lineStyle = args.lineStyle;

  var dataMap = {};
  var seriesData = rows.map(function (row) {
    dataMap[row[dimension]] = row[metrics];
    return { name: row[dimension], value: row[metrics] };
  });
  var innerLinks = null;
  if (useDataValue) {
    innerLinks = links.map(function (link) {
      return _extends({}, link, { value: dataMap[link.target] });
    });
  } else if (!valueFull) {
    innerLinks = links.map(function (link) {
      return link.value == null ? _extends({}, link, { value: dataMap[link.target] }) : link;
    });
  } else {
    innerLinks = links;
  }

  var result = {
    type: 'sankey',
    data: seriesData,
    links: innerLinks
  };
  if (label) result.label = label;
  if (itemStyle) result.itemStyle = itemStyle;
  if (lineStyle) result.lineStyle = lineStyle;
  return [result];
}

var sankey = function sankey(columns, rows, settings, extra) {
  var links = settings.links,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? columns[1] : _settings$metrics,
      _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? ['normal', 'normal'] : _settings$dataType,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$valueFull = settings.valueFull,
      valueFull = _settings$valueFull === undefined ? false : _settings$valueFull,
      _settings$useDataValu = settings.useDataValue,
      useDataValue = _settings$useDataValu === undefined ? false : _settings$useDataValu,
      label = settings.label,
      itemStyle = settings.itemStyle,
      lineStyle = settings.lineStyle;


  if (!links) {
    console.warn('links is needed in settings!');
    return;
  }

  var itemDataType = dataType[0];
  var linksDataType = dataType[1];
  var tooltip = getTooltip$1({
    itemDataType: itemDataType,
    linksDataType: linksDataType,
    digit: digit
  });
  var series = getSeries$1({
    rows: rows,
    dimension: dimension,
    metrics: metrics,
    links: links,
    valueFull: valueFull,
    useDataValue: useDataValue,
    label: label,
    itemStyle: itemStyle,
    lineStyle: lineStyle
  });
  return { tooltip: tooltip, series: series };
};

var VeSankey = _extends({}, Core, {
  name: 'VeSankey',
  data: function data() {
    this.chartHandler = sankey;
    return {};
  }
});

function getAxisList(rows, label) {
  var result = [];
  rows.forEach(function (row) {
    if (!~result.indexOf(row[label])) result.push(row[label]);
  });
  return result;
}

function getData(args) {
  var rows = args.rows,
      innerXAxisList = args.innerXAxisList,
      innerYAxisList = args.innerYAxisList,
      xDim = args.xDim,
      yDim = args.yDim,
      metrics = args.metrics,
      type = args.type,
      extraMetrics = args.extraMetrics;

  var result = null;
  if (type === 'cartesian') {
    result = rows.map(function (row) {
      var xIndex = innerXAxisList.indexOf(row[xDim]);
      var yIndex = innerYAxisList.indexOf(row[yDim]);
      var value = metrics ? row[metrics] : 1;
      var extraData = extraMetrics.map(function (m) {
        return row[m] || '-';
      });
      return { value: [xIndex, yIndex, value].concat(extraData) };
    });
  } else {
    result = rows.map(function (row) {
      var value = metrics ? row[metrics] : 1;
      return { value: [row[xDim], row[yDim], value] };
    });
  }
  return result;
}

function getAxis(list, name) {
  return {
    type: 'category',
    data: list,
    name: name,
    nameLocation: 'end',
    splitArea: { show: true }
  };
}

function getVisualMap(args) {
  var min = args.innerMin,
      max = args.innerMax,
      type = args.type,
      heatColor = args.heatColor,
      series = args.series;

  var result = {
    min: min,
    max: max,
    calculable: true
  };
  var extra = null;
  if (type === 'map') {
    extra = {
      orient: 'vertical',
      left: 0,
      bottom: 0,
      inRange: { color: heatColor || HEAT_MAP_COLOR }
    };
    if (!series[0].data.length) extra.show = false;
  } else if (type === 'bmap' || type === 'amap') {
    extra = {
      show: false,
      orient: 'vertical',
      left: 0,
      bottom: 0,
      inRange: { color: heatColor || HEAT_BMAP_COLOR }
    };
  } else {
    extra = {
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      dimension: 2,
      inRange: heatColor && { color: heatColor }
    };
  }

  return _extends(result, extra);
}

function getSeries$2(args) {
  var chartData = args.chartData;

  return [{
    type: 'heatmap',
    data: chartData
  }];
}

function getTooltip$2(args) {
  var dataType = args.dataType,
      innerXAxisList = args.innerXAxisList,
      innerYAxisList = args.innerYAxisList,
      digit = args.digit,
      extraMetrics = args.extraMetrics,
      metrics = args.metrics;


  return {
    trigger: 'item',
    formatter: function formatter(_ref) {
      var color = _ref.color,
          _ref$data$value = toArray(_ref.data.value),
          xDim = _ref$data$value[0],
          yDim = _ref$data$value[1],
          value = _ref$data$value[2],
          extraData = _ref$data$value.slice(3);

      var tpl = [];
      tpl.push(innerXAxisList[xDim] + ' ~ ' + innerYAxisList[yDim] + '<br>');
      extraMetrics.forEach(function (m, index) {
        tpl.push(m + ': ' + extraData[index] + '<br>');
      });
      tpl.push(itemPoint(color) + ' ' + metrics + ': ' + getFormated(value, dataType, digit) + '<br>');
      return tpl.join('');
    }
  };
}

var heatmap = function heatmap(columns, rows, settings, status) {
  var _settings$type = settings.type,
      type = _settings$type === undefined ? 'cartesian' : _settings$type,
      xAxisList = settings.xAxisList,
      yAxisList = settings.yAxisList,
      _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? [columns[0], columns[1]] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? columns[2] : _settings$metrics,
      _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? 'normal' : _settings$dataType,
      min = settings.min,
      max = settings.max,
      digit = settings.digit,
      bmap = settings.bmap,
      amap = settings.amap,
      geo = settings.geo,
      key = settings.key,
      _settings$v = settings.v,
      v = _settings$v === undefined ? '2.0' : _settings$v,
      position = settings.position,
      positionJsonLink = settings.positionJsonLink,
      beforeRegisterMap = settings.beforeRegisterMap,
      _settings$pointSize = settings.pointSize,
      pointSize = _settings$pointSize === undefined ? 10 : _settings$pointSize,
      _settings$blurSize = settings.blurSize,
      blurSize = _settings$blurSize === undefined ? 5 : _settings$blurSize,
      heatColor = settings.heatColor,
      yAxisName = settings.yAxisName,
      xAxisName = settings.xAxisName,
      beforeRegisterMapOnce = settings.beforeRegisterMapOnce,
      _settings$mapURLProfi = settings.mapURLProfix,
      mapURLProfix = _settings$mapURLProfi === undefined ? 'https://unpkg.com/echarts@3.6.2/map/json/' : _settings$mapURLProfi,
      _settings$specialArea = settings.specialAreas,
      specialAreas = _settings$specialArea === undefined ? {} : _settings$specialArea;
  var tooltipVisible = status.tooltipVisible;

  var innerXAxisList = xAxisList;
  var innerYAxisList = yAxisList;
  var chartData = [];
  // add extraMetrics prop for data which only display in tooltip
  var extraMetrics = [];
  var mainColumn = dimension.concat([metrics]);
  columns.forEach(function (column) {
    if (!~mainColumn.indexOf(column)) extraMetrics.push(column);
  });

  if (type === 'cartesian') {
    if (!innerXAxisList || !innerXAxisList.length) {
      innerXAxisList = getAxisList(rows, dimension[0]);
    }
    if (!innerYAxisList || !innerYAxisList.length) {
      innerYAxisList = getAxisList(rows, dimension[1]);
    }
    chartData = getData({
      rows: rows,
      innerXAxisList: innerXAxisList,
      innerYAxisList: innerYAxisList,
      xDim: dimension[0],
      yDim: dimension[1],
      metrics: metrics,
      type: type,
      extraMetrics: extraMetrics
    });
  } else {
    chartData = getData({
      rows: rows,
      xDim: dimension[0],
      yDim: dimension[1],
      metrics: metrics,
      type: type,
      extraMetrics: extraMetrics
    });
  }
  var metricsList = metrics ? rows.map(function (row) {
    return row[metrics];
  }) : [0, 5];
  if (!metricsList.length) metricsList = [0];
  var innerMin = min || Math.min.apply(null, metricsList);
  var innerMax = max || Math.max.apply(null, metricsList);

  var xAxis = getAxis(innerXAxisList, xAxisName);
  var yAxis = getAxis(innerYAxisList, yAxisName);
  var series = getSeries$2({ chartData: chartData });
  var visualMap = getVisualMap({ innerMin: innerMin, innerMax: innerMax, type: type, heatColor: heatColor, series: series });
  var tooltip = tooltipVisible && getTooltip$2({
    dataType: dataType,
    innerXAxisList: innerXAxisList,
    innerYAxisList: innerYAxisList,
    digit: digit,
    extraMetrics: extraMetrics,
    metrics: metrics
  });

  var options = { visualMap: visualMap, series: series };
  if (type === 'bmap') {
    _extends(options.series[0], { coordinateSystem: 'bmap', pointSize: pointSize, blurSize: blurSize });

    return getBmap(key, v).then(function (_) {
      return _extends({ bmap: bmap }, options);
    });
  } else if (type === 'map') {
    options.series[0].coordinateSystem = 'geo';
    return getMapJSON({
      position: position,
      positionJsonLink: positionJsonLink,
      beforeRegisterMapOnce: beforeRegisterMapOnce,
      mapURLProfix: mapURLProfix
    }).then(function (json) {
      var geoAttr = _extends({ map: position }, geo);
      if (beforeRegisterMap) json = beforeRegisterMap(json);
      echartsLib.registerMap(position, json, specialAreas);
      return _extends({ geo: geoAttr }, options);
    });
  } else if (type === 'amap') {
    _extends(options.series[0], { coordinateSystem: 'amap', pointSize: pointSize, blurSize: blurSize });

    return getAmap(key, v).then(function (_) {
      return _extends({ amap: amap }, options);
    });
  } else {
    return _extends({ xAxis: xAxis, yAxis: yAxis, tooltip: tooltip }, options);
  }
};

var VeHeatmap = _extends({}, Core, {
  name: 'VeHeatmap',
  data: function data() {
    this.chartHandler = heatmap;
    return {};
  }
});

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

var scatter = function scatter(columns, rows, settings, extra) {
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

var VeScatter = _extends({}, Core, {
  name: 'VeScatter',
  data: function data() {
    this.chartHandler = scatter;
    return {};
  }
});

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
        tpl.push(itemPoint(color) + ' ' + name + ': ');
        if (componentSubType === 'candlestick') {
          tpl.push('<br>');
          metrics.slice(0, 4).forEach(function (m, i) {
            var name = labelMap[m] != null ? labelMap[m] : m;
            var val = getFormated(data[i + 1], dataType, digit);
            tpl.push('- ' + name + ': ' + val + '<br>');
          });
        } else if (componentSubType === 'line') {
          var val = getFormated(data, dataType, digit);
          tpl.push(val + '<br>');
        } else if (componentSubType === 'bar') {
          var _val = getFormated(data[1], dataType, digit);
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
    return getFormated(val, dataType, digit);
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


  var isLiteData = isArray(rows[0]);
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
  var visualMap = showVol && getCandleVisualMap({ downColor: downColor, upColor: upColor, MA: MA, showMA: showMA });
  var dataZoom = showDataZoom && getCandleDataZoom({ start: start, end: end });
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
  return { legend: legend, tooltip: tooltip, visualMap: visualMap, grid: grid, xAxis: xAxis, yAxis: yAxis, dataZoom: dataZoom, series: series, axisPointer: axisPointer };
};

var VeCandle = _extends({}, Core, {
  name: 'VeCandle',
  data: function data() {
    this.chartHandler = candle;
    return {};
  }
});

function getTooltip$3(args) {
  var tooltipFormatter = args.tooltipFormatter,
      dataType = args.dataType,
      digit = args.digit;

  return {
    formatter: function formatter(options) {
      var seriesName = options.seriesName,
          _options$data = options.data,
          value = _options$data.value,
          name = _options$data.name;

      if (tooltipFormatter) {
        return tooltipFormatter.apply(null, arguments);
      }
      var tpl = [];
      tpl.push(seriesName + ': ');
      tpl.push(getFormated(value, dataType[seriesName], digit) + ' ' + name);
      return tpl.join('');
    }
  };
}

function getSeries$3(args) {
  var rows = args.rows,
      dimension = args.dimension,
      metrics = args.metrics,
      digit = args.digit,
      dataType = args.dataType,
      labelMap = args.labelMap,
      seriesMap = args.seriesMap,
      dataName = args.dataName;


  var series = rows.map(function (row) {
    var label = row[dimension];
    var seriesItem = seriesMap[label];
    var result = {
      type: 'gauge',
      name: labelMap[label] != null ? labelMap[label] : label,
      data: [{
        name: dataName[label] || '',
        value: row[metrics]
      }],
      detail: {
        formatter: function formatter(v) {
          return getFormated(v, dataType[label], digit);
        }
      },
      axisLabel: {
        formatter: function formatter(v) {
          return getFormated(v, dataType[label], digit);
        }
      }
    };

    if (seriesItem) {
      Object.keys(seriesItem).forEach(function (key) {
        if (isObject(result[key])) {
          _extends(result[key], seriesItem[key]);
        } else {
          result[key] = seriesItem[key];
        }
      });
    }

    return result;
  });

  return series;
}

var gauge = function gauge(columns, rows, settings, extra) {
  var _settings$dimension = settings.dimension,
      dimension = _settings$dimension === undefined ? columns[0] : _settings$dimension,
      _settings$metrics = settings.metrics,
      metrics = _settings$metrics === undefined ? columns[1] : _settings$metrics,
      _settings$digit = settings.digit,
      digit = _settings$digit === undefined ? 2 : _settings$digit,
      _settings$dataType = settings.dataType,
      dataType = _settings$dataType === undefined ? {} : _settings$dataType,
      _settings$labelMap = settings.labelMap,
      labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
      _settings$seriesMap = settings.seriesMap,
      seriesMap = _settings$seriesMap === undefined ? {} : _settings$seriesMap,
      _settings$dataName = settings.dataName,
      dataName = _settings$dataName === undefined ? {} : _settings$dataName;
  var tooltipFormatter = extra.tooltipFormatter,
      tooltipVisible = extra.tooltipVisible;


  var tooltip = tooltipVisible && getTooltip$3({
    tooltipFormatter: tooltipFormatter,
    dataType: dataType
  });

  var series = getSeries$3({
    rows: rows,
    dimension: dimension,
    metrics: metrics,
    digit: digit,
    dataType: dataType,
    labelMap: labelMap,
    seriesMap: seriesMap,
    dataName: dataName
  });
  return { tooltip: tooltip, series: series };
};

var VeGauge = _extends({}, Core, {
  name: 'VeGauge',
  data: function data() {
    this.chartHandler = gauge;
    return {};
  }
});

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
        if (isObject(result[key])) {
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

var tree = function tree(columns, rows, settings, extra) {
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

var VeTree = _extends({}, Core, {
  name: 'VeTree',
  data: function data() {
    this.chartHandler = tree;
    return {};
  }
});

var components = [VeBar, VeHistogram, VeLine, VePie, VeRing, VeWaterfall, VeFunnel, VeRadar, VeChart, VeMap, VeBmap, VeAmap, VeSankey, VeHeatmap, VeScatter, VeCandle, VeGauge, VeTree];

function install(Vue, _) {
  components.forEach(function (component) {
    Vue.component(component.name, component);
  });
}

export { VeBar, VeHistogram, VeRing, VeLine, VePie, VeWaterfall, VeFunnel, VeRadar, VeChart, VeMap, VeBmap, VeAmap, VeSankey, VeHeatmap, VeScatter, VeCandle, VeGauge, VeTree, install };
