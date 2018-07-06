# babel-preset-vue

Babel preset for all Vue plugins.

## Install

```bash
npm install -D babel-preset-vue
```

CDN: [UNPKG](https://unpkg.com/babel-preset-vue/)

## Usage

```js
{
  "presets": ["vue"]
}
```

#### Supports event modifiers.

Uses `babel-plugin-jsx-event-modifier` for event modifiers.

Example:
```js
Vue.component('hello-world', {
  methods: {
    method () {
      console.log('clicked')
    }
  },
  render () {
    return (
      <div>
        <a href="/" onClick:prevent={this.method} />
      </div>
    )
  }
})
```

More information available on [plugin's github page](https://github.com/nickmessing/babel-plugin-jsx-event-modifiers).

#### Supports functional components.

Uses `babel-plugin-jsx-vue-functional` for functional components.

Example:
```js
const A = ({ props }) => <h1>{props.msg}</h1>
const B = ({ listeners }) => (
  <div onClick={listeners.click}>
    <A msg="Hello World!">
  </div>
)
```

More information available on [plugin's github page](https://github.com/nickmessing/babel-plugin-jsx-vue-functional).

#### Supports v-model.

Uses `babel-plugin-jsx-v-model` for two-way data binding with form elements.

Example:
```js
Vue.component('hello-world', {
  data: () => ({
    text: 'Hello World!'
  }),
  render () {
    return (
      <div>
        <input type="text" v-model={this.text} />
        {this.text}
      </div>
    )
  }
})
```

More information available on [plugin's github page](https://github.com/nickmessing/babel-plugin-jsx-v-model).

## License

MIT &copy; [EGOIST](https://github.com/egoist)
