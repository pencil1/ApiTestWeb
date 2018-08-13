<template>
    <div class="modeManage">

        <el-form :inline="true" class="demo-form-inline" style="background-color: #f2f2f2;  padding-top: 20px;"
                 size="small">
            <el-form-item label="项目名称" labelWidth="110px">
                <el-select v-model="form.projects" placeholder="请选择项目">
                    <el-option
                            v-for="(item, key) in proGatherData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="模块名称">

                <el-input placeholder="请输入模块" v-model="form.modelName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findModel()" size="small">
                    搜索
                </el-button>
                <el-button type="primary" size="small" @click.native="initModelData()">添加模块
                </el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first">

            <el-tab-pane label="模块列表" name="first" style="margin: 0 0 -10px;">
                <div style="margin: 0 0 -20px;">
                </div>
                <el-scrollbar wrap-class="scrollbarList">
                    <el-table :data="tableData" stripe>
                        <el-table-column
                                prop="num"
                                label="编号"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="模块名称"
                                width="650">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                        >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click.native="editModel(tableData[scope.$index]['id'])">编辑
                                </el-button>
                                <!--<el-button type="primary" icon="el-icon-tickets" size="mini"-->
                                <!--@click.native="copyModel(tableData[scope.$index]['id'])">复制-->
                                <!--</el-button>-->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="sureView(delModel,tableData[scope.$index]['id'])">删除
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


        <el-dialog title="模块配置" :visible.sync="modelData.modelFormVisible" width="40%">


            <el-tabs>
                <el-tab-pane label="messages">
                    <el-form :model="modelData">
                        <el-form-item label="模块序号" :label-width="modelData.formLabelWidth"
                                      prop="num" v-if="modelData.id"
                        >
                            <el-input v-model.number="modelData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="模块名称" :label-width="modelData.formLabelWidth">
                            <el-input v-model="modelData.name" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <!--<el-form-item label="项目名称" :label-width="modelData.formLabelWidth">-->
                        <!--<el-input v-model="form.projects" auto-complete="off" :disabled="true">-->
                        <!--</el-input>-->
                        <!--</el-form-item>-->
                        <el-form-item label="项目名称" labelWidth="120px" style="width: 200%;">
                            <el-select v-model="form.projects" placeholder="请选择项目">
                                <el-option
                                        v-for="(item, key) in proGatherData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                        </el-form-item>


                    </el-form>
                </el-tab-pane>


            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="modelData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addModel()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'modeManage',
        data() {
            return {
                proGatherData: '',
                tableData: [],
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projects: '',
                    modelName: '',
                },
                modelData: {
                    id: '',
                    num: '',
                    modelFormVisible: false,
                    projectName: '',
                    name: '',
                    formLabelWidth: '120px',
                }
            }
        },


        methods: {
            httpSend() {
                this.$axios.get('/api/api/proGather/list').then((response) => {
                        this.proGatherData = response.data['data'];
                        for (var key in response.data['user_pro']) {
                            this.form.projects = key;
                            break
                        }
                        this.findModel();
                    }
                )
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findModel()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findModel()
            },
            findModel() {
                this.$axios.post('/api/api/model/find', {
                    'projectName': this.form.projects,
                    'modelName': this.form.modelName,
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
            initModelData() {
                this.modelData.name = '';
                this.modelData.id = '';
                this.modelData.num = '';
                this.modelData.modelFormVisible = true;

            },
            test1(){
                console.log(13123)
            },
            addModel() {
                this.$axios.post('/api/api/model/add', {
                    'projectName': this.form.projects,
                    'gatherName': this.modelData.name,
                    'id': this.modelData.id,
                    'num': this.modelData.num,
                }).then((response) => {

                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.modelData.modelFormVisible = false;
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.findModel();

                        }
                    }
                )
            },
            editModel(id) {
                this.$axios.post('/api/api/model/edit', {'id': id}).then((response) => {
                        this.modelData.name = response.data['data']['gatherName'];
                        this.modelData.num = response.data['data']['num'];
                        this.modelData.projectName = this.form.projects;
                        this.modelData.id = id;
                        this.modelData.modelFormVisible = true;
                    }
                )
            },
            delModel(id) {
                this.$axios.post('/api/api/model/del', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.form.modelName = '';
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findModel();
                    }
                )
            },

            addModelVariable() {
                this.modelData.variable.push({key: '', value: ''});
            },
            delModelVariable(i) {
                this.modelData.variable.splice(i, 1);
            },
            addModelHeader() {
                this.modelData.header.push({key: '', value: ''});
            },

        },
        mounted() {
            this.httpSend();


        },
    }
</script>

<style>

</style>
