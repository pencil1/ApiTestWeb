<template>
    <div class="sceneConfig">

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
            <el-form-item label="配置名称">

                <el-input placeholder="请输入配置" v-model="form.configName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findSceneConfig()" size="small">
                    搜索
                </el-button>
                <el-button type="primary" size="small" @click.native="initConfigData()">添加配置
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
                                           @click.native="editSceneConfig(tableData[scope.$index]['id'])">编辑
                                </el-button>
                                <!--<el-button type="primary" icon="el-icon-tickets" size="mini"-->
                                <!--@click.native="copyModel(tableData[scope.$index]['id'])">复制-->
                                <!--</el-button>-->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="sureView(delConfig,tableData[scope.$index]['id'])">删除
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


        <el-dialog title="配置管理" :visible.sync="configData.modelFormVisible" width="50%">


            <el-tabs value="second">
                <el-tab-pane label="基础信息" name="first">
                    <el-form :model="configData">
                        <el-form-item label="配置序号" :label-width="configData.formLabelWidth"
                                      prop="num" v-if="configData.id"
                        >
                            <el-input v-model.number="configData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="配置名称" :label-width="configData.formLabelWidth">
                            <el-input v-model="configData.name" auto-complete="off">
                            </el-input>
                        </el-form-item>

                        <!--<el-form-item label="项目名称" :label-width="configData.formLabelWidth">-->
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
                <el-tab-pane label="公用变量" name="second">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addConfigVariable()">添加
                    </el-button>
                    <el-select v-model="configData.funcAddress" clearable placeholder="请选择导入函数文件" size="small">
                        <el-option
                                v-for="(item, key) in this.funcAddress"
                                :key="item['value']"
                                :label="item['value']"
                                :value="item['value']">
                        </el-option>
                    </el-select>
                    <el-table :data="configData.variable" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" minWidth="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
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
                <el-button type="primary"
                           @click.native="addSceneConfig()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'sceneConfig',
        data() {
            return {
                proGatherData: '',
                funcAddress: '',
                tableData: [],
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projects: '',
                    configName: '',
                },
                configData: {
                    funcAddress: '',
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
                        this.findSceneConfig();
                    }
                );

                this.$axios.post('/api/api/func/getAddress').then((response) => {
                        this.funcAddress = response['data']['data'];
                    }
                )

            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findSceneConfig()
            },
            addConfigVariable() {
                this.configData.variable.push({key: '', value: '', remark: ''});
            },
            delConfigVariable(i) {
                this.configData.variable.splice(i, 1);
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findSceneConfig()
            },
            findSceneConfig() {
                this.$axios.post('/api/api/config/find', {
                    'projectName': this.form.projects,
                    'configName': this.form.configName,
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
            initConfigData() {
                this.configData.name = '';
                this.configData.funcAddress = '';
                this.configData.id = '';
                this.configData.num = '';
                this.configData.variable = [];
                this.configData.modelFormVisible = true;

            },
            addSceneConfig() {
                this.$axios.post('/api/api/sceneConfig/add', {
                    'projectName': this.form.projects,
                    'sceneConfigName': this.configData.name,
                    'funcAddress': this.configData.funcAddress,
                    'num': this.configData.num,
                    'id': this.configData.id,
                    'variable': JSON.stringify(this.configData.variable),
                }).then((response) => {

                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.configData.modelFormVisible = false;
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.findSceneConfig();

                        }
                    }
                )
            },
            editSceneConfig(id) {
                this.$axios.post('/api/api/config/edit', {'id': id}).then((response) => {
                        this.configData.name = response.data['data']['name'];
                        this.configData.num = response.data['data']['num'];
                        this.configData.projectName = this.form.projects;
                        this.configData.variable = response.data['data']['variables'];
                        this.configData.funcAddress = response.data['data']['func_address'];
                        this.configData.id = id;
                        this.configData.modelFormVisible = true;
                    }
                )
            },
            delConfig(id) {
                this.$axios.post('/api/api/config/del', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.form.configName = '';
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findSceneConfig();
                    }
                )
            },

            addModelVariable() {
                this.configData.variable.push({key: '', value: ''});
            },
            delModelVariable(i) {
                this.configData.variable.splice(i, 1);
            },
            addModelHeader() {
                this.configData.header.push({key: '', value: ''});
            },

        },
        mounted() {
            this.httpSend();


        },
    }
</script>

<style>

</style>
