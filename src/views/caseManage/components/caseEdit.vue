<template>
  <div class="sceneEdit">

    <!--        <el-dialog title="用例"-->
    <!--                   :visible.sync="caseData.modelFormVisible"-->
    <!--                   :close-on-click-modal="false"-->
    <!--                   :width="mainWidth"-->
    <!--                   top="5vh">-->

    <el-tabs value="first" @tab-click="changeShow" type="border-card">

      <el-tab-pane label="用例信息" name="first" style="margin-top: 10px">
        <el-form size="small" :inline="true">
          <el-form-item label="用例名称" :label-width="caseData.formLabelWidth">
            <el-input v-model="caseData.name" style="width: 150px">
            </el-input>
          </el-form-item>
          <el-form-item label="项目选择" :label-width="caseData.formLabelWidth">
            <el-select v-model="caseData.projectId" placeholder="请选择项目" @change="changeSetChoice"
                       style="width: 150px">
              <el-option
                  v-for="(item) in proAndIdData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用例编号" :label-width="caseData.formLabelWidth" v-if="caseData.id">
            <el-input v-model.number="caseData.num" :minlength="215" style="width: 130px">
            </el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" size="small">
          <el-form-item label="用例描述" :label-width="caseData.formLabelWidth">
            <el-input v-model="caseData.desc" style="width: 150px">
            </el-input>
          </el-form-item>

          <el-form-item label="集合选择" :label-width="caseData.formLabelWidth">
            <el-cascader
                placeholder="请选择用例集"
                size="small"
                v-model="caseData.setId"
                :options="currentSetList"
                :props="{
                label:'name',
                value:'id',
                checkStrictly: true,
                expandTrigger: 'hover',
                emitPath:false
              }"
            ></el-cascader>
            <!--            <el-select v-model="caseData.setId" placeholder="请选择用例集" value-key="id"-->
            <!--                       style="width: 150px">-->
            <!--              <el-option-->
            <!--                  v-for="item in currentSetList"-->
            <!--                  :key="item.id"-->
            <!--                  :label="item.name"-->
            <!--                  :value="item.id">-->
            <!--              </el-option>-->
            <!--            </el-select>-->
          </el-form-item>
          <el-form-item label="执行次数" label-width="70px">
            <el-input-number v-model="caseData.times" :min="1" :max="1000">
            </el-input-number>
          </el-form-item>
        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
        <el-form :inline="true" class="demo-form-inline " size="small">
          <el-form-item label=" " labelWidth="10px">
            <el-select v-model="caseData.environment" clearable value-key="configId" placeholder="默认项目环境"
                       style="width: 150px;padding-right:5px">
              <el-option
                  v-for="item in environmentList"
                  :key="item"

                  :value="item">
              </el-option>
            </el-select>
            <el-cascader
                v-model="caseData.funcAddress"
                :options="this.$store.state.funcAddress"
                :props="{ expandTrigger: 'hover', label: 'name' , value: 'name' ,multiple: true }"
                multiple placeholder="请选择导入函数文件" size="small">
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click.native="$refs.loadConfigViewFunc.configShow=true">加载配置
            </el-button>
            <el-button type="primary" size="small"
                       @click="addConfigVariable()">添加变量
            </el-button>
          </el-form-item>
        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
        <el-table :data="caseData.variable"
                  style="width:100%"
                  :show-header="false"
                  size="mini"

                  stripe>
          <el-table-column property="key" label="Key" header-align="center" minWidth="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.key" size="small" placeholder="key">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column property="value" label="Value" header-align="center" minWidth="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" size="small" placeholder="Value">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" header-align="center" minWidth="70">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="small" placeholder="备注">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column property="value" label="操作" header-align="center" width="140">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="info" icon="my-icon-jiantou-xiangshang"
                           @click.native="upNum(scope.$index)" size="mini">{{ null }}
                </el-button>
                <el-button type="info" icon="my-icon-jiantou-xiangxia"
                           @click.native="downNum(scope.$index)" size="mini">{{ null }}
                </el-button>
                <el-button type="danger" size="mini"
                           @click.native="delConfigVariable(scope.$index)"> 删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 10px;float: right;">

          <el-button type="success" @click.native="addCase(false)" size="small">保 存</el-button>
        </div>

      </el-tab-pane>

      <el-tab-pane label="执行步骤" name="second" style="font-size: 14px">
        <el-row :gutter="24">
          <el-col :span="stepSpan">
            <el-row :gutter="24"
                    style="margin-top:10px;color: rgb(171, 139, 149);font-weight: 500;font-size: 14px;
                                           width: 100%;border-style:solid;border-width: 1px;
                                           border-color: #ffffff #ffffff rgb(234, 234, 234) #ffffff;">
              <el-col :span="3" style="padding-left: 20px">
                状态
              </el-col>
              <el-col :span="5">
                步骤名称
              </el-col>
              <el-col :span="4">
                接口名称
              </el-col>
              <el-col :span="4">
                次数
              </el-col>
              <el-col :span="6" style="padding-left: 50px;">
                操作
              </el-col>
              <!--              <el-col :span="1">-->
              <!--                <div @click.prevent="showApiData" style="color: #55a9ff">-->
              <!--                  <el-tooltip content="接口" placement="top">-->
              <!--                        <i class="my-icon-xiangzuo-copy" v-show="!showApiDataStatus"></i>-->
              <!--                          </el-tooltip>-->

              <!--                  <i class="my-icon-xiangyou" v-show="showApiDataStatus"></i>-->
              <!--                </div>-->
              <!--              </el-col>-->
            </el-row>
            <draggable v-model="caseData.apiCases" :options="{group:'apiData',animation:300}"
                       style="width: 99%;min-height: 10px;">
              <div v-for="(_data, index) in caseData.apiCases"
                   :key="index"
                   class="list-complete-item">
                <el-row :gutter="21">
                  <el-col :span="2" style="padding-top: 3px">
                    <el-switch v-model="caseData.apiCases[index]['status']">
                    </el-switch>
                  </el-col>
                  <el-col :span="5"
                          style="padding-top: 3px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:center">
                    {{ _data.name }}
                  </el-col>
                  <el-col :span="4"
                          style="padding-top: 3px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align:center">
                    {{ _data.api_name }}
                  </el-col>
                  <el-col :span="4">
                    <el-input-number size="mini" :precision="0"
                                     v-model="caseData.apiCases[index]['time']"
                                     :min="1" :max="1000">
                    </el-input-number>
                  </el-col>
                  <el-col :span="1">
                  </el-col>
                  <el-col :span="8" style="padding-left: 50px;padding-top: 3px">
                    <el-button-group>


                      <el-button type="danger" size="mini"
                                 @click.native="delApiCase(index)">删除
                      </el-button>
                      <el-button type="primary" size="mini"
                                 @click.native="apiMessageEditFuncInit(index)">配置
                      </el-button>
                      <el-button type="info" size="mini"
                                 @click.native="copyStep(index)">复制
                      </el-button>
                      <el-button type="warning" size="mini"
                                 @click.native="debugStep(index)">调试
                      </el-button>
                    </el-button-group>
                  </el-col>
                </el-row>
              </div>
            </draggable>
          </el-col>
