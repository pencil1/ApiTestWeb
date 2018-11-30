<template>
    <div class="sceneEdit">

        <el-dialog title="用例"
                   :visible.sync="caseData.modelFormVisible"
                   :close-on-click-modal="false"
                   width="50%" top="5vh">

            <el-tabs value="first">
                <el-tab-pane label="用例信息" name="first" style="margin-top: 10px">
                    <el-form size="small" :inline="true">
                        <el-form-item label="用例名称" :label-width="caseData.formLabelWidth">
                            <el-input v-model="caseData.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="项目选择" :label-width="caseData.formLabelWidth">
                            <el-select v-model="form.projectName" placeholder="请选择项目" @change="changeSetChoice">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用例编号" :label-width="caseData.formLabelWidth" v-if="caseData.id">
                            <el-input v-model.number="caseData.num" :minlength="215">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" size="small">
                        <el-form-item label="用例描述" :label-width="caseData.formLabelWidth">
                            <el-input v-model="caseData.desc">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="集合选择" :label-width="caseData.formLabelWidth">
                            <el-select v-model="form.set" placeholder="请选择用例集" value-key="id">
                                <el-option
                                        v-for="item in allSetList[form.projectName]"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="执行次数" label-width="70px">
                            <el-input-number v-model="caseData.times" :min="1" :max="1000">
                            </el-input-number>
                        </el-form-item>
                    </el-form>
                    <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
                    <el-form :inline="true" class="demo-form-inline " size="small">
                        <el-form-item label=" " labelWidth="10px">
                            <el-select v-model="form.sceneVariableProjectName" placeholder="请选择项目"
                                       @change="changeConfigChoice">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                            <el-select v-model="form.config" value-key="configId" placeholder="请选择配置">
                                <el-option
                                        v-for="item in configData[form.sceneVariableProjectName]"
                                        :key="item.configId"
                                        :label="item.name"
                                        :value="item">
                                </el-option>
                            </el-select>
                            <el-select v-model="caseData.funcAddress" multiple placeholder="请选择导入函数文件" size="small">
                                <el-option
                                        v-for="item in this.funcAddress"
                                        :key="item['value']"
                                        :label="item['value']"
                                        :value="item['value']">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click.native="addConfigData()">添加配置
                            </el-button>
                            <el-button type="primary" size="small"
                                       @click="addConfigVariable()">添加变量
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
                    <el-table :data="caseData.variable"
                              style="width:100%"
                              :show-header="false"
                              size="mini"
                              max-height="538"
                              stripe>
                        <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="small" placeholder="key">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" minWidth="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="small" placeholder="Value">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" minWidth="70">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="small" placeholder="备注">
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

                <el-tab-pane label="执行步骤" name="second">
                    <el-table
                            :data="caseData.apiCases"
                            max-height="685"
                            stripe>
                        <el-table-column
                                prop="num"
                                label="编号"
                                minWidth="18">
                        </el-table-column>

                        <el-table-column
                                prop="status"
                                label="状态"
                                minWidth="20">
                            <template slot-scope="scope">
                                <el-switch
                                        v-model="caseData.apiCases[scope.$index]['status']"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="步骤名称"
                                minWidth="50">
                            <template slot-scope="scope">
                                <el-input v-model="caseData.apiCases[scope.$index]['case_name']">
                                </el-input>
                            </template>
                        </el-table-column>

                        <el-table-column
                                prop="name"
                                label="接口名称"
                                minWidth="50">
                        </el-table-column>
                        <el-table-column
                                label="次数"
                                width="140">
                            <template slot-scope="scope">
                                <el-input-number size="small" :precision="0"
                                                 v-model="caseData.apiCases[scope.$index]['time']"
                                                 :min="1" :max="1000">
                                </el-input-number>
                                <!--<el-input v-module="caseList[scope.$index]['time']" auto-complete="off">-->
                                <!--</el-input>-->
                            </template>
                        </el-table-column>

                        <el-table-column
                                label="操作"
                                minWidth="120">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini"
                                           @click.native="upNum(scope.$index)">升序
                                </el-button>
                                <el-button type="primary" size="mini"
                                           @click.native="downNum(scope.$index)">降序
                                </el-button>
                                <el-button type="danger" size="mini"
                                           @click.native="delApiCase(scope.$index)">删除
                                </el-button>
                                <el-button type="primary" size="mini"
                                           @click.native="$refs.apiMessageEditFunc.initData(scope.$index)">配置
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="接口信息" name="third">
                    <el-form :inline="true" class="demo-form-inline search-style" size="small">
                        <el-form-item label=" " labelWidth="10px">
                            <el-select v-model="form.apiMesProjectName" placeholder="请选择项目"
                                       @change="changeModuleChoice">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                            <el-select v-model="form.module" value-key="moduleId" placeholder="请选择模块">
                                <el-option
                                        v-for="item in proModelData[this.form.apiMesProjectName]"
                                        :key="item.moduleId"
                                        :label="item.name"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">

                            <el-input placeholder="请输入用例" v-model="form.caseName">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click.native="findApiMsg()" size="small">
                                搜索接口
                            </el-button>
                            <!--<el-button type="primary" @click.native="findSuite()" size="small">-->
                            <!--搜索套件-->
                            <!--</el-button>-->
                            <el-button type="primary" size="small" @click.native="addApiData()">添加
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                            ref="multipleTable"
                            @selection-change="handleApiMsgDataSelection"
                            :data="ApiMsgData"
                            height="600"
                            stripe>
                        <el-table-column
                                type="selection"
                                width="40">
                        </el-table-column>

                        <el-table-column
                                prop="num"
                                label="编号"
                                width="50">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="用例名称"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="desc"
                                label="用例描述"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip=true
                                prop="url"
                                label="接口地址">
                        </el-table-column>
                    </el-table>
                    <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择
                    </el-button>
                    <div class="block" style="float:right; position: relative;">
                        <el-pagination
                                @current-change="handleCurrentCase"
                                @size-change="handleSizeCase"
                                :page-size="20"

                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.apiMsgPage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="caseData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addCase()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <apiMsgDataEdit
                :apiCases="caseData.apiCases"
                ref="apiMessageEditFunc">

        </apiMsgDataEdit>
    </div>
