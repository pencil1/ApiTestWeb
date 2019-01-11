import axios from 'axios'
import router from "../router-config";
// http response 拦截器（所有接收到的请求都要从这儿过一次）

axios.interceptors.response.use(
    response => {
    if(response.data['msg'] === '登录超时,请重新登录'){router.push({path: '/login'});}
    return response
});

export default axios;