<!--          <el-col :span="12" v-show="!showApiDataStatus">-->
<!--            <el-tabs v-model="tabName">-->
<!--              <el-tab-pane label="添加步骤" name="first">-->
<!--                <el-form :inline="true" style="padding-top: 10px;" size="small">-->
<!--                  <el-form-item label=" " labelWidth="10px">-->
<!--                    <el-select v-model="form.projectId"-->
<!--                               style="width: 150px;padding-right:5px"-->
<!--                               placeholder="请选择项目"-->
<!--                               @change="changeApiSetChoice()">-->
<!--                      <el-option-->
<!--                          v-for="(item) in proAndIdData"-->
<!--                          :key="item.id"-->
<!--                          :label="item.name"-->
<!--                          :value="item.id">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                    <el-cascader-->
<!--                        placeholder="请选择模块"-->
<!--                        size="small"-->
<!--                        v-model="form.apiSetId"-->
<!--                        :options="currentApiSetList"-->
<!--                        :props="{-->
<!--                                label:'name',-->
<!--                                value:'id',-->
<!--                                checkStrictly: true,-->
<!--                                expandTrigger: 'hover',-->
<!--                                emitPath:false-->
<!--                              }"-->
<!--                    ></el-cascader>-->
<!--                    &lt;!&ndash;                    <el-select v-model="form.apiSetId"&ndash;&gt;-->
<!--                    &lt;!&ndash;                               style="width: 150px;padding-right:5px"&ndash;&gt;-->
<!--                    &lt;!&ndash;                               placeholder="请选择模块">&ndash;&gt;-->
<!--                    &lt;!&ndash;                      <el-option&ndash;&gt;-->
<!--                    &lt;!&ndash;                          v-for="item in currentApiSetList"&ndash;&gt;-->
<!--                    &lt;!&ndash;                          :key="item.id"&ndash;&gt;-->
<!--                    &lt;!&ndash;                          :label="item.name"&ndash;&gt;-->
<!--                    &lt;!&ndash;                          :value="item.id">&ndash;&gt;-->
<!--                    &lt;!&ndash;                      </el-option>&ndash;&gt;-->
<!--                    &lt;!&ndash;                    </el-select>&ndash;&gt;-->
<!--                  </el-form-item>-->
<!--                  <el-form-item label="">-->
<!--                    <el-input placeholder="请输入用例" v-model="form.apiName" style="width: 150px">-->
<!--                    </el-input>-->
<!--                  </el-form-item>-->
<!--                  <el-form-item>-->
<!--                    <el-button type="primary" @click.native="handleCurrentCase(1)" size="mini">-->
<!--                      搜索接口-->
<!--                    </el-button>-->
<!--                    <el-button type="primary" size="mini" @click.native="addApiData()">添加-->
<!--                    </el-button>-->

