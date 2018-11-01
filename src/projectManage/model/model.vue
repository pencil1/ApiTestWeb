<template>
    <div class="modeManage">

        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目名称" labelWidth="110px">
                <el-select v-model="form.projectName" placeholder="请选择项目">
                    <el-option
                            v-for="(item, key) in proModelData"
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
                <el-button type="primary" icon="el-icon-search" @click.native="findModel()">
                    搜索
                </el-button>
                <el-button type="primary" @click.native="initModelData()">添加模块
                </el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first" style="padding-left: 10px">
            <el-tab-pane label="模块列表" name="first" style="margin: 0 0 -10px;">
                <el-table :data="tableData" stripe>
                    <el-table-column
                            prop="num"
                            label="编号"
                            min-width="40">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="模块名称"
                            min-width="250">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="250">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click.native="editModel(tableData[scope.$index]['id'])">编辑
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delModel,tableData[scope.$index]['id'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <el-pagination
                            @current-change="modelHandleCurrentChange"
                            @size-change="modelHandleSizeChange"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>

            </el-tab-pane>
        </el-tabs>

        <el-dialog title="模块配置" :visible.sync="modelData.modelFormVisible" width="40%">
            <el-tabs>
                <el-tab-pane label="messages" style="margin-top: 10px">
                    <el-form>
                        <el-form-item label="模块序号"
                                      :label-width="modelData.formLabelWidth"
                                      prop="num"
                                      v-if="modelData.id">
                            <el-input v-model.number="modelData.num">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="项目名称" :label-width="modelData.formLabelWidth">
                            <el-select v-model="form.projectName" placeholder="请选择项目">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="模块名称" :label-width="modelData.formLabelWidth">
                            <el-input v-model="modelData.name">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="modelData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.native="addModel()" size="small">确 定
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
                proModelData: null,
                tableData: Array(),
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projectName: null,
                    modelName: null,
                },
                modelData: {
                    id: null,
                    num: null,
                    modelFormVisible: false,
                    projectName: null,
                    name: null,
                    formLabelWidth: '80px',
                }
            }
        },
        methods: {
            initData() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                    if (response.data['user_pro']){
                        this.form.projectName = response.data['user_pro']['pro_name'];
                        this.findModel();
                    }
                        this.proModelData = response.data['data'];


                    }
                )
            },
            modelHandleCurrentChange(val) {
                this.currentPage = val;
                this.findModel()
            },
            modelHandleSizeChange(val) {
                this.sizePage = val;
                this.findModel()
            },
            findModel() {
                this.$axios.post(this.$api.findModelApi, {
                    'projectName': this.form.projectName,
                    'modelName': this.form.modelName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.tableData = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            initModelData() {
                this.modelData.name = null;
                this.modelData.id = null;
                this.modelData.num = null;
                this.modelData.modelFormVisible = true;
            },
            addModel() {
                this.$axios.post(this.$api.addModelApi, {
                    'projectName': this.form.projectName,
                    'gatherName': this.modelData.name,
                    'id': this.modelData.id,
                    'num': this.modelData.num,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.modelData.modelFormVisible = false;
                            this.findModel();
                        }
                    }
                )
            },
            editModel(id) {
                this.$axios.post(this.$api.editModelApi, {'id': id}).then((response) => {
                        this.modelData.name = response.data['data']['gatherName'];
                        this.modelData.num = response.data['data']['num'];
                        this.modelData.projectName = this.form.projectName;
                        this.modelData.id = id;
                        this.modelData.modelFormVisible = true;
                    }
                )
            },
            delModel(id) {
                this.$axios.post(this.$api.delModelApi, {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.form.modelName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findModel();
                    }
                )
            },
        },
        mounted() {
            this.initData();
        },
    }
</script>
<style>
</style>
