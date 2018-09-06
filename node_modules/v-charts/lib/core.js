'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var utilsLite = require('utils-lite');
var echartsLib = _interopDefault(require('echarts/lib/echarts'));
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
var numerify = _interopDefault(require('numerify'));
var constants = require('./constants');

var Loading = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "v-charts-component-loading" }, [_c('div', { staticClass: "loader" }, [_c('div', { staticClass: "loading-spinner" }, [_c('svg', { staticClass: "circular", attrs: { "viewBox": "25 25 50 50" } }, [_c('circle', { staticClass: "path", attrs: { "cx": "50", "cy": "50", "r": "20", "fill": "none" } })])])])]);
  }, staticRenderFns: []
};

var DataEmpty = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "v-charts-data-empty" }, [_vm._v(" 暂无数据 ")]);
  }, staticRenderFns: []
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

function setExtend (options, extend) {
  Object.keys(extend).forEach(function (attr) {
    var value = extend[attr];
    if (~attr.indexOf('.')) {
      // eg: a.b.c a.1.b
      utilsLite.set(options, attr, value);
    } else if (typeof value === 'function') {
      // get callback value
      options[attr] = value(options[attr]);
    } else {
      // mixin extend value
      if (utilsLite.isArray(options[attr]) && utilsLite.isObject(options[attr][0])) {
        // eg: [{ xx: 1 }, { xx: 2 }]
        options[attr].forEach(function (option, index) {
          options[attr][index] = _extends({}, option, value);
        });
      } else if (utilsLite.isObject(options[attr])) {
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

var core = {
  render: function render(h) {
    return h('div', {
      class: [utilsLite.camelToKebab(this.$options.name || this.$options._componentTag)],
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
      return this.colors || this.theme && this.theme.color || constants.DEFAULT_COLORS;
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
      constants.ECHARTS_SETTINGS.forEach(function (setting) {
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
        if (utilsLite.isArray(series)) {
          series.forEach(function (item) {
            setMark(item, marks);
          });
        } else if (utilsLite.isObject(series)) {
          setMark(series, marks);
        }
      }
      // change inited echarts settings
      if (this.extend) setExtend(options, this.extend);
      if (this.afterConfig) options = this.afterConfig(options);
      var setOptionOpts = this.setOptionOpts;
      // map chart not merge
      if ((this.settings.bmap || this.settings.amap) && !utilsLite.isObject(setOptionOpts)) {
        setOptionOpts = false;
      }
      // exclude unchange options
      if (this.notSetUnchange && this.notSetUnchange.length) {
        this.notSetUnchange.forEach(function (item) {
          var value = options[item];
          if (value) {
            if (utilsLite.isEqual(value, _this._store[item])) {
              options[item] = undefined;
            } else {
              _this._store[item] = utilsLite.cloneDeep(value);
            }
          }
        });
        if (utilsLite.isObject(setOptionOpts)) {
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
      var themeName = this.themeName || this.theme || constants.DEFAULT_THEME;
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
        if (!~watchedVariable.indexOf(prop) && !~constants.STATIC_PROPS.indexOf(prop)) {
          var opts = {};
          if (~['[object Object]', '[object Array]'].indexOf(utilsLite.getType(_this3.$props[prop]))) {
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
    this.resizeHandler = utilsLite.debounce(this.resize, this.resizeDelay);
    this.changeHandler = utilsLite.debounce(this.dataHandler, this.changeDelay);
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

module.exports = core;
