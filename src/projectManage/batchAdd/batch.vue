<template>
    <div class="sceneManage">
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
            <el-form-item label="">

                <el-input placeholder="请输入业务集" v-model="form.sceneName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findScenes()" size="small">
                    搜索
                </el-button>
                <el-button type="primary" size="small" @click.native="initSceneData()">添加业务集
                </el-button>


            </el-form-item>
        </el-form>

        <el-tabs value="first">
            <el-tab-pane label="业务列表" name="first" style="margin: 0 0 -10px;">
                <div style="margin: 0 0 -20px;">
                </div>
                <el-table :data="sceneAll" stripe>
                    <el-table-column
                            prop="num"
                            label="编号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            prop="desc"
                            label="描述"
                            width="400">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click.native="editScene(sceneAll[scope.$index]['sceneId'])">编辑
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delScene,sceneAll[scope.$index]['sceneId'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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


        <el-dialog title="业务配置" :visible.sync="sceneData.modelFormVisible" width="40%" top="5vh">


            <el-tabs @tab-click="refresh">
                <el-tab-pane label="基础信息">
                    <el-form :model="sceneData">
                        <el-form-item label="编号" :label-width="sceneData.formLabelWidth"
                                      prop="num"
                                      :rules="[{ required: true, type:'number', message: '请输入数字', trigger: 'blur' },]">
                            <el-input v-model.number="sceneData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="描述" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="sceneData.desc" auto-complete="off">
                            </el-input>
                        </el-form-item>


                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="业务集合" @tab-click="refresh">
                    <el-table

                            :data="caseGather2"
                            height="561"
                            stripe>
                        <el-table-column
                                prop="num"
                                label="编号"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="用例名称"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="desc"
                                label="用例描述"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="320">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini"
                                           @click.native="upNum(scope.$index)">升序
                                </el-button>
                                <el-button type="primary" size="mini"
                                           @click.native="downNum(scope.$index)">降序
                                </el-button>
                                <el-button type="danger" size="mini"
                                           @click.native="delCaseGather(scope.$index)">删除
                                </el-button>
                                <el-button type="primary" size="mini"
                                           @click.native="caseConfigBtn(scope.$index)">配置
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="接口用例">
                    <el-form :inline="true" class="demo-form-inline"
                             style="background-color: #f2f2f2;  padding-top: 20px;"
                             size="small">
                        <el-form-item label=" " labelWidth="10px">
                            <el-select v-model="form.projects" placeholder="请选择项目">
                                <el-option
                                        v-for="(item, key) in proGatherData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                            <el-select v-model="form.gathers" placeholder="请选择模块">
                                <el-option
                                        v-for="item in proGatherData[this.form.projects]"
                                        :key="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">

                            <el-input placeholder="请输入用例" v-model="form.modelName">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click.native="findCases()" size="small">
                                搜索
                            </el-button>
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
                                width="55">
                        </el-table-column>
                        <el-table-column
                                prop="num"
                                label="编号"
                                width="80">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="用例名称"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="desc"
                                label="用例描述"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="url"
                                label="接口地址">
                        </el-table-column>
                    </el-table>
                    <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择
                    </el-button>
                    <div class="block" style="left:40%; position: relative;">
                        <el-pagination
                                @current-change="handleCurrentCase"
                                @size-change="handleSizeCase"
                                :page-size="10"

                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.casePage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="sceneData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addScene()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="配置" :visible.sync="paramVisible"  width="40%">
            <el-tabs  @tab-click="refreshConfig">
                <el-tab-pane label="接口参数">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small" :disabled="form.choiceTypeStatus"
                               @click="addCaseVariable()">添加
                    </el-button>
                    <el-select v-model="form.choiceType" placeholder="请选择" size="small" disabled >
                        <el-option
                                v-for="(item,key) in choiceVariableType"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label">
                        </el-option>
                    </el-select>
                    <el-switch
                            v-model="caseConfig.statusCase.variable[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="caseConfig.statusCase.variable[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <div v-if="form.choiceType === 'json'">
                        <div style="margin: 0 0 15px;">
                        </div>
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入内容"
                                v-model="caseConfig.variable">
                        </el-input>
                    </div>
                    <el-table :data="caseConfig.variable" style="width:100%" size="mini" stripe v-if="form.choiceType === 'data'">
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;"width="210">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="type" label="type" header-align="center"
                                         style="font-size: 16px;" width="100">
                            <template slot-scope="scope">
                                <!--<el-input v-model="scope.row.param_type" size="medium">-->
                                <!--</el-input>-->
                                <el-select v-model="scope.row.param_type" size="medium">
                                    <el-option v-for="item in paramTypes" :key="item" :value="item">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="350">
                            <template slot-scope="scope">
                                <div v-if="scope.row.param_type === 'file'">
                                    <el-row>
                                        <el-col :span="17">
                                            <el-input v-model="scope.row.value" size="medium" :disabled="true">
                                            </el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            <p>  </p>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-upload
                                                    class="upload-demo"
                                                    action="/api/api/upload"
                                                    :show-file-list= 'false'
                                                    :on-success="fileChange"
                                            >
                                                <el-button size="small" type="primary" @click="tempNumTwo(scope.$index)">点击上传</el-button>
                                            </el-upload>
                                        </el-col>
                                    </el-row>


                                </div>
                                <div v-else>
                                    <el-input v-model="scope.row.value" size="medium">
                                    </el-input>
                                </div>
                            </template>

                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delCaseVariable(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="信息提取">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addCaseExtract()">添加
                    </el-button>
                    <el-switch
                            v-model="caseConfig.statusCase.extract[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="caseConfig.statusCase.extract[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="caseConfig.extract" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="210">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="450">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delCaseExtract(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="接口判断">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addCaseValidate()">添加
                    </el-button>
                    <el-switch
                            v-model="caseConfig.statusCase.validate[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="caseConfig.statusCase.validate[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="caseConfig.validate" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="230">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="Comparator" header-align="center" width="200">
                            <template slot-scope="scope">

                                <el-autocomplete
                                        class="inline-input"
                                        v-model="scope.row.comparator"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入内容"
                                ></el-autocomplete>

                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="230">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delCaseValidate(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="paramVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click="sureConfigBtn()" size="small">确 定
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
                tempNum:'',
                comparators: [{'value': 'equals'}, {'value': 'less_than'}, {'value': 'less_than_or_equals'},
                    {'value': 'greater_than'}, {'value': 'greater_than_or_equals'}, {'value': 'not_equals'},
                    {'value': 'string_equals'}, {'value': 'length_equals'}, {'value': 'length_greater_than'},
                    {'value': 'count_greater_than_or_equals'}, {'value': 'length_less_than'},
                    {'value': 'length_less_than_or_equals'}],
                statusCase: {variable: [true, false], extract: [true, false], validate: [true, false],},
                caseConfig: {
                    statusCase: {variable: [], extract: [], validate: [],},
                    variable: [{key: '', value: '', param_type: ''}],
                    extract: [{key: '', value: ''}],
                    validate: [{key: '', value: '', comparator: ''}],
                },
                paramVisible: false,
                proGatherData: '',
                proUrlData: '',
                temp_num:'',
                paramTypes: ['string', 'file'],
                caseData: [],
                sceneAll: [],
                caseVessel: [],
                caseList: [],
                casePage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 10,
                },
                total: 1,
                currentPage: 1,
                sizePage: 10,
                choiceVariableType: [{
                    value: '选项1',
                    label: 'data'
                }, {
                    value: '选项2',
                    label: 'json'
                }],
                form: {
                    gathers: '',
                    projects: '',
                    sceneName: '',
                    choiceType:'data',
                    choiceTypeStatus:false,
                },
                sceneData: {
                    id: '',
                    num: '',
                    modelFormVisible: false,
                    projectName: '',
                    desc: '',
                    name: '',
                    formLabelWidth: '120px',
                    apiCases: [],
                }
            }
        },


        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            findCases() {
                this.$axios.post('/api/api/cases/find', {
                    'proName': this.form.projects,
                    'gatName': this.form.gathers,
                    'page': this.casePage.currentPage,
                    'sizePage': this.casePage.sizePage,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['data'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.caseData = response.data['data'];
                            this.casePage.total = response.data['total'];
                        }
                    }
                )
            },
            findScenes() {
                this.$axios.post('/api/api/scene/find', {
                    'projectName': this.form.projects,
                    'sceneName': this.form.sceneName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['data'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.sceneAll = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            httpSend() {
                this.$axios.get('/api/api/proGather/list').then((response) => {
                        this.proGatherData = response.data['data'];
                        this.proUrlData = response.data['urlData'];
                        for (var key in response.data['data']) {
                            this.form.projects = key;
                            this.form.gathers = response.data['data'][key][0].toString();
                            break
                        }
                        this.findCases();
                        this.findScenes()
                    }
                )
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findScenes()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findScenes()
            },
            handleCurrentCase(val) {
                this.casePage.currentPage = val;
                this.findCases()
            },
            handleSizeCase(val) {
                this.casePage.sizePage = val;
                this.findCases()
            },
            findModel() {
            },
            addScene() {
                // var caseData = [];
                // for (var scene in this.caseList) {
                //     var temp = new Object();
                //     temp.caseId = this.caseList[scene]['caseId'];
                //     temp.gatherId = this.caseList[scene]['gather_id'];
                //     temp.variables = this.caseList[scene]['variables'];
                //     caseData.push(temp);
                // }
                this.$axios.post('/api/api/scene/add', {
                    'num': this.sceneData.num,
                    'name': this.sceneData.name,
                    'desc': this.sceneData.desc,
                    'project': this.form.projects,
                    'ids': this.sceneData.id,
                    'cases': this.caseList,

                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['data'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.sceneData.modelFormVisible = false;
                            this.$message({
                                showClose: true,
                                message: response.data['data'],
                                type: 'success',
                            });
                            this.findScenes();
                        }
                    }
                )
            },
            initSceneData() {
                this.sceneData.header = [];
                this.sceneData.variable = [];
                this.sceneData.name = '';
                this.sceneData.desc = '';
                this.sceneData.id = '';
                this.sceneData.num = '';
                this.sceneData.url = '';
                this.sceneData.modelFormVisible = true;
                this.caseVessel = [];
                this.caseList = [];
                // this.cancelSelection();
                // this.toggleSelection();

            },

            addCase() {
                this.sceneData.apiCases.push({key: '', value: ''});
            },
            handleCaseSelection(val) {
                this.caseVessel = val;
            },
            addCaseData() {
                this.caseList = this.caseList.concat(this.caseVessel);
                this.caseList = JSON.parse(JSON.stringify(this.caseList));
            },
            delCaseGather(i) {
                if ('id' in this.caseList[i]) {
                    this.$axios.post('/api/api/apiCase/del', {'id': this.caseList[i]['id']}).then((response) => {
                            this.caseList.splice(i, 1);
                        }
                    )
                }
                else {
                    this.caseList.splice(i, 1);
                }
                // this.caseList.splice(i, 1);
            },
            caseConfigBtn(i) {


                this.caseConfig.variable = this.caseList[i]['variables'];
                this.caseConfig.extract = this.caseList[i]['extract'];
                this.caseConfig.validate = this.caseList[i]['validate'];
                this.caseConfig.statusCase = this.caseList[i]['statusCase'];
                this.form.choiceType = this.caseList[i]['variableType'];
                this.tempNum = i;
                this.paramVisible = true;
                if(this.form.choiceType === 'json'){
                    this.form.choiceTypeStatus = true
                }
                else {
                    this.form.choiceTypeStatus = false
                }

                // this.caseList.splice(i, 1);
            },
            sureConfigBtn() {
                if (this.form.choiceType === 'json'){
                    try{
                        JSON.parse(this.caseConfig.variable)
                    }
                    catch(err){
                        this.$message({
                            showClose: true,
                            message: 'json格式错误',
                            type: 'warning',
                        });
                        return
                    }
                }
                this.caseList[this.tempNum]['variables']=this.caseConfig.variable;
                this.paramVisible = false;

                // this.caseList.splice(i, 1);
            },
            upNum(i) {
                var d = this.caseList[i];
                this.caseList.splice(i, 1);
                this.caseList.splice(i - 1, 0, d);
            },
            downNum(i) {
                var d = this.caseList[i];
                this.caseList.splice(i, 1);
                this.caseList.splice(i + 1, 0, d);
            },
            refresh(targetName) {

                if (targetName.label === '业务集合') {
                    this.caseList.push({key: '', value: ''});
                    this.caseList.pop()
                }
                else if (targetName.label === '接口用例') {
                    this.cancelSelection()
                }
            },
            refreshConfig(targetName) {

                if (targetName.label === 'variables') {
                    console.log(111111111111)
                }
            },
            cancelSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            addCaseVariable() {
                this.caseConfig.variable.push({key: '', value: '', param_type: 'string'});
            },
            delCaseVariable(i) {
                this.caseConfig.variable.splice(i, 1);
            },
            addCaseExtract() {
                this.caseConfig.extract.push({key: '', value: ''});
            },
            delCaseExtract(i) {
                this.caseConfig.extract.splice(i, 1);
            },
            addCaseValidate() {
                this.caseConfig.validate.push({key: '', value: ''});
            },
            delCaseValidate(i) {
                this.caseConfig.validate.splice(i, 1);
            },
            delScene(sceneId) {
                this.$axios.post('/api/api/scene/del', {'sceneId': sceneId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.sceneName = '';
                        this.findScenes();
                    }
                )
            },
            editScene(sceneId) {
                this.$axios.post('/api/api/scene/edit', {'sceneId': sceneId}).then((response) => {
                        this.sceneData.num = response.data['data']['num'];
                        this.sceneData.name = response.data['data']['name'];
                        this.sceneData.desc = response.data['data']['desc'];
                        this.caseList = response.data['data']['cases'];
                        this.sceneData.id = sceneId;
                        this.sceneData.modelFormVisible = true;

                    }
                )
            },
            fileChange(response, file, fileList) {
                this.caseConfig.variable[this.temp_num]['value'] = response['data']
            },
            tempNumTwo(i) {
                this.temp_num = i;
            },

        },
        mounted() {
            this.httpSend();

        },
    }
</script>

<style>
</style>
