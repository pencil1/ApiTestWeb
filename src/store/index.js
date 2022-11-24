import Vue from 'vue'
import Vuex from 'vuex'
// import modules from './modules'
import getters from './getters'
import state from './state'
import axios from 'axios'
import api from '../util/api';

//module文件夹下太多文件，导入太麻烦，使用context实现模块化导入
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})
Vue.use(Vuex)


const store = new Vuex.Store({

    modules,
    getters,
    state,

    mutations: {
        setFuncAddress(state, payload) {
            // 变更状态
            state.funcAddress = payload
            // console.log(store.state.user.userInfo)
        },
        SET_ERROR_DATA(state, payload) {
            state.errorData = payload
            state.showErrorStatus = true
        },
        SET_RESULT_DATA(state, payload = null) {
            if (payload) {
                state.resultData = payload
            }
            state.showResultStatus = true
        },


        // setBaseData (state,payload) {
        //   // 变更状态
        //   state.baseData = payload.data
        //   state.userPros = payload.user_pros
        // },
    },
    actions: {
        async INIT_USER({commit}, token) {
            const res = await axios.post(api.loginSsoApi, {'token': token})
            if (res.data.code === 401) {
                window.open(store.state.platformsUrl, "_self");
            } else {
                store.state.user.userInfo = res.data
                let storage = window.localStorage
                storage.token = token
                storage.name = res.data.nickname
                storage.userId = res.data.id
                await store.dispatch('GET_FUNC_DATA')
            }
        },
        async GET_FUNC_DATA({commit}) {
            const res = await axios.post(api.findFuncFileApi, {'privates': false})
            commit('setFuncAddress', res.data.data)
        },


    }
})

export default store
