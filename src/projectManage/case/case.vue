<template>
    <div class="caseManage" v-loading="this.loading">
        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目、模块" labelWidth="110px">
                <el-select v-model="form.projectName" placeholder="请选择项目" @change="clearChoice" style="width: 150px">
                    <el-option
                            v-for="(item, key) in proModelData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

                <el-select v-model="form.module" placeholder="请选择模块" value-key="moduleId" style="width: 150px">
                    <el-option
                            v-for="item in proModelData[this.form.projectName]"
                            :key="item.moduleId"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="form.config" placeholder="请选择配置" clearable value-key="configId"
                           style="width: 150px">
                    <el-option

                            v-for="item in configData[this.form.projectName]"
                            :key="item.configId"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="接口名称" v-if="showNumTab !== 'third'">
                <el-input placeholder="请输入" v-model="form.apiName" clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="套件名称" v-if="showNumTab === 'third'">
                <el-input placeholder="请输入" v-model="form.suiteName" clearable>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findDataBtn()">搜索</el-button>
                <el-button type="primary" @click.native="initData()">录入接口信息</el-button>
                <el-button type="primary"
                           v-if="showNumTab === 'first'"
                           @click.native="apiTest(casesList)">测试
                </el-button>
                <el-button type="primary" v-if="showNumTab === 'third'"
                           @click.native="apiTest(null, suiteList)">测试
                </el-button>
                <el-button type="primary" icon="el-icon-view" @click.native="$refs.resultFunc.lastResult()"></el-button>
                <!--<el-button type="primary" @click.native="initSuiteView()">添加套件</el-button>-->
                <el-button type="primary" @click.native="$refs.importApiFunc.initData()">导入信息</el-button>
                <el-button type="primary"
                           v-if="form.config !== null && form.config !== '' "
                           @click.native="$refs.configEditFunc.editSceneConfig(form.config.configId)">配置修改</el-button>
            </el-form-item>
        </el-form>


        <el-scrollbar wrapStyle="height:840px;">
            <el-tabs v-model="showNumTab" style="padding-left: 10px;">
                <el-tab-pane label="接口信息" name="first">
                    <el-table
                            ref="apiMultipleTable"
                            @selection-change="handleCaseSelection"
                            :data="caseTableData"
                            stripe>
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="编号"
                                width="60">
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip=true
                                prop="name"
                                label="接口名称"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip=true
                                prop="url"
                                label="接口地址">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="320">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click.native="editCopyCase(caseTableData[scope.$index]['caseId'],'edit')">编辑
                                </el-button>
                                <el-button type="primary" icon="el-icon-tickets" size="mini"
                                           @click.native="editCopyCase(caseTableData[scope.$index]['caseId'],'copy')">复制
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="sureView(delCases,caseTableData[scope.$index]['caseId'])">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择
                    </el-button>
                    <div class="pagination">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                                :page-size="20"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.apiPage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <!--<el-tab-pane label="接口套件" name="third">-->
                <!--<el-table-->
                <!--ref="suiteMultipleTable"-->
                <!--@selection-change="handleSuiteSelection"-->
                <!--:data="suiteTableData"-->
                <!--stripe>-->
                <!--<el-table-column-->
                <!--type="selection"-->
                <!--width="55">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--prop="num"-->
                <!--label="编号"-->
                <!--width="60">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--:show-overflow-tooltip=true-->
                <!--prop="name"-->
                <!--label="套件名称"-->
                <!--width="200">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--:show-overflow-tooltip=true-->
                <!--prop="api_names"-->
                <!--label="接口信息">-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                <!--label="操作"-->
                <!--width="320">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button type="primary" icon="el-icon-edit" size="mini"-->
                <!--@click.native="editSuite(suiteTableData[scope.$index]['id'])">编辑-->
                <!--</el-button>-->
                <!--<el-button type="danger" icon="el-icon-delete" size="mini"-->
                <!--@click.native="sureView(delSuite,suiteTableData[scope.$index]['id'])">删除-->
                <!--</el-button>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--</el-table>-->

                <!--<el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择-->
                <!--</el-button>-->
                <!--<div class="pagination">-->
                <!--<el-pagination-->
                <!--@current-change="handleCurrentChange"-->
                <!--@size-change="handleSizeChange"-->
                <!--:page-size="20"-->
                <!--layout="total, sizes, prev, pager, next, jumper"-->
                <!--:total="this.suitePage.total">-->
                <!--</el-pagination>-->
                <!--</div>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="接口配置" name="second" v-if="apiEditViewStatus"
                             style="background-color: rgb(250, 250, 250);min-height: 780px">
                    <apiEdit
                            :projectName="form.projectName"
                            :module="form.module"
                            :configData="form.config"
                            :proModelData="proModelData"
                            :proUrlData="proUrlData"
                            @findApi="findCases"
                            ref="apiFunc">
                    </apiEdit>

                </el-tab-pane>

            </el-tabs>

        </el-scrollbar>

        <!--<suiteEdit-->
        <!--:projectName="form.projectName"-->
        <!--:model="form.model"-->
        <!--:casesList="casesList"-->
        <!--ref="suiteFunc">-->
        <!--</suiteEdit>-->

        <importApi
                :projectName="form.projectName"
                :modelName="form.modelName"
                ref="importApiFunc">

        </importApi>

        <result ref="resultFunc">
        </result>

        <errorView ref="errorViewFunc">
        </errorView>


        <configEdit
                :proModelData="proModelData"
                :projectName="form.projectName"
                :funcAddress="funcAddress"
                ref="configEditFunc">
        </configEdit>
    </div>
