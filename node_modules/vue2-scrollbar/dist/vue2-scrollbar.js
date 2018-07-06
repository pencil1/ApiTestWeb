/*!
 * Copyright (c) 2016 Naufal Rabbani (http://github.com/BosNaufal),
 * ,Licensed Under MIT (http://opensource.org/licenses/MIT),
 * ,
 * ,Vue 2 Scrollbar @ Version 0.0.2,
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Vue2Scrollbar"] = factory();
	else
		root["Vue2Scrollbar"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_scrollbar_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_scrollbar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_scrollbar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ec59f76_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vue_scrollbar_vue__ = __webpack_require__(9);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vue_scrollbar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ec59f76_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vue_scrollbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/js/components/vue-scrollbar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vue-scrollbar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ec59f76", Component.options)
  } else {
    hotAPI.reload("data-v-7ec59f76", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


exports.default = {

  props: {
    draggingFromParent: Boolean,
    scrolling: Number,
    wrapper: Object,
    area: Object,
    onChangePosition: Function,
    onDragging: Function,
    onStopDrag: Function
  },

  data: function data() {
    return {
      width: 0,
      dragging: false,
      start: 0
    };
  },


  watch: {
    'wrapper.width': function wrapperWidth(val, old) {
      this.calculateSize(this);
    },
    'area.width': function areaWidth(val, old) {
      this.calculateSize(this);
    }
  },

  methods: {
    startDrag: function startDrag(e) {

      e.preventDefault();
      e.stopPropagation();

      e = e.changedTouches ? e.changedTouches[0] : e;

      // Prepare To Drag
      this.dragging = true;
      this.start = e.clientX;
    },
    onDrag: function onDrag(e) {

      if (this.dragging) {

        // Make The Parent being in the Dragging State
        this.onDragging();

        e.preventDefault();
        e.stopPropagation();

        e = e.changedTouches ? e.changedTouches[0] : e;

        var xMovement = e.clientX - this.start;
        var xMovementPercentage = xMovement / this.wrapper.width * 100;

        // Update the last e.clientX
        this.start = e.clientX;

        // The next Horizontal Value will be
        var next = this.scrolling + xMovementPercentage;

        // Tell the parent to change the position
        this.onChangePosition(next, 'horizontal');
      }
    },
    stopDrag: function stopDrag(e) {
      if (this.dragging) {
        // Parent Should Change the Dragging State
        this.onStopDrag();
        this.dragging = false;
      }
    },
    jump: function jump(e) {

      var isContainer = e.target === this.$refs.container;

      if (isContainer) {

        // Get the Element Position
        var position = this.$refs.scrollbar.getBoundingClientRect();

        // Calculate the horizontal Movement
        var xMovement = e.clientX - position.left;
        var centerize = this.width / 2;
        var xMovementPercentage = xMovement / this.wrapper.width * 100 - centerize;

        // Update the last e.clientX
        this.start = e.clientX;

        // The next Horizontal Value will be
        var next = this.scrolling + xMovementPercentage;

        // Tell the parent to change the position
        this.onChangePosition(next, 'horizontal');
      }
    },
    calculateSize: function calculateSize(source) {
      // Scrollbar Width
      this.width = source.wrapper.width / source.area.width * 100;
    }
  },

  mounted: function mounted() {
    this.calculateSize(this);

    // Put the Listener
    document.addEventListener("mousemove", this.onDrag);
    document.addEventListener("touchmove", this.onDrag);
    document.addEventListener("mouseup", this.stopDrag);
    document.addEventListener("touchend", this.stopDrag);
  },
  beforeDestroy: function beforeDestroy() {
    // Remove the Listener
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("touchmove", this.onDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("touchend", this.stopDrag);
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


exports.default = {

  props: {
    draggingFromParent: Boolean,
    scrolling: Number,
    wrapper: Object,
    area: Object,
    onChangePosition: Function,
    onDragging: Function,
    onStopDrag: Function
  },

  data: function data() {
    return {
      height: 0,
      dragging: false,
      start: 0
    };
  },


  watch: {
    'wrapper.height': function wrapperHeight(val, old) {
      this.calculateSize(this);
    },
    'area.height': function areaHeight(val, old) {
      this.calculateSize(this);
    }
  },

  methods: {
    startDrag: function startDrag(e) {

      e.preventDefault();
      e.stopPropagation();

      e = e.changedTouches ? e.changedTouches[0] : e;

      // Prepare to drag
      this.dragging = true, this.start = e.clientY;
    },
    onDrag: function onDrag(e) {

      if (this.dragging) {

        // Make The Parent being in the Dragging State
        this.onDragging();

        e.preventDefault();
        e.stopPropagation();

        e = e.changedTouches ? e.changedTouches[0] : e;

        var yMovement = e.clientY - this.start;
        var yMovementPercentage = yMovement / this.wrapper.height * 100;

        // Update the last e.clientY
        this.start = e.clientY;

        // The next Vertical Value will be
        var next = this.scrolling + yMovementPercentage;

        // Tell the parent to change the position
        this.onChangePosition(next, 'vertical');
      }
    },
    stopDrag: function stopDrag(e) {
      if (this.dragging) {
        // Parent Should Change the Dragging State
        this.onStopDrag();
        this.dragging = false;
      }
    },
    jump: function jump(e) {

      var isContainer = e.target === this.$refs.container;

      if (isContainer) {

        // Get the Element Position
        var position = this.$refs.scrollbar.getBoundingClientRect();

        // Calculate the vertical Movement
        var yMovement = e.clientY - position.top;
        var centerize = this.height / 2;
        var yMovementPercentage = yMovement / this.wrapper.height * 100 - centerize;

        // Update the last e.clientY
        this.start = e.clientY;

        // The next Vertical Value will be
        var next = this.scrolling + yMovementPercentage;

        // Tell the parent to change the position
        this.onChangePosition(next, 'vertical');
      }
    },
    calculateSize: function calculateSize(source) {
      // Scrollbar Height
      this.height = source.wrapper.height / source.area.height * 100;
    },
    getSize: function getSize() {
      // The Elements
      var $scrollArea = this.$refs.container.parentElement;
      var $scrollWrapper = $scrollArea.parentElement;

      // Get new Elements Size
      var elementSize = {
        // Scroll Area Height and Width
        scrollAreaHeight: $scrollArea.children[0].clientHeight,
        scrollAreaWidth: $scrollArea.children[0].clientWidth,

        // Scroll Wrapper Height and Width
        scrollWrapperHeight: $scrollWrapper.clientHeight,
        scrollWrapperWidth: $scrollWrapper.clientWidth
      };
      return elementSize;
    }
  },

  mounted: function mounted() {
    this.calculateSize(this);

    // Put the Listener
    document.addEventListener("mousemove", this.onDrag);
    document.addEventListener("touchmove", this.onDrag);
    document.addEventListener("mouseup", this.stopDrag);
    document.addEventListener("touchend", this.stopDrag);
  },
  beforeDestroy: function beforeDestroy() {
    // Remove the Listener
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("touchmove", this.onDrag);
    document.removeEventListener("mouseup", this.stopDrag);
    document.removeEventListener("touchend", this.stopDrag);
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _verticalScrollbar = __webpack_require__(7);

var _verticalScrollbar2 = _interopRequireDefault(_verticalScrollbar);

var _horizontalScrollbar = __webpack_require__(6);

var _horizontalScrollbar2 = _interopRequireDefault(_horizontalScrollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


exports.default = {

  props: {
    classes: String,
    styles: Object,
    speed: {
      type: Number,
      default: 53
    },
    onMaxScroll: Function
  },

  components: {
    VerticalScrollbar: _verticalScrollbar2.default,
    HorizontalScrollbar: _horizontalScrollbar2.default
  },

  data: function data() {
    return {
      ready: false,
      top: 0,
      left: 0,
      scrollAreaHeight: null,
      scrollAreaWidth: null,
      scrollWrapperHeight: null,
      scrollWrapperWidth: null,
      vMovement: 0,
      hMovement: 0,
      dragging: false,
      start: { y: 0, x: 0 },
      allowBodyScroll: false
    };
  },


  methods: {
    scroll: function scroll(e) {
      var _this = this;

      // Make sure the content height is not changed
      this.calculateSize(function () {
        // Set the wheel step
        var num = _this.speed;

        // DOM events
        var shifted = e.shiftKey;
        var scrollY = e.deltaY > 0 ? num : -num;
        var scrollX = e.deltaX > 0 ? num : -num;

        // Fix Mozilla Shifted Wheel~
        if (shifted && e.deltaX == 0) scrollX = e.deltaY > 0 ? num : -num;

        // Next Value
        var nextY = _this.top + scrollY;
        var nextX = _this.left + scrollX;

        // Is it Scrollable?
        var canScrollY = _this.scrollAreaHeight > _this.scrollWrapperHeight;
        var canScrollX = _this.scrollAreaWidth > _this.scrollWrapperWidth;

        // Vertical Scrolling
        if (canScrollY && !shifted) _this.normalizeVertical(nextY);

        // Horizontal Scrolling
        if (shifted && canScrollX) _this.normalizeHorizontal(nextX);
      });

      // prevent Default only if scrolled content is not at the top/bottom
      if (!this.allowBodyScroll) {
        e.preventDefault();
        e.stopPropagation();
      }
    },


    // DRAG EVENT JUST FOR TOUCH DEVICE~
    startDrag: function startDrag(e) {
      var _this2 = this;

      this.touchEvent = e;

      var evt = e.changedTouches ? e.changedTouches[0] : e;

      // Make sure the content height is not changed
      this.calculateSize(function () {
        // Prepare to drag
        _this2.dragging = true, _this2.start = { y: evt.pageY, x: evt.pageX };
      });
    },
    onDrag: function onDrag(e) {
      if (this.dragging) {
        e.preventDefault();
        e.stopPropagation();

        // Prevent Click Event When it dragging
        if (this.touchEvent) {
          this.touchEvent.preventDefault();
          this.touchEvent.stopPropagation();
        }

        var evt = e.changedTouches ? e.changedTouches[0] : e;

        // Invers the Movement
        var yMovement = this.start.y - evt.clientY;
        var xMovement = this.start.x - evt.clientX;

        // Update the last e.client
        this.start = { y: evt.clientY, x: evt.clientX

          // The next Vertical Value will be
        };var nextY = this.top + yMovement;
        var nextX = this.left + xMovement;

        this.normalizeVertical(nextY);
        this.normalizeHorizontal(nextX);
      }
    },
    stopDrag: function stopDrag(e) {
      this.dragging = false;
      this.touchEvent = false;
    },
    scrollToY: function scrollToY(y) {
      this.normalizeVertical(y);
    },
    scrollToX: function scrollToX(x) {
      this.normalizeHorizontal(x);
    },
    normalizeVertical: function normalizeVertical(next) {
      var elementSize = this.getSize();

      // Vertical Scrolling
      var lowerEnd = elementSize.scrollAreaHeight - elementSize.scrollWrapperHeight;

      // Max Scroll Down
      var maxBottom = next > lowerEnd;
      if (maxBottom) next = lowerEnd;

      // Max Scroll Up
      var maxTop = next < 0;
      if (maxTop) next = 0;

      // Update the Vertical Value if it's needed
      var shouldScroll = this.top !== next;
      this.allowBodyScroll = !shouldScroll;
      if (shouldScroll) {
        this.top = next, this.vMovement = next / elementSize.scrollAreaHeight * 100;

        if (this.onMaxScroll && (maxTop || maxBottom)) {
          this.onMaxScroll({ top: maxTop, bottom: maxBottom, right: false, left: false });
        }
      }
    },
    normalizeHorizontal: function normalizeHorizontal(next) {
      var elementSize = this.getSize();

      // Horizontal Scrolling
      var rightEnd = elementSize.scrollAreaWidth - this.scrollWrapperWidth;

      // Max Scroll Right
      var maxRight = next > rightEnd;
      if (maxRight) next = rightEnd;

      // Max Scroll Left
      var maxLeft = next < 0;
      if (next < 0) next = 0;

      // Update the Horizontal Value
      var shouldScroll = this.left !== next;
      this.allowBodyScroll = !shouldScroll;
      if (shouldScroll) {
        this.left = next, this.hMovement = next / elementSize.scrollAreaWidth * 100;

        if (this.onMaxScroll && (maxRight || maxLeft)) {
          this.onMaxScroll({ right: maxRight, left: maxLeft, top: false, bottom: false });
        }
      }
    },
    handleChangePosition: function handleChangePosition(movement, orientation) {
      var _this3 = this;

      // Make sure the content height is not changed
      this.calculateSize(function () {
        // Convert Percentage to Pixel
        var next = movement / 100;
        if (orientation == 'vertical') _this3.normalizeVertical(next * _this3.scrollAreaHeight);
        if (orientation == 'horizontal') _this3.normalizeHorizontal(next * _this3.scrollAreaWidth);
      });
    },
    handleScrollbarDragging: function handleScrollbarDragging() {
      this.dragging = true;
    },
    handleScrollbarStopDrag: function handleScrollbarStopDrag() {
      this.dragging = false;
    },
    getSize: function getSize() {
      // The Elements
      var $scrollArea = this.$refs.scrollArea;
      var $scrollWrapper = this.$refs.scrollWrapper;

      // Get new Elements Size
      var elementSize = {
        // Scroll Area Height and Width
        scrollAreaHeight: $scrollArea.children[0].clientHeight,
        scrollAreaWidth: $scrollArea.children[0].clientWidth,

        // Scroll Wrapper Height and Width
        scrollWrapperHeight: $scrollWrapper.clientHeight,
        scrollWrapperWidth: $scrollWrapper.clientWidth
      };
      return elementSize;
    },
    calculateSize: function calculateSize(cb) {
      if (typeof cb !== 'function') cb = null;

      var elementSize = this.getSize();

      if (elementSize.scrollWrapperHeight !== this.scrollWrapperHeight || elementSize.scrollWrapperWidth !== this.scrollWrapperWidth || elementSize.scrollAreaHeight !== this.scrollAreaHeight || elementSize.scrollAreaWidth !== this.scrollAreaWidth) {

        // Scroll Area Height and Width
        this.scrollAreaHeight = elementSize.scrollAreaHeight, this.scrollAreaWidth = elementSize.scrollAreaWidth,

        // Scroll Wrapper Height and Width
        this.scrollWrapperHeight = elementSize.scrollWrapperHeight, this.scrollWrapperWidth = elementSize.scrollWrapperWidth,

        // Make sure The wrapper is Ready, then render the scrollbar
        this.ready = true;

        return cb ? cb() : false;
      } else return cb ? cb() : false;
    }
  },

  mounted: function mounted() {
    this.calculateSize();

    // Attach The Event for Responsive View~
    window.addEventListener('resize', this.calculateSize);
  },
  beforeDestroy: function beforeDestroy() {
    // Remove Event
    window.removeEventListener('resize', this.calculateSize);
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vueScrollbar = __webpack_require__(1);

var _vueScrollbar2 = _interopRequireDefault(_vueScrollbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _vueScrollbar2.default;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_horizontal_scrollbar_vue__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_horizontal_scrollbar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_horizontal_scrollbar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_03d7e587_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_horizontal_scrollbar_vue__ = __webpack_require__(8);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_horizontal_scrollbar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_03d7e587_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_horizontal_scrollbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/js/components/horizontal-scrollbar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] horizontal-scrollbar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-03d7e587", Component.options)
  } else {
    hotAPI.reload("data-v-03d7e587", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vertical_scrollbar_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vertical_scrollbar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vertical_scrollbar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9fd7644e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vertical_scrollbar_vue__ = __webpack_require__(10);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_vertical_scrollbar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9fd7644e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_vertical_scrollbar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/js/components/vertical-scrollbar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vertical-scrollbar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9fd7644e", Component.options)
  } else {
    hotAPI.reload("data-v-9fd7644e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.width < 100) ? _c('div', {
    ref: "container",
    staticClass: "vue-scrollbar__scrollbar-horizontal",
    on: {
      "click": _vm.jump
    }
  }, [_c('div', {
    ref: "scrollbar",
    class: 'scrollbar' + (_vm.dragging || _vm.draggingFromParent ? '' : ' vue-scrollbar-transition'),
    style: ({
      width: this.width + '%',
      left: this.scrolling + '%'
    }),
    on: {
      "touchstart": _vm.startDrag,
      "mousedown": _vm.startDrag
    }
  })]) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-03d7e587", esExports)
  }
}

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "scrollWrapper",
    class: 'vue-scrollbar__wrapper' + (this.classes ? ' ' + this.classes : ''),
    style: (this.styles),
    on: {
      "click": _vm.calculateSize
    }
  }, [_c('div', {
    ref: "scrollArea",
    class: 'vue-scrollbar__area' + (this.dragging ? ' ' : ' vue-scrollbar-transition'),
    style: ({
      marginTop: this.top * -1 + 'px',
      marginLeft: this.left * -1 + 'px'
    }),
    on: {
      "wheel": _vm.scroll,
      "touchstart": _vm.startDrag,
      "touchmove": _vm.onDrag,
      "touchend": _vm.stopDrag
    }
  }, [_vm._t("default"), _vm._v(" "), (_vm.ready) ? _c('vertical-scrollbar', {
    attrs: {
      "area": {
        height: _vm.scrollAreaHeight
      },
      "wrapper": {
        height: _vm.scrollWrapperHeight
      },
      "scrolling": _vm.vMovement,
      "dragging-from-parent": _vm.dragging,
      "on-change-position": _vm.handleChangePosition,
      "on-dragging": _vm.handleScrollbarDragging,
      "on-stop-drag": _vm.handleScrollbarStopDrag
    }
  }) : _vm._e(), _vm._v(" "), (_vm.ready) ? _c('horizontal-scrollbar', {
    attrs: {
      "area": {
        width: _vm.scrollAreaWidth
      },
      "wrapper": {
        width: _vm.scrollWrapperWidth
      },
      "scrolling": _vm.hMovement,
      "dragging-from-parent": _vm.dragging,
      "on-change-position": _vm.handleChangePosition,
      "on-dragging": _vm.handleScrollbarDragging,
      "on-stop-drag": _vm.handleScrollbarStopDrag
    }
  }) : _vm._e()], 2)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-7ec59f76", esExports)
  }
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.height < 100) ? _c('div', {
    ref: "container",
    staticClass: "vue-scrollbar__scrollbar-vertical",
    on: {
      "click": _vm.jump
    }
  }, [_c('div', {
    ref: "scrollbar",
    class: 'scrollbar' + (_vm.dragging || _vm.draggingFromParent ? '' : ' vue-scrollbar-transition'),
    style: ({
      height: _vm.height + '%',
      top: _vm.scrolling + '%'
    }),
    on: {
      "touchstart": _vm.startDrag,
      "mousedown": _vm.startDrag
    }
  })]) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-9fd7644e", esExports)
  }
}

/***/ })
/******/ ]);
});