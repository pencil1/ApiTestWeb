'use strict';

var percent = {
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

module.exports = percent;
