<template>
  <div class="caseManage" v-loading="this.loading">

    <el-form :inline="true" class="demo-form-inline search-style" size="small">
      <el-form-item label="项目" labelWidth="80px">
        <el-select v-model="form.projectId"
                   placeholder="请选择项目"
                   @change="initProjectChoice"
                   style="width: 150px;padding-right:5px">
          <el-option
              v-for="(item) in proAndIdData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select
            v-model="form.configId"
            placeholder="请选择配置"
            clearable
            value-key="configId"
            style="width: 150px"
        >
          <el-option

              v-for="item in configData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="接口名称" v-if="numTab !== 'third'">
        <el-input placeholder="请输入" v-model="form.apiName" clearable style="width: 150px">
        </el-input>
      </el-form-item>

      <el-form-item>
        <!--                <el-button type="primary" icon="el-icon-search" @click.native="test1()">搜索</el-button>-->
        <el-button type="primary" icon="el-icon-search" @click.native="handleCurrentChange(1)">搜索</el-button>
        <el-button type="primary" @click.native="initData()">录入接口信息</el-button>
        <el-button type="primary" @click.native="apiTest(apiMsgList)">测试
        </el-button>

        <el-button type="primary" icon="el-icon-view" @click.native="$refs.resultFunc.lastResult()">{{ null }}
        </el-button>
        <!--                <el-button type="primary" @click.native="$refs.importApiFunc.initData()">导入信息</el-button>-->
        <el-button type="primary"
                   v-if="form.configId !== null && form.configId !== '' "
                   @click.native="$refs.configEditFunc.editSceneConfig(form.configId)">配置修改
        </el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="numTab" class="table_padding" @tab-click="tabChange">
      <el-tab-pane label="接口信息" name="first">
        <el-row>
          <el-col :span="3"
                  style="border:1px solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;">
            <apiSet
                ref="apiSetR"
                @findApiMsg="findApiMsg"
                :form="form"
                :proAndIdData="proAndIdData"
            ></apiSet>
          </el-col>
          <el-col :span="21" style="padding-left: 5px;">
            <el-table

                ref="apiMultipleTable"
                @selection-change="handleApiMsgSelection"
                :data="ApiMsgTableData"
                stripe
                :max-height="this.$store.state.tableHeight">
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
                  width="320">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"
                             @click.native="editCopyApi(ApiMsgTableData[scope.$index]['apiMsgId'],'edit')">
                    编辑
                  </el-button>
                  <el-button type="primary" icon="el-icon-tickets" size="mini"
                             @click.native="editCopyApi(ApiMsgTableData[scope.$index]['apiMsgId'],'copy')">
                    复制
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click.native="sureView(delApi,ApiMsgTableData[scope.$index]['apiMsgId'],ApiMsgTableData[scope.$index]['name'])">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-button @click="cancelSelection()" size="mini" style="position: absolute;margin-top: 2px;">
              取消选择
            </el-button>
            <div class="pagination">
              <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :current-page="apiMsgPage.currentPage"
                  :page-size="apiMsgPage.sizePage"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="apiMsgPage.total">
              </el-pagination>
            </div>
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="接口配置" name="second" v-if="apiEditViewStatus"
                   style="background-color: rgb(250, 250, 250);">
        <apiEdit
            :projectId="form.projectId"
            :apiSetId="form.apiSet.id"
            :proAndIdData="proAndIdData"
            @findApiMsg="findApiMsg"
            @apiTest="apiTest"
            ref="apiFunc">
        </apiEdit>

      </el-tab-pane>
    </el-tabs>
<!--    <importApi-->
<!--        :projectId="form.projectId"-->
<!--        :moduleData="form.module"-->
<!--        ref="importApiFunc">-->
<!--    </importApi>-->
    <result ref="resultFunc">
    </result>
    <errorView ref="errorViewFunc">
    </errorView>
    <configEdit
        :proAndIdData="proAndIdData"
        :projectId="form.projectId"
        ref="configEditFunc">
    </configEdit>
  </div>
</template>
<script>

import apiSet from './apiSet.vue'
import apiEdit from './apiEdit.vue'
// import errorView from '../common/errorView.vue'
const configEdit = () => import('@/views/sceneConfig/components/configEdit.vue')

