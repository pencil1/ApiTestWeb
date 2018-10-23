<template>
    <div class="sceneManage" v-loading="this.loading">
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
            <el-form-item label="用例名称">
                <el-input placeholder="请输入用例" v-model="form.sceneName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findSet()">搜索</el-button>
                <el-button type="primary" @click.native="$refs.sceneEditFunc.initSceneData()">添加接口用例</el-button>
                <el-button type="primary" @click.native="runScene(sceneList,true)">批量运行</el-button>
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
                    style="border-style:solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;border-width: 1px;">
                <el-row>
                    <el-col style="border-style:solid;border-color: #ead4d4;border-width: 1px;padding:2px">
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
                    <el-scrollbar>
                        <el-tree
                                ref="testTree"
                                @node-click="handleNodeClick"
                                class="filter-tree"
                                highlight-current
                                node-key="id"
                                :data="setDataList"
                                :props="defaultProps"
                                style="height: 800px;">
                        </el-tree>
                    </el-scrollbar>
                </el-row>
            </el-col>
            <el-col :span="21">
                <el-scrollbar wrapStyle="height:800px;">
                    <el-tabs value="first" style="padding-left: 10px">
                        <el-tab-pane label="业务列表" name="first">
                            <el-table
                                    ref="sceneMultipleTable"
                                    @selection-change="handleSceneSelection"
                                    :data="sceneAll" stripe>
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
                                                   @click.native="$refs.sceneEditFunc.editScene(sceneAll[scope.$index]['sceneId'])">
                                            编辑
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-tickets" size="mini"
                                                   @click.native="$refs.sceneEditFunc.editScene(sceneAll[scope.$index]['sceneId'],true)">
                                            复制
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-setting" size="mini"
                                                   @click.native="runScene(sceneAll[scope.$index]['sceneId'])">运行
                                        </el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="sureView(delScene,sceneAll[scope.$index]['sceneId'])">
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
                                        @current-change="handleCurrentChange"
                                        @size-change="handleSizeChange"
                                        :page-size="20"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="this.total">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-scrollbar>
            </el-col>

        </el-row>
        <setEdit
                :projectName="form.projectName"
                :setTempData="setTempData"
                ref="setEditFunc">

        </setEdit>
        <sceneEdit
                :allSetList="allSetList"
                :proModelData="proModelData"
                :projectName="form.projectName"
                :setTempData="setTempData"
                :configData="configData"
                :funcAddress="funcAddress"
                ref="sceneEditFunc">

        </sceneEdit>

        <errorView ref="errorViewFunc">
        </errorView>

        <result ref="resultFunc">
        </result>

    </div>
</template>

<script>
    import setEdit from './setEdit.vue'
    import sceneEdit from './sceneEdit.vue'
    import errorView from '../common/errorView.vue'
    import result from '../case/result.vue'

    export default {
        components: {
            setEdit: setEdit,
            sceneEdit: sceneEdit,
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
                sceneList: [],
                proModelData: '',
                loading: false,
                configData: '',
                sceneAll: [],
                total: 1,
                currentPage: 1,
                sizePage: 20,
                setTempData: {
                    name: null,
                    setId: null,
                },
                form: {
                    projectName: '',
                    sceneName: '',
                },

            }
        },


        methods: {
            handleNodeClick(data) {
                this.setTempData.setId = data['id'];
                this.setTempData.name = data['label'];
                this.findScenes();
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            findSuite() {
                this.apiSuiteViewStatus = false;
                this.$axios.post('/api/api/suite/find', {
                    'suiteName': this.form.caseName,
                    'modelName': this.form.modelName,
                    'projectName': this.form.apiMesProjectName,
                    'page': this.scenePage.currentPage,
                    'sizePage': this.scenePage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.suiteData = response.data['data'];
                            this.scenePage.total = response.data['total'];
                        }
                    }
                )
            },
            findScenes() {
                this.$axios.post('/api/api/scene/find', {
                    'setId': this.setTempData.setId,
                    'projectName': this.form.projectName,
                    'sceneName': this.form.sceneName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.sceneAll = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            findOldScenes() {
                this.$axios.post('/api/api/scene/findOld', {
                    'projectName': this.form.projectName,
                    'sceneName': this.form.sceneName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.sceneAll = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            initSceneViewData() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.configData = response.data['config_name_list'];
                        this.form.projectName = response.data['user_pro']['pro_name'];
                        this.findSet();
                    }
                );
                this.$axios.post('/api/api/func/getAddress').then((response) => {
                        this.funcAddress = response['data']['data'];
                    }
                );
            },
            findSet() {
                this.$axios.post('/api/api/set/find', {'projectName': this.form.projectName,}).then((response) => {
                        this.setDataList = response.data['data'][this.form.projectName];
                        this.allSetList = response.data['data'];
                        if (response.data['data'][this.form.projectName][0]) {
                            this.setTempData.setId = response.data['data'][this.form.projectName][0]['id'];
                            this.setTempData.name = response.data['data'][this.form.projectName][0]['label'];
                            this.$nextTick(function () {
                                this.$refs.testTree.setCurrentKey(this.setTempData.setId);  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
                            });
                        }
                        this.findScenes();
                    }
                );
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findScenes()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findScenes()
            },
            delScene(sceneId) {
                this.$axios.post('/api/api/scene/del', {'sceneId': sceneId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.sceneName = '';
                        this.findScenes();
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
                this.$axios.post('/api/api/report/run', {
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
                                console.log(response['data']['data']['data']['details'][i]['records'])
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

            handleSceneSelection(val) {
                this.sceneList = val;
            },
            cancelSelection() {
                this.$refs.sceneMultipleTable.clearSelection();
            },
            delSet() {
                this.$axios.post('/api/api/set/del', {
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
            this.initSceneViewData();

        },
    }
</script>

<style>

</style>
