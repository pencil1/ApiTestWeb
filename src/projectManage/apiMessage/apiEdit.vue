<template>
    <div class="apiEdit">
        <el-form :inline="true" style="padding: 10px 20px -10px 10px;">
            <el-form-item label="基础信息" labelWidth="80px" style="margin-bottom: 5px">
                <el-select v-model="form.projectName" placeholder="请选择项目" size="small">
                    <el-option
                            v-for="(item, key) in proModelData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

                <el-select v-model="form.module" placeholder="请选择模块" value-key="moduleId" size="small">
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
            <!--</el-form>-->
            <!--<el-form :inline="true" style="padding: 10px 20px -10px 10px;">-->
            <el-form-item label="接口编号" label-width="80px" prop="num" v-if="apiMsgData.id"
                          style="margin-bottom: 5px">
                <el-input v-model.number="apiMsgData.num" placeholder="接口编号" size="small"
                          style="width: 70px;text-align:center;">
                </el-input>
            </el-form-item>
            <el-form-item prop="name" style="margin-bottom: 5px">
                <el-input v-model="apiMsgData.name" placeholder="接口名称" size="small">
                </el-input>
            </el-form-item>
            <el-form-item prop="name" style="margin-bottom: 5px">

                <el-input v-model="apiMsgData.upFunc" placeholder="set_up_hooks" size="small">
                </el-input>

            </el-form-item>
            <el-form-item prop="name" style="margin-bottom: 5px">
                <el-input v-model="apiMsgData.downFunc" placeholder="set_down_hooks" size="small">
                </el-input>
            </el-form-item>
        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
        <el-form style="margin: 0 0 0 10px">
            <el-form-item>
                <el-input placeholder="Enter request URL" v-model="apiMsgData.url" class="input-with-select"
                          style="width: 80%;">
                    <el-select v-model="apiMsgData.method" size="medium" @change="methodChange"
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
                <el-button type="primary" @click.native="addApiMsg()" size="medium">Save</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="apiMsgData.param" :row-style="{'background-color': 'rgb(250, 250, 250)'}"
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
                <el-table :data="apiMsgData.header" size="mini" stripe :show-header="false"
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
            <el-tab-pane label="Body" name="second" :disabled="apiMsgData.method === 'GET'">
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
                        <codemirror v-model="apiMsgData.jsonVariable"
                                    :options="options"
                                    height="575px">
                        </codemirror>
                    </div>
                </div>
                <el-table :data="apiMsgData.variable" size="mini" stripe :show-header="false" height="582"
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
                                    <el-col :span="2" style="padding-left:10px;">
                                        <el-upload
                                                class="upload-demo"
                                                action="/api/upload"
                                                :show-file-list='false'
                                                :on-success="fileChange">
                                            <el-button size="mini" type="primary"
                                                       @click="tempNum(scope.$index)">点击上传
                                            </el-button>
                                        </el-upload>
                                    </el-col>
                                    <!--<el-col :span="2" style="padding-left:20px;">-->
                                    <!--<el-button size="mini" type="danger"-->
                                    <!--@click="delFile(scope.$index)">删除文件-->
                                    <!--</el-button>-->
                                    <!--</el-col>-->
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
                <el-table :data="apiMsgData.extract" size="mini" stripe :show-header="false"
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
                <el-table :data="apiMsgData.validate" size="mini" stripe :show-header="false"
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
                    module: {
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
                apiMsgData: {
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
                    jsonVariable: '',
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
                    this.apiMsgData.jsonVariable = JSON.parse(this.apiMsgData.jsonVariable);
                    this.apiMsgData.jsonVariable = JSON.stringify(this.apiMsgData.jsonVariable, null, 4);
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
                if (response['status'] === 0) {
                    // this.$message({
                    //     showClose: true,
                    //     message: response['msg'],
                    //     type: 'warning',
                    // });
                    this.$confirm('服务器已存在相同名字文件，是否覆盖?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let form = new FormData();
                        form.append("file", file.raw);
                        form.append("skip", '1');
                        this.$axios.post('/api/upload',form ).then((response) => {
                                this.$message({
                                    showClose: true,
                                    message: response.data['msg'],
                                    type: 'success',
                                });
                            this.apiMsgData.variable[this.temp_num]['value'] = response.data['data'];
                            }
                        );
                    }).catch(() => {

                    });
                }
                else {
                    if (response['msg']) {
                        this.$message({
                            showClose: true,
                            message: response['msg'],
                            type: 'success',
                        });
                    }
                    this.apiMsgData.variable[this.temp_num]['value'] = response['data'];
                }

            },
            tempNum(i) {
                this.temp_num = i;
            },
            initApiMsgData() {
                this.form.choiceType = 'data';
                this.form.choiceUrl = String();
                this.apiMsgData.header = Array();
                this.apiMsgData.variable = Array();
                this.apiMsgData.param = Array();
                this.apiMsgData.jsonVariable = '';
                this.apiMsgData.extract = Array();
                this.apiMsgData.validate = Array();
                this.apiMsgData.name = null;
                this.apiMsgData.num = null;
                this.apiMsgData.funcAddress = null;
                this.apiMsgData.upFunc = null;
                this.apiMsgData.downFunc = null;
                this.apiMsgData.desc = null;
                this.apiMsgData.id = null;
                this.apiMsgData.url = String();
                this.form.projectName = this.projectName;
                this.form.module = this.module;
            },
            addApiMsg(messageClose = false) {
                if (this.apiMsgData.jsonVariable) {
                    try {
                        JSON.parse(this.apiMsgData.jsonVariable)
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
                if (!this.form.projectName) {
                        this.$message({
                            showClose: true,
                            message: '请选择项目',
                            type: 'warning',
                        });
                    return
                }
                return this.$axios.post(this.$api.addApiApi, {
                    'moduleId': this.form.module.moduleId,
                    'projectName': this.form.projectName,
                    'apiMsgName': this.apiMsgData.name,
                    'num': this.apiMsgData.num,
                    // 'choiceUrl': this.form.choiceUrl,
                    'choiceUrl': this.proUrlData[this.form.projectName].indexOf(this.form.choiceUrl),
                    'variableType': this.form.choiceType,
                    'desc': this.apiMsgData.desc,
                    'funcAddress': this.apiMsgData.funcAddress,
                    'upFunc': this.apiMsgData.upFunc,
                    'downFunc': this.apiMsgData.downFunc,
                    'url': this.apiMsgData.url,
                    'apiMsgId': this.apiMsgData.id,
                    'param': JSON.stringify(this.apiMsgData.param),
                    'header': JSON.stringify(this.apiMsgData.header),
                    'variable': JSON.stringify(this.apiMsgData.variable),
                    'jsonVariable': this.apiMsgData.jsonVariable,
                    'extract': JSON.stringify(this.apiMsgData.extract),
                    'method': this.apiMsgData.method,
                    'validate': JSON.stringify(this.apiMsgData.validate)
                }).then((response) => {
                        if (messageClose) {
                            return response
                            // if (response.data['status'] === 0) {
                            //     this.$message({
                            //         showClose: true,
                            //         message: response.data['msg'],
                            //         type: 'warning',
                            //     });
                            //     return false
                            // }
                            // else {
                            //     this.apiMsgData.id = response.data['api_msg_id'];
                            //     this.apiMsgData.num = response.data['num'];
                            //     // this.$emit('findApiMsg');
                            //     return true
                            // }
                        }
                        else {
                            if (this.messageShow(this, response)) {
                                this.apiMsgData.id = response.data['api_msg_id'];
                                this.apiMsgData.num = response.data['num'];
                                // this.$emit('findApiMsg');
                                return true
                            }
                        }

                    }
                )
            },
            editCopyApiMsg(apiMsgId, status) {
                this.$axios.post(this.$api.editAndCopyApiApi, {'apiMsgId': apiMsgId}).then((response) => {
                        this.apiMsgData.name = response.data['data']['name'];
                        if (status === 'edit') {
                            this.apiMsgData.num = response.data['data']['num'];
                            this.apiMsgData.id = apiMsgId;
                        }
                        else {
                            this.apiMsgData.num = '';
                            this.apiMsgData.id = '';
                        }
                        // if (response.data['data']['variableType'] === 'data') {
                        //     this.apiMsgData.variable = response.data['data']['variable'];
                        //     this.apiMsgData.jsonVariable = String()
                        // }
                        // else {
                        //     this.apiMsgData.jsonVariable = response.data['data']['variable'];
                        //     this.apiMsgData.variable = Array()
                        // }
                        this.apiMsgData.variable = response.data['data']['variable'];
                        if (!response.data['data']['json_variable']) {
                            this.apiMsgData.jsonVariable = ''
                        }
                        else {
                            this.apiMsgData.jsonVariable = response.data['data']['json_variable'];
                        }

                        this.apiMsgData.desc = response.data['data']['desc'];
                        this.apiMsgData.funcAddress = response.data['data']['funcAddress'];
                        this.apiMsgData.upFunc = response.data['data']['up_func'];
                        this.apiMsgData.downFunc = response.data['data']['down_func'];
                        this.apiMsgData.url = response.data['data']['url'];
                        this.apiMsgData.header = response.data['data']['header'];
                        this.form.choiceType = response.data['data']['variableType'];
                        this.apiMsgData.param = response.data['data']['param'];
                        this.apiMsgData.extract = response.data['data']['extract'];
                        this.apiMsgData.validate = response.data['data']['validate'];
                        this.apiMsgData.method = response.data['data']['method'];
                        this.form.choiceUrl = this.proUrlData[this.projectName][response.data['data']['status_url']];
                        this.form.projectName = this.projectName;
                        this.form.module = this.module;
                    }
                );
            },
            saveAndRun() {
                this.addApiMsg(true).then(res => {
                    if (res.data['status'] === 0) {
                        this.$message({
                            showClose: true,
                            message: res.data['msg'],
                            type: 'warning',
                        });
                    }
                    else {
                        this.$emit('apiTest', [{'apiMsgId': res.data['api_msg_id'], 'num': '1'}], false);
                    }
                });
            },
            apiTest(apiMsgData) {
                this.saveRunStatus = true;
                this.$axios.post(this.$api.runApiApi, {
                    'apiMsgData': apiMsgData,
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
                    this.apiMsgData.variable.splice(i, 1);
                }
                else if (type === 'header') {
                    this.apiMsgData.header.splice(i, 1);
                }
                else if (type === 'validate') {
                    this.apiMsgData.validate.splice(i, 1);
                }
                else if (type === 'extract') {
                    this.apiMsgData.extract.splice(i, 1);
                }
                else if (type === 'param') {
                    this.apiMsgData.param.splice(i, 1);
                }
            },
            addTableList(type) {
                if (type === 'variable') {
                    this.apiMsgData.variable.push({key: null, value: null, param_type: 'string', remark: null});
                }
                else if (type === 'header') {
                    this.apiMsgData.header.push({key: null, value: null});
                }
                else if (type === 'validate') {
                    this.apiMsgData.validate.push({key: null, value: null});
                }
                else if (type === 'extract') {
                    this.apiMsgData.extract.push({key: null, value: null, remark: null});
                }
                else if (type === 'param') {
                    this.apiMsgData.param.push({key: null, value: null});
                }
            },
        }
        ,
        computed: {
            monitorParam() {
                return this.apiMsgData.param;
            }
            ,
            monitorUrl() {
                return this.apiMsgData.url;
            }
            ,
            monitorMethod() {
                return this.apiMsgData.method;
            }
            ,
            monitorVariable() {
                return this.apiMsgData.variable;
            }
            ,
            monitorHeader() {
                return this.apiMsgData.header;
            }
            ,
            monitorExtract() {
                return this.apiMsgData.extract;
            }
            ,
            monitorValidate() {
                return this.apiMsgData.validate;
            }
            ,

        }
        ,
        watch: {
            monitorParam: {
                handler: function () {
                    if (this.apiMsgData.param.length === 0) {
                        this.addTableList('param')
                    }
                    else if (this.apiMsgData.param[this.apiMsgData.param.length - 1]['key'] || this.apiMsgData.param[this.apiMsgData.param.length - 1]['value']) {
                        this.addTableList('param')
                    }
                    let strParam = '';
                    for (let i in this.apiMsgData.param) {
                        if (parseInt(i) + 2 === this.apiMsgData.param.length && this.apiMsgData.param[i].key) {
                            if (this.apiMsgData.param[i].value) {
                                strParam += this.apiMsgData.param[i].key + '=' + this.apiMsgData.param[i].value;
                            }
                            else {
                                strParam += this.apiMsgData.param[i].key;
                            }
                        }
                        else if (this.apiMsgData.param[i].key) {
                            strParam += this.apiMsgData.param[i].key + '=' + this.apiMsgData.param[i].value + '&';
                        }
                    }
                    if (strParam.substr(strParam.length - 1, 1) === '&') {
                        strParam = strParam.substring(0, strParam.length - 1)
                    }
                    if (strParam) {
                        this.apiMsgData.url = this.apiMsgData.url.split("?")[0] + '?' + strParam
                    }
                    else {
                        this.apiMsgData.url = this.apiMsgData.url.split("?")[0]
                    }

                }
                ,
                deep: true
            }
            ,
            monitorUrl(newValue, oldValue) {
                if (!this.apiMsgData.url) {
                    this.apiMsgData.param = [{key: '', value: ''}];
                    return
                }
                if (this.apiMsgData.url.indexOf('?') === -1) {
                    this.apiMsgData.param = [{key: '', value: ''}];
                    return
                }

                let url = this.apiMsgData.url.split("?");
                if (!url[1]) {
                    this.apiMsgData.param = [{key: '', value: ''}];
                    return
                }
                let strParam = url[1].split("&");
                if (strParam[0]) {
                    this.apiMsgData.param = Array();
                    for (let i = 0; i < strParam.length; i++) {
                        if (strParam[i].indexOf('=') !== -1) {
                            this.apiMsgData.param.push({
                                key: strParam[i].split("=")[0],
                                value: unescape(strParam[i].split("=")[1])
                            });
                        }
                        else {
                            this.apiMsgData.param.push({key: strParam[i], value: ''});
                        }
                    }
                }
            }
            ,
            monitorMethod(newValue, oldValue) {
                if (newValue === 'GET') {
                    this.bodyShow = 'first'
                }
            }
            ,
            monitorVariable: {
                handler: function () {
                    if (this.apiMsgData.variable.length === 0) {
                        this.addTableList('variable')
                    }
                    if (this.apiMsgData.variable[this.apiMsgData.variable.length - 1]['key'] || this.apiMsgData.variable[this.apiMsgData.variable.length - 1]['value']) {
                        this.addTableList('variable')
                    }
                }
                ,
                deep: true
            }
            ,
            monitorExtract: {
                handler: function () {
                    if (this.apiMsgData.extract.length === 0) {
                        this.addTableList('extract')
                    }
                    if (this.apiMsgData.extract[this.apiMsgData.extract.length - 1]['key'] || this.apiMsgData.extract[this.apiMsgData.extract.length - 1]['value']) {
                        this.addTableList('extract')
                    }
                }
                ,
                deep: true
            }
            ,
            monitorHeader: {
                handler: function () {
                    if (this.apiMsgData.header.length === 0) {
                        this.addTableList('header')
                    }
                    if (this.apiMsgData.header[this.apiMsgData.header.length - 1]['key'] || this.apiMsgData.header[this.apiMsgData.header.length - 1]['value']) {
                        this.addTableList('header')
                    }
                }
                ,
                deep: true
            }
            ,
            monitorValidate: {
                handler: function () {
                    if (this.apiMsgData.validate.length === 0) {
                        this.addTableList('validate')
                    }
                    if (this.apiMsgData.validate[this.apiMsgData.validate.length - 1]['key'] || this.apiMsgData.validate[this.apiMsgData.validate.length - 1]['value']) {
                        this.addTableList('validate')
                    }
                }
                ,
                deep: true
            }
            ,

        }
        ,
        mounted() {
        }
        ,
    }
</script>
<style>

</style>
