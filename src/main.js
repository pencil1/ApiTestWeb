import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import line from 'v-charts/lib/line.common';
import pie from 'v-charts/lib/pie.common';
import ring from 'v-charts/lib/ring.common';
import api from './util/api';
import base from './util/common';
import axios from './util/axiosConfig';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import registerComponents from '@/components'
import './assets/icon/iconfont.js';
import './assets/icon/iconfont.css';
import './assets/css/index.scss';
import 'element-ui/lib/theme-chalk/index.css'
import aceEditor from './util/ace-editor'
// let aceEditor = require('./util/ace-editorr')
// Vue.use(aceEditor);
Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
// 注册全局组件
registerComponents(Vue)
Vue.component('aceEditor', aceEditor);
Vue.component(line.name, line);
Vue.component(pie.name, pie);
Vue.component(ring.name, ring);

Vue.use(contentmenu);
Vue.use(ElementUI);
Vue.use(base);
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
