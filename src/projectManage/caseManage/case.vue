<template>
    <div class="sceneManage" v-loading="this.loading">
        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目名称" labelWidth="110px">
                <el-select v-model="form.projectName" placeholder="请选择项目" @change="findSet">
                    <el-option
                            v-for="(item, key) in proModelData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="用例名称">
                <el-input placeholder="请输入用例" v-model="form.caseName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findSet()">搜索</el-button>
                <el-button type="primary" @click.native="$refs.caseEditFunc.initCaseData()">添加接口用例</el-button>
                <el-button type="primary" @click.native="runScene(caseList,true)">批量运行</el-button>
                <el-button type="primary" icon="el-icon-search" @click.native="findOldScenes()">搜索旧数据</el-button>
                <el-switch
                        v-model="switchStatus"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="取消生成报告"
                >
                </el-switch>
            </el-form-item>

        </el-form>

        <el-row>
            <el-col :span="3"
                    style="border:1px solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;">
                <el-row>
                    <el-col style="border:1px solid;border-color: #ffffff #ffffff rgb(234, 234, 234) #ffffff;padding:2px">
                        <el-button-group style="float:right;">
                            <el-button size="mini" type="primary" @click.native="$refs.setEditFunc.initSet()">添加
                            </el-button>
                            <el-button size="mini" type="primary" @click.native="$refs.setEditFunc.editSet()">编辑
                            </el-button>
                            <el-button size="mini" type="success"
                                       @click.native="$refs.setEditFunc.stickSet(setTempData.setId)">置顶
                            </el-button>
                            <el-button size="mini" type="danger" @click.native="sureView(delSet)">删除</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row>
                    <el-scrollbar wrapStyle="height:776px;">
                        <el-tree
                                ref="testTree"
                                @node-click="handleNodeClick"
                                class="filter-tree"
                                highlight-current
                                node-key="id"
                                :data="setDataList"
                                :props="defaultProps"

                        >
                        </el-tree>
                    </el-scrollbar>
                    <el-pagination
                            small
                            @current-change="handleSetCurrentChange"
                            @size-change="handleSetSizeChange"
                            :page-size="30"
                            layout="prev, pager, next"
                            :total="this.setPage.total">
                    </el-pagination>
                </el-row>
            </el-col>
            <el-col :span="21">
                    <el-tabs value="first" style="padding-left: 10px;padding-right:5px;">
                        <el-tab-pane label="用例列表" name="first">
                            <el-table
                                    ref="sceneMultipleTable"
                                    @selection-change="handleCaseSelection"
                                    :data="caseAll"
                                    max-height="748"
                                    stripe>
                                <el-table-column
                                        type="selection"
                                        width="40">
                                </el-table-column>
                                <el-table-column
                                        prop="num"
                                        label="编号"
                                        min-width="10">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="名称"
                                        min-width="50">
                                </el-table-column>
                                <el-table-column
                                        prop="desc"
                                        label="描述"
                                        min-width="50">
                                </el-table-column>
                                <el-table-column
                                        label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                                   @click.native="$refs.caseEditFunc.editCase(caseAll[scope.$index]['sceneId'])">
                                            编辑
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-tickets" size="mini"
                                                   @click.native="$refs.caseEditFunc.editCase(caseAll[scope.$index]['sceneId'],true)">
                                            复制
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-setting" size="mini"
                                                   @click.native="runScene(caseAll[scope.$index]['sceneId'])">运行
                                        </el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="sureView(delCase,caseAll[scope.$index]['sceneId'])">
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-button @click="cancelSelection()" size="mini"
                                       style="position: absolute;margin-top: 2px;">取消选择
                            </el-button>

                            <div class="pagination">
                                <el-pagination
                                        @current-change="handleCaseCurrentChange"
                                        @size-change="handleCaseSizeChange"
                                        :page-size="20"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="this.casePage.total">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
            </el-col>

        </el-row>
        <setEdit
                :projectName="form.projectName"
                :setTempData="setTempData"
                ref="setEditFunc">

        </setEdit>
        <caseEdit
                :allSetList="allSetList"
                :proModelData="proModelData"
                :projectName="form.projectName"
                :setTempData="setTempData"
                :configData="configData"
                :funcAddress="funcAddress"
                ref="caseEditFunc">

        </caseEdit>

        <errorView ref="errorViewFunc">
        </errorView>

        <result ref="resultFunc">
        </result>

    </div>
</template>

