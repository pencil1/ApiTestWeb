<template>
    <div class="sceneConfig">

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
            <el-form-item label="配置名称">
                <el-input placeholder="请输入配置" v-model="form.configName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findSceneConfig()">
                    搜索
                </el-button>
                <el-button type="primary" @click.native="initConfigData()">添加配置
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
                                       @click.native="editSceneConfig(tableData[scope.$index]['id'])">编辑
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delConfig,tableData[scope.$index]['id'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <el-pagination
                            @current-change="configHandleCurrentChange"
                            @size-change="configHandleSizeChange"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="配置管理" :visible.sync="configData.modelFormVisible" width="50%">
            <el-tabs value="second">
                <el-tab-pane label="基础信息" name="first" style="margin-top: 10px">
                    <el-form :model="configData">
                        <el-form-item label="配置序号"
                                      :label-width="configData.formLabelWidth"
                                      prop="num"
                                      v-if="configData.id">
                            <el-input v-model.number="configData.num">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="配置名称" :label-width="configData.formLabelWidth">
                            <el-input v-model="configData.name">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="项目名称" :label-width="configData.formLabelWidth">
                            <el-select v-model="form.projectName" placeholder="请选择项目">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>


                <el-tab-pane label="公用变量" name="second" style="margin-top: 10px">
                    <el-select v-model="configData.funcAddress" clearable placeholder="请选择导入函数文件" size="small">
                        <el-option
                                v-for="(item, key) in this.funcAddress"
                                :key="item['value']"
                                :label="item['value']"
                                :value="item['value']">
                        </el-option>
                    </el-select>
                    <el-button type="primary" size="small" @click="addConfigVariable()">添加</el-button>
                    <el-table :data="configData.variable" stripe>
                        <el-table-column label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="small">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="Value" header-align="center" minWidth="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="small">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" minWidth="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="small">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delConfigVariable(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="configData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.native="addSceneConfig()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'config',
        data() {
            return {
                proModelData: null,
                funcAddress: null,
                tableData: Array(),
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projectName: null,
                    configName: null,
                },
                configData: {
                    funcAddress: null,
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
            httpSend() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.form.projectName = response.data['user_pro']['pro_name'];
                        this.findSceneConfig();
                    }
                );
                this.$axios.post(this.$api.getFuncAddressApi).then((response) => {
                        this.funcAddress = response['data']['data'];
                    }
                )
            },
            configHandleCurrentChange(val) {
                this.currentPage = val;
                this.findSceneConfig()
            },
            configHandleSizeChange(val) {
                this.sizePage = val;
                this.findSceneConfig()
            },
            addConfigVariable() {
                this.configData.variable.push({key: null, value: null, remark: null});
            },
            delConfigVariable(i) {
                this.configData.variable.splice(i, 1);
            },
            findSceneConfig() {
                this.$axios.post(this.$api.findConfigApi, {
                    'projectName': this.form.projectName,
                    'configName': this.form.configName,
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
            initConfigData() {
                this.configData.name = null;
                this.configData.funcAddress = null;
                this.configData.id = null;
                this.configData.num = null;
                this.configData.variable = Array();
                this.configData.modelFormVisible = true;

            },
            addSceneConfig() {
                this.$axios.post(this.$api.addConfigApi, {
                    'projectName': this.form.projectName,
                    'sceneConfigName': this.configData.name,
                    'funcAddress': this.configData.funcAddress,
                    'num': this.configData.num,
                    'id': this.configData.id,
                    'variable': JSON.stringify(this.configData.variable),
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.configData.modelFormVisible = false;
                            this.findSceneConfig();
                        }
                    }
                )
            },
            editSceneConfig(id) {
                this.$axios.post(this.$api.editConfigApi, {'id': id}).then((response) => {
                        this.configData.name = response.data['data']['name'];
                        this.configData.num = response.data['data']['num'];
                        this.configData.variable = response.data['data']['variables'];
                        this.configData.funcAddress = response.data['data']['func_address'];
                        this.configData.projectName = this.form.projectName;
                        this.configData.id = id;
                        this.configData.modelFormVisible = true;
                    }
                )
            },
            delConfig(id) {
                this.$axios.post(this.$api.delConfigApi, {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.form.configName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findSceneConfig();
                    }
                )
            },
        },
        mounted() {
            this.httpSend();
        },
    }
</script>
<style>
</style>
