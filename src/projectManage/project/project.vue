<template>
    <div class="projectManage">

        <el-form :inline="true" class="demo-form-inline" style="background-color: #f2f2f2;  padding-top: 20px;"
                 size="small">

            <el-form-item label="项目名称" labelWidth="110px">

                <el-input placeholder="请输入" v-model="form.projects">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findProject()" size="small">
                    搜索
                </el-button>
                <el-button type="primary" size="small" @click.native="initProjectData()">添加项目
                </el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first">
            <el-tab-pane label="项目列表" name="first" style="margin: 0 0 -10px;">
                <div style="margin: 0 0 -20px;">
                </div>
                <el-scrollbar wrap-class="scrollbarList">
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
                </el-scrollbar>
                <div class="block" style="left:68%; position: relative;">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>


        <el-dialog title="项目配置" :visible.sync="projectData.modelFormVisible" width="40%">


            <el-tabs>
                <el-tab-pane label="基础信息">
                    <el-form :model="projectData">

                        <el-form-item label="项目名称" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.projectName" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="负责人" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.principal" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url1" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.host" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url2" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.hostTwo" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url3" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.hostThree" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="基础url4" :label-width="projectData.formLabelWidth">
                            <el-input v-model="projectData.hostFour" auto-complete="off">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="公用变量">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addProjectVariable()">添加
                    </el-button>
                    <el-table :data="projectData.variable" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="180">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center"
                                         style="font-size: 16px;" width="280">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delProjectVariable(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="请求头部">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-button type="primary" size="small" @click="addProjectHeader()">添加头部</el-button>
                    </el-form>
                    <el-table :data="projectData.header" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="210">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="450">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
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
                tableData: [],
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projects: '',
                },
                projectData: {
                    host: '',
                    hostTwo: '',
                    hostThree: '',
                    hostFour: '',
                    id: '',
                    modelFormVisible: false,
                    projectName: '',
                    principal: '',
                    formLabelWidth: '120px',
                    header: [],
                    variable: [],
                },
            }
        },


        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findProject()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findProject()
            },
            findProject() {
                this.$axios.post('/api/api/project/find', {
                    'projectName': this.form.projects,
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
                this.projectData.projectName = '';
                this.projectData.host = '';
                this.projectData.hostTwo = '';
                this.projectData.hostThree = '';
                this.projectData.hostFour = '';
                this.projectData.principal = '';
                this.projectData.header = [];
                this.projectData.variable = [];
                this.projectData.id = '';
                this.projectData.modelFormVisible = true;

            },

            addProject() {
                this.$axios.post('/api/api/project/add', {
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
                this.$axios.post('/api/api/project/edit', {'id': id}).then((response) => {
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
                this.$axios.post('/api/api/project/del', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findProject();
                    }
                )
            },
            addProjectVariable() {
                this.projectData.variable.push({key: '', value: '', remark: ''});
            },
            delProjectVariable(i) {
                this.projectData.variable.splice(i, 1);
            },
            addProjectHeader() {
                this.projectData.header.push({key: '', value: ''});
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
