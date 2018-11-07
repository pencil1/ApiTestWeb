<template>
    <div class="buildInFunc" style="padding: 10px 10px 10px 10px">
        <el-row>
            <el-col :span="7">
                <span>内置函数文档</span>
                <el-autocomplete
                        class="inline-input"
                        v-model="comparator"
                        :fetch-suggestions="querySearch"
                        placeholder="输入或选择文件"
                        size="small">

                </el-autocomplete>
                <el-button-group>
                    <el-button type="success" @click.native="findFunc()" size="small">读取</el-button>
                    <el-button type="primary" @click.native="createFunc()" size="small">创建</el-button>
                    <!--<el-button type="danger" @click.native="sureView(removeFunc)" size="small">删除</el-button>-->
                </el-button-group>
            </el-col>

            <el-col :span="7">
                <!--<el-form :inline="true">-->
                <!--<el-form-item label="函数" labelWidth="110px">-->
                <span>函数名</span>
                <el-input v-model="funcName" placeholder="输入格式：${func(abc,123)}" size="small" style="max-width:300px;">
                </el-input>
                <!--</el-form-item>-->

                <el-button type="success" @click.native="findFunc()" size="small">函数调试</el-button>
                <!--</el-form>-->

            </el-col>
            <el-col :span="3" style="padding-left:50px">
                <el-button-group>
                    <!--<el-tooltip content="检查语法" placement="top-start">-->
                    <!--<el-button type="primary" icon="el-icon-view" @click.native="checkFunc()" size="small"></el-button>-->
                    <!--</el-tooltip>-->
                    <el-tooltip content="重置文档" placement="top-start">
                        <el-button type="info"
                                   icon="el-icon-refresh"
                                   @click.native="findFunc()"
                                   size="small">

                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="保存文档" placement="top-start">
                        <el-button type="success" icon="el-icon-edit"
                                   @click.native="saveFunc()"
                                   size="small">

                        </el-button>
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <!--<div style="float: left;">-->
        <!---->
        <!--</div>-->


        <el-row>
            <el-col :span="16"
                    style="margin-top: 10px;border:2px solid rgb(234, 234, 234)">
                <codemirror v-model="funcData"
                            :options="options"
                            height="810px">
                </codemirror>
            </el-col>
            <el-col :span="8">
                <div style="padding-left: 20px">{{this.funcData}}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {codemirror} from 'vue-codemirror-lite'

    require('codemirror/mode/python/python');

    import 'codemirror/addon/scroll/simplescrollbars.js'
    import 'codemirror/addon/scroll/simplescrollbars.css'

    export default {
        components: {
            codemirror
        },
        name: 'buildInFunc',
        data() {
            return {
                options: {
                    mode: 'python',
                    tabSize: 4,
                    lineNumbers: true,
                    lineWrapping: true,
                    scrollbarStyle: 'simple',
                },
                funcName:'',
                funcData: '',
                comparator: '',
                comparators: [],
            }
        },
        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            findFunc() {
                this.$axios.post('/apiManage/apiManage/func/find', {'funcName': this.comparator}).then((response) => {
                        this.messageShow(this, response);
                        this.funcData = response['data']['func_data'];
                    }
                )
            },
            createFunc() {
                this.$axios.post('/apiManage/apiManage/func/create', {'funcName': this.comparator}).then((response) => {
                        this.messageShow(this, response);
                        this.getFuncAddress()
                    }
                )
            },
            removeFunc() {
                this.$axios.post('/apiManage/apiManage/func/remove', {'funcName': this.comparator}).then((response) => {
                        this.comparator = '';
                        this.messageShow(this, response);
                        this.getFuncAddress()
                    }
                )
            },
            getFuncAddress() {
                this.$axios.post('/apiManage/apiManage/func/getAddress').then((response) => {
                        this.comparators = response['data']['data'];
                    }
                )
            },
            checkFunc() {
                this.$axios.post('/apiManage/apiManage/func/check', {'funcName': this.comparator}).then((response) => {
                        this.messageShow(this, response);
                    }
                )
            },
            saveFunc() {
                this.$axios.post('/apiManage/apiManage/func/save', {
                    'funcData': this.funcData,
                    'funcName': this.comparator
                }).then((response) => {
                        this.messageShow(this, response);
                        this.checkFunc();
                    }
                )
            },
        },
        mounted() {

            this.getFuncAddress()
        },
    }
</script>

<style>

    .cm-s-default .cm-keyword {
        color: #ce22e6
    }

    .cm-s-default .cm-comment {
        color: #b5b5b5
    }

    .cm-s-default .cm-builtin {
        color: #409eff
    }


</style>