<script>
    import setEdit from './setEdit.vue'
    import caseEdit from './caseEdit.vue'
    import errorView from '../common/errorView.vue'
    import result from '../apiMessage/result.vue'

    export default {
        components: {
            setEdit: setEdit,
            caseEdit: caseEdit,
            errorView: errorView,
            result: result,

        },
        name: 'modeManage',
        data() {
            return {
                switchStatus: true,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                allSetList: '',
                setDataList: [],
                funcAddress: '',
                tempNum: '',
                caseList: [],
                proModelData: '',
                loading: false,
                configData: '',
                caseAll: [],
                casePage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 20,
                },
                setPage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 30,
                },
                setTempData: {
                    name: null,
                    setId: null,
                },
                form: {
                    projectName: '',
                    caseName: '',
                },

            }
        },


        methods: {
            handleNodeClick(data) {
                this.setTempData.setId = data['id'];
                this.setTempData.name = data['label'];
                this.casePage.currentPage = 1;
                this.findCase();
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            findSuite() {
                this.apiSuiteViewStatus = false;
                this.$axios.post('/apiMessage/apiMessage/suite/find', {
                    'suiteName': this.form.caseName,
                    'modelName': this.form.modelName,
                    'projectName': this.form.apiMesProjectName,
                    'page': this.casePage.currentPage,
                    'sizePage': this.casePage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.suiteData = response.data['data'];
                            this.casePage.total = response.data['total'];
                        }
                    }
                )
            },
            findCase() {
                this.$axios.post(this.$api.findCaseApi, {
                    'setId': this.setTempData.setId,
                    'projectName': this.form.projectName,
                    'caseName': this.form.caseName,
                    'page': this.casePage.currentPage,
                    'sizePage': this.casePage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.caseAll = response.data['data'];
                            this.casePage.total = response.data['total'];
                        }
                    }
                )
            },
            findOldScenes() {
                this.$axios.post('/api/scene/findOld', {
                    'projectName': this.form.projectName,
                    'caseName': this.form.caseName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.caseAll = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            initCaseViewData() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.configData = response.data['config_name_list'];
                        if (response.data['user_pro']){
                            this.form.projectName = response.data['user_pro']['pro_name'];
                            this.findSet();
                        }
                        this.allSetList = response.data['set_list'];
                    }
                );
                this.$axios.post(this.$api.getFuncAddressApi).then((response) => {
                        this.funcAddress = response['data']['data'];
                    }
                );
            },
            findSet() {
                this.$axios.post(this.$api.findCaseSetApi, {
                    'projectName': this.form.projectName,
                    'page': this.setPage.currentPage,
                    'sizePage': this.setPage.sizePage,
                }).then((response) => {
                        this.setDataList = response.data['data'];
                        this.allSetList[this.form.projectName] = response.data['all_set'];
                        this.setPage.total = response.data['total'];
                        if (this.setDataList[0]) {
                            this.setTempData.setId = this.setDataList[0]['id'];
                            this.setTempData.name = this.setDataList[0]['label'];
                            this.$nextTick(function () {
                                this.$refs.testTree.setCurrentKey(this.setTempData.setId);  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
                            });
                        }
                        this.findCase();
                    }
                );
            },
            handleCaseCurrentChange(val) {
                this.casePage.currentPage = val;
                this.findCase()
            },
            handleCaseSizeChange(val) {
                this.casePage.sizePage = val;
                this.findCase()
            },
            handleSetCurrentChange(val) {
                this.setPage.currentPage = val;
                this.findSet()
            },
            handleSetSizeChange(val) {
                this.setPage.sizePage = val;
                this.findSet()
            },
            delCase(caseId) {
                this.$axios.post(this.$api.delCaseApi, {'caseId': caseId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.caseName = '';
                        this.findCase();
                    }
                )
            },
            runScene(sceneIds, status = false) {
                let _sceneIds = [];
                if (status) {
                    for (let i = 0; i < sceneIds.length; i++) {
                        _sceneIds.push(sceneIds[i].sceneId);
                    }
                }
                else {
                    _sceneIds.push(sceneIds)
                }
                this.loading = true;
                this.$axios.post(this.$api.runCaseApi, {
                    'reportStatus': this.switchStatus,
                    'sceneIds': _sceneIds,
                    'projectName': this.form.projectName
                }).then((response) => {
                        this.loading = false;
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
                        }
                        if (this.switchStatus) {
                            let tempData = {'details': [{'records': [], 'in_out': {'out': ''}}]};

                            for (let i = 0; i < response['data']['data']['data']['details'].length; i++) {
                                tempData['details'][0]['records'] = tempData['details'][0]['records'].concat(response['data']['data']['data']['details'][i]['records'])
                            }
                            this.$refs.resultFunc.showData(tempData);
                        }
                        else {
                            let {href} = this.$router.resolve({
                                path: 'reportShow',
                                query: {reportId: response.data['data']['report_id']}
                            });
                            window.open(href, '_blank');
                        }

                    }
                );
            },

            handleCaseSelection(val) {
                this.caseList = val;
            },
            cancelSelection() {
                this.$refs.sceneMultipleTable.clearSelection();
            },
            delSet() {
                this.$axios.post(this.$api.delCaseSetApi, {
                    'id': this.setTempData.setId,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.findSet();
                        }
                    }
                )
            },
        },
        mounted() {
            this.initCaseViewData();

        },
    }
</script>

<style>

</style>
