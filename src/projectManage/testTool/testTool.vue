<template>
    <div class="test">
        <div style="margin: 10px"></div>
        <el-form>

            <div class="block">

                <el-date-picker
                        v-model="value6"
                        type="year"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </div>
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
        <el-button type="primary" size="small" @click.native="sqlData1()">数据库修改1</el-button>
        <el-button type="primary" size="small" @click.native="optimizeError()">错误信息优化显示</el-button>
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
                value6:'',
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
                    try {
                        JSON.parse(this.showData)
                    }
                    catch (err) {
                        this.$message({
                            showClose: true,
                            message: 'json格式错误',
                            type: 'warning',
                        });
                        console.log(err);
                        for (let i = 0; i < 30; i++){
                            console.log(this.showData.substring(4787-i,4787))
                        }
                        // console.log(this.showData.substring(4787-3,4787+3))
                    }
                // this.$axios.post('/api/api/runCmd', {
                //     'funcName':'sql_func',
                // }).then((response) => {
                //         if (response.data['status'] === 0) {
                //             this.$message({
                //                 showClose: true,
                //                 message: response.data['msg'],
                //                 type: 'warning',
                //             });
                //         }
                //         else {
                //             this.$message({
                //                 showClose: true,
                //                 message: response.data['msg'],
                //                 type: 'success',
                //             });
                //
                //         }
                //     }
                // )
            },
            sqlData1() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/api/delSql', {
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
            optimizeError() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/api/optimizeError', {
                    'errorData': this.showData,
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
                            this.showData = response.data['data'];
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
