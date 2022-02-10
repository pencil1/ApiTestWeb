import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'
import state from './state'
import axios from 'axios'
import api from '../util/api';
Vue.use(Vuex)

const store = new Vuex.Store({

  modules,
  getters,
  state,

  mutations: {
    setFuncAddress (state,payload) {
      // 变更状态
      state.funcAddress = payload
    },
    // setBaseData (state,payload) {
    //   // 变更状态
    //   state.baseData = payload.data
    //   state.userPros = payload.user_pros
    // },
  },
  actions: {
    async GET_FUNC_DATA({ commit }) {
      const res = await axios.post(api.findFuncFileApi,{'privates': false})
      commit('setFuncAddress', res.data.data)
    },
  }
})

export default store
