<template>
  <div class="modeManage">

    <el-form :inline="true" class="demo-form-inline search-style" size="small">
      <el-form-item label="项目" labelWidth="80px">
        <el-select v-model="projectId" placeholder="选择项目" @change="findTask()">
          <el-option
              v-for="(item) in proAndIdData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务" labelWidth="50px">


        <el-input placeholder="请输入任务名称" v-model="taskName">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click.native="handleCurrentChange(1)">搜索</el-button>
        <el-button type="primary" @click.native="$refs.editFunc.initTaskData()">添加任务
        </el-button>
      </el-form-item>
    </el-form>

    <el-tabs value="first" class="table_padding">
      <el-tab-pane label="任务列表" name="first" style="margin: 0 0 -10px;">
        <el-table :data="tableData"
                  :max-height="this.$store.state.tableHeight"
                  stripe>
          <!--<el-table-column-->
          <!--prop="num"-->
          <!--label="编号"-->
          <!--min-width="40">-->
          <!--</el-table-column>-->
          <el-table-column
              prop="task_name"
              label="任务名称"
              min-width="100">
          </el-table-column>
          <el-table-column
              prop="task_config_time"
              label="cron"
              min-width="100">
          </el-table-column>
          <el-table-column
              prop="status"
              label="状态"
              min-width="100">
            <template slot-scope="scope">
              <!--<div :style="scope.row.read_status === '已读' ? 'color:#2bef2b': 'color:rgb(255, 74, 74)'">-->
              <!--{{scope.row.read_status}}-->
              <!--</div>-->
              <el-tag size="small" :type="scope.row.status === '创建' ?
                             'info' :  scope.row.status === '启动' ? 'success' : 'warning'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="操作"
              min-width="200">
            <template slot-scope="scope">
              <el-button type="primary" v-show="false">{{ null }}</el-button>
              <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] === '创建'"
                         @click.native="$refs.editFunc.editTask(tableData[scope.$index]['id'])">修改
              </el-button>
              <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] === '创建'"
                         @click.native="startTask(tableData[scope.$index]['id'])">启动
              </el-button>
              <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] !== '创建'"
                         v-show="tableData[scope.$index]['status'] !== '暂停'"
                         @click.native="pauseTask(tableData[scope.$index]['id'])">暂停
              </el-button>
              <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] !== '创建'"
                         v-show="tableData[scope.$index]['status'] !== '启动'"
                         @click.native="resumeTask(tableData[scope.$index]['id'])">恢复
              </el-button>
              <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] !== '创建'"
                         @click.native="removeTask(tableData[scope.$index]['id'])">移除
              </el-button>
              <el-button type="success" size="mini" :loading="scope.row.isShow"
                         @click.native="runNow(scope.row)">单次运行
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click.native="sureView(delTask,tableData[scope.$index]['id'],tableData[scope.$index]['task_name'])">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page="currentPage"
              :page-size="sizePage"
              layout="total, sizes, prev, pager, next, jumper"
              :total="this.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <editView
        :proAndIdData="proAndIdData"
        ref="editFunc"
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
  name: 'modeManage',
  data() {
    return {
      proAndIdData: '',
      taskName:'',
      projectId:'',
      tableData: [],
      total: 1,
      currentPage: 1,
      sizePage: 20,
    }
  },
  methods: {
    initBaseData() {
      this.$axios.get(this.$api.baseDataApi, {
        params: {task: true}
      }).then((response) => {
            this.proAndIdData = response.data['data'];
            if (response.data['user_pros']) {
              this.projectId = this.proAndIdData[0].id;
              this.findTask();
            }
          }
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.findTask()
    },
    handleSizeChange(val) {
      this.sizePage = val;
      this.findTask()
    },
    findTask() {
      this.$axios.post(this.$api.findTaskApi, {
        'projectId': this.projectId,
        'taskName': this.taskName,
        'page': this.currentPage,
        'sizePage': this.sizePage,
      }).then((response) => {
            if (response.data['status'] === 0) {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'warning',
              });
            } else {
              this.tableData = response.data['data'];
              this.total = response.data['total'];
            }

          }
      )
    },
    startTask(id) {
      this.$axios.post(this.$api.startTaskApi, {'id': id}).then((response) => {
            this.messageShow(this, response);
            this.findTask();
          }
      )
    },
    pauseTask(id) {
      this.$axios.post(this.$api.pauseTaskApi, {'id': id}).then((response) => {
            this.messageShow(this, response);
            this.findTask();
          }
      )
    },
    resumeTask(id) {
      this.$axios.post(this.$api.resumeTaskApi, {'id': id}).then((response) => {
            this.messageShow(this, response);
            this.findTask();
          }
      )
    },
    removeTask(id) {
      this.$axios.post(this.$api.removeTaskApi, {'id': id}).then((response) => {
            this.messageShow(this, response);
            this.findTask();
          }
      )
    },
    runNow(item) {
      if (!item.isShow) {
        this.$set(item, 'isShow', true)
      } else {
        item.isShow = true
      }
      this.$axios.post(this.$api.runTaskApi, {'id': item.id}).then((response) => {
            if (this.messageShow(this, response)) {
              let {href} = this.$router.resolve({
                path: 'reportShow',
                query: {reportId: response.data['data']['report_id']}
              });
              window.open(href, '_blank');
            }
            item.isShow = false
          }
      )
    },
    delTask(id) {
      this.$axios.post(this.$api.delTaskApi, {'id': id}).then((response) => {
            this.messageShow(this, response);
            this.taskName = '';
            if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
              this.currentPage = this.currentPage - 1
            }
            this.findTask();
          }
      )
    },
  },
  mounted() {
    this.initBaseData();


  },
}
</script>

<style>

</style>
