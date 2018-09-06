var bps = {
  regexp: /BPS/,
  format: function format(value, formatType, roundingFunction, numerify) {
    var space = ~formatType.indexOf(' BPS') ? ' ' : '';
    value = value * 10000;
    formatType = formatType.replace(/\s?BPS/, '');
    var output = numerify._numberToFormat(value, formatType, roundingFunction);

    if (!output.indexOf(')')) {
      output = output.split('');
      output.splice(-1, 0, space + 'BPS');
      output = output.join('');
    } else {
      output = output + space + 'BPS';
    }

    return output;
  }
};

export default bps;
