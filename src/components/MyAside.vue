<template>

  <div id="manage">
    <!--      <el-container :class="{'hideSidebar':asideStatus}">-->
    <!--            <el-container class="hideSidebar">-->

    <el-aside width="auto" class="sidebar-container">
      <Logo/>
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
            :default-active="navigationName"
            :router="true"
            :collapse="asideStatus"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#66b1ff"
        >
          <el-submenu v-for="item in asideList" :key="item.num" :index="item.num" >
            <template slot="title">

              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="item in item.children" :key="item.num" :index="item.index">{{ item.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'manage',
  // components: {
  //     Logo
  // },
  computed: {
    ...mapGetters([
      'asideStatus',
      'userInfo',

    ])
  },
  data() {
    return {
      navigationName: '/home',
      asideList: [{
        name: '基础管理', num: '1', icon:'el-icon-menu',
        children: [
          {name: '项目管理', index: '/projectManage'},
        ]
      },{
        name: '接口管理', num: '2', icon:'el-icon-s-promotion',
        children: [
          // {name: '项目管理', index: '/projectManage'},
          {name: '接口信息', index: '/apiManage'},
          {name: '接口用例', index: '/caseManage'},
          {name: '业务配置', index: '/sceneConfig'},
          {name: '内置函数', index: '/buildInFunc'},
        ]
      },
        {
          name: '报告管理', num: '3', icon:'el-icon-document',
          children: [
            {name: '测试报告', index: '/reportManage'},
            {name: '定时任务', index: '/taskManage'},
          ]
        },
        {
          name: '其他程序', num: '4', icon:'el-icon-attract',
          children: [
            {name: '小工具', index: '/testTool'},
          ]
        },
        {
          name: '系统管理', num: '5',  icon:'el-icon-setting',
          children: [
            {name: '用户管理', index: '/userManage'},
          ]
        },
      ],
    }
  },
  methods: {
    initData(){
      this.navigationName = this.$route.fullPath;
      if(this.userInfo.name !== '管理员' ){
        this.asideList = this.asideList.filter(items => items.name !== '系统管理')
        // this.asideList.splice(4, 1);
      }
    }
  },
  watch: {
    "$route": function (to) {
      this.navigationName = to.path;
      // if (to.path === '/manage/reportShow') {
      //   // this.collapsed = true;
      //   // this.tagsShow = false;
      // }
      //from 对象中包含当前地址
      //to 对象中包含目标地址
      //其实还有一个next参数的，这个参数是控制路由是否跳转的，如果没写，可以不用写next()来代表允许路由跳转，如果写了就必须写next(),否则路由是不会生效的。
    }
  },
  mounted() {
  },
  created() {
    this.initData()
  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;

}

.menu-toggle {
  background: #434650;
  text-align: center;
  color: white;
  height: 30px;
  line-height: 30px;
}

.specialList {
  max-height: 948px;
}

.el-menu {
  border-right: solid 0px #e6e6e6;
}

.el-footer {
  background-color: #8db7ef;
  color: #333;
  text-align: left;
  line-height: 30px;
}

.el-aside {
  color: #333;
  text-align: left;
  line-height: 200px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

.search-style {
  background-color: #f5f5f5;
  padding-top: 10px;
}

.el-main {
  color: #333;
  text-align: left;
  line-height: 20px;
  padding: 0 0 10px 0;

}

/*.el-tabs--top .el-tabs__item.is-top:nth-child(2){*/
/*padding-left:5px;*/
/*}*/
.el-button--mini {
  padding: 5px 9px;
}


.el-tabs__header {
  margin: 0;
}

.row-bg {
  padding: 5px 0;
}

.el-breadcrumb {
  line-height: 3;
}

.el-dialog__header {
  padding: 2px 10px 2px;
  background-color: #f5f7fa;
  border-radius: 5px;
}

.el-dialog__body {
  padding: 5px 10px;
}

.el-dialog__title {
  color: #6a6d71;
  font-size: 15px;

}

.el-dialog__headerbtn {
  top: 6px;
  right: 15px;
}

.el-input--mini .el-input__inner {
  line-height: 20px;
}

/*分页的基本样式*/
.pagination {
  float: right;
  position: relative;
  margin-right: 40px
}

/**/
.table_padding {
  padding-left: 10px;
  padding-right: 5px;
}

/*改变el-table的默认滚动条样式*/
.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(69, 100, 160, 0.3);
  border-radius: 4px;
}

.ace_scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/*改变ace的默认滚动条样式*/
.ace_scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(138, 135, 135, 0.3);
  border-radius: 4px;
}

/*改变代码编辑器左边的行数宽度*/
.CodeMirror-gutter {
  width: 40px;
}

/* 改变下拉菜单的高度*/
.el-popper[x-placement^=bottom] {
  margin-top: 5px;
}

.el-textarea__inner {
  overflow-y: hidden;
}
</style>
