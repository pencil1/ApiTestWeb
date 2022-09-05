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
            ref="testTree"
            @node-click="treeClick"
            class="filter-tree"
            highlight-current
            node-key="id"
            :data="apiSetDataList"
            :props="defaultProps"
        >
          <span class="custom-tree-node span-ellipsis" slot-scope="{ node, data}">
                  <span :title="node.label">
                      <svg class="icon" aria-hidden="true">
                      <use :xlink:href="'#my-icon-zhaopeixun'"></use>
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
      <!--          :current-page="apiSetPage.currentPage"-->
      <!--          :page-size="30"-->
      <!--          layout="prev, pager, next"-->
      <!--          :total="apiSetPage.total">-->
      <!--      </el-pagination>-->
    </el-row>
    <el-dialog title="接口集合配置" :visible.sync="apiSetData.viewStatus" width="30%">
      <el-form label-width="80px">
        <el-form-item label="路径选择" v-show="pathStatus">
          <el-radio-group v-model="apiSetData.idChoice">
            <el-radio :label=1>根目录</el-radio>
            <el-radio :label=2>新增同级</el-radio>
            <el-radio :label=3>新增下级</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <el-form label-width="80px" :inline="true">
        <el-form-item label="模块名称">
          <el-input v-model="apiSetData.name" style="width: 120px" size="small">
          </el-input>
        </el-form-item>
        <el-form-item label="编号"
                      label-width="50px"
                      prop="num"
                      v-if="apiSetData.id"
                      style="margin-bottom: 5px">

          <el-input v-model.number="apiSetData.num"
                    placeholder="接口编号"
                    size="small"
                    style="width: 120px">
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
      apiSetDataList: [],
      pathStatus:true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // apiSetPage: {
      //   total: 1,
      //   currentPage: 1,
      //   sizePage: 30,
      // },
      apiSetData: {
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
    treeClick(data, node, el) {
      // console.log(data)
      // console.log(node)
      // console.log(el)
      //  点击节点时，初始化数据并获取对应的接口信息
      let index = this.apiSetDataList.map(item => item.id).indexOf(data['id']);  //  获取当前节点的下标
      this.form.apiSet = data;
      // this.apiMsgPage.currentPage = 1;
      this.$emit('findApiMsg', 1);
    },

    findApiSet() {
      //  查询接口模块
      this.$axios.post(this.$api.findApiSetApi, {
        'projectId': this.form.projectId,
        // 'page': this.apiSetPage.currentPage,
        // 'sizePage': this.apiSetPage.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.apiSetDataList = response.data['data'];
              // this.proAndIdData[i]['api_set_data'] = response.data['data']
              // this.apiSetPage.total = response.data['total'];
              // this.proModelData[this.form.projectId] = response.data['all_module'];
              if (this.apiSetDataList) {
                for (let i = 0; i < this.proAndIdData.length; i++) {
                  if (this.proAndIdData[i]['id'] === this.form.projectId) {
                    this.proAndIdData[i]['api_set_data'] = response.data['data']
                  }
                }
                this.form.apiSet = this.apiSetDataList[0];
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

      let higherId
      if (this.apiSetData.idChoice === 1) {
        higherId = 0
      } else if (this.apiSetData.idChoice === 2) {
        higherId = this.form.apiSet.higherId
      } else {
        higherId = this.form.apiSet.id
      }
      this.$axios.post(this.$api.addApiSetApi, {
        'projectId': this.form.projectId,
        'name': this.apiSetData.name,
        'id': this.apiSetData.id,
        'num': this.apiSetData.num,
        'higherId': higherId,
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
        setTimeout(() => {
          this.editApiSet()
        }, 100);

      } else if (command === 'stick') {
        this.stickApiSet()
      } else if (command === 'del') {
        setTimeout(() => {
          this.sureView(this.delApiSet, null, this.form.apiSet.name)
        }, 100);

      }
    },
    initApiSetData() {
      //  打开窗口时，初始化模块窗口数据
      this.pathStatus = true;
      this.apiSetData.name = '';
      this.apiSetData.higherId = '';
      if (!this.apiSetDataList) {
        this.apiSetData.idChoice = 1
      } else if (this.form.apiSet.id) {
        this.apiSetData.idChoice = 2;
        // this.apiSetData.higherId = this.form.apiSet.higherId;
      } else {
        this.apiSetData.idChoice = 1;
        // this.apiSetData.higherId = 0;
      }
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
      this.pathStatus = false
      this.apiSetData.idChoice = 2
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
            if (this.messageShow(this, response)) {
              this.apiSetData.name = '';
              this.findApiSet();
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
      this.findApiSet();
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
