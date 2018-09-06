'use strict';

var time = {
  regexp: /:/,
  format: function format(value, formatType, roundingFunction) {
    var hours = Math.floor(value / 60 / 60);
    var minutes = Math.floor((value - hours * 60 * 60) / 60);
    var seconds = Math.round(value - hours * 60 * 60 - minutes * 60);

    return [hours, minutes < 10 ? '0' + minutes : minutes, seconds < 10 ? '0' + seconds : seconds].join(':');
  }
};

module.exports = time;
