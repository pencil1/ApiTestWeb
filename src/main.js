import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/iconfont.css'
import App from './App.vue'
import axios from './util/axiosConfig'
import VueResource from 'vue-resource'
import router from './router-config'
import store from './store/store'
import VueClipboard from 'vue-clipboard2'
import pie from 'v-charts/lib/pie.common'
import histogram from 'v-charts/lib/histogram.common'
import ring from 'v-charts/lib/ring.common'


Vue.prototype.messageShow = function (_this, response) {
    if (response.data['status'] === 0) {
        _this.$message({
            showClose: true,
            message: response.data['msg'],
            type: 'warning',
        });
    }
    else {
        _this.$message({
            showClose: true,
            message: response.data['msg'],
            type: 'success',
        });
    }
};

Vue.prototype.sureView = function (func, arg) {
    // this.$alert('确认要删除吗?', '确认框', {
    //                 confirmButtonText: '确定',
    //                 callback: action => {
    //                     func(arg);
    //                 }
    //             });
    this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            func(arg);
        }).catch(() => {

        });
};

Vue.prototype.$axios = axios;
Vue.component(pie.name, pie);
Vue.component(histogram.name, histogram);
Vue.component(ring.name, ring);


Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(VueClipboard);
new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
});
