
import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    cacheStatus:true,
    cachedViews:[],
  },
  mutations: {
    SET_USER(state, payload) {
      state.userInfo = payload
    },
    SET_COLLAPSE(state, n) {
      state.asideStatus = n
    },
    SET_CACHED(state,n) {
      // state.cachedViews = n
      state.cachedViews.push(n)
    },
    DEL_CACHED(state,name) {
      let index = state.cachedViews.indexOf(name);
      state.cachedViews.splice(index, 1);
    },
    REFRESH(state,n){
      let index = state.cachedViews.indexOf(n);
      state.cachedViews.splice(index, 1);
      state.cacheStatus = false;

      Vue.nextTick(function () {
        state.cacheStatus = true;
        state.cachedViews.push(n);
      });
    }
  },
  actions: {
    // async GET_USER({ commit }) {
    //   members.getUser((res) => {
    //     commit('SET_USER', res)
    //     // console.log(res)
    //   })
    // }
  }
}

