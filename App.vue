<template>
    <div id="app">
        <el-container>
            <el-aside width="260px" style="height: 920px" >
                <vue-scrollbar classes="my-scrollbar" ref="Scrollbar">
                    <el-menu
                            background-color="#545c64"
                            text-color="#fff"
                            active-text-color="#ffd04b"
                            :router="true">

                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>项目管理</span>
                            </template>

                            <el-menu-item-group>
                                <el-menu-item index="/manage/projectManage" >项目</el-menu-item>
                                <el-menu-item index="/modelManage">模块</el-menu-item>
                                <el-menu-item index="/caseManage">用例</el-menu-item>
                                <el-menu-item index="/sceneManage">业务集</el-menu-item>
                                <el-menu-item index="/reportManage">报告</el-menu-item>
                                <el-menu-item index="/buildInFunc">函数</el-menu-item>
                                <el-menu-item index="/test">测试</el-menu-item>

                            </el-menu-item-group>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>用例管理</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="/caseManage">用例</el-menu-item>
                                <el-menu-item index="/test">测试</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                    </el-menu>
                </vue-scrollbar>
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
                    <router-view class="view two" name="Manage"></router-view>
                </el-main>

                <!--<el-footer style="height: 30px;">-->
                <!--<span class="demonstration">author</span>-->
                <!--</el-footer>-->
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import VueScrollbar from 'vue2-scrollbar';

    require("vue2-scrollbar/dist/style/vue2-scrollbar.css");
    require("vue2-scrollbar/dist/style/app.css");
    export default {
        components: {VueScrollbar},
        name: 'allActive',
        data() {
            return {
            }
        },
        methods: {

        },
        mounted() {
        },
    }
</script>

<style scoped>
    .el-menu {
            border-right: solid 0px #e6e6e6;
    }

    .el-header {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        line-height: 60px;
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
    .el-main {
        color: #333;
        text-align: left;
        line-height: 36px;
    }

</style>
