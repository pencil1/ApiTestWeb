'use strict';

var DECIMAL = {
  base: 1000,
  suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
};
var BINARY = {
  base: 1024,
  suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
};

var bytes = {
  regexp: /[0\s]i?b/,
  format: function format(value, formatType, roundingFunction, numerify) {
    var output = void 0;
    var bytes = ~formatType.indexOf('ib') ? BINARY : DECIMAL;
    var suffix = ~formatType.indexOf(' b') || ~formatType.indexOf(' ib') ? ' ' : '';

    formatType = formatType.replace(/\s?i?b/, '');

    for (var power = 0; power <= bytes.suffixes.length; power++) {
      var min = Math.pow(bytes.base, power);
      var max = Math.pow(bytes.base, power + 1);

      if (value === null || value === 0 || value >= min && value < max) {
        suffix += bytes.suffixes[power];

        if (min > 0) value = value / min;

        break;
      }
    }

    output = numerify._numberToFormat(value, formatType, roundingFunction);

    return output + suffix;
  }
};

module.exports = bytes;
