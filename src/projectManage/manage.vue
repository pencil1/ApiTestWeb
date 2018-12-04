<template>

    <div id="manage">
        <el-container>

            <el-aside width="auto" style="min-height: 937px">
                <!--<div style="margin: 0 0 40px;line-height: 30px;">-->
                    <!--测试平台-->
                <!--</div>-->
                <div class="menu-toggle" @click.prevent="collapse">
                    <i class="my-icon-xiangzuo-copy" v-show="!collapsed"></i>
                    <i class="my-icon-xiangyou" v-show="collapsed"></i>
                </div>
                <el-scrollbar wrap-class="specialList">
                    <el-menu
                            :default-active="navigationName"
                            background-color="#545c64"
                            text-color="#fff"
                            active-text-color="#ffd04b"
                            :router="true"
                            :collapse="collapsed"
                            class="el-menu-vertical-demo" >

                        <!--<el-submenu index="1">-->
                            <!--<template slot="title">-->
                                <!--<i class="el-icon-menu"></i>-->
                                <!--<span>项目管理</span>-->
                            <!--</template>-->

                            <!--<el-menu-item-group>-->
                                <!--<el-menu-item index="/manage/projectManage">项目</el-menu-item>-->
                                <!--&lt;!&ndash;<el-menu-item index="/manage/test">测试</el-menu-item>&ndash;&gt;-->

                            <!--</el-menu-item-group>-->
                        <!--</el-submenu>-->
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-document"></i>
                                <span>接口管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/manage/projectManage">项目管理</el-menu-item>
                                <!--<el-menu-item index="/manage/modelManage">接口模块</el-menu-item>-->
                                <el-menu-item index="/manage/caseManage">接口信息</el-menu-item>
                                <el-menu-item index="/manage/sceneConfig">业务配置</el-menu-item>
                                <el-menu-item index="/manage/sceneManage">接口用例</el-menu-item>
                                <el-menu-item index="/manage/buildInFunc">内置函数</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-time"></i>
                                <span>报告管理</span>
                            </template>
                            <el-menu-item-group>
                                    <el-menu-item index="/manage/reportManage">测试报告</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group>
                                <el-menu-item index="/manage/taskManage">定时任务</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                        <el-submenu index="5">
                            <template slot="title">
                                <i class="el-icon-time"></i>
                                <span>其他程序</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/manage/testTool">小工具</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                        <el-submenu index="4" v-show="role === '2'">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span>系统管理</span>
                            </template>
                            <el-menu-item-group >
                                <el-menu-item index="/manage/userManage">用户管理</el-menu-item>


                                <!--<el-menu-item index="/manage/batch">批量添加</el-menu-item>-->
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </el-scrollbar>
            </el-aside>
            <el-container>
                <el-header style="height: 40px;">
                    <router-view class="view one" name="Header"></router-view>
                </el-header>

                <!--<el-header style="height: 40px;">-->
                <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
                <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
                <!--<el-breadcrumb-item>活动管理</el-breadcrumb-item>-->
                <!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
                <!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
                <!--</el-breadcrumb>-->
                <!--</el-header>-->

                <el-main>
                    <router-view class="view two" name="Manage" style="font-family: Arial"></router-view>
                </el-main>

                <!--<el-footer style="height: 30px;">-->
                <!--<span class="demonstration">author</span>-->
                <!--</el-footer>-->
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'manage',

        data() {
            return {
                navigationName:'/manage/projectManage',
                collapsed:false,
                role:'',
                userName:'',

            }
        },
        methods: {
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            closeNavigation(){
                this.role = this.$store.state.roles;
                this.userName = this.$store.state.userName;

                this.navigationName = this.$route.path;
                if(this.$route.path === '/manage/reportShow'){
                    this.collapsed = true;
                }
            }
        },
        watch: {
            "$route": function (to, from) {

                if (to.path === '/manage/reportShow'){
                    this.collapsed = true
                }
                //from 对象中包含当前地址
                //to 对象中包含目标地址
                //其实还有一个next参数的，这个参数是控制路由是否跳转的，如果没写，可以不用写next()来代表允许路由跳转，如果写了就必须写next(),否则路由是不会生效的。
            }
        },
        mounted() {
            this.closeNavigation()
        },
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
        height: 26px;
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
        background-color: #545c64;
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
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom:  10px;
    }
    .search-style{
        background-color:  #f5f5f5;
        padding-top: 10px;
    }
    .el-main {
        color: #333;
        text-align: left;
        line-height: 20px;
        padding:0 0 20px 0;

    }

    /*.el-tabs--top .el-tabs__item.is-top:nth-child(2){*/
        /*padding-left:5px;*/
    /*}*/
    .el-button--mini {
        padding: 5px 9px;
    }

    .el-dialog__body {
        padding: 5px 10px;
    }
    .el-tabs__header{
        margin: 0 ;
    }
    .row-bg {
        padding: 5px 0;
    }

    .el-breadcrumb {
        line-height: 3;
    }

    .el-dialog__header {
        padding: 2px 10px 2px;
        background-color:#f5f7fa;
    }

    .el-dialog__title {
        color: #6a6d71;
        font-size:15px;

    }
    .el-dialog__headerbtn{
        top:6px;
        right:15px;
    }
    .el-input--mini .el-input__inner{
        line-height:20px;
    }

    /*分页的基本样式*/
    .pagination{
        float: right;
        position: relative;
        margin-right: 40px
    }

    /**/
    .table_padding{
        padding-left: 10px;
        padding-right:5px;
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

    /*改变代码编辑器左边的行数宽度*/
    .CodeMirror-gutter {
        width: 40px;
    }
</style>
