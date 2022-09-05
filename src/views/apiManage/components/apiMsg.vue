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

      <el-form-item label="接口名称">
        <el-input placeholder="请输入名称" v-model="form.apiName" clearable style="width: 120px">
        </el-input>
      </el-form-item>
      <el-form-item label="接口地址">
        <el-input placeholder="请输入地址" v-model="form.apiAddress" clearable style="width: 120px">
        </el-input>
      </el-form-item>

      <el-form-item>
        <!--                <el-button type="primary" icon="el-icon-search" @click.native="test1()">搜索</el-button>-->
        <el-button type="primary" @click.native="handleCurrentChange(1)">搜索</el-button>
        <el-button type="primary" @click.native="initData()">添加接口</el-button>
        <el-button type="primary" @click.native="apiTest(apiMsgList)">测试
        </el-button>
        <el-tooltip class="item" effect="dark" content="查看最近一次返回内容" placement="top">
          <el-button type="primary" icon="el-icon-view" @click.native="$refs.resultFunc.lastResult()">{{ null }}
          </el-button>
        </el-tooltip>

        <el-button type="primary" @click.native="$refs.importApiFunc.initData()">导入接口</el-button>

        <el-button type="primary"
                   v-if="form.configId !== null && form.configId !== '' "
                   @click.native="$refs.configEditFunc.editSceneConfig(form.configId)">配置修改
        </el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="numTab" class="table_padding"
             @tab-click="tabChange" type="card" closable
             @tab-remove="removeTab"
             style="padding-top: 5px">
      <el-tab-pane label="接口信息" name="-1">
        <el-row>
          <el-col :span="5"
                  style="border:1px solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;">
            <apiSet
                ref="apiSetR"
                @findApiMsg="findApiMsg"
                :form="form"
                :proAndIdData="proAndIdData"
            ></apiSet>
          </el-col>
          <el-col :span="19" style="padding-left: 5px;">
            <el-table

                ref="apiMultipleTable"
                @selection-change="handleApiMsgSelection"
                :data="ApiMsgTableData"
                stripe
                :max-height="this.$store.state.tableHeight-10">
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
                             @click.native="editCopyApi(ApiMsgTableData[scope.$index],'edit')">
                    编辑
                  </el-button>
                  <el-button type="primary" icon="el-icon-tickets" size="mini"
                             @click.native="editCopyApi(ApiMsgTableData[scope.$index],'copy')">
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
      <el-tab-pane
          style="background-color: rgb(250, 250, 250);"
          v-for="(item, index) in editableTabs"
          :key="item.numTab"
          :label="item.title"
          :name="item.numTab">
        <apiEdit
            :projectId="form.projectId"
            :apiSetId="form.apiSet.id"
            :proAndIdData="proAndIdData"
            :config="item.config"
            @findApiMsg="findApiMsg"
            @apiTest="apiTest"
            @updateTab="updateTab"
            ref="apiFunc">
        </apiEdit>
      </el-tab-pane>
      <!--      <el-tab-pane label="接口配置" name="2" v-if="apiEditViewStatus"-->
      <!--                   style="background-color: rgb(250, 250, 250);">-->
      <!--        <apiEdit-->
      <!--            :projectId="form.projectId"-->
      <!--            :apiSetId="form.apiSet.id"-->
      <!--            :proAndIdData="proAndIdData"-->
      <!--            @findApiMsg="findApiMsg"-->
      <!--            @apiTest="apiTest"-->
      <!--            ref="apiFunc">-->
      <!--        </apiEdit>-->
      <!--      </el-tab-pane>-->
    </el-tabs>
    <result ref="resultFunc">
    </result>
    <!--    <errorView ref="errorViewFunc">-->
    <!--    </errorView>-->
    <importApi
        :projectId="form.projectId"
        :apiSetId="form.apiSet.id"
        ref="importApiFunc">
    </importApi>
    <configEdit
        :proAndIdData="proAndIdData"
        :projectId="form.projectId"
        ref="configEditFunc">
    </configEdit>
  </div>
</template>
<script>

import apiSet from './apiSetList.vue'
import apiEdit from './apiEdit.vue'
import importApi from './importApi.vue'
// import errorView from '../common/errorView.vue'
const configEdit = () => import('@/views/sceneConfig/components/configEdit.vue')

