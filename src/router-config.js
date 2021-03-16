import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import * as types from './store/types'
import manage from './components/projectView/manage.vue'
import Header from './components/projectView/header.vue'
import caseManage from './components/projectView/apiMessage/apiMsg.vue'

import projectManage from './components/projectView/project/project.vue'
import reportManage from './components/projectView/report/report.vue'
import reportShow from './components/projectView/report/reportShow.vue'
import reportHeader from './components/projectView/report/reportHeader.vue'
import buildInFunc from './components/projectView/buildInFunc/buildInFunc.vue'
import sceneManage from './components/projectView/caseManage/case.vue'
import testTool from './components/projectView/testTool/testTool.vue'
import taskManage from './components/projectView/taskManage/task.vue'
import user from './components/projectView/userManage/user.vue'
import sceneConfig from './components/projectView/config/config.vue'
// import testCaseEditor from './components/testCaseEdit/editor.vue'
import login from './components/login/login.vue'
import loading from './components/projectView/testTool/loading.vue'
import index from './components/index.vue'
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
                    Manage: index,
                },
                meta: {
                    title: '首页',
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
        component: login
    },
    {
        path: '',
        component: login
    },
    {
        path: '/loading',
        component: loading
    },

    // {
    //     path: '/testCaseEdit',
    //     component:  resolve=>(require(["@/components/testCaseEdit/editor.vue"],resolve))
    // },

];

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.LOGIN, window.localStorage.getItem('token'))
}
if (window.localStorage.getItem('roles')) {
    store.commit(types.ROLES, window.localStorage.getItem('roles'));
}
if (window.localStorage.getItem('userName')) {
    store.commit(types.USERNAME, window.localStorage.getItem('userName'));
}


const router = new VueRouter({
    // mode: 'history', //去掉路径中的#
    routes
});

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(r => r.meta.requireAuth)) {
//         if (store.state.token) {
//             next();
//         }
//         else {
//             next({
//                 path: '/login',
//                 query: {redirect: to.fullPath}
//             })
//         }
//     }
//     else {
//         next();
//     }
// });

export default router;