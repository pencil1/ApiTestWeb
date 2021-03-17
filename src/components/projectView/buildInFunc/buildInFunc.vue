<template>
  <div class="buildInFunc">
    <!--        <svg class="icon" aria-hidden="true">-->
    <!--            <use xlink:href="#my-icon-wenjianjia"></use>-->
    <!--        </svg>-->
    <el-form :inline="true" class="demo-form-inline search-style" size="small">


      <el-form-item label="函数名" labelWidth="80px">
        <el-autocomplete
            class="inline-input"
            v-model="funcName"
            :fetch-suggestions="querySearch1"
            placeholder="输入格式：${func(abc,123)}"
        ></el-autocomplete>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="checkFunc()" size="small">调试</el-button>
<!--        <el-button type="primary" @click.native="formatData()" size="small">测试</el-button>-->
      </el-form-item>

    </el-form>
    <el-row>
      <el-col :span="5"
      >
        <div>

          <el-card class="box-card"
                   :body-style="{ padding: '10px' }" shadow="always">
            <el-button-group style="float: right;">
              <el-button type="primary" size="mini" @click.native="initTestCaseFile()">新增</el-button>
              <el-button type="primary" size="mini" @click.native="initEditTestCaseFile()">编辑</el-button>
              <el-button type="primary" size="mini" @click.native="saveTestCaseFile()"
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
            <el-scrollbar wrapStyle="height:719px;">


              <el-tree :data="treeData"
                       :props="defaultProps"
                       @node-click="handleNodeClick"
                       highlight-current
                       v-loading="this.loading"

              >
                            <span class="custom-tree-node span-ellipsis" slot-scope="{ node, data }">
                            <span :title="node.label">
