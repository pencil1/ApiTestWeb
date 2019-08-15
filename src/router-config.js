import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store/store'
import * as types from './store/types'
import Header from './projectView/header.vue'
import caseManage from './projectView/apiMessage/apiMsg.vue'
import manage from './projectView/manage.vue'
import projectManage from './projectView/project/project.vue'
import reportManage from './projectView/report/report.vue'
import reportShow from './projectView/report/reportShow.vue'
import reportHeader from './projectView/report/reportHeader.vue'
import buildInFunc from './projectView/buildInFunc/buildInFunc.vue'
import sceneManage from './projectView/caseManage/case.vue'
import testTool from './projectView/testTool/testTool.vue'
import taskManage from './projectView/taskManage/task.vue'
import user from './projectView/userManage/user.vue'
import sceneConfig from './projectView/config/config.vue'
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
                    title: '首页入口',
                }
            }, {
                path: 'projectManage',
                // component:caseManage,
                meta: {
                    title: '项目管理',
                    requireAuth: true,
                     keepAlive: true
                },
                components: {
                    Header: Header,
                    Manage: projectManage,
                },


            },

            {
                path: 'sceneConfig',
                // component:caseManage,

                meta: {
                    title: '业务配置',
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
                    title: '接口信息',
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
                    title: '测试报告',
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
                    title: '内置函数',
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
                    title: '接口用例',
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: sceneManage,
                }
            },
            {
                path: 'testTool',
                meta: {
                    title: '工具页面',
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
                    title: '用户管理',
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
                    title: '定时任务',
                    requireAuth: true,
                },
                components: {
                    Header: Header,
                    Manage: taskManage,
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
    // mode: 'history', //去掉路径中的#
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