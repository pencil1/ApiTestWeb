<template>
  <div class="buildInFunc">
    <el-form :inline="true" class="demo-form-inline search-style" size="small">


      <el-form-item label="函数名" labelWidth="80px">
        <el-autocomplete
            class="inline-input"
            v-model="funcName"
            :fetch-suggestions="querySearch1"
            style="width: 300px"
            placeholder="输入格式：${func(abc,123)}"
        ></el-autocomplete>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="checkFunc()" size="small">调试</el-button>
        <el-button @click="drawer = true" type="small" style="margin-left: 16px;">
          全屏函数
        </el-button>
<!--        <el-button type="primary" @click.native="checkFunc()" size="small">保存</el-button>-->
      </el-form-item>

    </el-form>
    <el-row>
      <el-col :span="5">

        <funcList
            ref="apiListRef"
            @getTestCaseFile="getTestCaseFile"
            @saveTestCaseFile="saveTestCaseFile"
        ></funcList>
      </el-col>
      <el-col :span="14"
              style="border:3px solid rgb(189, 189, 189)">
        <el-container>
          <aceEditor
              style="font-size: 15px"
              v-model="funcData"
              @init="editorInit"
              lang="python"
              theme="monokai"
              width="100%"
              :height=this.$store.state.tableHeight+65
              :options="{
                         enableSnippets:true,
                         enableBasicAutocompletion: true,
                         enableLiveAutocompletion: true
                         }"
          >
          </aceEditor>
        </el-container>
      </el-col>
      <!--      <el-col :span="5" style="padding-left:10px;background-color: rgb(234, 234, 234);height:761px">-->
      <el-col :span="5" :style="{
          height:this.$store.state.tableHeight+69+'px',
          backgroundColor:'#eaeaea'
        }">
        <div style="font-weight: 700;color: gray;font-size:14px;margin-top: 2px;">
          测试结果：
        </div>
        <pre style="white-space: pre-wrap;word-wrap: break-word;padding-left:10px;">{{ this.result }}</pre>
      </el-col>
    </el-row>
    <el-drawer
        title=""
        :visible.sync="drawer"
        size="95%"
        direction="btt"
        :with-header="false">
      <aceEditor
          style="font-size: 15px"
          v-model="funcData"
          @init="editorInit"
          lang="python"
          theme="monokai"
          width="100%"
          :height=this.$store.state.tableHeight+195
          :options="{
                         enableSnippets:true,
                         enableBasicAutocompletion: true,
                         enableLiveAutocompletion: true
                         }"
      >
      </aceEditor>
    </el-drawer>
  </div>
</template>

<script>
import funcList from './funcList.vue'

export default {
  components: {
    funcList,
  },
  name: 'buildInFunc',
  data() {
    return {
      style1: {},
      drawer: false,
      funcName: '',
      funcData: '',
      result: '',
      restaurants: [{"value": "${func(abc,123)}"}],
      tempTestCaseFileData: {
        name: null,
        viewStatus: false,
        id: null,
        higherId: 0,
        status: 0,
      },
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
    getTestCaseFile(ids) {
      this.$axios.post(this.$api.getFuncFileApi, {'id': ids}).then((response) => {
            if (this.messageShow(this, response)) {
              this.funcData = response.data.func_data;
            }
          }
      )
    },
    async saveTestCaseFile() {
      // console.log(this.$refs.apiListRef.tempTestCaseFileData.id)
      await this.$axios.post(this.$api.saveFuncFileApi, {
        'ids': this.$refs.apiListRef.tempTestCaseFileData.id,
        'data': this.funcData
      }).then((response) => {
            this.messageShow(this, response)

          }
      )
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
    async checkFunc() {

      await this.saveTestCaseFile()
      const response = await this.$axios.post(this.$api.checkFuncFileApi, {
        'funcFileName': this.$refs.apiListRef.tempTestCaseFileData.name,
        'funcName': this.funcName,
      })
      // this.messageShow(this, response);
      this.result = response['data']['result'];
    },
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/python');
      require('brace/theme/monokai');
      require('brace/snippets/python')
    },
  },
  mounted() {

  },
}
</script>

<style>


</style>