<!--                                <i :class=" data.status === 0? 'el-icon-folder' :  'el-icon-document'"></i>-->
                                <svg class="icon" aria-hidden="true">
                                    <use :xlink:href="data.status? '#my-icon-wenjian1':'#my-icon-wenjianjia'"></use>
                                </svg>
                              <!--                                <i :class=" data.status === 0? 'el-icon-folder' :  'el-icon-document'"></i>-->

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
              <el-radio :label=1>新增同级</el-radio>
              <el-radio :label=2>新增下级</el-radio>
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
      </el-col>
      <el-col :span="14"
              style="border:3px solid rgb(189, 189, 189)">
        <el-container>
          <editor
              style="font-size: 15px"
              v-model="funcData"
              @init="editorInit"
              lang="python"
              theme="monokai"
              width="100%"
              height="756px"
              :options="{
                                 enableSnippets:true,
                                 enableBasicAutocompletion: true,
                                 enableLiveAutocompletion: true
                             }"
          >
          </editor>
        </el-container>
        <!--<codemirror v-model="funcData"-->
        <!--:options="options"-->
        <!--height="810px">-->
        <!--</codemirror>-->
      </el-col>
      <el-col :span="5" style="padding-left:10px;background-color: rgb(234, 234, 234);height:761px ">
        <div style="font-weight: 700;color: gray;font-size:14px;margin-top: 2px;">
          测试结果：
        </div>
        <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{ this.result }}
                </pre>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  components: {
    editor: require('vue2-ace-editor'),
  },
  name: 'buildInFunc',
  data() {
    return {
      loading: false,
      funcName: '',
      funcData: '',
      comparator: '',
      comparators: [],
      result: '',
      restaurants: [{"value": "${func(abc,123)}"}],
      privates: true,
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
        idChoice: 1,
        num: null,
      },
      tempTreeData: {
        data: Object,
        node: Object,
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    querySearch1(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    initTestCaseFile() {
      this.addTestCaseFileData.status = 0;
      this.addTestCaseFileData.idChoice = 1;
      this.addTestCaseFileData.id = null;
      this.addTestCaseFileData.name = null;
      this.tempTestCaseFileData.viewStatus = true

    },
    initEditTestCaseFile() {
      this.addTestCaseFileData = this.tempTestCaseFileData;
      this.tempTestCaseFileData.viewStatus = true

    },
    privatesTestCaseFile(status) {
      this.privates = status;
      this.findTestCaseFile()


    },
    getTestCaseFile(ids) {
      this.$axios.post(this.$api.getFuncFileApi, {'id': ids}).then((response) => {
            if (this.messageShow(this, response)) {
              this.funcData = response.data.func_data;
              // this.$eventBus.$emit('getTestCaseFileData', true)
            }
          }
      )
    },
    saveTestCaseFile() {

      this.$axios.post(this.$api.saveFuncFileApi, {
        'ids': this.tempTestCaseFileData.id,
        'data': this.funcData
      }).then((response) => {
            this.messageShow(this, response)

          }
      )
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

            // this.form.configName = null;
            // if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
            //     this.currentPage = this.currentPage - 1
            // }
            // this.findConfig();
          }
      )
    },
    addTestCaseFile() {
      //  添加文件

      if (this.addTestCaseFileData.idChoice === 1) {
        this.addTestCaseFileData.higherId = this.tempTestCaseFileData.higherId
      } else if (this.addTestCaseFileData.idChoice === 2) {
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
              this.tempTestCaseFileData.viewStatus = false;
              if (this.addTestCaseFileData.id) {
                this.tempTreeData.data.name = this.addTestCaseFileData.name
              } else {
                if (this.addTestCaseFileData.idChoice === 1) {
                  const newChild = {
                    name: this.addTestCaseFileData.name,
                    children: [],
                    status: this.addTestCaseFileData.status,
                    'higher_id': response.data.higher_id,
                    'id': response.data.id,
                  };
                  if (response.data.higher_id === 0) {
                    this.treeData.push(newChild);
                  } else {

                    this.tempTreeData.node.parent.data.children.push(newChild);
                  }


                } else if (this.addTestCaseFileData.idChoice === 2) {
                  const newChild = {
                    name: this.addTestCaseFileData.name,
                    children: [],
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


              // this.initBaseData();
            }

          }
      )
    },

    handleNodeClick(data, node) {

      if (this.tempTestCaseFileData.status === 1) {

        this.saveTestCaseFile();
      }
      if (this.tempTestCaseFileData.id !== data.id){
        // id不相等时，重新请求文件内容
        this.tempTreeData.data = data;
        this.tempTreeData.node = node;

        this.tempTestCaseFileData.id = data.id;
        this.tempTestCaseFileData.higherId = data.higher_id;
        this.tempTestCaseFileData.name = data.name;
        this.tempTestCaseFileData.num = data.num;
        this.tempTestCaseFileData.status = data.status;

        if (data.status === 1) {
          this.getTestCaseFile(data.id)
        } else {
          this.funcData = ''
        }
      }

      // setTimeout("",5000);

    },

    findTestCaseFile() {

      this.$axios.post(this.$api.findFuncFileApi, {'privates': this.privates}).then((response) => {
            if (response.data['status'] === 0) {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'warning',
              });
            } else {
              this.treeData = response.data['data'];

            }
          }
      )
    },

    getFuncData: function (data) {
      // childValue就是子组件传过来的值
      this.funcData = data
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb(this.comparators);
    },
    formatData() {
      // 格式化json字符串
      try {
        this.funcData = JSON.parse(this.funcData);
        this.funcData = JSON.stringify(this.funcData, null, 4);
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'json格式错误',
          type: 'warning',
        });
      }
    },
    checkFunc() {
      this.$axios.post(this.$api.saveFuncFileApi, {
        'ids': this.tempTestCaseFileData.id,
        'data': this.funcData
      }).then(() => {
            this.$axios.post(this.$api.checkFuncFileApi, {
              'funcFileName': this.tempTestCaseFileData.name,
              'funcName': this.funcName,
            }).then((response) => {
                  this.messageShow(this, response);
                  this.result = response['data']['result'];
                  // this.messageShow(this, response);
                }
            )
          }
      )
    },
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/python');
      require('brace/theme/monokai');
      require('brace/snippets/python')
    },

  },
  mounted() {

    this.findTestCaseFile();
  },
}
</script>

<style>


</style>
