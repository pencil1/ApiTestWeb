<template>
  <el-drawer
      title="mock接口编辑"
      size="90%"
      :visible.sync="showStatus"
      direction="btt"
      @close="$emit('findMockApi')"
  >
    <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215)"/>
    <el-form>
      <el-form-item>
        <el-input placeholder="Enter request URL"
                  v-model="mockData.url"
                  class="input-with-select"
                  style="width: 75%;margin-left: 10px">
          <el-select v-model="mockData.method"
                     size="medium"
                     style="width: 130px"
                     slot="prepend"
                     placeholder="选择请求方式">
            <el-option v-for="item in methods"
                       :key="item"
                       :value="item"
                       :label="item">
            </el-option>
          </el-select>
        </el-input>
        <el-input v-model="mockData.name" placeholder="请输入mock接口名称" style="width: 15%;margin-left: 5px">
        </el-input>
        <el-button type="primary" @click.native="addMockApi()" size="medium" style="margin-left: 5px">保存</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" style="margin: 10px">
      <el-tab-pane
          :key="item.name"
          v-for="(item, index) in this.mockData.paramBody"
          :label="item.title"
          :name="item.name"
      >
        <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px">
          <el-radio-group v-model="radioChoice">
            <el-radio label="param">param</el-radio>
            <el-radio label="body">body</el-radio>
            <el-radio label="func">func</el-radio>
          </el-radio-group>
          <el-button type="primary" size="mini"
                     v-if="radioChoice !== 'func' "
                     style="margin-left:20px"
                     @click="formatData(index)">格式化

          </el-button>
        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215)"/>
        <aceEditor
            v-show="radioChoice !=='func'"
            style="font-size: 15px"
            v-model="item[radioChoice]"
            @init="editorInit"
            lang="json"
            theme="chrome"
            width="100%"
            :height=$store.state.tableHeight-70
            :options="{}"
        >
        </aceEditor>
        <aceEditor
            v-show="radioChoice ==='func'"
            style="font-size: 15px"
            v-model="mockData.func"
            @init="editorInit2"
            lang="python"
            theme="monokai"
            width="100%"
            :height=$store.state.tableHeight-70
            :options="{}"
        >
        </aceEditor>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>

export default {
  name: "mockEditView",
  props: ['projectId'],
  data() {
    return {
      showStatus: false,
      radioChoice: 'param',
      editorData: '',
      methods: ['POST', 'GET', 'PUT', 'DELETE'],
      mockData: {
        id: '',
        name: '',
        method: '',
        url: '',
        paramBody: '',
        func: ''
      },
      editableTabsValue: '1',
      tabIndex: 1
    }
  },
  methods: {

    editCopyData(mockId, status) {
      this.$axios.post(this.$api.editMockApi, {
        'mockId': mockId,
        // 'projectId': this.form.projectId,
        // 'mockName': this.form.mockName,
        // 'url': this.form.url,
        // 'sizePage': this.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.showStatus = true
              this.mockData.name = response.data.data.name
              this.mockData.method = response.data.data.method
              this.mockData.url = response.data.data.url
              this.mockData.paramBody = response.data.data.param_body
              this.mockData.func = response.data.data.func
              this.editableTabsValue = this.mockData.paramBody[0].name
              // console.log(status)
              // console.log(response.data.data.id)
              if (status === 'edit') {
                this.mockData.id = response.data.data.id
              } else {
                this.mockData.id = ''
              }
            }
          }
      )

    },
    initData() {
      this.showStatus = true
      this.mockData = {
        id: '',
        name: '',
        method: '',
        url: '',
        paramBody: [{
          title: '参数1',
          name: '1',
          param: '',
          body: '',
        }],
        func: ''
      }
      this.editableTabsValue = '1'
      this.tabIndex = 1
    },
    async addMockApi() {
      await this.$axios.post(this.$api.addMockApiApi, {
        'id': this.mockData.id,
        'name': this.mockData.name,
        'method': this.mockData.method,
        'url': this.mockData.url,
        'paramBody': this.mockData.paramBody,
        'func': this.mockData.func,
        'projectId': this.projectId,
      }).then((response) => {
            this.messageShow(this, response)
            if(!this.mockData.id){
              this.mockData.id = response.data.id

            }
          }
      )
    },
    formatData(index) {
      // 格式化json字符串
      try {
        this.mockData.paramBody[index][this.radioChoice] = JSON.parse(this.mockData.paramBody[index][this.radioChoice]);
        this.mockData.paramBody[index][this.radioChoice] = JSON.stringify(this.mockData.paramBody[index][this.radioChoice], null, 4);
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'json格式错误',
          type: 'warning',
        });
      }
    },
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/jsoniq');
      require('brace/theme/chrome');
      require('brace/snippets/json')
    },
    editorInit2() {
      require('brace/ext/language_tools');
      require('brace/mode/python');
      require('brace/theme/monokai');
      require('brace/snippets/python')
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.mockData.paramBody.push({
          title: '参数' + newTabName,
          name: newTabName,
          data: {
            param: '',
            body: '',
          }
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        let tabs = this.mockData.paramBody;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.mockData.paramBody = tabs.filter(tab => tab.name !== targetName);
      }
    }
  },
}
</script>

<style>
.el-drawer__header {
  margin-bottom: 2px
}
</style>