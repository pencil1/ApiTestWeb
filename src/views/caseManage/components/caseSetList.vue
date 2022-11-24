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
<!--            <el-dropdown-item command="stick">置顶</el-dropdown-item>-->
            <el-dropdown-item command="del">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <el-scrollbar :wrapStyle="{
              height: this.$store.state.tableHeight+'px'
            }">
        <el-tree
            ref="testTree2"
            @node-click="treeClick"
            class="filter-tree"
            highlight-current
            node-key="id"
            :data="caseSetDataList"
            :props="defaultProps"
        >
          <span class="custom-tree-node span-ellipsis" slot-scope="{ node, data}">
            <span :title="node.label">
                      <svg class="icon" aria-hidden="true">
                      <use :xlink:href="'#my-icon-zhaoxuqiu'"></use>
                              </svg>
                      {{ node.label }}
                  </span>
                  <span>
<!--                    <el-button-group v-show="true">-->
                      <el-button-group class="child">
                      <el-button
                          style="margin-right: -10px"
                          type="text"
                          size="mini"
                          icon="el-icon-edit"
                          @click.native="moduleCommand('edit')"
                      >
                      </el-button>
                        <el-button
                            style="margin-right: -10px"
                            type="text"
                            size="mini"
                            icon="el-icon-circle-plus-outline"
                            @click.native="moduleCommand('add')"
                        >
                      </el-button>
                      <el-button
                          type="text"
                          size="mini"
                          icon="el-icon-delete"
                          @click.native="moduleCommand('del')"
                      >
                      </el-button>
                  </el-button-group>
                  </span>
                </span>
        </el-tree>
      </el-scrollbar>
      <!--      <el-pagination-->
      <!--          small-->
      <!--          @current-change="handleModuleCurrentChange"-->
      <!--          :current-page="caseSetPage.currentPage"-->
      <!--          :page-size="30"-->
      <!--          layout="prev, pager, next"-->
      <!--          :total="caseSetPage.total">-->
      <!--      </el-pagination>-->
    </el-row>
    <el-dialog title="用例集合配置" :visible.sync="caseSetData.viewStatus" width="30%">
      <el-form label-width="80px" v-if="!caseSetData.id">
        <el-form-item label="路径选择"  v-show="pathStatus">
          <el-radio-group v-model="caseSetData.idChoice">
            <el-radio :label=1>根目录</el-radio>
            <el-radio :label=2>新增同级</el-radio>
            <el-radio :label=3>新增下级</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <el-form label-width="80px" :inline="true">
        <el-form-item label="模块名称">
          <el-input v-model="caseSetData.name" style="width: 120px" size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="编号"
                      label-width="50px"
                      prop="num"
                      v-if="caseSetData.id"
                      style="margin-bottom: 5px">

          <el-input v-model.number="caseSetData.num"
                    placeholder="接口编号"
                    size="small"
                    style="width: 120px">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="caseSetData.viewStatus = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="addCaseSet()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "caseSet",
  props: ['form', 'proAndIdData'],
  data() {
    return {
      caseSetDataList: [],
      pathStatus:true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // caseSetPage: {
      //   total: 1,
      //   currentPage: 1,
      //   sizePage: 30,
      // },
      caseSetData: {
        higherId: 0,
        idChoice: 1,
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
      let index = this.caseSetDataList.map(item => item.id).indexOf(data['id']);  //  获取当前节点的下标
      this.form.caseSet = data;
      // this.apiMsgPage.currentPage = 1;
      this.$emit('findCase', true);
    },
    findCaseSet() {
      //  查询接口模块
      this.$axios.post(this.$api.findCaseSetApi, {
        'projectId': this.form.projectId,
        // 'page': this.caseSetPage.currentPage,
        // 'sizePage': this.caseSetPage.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.caseSetDataList = response.data['data'];
              if (this.caseSetDataList) {
                for (let i = 0; i < this.proAndIdData.length; i++) {
                  if (this.proAndIdData[i]['id'] === this.form.projectId) {
                    this.proAndIdData[i]['case_set_data'] = response.data['data']
                  }
                }
                this.form.caseSet = this.caseSetDataList[0];
                this.$nextTick(function () {
                  this.$refs.testTree2.setCurrentKey(this.form.caseSet.id);  //"vuetree"是你自己在树形控件上设置的 ref="vuetree" 的名称
                });
                this.$emit('findCase');
                // this.findApiMsg();
              }


            }
          }
      )
    },
    addCaseSet() {
      //  添加模块
      let higherId
      if (this.caseSetData.idChoice === 1) {
        higherId = 0
      } else if (this.caseSetData.idChoice === 2) {
        higherId = this.form.caseSet.higherId
      } else {
        higherId = this.form.caseSet.id
      }
      this.$axios.post(this.$api.addCaseSetApi, {
        'projectId': this.form.projectId,
        'name': this.caseSetData.name,
        'id': this.caseSetData.id,
        'num': this.caseSetData.num,
        'higherId': higherId,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.caseSetData.viewStatus = false;
              this.findCaseSet();
            }
          }
      )
    },
    moduleCommand(command) {
      //  模块处理函数，根据命令执行不同操作
      if (command === 'add') {
        this.initCaseSetData()
      } else if (command === 'edit') {
        setTimeout(() => { this.editCaseSet() }, 100);

      } else if (command === 'stick') {
        this.stickcaseSet()
      } else if (command === 'del') {
        setTimeout(() => {  this.sureView(this.delCaseSet, null, this.form.caseSet.name) }, 100);

      }
    },
    initCaseSetData() {
      //  打开窗口时，初始化模块窗口数据
      this.pathStatus = true;
      this.caseSetData.name = '';
      this.caseSetData.higherId = '';
       if(!this.caseSetDataList){
        this.caseSetData.idChoice = 1
      }
      else if (this.form.caseSet.id) {
        this.caseSetData.idChoice = 2;
        // this.caseSetData.higherId = this.form.caseSet.higherId;
      } else {
        this.caseSetData.idChoice = 1;
        // this.caseSetData.higherId = 0;
      }
      this.caseSetData.id = '';
      this.caseSetData.num = '';
      this.caseSetData.viewStatus = true;
    },
    stickCaseSet() {
      //  置顶模块
      this.$axios.post(this.$api.stickcaseSetApi, {
        'id': this.form.caseSet.id,
        'projectId': this.form.projectId,
      }).then((response) => {
            this.messageShow(this, response);
            this.findCaseSet();
          }
      )
    },
    editCaseSet() {
      //  编辑模块
      this.pathStatus = false
        this.caseSetData.idChoice = 2
        if (!this.form.caseSet) {
          this.$message({
            showClose: true,
            message: '请先创建接口模块',
            type: 'warning',
          });
          return
        }
        this.caseSetData.name = this.form.caseSet.name;
        this.caseSetData.id = this.form.caseSet.id;
        this.caseSetData.num = this.form.caseSet.num;
        this.caseSetData.viewStatus = true;



    },
    delCaseSet() {
      //  删除模块
         this.$axios.post(this.$api.delCaseSetApi, {'id': this.form.caseSet.id}).then((response) => {
            if(this.messageShow(this, response)){
              this.caseSetData.name = '';
            this.findCaseSet();
            }

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
      this.findCaseSet();
    },
  },
  mounted() {
  },
}
</script>

<style lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 3px;
}

.child {
  display: none
}

.el-tree-node__content:hover {
  .child {
    display: block
  }
}
</style>
