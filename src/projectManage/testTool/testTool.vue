<template>
    <div class="test">
        <el-form :model="caseData">

            <el-form-item label="名字" :label-width="caseData.formLabelWidth">
                <el-input v-model="caseData.name" auto-complete="off">
                </el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary"
                   @click.native="buildIdentity()" size="small">生成身份证
        </el-button>
        <!--<el-button type="primary"-->
                   <!--@click.native="testTask()" size="small">测试-->
        <!--</el-button>-->
        <el-button type="primary" size="small" @click.native="testTask()">优化数据</el-button>
        <el-button type="primary" size="small" @click.native="dealSql()">执行语句</el-button>
        <el-button type="primary" size="small" @click.native="sqlData()">数据库修改</el-button>
        <div style="margin: 20px 0;"></div>
        <div>
            <el-input
                    type="textarea"
                    :rows="30"
                    placeholder="请输入内容"
                    v-model="showData">
            </el-input>
        </div>
        <!--<el-scrollbar wrap-class="list" >-->
            <!--<div v-for="value in num" >-->
                <!--{{value}}-->
            <!--</div>-->
        <!--</el-scrollbar>-->
    </div>
</template>

<script>
    import * as types from '../../store/types'

    export default {
        name: 'test',
        data() {
            return {
                num:[1,2,3,4,5,6,7,8,9,0],
                token: '',
                message: '啦啦啦，这是复制的内容！',
                showData:'',
                caseData: {
                    id: '',
                    modelFormVisible: false,
                    project: '',
                    method: '',
                    name: '',
                    username: '',
                    formLabelWidth: '120px',
                }
            };
        },
        mounted() {
        },
        methods: {
            buildIdentity() {
                // 调用 callback 返回建议列表的数据
                this.$axios.get('/api/api/buildIdentity', {
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.showData = response.data['data'];

                        }
                    }
                )
            },
            testTask() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/api/task/test', {
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.showData = response.data['data'];

                        }
                    }
                )
            },
            sqlData() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/api/runCmd', {
                    'funcName':'sql_func',
                }).then((response) => {
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
            dealSql() {
                // 调用 callback 返回建议列表的数据
                this.$axios.get('/api/api/delSql', {
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {

                        }
                    }
                )
            },
            findCases() {
                this.$axios.post('/api/api/register', {
                    'name': this.caseData.name,
                    'username': this.caseData.username,
                    'password': this.caseData.password,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['data'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.tableData = response.data['data'];
                            this.total = response.data['total'];

                        }
                    }
                )
            },
            login() {
                console.log(33333333);
                if (this.token) {
                    console.log(1111111111111);
                    this.$store.commit(types.LOGIN, this.token);
                    let redirect = decodeURIComponent(this.$route.query.redirect || '/manage');
                    this.$router.push({
                        path: redirect
                    })
                }
            },
            handleSelect(item) {
                console.log(item);
            }
        },

    }
</script>

<style>
    .list {
        max-height: 200px;
    }
</style>
