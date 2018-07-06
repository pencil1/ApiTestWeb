
var Vue = require('vue');
var App = require('./components/app.vue');

Vue.config.debug = true;
Vue.config.devTools = true;

new Vue({
  el: 'body',
  components: { App: App }
});
