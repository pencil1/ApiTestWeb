// import members from '@/utils/user'

export default {
  namespaced: true,
  state: {
    userInfo: {'userName':'asd'},
    asideStatus:false,
  },
  mutations: {
    SET_USER(state, payload) {
      state.userInfo = payload
    },
    SET_COLLAPSE(state, n) {
      state.asideStatus = n
    },
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

