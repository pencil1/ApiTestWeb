<template>
    <div class="sceneEdit">

        <el-dialog title="用例" :visible.sync="sceneData.modelFormVisible" width="50%" top="5vh">

            <el-tabs value="fourth">
                <el-tab-pane label="用例信息" name="first" style="margin-top: 10px">
                    <el-form>
                        <el-form-item label="业务编号" :label-width="sceneData.formLabelWidth" v-if="sceneData.id"
                        >
                            <el-input v-model.number="sceneData.num">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="业务名称" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="sceneData.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="业务描述" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="sceneData.desc">
                            </el-input>
                        </el-form-item>

                        <el-form :inline="true">
                            <el-form-item label="项目名称" :label-width="sceneData.formLabelWidth">
                                <el-select v-model="form.projectName" placeholder="请选择项目" @change="changeSetChoice">
                                    <el-option
                                            v-for="(item, key) in proModelData"
                                            :key="key"
                                            :value="key">
                                    </el-option>
                                </el-select>
                                <el-select v-model="form.set" placeholder="请选择用例集" value-key="id">
                                    <el-option
                                            v-for="item in allSetList[this.projectName]"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="执行次数" label-width="70px">
                                <el-input-number v-model="sceneData.times" :min="1" :max="1000">
                                </el-input-number>
                            </el-form-item>
                        </el-form>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="执行步骤" name="second">
                    <el-table
                            :data="sceneData.apiCases"
                            height="660"
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
                                        v-model="sceneData.apiCases[scope.$index]['status']"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="用例名称"
                                minWidth="50">
                            <template slot-scope="scope">
                                <el-input v-model="sceneData.apiCases[scope.$index]['case_name']" auto-complete="off">
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
                                                 v-model="sceneData.apiCases[scope.$index]['time']"
                                                 :min="1" :max="1000">
                                </el-input-number>
                                <!--<el-input v-model="caseList[scope.$index]['time']" auto-complete="off">-->
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
                            <el-button type="primary" @click.native="findCases()" size="small">
                                搜索接口
                            </el-button>
                            <!--<el-button type="primary" @click.native="findSuite()" size="small">-->
                            <!--搜索套件-->
                            <!--</el-button>-->
                            <el-button type="primary" size="small" @click.native="addCaseData()">添加
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-table
                            ref="multipleTable"
                            @selection-change="handleCaseSelection"
                            :data="caseData"
                            height="550"
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
                                :total="this.casePage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="业务变量" name="fourth">
                    <el-form :inline="true" class="demo-form-inline search-style" size="small">
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
                            <el-select v-model="sceneData.funcAddress" clearable placeholder="请选择导入函数文件" size="small">
                                <el-option
                                        v-for="(item, key) in this.funcAddress"
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

                    <el-table :data="sceneData.variable" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" minWidth="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" minWidth="70">
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
                <el-button @click="sceneData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addScene()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <apiMessageEdit
                :apiCases="sceneData.apiCases"
                ref="apiMessageEditFunc">

        </apiMessageEdit>
    </div>
</template>

