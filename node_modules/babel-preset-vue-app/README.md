# babel-preset-vue-app

[![NPM version](https://img.shields.io/npm/v/babel-preset-vue-app.svg?style=flat)](https://npmjs.com/package/babel-preset-vue-app) [![NPM downloads](https://img.shields.io/npm/dm/babel-preset-vue-app.svg?style=flat)](https://npmjs.com/package/babel-preset-vue-app)

## Features

- Latest ECMAScript features (babel-preset-env)
- Object rest spread and dynamic import
- Transform Vue JSX
- Transform `generator` and `async/await`

## Install

```bash
yarn add babel-preset-vue-app --dev
```

## Usage

```js
// .babelrc
{
  "presets": ["vue-app"]
}
```

## Options

### useBuiltIns

Type: `boolean`<br>
Default: `false`

Disable runtime transform. i.e. do not add helpers and polyfill for unsupported features of target environment, eg: `Object.assign`, `Promise`

As we're using `babel-plugin-transform-runtime` to polyfill your code without polluting globals, something like `"foobar".includes("foo")` will not work since that would require modification of existing builtins. See [babel-plugin-transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime).

### targets

Type: `object`<br>
Default: `{ node: 'current' }` when `env` is `test` or `{ ie: 9, uglify: true }` otherwise.

Takes an object of environment versions to support.

As we're using `babel-preset-env` to determine the Babel plugins and polyfills you need, this option lets you adjust your supported environments. See `targets` in [babel-preset-env](https://github.com/babel/babel-preset-env).

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

MIT.
