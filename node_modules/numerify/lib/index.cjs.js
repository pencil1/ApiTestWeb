'use strict';

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

module.exports = numerify;