export default {
  components: {
    apiSet: apiSet,
    // importApi: importApi,
    apiEdit: apiEdit,
    importApi: importApi,
    // errorView: errorView,
    configEdit: configEdit,

  },
  name: 'caseManage',
  data() {
    return {
      apiEditViewStatus: false,//  接口配置组件显示控制
      numTab: '-1',  //  tab页的显示
      loading: false,  //  页面加载状态开关
      proAndIdData: Array(),  //  项目名称和id的数据
      configData: Object(),  //  项目对应的配置数据
      proUrlData: Array(),  //  项目对应的环境url数据
      ApiMsgTableData: Array(),   //  接口表单数据
      apiMsgList: Array(),    //  临时存储接口数据
      editableTabs: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      apiMsgPage: {
        total: 1,
        currentPage: 1,
        sizePage: 20,
      },


      apiSetData: {
        viewStatus: false,
        id: '',
        num: '',
        name: '',
      },
      form: {
        configId: null,
        projectId: null,
        apiName: null,
        apiAddress: null,
        apiSet: {
          name: '',
          higherId: '',
          id: '',
          num: '',
        },
      },
    }
  },

  methods: {
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let numTab = this.numTab;
      if (numTab === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.numTab === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {

              numTab = nextTab.numTab;
            } else {
              numTab = '-1';
            }
          }
        });
      }
      this.numTab = numTab;
      this.editableTabs = tabs.filter(tab => tab.numTab !== targetName);
    }
    ,
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
    findApiMsg(page = null, apiSetId = null) {
      if (!page) {
        page = this.apiMsgPage.currentPage
      }
      if (!apiSetId) {
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
        'apiAddress': this.form.apiAddress,
        'projectId': this.form.projectId,
        'apiSetId': apiSetId,
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
      for (let i = 0; i < this.proAndIdData.length; i++) {
        if (this.proAndIdData[i]['id'] === this.form.projectId) {

          this.proUrlData = this.proAndIdData[i]['url']
        }
      }
      this.editableTabs.push({
        title: '添加接口',
        numTab: '9999',
        config: {'mounted': 'init', numTab: '9999',},
      });
      this.numTab = '9999';
    },

    editCopyApi(apiMsg, status) {
      //  编辑或者复制接口信息
      let apiMsgId = apiMsg.apiMsgId.toString()
      if (status === 'edit') {
        let msg = this.editableTabs.filter(tab => tab.numTab === apiMsgId)
        if (msg.length !== 0) {
          // 判断是否存在已经在编辑中的tab，是的话，跳到已存在的编辑窗口
          this.numTab = msg[0].numTab;
        } else {
          //否的话，新建一个tab跳过去
          this.editableTabs.push({
            title: apiMsg.name,
            numTab: apiMsgId,
            config: {mounted: status, apiMsgId: apiMsg.apiMsgId, numTab: apiMsgId}
          });
          this.numTab = apiMsgId;
        }
      }
      else {
        let newNumTab = '9999';
        this.editableTabs.push({
          title: apiMsg.name,
          numTab: newNumTab,
          config: {mounted: status, apiMsgId: apiMsg.apiMsgId, numTab: newNumTab,}
        });
        this.numTab = newNumTab;
      }
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
    updateTab(title, numTab, msg) {
      if (msg === '新建成功') {
        // 新建的接口，需要全量更新临时tab里的数据
        let index = this.editableTabs.map(item => item.numTab).indexOf('9999');  //  获取当前节点的下标
        this.editableTabs[index]['config'] = {mounted: 'edit', apiMsgId: parseInt(numTab), numTab: numTab,}
        this.editableTabs[index]['title'] = title
        this.editableTabs[index]['numTab'] = numTab
        this.numTab = numTab
      } else {
        let index = this.editableTabs.map(item => item.numTab).indexOf(numTab);  //  获取当前节点的下标
        this.editableTabs[index]['title'] = title
        // this.editableTabs[index]['numTab'] = numTab
      }

    },
    apiTest(apiMsgData = null) {
      //  接口调试
      this.loading = true;
      this.$axios.post(this.$api.runApiApi, {
        'apiMsgData': apiMsgData,
        'projectId': this.form.projectId,
        'configId': this.form.configId,
      }).then((response) => {
            // console.log(response)
            if (response.data['status'] === 0) {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'warning',
              });
              // if (response.data['error']) {
              //   this.$refs.errorViewFunc.showData(response.data['error']);
              // }
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
      ).catch(err => {
        this.loading = false;
        this.$message({
          showClose: true,
          message: '接口超时或消耗时间过长跳过等待',
          type: 'warning',
        });
      })
    },

    handleApiMsgSelection(val) {
      this.apiMsgList = val;
    },

    cancelSelection() {
      //  清除接口选择
      this.$refs.apiMultipleTable.clearSelection();
    },
    getConfigData() {
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.configData = this.proAndIdData[index]['config_data']
    },
    initProjectChoice() {
      //  当项目选择项改变时，初始化模块和配置的数据
      this.form.configId = null;
      this.form.apiSet = {name: null, id: null,};
      this.apiMsgPage.currentPage = 1;
      this.ApiMsgTableData = []
      // 查询其他项目时，关闭编辑
      // this.apiEditViewStatus = false;
      // this.$refs.apiSetR.findApiSet();
      this.getConfigData()

    },
    tabChange(tab) {
      //  当tab切换到接口信息时，刷新列表
      if (tab.label === '接口信息') {
        this.findApiMsg()
      } else if (tab.label === '接口编辑') {
        // 切换回来的时候更新接口集合数据
        this.$refs.apiFunc.getNewApiSetList();
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
