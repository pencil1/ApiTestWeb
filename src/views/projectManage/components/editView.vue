<template>

  <el-dialog title="项目配置" :visible.sync="form.showView" width="40%"
             :modal-append-to-body="false"
             :append-to-body="false"
             :close-on-click-modal="false"
  >
    <el-tabs>
      <el-tab-pane label="基础信息" style="margin-top: 10px">
        <el-form :inline="true">
          <el-form-item label="项目名称">
            <el-input v-model="projectData.projectName" size="mini"
                      style="width: 150px">
            </el-input>
          </el-form-item>
          <el-form-item label="编号" v-if="projectData.id">
            <el-input v-model="projectData.num" size="mini"
                      style="width: 50px">
            </el-input>
          </el-form-item>
          <el-form-item label="负责人" label-width="60px">
            <el-select v-model="form.user" multiple value-key="id" size="mini"
                       style="width: 100px">
              <el-option
                  v-for="item in userData"
                  :key="item.user_id"
                  :label="item.user_name"
                  :value="item.user_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="函数文件">
            <el-cascader
                v-model="projectData.funcFile"
                :options="this.$store.state.funcAddress"
                :props="{ expandTrigger: 'hover', label: 'name' , value: 'name' ,multiple: true }"
                multiple placeholder="请选择导入函数文件" size="small">
            </el-cascader>
<!--            <el-popover-->
<!--                placement="top-start"-->
<!--                width="200"-->
<!--                trigger="hover"-->
<!--            >-->
<!--              <el-input size="mini" placeholder="请输入环境名称" v-model="tempTitle"></el-input>-->
<!--              <el-button-->
<!--                  slot="reference"-->
<!--                  size="small"-->
<!--                  @click="addTab(tempTitle)"-->
<!--              >-->
<!--                add tab-->
<!--              </el-button>-->
<!--            </el-popover>-->
          </el-form-item>

        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -10px"/>
        <el-tabs v-model="environment.environmentChoice" type="card">
          <el-tab-pane
              :key="item.environmentChoice"
              v-for="(item, index) in environment.environmentList"
              :label="item.environmentName"
              :name="item.environmentChoice"
          >
            <urlTable
                :tableData="item.urls"
            ></urlTable>
          </el-tab-pane>
        </el-tabs>
<!--        <el-tabs v-model="environment.environmentChoice" type="card">-->
<!--          <el-tab-pane label="测试环境" name="first">-->
<!--            <urlTable-->
<!--                :tableData="environment.environmentTest"-->
<!--            ></urlTable>-->

<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="开发环境" name="second">-->
<!--            <urlTable-->
<!--                :tableData="environment.environmentDevelop"-->
<!--            ></urlTable>-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="线上环境" name="third">-->
<!--            <urlTable-->
<!--                :tableData="environment.environmentProduction"-->
<!--            ></urlTable>-->
<!--          </el-tab-pane>-->
<!--          <el-tab-pane label="备用环境" name="fourth">-->

<!--            <urlTable-->
<!--                :tableData="environment.environmentStandby"-->
<!--            ></urlTable>-->
<!--          </el-tab-pane>-->
<!--        </el-tabs>-->
      </el-tab-pane>

      <el-tab-pane label="公用变量" style="margin-top: 10px">
        <span style="margin-left: 10px">变量信息：</span>
        <el-button type="primary" size="mini" @click="addProjectVariable()">
          添加
        </el-button>
        <el-table :data="projectData.variable" stripe :show-header="false" size="mini">
          <el-table-column label="Key" header-align="center" minWidth="50">
            <template slot-scope="scope">
              <el-input v-model="scope.row.key" size="mini" placeholder="key">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="Value" header-align="center" minWidth="80">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" size="mini" placeholder="value">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" header-align="center" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="mini" placeholder="备注">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" width="90">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click.native="delProjectVariable(scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);"/>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="form.showView = false" size="small">取 消</el-button>
      <el-button type="primary" id="sure_btn"
                 @click.native="addProjectBtn()" size="small">确 定
      </el-button>
    </div>
  </el-dialog>

</template>

<script>
import urlTable from '../components/urlTable'

export default {
  props: ['environment', 'projectData', 'form', 'userData'],
  components: {
    urlTable,
  },
  data() {
    return {
      // currentEnvironmentName: '测试环境',
      // tempTitle: '',
      //
      // environmentList: [{
      //   environmentName: '测试环境',
      //   urls: [{value: null}]
      // }, {
      //   environmentName: '开发环境',
      //   urls: [{value: null}]
      // }, {
      //   environmentName: '预发布环境',
      //   urls: [{value: null}]
      // }, {
      //   environmentName: '线上环境',
      //   urls: [{value: null}]
      // },],
    }
  },
  methods: {
    addProjectBtn() {
      let test_length = this.environment.environmentList[0].urls.length;
      let currentEnvironment;
      let eIndex = parseInt(this.environment.environmentChoice)-1
      currentEnvironment = this.environment.environmentList[eIndex].urls.length;
      // console.log(test_length)
      // console.log(currentEnvironment)
      if (currentEnvironment !== test_length) {
        this.$message({
          showClose: true,
          message: '当前所选环境的url数量和测试环境不一致,会影响到接口测试',
          type: 'warning',
        });
      } else {
        // console.log(1111)
        this.$emit('addProject');
      }
    },

    addProjectVariable() {
      this.projectData.variable.push({key: null, value: null, remark: null});
    },
    delProjectVariable(i) {
      this.projectData.variable.splice(i, 1);
    },
    addProjectHeader() {
      this.projectData.header.push({key: null, value: null});
    },
    delProjectHeader(i) {
      this.projectData.header.splice(i, 1);
    },
  },
  computed: {},
  watch: {},
  mounted() {
    // this.findProject();
    // this.findFuncAddress();
  },
}
</script>
<style>
</style>
