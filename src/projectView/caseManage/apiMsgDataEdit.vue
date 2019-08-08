<template>
    <div class="apiMsgDataEdit"
         v-loading="!paramVisible"
         element-loading-text="左侧列表数据发生变化，请点击配置按钮重新配置"
         element-loading-spinner="my-icon-2"
         >
        <!--        <el-dialog title="配置"-->
        <!--                   :visible.sync="paramVisible"-->
        <!--                   width="50%">-->
<!--        <span v-show="!paramVisible" style="color: red;margin-top: 20px">请点击左侧配置按钮加载信息</span>-->
        <el-tabs  type="card" style="margin-top: 10px">
            <el-tab-pane label="接口信息" style="margin-top: 10px">
                <el-form>
                    <el-form-item label="用例名称" prop="name" label-width="120px">
                        <el-input v-model="apiCaseData.name">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="set_up_hooks" label-width="120px">
                        <el-input v-model="apiCaseData.upFunc">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="set_down_hooks" label-width="120px">
                        <el-input v-model="apiCaseData.downFunc">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="Headers" style="margin-top: 10px">
                <el-card shadow="hover"
                         :body-style=styleCard
                >
                    <el-button type="primary" size="mini"
                               @click="addCaseHeader()">添加
                    </el-button>

                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.header[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.header[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                </el-card>
                <el-table :data="apiCaseData.header" size="mini" stripe>
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini"
                                      :id="'url_input' + scope.$index "
                                      type="textarea"
                                      rows=1
                                      resize="none"
                                      @focus="showLine('url_input', scope.$index)"
                                      @input="changeLine()"
                                      @blur="resetLine(scope.$index)">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini"
                            >
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
            <el-tab-pane label="Params" style="margin-top: 10px">
                <el-card shadow="hover"
                         :body-style=styleCard
                >
                    <el-button type="primary" size="mini"
                               @click="addCaseParam()">添加
                    </el-button>

                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.param[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.param[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                </el-card>
                <el-table :data="apiCaseData.param" size="mini" stripe>
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini"
                                      :id="'url_input' + scope.$index "
                                      type="textarea"
                                      rows=1
                                      resize="none"
                                      @focus="showLine('url_input', scope.$index)"
                                      @input="changeLine()"
                                      @blur="resetLine(scope.$index)">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="mini"
                            >
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="操作" header-align="center" width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="delCaseParam(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="Body" style="margin-top: 10px">
                <el-card shadow="hover"
                         :body-style=styleCard
                >
                    <el-button type="primary" size="mini"
                               :disabled="form.choiceTypeStatus"
                               @click="addCaseVariable()">添加
                    </el-button>
                    <!--                <span>{{form.choiceType}}</span>-->
                    <!--                <el-input type="text" v-model="form.choiceType"-->
                    <!--                          :placeholder="form.choiceType"-->
                    <!--                          disabled size="mini"-->
                    <!--                          style="width: 70px;margin-left: 5px;margin-right: 5px"></el-input>-->
                    <!--<el-select v-model="form.choiceType" placeholder="请选择" size="mini" disabled>-->
                    <!--<el-option-->
                    <!--v-for="(item) in choiceVariableType"-->
                    <!--:key="item.label"-->
                    <!--:label="item.label"-->
                    <!--:value="item.label">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.variable[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.variable[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                </el-card>
                <div v-if="form.choiceType.toString() === 'json'">
                    <div style="margin: 0 0 15px;">
                    </div>
                    <div style="border-style:solid;border-width: 1px;border-color: rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234)">
                        <el-container>
                            <editor
                                    style="font-size: 15px"
                                    v-model="apiCaseData.json_variable"
                                    @init="editorInit"
                                    lang="json"
                                    theme="chrome"
                                    width="100%"
                                    height="500px"
                                    :options="{
                             }"
                            >
                            </editor>
                        </el-container>
                    </div>
                    <!--<el-input-->
                    <!--type="textarea"-->
                    <!--:rows="27"-->
                    <!--placeholder="请输入内容"-->
                    <!--v-module="apiCaseData.variable">-->
                    <!--</el-input>-->
                </div>
                <el-table :data="apiCaseData.variable" size="mini" stripe
                          v-if="form.choiceType === 'data'">
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="type" label="type" header-align="center" width="100">
                        <template slot-scope="scope">
                            <!--<el-input v-module="scope.row.param_type" size="medium">-->
                            <!--</el-input>-->
                            <el-select v-model="scope.row.param_type" size="mini">
                                <el-option v-for="item in paramTypes" :key="item" :value="item">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <div v-if="scope.row.param_type === 'file'">
                                <el-row>
                                    <el-col :span="17">
                                        <el-input v-model="scope.row.value" size="mini" :disabled="true">
                                        </el-input>
                                    </el-col>
                                    <el-col :span="1">
                                        <p></p>
                                    </el-col>
                                    <el-col :span="3">
                                        <el-upload
                                                class="upload-demo"
                                                action="/api/upload"
                                                :show-file-list='false'
                                                :on-success="fileChange"
                                        >
                                            <el-button size="mini" type="primary"
                                                       @click="tempNumTwo(scope.$index)">点击上传
                                            </el-button>
                                        </el-upload>
                                    </el-col>
                                </el-row>


                            </div>
                            <div v-else>
                                <el-input v-model="scope.row.value" size="mini"
                                          :id="'data2_input' + scope.$index "
                                          type="textarea"
                                          rows=1
                                          resize="none"
                                          @focus="showLine('data2_input', scope.$index)"
                                          @input="changeLine()"
                                          @blur="resetLine(scope.$index)">
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
                                       @click.native="delCaseVariable(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="Extract" style="margin-top: 10px">
                <el-card shadow="hover"
                         :body-style=styleCard>
                    <el-button type="primary" size="mini"
                               @click="addCaseExtract()">添加
                    </el-button>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.extract[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.extract[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                </el-card>
                <el-table :data="apiCaseData.extract" size="mini" stripe>
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini">
                            </el-input>
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
                                       @click.native="delCaseExtract(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="Assert" style="margin-top: 10px">
                <el-card shadow="hover"
                         :body-style=styleCard>
                    <el-button type="primary" size="mini"
                               @click="addCaseValidate()">添加
                    </el-button>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.validate[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="apiCaseData.statusCase.validate[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                </el-card>
                <el-table :data="apiCaseData.validate" size="mini" stripe>
                    <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.key" size="mini">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Comparator" header-align="center" minWidth="80">
                        <template slot-scope="scope">
                            <el-autocomplete
                                    class="inline-input"
                                    v-model="scope.row.comparator"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    size="mini">
                            </el-autocomplete>
                        </template>
                    </el-table-column>
                    <el-table-column property="value" label="Value" header-align="center" minWidth="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.value" size="mini">
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
        <div slot="footer" class="dialog-footer" style="margin-top: 5px">
            <el-button @click="initData(tempNum)" size="mini">还 原</el-button>
            <el-button type="primary"
                       @click="sureConfigBtn()" size="mini">保 存
            </el-button>
            <el-tooltip style="margin-left: 10px" content="ps:信息修改后，记得点击保存哦(右下角的保存按钮不保存当前步骤信息)">
                <div class="my-icon-cuowu"></div>
            </el-tooltip>
        </div>

    </div>
</template>

<script>

    export default {
        components: {
            editor: require('vue2-ace-editor'),
        },
        name: 'apiMsgDataEdit',
        props: ['apiCases'],
        data() {
            return {
                styleCard: {
                    'padding': '5px'
                },
                choiceVariableType: [{
                    value: '选项1',
                    label: 'data'
                }, {
                    value: '选项2',
                    label: 'json'
                }],
                comparators: [{'value': 'equals'}, {'value': 'less_than'}, {'value': 'less_than_or_equals'},
                    {'value': 'greater_than'}, {'value': 'greater_than_or_equals'}, {'value': 'not_equals'},
                    {'value': 'string_equals'}, {'value': 'length_equals'}, {'value': 'length_greater_than'},
                    {'value': 'count_greater_than_or_equals'}, {'value': 'length_less_than'},
                    {'value': 'length_less_than_or_equals'}],
                paramTypes: ['string', 'file'],
                paramVisible: false,
                temp_num: '', // 为了记录上传文件时，当前数据的下标
                tempNum: '', // 为了记录接口步骤数据列表的下标
                cell: Object(),
                form: {
                    choiceTypeStatus: false,
                    choiceType: 'data',
                },
                tempApiCaseData: '',
                apiCaseData: {
                    name: '',
                    time: '',
                    upFunc: '',
                    downFunc: '',
                    statusCase: {variable: [], extract: [], validate: [], param: [], header: []},
                    variable: [{key: '', value: '', param_type: '', remark: ''}],
                    json_variable: '',
                    extract: [{key: '', value: ''}],
                    validate: [{key: '', value: '', comparator: ''}],
                    param: [{key: '', value: '', remark: ''}],
                    header: [{key: '', value: '', remark: ''}],
                },
            }
        },
        methods: {
            editorInit() {
                require('brace/ext/language_tools');
                require('brace/mode/json');
                require('brace/theme/chrome');
                require('brace/snippets/json')
            },
            resetLine() {
                //  重置单元格高度
                this.cell.style.height = '18px';
            },
            showLine(prefix, n) {
                //  获取单元格的滚动条高度，并使单元格为该高度
                this.cell = document.getElementById(prefix + n);
                this.cell.style.height = this.cell.scrollHeight + 'px';
            },
            changeLine() {
                //  当单元格高度和滚动条高度不一致时，改变单元格高度
                if (this.cell.style.height !== this.cell.scrollHeight + 'px') {
                    let i = parseInt(this.cell.style.height.substring(0, this.cell.style.height.length - 2));
                    if (i - this.cell.scrollHeight === 2) {
                        this.cell.style.height = (i - 18) + 'px'
                    }
                    this.cell.style.height = this.cell.scrollHeight + 'px';
                }
            },
            initData(i) {
                //  初始化步骤数据
                this.apiCaseData.param = this.apiCases[i]['param'];
                this.apiCaseData.variable = this.apiCases[i]['variable'];
                this.apiCaseData.json_variable = this.apiCases[i]['json_variable'];
                this.apiCaseData.extract = this.apiCases[i]['extract'];
                this.apiCaseData.validate = this.apiCases[i]['validate'];
                this.apiCaseData.header = this.apiCases[i]['header'];
                this.apiCaseData.statusCase = this.apiCases[i]['statusCase'];
                this.form.choiceType = this.apiCases[i]['variableType'];
                this.apiCaseData.name = this.apiCases[i]['case_name'];
                this.apiCaseData.time = this.apiCases[i]['time'];
                this.apiCaseData.upFunc = this.apiCases[i]['up_func'];
                this.apiCaseData.downFunc = this.apiCases[i]['down_func'];
                this.tempNum = i;
                this.paramVisible = true;
                if (this.form.choiceType === 'json') {
                    this.form.choiceTypeStatus = true
                } else {
                    this.form.choiceTypeStatus = false
                }
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            addCaseVariable() {
                this.apiCaseData.variable.push({key: '', value: '', param_type: 'string', remark: ''});
            },
            delCaseVariable(i) {
                this.apiCaseData.variable.splice(i, 1);
            },
            addCaseExtract() {
                this.apiCaseData.extract.push({key: '', value: '', remark: ''});
            },
            delCaseExtract(i) {
                this.apiCaseData.extract.splice(i, 1);
            },
            addCaseParam() {
                this.apiCaseData.param.push({key: '', value: '', remark: ''});
            },
            delCaseParam(i) {
                this.apiCaseData.param.splice(i, 1);
            },
            addCaseHeader() {
                this.apiCaseData.header.push({key: '', value: '', remark: ''});
            },
            delCaseHeader(i) {
                this.apiCaseData.header.splice(i, 1);
            },
            addCaseValidate() {
                this.apiCaseData.validate.push({key: '', value: ''});
            },
            delCaseValidate(i) {
                this.apiCaseData.validate.splice(i, 1);
            },
            fileChange(response, file) {
                //  上传文件
                if (response['status'] === 0) {
                    this.$confirm('服务器已存在相同名字文件，是否覆盖?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let form = new FormData();
                        form.append("file", file.raw);
                        form.append("skip", '1');
                        this.$axios.post('/api/upload', form).then((response) => {
                                this.$message({
                                    showClose: true,
                                    message: response.data['msg'],
                                    type: 'success',
                                });
                                this.apiCaseData.variable[this.temp_num]['value'] = response.data['data'];
                            }
                        );
                    }).catch(() => {

                    });
                } else {
                    if (response['msg']) {
                        this.$message({
                            showClose: true,
                            message: response['msg'],
                            type: 'success',
                        });
                    }
                    this.apiCaseData.variable[this.temp_num]['value'] = response['data'];
                }

            },
            tempNumTwo(i) {
                //  上传文件时，记录当前数据再数组中的下标
                this.temp_num = i;
            },
            sureConfigBtn() {
                //  点击确定时，同步数据到步骤list
                if (this.form.choiceType.toString() === 'json') {
                    if (this.apiCaseData.json_variable) {
                        try {
                            JSON.parse(this.apiCaseData.json_variable)
                        } catch (err) {
                            this.$message({
                                showClose: true,
                                message: 'json格式错误',
                                type: 'warning',
                            });
                            return
                        }
                    }
                }
                if (this.apiCaseData.downFunc) {
                    this.apiCases[this.tempNum]['down_func'] = this.apiCaseData.downFunc;
                } else {
                    this.apiCases[this.tempNum]['down_func'] = ''
                }
                if (this.apiCaseData.upFunc) {
                    this.apiCases[this.tempNum]['up_func'] = this.apiCaseData.upFunc;
                } else {
                    this.apiCases[this.tempNum]['up_func'] = ''
                }
                if (this.apiCaseData.name) {
                    this.apiCases[this.tempNum]['case_name'] = this.apiCaseData.name;
                } else {
                    this.$message({
                        showClose: true,
                        message: '请输入用例名称',
                        type: 'warning',
                    });
                    return
                }
                this.apiCases[this.tempNum]['json_variable'] = this.apiCaseData.json_variable;
                this.$message({
                        showClose: true,
                        message: '步骤配置保存成功',
                        type: 'success',
                    });
                // this.paramVisible = false;
            },
        },
        mounted() {
        },
    }
</script>
<style>
    .cm-s-default .cm-property {
        color: rgb(183, 40, 135);
        /*color: rgb(137, 21, 99);*/
    }

    .cm-s-default .cm-string {
        /*color: rgb(116,88,255);*/
        color: rgb(71, 35, 255);
    }

    .cm-s-default .cm-atom {
        color: #000000;
    }
</style>
