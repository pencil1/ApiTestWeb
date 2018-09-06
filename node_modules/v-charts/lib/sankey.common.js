'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utils = require('./utils');
var constants = require('./constants');
require('echarts/lib/chart/sankey');
var Core = _interopDefault(require('./core'));

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

function getTooltip(args) {
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

      tpl.push(constants.itemPoint(color));
      tpl.push(name + ' : ');
      if (data && data.source) {
        tpl.push(utils.getFormated(value, linksDataType, digit) + '<br />');
      } else {
        tpl.push(utils.getFormated(value, itemDataType, digit) + '<br />');
      }
      return tpl.join('');
    }
  };
}

function getSeries(args) {
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

var sankey$1 = function sankey$$1(columns, rows, settings, extra) {
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
  var tooltip = getTooltip({
    itemDataType: itemDataType,
    linksDataType: linksDataType,
    digit: digit
  });
  var series = getSeries({
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

var index = _extends({}, Core, {
  name: 'VeSankey',
  data: function data() {
    this.chartHandler = sankey$1;
    return {};
  }
});

module.exports = index;
