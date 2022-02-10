
export default {
  namespaced: true,
  state: {
    editShowStatus:false,

  },
  mutations: {
    SET_STATUS(state, n) {
      state.editShowStatus = n
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

