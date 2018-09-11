<template>
    <div class="caseManage" v-loading="this.loading">

        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目、模块" labelWidth="110px">
                <el-select v-model="form.projectName" placeholder="请选择项目" @change="clearChoice" style="width: 150px">
                    <el-option
                            v-for="(item, key) in proModelData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

                <el-select v-model="form.modelName" placeholder="请选择模块" style="width: 150px">
                    <el-option
                            v-for="item in proModelData[this.form.projectName]"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="form.configName" placeholder="请选择配置" style="width: 150px">
                    <el-option
                            v-for="item in configNameData[this.form.projectName]"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="接口名称" v-if="showNumTab !== 'third'">
                <el-input placeholder="请输入" v-model="form.apiName" clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="套件名称" v-if="showNumTab === 'third'">
                <el-input placeholder="请输入" v-model="form.suiteName" clearable>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findData()">搜索</el-button>
                <el-button type="primary" @click.native="initCaseData()">录入接口信息</el-button>
                <el-button type="primary"
                           v-if="showNumTab === 'first'"
                           @click.native="apiTest(casesList)">测试
                </el-button>
                <el-button type="primary" v-if="showNumTab === 'third'"
                           @click.native="suiteTest(suiteList)">测试
                </el-button>
                <el-tooltip content="查看最近一次接口结果" placement="top-start">
                    <el-button type="primary" icon="el-icon-view" @click="resultViewStatus = true"></el-button>
                </el-tooltip>
                <el-button type="primary" @click.native="initSuiteView()">添加套件</el-button>
                <el-button type="primary" @click="importApiData.importApiStatus = true">导入信息</el-button>
            </el-form-item>
        </el-form>


        <el-scrollbar wrapStyle="height:840px;">
            <el-tabs v-model="showNumTab" style="padding-left: 10px;">
                <el-tab-pane label="接口信息" name="first">
                    <el-table
                            ref="apiMultipleTable"
                            @selection-change="handleCaseSelection"
                            :data="caseTableData"
                            stripe>
                        <el-table-column
                                type="selection"
                                width="40">
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
                                           @click.native="editCopyCase(caseTableData[scope.$index]['caseId'],'edit')">编辑
                                </el-button>
                                <el-button type="primary" icon="el-icon-tickets" size="mini"
                                           @click.native="editCopyCase(caseTableData[scope.$index]['caseId'],'copy')">复制
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="sureView(delCases,caseTableData[scope.$index]['caseId'])">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择
                    </el-button>
                    <div class="pagination">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                                :page-size="20"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="接口套件" name="third">
                    <el-table
                            ref="suiteMultipleTable"
                            @selection-change="handleSuiteSelection"
                            :data="suiteTableData"
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
                                label="套件名称"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip=true
                                prop="api_names"
                                label="接口信息">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="320">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click.native="editSuite(suiteTableData[scope.$index]['id'])">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="sureView(delSuite,suiteTableData[scope.$index]['id'])">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">取消选择
                    </el-button>
                    <div class="pagination">
                        <el-pagination
                                @current-change="handleCurrentChange"
                                @size-change="handleSizeChange"
                                :page-size="20"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="this.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane :label="tabName" name="second" v-if="editShow"
                             style="background-color: rgb(250, 250, 250);min-height: 780px">
                    <el-form :inline="true" :model="caseData" style="padding: 10px 20px -10px 10px;">
                        <el-form-item label="基础信息" labelWidth="80px" style="margin-bottom: 5px">
                            <el-select v-model="form.projectName" placeholder="请选择项目" size="small">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                            <el-select v-model="form.modelName" placeholder="请选择模块" size="small">
                                <el-option
                                        v-for="item in proModelData[this.form.projectName]"
                                        :key="item"
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
                                    <codemirror :value="caseData.jsonVariable" :options="options">
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

                </el-tab-pane>
            </el-tabs>
        </el-scrollbar>


        <el-dialog title="套件配置" :visible.sync="suiteData.suiteViewStatus">
            <el-form :inline="true">
                <el-form-item label="编号" label-width="75px" v-if="suiteData.id">
                    <el-input v-model.number="suiteData.num">
                    </el-input>
                </el-form-item>
                <el-form-item label="套件名称" label-width="75px">
                    <el-input v-model.number="suiteData.name">
                    </el-input>
                </el-form-item>
            </el-form>
            <hr style="border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -10px"/>
            <el-table
                    :data="suiteData.apiList"
                    stripe>
                <el-table-column
                        :show-overflow-tooltip=true
                        prop="name"
                        label="接口名称"
                        min-width="60">
                </el-table-column>
                <el-table-column
                        :show-overflow-tooltip=true
                        prop="url"
                        label="接口地址">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click.native="upNum(scope.$index)">升序</el-button>
                        <el-button type="primary" size="mini" @click.native="downNum(scope.$index)">降序</el-button>
                        <el-button type="danger" size="mini" @click.native="delNum(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="suiteData.suiteViewStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="addSuite()">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="接口信息导入" :visible.sync="importApiData.importApiStatus" width="30%">
            <el-form>
                <el-form-item label="请选择导入格式">
                    <el-radio-group v-model="importApiData.importFormat">
                        <el-radio label="HAR"></el-radio>
                        <el-radio label="postman(JSON)"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="文件地址">
                    <el-input v-model="importApiData.importApiAddress" size="medium" :disabled="true">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            action="/api/api/upload"
                            :show-file-list='false'
                            :on-success="getFileAddress">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="importApiData.importApiStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="importCase()">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="测试结果" :visible.sync="resultViewStatus" width="45%">
            <el-collapse accordion>
                <el-collapse-item
                        v-for="(item, index) in resultShowData"
                        :key="index">
                    <template slot="title">
                        <div :style="item.attachment ? 'color:rgb(255, 74, 74)': 'color:#303133'">{{item.name}}</div>
                    </template>
                    <!--<el-button type="primary" v-clipboard:copy="JSON.stringify(item.meta_data.response_body)"-->
                    <!--size="small"-->
                    <!--style="position:absolute;right: 3%;">复制-->
                    <!--</el-button>-->
                    <div style="color: red">url：</div>
                    <div>{{item.meta_data.request.url}}</div>
                    <div style="color: red">请求params：</div>
                    <div>{{item.meta_data.request.params}}</div>
                    <div style="color: red">请求body：</div>
                    <div>{{item.meta_data.request.body}}</div>
                    <div style="color: red">请求参数：</div>
                    <div v-if="item.meta_data.request.data !== '{}'">{{item.meta_data.request.data}}</div>
                    <div v-if="item.meta_data.request.json">{{item.meta_data.request.json}}</div>
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
    </div>
