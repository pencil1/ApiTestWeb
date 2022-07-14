<template>
  <div>

    <el-card class="box-card"
             :body-style="{ padding: '10px' }" shadow="always">
      <el-button-group style="float: right;">
        <el-button type="primary" size="mini" @click.native="initTestCaseFile()">新增</el-button>
        <el-button type="primary" size="mini" @click.native="initEditTestCaseFile()">编辑</el-button>
        <el-button type="primary" size="mini" @click.native="saveF()"
                   :disabled="tempTestCaseFileData.id === null || tempTestCaseFileData.status === 0">
          保存
        </el-button>
        <el-button type="primary" size="mini" @click.native="privatesTestCaseFile(true)"
                   v-show="!privates">私人
        </el-button>
        <el-button type="primary" size="mini" @click.native="privatesTestCaseFile(false)"
                   v-show="privates">所有
        </el-button>
        <el-button type="danger" size="mini"
                   @click.native="delTestCaseFileBtn">
          删除
        </el-button>
      </el-button-group>
      <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top:30px"/>
      <el-scrollbar :wrapStyle="{
              height: this.$store.state.tableHeight+10+'px'
            }">
        <el-tree :data="this.$store.state.funcAddress"
                 :props="defaultProps"
                 @node-click="handleNodeClick"
                 @check-change="handleNodeChange"
                 :highlight-current="true"
                 v-loading="this.loading">
          <!--          <span class="custom-tree-node span-ellipsis" slot-scope="{ node, data }">-->
          <!--                  <span :title="node.label">-->
          <!--                    <svg class="icon" aria-hidden="true">-->
          <!--                        <use :xlink:href="data.status? '#my-icon-wenjian1':'#my-icon-wenjianjia'"></use>-->
          <!--                    </svg>-->
          <!--                      {{ node.label }}-->
          <!--                  </span>-->
          <!--                </span>-->
          <span class="custom-tree-node span-ellipsis" slot-scope="{ node, data}">
                  <span :title="node.label">
                      <svg class="icon" aria-hidden="true">
                      <use :xlink:href="data.status? '#my-icon-wenjian1':'#my-icon-wenjianjia'"></use>
                              </svg>
                      {{ node.label }}
                  </span>
                </span>
        </el-tree>
      </el-scrollbar>
    </el-card>
    <el-dialog title="文件夹配置" :visible.sync="tempTestCaseFileData.viewStatus">
      <el-divider></el-divider>
      <el-radio-group v-model="addTestCaseFileData.status"
                      :disabled="this.addTestCaseFileData.id !== null">
        <el-radio :label=0>文件夹类</el-radio>
        <el-radio :label=1>测试文件</el-radio>
      </el-radio-group>
      <el-divider direction="vertical"></el-divider>

      <el-radio-group v-model="addTestCaseFileData.idChoice"
                      :disabled="this.addTestCaseFileData.id !== null">
        <el-radio :label=2>新增同级</el-radio>
        <el-radio :label=3>新增下级</el-radio>
      </el-radio-group>
      <el-divider></el-divider>
      <el-form>
        <el-form-item label="文件夹名称" label-width="100px">
          <el-input v-model="addTestCaseFileData.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="tempTestCaseFileData.viewStatus = false">取 消</el-button>
        <el-button type="primary" size="small" @click.native="addTestCaseFile()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      privates: true,
      loading: false,
      treeData: [],
      tempTreeData: {
        data: Object,
        node: Object,
      },
      tempTestCaseFileData: {
        name: null,
        viewStatus: false,
        id: null,
        higherId: 0,
        status: 0,
      },
      addTestCaseFileData: {
        name: null,
        id: null,
        higherId: 0,
        status: 0,
        idChoice: 2,
        num: null,
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    initTestCaseFile() {
      this.addTestCaseFileData.status = 0;
      this.addTestCaseFileData.idChoice = 2;
      this.addTestCaseFileData.id = null;
      this.addTestCaseFileData.name = null;
      this.tempTestCaseFileData.viewStatus = true

    },
    initEditTestCaseFile() {
      this.addTestCaseFileData.status = this.tempTestCaseFileData.status;
      this.addTestCaseFileData.idChoice = 2;
      this.addTestCaseFileData.id = this.tempTestCaseFileData.id;
      this.addTestCaseFileData.name = this.tempTestCaseFileData.name;
      this.addTestCaseFileData.higherId = this.tempTestCaseFileData.higherId;

      this.tempTestCaseFileData.viewStatus = true
    },
    delTestCaseFileBtn() {
      if (!this.tempTestCaseFileData.id) {
        this.$message({
          showClose: true,
          message: '请先选择右侧文件',
          type: 'warning',
        });
        return
      }
      this.sureView(this.delTestCaseFile, this.tempTestCaseFileData.id, this.tempTestCaseFileData.name)
    },
    delTestCaseFile(id) {
      this.$axios.post(this.$api.delFuncFileApi, {'id': id}).then((response) => {
            if (this.messageShow(this, response)) {
              const parent = this.tempTreeData.node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === this.tempTreeData.data.id);
              children.splice(index, 1);
              // 顺便初始化临时数据
              this.tempTestCaseFileData.status = 0;
              this.tempTestCaseFileData.idChoice = 1;
              this.tempTestCaseFileData.higherId = 0;
              this.tempTestCaseFileData.id = null;
              this.tempTestCaseFileData.name = null;
            }
          }
      )
    },
    saveF() {
      this.$emit('saveTestCaseFile');
    },
    privatesTestCaseFile(status) {
      this.privates = status;
      this.findTestCaseFile()
    },
    handleNodeChange(data, status, node) {
      console.log(data)
          console.log(status)

            console.log(node)


    },
    handleNodeClick(data, node) {
      // console.log(node)
      if (this.tempTestCaseFileData.status === 1) {
        this.$emit('saveTestCaseFile', this.tempTestCaseFileData.id);
      }
      if (this.tempTestCaseFileData.id !== data.id) {
        // id不相等时，重新请求文件内容
        this.tempTreeData.data = data;
        this.tempTreeData.node = node;
        this.tempTestCaseFileData.id = data.id;
        this.tempTestCaseFileData.higherId = data.higher_id;
        this.tempTestCaseFileData.name = data.name;
        this.tempTestCaseFileData.num = data.num;
        this.tempTestCaseFileData.status = data.status;
        if (data.status === 1) {
          this.$emit('getTestCaseFile', data.id);
          // this.getTestCaseFile(data.id)
        } else {
          this.funcData = ''
        }
      }
    },
    findTestCaseFile() {
      this.$axios.post(this.$api.findFuncFileApi, {'privates': this.privates}).then((response) => {
            if (this.messageShow(this, response)) {
              this.treeData = response.data.data;
            }
          }
      )
    },
    addTestCaseFile() {
      //  添加文件
      if (this.addTestCaseFileData.idChoice === 2) {
        this.addTestCaseFileData.higherId = this.tempTestCaseFileData.higherId
      } else if (this.addTestCaseFileData.idChoice === 3) {
        if (!this.tempTestCaseFileData.id) {
          this.$message({
            showClose: true,
            message: '请先选择右侧文件',
            type: 'warning',
          });
          return
        }
        this.addTestCaseFileData.higherId = this.tempTestCaseFileData.id
      }
      this.$axios.post(this.$api.addFuncFileApi, {
        'name': this.addTestCaseFileData.name,
        'higherId': this.addTestCaseFileData.higherId,
        'status': this.addTestCaseFileData.status,
        'id': this.addTestCaseFileData.id,
        'num': this.addTestCaseFileData.num,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              // this.$store.dispatch('GET_FUNC_DATA')
              this.tempTestCaseFileData.viewStatus = false;
              if (this.addTestCaseFileData.id) {
                this.tempTreeData.data.name = this.addTestCaseFileData.name
              } else {
                if (this.addTestCaseFileData.idChoice === 2) {

                  const newChild = {
                    name: this.addTestCaseFileData.name,
                    // children: [],
                    status: this.addTestCaseFileData.status,
                    'higher_id': response.data.higher_id,
                    'id': response.data.id,
                  };

                  if (response.data.higher_id === 0) {
                    // this.treeData.push(newChild);
                    this.$store.state.funcAddress.push(newChild)
                  } else {
                    this.tempTreeData.node.parent.data.children.push(newChild);
                  }
                } else if (this.addTestCaseFileData.idChoice === 3) {
                  const newChild = {
                    name: this.addTestCaseFileData.name,
                    // children: [],
                    status: this.addTestCaseFileData.status,
                    'higher_id': response.data.higher_id,
                    'id': response.data.id,
                  };

                  if (!this.tempTreeData.data.children) {
                    this.$set(this.tempTreeData.data, 'children', []);
                  }
                  this.tempTreeData.data.children.push(newChild);
                }
              }
            }
          }
      )
    },
  },
  mounted() {
  },
  components: {}

}
</script>
<style  lang="scss">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 3px;
}
.child{
  	display: none
  }
.el-tree-node__content:hover {
  .child {
    display: block
  }
}
</style>