</template>

<script>
    import result from './result.vue'
    import importApi from './importApi.vue'
    import suiteEdit from './suiteEdit.vue'
    import apiEdit from './apiEdit.vue'
    import errorView from '../common/errorView.vue'
    import configEdit from '../config/configEdit.vue'

    export default {
        components: {
            result: result,
            importApi: importApi,
            suiteEdit: suiteEdit,
            apiEdit: apiEdit,
            errorView: errorView,
            configEdit:configEdit,

        },
        name: 'caseManage',
        data() {
            return {
                apiEditViewStatus: false,//接口配置组件显示控制
                showNumTab: 'first',
                loading: false,
                proModelData: '',
                configData: '',
                proUrlData: null,
                caseTableData: Array(),//接口表单数据
                suiteTableData: Array(),//套件表单数据
                casesList: Array(),
                suiteList: Array(),
                funcAddress:null,
                apiPage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 20,
                },
                suitePage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 20,
                },
                form: {
                    config: {
                        name: null,
                        configId: null,
                    },
                    module: {
                        name: null,
                        moduleId: null,
                    },
                    projectName: null,
                    projectId: null,
                    suiteName: null,
                    apiName: null,

                },
            }
        },

        methods: {
            initBaseData() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.configData = response.data['config_name_list'];
                        this.proUrlData = response.data['urlData'];
                        this.form.projectName = response.data['user_pro']['pro_name'];
                        // this.form.config.configName = response.data['config_name_list'][this.form.projectName][0]['name'].toString();
                        // this.form.config.configId = response.data['config_name_list'][this.form.projectName][0]['configId'].toString();
                        // this.form.modelName = response.data['user_pro']['model_list'][0]['name'].toString();
                        // this.form.modelId = response.data['user_pro']['model_list'][0]['moduleId'].toString();
                        this.form.module = response.data['user_pro']['model_list'][0];
                        this.form.config = this.configData[this.form.projectName][0];
                        this.findCases();
                    this.$axios.post(this.$api.getFuncAddressApi).then((response) => {
                            this.funcAddress = response['data']['data'];
                        }
                    )
                        // this.findSuite();
                    }
                )
            },
            handleCurrentChange(val) {
                if (this.showNumTab === 'first') {
                    this.apiPage.currentPage = val;
                    this.findCases();
                }
                else if (this.showNumTab === 'third') {
                    this.suitePage.currentPage = val;
                    this.findSuite();
                }
            },
            handleSizeChange(val) {
                if (this.showNumTab === 'first') {
                    this.apiPage.sizePage = val;
                    this.findCases();
                }
                else if (this.showNumTab === 'third') {
                    this.suitePage.sizePage = val;
                    this.findSuite();
                }
            },
            findDataBtn() {
                if (this.showNumTab !== 'third') {
                    this.findCases();
                    this.showNumTab = 'first'
                }
                else {
                    this.findSuite();
                }
            },
            findSuite() {
                this.$axios.post('/api/api/suite/find', {
                    'suiteName': this.form.suiteName,
                    'projectName': this.form.projectName,
                    'modelName': this.form.modelName,
                    'page': this.suitePage.currentPage,
                    'sizePage': this.suitePage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.suiteTableData = response.data['data'];
                            this.suitePage.total = response.data['total'];

                        }
                    }
                )
            },
            findCases() {
                if (this.form.module === null) {
                    this.$message({
                        showClose: true,
                        message: '请选择模块',
                        type: 'warning',
                    });
                    return
                }
                this.$axios.post('/api/api/cases/find', {
                    'caseName': this.form.apiName,
                    'projectName': this.form.projectName,
                    'moduleId': this.form.module.moduleId,
                    'page': this.apiPage.currentPage,
                    'sizePage': this.apiPage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.caseTableData = response.data['data'];
                            this.apiPage.total = response.data['total'];
                        }
                    }
                )
            },
            initData() {
                this.apiEditViewStatus = true;
                this.showNumTab = 'second';
                setTimeout(() => {
                    this.$refs.apiFunc.initCaseData();
                }, 0)
                // this.$refs.suiteFunc.initData();
            },

            editCopyCase(caseId, status) {
                this.apiEditViewStatus = true;
                this.showNumTab = 'second';
                setTimeout(() => {
                    this.$refs.apiFunc.editCopyCase(caseId, status);
                }, 0)
            },
            delCases(caseId) {
                this.$axios.post('/api/api/cases/del', {'caseId': caseId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.apiName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findCases();
                    }
                )
            },
            delSuite(suiteId) {
                this.$axios.post('/api/api/suite/del', {'suiteId': suiteId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.apiName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findSuite();
                    }
                )
            },
            apiTest(caseData = null, suiteData = null) {
                this.loading = true;
                this.$axios.post('/api/api/cases/run', {
                    'caseData': caseData,
                    'suiteData': suiteData,
                    'projectName': this.form.projectName,
                    'configId': this.form.config.configId,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                            if (response.data['error']) {
                                this.$refs.errorViewFunc.showData(response.data['error']);
                            }
                        }
                        else {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.$refs.resultFunc.showData(response['data']['data']);
                        }
                        this.loading = false;
                    }
                )
            },
            initSuiteView() {
                if (this.casesList.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请至少选择1条接口信息',
                        type: 'warning',
                    });
                }
                else {
                    this.$refs.suiteFunc.initData();
                }
            },
            editSuite(suiteId) {
                this.$refs.suiteFunc.editData(suiteId);
            },
            handleCaseSelection(val) {
                this.casesList = val;
            },
            handleSuiteSelection(val) {
                this.suiteList = val;
            },
            cancelSelection() {
                this.$refs.apiMultipleTable.clearSelection();
                this.$refs.suiteMultipleTable.clearSelection();
            },
            clearChoice() {
                this.form.config = null;
                this.form.module = null;
            },

        },

        mounted() {
            this.initBaseData();
        },
    }
</script>
<style>
    .cm-s-default .cm-property {
        color: rgb(183, 40, 135);
        /*color: rgb(137, 21, 99);*/
    }

    .CodeMirror-gutter {
        width: 40px;
    }

    .cm-s-default .cm-string {
        /*color: rgb(116,88,255);*/
        color: rgb(71, 35, 255);
    }

    .cm-s-default .cm-atom {
        color: #000000;
    }

    .h-b-e-a-style {
        background-color: rgb(250, 250, 250);
        /*min-height: 430px;*/
    }

</style>
