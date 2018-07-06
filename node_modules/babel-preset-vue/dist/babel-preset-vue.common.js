'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var VueJSX = _interopDefault(require('babel-plugin-transform-vue-jsx'));
var JsxEventModifiers = _interopDefault(require('babel-plugin-jsx-event-modifiers'));
var JsxVModel = _interopDefault(require('babel-plugin-jsx-v-model'));
var JsxVueFunctional = _interopDefault(require('babel-plugin-jsx-vue-functional'));

var index = {
  plugins: [
    JsxEventModifiers,
    JsxVModel,
    JsxVueFunctional,
    VueJSX
  ]
};

module.exports = index;
