import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import App from './App.vue'
import axios from './util/axiosConfig'
import router from './router-config'
import store from './store/store'
// import VueClipboard from 'vue-clipboard2'
import pie from 'v-charts/lib/pie.common'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
import histogram from 'v-charts/lib/histogram.common'
import ring from 'v-charts/lib/ring.common'
// import './assets/styles/entirety.css'
import base from './util/base'
import api from './util/api'

Vue.config.productionTip = false;

Vue.prototype.$api = api;
Vue.prototype.$axios = axios;
Vue.component(pie.name, pie);
Vue.component(histogram.name, histogram);
Vue.component(ring.name, ring);
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