<!--                  </el-form-item>-->
<!--                </el-form>-->
<!--                <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>-->
<!--                <el-row :gutter="18"-->
<!--                        style="margin-top:10px;color: rgb(171, 139, 149);font-weight: 500;font-size: 14px;-->
<!--                                            padding-left: 5px;padding-top: 3px;">-->
<!--                  <el-col :span="1">-->
<!--                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"-->
<!--                                 @change="handleCheckAllChange"></el-checkbox>-->
<!--                  </el-col>-->

<!--                  <el-col :span="2">-->
<!--                    编号-->
<!--                  </el-col>-->
<!--                  <el-col :span="4">-->
<!--                    接口名称-->
<!--                  </el-col>-->
<!--                  &lt;!&ndash;                  <el-col :span="4">&ndash;&gt;-->
<!--                  &lt;!&ndash;                    接口描述&ndash;&gt;-->
<!--                  &lt;!&ndash;                  </el-col>&ndash;&gt;-->
<!--                  <el-col :span="14">-->
<!--                    接口地址-->
<!--                  </el-col>-->
<!--                  <el-col :span="2">-->
<!--                    操作-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--                <draggable v-model="ApiMsgData"-->
<!--                           :options="this.draggableOptions"-->
<!--                >-->
<!--                  <transition-group name="list-complete">-->
<!--                    <div v-for="(_data, index) in ApiMsgData"-->
<!--                         :key="_data.num"-->
<!--                         class="list-complete-item">-->
<!--                      <el-row :gutter="24">-->
<!--                        <el-col :span="1">-->

<!--                          <el-checkbox v-model="_data.check" @change="addEvent(index)"-->
<!--                          > {{ null }}-->
<!--                          </el-checkbox>-->
<!--                        </el-col>-->
<!--                        <el-col :span="2">-->
<!--                          {{ _data.num }}-->
<!--                        </el-col>-->
<!--                        <el-tooltip :content="_data.name" placement="top">-->
<!--                          <el-col :span="4"-->
<!--                                  style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">-->
<!--                            {{ _data.name }}-->
<!--                          </el-col>-->
<!--                        </el-tooltip>-->
<!--                        &lt;!&ndash;                        <el-col :span="4"&ndash;&gt;-->
<!--                        &lt;!&ndash;                                style="padding-top: 1px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"&ndash;&gt;-->
<!--                        &lt;!&ndash;                        >&ndash;&gt;-->
<!--                        &lt;!&ndash;                          {{ _data.desc }}&ndash;&gt;-->
<!--                        &lt;!&ndash;                        </el-col>&ndash;&gt;-->
<!--                        <el-tooltip :content="_data.url" placement="top">-->
<!--                          <el-col :span="13"-->
<!--                                  style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">-->
<!--                            {{ _data.url }}-->
<!--                          </el-col>-->
<!--                        </el-tooltip>-->
<!--                        <el-col :span="3">-->
<!--                          &lt;!&ndash;                          <template slot-scope="scope">&ndash;&gt;-->
<!--                          &lt;!&ndash;                          <el-tooltip content="添加初始步骤" placement="top">&ndash;&gt;-->
<!--                          <el-button size="mini" type="primary"-->
<!--                                     @click.native="getTempSteps(_data.apiMsgId)">-->
<!--                            批量生成-->
<!--                          </el-button>-->
<!--                          &lt;!&ndash;                          </el-tooltip>&ndash;&gt;-->