</template>

<script>
    import apiMsgDataEdit from './apiMsgDataEdit.vue'

    export default {
        components: {
            apiMsgDataEdit: apiMsgDataEdit,
        },
        name: 'sceneEdit',
        props: ['proModelData', 'projectName', 'allSetList', 'setTempData', 'configData', 'funcAddress'],
        data() {
            return {
                apiMsgVessel: [], //接口用例容器，勾选的内容都存在此变量
                ApiMsgData: [], // 接口信息里面的表格数据
                apiMsgPage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 20,
                },
                form: {
                    config: {
                        name: null,
                        configId: null,
                    },
                    set: {
                        label: null,
                        id: null,
                    },
                    module: {
                        name: null,
                        moduleId: null,
                    },
                    setName: '',
                    projectName: '',
                    apiMesProjectName: '',
                    sceneVariableProjectName: '',
                    caseName: '',
                },
                caseData: {
                    id: '',
                    num: '',
                    funcAddress: Array(),
                    modelFormVisible: false,
                    projectName: '',
                    variable: [],
                    desc: '',
                    times: '',
                    name: '',
                    formLabelWidth: '70px',
                    apiCases: [],// 执行步骤里面的所有接口信息
                },
            }
        },
        methods: {
            synchronousData() {
                let index = this.allSetList[this.projectName].map(item => item.id).indexOf(this.setTempData.setId);
                this.form.set = this.allSetList[this.projectName][index];
                this.form.module = this.proModelData[this.projectName][0];
                this.form.config = this.configData[this.projectName][0];
                this.form.projectName = this.projectName;
                this.form.apiMesProjectName = this.projectName;
                this.form.sceneVariableProjectName = this.projectName;

            },

            initCaseData() {
                if (this.projectName) {
                    this.synchronousData();
                    if (this.allSetList[this.projectName].length === 0) {
                        this.$message({
                            showClose: true,
                            message: '请先创建用例集',
                            type: 'warning',
                        });
                        return
                    }
                }

                this.caseData.apiCases = [];
                this.caseData.variable = [{key: '', value: '', remark: ''}];
                this.caseData.name = '';
                this.caseData.times = '';
                this.caseData.desc = '';
                this.caseData.id = '';
                this.caseData.funcAddress = Array();
                this.caseData.num = '';
                this.caseData.modelFormVisible = true;
                this.apiMsgVessel = [];
                this.findApiMsg();
                // this.cancelSelection();
                // this.toggleSelection();
            },
            editCase(caseId, copyEditStatus = false) {
                this.synchronousData();
                this.$axios.post(this.$api.editCaseApi, {
                    'caseId': caseId,
                    'copyEditStatus': copyEditStatus
                }).then((response) => {
                        this.caseData.name = response.data['data']['name'];
                        this.caseData.desc = response.data['data']['desc'];
                        this.caseData.times = response.data['data']['times'];
                        this.caseData.funcAddress = response.data['data']['func_address'];
                        this.caseData.apiCases = response.data['data']['cases'];
                        this.caseData.variable = response.data['data']['variable'];
                        this.form.setName = this.tempSetName;
                        if (copyEditStatus) {
                            this.caseData.id = '';
                            this.caseData.num = '';
                        }
                        else {
                            this.caseData.id = caseId;
                            this.caseData.num = response.data['data']['num'];
                        }
                        this.caseData.modelFormVisible = true;
                        this.findApiMsg();
                    }
                )
            },
            changeSetChoice() {
                if (this.allSetList[this.form.projectName][0]) {
                    this.form.set = this.allSetList[this.form.projectName][0];
                }
                else {
                    this.form.set = null
                }
            },
            changeModuleChoice() {
                this.form.module = this.proModelData[this.form.apiMesProjectName][0];
            },
            changeConfigChoice() {
                if (this.configData[this.form.sceneVariableProjectName][0]) {
                    this.form.config = this.configData[this.form.sceneVariableProjectName][0];
                }
                else {
                    this.form.config = null
                }
            },
            upNum(i) {
                if (i === 0) {
                    this.$message({
                        showClose: true,
                        message: '当前序号已最高',
                        type: 'warning',
                    });
                    return
                }
                let d = this.caseData.apiCases[i];
                this.caseData.apiCases.splice(i, 1);
                this.caseData.apiCases.splice(i - 1, 0, d);
                this.againSort()
            },
            downNum(i) {
                if (i === (this.caseData.apiCases.length - 1)) {
                    this.$message({
                        showClose: true,
                        message: '当前序号已最低',
                        type: 'warning',
                    });
                    return
                }
                let d = this.caseData.apiCases[i];
                this.caseData.apiCases.splice(i, 1);
                this.caseData.apiCases.splice(i + 1, 0, d);
                this.againSort()
            },
            againSort() {
                for (let i = 0; i < this.caseData.apiCases.length; i++) {
                    this.caseData.apiCases[i]['num'] = i
                }
            },
            delApiCase(i) {
                //判断caseList中是否存在id，存在则在数据库删除信息，否则在前端删除临时数据
                if ('id' in this.caseData.apiCases[i]) {
                    this.$axios.post('/api/apiCase/del', {'id': this.caseData.apiCases[i]['id']}).then((response) => {
                            this.caseData.apiCases.splice(i, 1);
                        }
                    )
                }
                else {
                    this.caseData.apiCases.splice(i, 1);
                }
            },
            handleApiMsgDataSelection(val) {
                this.apiMsgVessel = val;
            },
            handleCurrentCase(val) {
                this.apiMsgPage.currentPage = val;
                this.findApiMsg()
            },
            handleSizeCase(val) {
                this.apiMsgPage.sizePage = val;
                this.findApiMsg()
            },
            cancelSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            findApiMsg() {
                this.$axios.post(this.$api.findApiApi, {
                    'projectName': this.form.apiMesProjectName,
                    'moduleId': this.form.module.moduleId,
                    'caseName': this.form.caseName,
                    'page': this.apiMsgPage.currentPage,
                    'sizePage': this.apiMsgPage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.ApiMsgData = response.data['data'];
                            this.apiMsgPage.total = response.data['total'];
                        }
                    }
                )
            },
            addApiData() {
                if (this.apiMsgVessel.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请勾选接口信息',
                        type: 'warning',
                    });
                    return
                }
                this.caseData.apiCases = this.caseData.apiCases.concat(this.apiMsgVessel);
                this.caseData.apiCases = JSON.parse(JSON.stringify(this.caseData.apiCases));
                this.$refs.multipleTable.clearSelection();
                this.againSort()
            },
            addConfigData() {
                this.$axios.post(this.$api.configDataApi, {
                    'configId': this.form.config.configId
                }).then((response) => {
                        this.caseData.variable = this.caseData.variable.concat(response.data['data']['variables']);
                        this.caseData.variable = JSON.parse(JSON.stringify(this.caseData.variable));

                        this.caseData.funcAddress = response.data['data']['func_address'];
                    }
                )
            },
            addConfigVariable() {
                this.caseData.variable.push({key: '', value: '', remark: ''});
            },
            delConfigVariable(i) {
                this.caseData.variable.splice(i, 1);
            },
            addCase() {

                if (this.caseData.apiCases.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请添加接口信息到执行步骤',
                        type: 'warning',
                    });
                    return
                }
                if (this.caseData.name === '' || this.caseData.name === null) {
                    this.$message({
                        showClose: true,
                        message: '用例名字不能为空',
                        type: 'warning',
                    });
                    return
                }
                for (let i = 0; i < this.caseData.apiCases.length; i++) {
                    if (!(/(^[1-9]\d*$)/.test(this.caseData.apiCases[i]['time']))) {
                        this.$message({
                            showClose: true,
                            message: '第' + i + '条用例的执行次数请输入正整数',
                            type: 'warning',
                        });
                        return
                    }
                }
                this.$axios.post(this.$api.addCaseApi, {
                    'num': this.caseData.num,
                    'name': this.caseData.name,
                    'times': this.caseData.times,
                    'caseSetId': this.form.set.id,
                    'desc': this.caseData.desc,
                    'funcAddress': this.caseData.funcAddress,
                    'variable': JSON.stringify(this.caseData.variable),
                    'project': this.form.projectName,
                    'ids': this.caseData.id,
                    'apiCases': this.caseData.apiCases,

                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.caseData.modelFormVisible = false;
                            this.$parent.findCase();
                        }
                    }
                )
            },


        },
        mounted() {
        },
    }
</script>
<style>
</style>
