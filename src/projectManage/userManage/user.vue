<template>
    <div class="userManage">

        <el-form :inline="true" class="demo-form-inline search-style" size="small">

            <el-form-item label="用户名称" labelWidth="110px">
                <el-input placeholder="请输入" v-model="form.userName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findUser()">搜索</el-button>
                <el-button type="primary" @click.native="initUserData()">添加用户</el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first" style="padding-left: 10px">
            <el-tab-pane label="用户列表" name="first" class="table_padding">
                <el-table :data="tableData" stripe max-height="745">
                    <el-table-column
                            prop="user_id"
                            label="id"
                            width="80"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            label="用户名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态">
                        <template slot-scope="scope">
                            <div :style="scope.row.status === 1 ? 'color:rgb(44, 202, 44)': 'color:rgb(255, 74, 74)'">
                                {{statusChineseShow(scope.row.status)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click.native="editUser(tableData[scope.$index]['user_id'])">编辑
                            </el-button>
                            <el-button type="primary" size="mini"
                                       @click.native="changeUserStatus(tableData[scope.$index]['user_id'])">置换状态
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delUser,tableData[scope.$index]['user_id'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <el-pagination
                            @current-change="proHandleCurrentChange"
                            @size-change="proHandleSizeChange"
                            :page-size="20"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog
                title="账号设置"
                :visible.sync="userData.modelFormVisible"
                width="30%"
        >
            <el-form>

                <el-form-item label="姓名" :label-width="userData.formLabelWidth">
                    <el-input v-model="userData.name">
                    </el-input>
                </el-form-item>
                <el-form-item label="账号" :label-width="userData.formLabelWidth"
                              prop="num">
                    <el-input v-model.number="userData.account">
                    </el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="userData.formLabelWidth"
                              prop="desc">
                    <el-input v-model="userData.password" type="password">
                    </el-input>
                </el-form-item>
                <el-form-item label="角色" :label-width="userData.formLabelWidth"
                              prop="desc">
                    <el-select v-model="form.role" value-key="role_id" placeholder="请选择配置">
                        <el-option
                                v-for="item in roleData"
                                :key="item.role_id"
                                :label="item.role_name"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="userData.modelFormVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click.native="register()" size="small">确 定</el-button>
                </span>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: 'userManage',
        data() {
            return {
                tableData: Array(),
                total: 1,
                currentPage: 1,
                sizePage: 20,
                roleData:[],
                form: {
                    userName: null,
                    role:{},
                },
                userData: {
                    id: null,
                    modelFormVisible: false,
                    name: '',
                    account: '',
                    formLabelWidth: '60px',
                    password: '',
                    status: '',
                },
            }
        },
        methods: {
            register() {
                this.$axios.post(this.$api.registerApi, {
                    'id': this.userData.id,
                    'name': this.userData.name,
                    'role_id': this.form.role.role_id,
                    'account': this.userData.account,
                    'password': this.userData.password,
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
                            this.findUser();
                            this.userData.modelFormVisible = false;
                        }
                    }
                )
            },

            proHandleCurrentChange(val) {
                this.currentPage = val;
                this.findUser()
            },
            proHandleSizeChange(val) {
                this.sizePage = val;
                this.findUser()
            },
            findUser() {
                this.$axios.post(this.$api.findUserApi, {
                    'userName': this.form.userName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.tableData = response.data['data'];
                            this.total = response.data['total'];
                            this.roleData = response.data['role_data'];
                        }
                    }
                )
            },
            initUserData() {
                this.userData.name = '';
                this.userData.account = '';
                this.userData.password = '';
                this.userData.status = '';
                this.userData.id = null;
                this.userData.modelFormVisible = true;
            },
            editUser(id) {
                this.$axios.post(this.$api.editUserApi, {'id': id}).then((response) => {
                        this.userData.account = response.data['data']['account'];
                        this.userData.name = response.data['data']['name'];
                        this.userData.password = '';
                        this.userData.id = id;
                        let index = this.roleData.map(item => item.role_id).indexOf(response.data['data']['role_id']);
                        this.form.role = this.roleData[index];
                        this.userData.modelFormVisible = true;
                    }
                )
            },
            changeUserStatus(id) {
                this.$axios.post(this.$api.changeStatusUserApi, {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.findUser();
                    }
                )
            },
            delUser(id) {
                this.$axios.post(this.$api.delUserApi, {'id': id}).then((response) => {
                        this.messageShow(this, response);

                        // 分页数量判断，当删除了某一页的最后一条数据后，分页数量-1
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findUser();
                    }
                )
            },
            statusChineseShow(user_status) {
                if (user_status === 1) {
                    return '正常'
                }
                else {
                    return '冻结'
                }
            },
        },
        mounted() {
            this.findUser();
        }
        ,
    }
</script>
<style>
</style>
