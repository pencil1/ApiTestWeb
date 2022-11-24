<template>
  <div class="sceneManage" v-loading="this.loading">
    <el-form :inline="true" class="demo-form-inline search-style" size="small">
      <el-form-item label="项目名称" labelWidth="110px">
        <el-select v-model="form.projectId" placeholder="请选择项目" @change="initProjectChoice">
          <el-option
              v-for="(item) in proAndIdData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="用例名称">
        <el-input placeholder="请输入用例" v-model="form.caseName">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native="handleCaseCurrentChange(1)">搜索
        </el-button>
        <el-button type="primary" @click.native="addCase()">添加接口用例</el-button>
        <el-button type="primary" @click.native="runCase(caseList,true,true)">批量运行</el-button>
        <el-tooltip class="item" effect="dark" content="查看最近一次返回内容" placement="top">
          <el-button type="primary" icon="el-icon-view" @click.native="$store.state.showResultStatus=true">{{ null }}
          </el-button>
        </el-tooltip>

      </el-form-item>

    </el-form>
    <el-tabs v-model="numTab" class="table_padding"
             @tab-click="tabChange" type="card" closable
             @tab-remove="removeTab"
             style="padding-top: 5px">
      <el-tab-pane label="用例信息" name="-1">
        <el-row>
          <el-col :span="5"
                  style="border:1px solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;">
            <caseSetList
                ref="caseSetR"
                @findCase="findCase"
                :form="form"
                :proAndIdData="proAndIdData"
            ></caseSetList>
          </el-col>
          <el-col :span="19">

            <el-table
                ref="sceneMultipleTable"
                @selection-change="handleCaseSelection"
                :data="caseAll"
                :max-height="this.$store.state.tableHeight-10"
                stripe>
              <el-table-column
                  type="selection"
                  width="45">
              </el-table-column>
              <el-table-column
                  prop="num"
                  label="编号"
                  min-width="15">
              </el-table-column>
              <el-table-column
                  :show-overflow-tooltip=true
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
                             @click.native="editCopyCase(caseAll[scope.$index],'edit')">
                    编辑
                  </el-button>
                  <el-button type="primary" icon="el-icon-tickets" size="mini"
                             @click.native="editCopyCase(caseAll[scope.$index],'copy')">
                    复制
                  </el-button>
                  <el-button type="primary" icon="el-icon-setting" size="mini"
                             @click.native="runCase(caseAll[scope.$index]['caseId'])">运行
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini"
                             @click.native="sureView(delCase,caseAll[scope.$index]['caseId'],caseAll[scope.$index]['name'])">
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
                  @current-change="handleCaseCurrentChange"
                  @size-change="handleCaseSizeChange"
                  :current-page="casePage.currentPage"
                  :page-size="casePage.sizePage"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="this.casePage.total">
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
        <caseEdit
            :caseSetId="form.caseSet.id"
            :projectId="form.projectId"
            :setTempData="setTempData"
            :proAndIdData="proAndIdData"
            :config="item.config"
            @runCase="runCase"
            @updateTab="updateTab"
            ref="caseEditFunc">
        </caseEdit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import caseEdit from './caseEdit.vue'
import caseSetList from './caseSetList.vue'

