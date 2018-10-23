<template>
    <div class="apiEdit">
        <el-form :inline="true" :model="caseData" style="padding: 10px 20px -10px 10px;">
            <el-form-item label="基础信息" labelWidth="80px" style="margin-bottom: 5px">
                <el-select v-model="form.projectName" placeholder="请选择项目" size="small">
                    <el-option
                            v-for="(item, key) in proModelData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

                <el-select v-model="form.module" placeholder="请选择模块" value-key="moduleId"  size="small">
                    <el-option
                            v-for="item in proModelData[this.form.projectName]"
                            :key="item.moduleId"
                            :label="item.name"
                            :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="form.choiceUrl" clearable placeholder="请选择url" size="small">
                    <el-option
                            v-for="item in proUrlData[this.form.projectName]"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接口编号" label-width="80px" prop="num" v-if="caseData.id"
                          style="margin-bottom: 5px">
                <el-input v-model.number="caseData.num" auto-complete="off" placeholder="接口编号" size="small">
                </el-input>
            </el-form-item>
            <el-form-item prop="name" style="margin-bottom: 5px">
                <el-input v-model="caseData.name" auto-complete="off" placeholder="接口名称" size="small">
                </el-input>
            </el-form-item>
        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
        <el-form style="margin: 0 0 0 10px">
            <el-form-item>
                <el-input placeholder="Enter request URL" v-model="caseData.url" class="input-with-select"
                          style="width: 80%;">
                    <el-select v-model="caseData.method" size="medium" @change="methodChange"
                               style="width: 100px" slot="prepend" placeholder="选择请求方式">
                        <el-option v-for="item in methods"
                                   :key="item"
                                   :value="item"
                                   :label="item">
                        </el-option>
                    </el-select>
                    <el-button slot="append" type="primary" @click="ParamViewStatus = !ParamViewStatus">
                        Params
                    </el-button>
                </el-input>
                <el-button type="primary" @click.native="saveAndRun()" size="medium"
                           :loading="this.saveRunStatus">Send
                </el-button>
                <el-button type="primary" @click.native="addCase()" size="medium">Save</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="caseData.param" :row-style="{'background-color': 'rgb(250, 250, 250)'}"
                  style="width:98.2%;margin-top:-20px;left: 10px;" size="mini"
                  :show-header="false" v-show="this.ParamViewStatus">
            <el-table-column property="key" label="Key" header-align="center" min-width="80">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.key" size="mini" placeholder="key">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column property="value" label="Value" header-align="center" min-width="200">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.value" size="mini" placeholder="value">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column property="value" label="操作" header-align="center" width="60">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                               @click.native="delTableList('param',scope.$index)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-tabs style="margin: 0 0 0 10px" v-model="bodyShow">
            <el-tab-pane label="Headers" name="first">
                <el-table :data="caseData.header" size="mini" stripe :show-header="false"
                          class="h-b-e-a-style"
                          :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini" placeholder="key">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini" placeholder="value">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" placeholder="备注">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="操作" header-align="center" width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="delTableList('header',scope.$index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="Body" name="second" :disabled="caseData.method === 'GET'">
                <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px">
                    <el-radio-group v-model="form.choiceType">
                        <el-radio label="data">form-data</el-radio>
                        <el-radio label="json">raw</el-radio>
                    </el-radio-group>
                    <el-button type="primary" size="mini"
                               v-show="form.choiceType === 'json'"
                               style="margin-left:20px"
                               @click="formatData()">格式化

                    </el-button>
                </el-form>
                <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);"/>

                <div v-if="form.choiceType === 'json'">
                    <div style="border-style:solid;border-width: 1px;border-color: rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234)">
                        <codemirror v-model="caseData.jsonVariable" :options="options">
                        </codemirror>
                    </div>
                </div>
                <el-table :data="caseData.variable" size="mini" stripe :show-header="false" height="582"
                          style="background-color: rgb(250, 250, 250)"
                          v-if="form.choiceType === 'data'"
                          :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                    <el-table-column label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="type" header-align="center" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.param_type" size="mini">
                                <el-option v-for="item in paramTypes" :key="item" :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.param_type === 'file'">
                                <el-row>
                                    <el-col :span="18">
                                        <el-input v-model="scope.row.value" size="mini" :disabled="true">
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
                                                :on-success="fileChange">
                                            <el-button size="mini" type="primary"
                                                       @click="tempNum(scope.$index)">点击上传
                                            </el-button>
                                        </el-upload>
                                    </el-col>
                                </el-row>
                            </div>
                            <div v-else>
                                <el-input v-model="scope.row.value" size="mini">
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="操作" header-align="center" width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="delTableList('variable',scope.$index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="Extract" name="third">
                <el-table :data="caseData.extract" size="mini" stripe :show-header="false"
                          class="h-b-e-a-style"
                          :row-style="{'background-color': 'rgb(250, 250, 250)'}">
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini" placeholder="key">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini" placeholder="value">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" placeholder="备注">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="操作" header-align="center" width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="delTableList('extract',scope.$index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="Assert" name="fourth">
                <el-table :data="caseData.validate" size="mini" stripe :show-header="false"
                          class="h-b-e-a-style"
                          :row-style="{'background-color': 'rgb(250, 250, 250)'}">

                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini" placeholder="key">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Comparator" header-align="center" width="200">
                        <template slot-scope="scope">
                            <el-autocomplete
                                    class="inline-input"
                                    v-model="scope.row.comparator"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请选择"
                                    size="mini"
                            ></el-autocomplete>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini" placeholder="value">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini" placeholder="备注">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="操作" header-align="center" width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="delTableList('validate',scope.$index)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <result ref="resultFunc">
        </result>

        <errorView ref="errorViewFunc">
        </errorView>
    </div>
</template>

<script>
    import 'codemirror/addon/lint/lint.css'
    import 'codemirror/addon/lint/lint'
    import 'codemirror/addon/lint/json-lint'
    import 'codemirror/mode/javascript/javascript'
    // import 'codemirror/addon/scroll/annotatescrollbar.js'
    import 'codemirror/addon/scroll/simplescrollbars.js'
    import 'codemirror/addon/scroll/simplescrollbars.css'
    import {codemirror} from 'vue-codemirror-lite'
    import result from './result.vue'
    import errorView from '../common/errorView.vue'

    export default {
        components: {
            codemirror,
            result: result,
            errorView: errorView,
        },
        name: 'apiEdit',
        props: ['proModelData', 'projectName', 'module', 'proUrlData', 'configData'],
        data() {
            return {
                options: {
                    mode: 'application/ld+json',
                    tabSize: 4,
                    lineNumbers: true,
                    lineWrapping: true,
                    scrollbarStyle: 'simple',
                },
                bodyShow: 'second',
                paramTypes: ['string', 'file'],
                saveRunStatus: false,
                ParamViewStatus: false,
                //上传文件时，记录数组下当前数据的下标，用于把返回文件路径地址赋值
                temp_num: '',
                methods: ['POST', 'GET', 'PUT', 'DELETE'],
                form: {
                    projectName: null,
                    configName: null,
                    suiteName: null,
                    apiName: null,
                    module:{
                        name: null,
                        moduleId: null,
                    },
                    choiceUrl: '基础url1',
                    choiceType: 'data',
                },
                comparators: [
                    {'value': 'string_equals'}, {'value': 'contains'}, {'value': 'less_than'},
                    {'value': 'less_than_or_equals'}, {'value': 'greater_than'},
                    {'value': 'greater_than_or_equals'}, {'value': 'not_equals'},
                ],
                caseData: {
                    id: null,
                    project: null,
                    method: 'POST',
                    status_url: null,
                    name: null,
                    num: null,
                    desc: null,
                    funcAddress: null,
                    upFunc: null,
                    downFunc: null,
                    formLabelWidth: '80px',
                    url: '',
                    param: [{key: null, value: null}],
                    header: Array(),
                    variable: [],
                    jsonVariable: String(),
                    extract: Array(),
                    validate: Array(),
                },

            }
        },
        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            methodChange(i) {
                if (i === 'GET') {
                    this.form.choiceType = "data";
                }
            },
            formatData() {
                // 格式化json字符串
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
            fileChange(response, file, fileList) {
                this.caseData.variable[this.temp_num]['value'] = response['data'];
                this.messageShow(this, response);

            },
            tempNum(i) {
                this.temp_num = i;
            },
            initCaseData() {
                this.form.choiceType = 'data';
                this.form.choiceUrl = String();

                this.caseData.header = Array();
                this.caseData.variable = Array();
                this.caseData.param = Array();
                this.caseData.jsonVariable = String();
                this.caseData.extract = Array();
                this.caseData.validate = Array();
                this.caseData.name = null;
                this.caseData.num = null;
                this.caseData.funcAddress = null;
                this.caseData.upFunc = null;
                this.caseData.downFunc = null;
                this.caseData.desc = null;
                this.caseData.id = null;
                this.caseData.url = String();
            },
            addCase(messageClose=false) {
                // test()
                let variable;
                if (this.form.choiceType === 'data') {
                    variable = JSON.stringify(this.caseData.variable)
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
                return this.$axios.post('/api/api/cases/add', {
                    'moduleId': this.form.module.moduleId,
                    'projectName': this.form.projectName,
                    'caseName': this.caseData.name,
                    'caseNum': this.caseData.num,
                    // 'choiceUrl': this.form.choiceUrl,
                    'choiceUrl': this.proUrlData[this.form.projectName].indexOf(this.form.choiceUrl),
                    'variableType': this.form.choiceType,
                    'caseDesc': this.caseData.desc,
                    'funcAddress': this.caseData.funcAddress,
                    'upFunc': this.caseData.upFunc,
                    'downFunc': this.caseData.downFunc,
                    'caseUrl': this.caseData.url,
                    'caseId': this.caseData.id,
                    'param': JSON.stringify(this.caseData.param),
                    'caseHeader': JSON.stringify(this.caseData.header),
                    'caseVariable': variable,
                    'caseExtract': JSON.stringify(this.caseData.extract),
                    'caseMethod': this.caseData.method,
                    'caseValidate': JSON.stringify(this.caseData.validate)
                }).then((response) => {
                    if(messageClose){
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                            return false
                        }
                        else {
                            this.caseData.id = response.data['api_msg_id'];
                            this.caseData.num = response.data['num'];
                            this.$emit('findApi');
                            return true
                        }
                    }
                    else{
                        if (this.messageShow(this, response)) {
                            this.caseData.id = response.data['api_msg_id'];
                            this.caseData.num = response.data['num'];
                            this.$emit('findApi');
                            return true
                        }
                    }

                    }
                )
            },
            editCopyCase(caseId, status) {
                this.$axios.post('/api/api/cases/editAndCopy', {'caseId': caseId}).then((response) => {
                        this.caseData.name = response.data['data']['caseName'];
                        if (status === 'edit') {
                            this.caseData.num = response.data['data']['caseNum'];
                            this.caseData.id = caseId;
                        }
                        else {
                            this.caseData.num = '';
                            this.caseData.id = '';
                        }
                        if (response.data['data']['variableType'] === 'data') {
                            this.caseData.variable = response.data['data']['caseVariable'];
                            this.caseData.jsonVariable = String()
                        }
                        else {
                            this.caseData.jsonVariable = response.data['data']['caseVariable'];
                            this.caseData.variable = Array()
                        }
                        this.caseData.desc = response.data['data']['caseDesc'];
                        this.caseData.funcAddress = response.data['data']['funcAddress'];
                        this.caseData.upFunc = response.data['data']['up_func'];
                        this.caseData.downFunc = response.data['data']['down_func'];
                        this.caseData.url = response.data['data']['caseUrl'];
                        this.caseData.header = response.data['data']['caseHeader'];
                        this.form.choiceType = response.data['data']['variableType'];
                        this.caseData.param = response.data['data']['param'];
                        this.caseData.extract = response.data['data']['caseExtract'];
                        this.caseData.validate = response.data['data']['caseValidate'];
                        this.caseData.method = response.data['data']['caseMethod'];
                        this.form.choiceUrl = this.proUrlData[this.projectName][response.data['data']['status_url']];
                        this.form.projectName = this.projectName;
                        this.form.module = this.module;
                    }
                );
            },
            saveAndRun() {
                this.addCase(true).then(res => {
                    if (res) {
                        this.apiTest([{'caseId': this.caseData.id, 'num': '1'}], false);
                    }
                });
            },
            apiTest(caseData) {
                this.saveRunStatus = true;
                this.$axios.post('/api/api/cases/run', {
                    'caseData': caseData,
                    'projectName': this.form.projectName,
                    'configId': this.configData.configId,
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
                        this.saveRunStatus = false;

                    }
                )
            },
            delTableList(type, i) {
                if (type === 'variable') {
                    this.caseData.variable.splice(i, 1);
                }
                else if (type === 'header') {
                    this.caseData.header.splice(i, 1);
                }
                else if (type === 'validate') {
                    this.caseData.validate.splice(i, 1);
                }
                else if (type === 'extract') {
                    this.caseData.extract.splice(i, 1);
                }
                else if (type === 'param') {
                    this.caseData.param.splice(i, 1);
                }
            },
            addTableList(type) {
                if (type === 'variable') {
                    this.caseData.variable.push({key: null, value: null, param_type: 'string', remark: null});
                }
                else if (type === 'header') {
                    this.caseData.header.push({key: null, value: null});
                }
                else if (type === 'validate') {
                    this.caseData.validate.push({key: null, value: null});
                }
                else if (type === 'extract') {
                    this.caseData.extract.push({key: null, value: null, remark: null});
                }
                else if (type === 'param') {
                    this.caseData.param.push({key: null, value: null});
                }
            },
        },
        computed: {
            monitorParam() {
                return this.caseData.param;
            },
            monitorUrl() {
                return this.caseData.url;
            },
            monitorMethod() {
                return this.caseData.method;
            },
            monitorVariable() {
                return this.caseData.variable;
            },
            monitorHeader() {
                return this.caseData.header;
            },
            monitorExtract() {
                return this.caseData.extract;
            },
            monitorValidate() {
                return this.caseData.validate;
            },

        },
        watch: {
            monitorParam: {
                handler: function () {
                    if (this.caseData.param.length === 0) {
                        this.addTableList('param')
                    }
                    else if (this.caseData.param[this.caseData.param.length - 1]['key'] || this.caseData.param[this.caseData.param.length - 1]['value']) {
                        this.addTableList('param')
                    }
                    let strParam = '';
                    for (let i in this.caseData.param) {
                        if (parseInt(i) + 2 === this.caseData.param.length && this.caseData.param[i].key) {
                            if (this.caseData.param[i].value) {
                                strParam += this.caseData.param[i].key + '=' + this.caseData.param[i].value;
                            }
                            else {
                                strParam += this.caseData.param[i].key;
                            }
                        }
                        else if (this.caseData.param[i].key) {
                            strParam += this.caseData.param[i].key + '=' + this.caseData.param[i].value + '&';
                        }
                    }
                    if (strParam.substr(strParam.length - 1, 1) === '&') {
                        strParam = strParam.substring(0, strParam.length - 1)
                    }
                    if(strParam){
                        this.caseData.url = this.caseData.url.split("?")[0] + '?' + strParam
                    }
                    else{
                        this.caseData.url = this.caseData.url.split("?")[0]
                    }

                },
                deep: true
            },
            monitorUrl(newValue, oldValue) {
                if (!this.caseData.url) {
                    this.caseData.param = [{key: '', value: ''}];
                    return
                }
                if (this.caseData.url.indexOf('?') === -1) {
                    this.caseData.param = [{key: '', value: ''}];
                    return
                }

                let url = this.caseData.url.split("?");
                if (!url[1]) {
                    this.caseData.param = [{key: '', value: ''}];
                    return
                }
                let strParam = url[1].split("&");
                if (strParam[0]) {
                    this.caseData.param = Array();
                    for (let i = 0; i < strParam.length; i++) {
                        if (strParam[i].indexOf('=') !== -1) {
                            this.caseData.param.push({
                                key: strParam[i].split("=")[0],
                                value: unescape(strParam[i].split("=")[1])
                            });
                        }
                        else {
                            this.caseData.param.push({key: strParam[i], value: ''});
                        }
                    }
                }
            },
            monitorMethod(newValue, oldValue) {
                if (newValue === 'GET') {
                    this.bodyShow = 'first'
                }
            },
            monitorVariable: {
                handler: function () {
                    if (this.caseData.variable.length === 0) {
                        this.addTableList('variable')
                    }
                    if (this.caseData.variable[this.caseData.variable.length - 1]['key'] || this.caseData.variable[this.caseData.variable.length - 1]['value']) {
                        this.addTableList('variable')
                    }
                },
                deep: true
            },
            monitorExtract: {
                handler: function () {
                    if (this.caseData.extract.length === 0) {
                        this.addTableList('extract')
                    }
                    if (this.caseData.extract[this.caseData.extract.length - 1]['key'] || this.caseData.extract[this.caseData.extract.length - 1]['value']) {
                        this.addTableList('extract')
                    }
                },
                deep: true
            },
            monitorHeader: {
                handler: function () {
                    if (this.caseData.header.length === 0) {
                        this.addTableList('header')
                    }
                    if (this.caseData.header[this.caseData.header.length - 1]['key'] || this.caseData.header[this.caseData.header.length - 1]['value']) {
                        this.addTableList('header')
                    }
                },
                deep: true
            },
            monitorValidate: {
                handler: function () {
                    if (this.caseData.validate.length === 0) {
                        this.addTableList('validate')
                    }
                    if (this.caseData.validate[this.caseData.validate.length - 1]['key'] || this.caseData.validate[this.caseData.validate.length - 1]['value']) {
                        this.addTableList('validate')
                    }
                },
                deep: true
            },

        },
        mounted() {
        },
    }
</script>
<style>
    .CodeMirror {
        min-height: 575px;
    }
</style>
