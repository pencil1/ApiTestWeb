<template>
  <div>
    <el-row>
      <el-col style="border:1px solid;border-color: #ffffff #ffffff rgb(234, 234, 234) #ffffff;padding:2px">
        <el-dropdown @command="moduleCommand" style="float:right;">
                                      <span class="el-dropdown-link" style="color: #4ae2d5">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加</el-dropdown-item>
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
            <el-dropdown-item command="stick">置顶</el-dropdown-item>
            <el-dropdown-item command="del">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <el-scrollbar :wrapStyle="{
              height: this.$store.state.tableHeight-21+'px'
            }">
        <el-tree
            ref="testTree"
            @node-click="treeClick"
            class="filter-tree"
            highlight-current
            node-key="id"
            :data="apiSEtDataList"
            :props="defaultProps"

        >
        </el-tree>
      </el-scrollbar>
      <el-pagination
          small
          @current-change="handleModuleCurrentChange"
          :current-page="apiSetPage.currentPage"
          :page-size="30"
          layout="prev, pager, next"
          :total="apiSetPage.total">
      </el-pagination>
    </el-row>
    <el-dialog title="接口模块配置" :visible.sync="apiSetData.viewStatus" width="30%">
      <el-form>
        <el-form-item label="模块名称" label-width="100px">
          <el-input v-model="apiSetData.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="apiSetData.viewStatus = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="addApiSet()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "apiSet",
  props: ['form', 'proAndIdData'],
  data() {
    return {
      apiSEtDataList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      apiSetPage: {
        total: 1,
        currentPage: 1,
        sizePage: 30,
      },
      apiSetData: {
        viewStatus: false,
        id: '',
        num: '',
        name: '',
      },
    }

  },

  methods: {
    treeClick(data) {
      //  点击节点时，初始化数据并获取对应的接口信息
      let index = this.apiSEtDataList.map(item => item.id).indexOf(data['id']);  //  获取当前节点的下标
      this.form.apiSet = this.apiSEtDataList[index];
      // this.apiMsgPage.currentPage = 1;
      this.$emit('findApiMsg', 1);
    },
    handleModuleCurrentChange(val) {
      this.apiSetPage.currentPage = val;
      this.findApiSet()
    },
    findApiSet() {
      //  查询接口模块
      this.$axios.post(this.$api.findApiSetApi, {
        'projectId': this.form.projectId,
        'page': this.apiSetPage.currentPage,
        'sizePage': this.apiSetPage.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.apiSEtDataList = response.data['data'];
              this.apiSetPage.total = response.data['total'];
              // this.proModelData[this.form.projectId] = response.data['all_module'];
              if (this.apiSEtDataList.length !== 0) {

                for (let i = 0; i < this.proAndIdData.length; i++) {
                  if (this.proAndIdData[i]['id'] === this.form.projectId) {
                    this.proAndIdData[i]['module_data'] = response.data['all_module']
                  }
                }

                this.form.apiSet = this.apiSEtDataList[0];
                this.$nextTick(function () {
                  this.$refs.testTree.setCurrentKey(this.form.apiSet.id);  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
                });
                this.$emit('findApiMsg', null, this.form.apiSet.id);
                // this.findApiMsg();
              }


            }
          }
      )
    },
    addApiSet() {
      //  添加模块
      this.$axios.post(this.$api.addApiSetApi, {
        'projectId': this.form.projectId,
        'name': this.apiSetData.name,
        'id': this.apiSetData.id,
        'num': this.apiSetData.num,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.apiSetData.viewStatus = false;
              this.findApiSet();
            }
          }
      )
    },
    moduleCommand(command) {
      //  模块处理函数，根据命令执行不同操作
      if (command === 'add') {
        this.initApiSetData()
      } else if (command === 'edit') {
        this.editApiSet()
      } else if (command === 'stick') {
        this.stickApiSet()
      } else if (command === 'del') {
        this.sureView(this.delApiSet, null, this.form.apiSet.name)
      }
    },
    initApiSetData() {
      //  打开窗口时，初始化模块窗口数据
      this.apiSetData.name = '';
      this.apiSetData.id = '';
      this.apiSetData.num = '';
      this.apiSetData.viewStatus = true;
    },
    stickApiSet() {
      //  置顶模块
      this.$axios.post(this.$api.stickApiSetApi, {
        'id': this.form.apiSet.id,
        'projectId': this.form.projectId,
      }).then((response) => {
            this.messageShow(this, response);
            this.findApiSet();
          }
      )
    },
    editApiSet() {
      //  编辑模块

      if (!this.form.apiSet) {
        this.$message({
          showClose: true,
          message: '请先创建接口模块',
          type: 'warning',
        });
        return
      }
      this.apiSetData.name = this.form.apiSet.name;
      this.apiSetData.id = this.form.apiSet.id;
      this.apiSetData.num = this.form.apiSet.num;
      this.apiSetData.viewStatus = true;
    },
    delApiSet() {
      //  删除模块
      this.$axios.post(this.$api.delApiSetApi, {'id': this.form.apiSet.id}).then((response) => {
            this.messageShow(this, response);
            this.apiSetData.name = '';
            if ((this.apiSetPage.currentPage - 1) * this.apiSetPage.sizePage + 1 === this.apiSetPage.total) {
              this.apiSetPage.currentPage = this.apiSetPage.currentPage - 1
            }
            this.findApiSet();
          }
      )
    },
  },
  computed: {
    monitorProjectId() {
      return this.form.projectId;
    },
  },
  watch: {
    monitorProjectId() {
      this.findApiSet();
    },
  },
  mounted() {
  },
}
</script>

<style scoped>

</style>
