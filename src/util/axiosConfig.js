import axios from 'axios'
import router from "../router";
import store from '../store'
import { mapMutations } from 'vuex'
// http response 拦截器（所有接收到的请求都要从这儿过一次）
axios.defaults.timeout = 60000;
axios.interceptors.response.use(
    response => {
    if(response.data['msg'] === '登录超时,请重新登录'){router.push({path: '/login'});}
    else if (response.data['msg'] === '服务器异常，请查看返回的error信息，无法处理则联系管理员'){
        store.commit('SET_ERROR_DATA',response.data['error'])
        // console.log(store.state.errorData)
    }
    return response
})

export default axios;

