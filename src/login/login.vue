<template>
    <div class="test" style="text-align:center;">
        <!--<img src="../assets/logo.png">-->
        <div :style="note">
            <el-form :model="caseData"
                     style="position: absolute;top: 0;right: 0;bottom: 0;left: 0;margin: auto;width: 480px;height: 380px;
                     background-color:rgba(0, 161, 255, 0.3);padding:50px 40px;border-radius:10px;">
                <div style="margin-bottom:10px;font-size: 30px;color:#bfc4cc">测试平台</div>
                <el-form-item prop="num">
                    <el-input v-model="caseData.account" placeholder="请输入账号" style="width: 400px;">
                    </el-input>
                </el-form-item>
                <el-form-item
                        prop="desc">
                    <el-input v-model="caseData.password" type="password" placeholder="请输入密码" style="width: 400px;">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                               @click.native="login()" size="small">登录
                    </el-button>
                    <!--<el-button type="primary"-->
                    <!--@click.native="loGout()" size="small">登出-->
                    <!--</el-button>-->
                    <!--<el-button type="primary"-->
                               <!--@click="centerDialogVisible = true" size="small">注册-->
                    <!--</el-button>-->
                </el-form-item>
            </el-form>
            <el-dialog
                    title="注册"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                <el-form :model="caseData">

                    <el-form-item label="名字" :label-width="caseData.formLabelWidth">
                        <el-input v-model="caseData.name" auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="账号" :label-width="caseData.formLabelWidth"
                                  prop="num">
                        <el-input v-model.number="caseData.account" auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="caseData.formLabelWidth"
                                  prop="desc">
                        <el-input v-model="caseData.password" auto-complete="off">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click.native="register()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>

</template>

<script>
    import * as types from '../store/types'
    import img from '../assets/login_background.png'

    export default {
        name: 'test',
        data() {
            return {
                centerDialogVisible: false,
                img: img,
                note: {
                    backgroundImage: 'url(' + img + ')',
                    backgroundRepeat: "no-repeat",
                    backgroundSize: 'cover',
                    minHeight: '930px',
                    // backgroundPosition: "center",
                    // backgroundAttachment: "fixed",
                },
                // background: url("../assets/login_background.png"),
                token: '',
                caseData: {
                    id: '',
                    modelFormVisible: false,
                    project: '',
                    method: '',
                    name: '',
                    account: '',
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
            register() {
                this.$axios.post(this.$api.registerApi, {
                    'name': this.caseData.name,
                    'account': this.caseData.account,
                    'password': this.caseData.password,
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
                            this.centerDialogVisible = false;
                        }
                    }
                )
            },
            login() {
                this.$axios.post(this.$api.loginApi, {
                    'account': this.caseData.account,
                    'password': this.caseData.password,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.token = response.data['token'];
                            if (this.token) {
                                this.$store.commit(types.LOGIN, this.token);
                                this.$store.commit(types.ROLES, response.data['roles']);
                                this.$store.commit('roles', response.data['roles']);
                                // console.log(this.$store.state.role)
                                // console.log(this.$store.state.userName)
                                this.$store.commit(types.USERNAME, response.data['name']);
                                this.$store.commit('userName', response.data['name']);

                                let redirect = decodeURIComponent(this.$route.query.redirect || '/manage/projectManage');
                                this.$router.push({path: redirect})
                            }
                        }
                    }
                );

            },
            loGout() {
                console.log(this.$store.state.token);
                this.$store.commit(types.LOGOUT);
                this.$router.push({path: 'login'});
            },
            handleSelect(item) {
                console.log(item);
            }
        },

    }
</script>

<style>

</style>
