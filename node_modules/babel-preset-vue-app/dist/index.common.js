'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));

var index = function (context, ref) {
  if ( ref === void 0 ) ref = {};
  var useBuiltIns = ref.useBuiltIns;
  var targets = ref.targets;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;

  if (typeof targets === 'undefined') {
    targets = env === 'test' ? { node: 'current' } : { ie: 9, uglify: true };
  }

  var presets = [
    env === 'test' ?
    [require('babel-preset-env').default, {
      useBuiltIns: useBuiltIns,
      targets: targets
    }] :
    [require('babel-preset-env').default, {
      useBuiltIns: useBuiltIns,
      targets: targets,
      modules: false
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

module.exports = index;
