<template>
    <div class="sceneEdit">

        <el-dialog title="用例"
                   :visible.sync="caseData.modelFormVisible"
                   :close-on-click-modal="false"
                   :width="mainWidth"
                   top="5vh">

            <el-tabs value="first" @tab-click="changeShow">
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
                    <el-row :gutter="24">
                        <el-col :span="stepSpan">
                            <el-row :gutter="24"
                                    style="margin-top:10px;color: rgb(171, 139, 149);font-weight: 500;font-size: 14px;
                                    width: 100%;
                                            border-style:solid;
                                           border-color: #ffffff #ffffff rgb(234, 234, 234) #ffffff;
                                           border-width: 1px;">
                                <el-col :span="3" style="padding-left: 20px;padding-top: 3px">
                                    状态
                                </el-col>
                                <el-col :span="5" style="padding-top: 3px">
                                    步骤名称
                                </el-col>
                                <el-col :span="4" style="padding-top: 3px">
                                    接口名称
                                </el-col>
                                <el-col :span="4" style="padding-top: 3px">
                                    次数
                                </el-col>
                                <el-col :span="6" style="padding-left: 50px;padding-top: 3px">
                                    操作
                                </el-col>
                                <el-col :span="2">
                                    <div @click.prevent="showApiData" style="color: #55a9ff">
                                        <i class="my-icon-xiangzuo-copy" v-show="!showApiDataStatus"></i>
                                        <i class="my-icon-xiangyou" v-show="showApiDataStatus"></i>
                                    </div>
                                </el-col>
                            </el-row>
                            <draggable v-model="caseData.apiCases" :options="{group:'apiData',animation:300}"
                                       style="width: 99%;min-height: 10px;">
                                <div v-for="(_data, index) in caseData.apiCases"
                                     :key="index"
                                     class="list-complete-item">
                                    <el-row :gutter="21">
                                        <el-col :span="2" style="padding-top: 3px">
                                            <el-switch v-model="caseData.apiCases[index]['status']">
                                            </el-switch>
                                        </el-col>
                                        <el-col :span="5">
                                            <el-input v-model="caseData.apiCases[index]['case_name']"
                                                      size="mini">
                                            </el-input>
                                        </el-col>
                                        <el-col :span="4"
                                                style="padding-top: 3px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                            {{ _data.name }}
                                        </el-col>
                                        <el-col :span="4">
                                            <el-input-number size="mini" :precision="0"
                                                             v-model="caseData.apiCases[index]['time']"
                                                             :min="1" :max="1000">
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="1">
                                        </el-col>
                                        <el-col :span="8" style="padding-left: 50px;padding-top: 3px">
                                            <el-button type="danger" size="mini"
                                                       @click.native="delApiCase(index)">删除
                                            </el-button>
                                            <el-button type="primary" size="mini"
                                                       @click.native="$refs.apiMessageEditFunc.initData(index)">
                                                配置
                                            </el-button>
                                        </el-col>
                                    </el-row>

                                </div>
                            </draggable>
                        </el-col>


                        <el-col :span="12" v-show="!showApiDataStatus">
                            <el-form :inline="true" style="padding-top: 10px;" size="small">
                                <el-form-item label=" " labelWidth="10px">
                                    <el-select v-model="form.apiMesProjectName"
                                               style="width: 150px"
                                               placeholder="请选择项目"
                                               @change="changeModuleChoice">
                                        <el-option
                                                v-for="(item, key) in proModelData"
                                                :key="key"
                                                :value="key">
                                        </el-option>
                                    </el-select>

                                    <el-select v-model="form.module"
                                               value-key="moduleId"
                                               style="width: 150px"
                                               placeholder="请选择模块">
                                        <el-option
                                                v-for="item in proModelData[this.form.apiMesProjectName]"
                                                :key="item.moduleId"
                                                :label="item.name"
                                                :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-input placeholder="请输入用例" v-model="form.caseName" style="width: 150px">
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click.native="findApiMsg()" size="mini">
                                        搜索接口
                                    </el-button>
                                    <el-button type="primary" size="mini" @click.native="addApiData()">添加
                                    </el-button>
                                </el-form-item>
                            </el-form>
                            <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
                            <el-row :gutter="18"
                                    style="margin-top:10px;color: rgb(171, 139, 149);font-weight: 500;font-size: 14px;
                                            padding-left: 5px;padding-top: 3px;">
                                <el-col :span="1">
                                    .
                                </el-col>
                                <el-col :span="2">
                                    编号
                                </el-col>
                                <el-col :span="4">
                                    用例名称

                                </el-col>
                                <el-col :span="4">
                                    用例描述
                                </el-col>
                                <el-col :span="8">
                                    接口地址
                                </el-col>
                            </el-row>
                            <draggable v-model="ApiMsgData"
                                       :options="{group:{ name:'apiData',  pull:'clone', put:false }}"
                            >
                                <transition-group name="list-complete">
                                    <div v-for="(_data, index) in ApiMsgData"
                                         :key="index"
                                         class="list-complete-item">
                                        <el-row :gutter="24">
                                            <el-col :span="1">
                                                <el-radio v-model="radio" @change="addEvent(index)" :label="index">
                                                    {{null}}
                                                </el-radio>
                                                <!--<el-checkbox @change="addEvent" true-label="1" false-label="0">-->
                                                <!---->
                                                <!--</el-checkbox>-->
                                            </el-col>
                                            <el-col :span="2">
                                                {{ _data.num }}
                                            </el-col>
                                            <el-col :span="4"
                                                    style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                                {{ _data.name }}
                                            </el-col>
                                            <el-col :span="4"
                                                    style="padding-top: 1px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                            >
                                                {{ _data.desc }}
                                            </el-col>
                                            <el-col :span="8">
                                                {{ _data.url }}
                                            </el-col>
                                        </el-row>

                                    </div>
                                </transition-group>
                            </draggable>
                            <!--<el-button @click="cancelSelection()" size="mini"-->
                                       <!--style="position: absolute;margin-top: 2px;">取消选择-->
                            <!--</el-button>-->
                            <div class="block" style="float:right; position: relative;">
                                <el-pagination
                                        @current-change="handleCurrentCase"
                                        @size-change="handleSizeCase"
                                        :page-size="15"
                                        :page-sizes="[15, 30, 45, 60]"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="this.apiMsgPage.total">
                                </el-pagination>
                            </div>
                        </el-col>
                    </el-row>

                </el-tab-pane>


            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="caseData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="success" @click.native="addCase(false)" size="small">保 存</el-button>
                <el-button type="primary" @click.native="addCase()" size="small">确 定</el-button>
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
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable,
            apiMsgDataEdit,
        },
        name: 'sceneEdit',
        props: ['proModelData', 'projectName', 'allSetList', 'setTempData', 'configData', 'funcAddress'],
        data() {
            return {
                apiMsgVessel: [], //接口用例容器，勾选的内容都存在此变量
                ApiMsgData: [], // 接口信息里面的表格数据
                mainWidth: '50%',
                list2: [],
                radio: '',
                showApiDataStatus: true,
                stepSpan: 24,
                apiMsgPage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 15,
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
                    apiName: '',
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
            addEvent(dex) {
                this.apiMsgVessel = this.ApiMsgData[dex];
            },
            showApiData: function () {
                this.showApiDataStatus = !this.showApiDataStatus;
                if (this.showApiDataStatus) {
                    this.mainWidth = '50%';
                    this.stepSpan = 24

                }
                else {
                    this.mainWidth = '80%';
                    this.stepSpan = 12
                }
            },
            changeShow(tab) {
                if (tab.label === '用例信息') {
                    this.mainWidth = '50%'
                }
                else if(this.showApiDataStatus) {
                    this.mainWidth = '50%'
                }
                else {
                    this.mainWidth = '80%'
                }
            },
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
                console.log(this.caseData.apiCases)
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
                this.radio = false;
                this.findApiMsg();
            },
            changeConfigChoice() {
                if (this.configData[this.form.sceneVariableProjectName][0]) {
                    this.form.config = this.configData[this.form.sceneVariableProjectName][0];
                }
                else {
                    this.form.config = null
                }
            },
            // upNum(i) {
            //     if (i === 0) {
            //         this.$message({
            //             showClose: true,
            //             message: '当前序号已最高',
            //             type: 'warning',
            //         });
            //         return
            //     }
            //     let d = this.caseData.apiCases[i];
            //     this.caseData.apiCases.splice(i, 1);
            //     this.caseData.apiCases.splice(i - 1, 0, d);
            //     this.againSort()
            // },
            // downNum(i) {
            //     if (i === (this.caseData.apiCases.length - 1)) {
            //         this.$message({
            //             showClose: true,
            //             message: '当前序号已最低',
            //             type: 'warning',
            //         });
            //         return
            //     }
            //     let d = this.caseData.apiCases[i];
            //     this.caseData.apiCases.splice(i, 1);
            //     this.caseData.apiCases.splice(i + 1, 0, d);
            //     this.againSort()
            // },
            // againSort() {
            //     for (let i = 0; i < this.caseData.apiCases.length; i++) {
            //         this.caseData.apiCases[i]['num'] = i
            //     }
            // },
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
            // handleApiMsgDataSelection(val) {
            //     this.apiMsgVessel = val;
            // },
            handleCurrentCase(val) {
                this.apiMsgPage.currentPage = val;
                this.findApiMsg()
            },
            handleSizeCase(val) {
                this.apiMsgPage.sizePage = val;
                this.findApiMsg()
            },
            // cancelSelection() {
            //     this.$refs.multipleTable.clearSelection();
            // },
            findApiMsg() {
                this.$axios.post(this.$api.findApiApi, {
                    'projectName': this.form.apiMesProjectName,
                    'moduleId': this.form.module.moduleId,
                    'apiName': this.form.apiName,
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
                // this.$refs.multipleTable.clearSelection();
                // this.againSort()
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
            addCase(closeView = true) {

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
                            if (!closeView) {
                                if (response.data['case_id']) {
                                    this.editCase(response.data['case_id'])
                                }
                            }
                            else {
                                this.caseData.modelFormVisible = false;
                            }
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
    .list-complete-item {
        padding: 4px;
        margin-top: 4px;
        border: solid 1px rgb(224, 221, 221);
        border-radius: 4px;
        background-color: rgb(250, 250, 250);
    }


</style>
