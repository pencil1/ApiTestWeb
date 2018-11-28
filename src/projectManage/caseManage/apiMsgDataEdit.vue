<template>
    <div class="apiMsgDataEdit">
        <el-dialog title="配置"
                   :visible.sync="paramVisible"
                   width="50%">

            <el-tabs>
                <el-tab-pane label="接口信息" style="margin-top: 10px">
                    <el-form>
                        <el-form-item label="用例名称" prop="name" label-width="120px">
                            <el-input v-model="apiCaseData.name">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="up函数" label-width="120px">
                            <el-input v-model="apiCaseData.upFunc">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="down函数" label-width="120px">
                            <el-input v-model="apiCaseData.downFunc">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="url参数" style="margin-top: 10px">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addCaseParam()">添加
                    </el-button>
                    <el-switch
                            v-model="apiCaseData.statusCase.param[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="apiCaseData.statusCase.param[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="apiCaseData.param" size="mini" stripe>
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
                                           @click.native="delCaseParam(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="接口参数" style="margin-top: 10px">
                    <el-button type="primary" size="small"
                               :disabled="form.choiceTypeStatus"
                               @click="addCaseVariable()">添加
                    </el-button>
                    <el-select v-model="form.choiceType" placeholder="请选择" size="small" disabled>
                        <el-option
                                v-for="(item,key) in choiceVariableType"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label">
                        </el-option>
                    </el-select>
                    <el-switch
                            v-model="apiCaseData.statusCase.variable[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="apiCaseData.statusCase.variable[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <div v-if="form.choiceType.toString() === 'json'">
                        <div style="margin: 0 0 15px;">
                        </div>
                        <div style="border-style:solid;border-width: 1px;border-color: rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234)">
                            <codemirror v-model="apiCaseData.json_variable"
                                        :options="options"
                                        height="500px">
                            </codemirror>
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
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="type" label="type" header-align="center" width="100">
                            <template slot-scope="scope">
                                <!--<el-input v-module="scope.row.param_type" size="medium">-->
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
                                                    action="/api/upload"
                                                    :show-file-list='false'
                                                    :on-success="fileChange"
                                            >
                                                <el-button size="small" type="primary"
                                                           @click="tempNumTwo(scope.$index)">点击上传
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
                <el-tab-pane label="信息提取" style="margin-top: 10px">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addCaseExtract()">添加
                    </el-button>
                    <el-switch
                            v-model="apiCaseData.statusCase.extract[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="apiCaseData.statusCase.extract[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="apiCaseData.extract" size="mini" stripe>
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
                                           @click.native="delCaseExtract(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="接口判断" style="margin-top: 10px">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addCaseValidate()">添加
                    </el-button>
                    <el-switch
                            v-model="apiCaseData.statusCase.validate[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch

                            v-model="apiCaseData.statusCase.validate[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="apiCaseData.validate" size="mini" stripe>
                        <el-table-column property="key" label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="medium">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="Comparator" header-align="center" minWidth="80">
                            <template slot-scope="scope">
                                <el-autocomplete
                                        class="inline-input"
                                        v-model="scope.row.comparator"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入内容">
                                </el-autocomplete>
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
    import {codemirror} from 'vue-codemirror-lite'

    export default {
        components: {
            codemirror,
        },
        name: 'apiMsgDataEdit',
        props: ['apiCases'],
        data() {
            return {
                options: {
                    mode: 'application/ld+json',
                    tabSize: 4,
                    lineNumbers: true,
                    lineWrapping: true,
                    scrollbarStyle: 'simple',
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
                temp_num: '',
                tempNum: '',
                form: {
                    choiceTypeStatus: false,
                    choiceType: 'data',
                },
                apiCaseData: {
                    name: '',
                    time: '',
                    upFunc: '',
                    downFunc: '',
                    statusCase: {variable: [], extract: [], validate: [], param: []},
                    variable: [{key: '', value: '', param_type: '', remark: ''}],
                    json_variable: '',
                    extract: [{key: '', value: ''}],
                    validate: [{key: '', value: '', comparator: ''}],
                    param: [{key: '', value: '', remark: ''}],
                },
            }
        },
        methods: {
            initData(i) {
                this.apiCaseData.param = this.apiCases[i]['param'];
                this.apiCaseData.variable = this.apiCases[i]['variable'];
                this.apiCaseData.json_variable = this.apiCases[i]['json_variable'];
                this.apiCaseData.extract = this.apiCases[i]['extract'];
                this.apiCaseData.validate = this.apiCases[i]['validate'];
                this.apiCaseData.statusCase = this.apiCases[i]['statusCase'];
                this.form.choiceType = this.apiCases[i]['variableType'];
                this.apiCaseData.name = this.apiCases[i]['case_name'];
                this.apiCaseData.time = this.apiCases[i]['time'];
                this.apiCaseData.upFunc = this.apiCases[i]['up_func'];
                this.apiCaseData.downFunc = this.apiCases[i]['down_func'];
                this.tempNum = i;
                this.paramVisible = true;
                if (this.form.choiceType.toString() === 'json') {
                    this.form.choiceTypeStatus = true
                }
                else {
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
            addCaseValidate() {
                this.apiCaseData.validate.push({key: '', value: ''});
            },
            delCaseValidate(i) {
                this.apiCaseData.validate.splice(i, 1);
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
                                    this.apiCaseData.variable[this.temp_num]['value'] = response.data['data'];
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
                        this.apiCaseData.variable[this.temp_num]['value'] = response['data'];
                    }

                },
            tempNumTwo(i) {
                this.temp_num = i;
            },
            sureConfigBtn() {
                if (this.form.choiceType.toString() === 'json') {
                    if (this.apiCaseData.json_variable) {
                        try {
                            JSON.parse(this.apiCaseData.json_variable)
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
                }
                if (this.apiCaseData.downFunc) {
                    this.apiCases[this.tempNum]['down_func'] = this.apiCaseData.downFunc;
                }
                else {
                    this.apiCases[this.tempNum]['down_func'] = '';
                }
                if (this.apiCaseData.upFunc) {
                    this.apiCases[this.tempNum]['up_func'] = this.apiCaseData.upFunc;
                }
                else {
                    this.apiCases[this.tempNum]['up_func'] = '';
                }
                if (this.apiCaseData.name) {
                    this.apiCases[this.tempNum]['case_name'] = this.apiCaseData.name;
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '请输入用例名称',
                        type: 'warning',
                    });
                    return
                }
                this.apiCases[this.tempNum]['json_variable'] = this.apiCaseData.json_variable;
                this.paramVisible = false;

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
