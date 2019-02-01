<template>
    <div class="test">
        <div class="contextmenu-pad" v-contextmenu:contextmenu>
            右键点击此区域
        </div>
        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item @click="handleClick">菜单1</v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">菜单2</v-contextmenu-item>
            <v-contextmenu-item @click="handleClick">菜单3</v-contextmenu-item>
        </v-contextmenu>
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
            handleClick (vm, event) {
                this.$message({
                    message: `你点击了${vm.$slots.default[0].text}`,
                    type: 'info'
                })
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.restaurants1);
            },
            print() {
                // 调用 callback 返回建议列表的数据
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
                if (this.token) {
                    this.$store.commit(types.LOGIN, this.token);
                    let redirect = decodeURIComponent(this.$route.query.redirect || '/manage');
                    this.$router.push({
                        path: redirect
                    })
                }
            },
            findCases2() {
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
                            this.token = response.data['token'];
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
        },

    }
</script>

<style>

</style>
