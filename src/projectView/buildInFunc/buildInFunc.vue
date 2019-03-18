<template>
    <div class="buildInFunc"  >

        <el-form :inline="true"  class="demo-form-inline search-style" size="small">
            <el-form-item label="函数文件"  labelWidth="80px">
                <el-autocomplete
                        style="margin-right: 2px"
                        class="inline-input"
                        v-model="comparator"
                        :fetch-suggestions="querySearch"
                        placeholder="输入或选择文件"
                        size="small">
                </el-autocomplete >
                <el-button-group>
                    <el-button type="success" @click.native="findFunc()" size="small">读取</el-button>
                    <el-button type="primary" @click.native="createFunc()" size="small">创建</el-button>
                    <!--<el-button type="danger" @click.native="sureView(removeFunc)" size="small">删除</el-button>-->
                </el-button-group>
            </el-form-item>

            <el-form-item label="函数名" labelWidth="80px" >
                <el-input v-model="funcName" placeholder="输入格式：${func(abc,123)}" size="small">
                </el-input>
                <!--</el-form-item>-->
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="checkFunc()" size="small">调试</el-button>
            </el-form-item>
            <el-form-item>
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
                    <el-button type="success" icon="el-icon-document"
                               @click.native="saveFunc()"
                               size="small">

                    </el-button>
                </el-tooltip>
            </el-button-group>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="16"
                    style="border:3px solid rgb(189, 189, 189)">
                <el-container>
                    <editor
                            style="font-size: 15px"
                            v-model="funcData"
                            @init="editorInit"
                            lang="python"
                            theme="monokai"
                            width="100%"
                            height="810px"
                            :options="{
                                 enableSnippets:true,
                                 enableBasicAutocompletion: true,
                                 enableLiveAutocompletion: true
                             }"
                    >
                    </editor>
                </el-container>
                <!--<codemirror v-model="funcData"-->
                <!--:options="options"-->
                <!--height="810px">-->
                <!--</codemirror>-->
            </el-col>
            <el-col :span="8" style="padding-left:10px;background-color: rgb(234, 234, 234);height:815px ">
                <div style="font-weight: 700;color: gray;font-size:14px;margin-top: 2px;">
                    测试结果：
                </div>
                <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{this.result}}
                </pre>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        components: {
            editor: require('vue2-ace-editor'),
        },
        name: 'buildInFunc',
        data() {
            return {
                funcName: '',
                funcData: '',
                comparator: '',
                comparators: [],
                result: '',
            }
        },
        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            findFunc() {
                this.$axios.post(this.$api.findFuncApi, {'funcName': this.comparator}).then((response) => {
                        this.messageShow(this, response);
                        this.funcData = response['data']['func_data'];
                    }
                )
            },
            createFunc() {
                this.$axios.post(this.$api.createFuncApi, {'funcName': this.comparator}).then((response) => {
                        if(this.messageShow(this, response)){
                            this.getFuncAddress()
                        }
                    }
                )
            },
            removeFunc() {
                this.$axios.post('/apiMessage/apiMessage/func/remove', {'funcName': this.comparator}).then((response) => {
                        this.comparator = '';
                        this.messageShow(this, response);
                        this.getFuncAddress()
                    }
                )
            },
            getFuncAddress() {
                this.$axios.post(this.$api.getFuncAddressApi).then((response) => {
                        this.comparators = response['data']['data'];
                    }
                )
            },
            checkFunc() {
                if (!this.comparator) {
                    this.$message({
                        showClose: true,
                        message: '请先选择函数文件',
                        type: 'warning',
                    });
                    return
                }
                if (!this.funcName) {
                    this.$message({
                        showClose: true,
                        message: '函数名不能为空',
                        type: 'warning',
                    });
                    return
                }
                if (!this.funcData) {
                    this.$message({
                        showClose: true,
                        message: '请点击文件读取后再调试',
                        type: 'warning',
                    });
                    return
                }
                this.$axios.post(this.$api.saveFuncApi, {
                    'funcData': this.funcData,
                    'funcName': this.comparator
                }).then(() => {
                        this.$axios.post(this.$api.checkFuncApi, {
                            'funcFileName': this.comparator,
                            'funcName': this.funcName,
                        }).then((response) => {
                                this.messageShow(this, response);
                                this.result = response['data']['result'];
                                // this.messageShow(this, response);
                            }
                        )
                    }
                )
            },
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/python');
                require('brace/theme/monokai');
                require('brace/snippets/python')
            },
            saveFunc() {
                if (!this.funcData) {
                    this.$message({
                        showClose: true,
                        message: '文件为空，请输入内容后再保存',
                        type: 'warning',
                    });
                    return
                }
                this.$axios.post(this.$api.saveFuncApi, {
                    'funcData': this.funcData,
                    'funcName': this.comparator
                }).then((response) => {
                        this.messageShow(this, response);
                        // this.checkFunc();
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




</style>
