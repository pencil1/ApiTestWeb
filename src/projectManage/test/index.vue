<template>
    <div class="test">
        <el-form :model="caseData">

            <el-form-item label="名字" :label-width="caseData.formLabelWidth"
            >
                <el-input v-model="caseData.name" auto-complete="off">
                </el-input>
            </el-form-item>
            <el-form-item label="账号" :label-width="caseData.formLabelWidth"
                          prop="num"
            >
                <el-input v-model.number="caseData.username" auto-complete="off">
                </el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="caseData.formLabelWidth"
                          prop="desc">
                <el-input v-model="caseData.password" auto-complete="off">
                </el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary"
                   @click.native="findCases()" size="small">注册
        </el-button>
        <el-button type="primary"
                   @click.native="findCases1()" size="small">确 定1
        </el-button>
        <el-button type="primary"
                   @click.native="findCases2()" size="small">登录
        </el-button>
        <el-button type="primary"
                   @click.native="findCases3()" size="small">登出
        </el-button>
        <el-button type="primary"
                   @click.native="print()" size="small">测试
        </el-button>
    </div>
</template>

<script>
    import * as types from '../../store/types'

    export default {
        name: 'test',
        data() {
            return {
                token: '',
                caseData: {
                    id: '',
                    modelFormVisible: false,
                    project: '',
                    method: '',
                    name: '',
                    username: '',
                    formLabelWidth: '120px',
                    password: '',
                    header: [],
                    variable: [],
                    extract: [],
                    validate: [],
                }
            };
        },
        mounted() {
            this.$store.commit(types.TITLE, 'Login');
        },
        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.restaurants1);
            },
            print() {
                // 调用 callback 返回建议列表的数据
                console.log(this.token)
            },
            findApiMsg() {
                this.$axios.post('/apiMessage/apiMessage/register', {
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
            findCases2() {
                console.log(555);
                this.$axios.post('/apiMessage/apiMessage/login', {
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
                            console.log(444);
                            this.token = response.data['token'];
                            console.log(222222222);
                            this.login();
                        }
                    }
                )
            },
            findCases3() {
                this.$store.commit(types.LOGOUT);
                this.$router.push({path: '/login'});
                // this.$axios.post('/apiMessage/apiMessage/logout', {}).then((response) => {
                //         if (response.data['status'] === 0) {
                //             this.$message({
                //                 showClose: true,
                //                 message: response.data['data'],
                //                 type: 'warning',
                //             });
                //         }
                //         else {
                //             this.tableData = response.data['data'];
                //             this.total = response.data['total'];
                //         }
                //     }
                // )
            },
            findCases1() {
                this.$axios.post('/apiMessage/apiMessage/proGather/list1', {}).then((response) => {
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
            handleSelect(item) {
                console.log(item);
            }
        },

    }
</script>

<style>

</style>
