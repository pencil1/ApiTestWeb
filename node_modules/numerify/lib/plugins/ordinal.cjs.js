'use strict';

function ordinal(number) {
  var b = number % 10;
  return ~~(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
}

var ordinal$1 = {
  regexp: /o/,
  format: function format(value, formatType, roundingFunction, numerify) {
    var ordinalStr = ~formatType.indexOf(' o') ? ' ' : '';
    formatType = formatType.replace(/\s?o/, '');

    ordinalStr += ordinal(value);

    var output = numerify._numberToFormat(value, formatType, roundingFunction);

    return output + ordinalStr;
  }
};

module.exports = ordinal$1;
