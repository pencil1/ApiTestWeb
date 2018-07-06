# Vue 2  Scrollbar

The Simplest Scroll Area Component with custom scrollbar for [Vue 2](https://vuejs.or). It's based on [react-scrollbar](https://github.com/BosNaufal/react-scrollbar). All animation, Height and Width are pure CSS, So it's TOTALLY **CUSTOMIZABLE** and **RESPONSIVE**! YEAH!.

[DEMO](https://bosnaufal.github.io/vue2-scrollbar)

## Install
You can import [vue-scrollbar.vue](./src/js/components/vue-scrollbar.vue) to your vue component file like [this](./src/js/components/app.vue) and process it with your preprocessor.


You can install it via NPM
```bash
npm install vue2-scrollbar
```

Or Just put it after Vue JS~
```html
<script src="https://vuejs.org/js/vue.min.js"></script>
<script src="./dist/vue2-scrollbar.js"></script>
<script>
  // Don't Forget to register it
  new Vue({
    components: {
      scrollbar: Vue2Scrollbar
    }
  });
</script>
```


## Import Style
Don't forget to import vue 2 css. You can link it via html
```html
<link rel="stylesheet" href="vue2-scrollbar/dist/style/vue2-scrollbar.css">
```

Or You can import it using commonJS

```javascript
require('vue2-scrollbar/style/vue2-scrollbar.css')
```

Its style is very customizable. You can put any CSS over it. And You can add custom class via its prop.


## Import Module
```javascript
import ScrollBar from 'vue2-scrollbar'
// Or
var ScrollBar = require('vue2-scrollbar');
```


## Usage
```html

<template>
  <div>
    <vue-scrollbar classes="my-scrollbar" ref="Scrollbar">
      <div class="scroll-me">
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="clearfix"></div>
      </div>
    </vue-scrollbar>
  </div>
</template>

<script>

  import VueScrollbar from 'vue2-scrollbar';
  require("vue2-scrollbar/style/vue2-scrollbar.css")

  // It's required to set min height of the scrollbar wrapper
  require("./your/custom/style/app.css")

  export default {
    components: { VueScrollbar },
  };

</script>

```


## Props
##### clasess (String)
Just the ordinary class name for styling the wrapper. So, It's TOTALLY **CUSTOMIZABLE!**
```css
/*The Wrapper*/
.my-scrollbar{
  width: 35%;
  min-width: 300px;
  max-height: 450px;
}

/*The Content*/
.scroll-me{
  min-width: 750px;
}
```


##### style (Object)
If you prefer to use inline style to styling the scrollbar, you can pass the styling object to this props.

```javascript
this.styling = {

  /* Scrollbar */
  scrollbar: {
    width: "35%",
    minWidth: "300px",
    maxHeight: "450px"
  },

}
```

```html
<vue-scrollbar :style="styling.scrollbar"></vue-scrollbar>
```

##### speed (Number)
The wheel step in pixel. The default is 53 pixel per wheel.


##### onMaxScroll (type: Function, return: Object)
Applied when the scrollbar in the max vertical or max horizontal scrolling. Make a possibility to add some *load more* feature or infinite scroll
```javascript
// Examples
handleMaxScroll(direction) {
  console.log(direction);
}
```
```html
<vue-scrollbar :onMaxScroll="handleMaxScroll"></vue-scrollbar>
```



## Methods
You can do some methods by accessing the component via javascript.
```javascript
this.$refs.scrollbar.someMethod()
```

##### scrollToY(y)
To scroll the scrollbar to the Y
```javascript
// Examples
someMethod() {
  this.$refs.Scrollbar.scrollToY(100)
}
```

##### scrollToX(x)
To scroll the scrollbar to the X
```javascript
// Examples
someMethod() {
  this.$refs.Scrollbar.scrollToX(100)
}
```

## Thank You for Making this useful~

## Let's talk about some projects with me
Just Contact Me At:
- Email: [bosnaufalemail@gmail.com](mailto:bosnaufalemail@gmail.com)
- Skype Id: bosnaufal254
- twitter: [@BosNaufal](https://twitter.com/BosNaufal)

## License
[MIT](http://opensource.org/licenses/MIT)
Copyright (c) 2016 - forever Naufal Rabbani
