function numIsNaN(value) {
  return typeof value === 'number' && isNaN(value);
}

var exponential = {
  regexp: /(e\+|e-)/,
  format: function format(value, formatType, roundingFunction, numerify) {
    var exponential = typeof value === 'number' && !numIsNaN(value) ? value.toExponential() : '0e+0';
    var parts = exponential.split('e');
    formatType = formatType.replace(/e[+|-]{1}0/, '');
    var output = numerify._numberToFormat(+parts[0], formatType, roundingFunction);

    return output + 'e' + parts[1];
  }
};

export default exponential;
