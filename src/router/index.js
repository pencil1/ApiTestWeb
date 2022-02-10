import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
Vue.use(Router)
// import projectManage from '../views/base.vue'
const routes = [

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录页面',
    }
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: () => import('@/views/home'),
  //   meta: {
  //     title: '首页',
  //     active: '首页'
  //   }
  // },
  {
    path: '',
    redirect: '/home',
    component: () => import('../views/base.vue'),

    children: [
      {
        path: '/home',
        name: 'homePage',

        component: () => import('@/views/home'),
        meta: {
          title: '首页',
        }
      },
      {
        path: '/projectManage',
        name: 'project',
        component: () => import('@/views/projectManage'),
        meta: {
          title: '项目管理',
        }
      },
      {
        path: '/apiManage',
        name: 'apiManage',
        component: () => import('@/views/apiManage'),
        meta: {
          title: '接口信息',
        }
      },
      {
        path: '/sceneConfig',
        name: 'sceneConfig',
        component: () => import('@/views/sceneConfig'),
        meta: {
          title: '业务配置',
        }
      },
      {
        path: '/caseManage',
        name: 'caseManage',
        component: () => import('@/views/caseManage'),
        meta: {
          title: '接口用例',
        }
      },
      {
        path: '/buildInFunc',
        name: 'buildInFunc',
        component: () => import('@/views/buildInFunc'),
        meta: {
          title: '内置函数',
        }
      },
      {
        path: '/reportManage',
        name: 'reportManage',
        component: () => import('@/views/reportManage'),
        meta: {
          title: '测试报告',
        }
      },
      {
        path: '/taskManage',
        name: 'taskManage',
        component: () => import('@/views/taskManage'),
        meta: {
          title: '定时任务',
        }
      },
      {
        path: '/testTool',
        name: 'testTool',
        component: () => import('@/views/testTool'),
        meta: {
          title: '工具页面',
        }
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import('@/views/userManage'),
        meta: {
          title: '用户管理',
        }
      },
    ],

  },
  {
    path: '/reportShow',
    name: 'reportShow',
    meta: {
      title: '報告展示',
    },
    component: () => import('@/views/reportShow'),
  },
]

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
  store.getters.userInfo.token = window.localStorage.getItem('token')
}
if (window.localStorage.getItem('roles')) {
  store.getters.userInfo.roles = window.localStorage.getItem('roles')
}
if (window.localStorage.getItem('name')) {
  store.getters.userInfo.name = window.localStorage.getItem('name')
}

const router = new Router({
  routes: routes,
  // mode: 'history',
})

export default router