<!--                          &lt;!&ndash;                </template>&ndash;&gt;-->
<!--                        </el-col>-->
<!--                      </el-row>-->

<!--                    </div>-->
<!--                  </transition-group>-->
<!--                </draggable>-->
<!--                <div class="block" style="float:right; position: relative;">-->
<!--                  <el-pagination-->
<!--                      @current-change="handleCurrentCase"-->
<!--                      @size-change="handleSizeCase"-->
<!--                      :current-page="apiMsgPage.currentPage"-->
<!--                      :page-size="apiMsgPage.sizePage"-->
<!--                      :page-sizes="[15, 30, 45, 60]"-->
<!--                      layout="total, sizes, prev, pager, next, jumper"-->
<!--                      :total="apiMsgPage.total">-->
<!--                  </el-pagination>-->
<!--                </div>-->
<!--              </el-tab-pane>-->

<!--            </el-tabs>-->

<!--          </el-col>-->
        </el-row>
        <div style="margin-top: 10px;float: right;">
          <el-button type="primary" @click="drawer = true" size="small">添加步骤</el-button>
          <el-button type="success" @click.native="addCase()" size="small">保 存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-drawer
        title="添加步骤"
        size="55%"
        :visible.sync="drawer"
        :with-header="false">
      <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
          <el-form :inline="true" style="padding-top: 10px;" size="small">
            <el-form-item label=" " labelWidth="10px">
              <el-select v-model="form.projectId"
                         style="width: 150px;padding-right:5px"
                         placeholder="请选择项目"
                         @change="changeApiSetChoice()">
                <el-option
                    v-for="(item) in proAndIdData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
              <el-cascader
                  placeholder="请选择模块"
                  size="small"
                  v-model="form.apiSetId"
                  :options="currentApiSetList"
                  :props="{
                                label:'name',
                                value:'id',
                                checkStrictly: true,
                                expandTrigger: 'hover',
                                emitPath:false
                              }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="">
              <el-input placeholder="请输入名称" v-model="form.apiName" clearable style="width: 120px">
              </el-input>

            </el-form-item>
             <el-form-item label="">

              <el-input placeholder="请输入地址" v-model="form.apiAddress" clearable style="width: 120px">
        </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.native="handleCurrentCase(1)" size="mini">
                搜索接口
              </el-button>
              <el-button type="primary" size="mini" @click.native="addApiData()">添加
              </el-button>

            </el-form-item>
          </el-form>
          <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
<!--          <el-row :gutter="17"-->
<!--                  style="margin-top:10px;color: rgb(171, 139, 149);font-weight: 500;font-size: 14px;-->
<!--                                            padding-left: 5px;padding-top: 3px;">-->
            <el-table

                ref="apiMultipleTable"
                @selection-change="handleApiMsgSelection"
                :data="ApiMsgData"
                stripe
                :max-height="this.$store.state.tableHeight+100">
              <el-table-column
                  type="selection"
                  width="45">
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
                  width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary"
                               @click.native="getTempSteps(ApiMsgData[scope.$index].apiMsgId)"
                                v-if="ApiMsgData[scope.$index].method === 'POST'">
                      批量生成
                    </el-button>
                </template>
              </el-table-column>
            </el-table>
<!--            <el-col :span="1">-->
<!--              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"-->
<!--                           @change="handleCheckAllChange"></el-checkbox>-->
<!--            </el-col>-->

<!--            <el-col :span="2">-->
<!--              编号-->
<!--            </el-col>-->
<!--            <el-col :span="4">-->
<!--              接口名称-->
<!--            </el-col>-->
<!--            &lt;!&ndash;                  <el-col :span="4">&ndash;&gt;-->
<!--            &lt;!&ndash;                    接口描述&ndash;&gt;-->
<!--            &lt;!&ndash;                  </el-col>&ndash;&gt;-->
<!--            <el-col :span="14">-->
<!--              接口地址-->
<!--            </el-col>-->
<!--            <el-col :span="2">-->
<!--              操作-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <draggable v-model="ApiMsgData"-->
<!--                     :options="this.draggableOptions"-->
<!--          >-->
<!--            <transition-group name="list-complete">-->
<!--              <div v-for="(_data, index) in ApiMsgData"-->
<!--                   :key="_data.num"-->
<!--                   class="list-complete-item">-->
<!--                <el-row :gutter="24">-->
<!--                  <el-col :span="1">-->

