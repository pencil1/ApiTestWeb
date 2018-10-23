/**
 * Created by superman on 17/2/16.
 */
import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        userName: null,
        token: null,
        proModelData:[],
        projectName: '',
        configNameData:[],
        urlData:[],
        title: '',
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        [types.USERNAME]: (state, data) => {
            localStorage.userName = data;
            state.userName = data;
        },
        [types.PROJECTNAME]: (state, data) => {
            localStorage.projectName = data;
            state.projectName = data;
        },
        [types.PROMODELDATA]: (state, data) => {
            localStorage.proModelData = data;
            state.proModelData = data;
        },
        [types.CONFIGNAMEDATA]: (state, data) => {
            localStorage.configData = data;
            state.configData = data;
        },
        [types.URLDATA]: (state, data) => {
            localStorage.urlData = data;
            state.urlData = data;
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token');
            state.token = null
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        },
    }
})