(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path')) :
  typeof define === 'function' && define.amd ? define(['path'], factory) :
  (global.index = factory(global.path));
}(this, (function (path) { 'use strict';

path = 'default' in path ? path['default'] : path;

var index = function (context, ref) {
  if ( ref === void 0 ) ref = {};
  var useBuiltIns = ref.useBuiltIns;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;

  var presets = [
    env === 'test' ?
    [require('babel-preset-env').default, {
      targets: {
        node: 'current'
      }
    }] :
    [require('babel-preset-env').default, {
      useBuiltIns: useBuiltIns,
      modules: false,
      targets: {
        ie: 9,
        uglify: true
      }
    }],
    // vue jsx
    require.resolve('babel-preset-vue')
  ];

  var plugins = [
    // Polyfills the runtime needed for async/await and generators
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: !useBuiltIns,
      polyfill: !useBuiltIns,
      regenerator: true,
      // Resolve the Babel runtime relative to the config.
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }],
    [require('babel-plugin-transform-object-rest-spread'), {
      useBuiltIns: useBuiltIns
    }],
    // For dynamic import that you will use a lot in code-split
    require.resolve('babel-plugin-syntax-dynamic-import')
  ];

  return {
    presets: presets,
    plugins: plugins
  }
};

return index;

})));
