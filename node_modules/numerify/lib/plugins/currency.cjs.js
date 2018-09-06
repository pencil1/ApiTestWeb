'use strict';

function insert(string, subString, start) {
  return string.slice(0, start) + subString + string.slice(start);
}

var currency = {
  regexp: /\$/,
  format: function format(value, formatType, roundingFunction, numerify) {
    var symbols = {
      before: formatType.match(/^([+|\-|(|\s|$]*)/)[0],
      after: formatType.match(/([+|\-|)|\s|$]*)$/)[0]
    };
    var symbol = void 0;
    formatType = formatType.replace(/\s?\$\s?/, '');
    var output = numerify._numberToFormat(value, formatType, roundingFunction);
    if (value >= 0) {
      symbols.before = symbols.before.replace(/[-(]/, '');
      symbols.after = symbols.after.replace(/[-)]/, '');
    } else if (value < 0 && !~symbols.before.indexOf('-') && !~symbols.before.indexOf('(')) {
      symbols.before = '-' + symbols.before;
    }
    for (var i = 0; i < symbols.before.length; i++) {
      symbol = symbols.before[i];

      switch (symbol) {
        case '$':
          output = insert(output, '$', i);
          break;
        case ' ':
          output = insert(output, ' ', i);
          break;
      }
    }

    for (var _i = symbols.after.length - 1; _i >= 0; _i--) {
      symbol = symbols.after[_i];

      switch (symbol) {
        case '$':
          output = _i === symbols.after.length - 1 ? output + '$' : insert(output, '$', -(symbols.after.length - (1 + _i)));
          break;
        case ' ':
          output = _i === symbols.after.length - 1 ? output + ' ' : insert(output, ' ', -(symbols.after.length - (1 + _i)));
          break;
      }
    }
    return output;
  }
};

module.exports = currency;
