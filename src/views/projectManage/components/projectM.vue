<template>
  <div class="projectManage">
    <el-form :inline="true" class="demo-form-inline search-style" size="small">
      <el-form-item label="项目名称" labelWidth="110px">
        <el-input placeholder="请输入" v-model="form.projectName">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native="proHandleCurrentChange(1)">
          搜索
        </el-button>
        <el-button type="primary" @click.native="initProjectData()">添加项目
        </el-button>
      </el-form-item>

    </el-form>
    <el-tabs value="first" style="padding-left: 10px">
      <el-tab-pane label="项目列表" name="first" class="table_padding">

        <el-table :data="tableData" stripe :max-height="this.$store.state.tableHeight">
          <el-table-column
              prop="num"
              label="编号"
              width="80"
          >
          </el-table-column>
          <el-table-column
              prop="name"
              label="项目名称"
              width="150">
          </el-table-column>
          <el-table-column label="当前环境">
            <template slot-scope="scope">
              <el-tag size="small"
                      :type="tableData[scope.$index]['choice'] === '1' ?
                                    'success' : tableData[scope.$index]['choice'] === '2' ?
                                     'primary' :  tableData[scope.$index]['choice'] === '3' ? 'warning' : 'danger'">
                {{ environmentShow(tableData[scope.$index]['choice']) }}
              </el-tag>

            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="host_two"-->
          <!--label="基础url2"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
              prop="principal"
              label="负责人"
          >
            <template slot-scope="scope">
              <!--<div :style="scope.row.read_status === '已读' ? 'color:#2bef2b': 'color:rgb(255, 74, 74)'">-->
              <!--{{scope.row.read_status}}-->
              <!--</div>-->
              <el-tag
                  v-for="tag in scope.row.principal"
                  :key="tag"
                  size="mini"
                  style="margin-right: 5px"
              >
                {{
                  userData.find(item => item.id === tag) ? userData.find(item => item.id === tag).nickname : ''
                }}
              </el-tag>

            </template>
          </el-table-column>
          <el-table-column
              label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click.native="editProject(tableData[scope.$index]['id'])">编辑
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click.native="sureView(delProject,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
              @current-change="proHandleCurrentChange"
              @size-change="proHandleSizeChange"
              :current-page="currentPage"
              :page-size="sizePage"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <editView
        :environment="environment"
        :projectData="projectData"
        :form="form"
        :userData="userData"
        @addProject="addProject"
    >
    </editView>
  </div>
</template>

<script>
import editView from '../components/editView'

