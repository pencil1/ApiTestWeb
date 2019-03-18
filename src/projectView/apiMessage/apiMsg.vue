<template>
    <div class="caseManage" v-loading="this.loading">

        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目" labelWidth="80px">
                <el-select v-model="form.projectName"
                           placeholder="请选择项目"
                           @change="initProjectChoice"
                           style="width: 150px;padding-right:5px">
                    <el-option
                            v-for="(item) in proAndIdData"
                            :key="item.name"
                            :value="item.name">
                    </el-option>
                </el-select>
                <el-select
                        v-model="form.config"
                        placeholder="请选择配置"
                        clearable
                        value-key="configId"
                        style="width: 150px"
                >
                    <el-option

                            v-for="item in configData[this.form.projectName]"
                            :key="item.configId"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="接口名称" v-if="numTab !== 'third'">
                <el-input placeholder="请输入" v-model="form.apiName" clearable style="width: 150px">
                </el-input>
            </el-form-item>
            <!--<el-form-item label="套件名称" v-if="numTab === 'third'">-->
            <!--<el-input placeholder="请输入" v-model="form.suiteName" clearable>-->
            <!--</el-input>-->
            <!--</el-form-item>-->

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="handleCurrentChange(1)">搜索</el-button>
                <el-button type="primary" @click.native="initData()">录入接口信息</el-button>
                <el-button type="primary" @click.native="apiTest(apiMsgList)">测试
                </el-button>

                <el-button type="primary" icon="el-icon-view" @click.native="$refs.resultFunc.lastResult()">{{null}}
                </el-button>
                <el-button type="primary" @click.native="$refs.importApiFunc.initData()">导入信息</el-button>
                <el-button type="primary"
                           v-if="form.config !== null && form.config !== '' "
                           @click.native="$refs.configEditFunc.editSceneConfig(form.config.configId)">配置修改
                </el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="numTab" class="table_padding" @tab-click="tabChange">
            <el-tab-pane label="接口信息" name="first">
                <el-row>
                    <el-col :span="3"
                            style="border:1px solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;">
                        <el-row>
                            <el-col style="border:1px solid;border-color: #ffffff #ffffff rgb(234, 234, 234) #ffffff;padding:2px">
                                <el-dropdown @command="moduleCommand" style="float:right;">
                                      <span class="el-dropdown-link" style="color: #4ae2d5">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                      </span>
                                    <!--<el-button size="mini" type="info">-->
                                    <!--操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                                    <!--</el-button>-->
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="add">添加</el-dropdown-item>
                                        <el-dropdown-item command="edit">编辑</el-dropdown-item>
                                        <el-dropdown-item command="stick">置顶</el-dropdown-item>
                                        <el-dropdown-item command="del">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <!--<el-button size="mini" type="primary" @click.native="initModuleData()">添加-->
                                <!--</el-button>-->
                                <!--<el-button size="mini" type="primary" @click.native="editModule()">编辑-->
                                <!--</el-button>-->
                                <!--<el-button size="mini" type="success"-->
                                <!--@click.native="stickModule()">置顶-->
                                <!--</el-button>-->
                                <!--<el-button size="mini" type="danger" @click.native="sureView(delModule)">删除-->
                                <!--</el-button>-->
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-scrollbar wrapStyle="height:740px;">
                                <el-tree
                                        ref="testTree"
                                        @node-click="treeClick"
                                        class="filter-tree"
                                        highlight-current
                                        node-key="moduleId"
                                        :data="moduleDataList"
                                        :props="defaultProps"

                                >
                                </el-tree>
                            </el-scrollbar>
                            <el-pagination
                                    small
                                    @current-change="handleModuleCurrentChange"
                                    :current-page="modulePage.currentPage"
                                    :page-size="30"
                                    layout="prev, pager, next"
                                    :total="modulePage.total">
                            </el-pagination>
                        </el-row>
                    </el-col>

                    <el-col :span="21" style="padding-left: 5px;">
                        <el-table

                                ref="apiMultipleTable"
                                @selection-change="handleApiMsgSelection"
                                :data="ApiMsgTableData"
                                stripe
                                max-height="745">
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
                                               @click.native="editCopyApi(ApiMsgTableData[scope.$index]['apiMsgId'],'edit')">
                                        编辑
                                    </el-button>
                                    <el-button type="primary" icon="el-icon-tickets" size="mini"
                                               @click.native="editCopyApi(ApiMsgTableData[scope.$index]['apiMsgId'],'copy')">
                                        复制
                                    </el-button>
                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                               @click.native="sureView(delApi,ApiMsgTableData[scope.$index]['apiMsgId'],ApiMsgTableData[scope.$index]['name'])">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">
                            取消选择
                        </el-button>
                        <div class="pagination">
                            <el-pagination
                                    @current-change="handleCurrentChange"
                                    @size-change="handleSizeChange"
                                    :current-page="apiMsgPage.currentPage"
                                    :page-size="apiMsgPage.sizePage"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="apiMsgPage.total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>

            </el-tab-pane>
            <el-tab-pane label="接口配置" name="second" v-if="apiEditViewStatus"
                         style="background-color: rgb(250, 250, 250);min-height: 780px">
                <apiEdit
                        :projectName="form.projectName"
                        :module="form.module"
                        :configData="form.config"
                        :proModelData="proModelData"
                        :proUrlData="proUrlData"
                        @findApiMsg="findApiMsg"
                        @apiTest="apiTest"
                        ref="apiFunc">
                </apiEdit>

            </el-tab-pane>
        </el-tabs>

        <el-dialog title="接口模块配置" :visible.sync="moduleData.viewStatus" width="30%">
            <el-form>
                <el-form-item label="模块名称" label-width="100px">
                    <el-input v-model="moduleData.name">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="moduleData.viewStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="addModule()">确 定</el-button>
            </div>
        </el-dialog>

        <importApi
                :projectName="form.projectName"
                :moduleData="form.module"
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
    import apiEdit from './apiEdit.vue'
    import errorView from '../common/errorView.vue'
    import configEdit from '../config/configEdit.vue'

    export default {
        components: {
            result: result,
            importApi: importApi,
            apiEdit: apiEdit,
            errorView: errorView,
            configEdit: configEdit,

        },
        name: 'caseManage',
        data() {
            return {
                apiEditViewStatus: false,//  接口配置组件显示控制
                numTab: 'first',
                loading: false,  //  页面加载状态开关
                proModelData: '',
                proAndIdData: '',
                configData: '',
                proUrlData: null,
                ApiMsgTableData: Array(),//  接口表单数据
                apiMsgList: Array(),//  临时存储接口数据
                funcAddress: null,
                moduleDataList: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                apiMsgPage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 20,
                },
                modulePage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 30,
                },
                moduleData: {
                    viewStatus: false,
                    id: '',
                    num: '',
                    name: '',
                },
                form: {
                    config: {
                        name: '',
                        configId: '',
                    },
                    module: {
                        name: '',
                        moduleId: '',
                        num: '',
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
                //  初始化页面所需要的数据
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.proAndIdData = response.data['pro_and_id'];
                        this.configData = response.data['config_name_list'];
                        this.proUrlData = response.data['urlData'];
                        if (response.data['user_pro']) {
                            this.form.projectName = response.data['user_pro']['pro_name'];
                            if (this.configData[this.form.projectName][0]) {
                                this.form.config = this.configData[this.form.projectName][0];
                            }
                            this.findModule()
                        }
                        this.$axios.post(this.$api.getFuncAddressApi).then((response) => {
                                this.funcAddress = response['data']['data'];
                            }
                        )

                    }
                )
            },
            moduleCommand(command) {
                //  模块处理函数，根据命令执行不同操作
                if (command === 'add') {
                    this.initModuleData()
                } else if (command === 'edit') {
                    this.editModule()
                } else if (command === 'stick') {
                    this.stickModule()
                } else if (command === 'del') {
                    this.sureView(this.delModule, null, this.form.module.name)
                }
            },
            handleCurrentChange(val) {
                this.apiMsgPage.currentPage = val;
                this.findApiMsg();
            },
            handleSizeChange(val) {
                this.apiMsgPage.sizePage = val;
                this.findApiMsg();

            },

            findApiMsg() {
                //  查询接口信息
                if (this.form.module === null) {
                    this.$message({
                        showClose: true,
                        message: '请选择模块',
                        type: 'warning',
                    });
                    return
                }
                this.$axios.post(this.$api.findApiApi, {
                    'apiName': this.form.apiName,
                    'projectName': this.form.projectName,
                    'moduleId': this.form.module.moduleId,
                    'page': this.apiMsgPage.currentPage,
                    'sizePage': this.apiMsgPage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.ApiMsgTableData = response.data['data'];
                            this.apiMsgPage.total = response.data['total'];
                        }
                    }
                )
            },
            initData() {
                //  初始化数据并进入接口编辑tab
                if (!this.form.module) {
                    this.$message({
                        showClose: true,
                        message: '请先创建接口模块',
                        type: 'warning',
                    });
                    return
                }
                this.apiEditViewStatus = true;
                this.numTab = 'second';
                setTimeout(() => {
                    this.$refs.apiFunc.initApiMsgData();
                }, 0)
            },

            editCopyApi(apiMsgId, status) {
                //  编辑或者复制接口信息
                this.apiEditViewStatus = true;
                this.numTab = 'second';
                setTimeout(() => {
                    this.$refs.apiFunc.editCopyApiMsg(apiMsgId, status);
                }, 0)
            },

            delApi(apiMsgId) {
                //  删除接口信息
                this.$axios.post(this.$api.delApiApi, {'apiMsgId': apiMsgId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.apiName = null;
                        if ((this.apiMsgPage.currentPage - 1) * this.apiMsgPage.sizePage + 1 === this.apiMsgPage.total) {
                            this.apiMsgPage.currentPage = this.apiMsgPage.currentPage - 1
                        }
                        this.findApiMsg();
                    }
                )
            },
            apiTest(apiMsgData = null) {
                //  接口调试
                this.loading = true;
                this.$axios.post(this.$api.runApiApi, {
                    'apiMsgData': apiMsgData,
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
                        } else {
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

            handleApiMsgSelection(val) {
                this.apiMsgList = val;
            },

            cancelSelection() {
                //  清除接口选择
                this.$refs.apiMultipleTable.clearSelection();
            },

            initProjectChoice() {
                //  当项目选择项改变时，初始化模块和配置的数据
                this.form.config = {name: null, configId: null,};
                this.form.module = {name: null, moduleId: null,};
                this.modulePage.currentPage = 1;
                this.apiMsgPage.currentPage = 1;
                this.findModule()
            },

            findModule() {
                //  查询接口模块
                this.$axios.post(this.$api.findModuleApi, {
                    'projectName': this.form.projectName,
                    'page': this.modulePage.currentPage,
                    'sizePage': this.modulePage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.moduleDataList = response.data['data'];
                            this.proModelData[this.form.projectName] = response.data['all_module'];
                            this.modulePage.total = response.data['total'];
                            this.form.module = this.moduleDataList[0];
                            if (this.form.module) {
                                this.$nextTick(function () {
                                    this.$refs.testTree.setCurrentKey(this.form.module.moduleId);  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
                                });
                                this.findApiMsg();
                            } else {
                                this.ApiMsgTableData = []
                            }

                        }
                    }
                )
            },
            tabChange(tab) {
                //  当tab切换到接口信息时，刷新列表
                if (tab.label === '接口信息') {
                    this.findApiMsg()
                }
            },
            treeClick(data) {
                //  点击节点时，初始化数据并获取对应的接口信息
                let index = this.moduleDataList.map(item => item.moduleId).indexOf(data['moduleId']);  //  获取当前节点的下标
                this.form.module = this.moduleDataList[index];
                this.apiMsgPage.currentPage = 1;
                this.findApiMsg();
            },
            handleModuleCurrentChange(val) {
                this.modulePage.currentPage = val;
                this.findModule()
            },
            initModuleData() {
                //  打开窗口时，初始化模块窗口数据
                this.moduleData.name = '';
                this.moduleData.id = '';
                this.moduleData.num = '';
                this.moduleData.viewStatus = true;
            },
            editModule() {
                //  编辑模块
                if (!this.form.module) {
                    this.$message({
                        showClose: true,
                        message: '请先创建接口模块',
                        type: 'warning',
                    });
                    return
                }
                this.moduleData.name = this.form.module.name;
                this.moduleData.id = this.form.module.moduleId;
                this.moduleData.num = this.form.module.num;
                this.moduleData.viewStatus = true;
            },
            addModule() {
                //  添加模块
                this.$axios.post(this.$api.addModuleApi, {
                    'projectName': this.form.projectName,
                    'name': this.moduleData.name,
                    'id': this.moduleData.id,
                    'num': this.moduleData.num,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.moduleData.viewStatus = false;
                            this.findModule();
                        }
                    }
                )
            },
            delModule() {
                //  删除模块
                this.$axios.post(this.$api.delModuleApi, {'id': this.form.module.moduleId}).then((response) => {
                        this.messageShow(this, response);
                        this.moduleData.name = '';
                        if ((this.modulePage.currentPage - 1) * this.modulePage.sizePage + 1 === this.modulePage.total) {
                            this.modulePage.currentPage = this.modulePage.currentPage - 1
                        }
                        this.findModule();
                    }
                )
            },
            stickModule() {
                //  置顶模块
                this.$axios.post(this.$api.stickModuleApi, {
                    'id': this.form.module.moduleId,
                    'projectName': this.form.projectName,
                }).then((response) => {
                        this.messageShow(this, response);
                        this.findModule();
                    }
                )
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