export default {
  components: {
    apiSet: apiSet,
    // importApi: importApi,
    apiEdit: apiEdit,
    // errorView: errorView,
    configEdit: configEdit,

  },
  name: 'caseManage',
  data() {
    return {
      apiEditViewStatus: false,//  接口配置组件显示控制
      numTab: 'first',  //  tab页的显示
      loading: false,  //  页面加载状态开关
      proAndIdData: Array(),  //  项目名称和id的数据
      configData: Object(),  //  项目对应的配置数据
      proUrlData: Array(),  //  项目对应的环境url数据
      ApiMsgTableData: Array(),   //  接口表单数据
      apiMsgList: Array(),    //  临时存储接口数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      apiMsgPage: {
        total: 1,
        currentPage: 1,
        sizePage: 20,
      },


      moduleData: {
        viewStatus: false,
        id: '',
        num: '',
        name: '',
      },
      form: {
        configId: null,
        projectId: null,
        apiName: null,
        apiSet: {
          name: '',
          id: '',
          num: '',
        },
      },
    }
  },

  methods: {
    scrollbarHeight() {
      let t = this.$store.state.tableHeight;
      t = t - 5;
      return "height:" + t + "px;"
    },
    initBaseData() {
      //  初始化页面所需要的数据
      this.$axios.get(this.$api.baseDataApi).then((response) => {
            this.proAndIdData = response.data['data'];
            if (response.data['user_pros']) {
              this.form.projectId = this.proAndIdData[0].id;
              this.getConfigData()
            }
          }
      )
    },
    handleCurrentChange(val) {
      this.apiMsgPage.currentPage = val;
      this.findApiMsg();
    },
    handleSizeChange(val) {
      this.apiMsgPage.sizePage = val;
      this.findApiMsg();
    },
    findApiMsg(page=null,apiSetId=null) {
      console.log(document.documentElement.clientHeight)
      if(!page){
        page = this.apiMsgPage.currentPage
      }
      if(!apiSetId){
        apiSetId = this.form.apiSet.id
      }
      //  查询接口信息
      if (!this.form.apiSet) {
        this.$message({
          showClose: true,
          message: '请选择模块',
          type: 'warning',
        });
        return
      }
      this.$axios.post(this.$api.findApiApi, {
        'apiName': this.form.apiName,
        'projectId': this.form.projectId,
        'moduleId': apiSetId,
        'page': page,
        'sizePage': this.apiMsgPage.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.ApiMsgTableData = response.data['data'];
              this.apiMsgPage.total = response.data['total'];
            }
          }
      )
    },
    initData() {
      //  初始化数据并进入接口编辑tab
      if (!this.form.apiSet.id) {
        this.$message({
          showClose: true,
          message: '请先创建接口模块',
          type: 'warning',
        });
        return
      }
      this.apiEditViewStatus = true;
      this.numTab = 'second';

      for (let i = 0; i < this.proAndIdData.length; i++) {
        if (this.proAndIdData[i]['id'] === this.form.projectId) {

          this.proUrlData = this.proAndIdData[i]['url']
        }
      }
      setTimeout(() => {
        this.$refs.apiFunc.initApiMsgData();
      }, 0)
    },

    editCopyApi(apiMsgId, status) {
      //  编辑或者复制接口信息
      this.apiEditViewStatus = true;
      this.numTab = 'second';

      for (let i = 0; i < this.proAndIdData.length; i++) {
        if (this.proAndIdData[i]['id'] === this.form.projectId) {

          this.proUrlData = this.proAndIdData[i]['url']
        }
      }

      setTimeout(() => {
        this.$refs.apiFunc.editCopyApiMsg(apiMsgId, status);
      }, 0)
    },
    delApi(apiMsgId) {
      //  删除接口信息
      this.$axios.post(this.$api.delApiApi, {'apiMsgId': apiMsgId}).then((response) => {
            this.messageShow(this, response);
            this.form.apiName = null;
            if ((this.apiMsgPage.currentPage - 1) * this.apiMsgPage.sizePage + 1 === this.apiMsgPage.total) {
              this.apiMsgPage.currentPage = this.apiMsgPage.currentPage - 1
            }
            this.findApiMsg();
          }
      )
    },
    apiTest(apiMsgData = null) {
      //  接口调试
      this.loading = true;
      this.$axios.post(this.$api.runApiApi, {
        'apiMsgData': apiMsgData,
        'projectId': this.form.projectId,
        'configId': this.form.configId,
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
            } else {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'success',
              });
              this.$refs.resultFunc.showData(response['data']['data']);
            }
            this.loading = false;
          }
      )
    },

    handleApiMsgSelection(val) {
      this.apiMsgList = val;
    },

    cancelSelection() {
      //  清除接口选择
      this.$refs.apiMultipleTable.clearSelection();
    },
    getConfigData(){
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.configData = this.proAndIdData[index]['config_data']
    },
    initProjectChoice() {
      //  当项目选择项改变时，初始化模块和配置的数据
      this.form.configId = null;
      this.form.apiSet = {name: null, id: null,};
      this.apiMsgPage.currentPage = 1;
      this.ApiMsgTableData = []
      this.$refs.apiSetR.findApiSet();
      this.getConfigData()

    },
    tabChange(tab) {
      //  当tab切换到接口信息时，刷新列表
      if (tab.label === '接口信息') {
        this.findApiMsg()
      }
    },
  },
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
