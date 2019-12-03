
import Vuex from 'vuex'
import Vue from 'vue'

import * as getters from './getters'
import {
    actions
} from './actions'
import {
    mutations
} from './mutations'
import {
    state
} from './state'

Vue.use(Vuex);
const store = new Vuex.Store({
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,


})

export default store