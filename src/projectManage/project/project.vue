<template>
    <div class="projectManage">

        <el-form :inline="true" class="demo-form-inline search-style" size="small">

            <el-form-item label="项目名称" labelWidth="110px">
                <el-input placeholder="请输入" v-model="form.projectName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findProject()">
                    搜索
                </el-button>
                <el-button type="primary" @click.native="initProjectData()">添加项目
                </el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first" style="padding-left: 10px">
            <el-tab-pane label="项目列表" name="first" style="margin: 0 0 -10px;">
                <el-table :data="tableData" stripe>
                    <el-table-column
                            prop="id"
                            label="id"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="项目名称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="host"
                            label="基础url1"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="host_two"
                            label="基础url2"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="principal"
                            label="负责人"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click.native="editProject(tableData[scope.$index]['id'])">编辑
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delProject,tableData[scope.$index]['id'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <el-pagination
                            @current-change="proHandleCurrentChange"
                            @size-change="proHandleSizeChange"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>


        <el-dialog title="项目配置" :visible.sync="projectData.modelFormVisible" width="40%">
            <el-tabs>
                <el-tab-pane label="基础信息" style="margin-top: 10px">
                    <el-form>
                        <el-form-item label="项目名称" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.projectName">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="负责人" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.principal">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url1" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.host">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url2" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.hostTwo">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url3" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.hostThree">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url4" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.hostFour">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="公用变量" style="margin-top: 10px">
                    <el-button type="primary" size="small" @click="addProjectVariable()">
                        添加
                    </el-button>
                    <el-table :data="projectData.variable" stripe>
                        <el-table-column label="Key" header-align="center" minWidth="50">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="Value" header-align="center" minWidth="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delProjectVariable(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="请求头部" style="margin-top: 10px">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-button type="primary" size="small" @click="addProjectHeader()">添加头部</el-button>
                    </el-form>
                    <el-table :data="projectData.header" stripe>
                        <el-table-column label="Key" header-align="center" minWidth="50">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="Value" header-align="center" minWidth="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delProjectHeader(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="projectData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addProject()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        name: 'projectManage',
        data() {
            return {
                tableData: Array(),
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projectName: null,
                },
                projectData: {
                    host: null,
                    hostTwo: null,
                    hostThree: null,
                    hostFour: null,
                    id: null,
                    modelFormVisible: false,
                    projectName: null,
                    principal: null,
                    formLabelWidth: '80px',
                    header: Array(),
                    variable: Array(),
                },
            }
        },
        methods: {
            proHandleCurrentChange(val) {
                this.currentPage = val;
                this.findProject()
            },
            proHandleSizeChange(val) {
                this.sizePage = val;
                this.findProject()
            },
            findProject() {
                this.$axios.post(this.$api.findProApi, {
                    'projectName': this.form.projectName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
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
            initProjectData() {
                this.projectData.projectName = null;
                this.projectData.host = null;
                this.projectData.hostTwo = null;
                this.projectData.hostThree = null;
                this.projectData.hostFour = null;
                this.projectData.principal = null;
                this.projectData.header = Array();
                this.projectData.variable = Array();
                this.projectData.id = null;
                this.projectData.modelFormVisible = true;
            },
            addProject() {
                this.$axios.post(this.$api.addProApi, {
                    'projectName': this.projectData.projectName,
                    'principal': this.projectData.principal,
                    'host': this.projectData.host,
                    'hostTwo': this.projectData.hostTwo,
                    'hostThree': this.projectData.hostThree,
                    'hostFour': this.projectData.hostFour,
                    'id': this.projectData.id,
                    'header': JSON.stringify(this.projectData.header),
                    'variable': JSON.stringify(this.projectData.variable),
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
                            this.projectData.modelFormVisible = false;
                            this.findProject();

                        }
                    }
                )
            },
            editProject(id) {
                this.$axios.post(this.$api.editProApi, {'id': id}).then((response) => {
                        this.projectData.projectName = response.data['data']['pro_name'];
                        this.projectData.principal = response.data['data']['principal'];
                        this.projectData.host = response.data['data']['host'];
                        this.projectData.hostTwo = response.data['data']['host_two'];
                        this.projectData.hostThree = response.data['data']['host_three'];
                        this.projectData.hostFour = response.data['data']['host_four'];
                        this.projectData.header = response.data['data']['headers'];
                        this.projectData.variable = response.data['data']['variables'];
                        this.projectData.id = id;
                        this.projectData.modelFormVisible = true;
                    }
                )
            },
            delProject(id) {
                this.$axios.post(this.$api.delProApi, {'id': id}).then((response) => {
                        this.messageShow(this, response);

                        // 分页数量判断，当删除了某一页的最后一条数据后，分页数量-1
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findProject();
                    }
                )
            },
            addProjectVariable() {
                this.projectData.variable.push({key: null, value: null, remark: null});
            },
            delProjectVariable(i) {
                this.projectData.variable.splice(i, 1);
            },
            addProjectHeader() {
                this.projectData.header.push({key: null, value: null});
            },
            delProjectHeader(i) {
                this.projectData.header.splice(i, 1);
            },
        },
        mounted() {
            this.findProject();
        },
    }
</script>
<style>
</style>