</template>

<script>
    import {codemirror} from 'vue-codemirror-lite'

    import 'codemirror/addon/lint/lint.css'
    import 'codemirror/addon/lint/lint'
    import 'codemirror/addon/lint/json-lint'
    import 'codemirror/mode/javascript/javascript'

    // import 'codemirror/addon/scroll/annotatescrollbar.js'
    import 'codemirror/addon/scroll/simplescrollbars.js'
    import 'codemirror/addon/scroll/simplescrollbars.css'
    // import 'codemirror/mode/css/csslint.js'
    // import 'codemirror/mode/css/jshint.min'
    // import 'codemirror/mode/css/jsonlint'
    // import 'codemirror/addon/lint/css-lint'
    // import 'codemirror/addon/lint/javascript-lint'

    export default {
        components: {
            codemirror
        },
        name: 'caseManage',
        data() {
            return {
                editShow: false,
                url: null,
                options: {
                    mode: 'application/ld+json',
                    tabSize: 4,
                    lineNumbers: true,
                    lineWrapping: true,
                    scrollbarStyle: 'simple',
                },
                bodyShow: 'second',
                ParamViewStatus: false,
                tabName: '编辑接口',
                radioType: 'data',
                theRequest: [{key: null, value: null}],
                showNumTab: 'first',
                loading: false,
                resultShowData: [
                    {
                        name: null,
                        attachment: null,
                        meta_data: {
                            request: {body: null, url: null, headers: null, data: null, params: null, json:null},
                            response: {content: null, json: null}
                        },
                    },
                ],
                resultViewStatus: false,
                variableDialog: false,
                importApiData: {importApiStatus: false, importFormat: null, importApiAddress: null,},
                saveRunStatus: false,
                variableDialogData: null,
                proModelData: '',
                configNameData: '',

                //上传文件时，记录数组下当前数据的下标，用于把返回文件路径地址赋值
                temp_num: '',

                fileList: Array(),
                proUrlData: null,
                methods: ['POST', 'GET', 'PUT', 'DELETE'],
                paramTypes: ['string', 'file'],
                comparators: [
                    {'value': 'string_equals'}, {'value': 'contains'}, {'value': 'less_than'},
                    {'value': 'less_than_or_equals'}, {'value': 'greater_than'},
                    {'value': 'greater_than_or_equals'}, {'value': 'not_equals'},
                ],
                caseTableData: Array(),
                suiteTableData: Array(),
                casesList: Array(),
                apiList: Array(),
                suiteList: Array(),
                total: 1,
                currentPage: 1,
                sizePage: 20,

                form: {
                    projectName: null,
                    configName: null,
                    suiteName: null,
                    apiName: null,
                    modelName: null,
                    choiceUrl: '基础url1',
                    choiceType: 'data',

                },
                suiteData: {
                    apiList: Array(),
                    suiteViewStatus: false,
                    id: null,
                    name: null,
                    num: null,
                },
                caseData: {
                    id: null,
                    modelFormVisible: false,
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
                }
            }
        },

        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            initBaseData() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.configNameData = response.data['config_name_list'];
                        this.proUrlData = response.data['urlData'];
                        this.form.projectName = response.data['user_pro']['pro_name'];
                        this.form.configName = response.data['config_name_list'][this.form.projectName][0].toString();
                        this.form.modelName = response.data['user_pro']['model_list'][0].toString();
                        this.findCases();
                        this.findSuite();
                    }
                )
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findCases();
                this.findSuite();
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findCases();
                this.findSuite();
            },
            findData() {
                if (this.showNumTab !== 'third') {
                    this.findCases()
                }
                else {
                    this.findSuite()
                }
            },
            findSuite() {
                this.$axios.post('/api/api/suite/find', {
                    'suiteName': this.form.suiteName,
                    'projectName': this.form.projectName,
                    'modelName': this.form.modelName,
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
                            this.suiteTableData = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            findCases() {
                this.$axios.post('/api/api/cases/find', {
                    'caseName': this.form.apiName,
                    'projectName': this.form.projectName,
                    'gatName': this.form.modelName,
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
                            this.caseTableData = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            initCaseData() {
                this.editShow = true;
                this.showNumTab = 'second';
                this.tabName = '新增接口';
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
                // this.caseData.modelFormVisible = true;
            },
            saveAndRun() {
                this.addCase(false);
                if (this.caseData.id) {
                    this.apiTest([{'caseId': this.caseData.id, 'num': '1'}], false);
                }
            },
            addCase(status = true) {
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
                this.$axios.post('/api/api/cases/add', {
                    'gatherName': this.form.modelName,
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
                                this.$message({
                                    showClose: true,
                                    message: response.data['msg'],
                                    type: 'success',
                                });
                                this.findCases();
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
                        this.form.choiceUrl = this.proUrlData[this.form.projectName][response.data['data']['status_url']];
                        this.caseData.modelFormVisible = true;
                    }
                );
                this.editShow = true;
                this.showNumTab = 'second';
                this.tabName = '编辑接口';
            },
            delCases(caseId) {
                this.$axios.post('/api/api/cases/del', {'caseId': caseId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.apiName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findCases();
                    }
                )
            },
            delSuite(suiteId) {
                this.$axios.post('/api/api/suite/del', {'suiteId': suiteId}).then((response) => {
                        this.messageShow(this, response);
                        this.form.apiName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findSuite();
                    }
                )
            },
            suiteTest(suiteData) {
                this.loading = true;
                this.$axios.post('/api/api/cases/run', {
                    'suiteData': suiteData,
                    'projectName': this.form.projectName,
                    'gathers': this.form.modelName,
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
                            this.resultShowData = response['data']['data']['details'][0]['records'];
                            this.resultViewStatus = true;
                            this.loading = false;
                        }
                    }
                )
            },
            apiTest(caseData, status = true) {
                if (status) {
                    this.loading = true;
                }
                else {
                    this.saveRunStatus = true;
                }
                this.$axios.post('/api/api/cases/run', {
                    'caseData': caseData,
                    'projectName': this.form.projectName,
                    'gathers': this.form.modelName,
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
                            this.resultShowData = response['data']['data']['details'][0]['records'];
                            this.resultViewStatus = true
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
            initSuiteView() {
                if (this.casesList.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请至少选择1条接口信息',
                        type: 'warning',
                    });
                }
                else {
                    this.suiteData.name = null;
                    this.suiteData.num = null;
                    this.suiteData.id = null;
                    this.suiteData.apiList = JSON.parse(JSON.stringify(this.casesList));
                    this.suiteData.suiteViewStatus = true;
                }
            },
            editSuite(suiteId) {
                this.$axios.post('/api/api/suite/edit', {'suiteId': suiteId}).then((response) => {
                        this.suiteData.apiList = response['data']['data']['apiData'];
                        this.suiteData.num = response['data']['data']['num'];
                        this.suiteData.name = response['data']['data']['name'];
                        this.suiteData.id = response['data']['data']['id'];
                        this.suiteData.suiteViewStatus = true;
                    }
                )
            },
            addSuite() {
                let apiData = Array();
                for (let i = 0; i < this.suiteData.apiList.length; i++) {
                    apiData.push(this.suiteData.apiList[i].caseId);
                }
                this.$axios.post('/api/api/suite/add', {
                    'projectName': this.form.projectName,
                    'gatherName': this.form.modelName,
                    'num': this.suiteData.num,
                    'suiteId': this.suiteData.id,
                    'suiteName': this.suiteData.name,
                    'apiData': apiData,
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
                            this.findSuite();
                            this.suiteData.suiteViewStatus = false;
                            this.cancelSelection();
                        }
                    }
                )
            },
            importCase() {
                this.$axios.post('/api/api/cases/fileChange', {
                    'importApiAddress': this.importApiData.importApiAddress,
                    'projectName': this.form.projectName,
                    'gatherName': this.form.modelName,
                    'importFormat': this.importApiData.importFormat,
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
                            this.importApiData.importApiStatus = false;
                            this.importApiAddress = null;
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
            handleCaseSelection(val) {
                this.casesList = val;
            },
            handleSuiteSelection(val) {
                this.suiteList = val;
            },
            cancelSelection() {
                this.$refs.apiMultipleTable.clearSelection();
                this.$refs.suiteMultipleTable.clearSelection();
            },
            fileChange(response, file, fileList) {
                this.caseData.variable[this.temp_num]['value'] = response['data'];
                if (response['status'] === 0) {
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
            getFileAddress(response, file, fileList) {
                this.importApiData.importApiAddress = response['data'];
                if (response['status'] === 0) {
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
            clearChoice() {
                this.form.modelName = null;
                this.form.configName = null;
            },
            methodChange(i) {
                if (i === 'GET') {
                    this.form.choiceType = "data";
                }
            },
            upNum(i) {
                let d = this.suiteData.apiList[i];
                this.suiteData.apiList.splice(i, 1);
                this.suiteData.apiList.splice(i - 1, 0, d);
            },
            downNum(i) {
                let d = this.suiteData.apiList[i];
                this.suiteData.apiList.splice(i, 1);
                this.suiteData.apiList.splice(i + 1, 0, d);
            },
            delNum(i) {
                this.suiteData.apiList.splice(i, 1);
            },

        },
        computed: {
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
            monitorParam() {
                return this.caseData.param;
            },
        },
        watch: {
            monitorUrl(newValue, oldValue) {
                if (!this.caseData.url) {
                    return
                }
                if (this.caseData.url.indexOf('?') === -1) {

                    return
                }
                let url = this.caseData.url.split("?");
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
                    this.caseData.url = this.caseData.url.split("?")[0] + '?' + strParam
                },
                deep: true
            },
        },
        // created(){
        //     this.getProModel(this, this.findCases);
        // },
        mounted() {
            this.initBaseData();
        },
    }
</script>
<style>
    .cm-s-default .cm-property {
        color: rgb(183, 40, 135);
        /*color: rgb(137, 21, 99);*/
    }

    .CodeMirror-gutter {
        width: 40px;
    }

    .cm-s-default .cm-string {
        /*color: rgb(116,88,255);*/
        color: rgb(71, 35, 255);
    }

    .cm-s-default .cm-atom {
        color: #000000;
    }

    .h-b-e-a-style {
        background-color: rgb(250, 250, 250);
        /*min-height: 430px;*/
    }

</style>