<!--                    <el-checkbox v-model="_data.check" @change="addEvent(index)"-->
<!--                    > {{ null }}-->
<!--                    </el-checkbox>-->
<!--                  </el-col>-->
<!--                  <el-col :span="2">-->
<!--                    {{ _data.num }}-->
<!--                  </el-col>-->
<!--                  <el-tooltip :content="_data.name" placement="top">-->
<!--                    <el-col :span="4"-->
<!--                            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">-->
<!--                      {{ _data.name }}-->
<!--                    </el-col>-->
<!--                  </el-tooltip>-->
<!--                  &lt;!&ndash;                        <el-col :span="4"&ndash;&gt;-->
<!--                  &lt;!&ndash;                                style="padding-top: 1px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"&ndash;&gt;-->
<!--                  &lt;!&ndash;                        >&ndash;&gt;-->
<!--                  &lt;!&ndash;                          {{ _data.desc }}&ndash;&gt;-->
<!--                  &lt;!&ndash;                        </el-col>&ndash;&gt;-->
<!--                  <el-tooltip :content="_data.url" placement="top">-->
<!--                    <el-col :span="13"-->
<!--                            style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">-->
<!--                      {{ _data.url }}-->
<!--                    </el-col>-->
<!--                  </el-tooltip>-->
<!--                  <el-col :span="3">-->
<!--                    &lt;!&ndash;                          <template slot-scope="scope">&ndash;&gt;-->
<!--                    &lt;!&ndash;                          <el-tooltip content="添加初始步骤" placement="top">&ndash;&gt;-->
<!--                    <el-button size="mini" type="primary"-->
<!--                               @click.native="getTempSteps(_data.apiMsgId)">-->
<!--                      批量生成-->
<!--                    </el-button>-->
<!--                    &lt;!&ndash;                          </el-tooltip>&ndash;&gt;-->

<!--                    &lt;!&ndash;                </template>&ndash;&gt;-->
<!--                  </el-col>-->
<!--                </el-row>-->

<!--              </div>-->
<!--            </transition-group>-->
<!--          </draggable>-->
          <div class="block" style="float:right; position: relative;padding-right: 10px">
            <el-pagination
                @current-change="handleCurrentCase"
                @size-change="handleSizeCase"
                :current-page="apiMsgPage.currentPage"
                :page-size="apiMsgPage.sizePage"
                :page-sizes="[15, 30, 45, 60]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="apiMsgPage.total">
            </el-pagination>
          </div>


    </el-drawer>
    <apiMsgDataEdit
        :apiCases="caseData.apiCases"
        ref="apiMessageEditFunc">

    </apiMsgDataEdit>
    <loadConfigView
        :proAndIdData="proAndIdData"
        ref="loadConfigViewFunc">
    </loadConfigView>

  </div>
</template>