<script>
    import apiMessageEdit from './apiMessageEdit.vue'
    export default {
        components: {
            apiMessageEdit: apiMessageEdit,
        },
        name: 'sceneEdit',
        props: ['proModelData', 'projectName', 'allSetList', 'setTempData', 'configData', 'funcAddress'],
        data() {
            return {
                caseVessel: [], //接口用例容器，勾选的内容都存在此变量
                caseData: [], // 接口信息里面的表格数据
                casePage: {
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
                sceneData: {
                    id: '',
                    num: '',
                    funcAddress: '',
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
                this.caseData = [];

                let index = this.allSetList[this.projectName].map(item => item.id).indexOf(this.setTempData.setId);
                this.form.set = this.allSetList[this.projectName][index];
                this.form.module = this.proModelData[this.projectName][0];
                this.form.config = this.configData[this.projectName][0];
                this.form.projectName = this.projectName;
                this.form.apiMesProjectName = this.projectName;
                this.form.sceneVariableProjectName = this.projectName;
            },

            initSceneData() {
                this.synchronousData();
                if (this.allSetList[this.projectName].length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请先创建用例集',
                        type: 'warning',
                    });
                    return
                }
                this.sceneData.apiCases = [];
                this.sceneData.variable = [];
                this.sceneData.name = '';
                this.sceneData.times = '';
                this.sceneData.desc = '';
                this.sceneData.id = '';
                this.sceneData.funcAddress = '';
                this.sceneData.num = '';
                this.sceneData.modelFormVisible = true;
                this.caseVessel = [];
                // this.cancelSelection();
                // this.toggleSelection();
            },
            editScene(sceneId, copyEditStatus = false) {
                this.synchronousData();
                this.$axios.post('/api/api/scene/edit', {
                    'sceneId': sceneId,
                    'copyEditStatus': copyEditStatus
                }).then((response) => {
                        this.sceneData.name = response.data['data']['name'];
                        this.sceneData.desc = response.data['data']['desc'];
                        this.sceneData.times = response.data['data']['times'];
                        this.sceneData.funcAddress = response.data['data']['func_address'];
                        this.sceneData.apiCases = response.data['data']['cases'];
                        this.sceneData.variable = response.data['data']['variables'];
                        this.form.setName = this.tempSetName;
                        if (copyEditStatus) {
                            this.sceneData.id = '';
                            this.sceneData.num = '';
                        }
                        else {
                            this.sceneData.id = sceneId;
                            this.sceneData.num = response.data['data']['num'];
                        }
                        this.sceneData.modelFormVisible = true;
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
                let d = this.sceneData.apiCases[i];
                this.sceneData.apiCases.splice(i, 1);
                this.sceneData.apiCases.splice(i - 1, 0, d);
            },
            downNum(i) {
                let d = this.sceneData.apiCases[i];
                this.sceneData.apiCases.splice(i, 1);
                this.sceneData.apiCases.splice(i + 1, 0, d);
            },

            delApiCase(i) {
                //判断caseList中是否存在id，存在则在数据库删除信息，否则在前端删除临时数据
                if ('id' in this.sceneData.apiCases[i]) {
                    this.$axios.post('/api/api/apiCase/del', {'id': this.sceneData.apiCases[i]['id']}).then((response) => {
                            this.sceneData.apiCases.splice(i, 1);
                        }
                    )
                }
                else {
                    this.sceneData.apiCases.splice(i, 1);
                }
            },
            handleCaseSelection(val) {
                this.caseVessel = val;
            },
            handleCurrentCase(val) {
                this.casePage.currentPage = val;
                this.findCases()
            },
            handleSizeCase(val) {
                this.casePage.sizePage = val;
                this.findCases()
            },
            cancelSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            findCases() {
                this.$axios.post('/api/api/cases/find', {
                    'projectName': this.form.apiMesProjectName,
                    'moduleId': this.form.module.moduleId,
                    'caseName': this.form.caseName,
                    'page': this.casePage.currentPage,
                    'sizePage': this.casePage.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.caseData = response.data['data'];
                            this.casePage.total = response.data['total'];
                        }
                    }
                )
            },
            addCaseData() {
                console.log(this.caseVessel)
                if (this.caseVessel.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请勾选接口信息',
                        type: 'warning',
                    });
                    return
                }
                this.sceneData.apiCases = this.sceneData.apiCases.concat(this.caseVessel);
                this.sceneData.apiCases = JSON.parse(JSON.stringify(this.sceneData.apiCases));
                this.$refs.multipleTable.clearSelection();

            },
            addConfigData() {
                this.$axios.post('/api/api/config/data', {
                    'configId': this.form.config.configId
                }).then((response) => {
                        this.sceneData.variable = this.sceneData.variable.concat(response.data['data']['variables']);
                        this.sceneData.variable = JSON.parse(JSON.stringify(this.sceneData.variable));
                        this.sceneData.funcAddress = response.data['data']['func_address'];
                    }
                )
            },
            addConfigVariable() {
                this.sceneData.variable.push({key: '', value: '', remark: ''});
            },
            delConfigVariable(i) {
                this.sceneData.variable.splice(i, 1);
            },
            addScene() {
                if (this.sceneData.apiCases.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请添加接口信息到执行步骤',
                        type: 'warning',
                    });
                    return
                }
                if (this.sceneData.name === '' || this.sceneData.name === null) {
                    this.$message({
                        showClose: true,
                        message: '用例名字不能为空',
                        type: 'warning',
                    });
                    return
                }
                for (let i = 0; i < this.sceneData.apiCases.length; i++) {
                    if (!(/(^[1-9]\d*$)/.test(this.sceneData.apiCases[i]['time']))) {
                        this.$message({
                            showClose: true,
                            message: '第' + i + '条用例的执行次数请输入正整数',
                            type: 'warning',
                        });
                        return
                    }
                }
                this.$axios.post('/api/api/scene/add', {
                    'num': this.sceneData.num,
                    'name': this.sceneData.name,
                    'times': this.sceneData.times,
                    'setId': this.form.set.id,
                    'desc': this.sceneData.desc,
                    'funcAddress': this.sceneData.funcAddress,
                    'variable': JSON.stringify(this.sceneData.variable),
                    'project': this.form.projectName,
                    'ids': this.sceneData.id,
                    'cases': this.sceneData.apiCases,

                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.sceneData.modelFormVisible = false;
                            this.$parent.findScenes();
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
