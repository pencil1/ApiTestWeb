import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store/store'
import * as types from './store/types'
import Header from './projectManage/header.vue'
import caseManage from './projectManage/apiMessage/apiMsg.vue'

import manage from './projectManage/manage.vue'
import test from './projectManage/test/index.vue'
import modelManage from './projectManage/module/module.vue'

import projectManage from './projectManage/project/project.vue'
import reportManage from './projectManage/report/report.vue'
import reportShow from './projectManage/report/reportShow.vue'
import reportHeader from './projectManage/report/reportHeader.vue'
import buildInFunc from './projectManage/buildInFunc/buildInFunc.vue'
import sceneManage from './projectManage/caseManage/case.vue'
import testTool from './projectManage/testTool/testTool.vue'
import taskManage from './projectManage/taskManage/task.vue'

import sqlCheck from './projectManage/sqlCheck/sqlCheck.vue'
import user from './projectManage/userManage/user.vue'
import sceneConfig from './projectManage/config/config.vue'
import login from './login/login.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/manage',
        // component:caseManage,
        component: manage,

        children: [
            {
                path: '',
                // component:caseManage,
                // meta: {
                //     requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
                // },
                components: {
                    Header: Header,
                    Manage: projectManage,
                },
                meta: {
                    title: '首页入口'
                }
            }, {
                path: 'projectManage',
                // component:caseManage,
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: projectManage,
                }
            },
            {
                path: 'modelManage',
                // component:caseManage,

                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: modelManage,
                }
            },
            {
                path: 'sceneConfig',
                // component:caseManage,

                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: sceneConfig,
                }
            },
            {
                path: 'caseManage',
                meta: {
                    requireAuth: true,
                },
                // component:caseManage,
                components: {
                    Header: Header,
                    Manage: caseManage,
                }
            },

            {
                path: 'reportManage',
                meta: {
                    requireAuth: true,
                },
                // component:caseManage,
                components: {
                    Header: Header,
                    Manage: reportManage,
                },
            },
            {
                path: 'reportShow',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: reportHeader,
                    Manage: reportShow,
                }
            },
            {
                path: 'buildInFunc',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: buildInFunc,
                }
            },
            {
                path: 'sceneManage',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: sceneManage,
                }
            },
            {
                path: 'test',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Manage: test,
                }
            },
            {
                path: 'testTool',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: testTool,
                }
            },
            {
                path: 'userManage',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: user,
                }
            },
            {
                path: 'taskManage',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: taskManage,
                }
            },

            {
                path: 'sqlCheck',
                meta: {
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: sqlCheck,
                }
            },
        ],

    },
    {
        path: '/login',
        // component:caseManage,
        component: login,
    },
    {
        path: '',
        // component:caseManage,
        component: login,
    },

];

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.LOGIN, window.localStorage.getItem('token'))
    // store.commit(types.LOGIN, '1111')
}
if (window.localStorage.getItem('roles')) {
    store.commit(types.ROLES, window.localStorage.getItem('roles'));
    // store.commit(types.LOGIN, '1111')
}
if (window.localStorage.getItem('userName')) {
    store.commit(types.USERNAME, window.localStorage.getItem('userName'));
    // store.commit(types.LOGIN, '1111')
}


const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    }
    else {
        next();
    }
});

export default router;