<script>
import apiMsgDataEdit from './apiMsgDataEdit.vue'
import loadConfigView from './loadConfigView.vue'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
    apiMsgDataEdit,
    loadConfigView,
  },
  name: 'caseEdit',
  props: ['projectId', 'proAndIdData', 'caseSetId'],
  data() {
    return {
      drawer: false,
      apiMsgList:[],
      checkAll: false,
      isIndeterminate: false,
      currentSetList: [],
      currentApiSetList: [],
      apiMsgVessel: [], //接口用例容器，勾选的内容都存在此变量
      ApiMsgData: [], // 接口信息里面的表格数据
      mainWidth: '50%',
      radio: false,
      tabName: 'first',
      showApiDataStatus: true,
      stepSpan: 24,
      draggableOptions: {
        group: {name: 'apiData', pull: 'clone', put: false},
        sort: false,
      },
      apiMsgPage: {
        total: 1,
        currentPage: 1,
        sizePage: 15,
      },
      form: {
        apiSetId: '',
        projectId: '',
        apiMesProjectId: '',
        configProjectId: '',
        configId: '',
        apiName: '',
        apiAddress:''
      },
      caseData: {
        id: '',
        num: '',
        funcAddress: Array(),
        modelFormVisible: false,
        projectId: '',
        setId: '',
        variable: [],
        desc: '',
        times: '',
        name: '',
        environment: '',
        formLabelWidth: '70px',
        apiCases: [],// 执行步骤里面的所有接口信息
      },
      environmentList: ['测试环境', '开发环境', '线上环境', '备用环境'],
    }
  },
  methods: {
     handleApiMsgSelection(val) {
      this.apiMsgVessel = val;
    },
    getTempSteps(apiId) {
      this.$axios.post('/api/apiMsg/getTempSteps', {
        'apiId': apiId,
      }).then((response) => {
            console.log(response.data)
          }
      )
    },

    handleCheckAllChange(val) {
      if (val) {

        for (let i = 0; i < this.ApiMsgData.length; i++) {
          if (this.ApiMsgData[i].check) {
            //
          } else {
            this.ApiMsgData[i].check = true;
            this.apiMsgVessel.push(this.ApiMsgData[i]);
          }
        }

      } else {
        for (let i = 0; i < this.ApiMsgData.length; i++) {

          this.ApiMsgData[i].check = false;

        }
        this.apiMsgVessel = []
      }
      // this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
    },
    async debugStep(index) {
      await this.addCase()
      await this.$emit('runStep', this.caseData.apiCases[index].id)

    },
    apiMessageEditFuncInit(index) {
      // this.showApiDataStatus = false;
      // this.tabName = 'second';
      this.$refs.apiMessageEditFunc.initData(this.caseData.apiCases[index]);
      // this.mainWidth = '80%';
      // this.stepSpan = 12;
    },
    copyStep(index) {
      let temp = JSON.parse(JSON.stringify(this.caseData.apiCases[index]));
      delete temp.id
      this.caseData.apiCases.push(temp)
      // this.apiMsgVessel.push(temp);
      console.log(this.caseData.apiCases)
    },
    addEvent(dex) {
      // console.log()
      if (this.ApiMsgData[dex].check) {
        this.apiMsgVessel.push(this.ApiMsgData[dex]);
        this.apiMsgVessel = JSON.parse(JSON.stringify(this.apiMsgVessel));
      } else {
        this.ApiMsgData[dex].check = false;
        let index = this.apiMsgVessel.map(item => item.apiMsgId).indexOf(this.ApiMsgData[dex]['apiMsgId']);
        // console.log(index)
        this.apiMsgVessel.splice(index, 1);
        // this.apiMsgVessel.push(this.ApiMsgData[dex]);
      }

      if (this.apiMsgVessel.length > 0) {
        this.isIndeterminate = true
      } else {
        this.isIndeterminate = false
      }
      // this.apiMsgVessel = this.ApiMsgData[dex];
    },
    showApiData: function () {
      this.showApiDataStatus = !this.showApiDataStatus;
      if (this.showApiDataStatus) {
        this.mainWidth = '50%';
        this.stepSpan = 24;


      } else {
        this.mainWidth = '80%';
        this.stepSpan = 12;
        this.tabName = "first";
        this.findApiMsg();
      }
    },
    changeShow(tab) {
      if (tab.label === '用例信息') {
        this.mainWidth = '50%'
      } else if (this.showApiDataStatus) {
        this.mainWidth = '50%'
      } else {
        this.mainWidth = '80%'
      }
    },
    getNewCaseSetList() {
      //  返回编辑页面的时候，刷新一下用例集合数据
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.currentSetList = this.proAndIdData[index]['case_set_data'];
    },

    initCaseData() {
      this.form.projectId = this.projectId;
      for (let i = 0; i < this.proAndIdData.length; i++) {
        if (this.proAndIdData[i]['id'] === this.projectId) {
          this.currentApiSetList = this.proAndIdData[i]['api_set_data']
          this.currentSetList = this.proAndIdData[i]['case_set_data']
        }
      }
      this.form.apiSetId = this.currentApiSetList[0].id;
      this.caseData.apiCases = [];
      this.caseData.variable = [{key: '', value: '', remark: ''}];
      this.caseData.name = '';
      this.caseData.times = '';
      this.caseData.desc = '';
      this.caseData.id = '';
      this.caseData.environment = '';
      this.caseData.funcAddress = Array();
      this.caseData.num = '';
      this.caseData.setId = this.caseSetId;
      this.caseData.modelFormVisible = true;
      this.caseData.projectId = this.projectId;
      this.apiMsgVessel = [];
      this.findApiMsg();
    },
    editCase(caseId, copyEditStatus = false) {
      this.$axios.post(this.$api.editCaseApi, {
        'caseId': caseId,
        'copyEditStatus': copyEditStatus
      }).then((response) => {
            this.form.projectId = this.projectId;
            for (let i = 0; i < this.proAndIdData.length; i++) {
              if (this.proAndIdData[i]['id'] === this.form.projectId) {

                this.currentApiSetList = this.proAndIdData[i]['api_set_data']
                this.currentSetList = this.proAndIdData[i]['case_set_data']

              }
            }
            this.form.apiSetId = this.currentApiSetList[0].id;
            this.caseData.projectId = this.projectId;
            this.caseData.setId = this.caseSetId;

            this.caseData.name = response.data['data']['name'];
            this.caseData.desc = response.data['data']['desc'];
            this.caseData.times = response.data['data']['times'];
            this.caseData.funcAddress = response.data['data']['func_address'];
            this.caseData.apiCases = response.data['data']['cases'];
            this.caseData.variable = response.data['data']['variable'];
            if (copyEditStatus) {
              this.caseData.id = '';
              this.caseData.num = '';
            } else {
              this.caseData.id = caseId;
              this.caseData.num = response.data['data']['num'];
            }
            this.caseData.modelFormVisible = true;
            this.caseData.environment = this.environmentList[response.data['data']['environment']];
          }
      )

    },
    changeSetChoice() {
      // console.log(`1123`)
      for (let i = 0; i < this.proAndIdData.length; i++) {
        if (this.proAndIdData[i]['id'] === this.caseData.projectId) {
          this.currentSetList = this.proAndIdData[i]['case_set_data']
          if (this.currentSetList.length === 0) {
            this.caseData.setId = null
          } else {
            this.caseData.setId = this.currentSetList[0].id;
          }
        }
      }

    },
    changeApiSetChoice() {
      for (let i = 0; i < this.proAndIdData.length; i++) {
        if (this.proAndIdData[i]['id'] === this.form.projectId) {
          this.currentApiSetList = this.proAndIdData[i]['api_set_data']
          if (this.currentApiSetList.length === 0) {
            this.form.apiSetId = null;
            this.ApiMsgData = [];
            this.apiMsgPage.total = 0;
          } else {
            this.apiMsgPage.currentPage = 1;
            this.apiMsgPage.sizePage = 15;
            this.form.apiSetId = this.currentApiSetList[0].id;
            this.findApiMsg();
          }
        }
      }
    },
    upNum(i) {
      //  上移用例公用参数位置
      if (i === 0) {
        this.$message({
          showClose: true,
          message: '当前序号已最高',
          type: 'warning',
        });
        return
      }
      let d = this.caseData.variable[i];
      this.caseData.variable.splice(i, 1);
      this.caseData.variable.splice(i - 1, 0, d);
    },
    downNum(i) {
      //  下移用例公用参数位置
      if (i === (this.caseData.variable.length - 1)) {
        this.$message({
          showClose: true,
          message: '当前序号已最低',
          type: 'warning',
        });
        return
      }
      let d = this.caseData.variable[i];
      this.caseData.variable.splice(i, 1);
      this.caseData.variable.splice(i + 1, 0, d);
    },
    delApiCase(i) {
      //判断caseList中是否存在id，存在则在数据库删除信息，否则在前端删除临时数据
      if ('id' in this.caseData.apiCases[i]) {
        this.$confirm('是否删除用例中已保存的步骤：' + '<strong style="color: red;">' + this.caseData.apiCases[i]['name'] + '</strong>' + '?', '提示', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/apiCase/del', {'id': this.caseData.apiCases[i]['id']}).then(() => {
                this.caseData.apiCases.splice(i, 1);
              }
          );
        }).catch(() => {
        });
      } else {
        this.caseData.apiCases.splice(i, 1);
      }
    },

    handleCurrentCase(val) {
      this.apiMsgPage.currentPage = val;
      this.findApiMsg()
    },
    handleSizeCase(val) {
      this.apiMsgPage.sizePage = val;
      this.findApiMsg()
    },

    findApiMsg() {
      this.radio = false;
      this.$axios.post(this.$api.findApiApi, {
        'projectId': this.form.projectId,
        'apiSetId': this.form.apiSetId,
        'apiName': this.form.apiName,
        'apiAddress': this.form.apiAddress,
        'page': this.apiMsgPage.currentPage,
        'sizePage': this.apiMsgPage.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.radio = false;
              this.ApiMsgData = response.data['data'];
              this.apiMsgPage.total = response.data['total'];

              this.isIndeterminate = false;
              this.apiMsgVessel = [];
              this.checkAll = false;
              for (let i = 0; i < this.ApiMsgData.length; i++) {
                // this.ApiMsgData[i].check
                this.$set(this.ApiMsgData[i], 'check', false)
                // this.ApiMsgData[i].check = false
              }
            }
          }
      )
    },
    addApiData() {
      if (this.apiMsgVessel.length === 0) {
        this.$message({
          showClose: true,
          message: '请勾选接口信息',
          type: 'warning',
        });
        return
      }
      this.caseData.apiCases = this.caseData.apiCases.concat(this.apiMsgVessel);
      this.caseData.apiCases = JSON.parse(JSON.stringify(this.caseData.apiCases));
      // this.handleCheckAllChange(false)
      // this.$refs.multipleTable.clearSelection();
      // this.againSort()
    },
    addConfigVariable() {
      this.caseData.variable.push({key: '', value: '', remark: ''});
    },
    delConfigVariable(i) {
      this.caseData.variable.splice(i, 1);
    },
    addCase() {
      //  添加用例
      // this.caseData.apiCases
      let apiCases
      apiCases = this.caseData.apiCases
      // apiCases = JSON.stringify(this.caseData.apiCases);
      // apiCases = JSON.parse(this.caseData.apiCases);
      for (let i = 0; i < apiCases.length; i++) {
        apiCases[i].variable = apiCases[i].variable.filter(items => items.key !== null)
        apiCases[i].extract = apiCases[i].extract.filter(items => items.key !== null)
        apiCases[i].validate = apiCases[i].validate.filter(items => items.key !== null)
        apiCases[i].param = apiCases[i].param.filter(items => items.key !== null)
        apiCases[i].header = apiCases[i].header.filter(items => items.key !== null)
      }
      if (this.caseData.apiCases.length === 0) {
        this.$message({
          showClose: true,
          message: '请添加接口信息到执行步骤',
          type: 'warning',
        });
        return
      }
      if (this.caseData.name === '' || this.caseData.name === null) {
        this.$message({
          showClose: true,
          message: '用例名字不能为空',
          type: 'warning',
        });
        return
      }
      for (let i = 0; i < this.caseData.apiCases.length; i++) {
        if (!(/(^[1-9]\d*$)/.test(this.caseData.apiCases[i]['time']))) {
          this.$message({
            showClose: true,
            message: '第' + i + '条用例的执行次数请输入正整数',
            type: 'warning',
          });
          return
        }
      }
      // console.log(this.environmentList.indexOf(this.caseData.environment));
      this.$axios.post(this.$api.addCaseApi, {
        'num': this.caseData.num,
        'name': this.caseData.name,
        'times': this.caseData.times,
        'caseSetId': this.caseData.setId,
        'desc': this.caseData.desc,
        'environment': this.environmentList.indexOf(this.caseData.environment),
        'funcAddress': this.caseData.funcAddress,
        'variable': JSON.stringify(this.caseData.variable),
        'projectId': this.caseData.projectId,
        'ids': this.caseData.id,
        'apiCases': this.caseData.apiCases,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              //  不直接赋值的原因是，如果步骤是新的，还要赋值id给步骤，有点麻烦，还不如直接重新查询
              this.editCase(response.data['case_id'])
              // this.caseData.id = response.data['case_id'];
              // this.caseData.num = response.data['num'];
            }
          }
      )
    },
  },
  computed: {
    monitorApiCases() {
      return this.caseData.apiCases;
    }
  },
  watch: {
    monitorApiCases: {
      handler: function () {
        if (this.$refs.apiMessageEditFunc) {
          this.$refs.apiMessageEditFunc.paramVisible = false
        }


      }
    }
  },
  mounted() {
  },
}
</script>
<style>
.list-complete-item {
  padding: 4px;
  margin-top: 4px;
  border: solid 1px rgb(224, 221, 221);
  border-radius: 4px;
  background-color: rgb(250, 250, 250);
}


</style>