export default {
  components: {
    caseEdit: caseEdit,
    caseSetList: caseSetList,
  },
  name: 'sceneManage',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      numTab: '-1',
      editableTabs: [],
      funcAddress: '',
      caseList: [],  //  临时存储被勾选的用例数据
      proAndIdData: '',
      loading: false,
      caseAll: [],  //  页面table的表格数据
      casePage: {
        total: 1,
        currentPage: 1,
        sizePage: 20,
      },
      setPage: {
        total: 1,
        currentPage: 1,
        sizePage: 30,
      },
      setTempData: {
        name: null,
        setId: null,
      },
      form: {
        projectId: null,
        caseName: '',
        caseSet: {
          name: '',
          higherId: '',
          id: '',
          num: '',
        },
      },
    }
  },

  methods: {
    findCase(initPage=false) {
      if (initPage){
        // 切换不同集合的时候，重置页面为1
        this.casePage.currentPage = 1
      }
      this.$axios.post(this.$api.findCaseApi, {
        'caseSetId': this.form.caseSet.id,
        'projectId': this.form.projectId,
        'caseName': this.form.caseName,
        'page': this.casePage.currentPage,
        'sizePage': this.casePage.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.caseAll = response.data['data'];
              this.casePage.total = response.data['total'];
            }
          }
      )
    },
    initData() {
      //  初始化页面数据
      this.$axios.get(this.$api.baseDataApi, {
        params: {case: true}
      }).then((response) => {
            this.proAndIdData = response.data['data'];
            if (response.data['user_pros']) {
              this.form.projectId = this.proAndIdData[0].id;
              let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
              this.configData = this.proAndIdData[index]['config_data']
            }
          }
      );
      this.$axios.post(this.$api.findFuncFileApi, {'privates': false}).then((response) => {
            this.funcAddress = response['data']['data'];
          }
      );
    },
    initProjectChoice() {
      //  当项目选择项改变时
      this.setPage.currentPage = 1;
      this.casePage.currentPage = 1;
      // 查询其他项目时，关闭编辑
      // this.findSet()
    },
    handleCaseCurrentChange(val) {
      this.casePage.currentPage = val;
      this.findCase()
    },
    handleCaseSizeChange(val) {
      this.casePage.sizePage = val;
      this.findCase()
    },
    delCase(caseId) {
      this.$axios.post(this.$api.delCaseApi, {'caseId': caseId}).then((response) => {
            this.messageShow(this, response);
            this.form.caseName = '';
            this.findCase();
          }
      )
    },

    runCase(caseIds, status = false, reportStatus = false) {
      //  status，为true时，批量运行用例，为false运行单用例
      //  reportStatus，为true时生成报告，为false时返回临时数据
      let _sceneIds = [];
      if (caseIds.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择测试用例',
          type: 'warning',
        });
        return
      }
      if (status) {
        //  为true时，提取选中用例的id
        for (let i = 0; i < caseIds.length; i++) {
          _sceneIds.push(caseIds[i].caseId);
        }
      } else {
        _sceneIds.push(caseIds)
      }
      this.loading = true;
      this.$axios.post(this.$api.runCaseApi, {
        'reportStatus': reportStatus,
        'caseIds': _sceneIds,
        'projectId': this.form.projectId
      }).then((response) => {
            this.loading = false;
            if (response.data['status'] === 0) {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'warning',
              });
            } else {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'success',
              });
              if (reportStatus) {
                let {href} = this.$router.resolve({
                  path: 'reportShow',
                  query: {reportId: response.data['data']['report_id']}
                });
                window.open(href, '_blank');
              } else {
                let tempData = {'details': [{'records': [], 'in_out': {'out': ''}}]};

                for (let i = 0; i < response['data']['data']['data']['details'].length; i++) {
                  tempData['details'][0]['records'] = tempData['details'][0]['records'].concat(response['data']['data']['data']['details'][i]['records'])
                }
                this.$store.commit('SET_RESULT_DATA',tempData)
                // this.$refs.resultFunc.showData(tempData);
              }
            }
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


    handleCaseSelection(val) {
      //  勾选用例时，被勾选的用例会存到caseList
      this.caseList = val;
    },
    cancelSelection() {
      this.$refs.sceneMultipleTable.clearSelection();
    },
    addCase() {
      if (!this.form.caseSet.id) {
        this.$message({
          showClose: true,
          message: '请先创建用例集',
          type: 'warning',
        });
      } else {
        this.editableTabs.push({
          title: '添加接口',
          numTab: '9999',
          config: {'mounted': 'init', numTab: '9999',},
        });
        this.numTab = '9999';
      }

    },
    editCopyCase(caseMsg, status) {
      let caseId = caseMsg.caseId.toString()
      if (status === 'edit') {
        let msg = this.editableTabs.filter(tab => tab.numTab === caseId)
        if (msg.length !== 0) {
          // 判断是否存在已经在编辑中的tab，是的话，跳到已存在的编辑窗口
          this.numTab = msg[0].numTab;
        } else {
          //否的话，新建一个tab跳过去
          this.editableTabs.push({
            title: caseMsg.name,
            numTab: caseId,
            config: {mounted: status, caseId: caseMsg.caseId, numTab: caseId}
          });
          this.numTab = caseId;
        }
      } else {
        let newNumTab = '9999';
        this.editableTabs.push({
          title: caseMsg.name,
          numTab: newNumTab,
          config: {mounted: status, caseId: caseMsg.caseId, numTab: newNumTab,}
        });
        this.numTab = newNumTab;
      }

    },
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
    },

    tabChange(tab) {
      //  当tab切换到接口信息时，刷新列表
      if (tab.label === '用例信息') {
        this.findCase()
      } else if (tab.label === '用例编辑') {
        // 切换回来的时候更新用例集合和api集合数据
        this.$refs.caseEditFunc.getNewCaseSetList();

      }
    },
    updateTab(title, numTab, msg) {
      if (msg === '新建成功') {
        // 新建的接口，需要全量更新临时tab里的数据
        let index = this.editableTabs.map(item => item.numTab).indexOf('9999');  //  获取当前节点的下标
        this.editableTabs[index]['config'] = {mounted: 'edit', caseId: parseInt(numTab), numTab: numTab,}
        this.editableTabs[index]['title'] = title
        this.editableTabs[index]['numTab'] = numTab
        this.numTab = numTab
      } else {
        let index = this.editableTabs.map(item => item.numTab).indexOf(numTab);  //  获取当前节点的下标
        this.editableTabs[index]['title'] = title
        // this.editableTabs[index]['numTab'] = numTab
      }

    },
  },
  mounted() {
    this.initData();

  },
}
</script>

<style>

</style>
