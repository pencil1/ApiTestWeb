import Vue from 'vue';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.js';
import './assets/icon/iconfont.css';
import './assets/css/index.scss';
import App from './App.vue';
import axios from './util/axiosConfig';
import router from './router-config';
import store from './store/index';
import pie from 'v-charts/lib/pie.common';
import contentmenu from 'v-contextmenu';
import 'v-contextmenu/dist/index.css';
import histogram from 'v-charts/lib/histogram.common';
import ring from 'v-charts/lib/ring.common';
import line from 'v-charts/lib/line.common';
import base from './util/base';
import api from './util/api';

// import "babel-polyfill";
// require('../node_modules/codemirror/lib/codemirror.js')
// require('../node_modules/codemirror/mode/xml/xml.js')
// require('../node_modules/codemirror/mode/javascript/javascript.js')
// require('../node_modules/codemirror/mode/css/css.js')
// require('../node_modules/codemirror/mode/htmlmixed/htmlmixed.js')
// require('../node_modules/codemirror/mode/markdown/markdown.js')
// require('../node_modules/codemirror/addon/mode/overlay.js')
// require('../node_modules/codemirror/mode/gfm/gfm.js')
// require('../node_modules/marked/lib/marked.js')
// require('../node_modules/kity/dist/kity.js')
// require('../node_modules/hotbox/hotbox.js')
// require('../node_modules/kityminder-core/dist/kityminder.core.js')
require('./components/testCaseEdit/script/expose-editor.js');

export const eventBus = new Vue();
Vue.prototype.$eventBus = eventBus;
Vue.config.debug = true;
Vue.config.productionTip = true;
Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.component(pie.name, pie);
Vue.component(histogram.name, histogram);
Vue.component(ring.name, ring);
Vue.component(line.name, line);
// Vue.component('codemirror', VueCodeMirror.codemirror);
// Vue.component('codemirror', codemirror);

// Vue.use(VueCodeMirror)
Vue.use(base);
Vue.use(ElementUI);
Vue.use(contentmenu);
// Vue.use(VueResource);
// Vue.use(VueClipboard);
new Vue({
    router,
    store,

    el: '#app',
    render: h => h(App)
}).$mount('#app');