export default {
  components: {
    editView,
  },
  data() {
    return {
      // environment: { },
      environment: {
        environmentList: [{
          environmentName: '测试环境',
          urls: [],
          environmentChoice: '1',
        }, {
          environmentName: '开发环境',
          urls: [],
          environmentChoice: '2',
        }, {
          environmentName: '预发布环境',
          urls: [],
          environmentChoice: '3',
        }, {
          environmentName: '线上环境',
          urls: [],
          environmentChoice: '4',
        },],
        environmentChoice: '1',
      },
      // environment: {
      //   environmentTest: [{value: null}],
      //   environmentDevelop: [{value: null}],
      //   environmentProduction: [{value: null}],
      //   environmentStandby: [{value: null}],
      //   environmentChoice: 'first',
      // },
      tableData: [{value: null}],
      total: 1,
      userData: [],
      currentPage: 1,
      sizePage: 20,
      form: {
        showView: false,
        projectName: null,
        user: [],
      },
      projectData: {
        num: null,
        host: null,
        hostTwo: null,
        hostThree: null,
        hostFour: null,
        id: null,
        userId: null,
        modelFormVisible: false,
        projectName: null,
        principal: null,
        formLabelWidth: '80px',
        funcFile: '',
        header: Array(),
        variable: Array(),
      },
    }
  },
  methods: {
    proHandleCurrentChange(val) {
      this.currentPage = val;
      this.findProject()
    },
    proHandleSizeChange(val) {
      this.sizePage = val;
      this.findProject()
    },

    findProject() {
      this.$axios.post(this.$api.findProApi, {
        'projectName': this.form.projectName,
        'page': this.currentPage,
        'sizePage': this.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.tableData = response.data['data'];
              this.total = response.data['total'];
              this.userData = response.data['userData'];
            }
          }
      )
    },
    initProjectData() {
      // console.log(this.$store.state.headerWidth)


      this.form.showView = true
      this.projectData.num = null;
      this.projectData.projectName = null;
      this.environment =  {
        environmentList: [{
          environmentName: '测试环境',
          urls: [],
          environmentChoice: '1',
        }, {
          environmentName: '开发环境',
          urls: [],
          environmentChoice: '2',
        }, {
          environmentName: '预发布环境',
          urls: [],
          environmentChoice: '3',
        }, {
          environmentName: '线上环境',
          urls: [],
          environmentChoice: '4',
        },],
        environmentChoice: '1',
      }
      // this.environment.environmentTest = Array();
      // this.environment.environmentDevelop = Array();
      // this.environment.environmentProduction = Array();
      // this.environment.environmentStandby = Array();
      this.form.user = [];
      this.projectData.principal = null;
      this.projectData.funcFile = null;
      this.projectData.header = Array();
      this.projectData.variable = Array();
      this.projectData.id = null;
      this.projectData.modelFormVisible = true;
    },
    dealHostList(data) {
      let host = Array();
      for (let i = 0; i < data.length; i++) {
        if (data[i].value) {
          host.push(data[i].value);
        }
      }
      return host
    },
    dealHostDict(data) {
      let host = Array();
      if (!data) {
        return host
      }
      for (let i = 0; i < data.length; i++) {
        host.push({value: data[i]});
      }
      return host
    },
    addProject() {
      for (let i = 0; i < this.environment.environmentList.length; i++) {
        this.environment.environmentList[i].urls = this.environment.environmentList[i].urls.filter(url => url.value !== null)
      }
      this.$axios.post(this.$api.addProApi, {
        'projectName': this.projectData.projectName,
        'num': parseInt(this.projectData.num),
        // 'principal': JSON.stringify(this.form.user.map(item => item.user_id)),
        'principal': this.form.user,
        'funcFile': this.projectData.funcFile,
        'environmentChoice': this.environment.environmentChoice,
        'environmentList': this.environment.environmentList,
        // 'host': this.dealHostList(this.environment.environmentTest),
        // 'hostTwo': this.dealHostList(this.environment.environmentDevelop),
        // 'hostThree': this.dealHostList(this.environment.environmentProduction),
        // 'hostFour': this.dealHostList(this.environment.environmentStandby),
        'id': this.projectData.id,
        'header': JSON.stringify(this.projectData.header),
        'userId': this.$store.state.userId,
        'variable': JSON.stringify(this.projectData.variable),
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.form.showView = false;
              this.findProject();
            }
          }
      )
    },
    editProject(id) {
      this.$axios.post(this.$api.editProApi, {'id': id}).then((response) => {
            // let index = this.userData.map(item => item.user_id).indexOf(response.data['data']['user_id']);
            // this.form.user = this.userData[index];
            // this.projectData.principal = response.data['data']['principal'];
            this.projectData.projectName = response.data['data']['pro_name'];
            this.form.user = response.data['data']['principal'];
            this.environment.environmentChoice = response.data['data']['environment_choice'];
            this.environment.environmentList = response.data['data']['environment_list'];
            // this.environment.environmentTest = this.dealHostDict(response.data['data']['host']);
            // this.environment.environmentDevelop = this.dealHostDict(response.data['data']['host_two']);
            // this.environment.environmentProduction = this.dealHostDict(response.data['data']['host_three']);
            // this.environment.environmentStandby = this.dealHostDict(response.data['data']['host_four']);
            this.projectData.header = response.data['data']['headers'];
            this.projectData.variable = response.data['data']['variables'];
            this.projectData.num = response.data['data']['num'];
            this.projectData.id = id;
            this.projectData.funcFile = response.data['data']['func_file'];
            this.form.showView = true
          }
      )
    },
    delProject(id) {
      this.$axios.post(this.$api.delProApi, {'id': id}).then((response) => {
            this.messageShow(this, response);
            // 分页数量判断，当删除了某一页的最后一条数据后，分页数量-1
            if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
              this.currentPage = this.currentPage - 1
            }
            this.findProject();
          }
      )
    },
    environmentShow(choice) {
      if (choice === '1') {
        return '测试环境'
      } else if (choice === '2') {
        return '开发环境'
      } else if (choice === '3') {
        return '预发布环境'
      } else if (choice === '4') {
        return '线上环境'
      }
    },
  },
  mounted() {
    this.findProject();
  },
}
</script>
<style>
</style>
