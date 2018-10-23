<template>
    <div class="sceneManage" v-loading="this.loading">
        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目名称" labelWidth="110px">
                <el-select v-model="form.projectName" placeholder="请选择项目" @change="clearGathers">
                    <el-option
                            v-for="(item, key) in proModelData"
                            :key="key"
                            :value="key">
                    </el-option>
                </el-select>

            </el-form-item>
            <el-form-item label="用例名称">
                <el-input placeholder="请输入用例" v-model="form.sceneName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findSet()">搜索</el-button>
                <el-button type="primary" @click.native="initSceneData()">添加接口用例</el-button>
                <el-button type="primary" @click.native="runScene(sceneList,true)">批量运行</el-button>
                <el-button type="primary" icon="el-icon-search" @click.native="findOldScenes()">搜索旧数据</el-button>
            </el-form-item>
        </el-form>

        <el-row>
            <el-col :span="4"
                    style="border-style:solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;border-width: 1px;">
                <el-row>
                    <el-col style="border-style:solid;border-color: #ead4d4;border-width: 1px;padding:2px">
                        <el-button-group style="float:right;">
                            <el-button size="mini" type="primary" @click.native="initSet()">添加</el-button>
                            <el-button size="mini" type="primary" @click.native="editSet()">编辑</el-button>
                            <el-button size="mini" type="success" @click.native="stickSet()">置顶</el-button>
                            <el-button size="mini" type="danger" @click.native="sureView(delSet)">删除</el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row>
                    <el-scrollbar>
                        <el-tree
                                ref="testTree"
                                @node-click="handleNodeClick"
                                class="filter-tree"
                                highlight-current
                                node-key="id"
                                accordion
                                :props="defaultProps"
                                :filter-node-method="filterNode"
                                :load="loadNode1"
                                lazy
                                style="height: 800px;">
                        </el-tree>
                    </el-scrollbar>
                </el-row>
            </el-col>
            <el-col :span="20">
                <el-scrollbar wrapStyle="height:800px;">
                    <el-tabs value="first" style="padding-left: 10px">
                        <el-tab-pane label="业务列表" name="first">
                            <el-table
                                    ref="sceneMultipleTable"
                                    @selection-change="handleSceneSelection"
                                    :data="sceneAll" stripe>
                                <el-table-column
                                        type="selection"
                                        width="40">
                                </el-table-column>
                                <el-table-column
                                        prop="num"
                                        label="编号"
                                        min-width="10">
                                </el-table-column>
                                <el-table-column
                                        prop="name"
                                        label="名称"
                                        min-width="50">
                                </el-table-column>
                                <el-table-column
                                        prop="desc"
                                        label="描述"
                                        min-width="50">
                                </el-table-column>
                                <el-table-column
                                        label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                                   @click.native="editScene(sceneAll[scope.$index]['sceneId'])">编辑
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-tickets" size="mini"
                                                   @click.native="editScene(sceneAll[scope.$index]['sceneId'],true)">复制
                                        </el-button>
                                        <el-button type="primary" icon="el-icon-setting" size="mini"
                                                   @click.native="runScene(sceneAll[scope.$index]['name'])">运行
                                        </el-button>
                                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                                   @click.native="sureView(delScene,sceneAll[scope.$index]['sceneId'])">
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <el-button @click="cancelSelection()" size="mini"
                                       style="position: absolute;margin-top: 2px;">取消选择
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
                    </el-tabs>
                </el-scrollbar>
            </el-col>

        </el-row>
        <el-dialog title="用例" :visible.sync="sceneData.modelFormVisible" width="50%" top="5vh">


            <el-tabs value="fourth">
                <!--<el-tabs @tab-click="refresh" value="fourth">-->
                <el-tab-pane label="用例信息" name="first" style="margin-top: 10px">
                    <el-form :model="sceneData">
                        <el-form-item label="业务编号" :label-width="sceneData.formLabelWidth"
                                      prop="num" v-if="sceneData.id"
                        >
                            <el-input v-model.number="sceneData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="业务名称" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="sceneData.name" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="业务描述" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="sceneData.desc" auto-complete="off">
                            </el-input>
                        </el-form-item>

                        <el-form :inline="true">
                            <el-form-item label="项目名称" :label-width="sceneData.formLabelWidth">
                                <!--<el-input v-model="form.projectName" auto-complete="off" :disabled="true">-->
                                <!--</el-input>-->
                                <el-select v-model="form.projectName" placeholder="请选择项目" @change="resetSetChoice" >
                                    <el-option
                                            v-for="(item, key) in proModelData"
                                            :key="key"
                                            :value="key">
                                    </el-option>
                                </el-select>
                                <el-select v-model="form.setName" placeholder="请选择用例集" @change="getSetId" value-key>
                                    <el-option
                                            v-for="item in allSetList[this.form.projectName]"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item.id">
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
                            :data="caseList"
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
                                        v-model="caseList[scope.$index]['status']"
                                >
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="用例名称"
                                minWidth="50">
                            <template slot-scope="scope">
                                <el-input v-model="caseList[scope.$index]['case_name']" auto-complete="off">
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
                                minWidth="40">
                            <template slot-scope="scope">
                                <el-input v-model="caseList[scope.$index]['time']" auto-complete="off">
                                </el-input>
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
                                           @click.native="caseConfigBtn(scope.$index)">配置
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="接口信息" name="third">
                    <el-form :inline="true" class="demo-form-inline search-style" size="small">
                        <el-form-item label=" " labelWidth="10px">
                            <el-select v-model="form.apiMesProjectName" placeholder="请选择项目" @change="apiFindChoice">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                            <el-select v-model="form.modelName" placeholder="请选择模块">
                                <el-option
                                        v-for="item in proModelData[this.form.apiMesProjectName]"
                                        :key="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">

                            <el-input placeholder="请输入用例or套件" v-model="form.caseName">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click.native="findCases()" size="small">
                                搜索接口
                            </el-button>
                            <el-button type="primary" @click.native="findSuite()" size="small">
                                搜索套件
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
                            stripe
                            v-show="apiSuiteViewStatus">
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

                    <el-table
                            ref="multipleTable"
                            @selection-change="handleCaseSelection"
                            :data="suiteData"
                            height="550"
                            stripe
                            v-show="!apiSuiteViewStatus"
                    >
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
                                width="100">
                        </el-table-column>
                        <!--<el-table-column-->
                        <!--:show-overflow-tooltip= true-->
                        <!--prop="desc"-->
                        <!--label="接口描述"-->
                        <!--width="200">-->
                        <!--</el-table-column>-->
                        <el-table-column
                                :show-overflow-tooltip=true
                                prop="api_names"
                                label="接口信息">
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
                                :total="this.scenePage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="业务变量" name="fourth">
                    <el-form :inline="true" class="demo-form-inline search-style" size="small">
                        <el-form-item label=" " labelWidth="10px">
                            <el-select v-model="form.projectName" placeholder="请选择项目" @change="clearGathers">
                                <el-option
                                        v-for="(item, key) in proModelData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>

                            <el-select v-model="form.configName" placeholder="请选择配置">
                                <el-option
                                        v-for="item in configNameData[this.form.projectName]"
                                        :key="item"
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

        <el-dialog title="配置" :visible.sync="paramVisible" width="50%">

            <el-tabs @tab-click="refreshConfig">
                <el-tab-pane label="接口信息" style="margin-top: 10px">
                    <el-form>
                        <el-form-item label="用例名称" :label-width="sceneData.formLabelWidth" prop="name">
                            <el-input v-model="caseConfig.name" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="up函数" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="caseConfig.upFunc">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="down函数" :label-width="sceneData.formLabelWidth">
                            <el-input v-model="caseConfig.downFunc">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="url参数" style="margin-top: 10px">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="small"
                               @click="addCaseParam()">添加
                    </el-button>
                    <el-switch
                            v-model="caseConfig.statusCase.param[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="caseConfig.statusCase.param[1]" :disabled='true'
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="caseConfig.param" size="mini" stripe>
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
                            v-model="caseConfig.statusCase.variable[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="caseConfig.statusCase.variable[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <div v-if="form.choiceType.toString() === 'json'">
                        <div style="margin: 0 0 15px;">
                        </div>
                        <el-input
                                type="textarea"
                                :rows="27"
                                placeholder="请输入内容"
                                v-model="caseConfig.variable">
                        </el-input>
                    </div>
                    <el-table :data="caseConfig.variable" size="mini" stripe
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
                            v-model="caseConfig.statusCase.extract[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch
                            v-model="caseConfig.statusCase.extract[1]" :disabled='true'
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="caseConfig.extract" size="mini" stripe>
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
                            v-model="caseConfig.statusCase.validate[0]"
                            inactive-text="启动功能">
                    </el-switch>
                    <el-switch

                            v-model="caseConfig.statusCase.validate[1]"
                            inactive-text="启动新参数">
                    </el-switch>
                    <el-table :data="caseConfig.validate" size="mini" stripe>
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


        <el-dialog title="用例集配置" :visible.sync="setData.viewStatus" width="30%">
            <el-form>
                <el-form-item label="用例集名称" label-width="100px">
                    <el-input v-model="setData.name">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="setData.viewStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="addSet()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'modeManage',
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    isLeaf: 'leaf'
                },
                setDataList: [],
                allSetList:'',
                tempNum: '',
                sceneList: [],
                apiSuiteViewStatus: true,
                comparators: [{'value': 'equals'}, {'value': 'less_than'}, {'value': 'less_than_or_equals'},
                    {'value': 'greater_than'}, {'value': 'greater_than_or_equals'}, {'value': 'not_equals'},
                    {'value': 'string_equals'}, {'value': 'length_equals'}, {'value': 'length_greater_than'},
                    {'value': 'count_greater_than_or_equals'}, {'value': 'length_less_than'},
                    {'value': 'length_less_than_or_equals'}],
                statusCase: {variable: [true, true], extract: [true, true], validate: [true, true],},
                caseConfig: {
                    name: '',
                    time: '',
                    upFunc: '',
                    downFunc: '',
                    statusCase: {variable: [], extract: [], validate: [], param: []},
                    variable: [{key: '', value: '', param_type: '', remark: ''}],
                    extract: [{key: '', value: ''}],
                    validate: [{key: '', value: '', comparator: ''}],
                    param: [{key: '', value: '', remark: ''}],
                },
                paramVisible: false,
                proModelData: '',
                loading: false,
                configData: '',
                proUrlData: '',
                funcAddress: '',
                temp_num: '',
                paramTypes: ['string', 'file'],
                caseData: [],
                suiteData: [],
                sceneAll: [],
                caseVessel: Array, //接口用例容器，勾选的内容都存在此变量
                caseList: [],
                scenePage: {
                    total: 1,
                    currentPage: 1,
                    sizePage: 20,
                },
                total: 1,
                currentPage: 1,
                sizePage: 20,
                choiceVariableType: [{
                    value: '选项1',
                    label: 'data'
                }, {
                    value: '选项2',
                    label: 'json'
                }],
                tempSetName:'',
                form: {
                    modelName: '',
                    projectName: '',
                    apiMesProjectName: '',
                    sceneName: '',
                    configName: '',
                    caseName: '',
                    choiceType: 'data',
                    choiceTypeStatus: false,
                    setName: '',
                },

                sceneData: {
                    id: '',
                    set_id: '',
                    num: '',
                    funcAddress: '',
                    modelFormVisible: false,
                    projectName: '',
                    variable: [],
                    desc: '',
                    times:'',
                    name: '',
                    formLabelWidth: '70px',
                    apiCases: [],
                },
                setData: {
                    one_id: '',
                    viewStatus: false,
                    id: '',
                    num: '',
                    name: '',
                },
            }
        },


        methods: {
            loadNode1(node, resolve) {
                if (node.level === 0) {
                    this.httpSend().then(res => {
                        resolve(this.setDataList);
                    });
                    // setTimeout(() => {
                    //     resolve(this.setDataList);
                    // }, 1000);
                // :data="setDataList"
                //     if(this.httpSend()){
                //         console.log(this.setDataList)
                //         return resolve(this.setDataList);
                //     }
                //     else{
                //         console.log(this.setDataList)
                //         return resolve(this.setDataList);
                //     }

                }
                if (node.level === 1){
                    this.setData.one_id = node.data.id;
                    this.tempSetName = node.data.label;
                    this.findScenes().then(res => {
                        if (res) {
                            resolve(this.sceneAll);
                        }
                    });


                }
                // console.log(node.level)


            },
            handleNodeClick(data) {
                this.setData.one_id = data['id'];
                this.tempSetName = data['label'];
                this.findScenes();
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            findCases() {
                this.apiSuiteViewStatus = true,
                    this.$axios.post('/api/api/cases/find', {
                        'projectName': this.form.apiMesProjectName,
                        'gatName': this.form.modelName,
                        'caseName': this.form.caseName,
                        'page': this.scenePage.currentPage,
                        'sizePage': this.scenePage.sizePage,
                    }).then((response) => {
                            if (response.data['status'] === 0) {
                                this.$message({
                                    showClose: true,
                                    message: response.data['msg'],
                                    type: 'warning',
                                });
                            }
                            else {
                                this.caseData = response.data['data'];
                                this.scenePage.total = response.data['total'];
                            }
                        }
                    )
            },
            findSuite() {
                this.apiSuiteViewStatus = false,
                    this.$axios.post('/api/api/suite/find', {
                        'suiteName': this.form.caseName,
                        'modelName': this.form.modelName,
                        'projectName': this.form.apiMesProjectName,
                        'page': this.scenePage.currentPage,
                        'sizePage': this.scenePage.sizePage,
                    }).then((response) => {
                            if (response.data['status'] === 0) {
                                this.$message({
                                    showClose: true,
                                    message: response.data['msg'],
                                    type: 'warning',
                                });
                            }
                            else {
                                this.suiteData = response.data['data'];
                                this.scenePage.total = response.data['total'];
                            }
                        }
                    )
            },
            findScenes() {
                return this.$axios.post('/api/api/scene/find', {
                    'setId': this.setData.one_id,
                    'projectName': this.form.projectName,
                    'sceneName': this.form.sceneName,
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
                            this.sceneAll = response.data['data'];
                            this.total = response.data['total'];
                            return true
                        }
                    }
                )
            },
            findOldScenes() {
                this.$axios.post('/api/api/scene/findOld', {
                    'projectName': this.form.projectName,
                    'sceneName': this.form.sceneName,
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
                            this.sceneAll = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            httpSend() {
                return this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.proModelData = response.data['data'];
                        this.configData = response.data['config_name_list'];
                        this.proUrlData = response.data['urlData'];
                        this.form.projectName = response.data['user_pro']['pro_name'];
                        this.form.apiMesProjectName = this.form.projectName;
                        this.form.configName = response.data['config_name_list'][this.form.projectName][0].toString();
                        this.form.modelName = response.data['user_pro']['model_list'][0].toString();
                        return this.findSet();


                    }
                );
            },
            getA(){
                this.$axios.post('/api/api/func/getAddress').then((response) => {
                        this.funcAddress = response['data']['data'];
                    }
                );
            },
            findSet() {
                return this.$axios.post('/api/api/set/find', {'projectName': this.form.projectName,}).then((response) => {
                        this.setDataList = response.data['data'][this.form.projectName];
                        this.allSetList = response.data['data'];
                        if(response.data['data'][this.form.projectName][0]){
                            this.setData.one_id = response.data['data'][this.form.projectName][0]['id'];
                            this.tempSetName = response.data['data'][this.form.projectName][0]['label'];
                            this.$nextTick(function () {
                                this.$refs.testTree.setCurrentKey(this.setData.one_id);  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
                            });
                        }
                        this.findScenes();
                    }
                );
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
                this.scenePage.currentPage = val;
                this.findCases()
            },
            handleSizeCase(val) {
                this.scenePage.sizePage = val;
                this.findCases()
            },
            addConfigVariable() {
                this.sceneData.variable.push({key: '', value: '', remark: ''});
            },
            delConfigVariable(i) {
                this.sceneData.variable.splice(i, 1);
            },
            addScene() {
                for (let i = 0; i < this.caseList.length; i++) {
                    if (!(/(^[1-9]\d*$)/.test(this.caseList[i]['time']))) {
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
                    'setId': this.sceneData.set_id,
                    'desc': this.sceneData.desc,
                    'funcAddress': this.sceneData.funcAddress,
                    'variable': JSON.stringify(this.sceneData.variable),
                    'project': this.form.projectName,
                    'ids': this.sceneData.id,
                    'cases': this.caseList,

                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.sceneData.modelFormVisible = false;
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.findScenes();
                            // this.findSet();
                        }
                    }
                )
            },
            initSceneData() {
                this.caseList = [];
                this.caseData = [];
                this.suiteData = [];
                if(this.allSetList[this.form.projectName][0]){
                    this.sceneData.set_id = this.allSetList[this.form.projectName][0].id;
                    this.form.setName = this.allSetList[this.form.projectName][0].label
                }
                else{
                    this.sceneData.set_id = '';
                    this.form.setName = '';
                }
                // this.sceneData.set_id = this.setData.one_id;
                // this.form.setName = this.tempSetName;
                this.sceneData.header = [];
                this.sceneData.variable = [];
                this.sceneData.name = '';
                this.sceneData.times = '';
                this.sceneData.desc = '';
                this.sceneData.id = '';
                this.sceneData.funcAddress = '';
                this.sceneData.num = '';
                this.sceneData.url = '';
                this.sceneData.modelFormVisible = true;
                this.caseVessel = [];
                this.caseList = [];
                // this.cancelSelection();
                // this.toggleSelection();

            },
            moreRun() {
                console.log(this.sceneList)
            },
            handleCaseSelection(val) {
                this.caseVessel = val;
            },
            addCaseData() {
                if (this.apiSuiteViewStatus) {
                    this.caseList = this.caseList.concat(this.caseVessel);
                    this.caseList = JSON.parse(JSON.stringify(this.caseList));
                    this.$refs.multipleTable.clearSelection();
                }
                else {
                    let suiteIds = Array();
                    for (let i = 0; i < this.caseVessel.length; i++) {
                        suiteIds.push(this.caseVessel[i].id);
                    }
                    this.$axios.post('/api/api/suite/findApi', {
                        'suiteIds': suiteIds
                    }).then((response) => {
                            this.caseList = this.caseList.concat(response.data['data']);
                            this.caseList = JSON.parse(JSON.stringify(this.caseList));
                            this.$refs.multipleTable.clearSelection();
                        }
                    )

                }
            },
            addConfigData() {
                this.$axios.post('/api/api/config/data', {
                    'name': this.form.configName
                }).then((response) => {
                        this.sceneData.variable = this.sceneData.variable.concat(response.data['data']['variables']);
                        this.sceneData.variable = JSON.parse(JSON.stringify(this.sceneData.variable));
                        this.sceneData.funcAddress = response.data['data']['func_address'];
                    }
                )
            },
            delApiCase(i) {
                //判断caseList中是否存在id，存在则在数据库删除信息，否则在前端删除临时数据
                if ('id' in this.caseList[i]) {
                    this.$axios.post('/api/api/apiCase/del', {'id': this.caseList[i]['id']}).then((response) => {
                            this.caseList.splice(i, 1);
                        }
                    )
                }
                else {
                    this.caseList.splice(i, 1);
                }
            },
            caseConfigBtn(i) {
                this.caseConfig.param = this.caseList[i]['param'];
                this.caseConfig.variable = this.caseList[i]['variables'];
                this.caseConfig.extract = this.caseList[i]['extract'];
                this.caseConfig.validate = this.caseList[i]['validate'];
                this.caseConfig.statusCase = this.caseList[i]['statusCase'];
                this.form.choiceType = this.caseList[i]['variableType'];
                this.caseConfig.name = this.caseList[i]['case_name'];
                this.caseConfig.time = this.caseList[i]['time'];
                this.caseConfig.upFunc = this.caseList[i]['up_func'];
                this.caseConfig.downFunc = this.caseList[i]['down_func'];
                this.tempNum = i;
                this.paramVisible = true;
                if (this.form.choiceType.toString() === 'json') {
                    this.form.choiceTypeStatus = true
                }
                else {
                    this.form.choiceTypeStatus = false
                }

            },
            sureConfigBtn() {
                if (this.form.choiceType.toString() === 'json') {
                    try {
                        JSON.parse(this.caseConfig.variable)
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
                if (this.caseConfig.downFunc) {
                    this.caseList[this.tempNum]['down_func'] = this.caseConfig.downFunc;
                }
                else {
                    this.caseList[this.tempNum]['down_func'] = '';
                }
                if (this.caseConfig.upFunc) {
                    this.caseList[this.tempNum]['up_func'] = this.caseConfig.upFunc;

                }
                else {
                    this.caseList[this.tempNum]['up_func'] = '';
                }
                if (this.caseConfig.name) {
                    this.caseList[this.tempNum]['case_name'] = this.caseConfig.name;
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '请输入用例名称',
                        type: 'warning',
                    });
                    return
                }
                this.caseList[this.tempNum]['variables'] = this.caseConfig.variable;
                this.paramVisible = false;

            },
            upNum(i) {
                let d = this.caseList[i];
                this.caseList.splice(i, 1);
                this.caseList.splice(i - 1, 0, d);
            },
            downNum(i) {
                let d = this.caseList[i];
                this.caseList.splice(i, 1);
                this.caseList.splice(i + 1, 0, d);
            },
            // refresh(targetName) {
            //
            //     if (targetName.label === '业务集合') {
            //         // this.caseList.push({key: '', value: ''});
            //         // this.caseList.pop()
            //     }
            //     else if (targetName.label === '接口用例') {
            //         this.cancelSelection()
            //     }
            // },
            refreshConfig(targetName) {

                if (targetName.label === 'variables') {
                }
            },
            cancelSelection() {
                this.$refs.multipleTable.clearSelection();
            },
            addCaseVariable() {
                this.caseConfig.variable.push({key: '', value: '', param_type: 'string', remark: ''});
            },
            delCaseVariable(i) {
                this.caseConfig.variable.splice(i, 1);
            },
            addCaseExtract() {
                this.caseConfig.extract.push({key: '', value: '', remark: ''});
            },
            delCaseExtract(i) {
                this.caseConfig.extract.splice(i, 1);
            },
            addCaseParam() {
                this.caseConfig.param.push({key: '', value: '', remark: ''});
            },
            delCaseParam(i) {
                this.caseConfig.param.splice(i, 1);
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
            editScene(sceneId, copyEditStatus = false) {
                this.$axios.post('/api/api/scene/edit', {
                    'sceneId': sceneId,
                    'copyEditStatus': copyEditStatus
                }).then((response) => {

                        this.sceneData.name = response.data['data']['name'];
                        this.sceneData.desc = response.data['data']['desc'];
                        this.sceneData.times = response.data['data']['times'];
                        this.sceneData.funcAddress = response.data['data']['func_address'];
                        this.caseList = response.data['data']['cases'];
                        this.sceneData.variable = response.data['data']['variables'];
                        this.sceneData.set_id = response.data['data']['setId'];
                        // if(!this.sceneData.set_id && this.allSetList[this.form.projectName][0]){
                        //     this.sceneData.set_id = this.allSetList[this.form.projectName][0].id;
                        //     this.form.setName = this.allSetList[this.form.projectName][0].label
                        // }
                        // else{
                        //     this.sceneData.set_id = '';
                        //     this.form.setName = '';
                        // }
                        this.form.setName = this.tempSetName;
                        this.caseData = [];
                        this.suiteData = [];
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
            runScene(name, status = false) {
                let names = [];
                if (status) {
                    for (let i = 0; i < name.length; i++) {
                        names.push(name[i].name);
                    }
                }
                else {
                    names.push(name)
                }
                this.loading = true;
                this.$axios.post('/api/api/report/run', {
                    'sceneNames': names,
                    'projectName': this.form.projectName
                }).then((response) => {
                        this.loading = false;
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                            this.$alert('<pre style="color: #d04a4a;width: 600px;">' + response.data['error'] + '</pre>', '错误信息', {
                                dangerouslyUseHTMLString: true
                            });

                        }
                        else {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                        }
                        // this.$router.push({path: 'reportShow', query: {reportId: response.data['data']['report_id']}});
                        let {href} = this.$router.resolve({
                            path: 'reportShow',
                            query: {reportId: response.data['data']['report_id']}
                        });
                        window.open(href, '_blank');
                    }
                );
            },
            fileChange(response, file, fileList) {
                this.caseConfig.variable[this.temp_num]['value'] = response['data'];
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
            tempNumTwo(i) {
                this.temp_num = i;
            },
            clearGathers() {
                this.form.gathers = '';
                this.form.configName = '';
            },
            apiFindChoice() {
                this.form.modelName = this.proModelData[this.form.apiMesProjectName][0];
            },
            handleSceneSelection(val) {
                this.sceneList = val;
            },
            cancelSelection() {
                this.$refs.sceneMultipleTable.clearSelection();
            },
            initSet() {
                this.setData.viewStatus = true;
                this.setData.name = '';
                this.setData.id = '';
            },
            editSet() {
                this.$axios.post('/api/api/set/edit', {
                    'id': this.setData.one_id,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.setData.name = response.data['data']['name'];
                            this.setData.id = this.setData.one_id;
                            this.setData.viewStatus = true;
                            // this.findModel();
                        }
                    }
                )
            },
            stickSet() {
                this.$axios.post('/api/api/set/stick', {
                    'id': this.setData.one_id,
                    'projectName': this.form.projectName
                }).then((response) => {
                        this.messageShow(this, response);
                        this.findSet();
                    }
                )
            },
            delSet() {
                this.$axios.post('/api/api/set/del', {
                    'id': this.setData.one_id,
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
                            this.findSet();
                            // this.findModel();
                        }
                    }
                )
            },
            addSet() {
                this.$axios.post('/api/api/set/add', {
                    'projectName': this.form.projectName,
                    'name': this.setData.name,
                    'id': this.setData.id,
                    'num': this.setData.num,
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
                            this.findSet();
                            this.setData.viewStatus = false;
                            // this.findModel();
                        }
                    }
                )
            },
            resetSetChoice() {
                if(this.allSetList[this.form.projectName][0]){
                    this.form.set = this.allSetList[this.form.projectName][0];
                }
                else{
                    this.form.set = null

                }



                // let obj = {};
                // obj = this.options.find((item)=>{
                //     return item.value === value;
                // });
                // console.log(obj.label);
            },
            getSetId(label) {
                this.sceneData.set_id = label;
                // let obj = {};
                // obj = this.options.find((item)=>{
                //     return item.value === value;
                // });
                // console.log(obj.label);
            },

        },
        mounted() {
            this.getA()

        },
    }
</script>

<style>

</style>
