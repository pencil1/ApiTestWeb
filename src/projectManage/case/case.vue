<template>
    <div class="caseManage" v-loading="this.loading">

        <el-form :inline="true" class="demo-form-inline" style="background-color: #f2f2f2;  padding-top: 20px;"
                 size="small">
            <el-form-item label="项目、模块" labelWidth="110px">
                <el-select v-model="form.projects" placeholder="请选择项目" @change="clearGathers">
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
                            :value="item"
                    >
                    </el-option>
                </el-select>

                <el-select v-model="form.configName" placeholder="请选择配置">
                    <el-option
                            v-for="item in configNameData[this.form.projects]"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接口名称">

                <el-input placeholder="请输入接口" v-model="form.modelName" clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findCases()" size="small">
                    搜索
                </el-button>
                <el-button type="primary" size="small" @click.native="initCaseData()">录入接口信息
                </el-button>

                <el-button type="primary" size="small" @click.native="test()">测试
                </el-button>
                <el-tooltip content="查看最近一次接口结果" placement="top-start">
                    <el-button type="primary" icon="el-icon-view" @click="dialogTestData = true"
                               size="small"></el-button>
                </el-tooltip>
            </el-form-item>
        </el-form>


        <el-tabs value="first">
            <el-tab-pane label="接口信息" name="first" style="margin: 0 0 -10px;">
                <div style="margin: 0 0 -20px;">
                </div>
                <el-table
                        ref="multipleTable"
                        @selection-change="handleCaseSelection"
                        :data="tableData"
                        height="561"
                        stripe>
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="num"
                            label="编号"
                            width="60">
                    </el-table-column>
                    <el-table-column
                            :show-overflow-tooltip= true
                            prop="name"
                            label="接口名称"
                            width="200">
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--:show-overflow-tooltip= true-->
                            <!--prop="desc"-->
                            <!--label="接口描述"-->
                            <!--width="200">-->
                    <!--</el-table-column>-->
                    <el-table-column
                            :show-overflow-tooltip= true
                            prop="url"
                            label="接口地址">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="320">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click.native="editCase(tableData[scope.$index]['caseId'])">编辑
                            </el-button>
                            <el-button type="primary" icon="el-icon-tickets" size="mini"
                                       @click.native="copyCase(tableData[scope.$index]['caseId'])">复制
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delCases,tableData[scope.$index]['caseId'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择
                </el-button>
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
            <el-tab-pane label="待续" name="second">配置管理</el-tab-pane>
        </el-tabs>

        <el-dialog title="接口配置" :visible.sync="caseData.modelFormVisible" width="50%">


            <el-tabs>
                <el-tab-pane label="基础信息">
                    <el-form :model="caseData">
                        <el-form-item label="项目、模块、url" labelWidth="120px">
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
                            <el-select v-model="form.choiceUrl" placeholder="请选择">
                                <el-option
                                        v-for="item in proUrlData[this.form.projects]"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item label="url" :label-width="caseData.formLabelWidth"-->
                                      <!--prop="desc">-->

                            <!--<el-select v-model="caseData.funcAddress" clearable placeholder="请选择导入函数文件">-->
                                <!--<el-option-->
                                        <!--v-for="(item, key) in this.funcAddress"-->
                                        <!--:key="item['value']"-->
                                        <!--:label="item['value']"-->
                                        <!--:value="item['value']">-->
                                <!--</el-option>-->
                            <!--</el-select>-->

                        <!--</el-form-item>-->
                        <el-form-item label="接口编号" :label-width="caseData.formLabelWidth"
                                      prop="num"  v-if="caseData.id"
                        >
                            <el-input v-model.number="caseData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="接口名称" :label-width="caseData.formLabelWidth"
                                      prop="name" >
                            <el-input v-model="caseData.name" auto-complete="off">
                            </el-input>
                        </el-form-item>

                        <!--<el-form-item label="用例描述" :label-width="caseData.formLabelWidth"-->
                                      <!--prop="desc">-->
                            <!--<el-input v-model="caseData.desc" auto-complete="off">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->

                        <!--<el-form-item label="up函数" :label-width="caseData.formLabelWidth">-->
                            <!--<el-input v-model="caseData.upFunc">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="down函数" :label-width="caseData.formLabelWidth">-->
                            <!--<el-input v-model="caseData.downFunc">-->
                            <!--</el-input>-->
                        <!--</el-form-item>-->


                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="接口参数">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               :disabled="form.choiceType === 'json'"
                               @click="addCaseVariable()">添加
                    </el-button>
                    <!--<el-button type="primary" size="small"-->
                    <!--@click="variableDialog=true">json转换-->
                    <!--</el-button>-->
                    <el-button type="primary" size="small"
                               @click="cleanCaseVariable()">清空参数
                    </el-button>
                    <el-select v-model="form.choiceType" placeholder="请选择" size="small">
                        <el-option
                                v-for="(item,key) in choiceVariableType"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label">
                        </el-option>
                    </el-select>
                    <div v-if="form.choiceType === 'json'">
                        <div style="margin: 0 0 15px;">
                        </div>
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入内容"
                                v-model="caseData.jsonVariable">
                        </el-input>
                    </div>
                    <el-table :data="caseData.variable" style="width:100%" size="mini" stripe
                              v-if="form.choiceType === 'data'">
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="250">
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
                                            <p></p>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-upload
                                                    class="upload-demo"
                                                    action="/api/api/upload"
                                                    :show-file-list='false'
                                                    :on-success="fileChange"
                                            >
                                                <el-button size="small" type="primary" @click="tempNum(scope.$index)">
                                                    点击上传
                                                </el-button>
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
                        <el-table-column  label="备注" header-align="center"
                                         style="font-size: 16px;" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="medium">
                                </el-input>
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
                <el-tab-pane label="请求信息">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="url:" style="margin-bottom:-2px">
                            <el-input placeholder="请输入url" v-model="caseData.url" size="medium" style="width: 500px">
                            </el-input>
                        </el-form-item>
                        <el-select v-model="caseData.method" size="medium">
                            <el-option v-for="item in methods" :key="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-button type="primary" size="small" @click="addCaseHeader()">添加头部</el-button>
                    </el-form>
                    <el-table :data="caseData.header" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="300">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="550">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delCaseHeader(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="信息提取">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addExtractHeader()">添加
                    </el-button>
                    <el-table :data="caseData.extract" style="width:100%" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center"
                                         style="font-size: 16px;" width="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" width="500">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column  label="备注" header-align="center"
                                          style="font-size: 16px;" width="150">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delExtractHeader(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!--<el-tab-pane label="接口判断">-->
                    <!--<el-button type="primary" icon="el-icon-circle-plus-outline" size="small"-->
                               <!--@click="addValidate()">添加-->
                    <!--</el-button>-->
                    <!--<el-table :data="caseData.validate" style="width:100%" size="mini" stripe>-->
                        <!--<el-table-column label="Check" header-align="center"-->
                                         <!--style="font-size: 16px;" width="300">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-input v-model="scope.row.key" size="medium">-->
                                <!--</el-input>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="Comparator" header-align="center" width="200">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-autocomplete-->
                                        <!--class="inline-input"-->
                                        <!--v-model="scope.row.comparator"-->
                                        <!--:fetch-suggestions="querySearch"-->
                                        <!--placeholder="请输入内容"-->
                                <!--&gt;</el-autocomplete>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="Expected" header-align="center" width="350">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-input v-model="scope.row.value" size="medium">-->
                                <!--</el-input>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="操作" header-align="center" width="80">-->
                            <!--<template slot-scope="scope">-->
                                <!--<el-button type="danger" icon="el-icon-delete" size="mini"-->
                                           <!--@click.native="delValidate(scope.$index)">删除-->
                                <!--</el-button>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                    <!--</el-table>-->
                <!--</el-tab-pane>-->
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="caseData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addCase()" size="small">确 定
                </el-button>
            </div>

        </el-dialog>


        <el-dialog title="测试结果" :visible.sync="dialogTestData">
            <el-collapse accordion>
                <el-collapse-item
                        v-for="(item, index) in resultShow"
                        :title="item.name"
                        :key="index">
                    <el-button type="primary" v-clipboard:copy="JSON.stringify(item.meta_data.response_body)"
                               size="small"
                               style="position:absolute;right: 3%;">复制
                    </el-button>
                    <div style="color: red">url：</div>
                    <div>{{item.meta_data.url}}</div>
                    <div style="color: red">请求参数：</div>
                    <div>{{item.meta_data.request_body}}</div>
                    <div style="color: red">返回头：</div>
                    <div>{{item.meta_data.request_headers}}</div>
                    <div style="color: red">返回结果：</div>
                    <div>
                        <pre>{{item.meta_data.response_body}}</pre>
                    </div>
                    <div style="color: red">错误信息：</div>
                    <div>
                        <pre>{{item.attachment}}</pre>
                    </div>

                </el-collapse-item>
            </el-collapse>
        </el-dialog>

        <el-dialog title="参数转换" :visible.sync="variableDialog">
            <el-collapse accordion>
                <div>
                    <el-input
                            type="textarea"
                            :rows="30"
                            placeholder="请输入内容"
                            v-model="caseData.jsonVariable">
                    </el-input>
                </div>
            </el-collapse>
            <div slot="footer" class="dialog-footer">
                <el-button @click="variableDialog = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="changeData()" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {

        name: 'caseManage',
        data() {
            return {
                loading: false,
                resultShow: [
                    {
                        name: '',
                        meta_data: {request_body: '', url: '', response_body: '', request_headers: ''},
                        attachment: ''
                    },
                ],
                dialogTestData: false,
                variableDialog: false,
                variableDialogData: '',
                proGatherData: '',
                configNameData:'',
                temp_num: '',
                fileList: [],
                proUrlData: '',
                choiceVariableType: [{
                    value: '选项1',
                    label: 'data'
                }, {
                    value: '选项2',
                    label: 'json'
                }],
                choiceUrlData: [{
                    value: '选项1',
                    label: '基础url1'
                }, {
                    value: '选项2',
                    label: '基础url2'
                },
                    {
                        value: '选项3',
                        label: '基础url3'
                    },
                    {
                        value: '选项4',
                        label: '基础url4'
                    },],
                funcAddress: '',
                methods: ['POST', 'GET', 'PUT', 'DELETE'],
                paramTypes: ['string', 'file'],
                comparators: [{'value': 'string_equals'}, {'value': 'contains'}, {'value': 'less_than'}, {'value': 'less_than_or_equals'},
                    {'value': 'greater_than'}, {'value': 'greater_than_or_equals'}, {'value': 'not_equals'},
                ],
                tableData: [],
                caseSelection: [],
                total: 1,
                currentPage: 1,
                sizePage: 10,

                form: {
                    projects: '',
                    configName:'',
                    gathers: [],
                    modelName: '',
                    choiceUrl: '基础url1',
                    choiceType: 'data',

                },
                caseData: {
                    id: '',
                    modelFormVisible: false,
                    project: '',
                    method: '',
                    status_url: '',
                    name: '',
                    num: '',
                    desc: '',
                    funcAddress: '',
                    upFunc: '',
                    downFunc: '',
                    formLabelWidth: '120px',
                    url: '',
                    header: [],
                    variable: [],
                    jsonVariable: '',
                    extract: [],
                    validate: [],
                }
            }
        },


        methods: {
            getFuncAddress() {
                this.$axios.post('/api/api/func/getAddress').then((response) => {
                        this.funcAddress = response['data']['data'];
                    }
                )
            },
            querySearchFunc(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.funcAddress);
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            httpSend() {
                this.$axios.get('/api/api/proGather/list').then((response) => {
                        this.proGatherData = response.data['data'];
                        this.configNameData = response.data['config_name_list'];
                        this.proUrlData = response.data['urlData'];
                        for (var key in response.data['user_pro']) {
                            this.form.projects = key;
                            this.form.gathers = response.data['data'][key][0].toString();
                            this.form.configName = response.data['config_name_list'][key][0].toString();
                            break
                        }
                        this.$axios.post('/api/api/cases/list', {
                            'proName': this.form.projects,
                            'gatName': this.form.gathers
                        }).then((response) => {
                                this.tableData = response.data['data'];
                                this.findCases();
                            }
                        )
                    }
                )
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findCases()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findCases()
            },
            findCases() {
                this.$axios.post('/api/api/cases/find', {
                    'caseName': this.form.modelName,
                    'projectName': this.form.projects,
                    'gatName': this.form.gathers,
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
            initCaseData() {
                this.caseData.header = [];
                this.form.choiceType = 'data';
                this.caseData.variable = [];
                this.caseData.jsonVariable = '';
                this.caseData.extract = [];
                this.caseData.validate = [];
                this.caseData.name = '';
                this.caseData.num = '';
                this.form.choiceUrl = '';
                this.caseData.funcAddress = '';
                this.caseData.upFunc = '';
                this.caseData.downFunc = '';
                this.caseData.desc = '';
                this.caseData.id = '';
                this.caseData.url = '';
                this.caseData.modelFormVisible = true;
            },
            changeData() {
                // console.log(this.variableDialogData); JSON.parse(this.variableDialogData);
                var variableData = JSON.parse(this.variableDialogData);
                for (var key in variableData) {
                    this.caseData.variable.push({key: key, value: JSON.stringify(variableData[key])});
                }
                this.variableDialogData = '';
                this.variableDialog = false;
            },
            addCase() {
                if (this.form.choiceType === 'data') {
                    var variable = JSON.stringify(this.caseData.variable)
                }
                else {
                    variable = this.caseData.jsonVariable;
                    try {
                        JSON.parse(variable)
                    }
                    catch (err) {
                        this.$message({
                            showClose: true,
                            message: 'json格式错误',
                            type: 'warning',
                        });
                        return
                    }
                }
                this.$axios.post('/api/api/cases/add', {
                    'gatherName': this.form.gathers,
                    'projectName': this.form.projects,
                    'caseName': this.caseData.name,
                    'caseNum': this.caseData.num,
                    // 'choiceUrl': this.form.choiceUrl,
                    'choiceUrl': this.proUrlData[this.form.projects].indexOf(this.form.choiceUrl),
                    'variableType': this.form.choiceType,
                    'caseDesc': this.caseData.desc,
                    'funcAddress': this.caseData.funcAddress,
                    'upFunc': this.caseData.upFunc,
                    'downFunc': this.caseData.downFunc,
                    'caseUrl': this.caseData.url,
                    'caseId': this.caseData.id,
                    'caseHeader': JSON.stringify(this.caseData.header),
                    'caseVariable': variable,
                    'caseExtract': JSON.stringify(this.caseData.extract),
                    'caseMethod': this.caseData.method,
                    'caseValidate': JSON.stringify(this.caseData.validate)
                }).then((response) => {

                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.caseData.modelFormVisible = false;
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.findCases();

                        }
                    }
                )
            },
            editCase(caseId) {
                this.$axios.post('/api/api/cases/edit', {'caseId': caseId}).then((response) => {
                        this.caseData.name = response.data['data']['caseName'];
                        this.caseData.num = response.data['data']['caseNum'];
                        this.caseData.desc = response.data['data']['caseDesc'];
                        this.caseData.funcAddress = response.data['data']['funcAddress'];
                        this.caseData.upFunc = response.data['data']['up_func'];
                        this.caseData.downFunc = response.data['data']['down_func'];
                        this.caseData.url = response.data['data']['caseUrl'];
                        this.caseData.header = response.data['data']['caseHeader'];
                        this.form.choiceType = response.data['data']['variableType'];
                        if (this.form.choiceType === 'data') {
                            this.caseData.variable = response.data['data']['caseVariable'];
                            this.caseData.jsonVariable = ''
                        }
                        else {
                            this.caseData.jsonVariable = response.data['data']['caseVariable'];
                            this.caseData.variable = []
                        }
                        this.caseData.extract = response.data['data']['caseExtract'];
                        this.caseData.validate = response.data['data']['caseValidate'];
                        this.caseData.method = response.data['data']['caseMethod'];
                        this.caseData.id = caseId;
                        // this.form.choiceUrl = response.data['data']['status_url'];
                        this.form.choiceUrl = this.proUrlData[this.form.projects][response.data['data']['status_url']];
                        this.caseData.modelFormVisible = true;
                    }
                )
            },
            copyCase(caseId) {
                this.$axios.post('/api/api/cases/copy', {'caseId': caseId}).then((response) => {
                        this.caseData.name = response.data['data']['caseName'];
                        this.caseData.num = '';
                        this.caseData.desc = response.data['data']['caseDesc'];
                        this.caseData.url = response.data['data']['caseUrl'];
                        this.caseData.funcAddress = response.data['data']['funcAddress'];
                        this.caseData.upFunc = response.data['data']['up_func'];
                        this.caseData.downFunc = response.data['data']['down_func'];
                        this.caseData.header = response.data['data']['caseHeader'];
                        this.caseData.variable = response.data['data']['caseVariable'];
                        this.caseData.extract = response.data['data']['caseExtract'];
                        this.caseData.validate = response.data['data']['caseValidate'];
                        this.caseData.method = response.data['data']['caseMethod'];
                        this.caseData.id = '';
                        this.form.choiceType = response.data['data']['variableType'];
                        if (this.form.choiceType === 'data') {
                            this.caseData.variable = response.data['data']['caseVariable'];
                            this.caseData.jsonVariable = ''
                        }
                        else {
                            this.caseData.jsonVariable = response.data['data']['caseVariable'];
                            this.caseData.variable = []
                        }
                        this.form.choiceUrl = this.proUrlData[this.form.projects][response.data['data']['status_url']];
                        this.caseData.modelFormVisible = true;
                    }
                )
            },
            delCases(caseId) {
                this.$axios.post('/api/api/cases/del', {'caseId': caseId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.modelName = '';
                        this.findCases();
                    }
                )
            },

            test() {
                this.loading = true;
                this.$axios.post('/api/api/cases/run', {
                    'caseData': this.caseSelection,
                    'projectName': this.form.projects,
                    'gathers': this.form.gathers,
                    'configName': this.form.configName,
                }).then((response) => {

                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.resultShow = response['data']['data']['records'];
                            this.dialogTestData = true
                        }

                        this.loading = false;

                    }
                )
            },
            addCaseVariable() {
                this.caseData.variable.push({key: '', value: '', param_type: 'string',remark:''});
            },
            cleanCaseVariable() {
                this.caseData.variable = [];
                this.caseData.jsonVariable = ''
            },
            delCaseVariable(i) {
                this.caseData.variable.splice(i, 1);
            },
            addCaseHeader() {
                this.caseData.header.push({key: '', value: ''});
            },
            delCaseHeader(i) {
                this.caseData.header.splice(i, 1);
            },
            addExtractHeader() {
                this.caseData.extract.push({key: '', value: '',remark:''});
            },
            delExtractHeader(i) {
                this.caseData.extract.splice(i, 1);
            },
            addValidate() {
                this.caseData.validate.push({key: '', value: '', comparator: ''});
            },
            delValidate(i) {
                this.caseData.validate.splice(i, 1);
            },
            handleCaseSelection(val) {
                this.caseSelection = val;
            },
            cancelSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            fileChange(response, file, fileList) {
                this.caseData.variable[this.temp_num]['value'] = response['data'];
                if (response.data['status'] === 0) {
                    this.$message({
                        showClose: true,
                        message: response['msg'],
                        type: 'warning',
                    });
                }
                else {
                    this.$message({
                        showClose: true,
                        message: response['msg'],
                        type: 'success',
                    });
                }


            },
            tempNum(i) {
                this.temp_num = i;
            },
            clearGathers() {
                this.form.gathers = null;
                this.form.configName = null;
            },

        },
        mounted() {
            this.httpSend();
            this.getFuncAddress();

        },
    }
</script>

<style>
</style>
