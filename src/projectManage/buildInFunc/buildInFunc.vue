<template>
    <div class="buildInFunc">
        <div style="margin: 0 0 -15px;">
        </div>
        <div style="float: left">
            <span>内置函数文档</span>
            <el-autocomplete
                    class="inline-input"
                    v-model="comparator"
                    :fetch-suggestions="querySearch"
                    placeholder="输入或选择文件"
                    size="small"
            > </el-autocomplete>
            <el-button-group>
                <el-button type="success" @click.native="findFunc()" size="small">读取</el-button>
                <el-button type="primary" @click.native="createFunc()" size="small">创建</el-button>
                <!--<el-button type="danger" @click.native="sureView(removeFunc)" size="small">删除</el-button>-->
            </el-button-group>
        </div>
        <el-button-group style="float: right;margin-bottom: 10px">
            <el-tooltip content="检查语法" placement="top-start">
                <el-button type="primary" icon="el-icon-view" @click.native="checkFunc()" size="small"></el-button>
            </el-tooltip>
            <el-tooltip content="重置文档" placement="top-start">
                <el-button type="info" icon="el-icon-refresh" @click.native="findFunc()" size="small"></el-button>
            </el-tooltip>
            <el-tooltip content="保存文档" placement="top-start">
                <el-button type="success" icon="el-icon-edit" @click.native="saveFunc()" size="small"></el-button>
            </el-tooltip>
        </el-button-group>
        <div>
            <el-input
                    type="textarea"
                    :rows="36"
                    placeholder="请输入内容"
                    v-model="funcData">
            </el-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'buildInFunc',
        data() {
            return {
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
                this.$axios.post('/api/api/func/find', {'funcName': this.comparator}).then((response) => {
                        this.messageShow(this, response);
                        this.funcData = response['data']['func_data'];
                    }
                )
            },
            createFunc() {
                this.$axios.post('/api/api/func/create', {'funcName': this.comparator}).then((response) => {
                        this.messageShow(this, response);
                        this.getFuncAddress()
                    }
                )
            },
            removeFunc() {
                this.$axios.post('/api/api/func/remove', {'funcName': this.comparator}).then((response) => {
                        this.comparator = '';
                        this.messageShow(this, response);
                        this.getFuncAddress()
                    }
                )
            },
            getFuncAddress() {
                this.$axios.post('/api/api/func/getAddress').then((response) => {
                        this.comparators = response['data']['data'];
                    }
                )
            },
            checkFunc() {
                this.$axios.post('/api/api/func/check', {'funcName': this.comparator}).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                        }
                    }
                )
            },
            saveFunc() {
                this.$axios.post('/api/api/func/save', {
                    'funcData': this.funcData,
                    'funcName': this.comparator
                }).then((response) => {
                        this.messageShow(this, response);
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
