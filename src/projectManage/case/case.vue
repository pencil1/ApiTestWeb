<template>
    <div class="caseManage" v-loading="this.loading">

        <el-form :inline="true" class="demo-form-inline" style="background-color: #f2f2f2;  padding-top: 20px;"
                 size="small">
            <el-form-item label="项目、模块" labelWidth="110px">
                <el-select v-model="form.projects" placeholder="请选择项目" @change="clearGathers" style="width: 150px">
                    <el-option
                            v-for="(item, key) in proGatherData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

                <el-select v-model="form.gathers" placeholder="请选择模块" style="width: 150px">
                    <el-option
                            v-for="item in proGatherData[this.form.projects]"
                            :key="item"
                            :value="item"
                    >
                    </el-option>
                </el-select>

                <el-select v-model="form.configName" placeholder="请选择配置" style="width: 150px">
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

                <el-button type="primary" size="small" @click.native="test(caseSelection)">测试
                </el-button>
                <el-tooltip content="查看最近一次接口结果" placement="top-start">
                    <el-button type="primary" icon="el-icon-view" @click="dialogTestData = true" size="small">
                    </el-button>
                </el-tooltip>
                <el-button type="primary" size="small" @click="importApiStatus = true">导入信息
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="接口信息导入" :visible.sync="importApiStatus">
            <el-form>
                <el-form-item label="请选择导入格式">
                    <el-radio-group v-model="importFormat">
                        <el-radio label="HAR"></el-radio>
                        <el-radio label="postman(JSON)"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="文件地址">
                    <el-input v-model="importApiAddress" size="medium" :disabled="true">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            action="/api/api/upload"
                            :show-file-list='false'
                            :on-success="getApiAddress"
                    >
                        <el-button size="small" type="primary">
                            点击上传
                        </el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="importApiStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="importCase()">确 定</el-button>
            </div>
        </el-dialog>

        <el-tabs value="first">
            <el-tab-pane label="接口信息" name="first" style="margin: 0 0 -10px;">
                <div style="margin: 0 0 -20px;">
                </div>
                <el-scrollbar wrap-class="scrollbarList">
                    <el-table
                            ref="multipleTable"
                            @selection-change="handleCaseSelection"
                            :data="tableData"
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
                                :show-overflow-tooltip=true
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
                                :show-overflow-tooltip=true
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
                </el-scrollbar>
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
                                      prop="num" v-if="caseData.id"
                        >
                            <el-input v-model.number="caseData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="接口名称" :label-width="caseData.formLabelWidth"
                                      prop="name">
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
                <el-tab-pane label="请求信息">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item label="请求地址">
                                <el-input placeholder="请输入url" v-model="caseData.url" size="medium"
                                          style="width: 500px">
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <el-form-item label="请求方式">
                            <el-select v-model="caseData.method" size="medium" @change="methodChange"
                                       style="width: 130px">
                                <el-option v-for="item in methods" :key="item" :value="item">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item label="数据类型">
                            <el-select v-model="form.choiceType" placeholder="请选择" size="medium"
                                       style="width: 130px"
                                       :disabled="caseData.method === 'GET'">
                                <el-option
                                        v-for="(item,key) in choiceVariableType"
                                        :key="item.label"
                                        :label="item.label"
                                        :value="item.label">
                                </el-option>
                            </el-select>
                            <!--为了美观添加的按钮-->
                            <el-button type="primary" size="small"
                                       v-show="false"
                                       >
                            </el-button>
                            <el-button type="primary" size="small"
                                       v-show="form.choiceType === 'data'"
                                       @click="addCaseVariable()">加参数
                            </el-button>

                            <el-button type="primary" size="small"
                                       v-show="form.choiceType === 'json'"
                                       @click="formatData()">格式化
                            </el-button>
                            <!--<el-button type="primary" size="small"-->
                            <!--@click="variableDialog=true">json转换-->
                            <!--</el-button>-->
                            <el-button type="primary" size="small"
                                       @click="cleanCaseVariable()">清空参数
                            </el-button>

                        </el-form-item>
                    </el-form>
                    <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);"/>

                    <div v-if="form.choiceType === 'json'">
                        <div style="margin: 0 0 15px;">
                        </div>
                        <el-input
                                type="textarea"
                                :rows="10"
                                placeholder="请输入json格式的参数"
                                v-model="caseData.jsonVariable">
                        </el-input>
                    </div>
                    <el-table :data="caseData.variable" size="mini" stripe
                              v-if="form.choiceType === 'data'">

                        <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="type" label="type" header-align="center" width="100">
                            <template slot-scope="scope">
                                <!--<el-input v-model="scope.row.param_type" size="medium">-->
                                <!--</el-input>-->
                                <el-select v-model="scope.row.param_type" size="medium">
                                    <el-option v-for="item in paramTypes" :key="item" :value="item">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                            <template slot-scope="scope">
                                <div v-if="scope.row.param_type === 'file'">
                                    <el-row>
                                        <el-col :span="18">
                                            <el-input v-model="scope.row.value" size="medium" :disabled="true">
                                            </el-input>
                                        </el-col>
                                        <el-col :span="1">
                                            <p></p>
                                        </el-col>
                                        <el-col :span="2">
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
                        <el-table-column label="备注" header-align="center" minWidth="80">
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
                <el-tab-pane label="请求头部">
                    <el-form :inline="true" class="demo-form-inline">


                        <el-button type="primary" size="small" @click="addCaseHeader()">添加头部</el-button>
                    </el-form>
                    <el-table :data="caseData.header" width="auto" size="mini" stripe>
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
                    <el-table :data="caseData.extract" width="auto" size="mini" stripe>
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
                                           @click.native="delExtractHeader(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="接口判断">
                <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                @click="addValidate()">添加
                </el-button>
                <el-table :data="caseData.validate" style="width:100%" size="mini" stripe>
                <el-table-column label="Check" header-align="center"
                style="font-size: 16px;" width="300">
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
                <el-table-column label="Expected" header-align="center" width="350">
                <template slot-scope="scope">
                <el-input v-model="scope.row.value" size="medium">
                </el-input>
                </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" width="80">
                <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                @click.native="delValidate(scope.$index)">删除
                </el-button>
                </template>
                </el-table-column>
                </el-table>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button @click="saveAndRun()" size="small" type="info"
                           v-show="caseData.id"
                           :loading="saveRunStatus"
                >保存并测试
                </el-button>
                <el-button @click="caseData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary"
                           @click.native="addCase()" size="small">保 存
                </el-button>
            </div>

        </el-dialog>


        <el-dialog title="测试结果" :visible.sync="dialogTestData" width="45%">
            <el-collapse accordion>
                <el-collapse-item
                        v-for="(item, index) in resultShow"
                        :key="index">
                    <template slot="title">
                        <div :style="item.attachment ? 'color:rgb(255, 74, 74)': 'color:#303133'">{{item.name}}</div>

                    </template>
                    <el-button type="primary" v-clipboard:copy="JSON.stringify(item.meta_data.response_body)"
                               size="small"
                               style="position:absolute;right: 3%;">复制
                    </el-button>
                    <div style="color: red">url：</div>
                    <div>{{item.meta_data.request.url}}</div>
                    <div style="color: red">请求params：</div>
                    <div>{{item.meta_data.request.params}}</div>
                    <div style="color: red">请求body：</div>
                    <div>{{item.meta_data.request.body}}</div>
                    <div style="color: red">请求参数：</div>
                    <div>{{item.meta_data.request.data}}</div>
                    <div style="color: red">请求头：</div>
                    <div>{{item.meta_data.request.headers}}</div>
                    <div style="color: red">返回结果：</div>
                    <div>
                        <pre style="overflow: auto">{{item.meta_data.response.json}}</pre>
                    </div>
                    <div style="color: red">错误信息：</div>
                    <div>
                        <pre style="overflow: auto">{{item.attachment}}</pre>
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
                        meta_data: {request:{body: '', url: '', headers: '', data: '',params:''},response:{content:'',json:''}},
                        attachment: ''
                    },
                ],
                dialogTestData: false,
                variableDialog: false,
                importApiStatus: false,
                saveRunStatus: false,
                importApiAddress: '',
                variableDialogData: '',
                proGatherData: '',
                configNameData: '',
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
                importFormat:'',
                form: {
                    projects: '',
                    configName: '',
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
                let variableData = JSON.parse(this.variableDialogData);
                for (let key in variableData) {
                    this.caseData.variable.push({key: key, value: JSON.stringify(variableData[key])});
                }
                this.variableDialogData = '';
                this.variableDialog = false;
            },
            saveAndRun() {
                this.saveRunStatus = true;
                this.addCase(false);
                this.test([{'caseId': this.caseData.id, 'num': '1'}], false);


            },
            addCase(status = true) {
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
                            if (status) {
                                this.caseData.modelFormVisible = false;
                            }

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
                        if((this.currentPage-1)*this.sizePage+1 === this.total){
                            this.currentPage = this.currentPage - 1
                        }
                        this.findCases();
                    }
                )
            },

            test(caseData, status = true) {
                if (status) {
                    this.loading = true;
                }
                else {
                    this.saveRunStatus = true;
                }

                this.$axios.post('/api/api/cases/run', {
                    'caseData': caseData,
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
                            this.resultShow = response['data']['data']['details'][0]['records'];
                            this.dialogTestData = true
                        }

                        if (status) {
                            this.loading = false;
                        }
                        else {
                            this.saveRunStatus = false;
                        }

                    }
                )
            },
            importCase() {

                this.$axios.post('/api/api/cases/fileChange', {
                    'importApiAddress': this.importApiAddress,
                    'projectName': this.form.projects,
                    'gatherName': this.form.gathers,
                    'importFormat': this.importFormat,
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
                            this.importApiStatus = false;
                            this.importApiAddress = '';
                            this.findCases();
                        }
                    }
                )
            },
            formatData() {
                try {
                    this.caseData.jsonVariable = JSON.parse(this.caseData.jsonVariable);
                    this.caseData.jsonVariable = JSON.stringify(this.caseData.jsonVariable, null, 4);
                }
                catch (err) {
                    this.$message({
                        showClose: true,
                        message: 'json格式错误',
                        type: 'warning',
                    });
                }
            },
            addCaseVariable() {
                this.caseData.variable.push({key: '', value: '', param_type: 'string', remark: ''});
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
            addValidate() {
                this.caseData.validate.push({key: '', value: ''});
            },
            delValidate(i) {
                this.caseData.validate.splice(i, 1);
            },
            addExtractHeader() {
                this.caseData.extract.push({key: '', value: '', remark: ''});
            },
            delExtractHeader(i) {
                this.caseData.extract.splice(i, 1);
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
            getApiAddress(response, file, fileList) {
                this.importApiAddress = response['data'];
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
            methodChange(i) {
                if (i === 'GET') {
                    this.form.choiceType = "data";
                }
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
