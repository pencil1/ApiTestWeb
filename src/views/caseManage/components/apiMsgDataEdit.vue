<template>
  <!--    <div class="apiMsgDataEdit"-->
  <!--         v-loading="!paramVisible"-->
  <!--         element-loading-text="左侧列表数据发生变化，请点击配置按钮重新配置"-->
  <!--         element-loading-spinner="my-icon-2"-->
  <!--         >-->
  <el-dialog :title="apiCaseData.name"
             :visible.sync="paramVisible"
             width="80%">
    <!--        <span v-show="!paramVisible" style="color: red;margin-top: 20px">请点击左侧配置按钮加载信息</span>-->

    <el-button-group style="margin-top:15px;float: right;position:relative;z-index:999">
      <el-button type="warning" size="mini"
                 @click.native="$emit('debugStep', stepNum)">调试
      </el-button>
      <el-button type="primary" size="mini"
                 @click.native="$store.state.showResultStatus=true">查看最近结果
      </el-button>
    </el-button-group>
    <el-tabs type="card" style="margin-top: 10px">
      <el-tab-pane label="基础信息" style="margin-top: 10px">
        <el-form>
          <el-form-item label="接口地址" prop="url" label-width="120px">
            <el-input v-model="apiCaseData.url" disabled>
            </el-input>

          </el-form-item>
          <el-form-item label="步骤名称" prop="name" label-width="120px">
            <el-input v-model="apiCaseData.name">
            </el-input>
          </el-form-item>
          <el-form-item label="set_up_hooks" label-width="120px">
            <el-input v-model="apiCaseData.up_func">
            </el-input>
          </el-form-item>
          <el-form-item label="set_down_hook" label-width="120px">
            <el-input v-model="apiCaseData.down_func">
            </el-input>
          </el-form-item>

          <el-form-item label="跳过判断" label-width="120px">
            <el-input v-model="apiCaseData.skip">
            </el-input>
          </el-form-item>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Headers" style="margin-top: 10px">
        <el-card shadow="hover"
                 :body-style=styleCard
        >

          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.header[0]"
              inactive-text="启动功能">
          </el-switch>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.header[1]"
              inactive-text="启动新参数">
          </el-switch>

        </el-card>
        <auto-table
            :tableData="apiCaseData.header"
            kind="header"
        ></auto-table>
      </el-tab-pane>
      <el-tab-pane label="Params" style="margin-top: 10px">
        <el-card shadow="hover"
                 :body-style=styleCard
        >
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.param[0]"
              inactive-text="启动功能">
          </el-switch>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.param[1]"
              inactive-text="启动新参数">
          </el-switch>
        </el-card>
        <auto-table
            :tableData="apiCaseData.param"
            kind="header"
        ></auto-table>
      </el-tab-pane>
      <el-tab-pane label="Body" style="margin-top: 10px" :disabled="apiCaseData.method === 'GET'">
        <el-card shadow="hover"
                 :body-style=styleCard
        >
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.variable[0]"
              inactive-text="启动功能">
          </el-switch>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.variable[1]"
              inactive-text="启动新参数">
          </el-switch>
          <el-button type="primary" size="mini"
                     v-if="form.variable_type === 'json' "
                     style="margin-left:20px"
                     @click="formatData()">格式化

          </el-button>
          <el-popover
              v-if="form.variable_type === 'data' "
              placement="right"
              width="400"
              @hide="loadFormData()"
              @show="textarea2=null"
              trigger="click">
            <el-input
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 20}"
                placeholder="key:value"
                v-model="textarea2">
            </el-input>
            <el-button type="primary" size="mini"
                       slot="reference"
                       style="margin-left:20px">Bulk Edit

            </el-button>
          </el-popover>
          <el-button type="primary" size="mini"
                     v-if="form.variable_type === 'data' "
                     style="margin-left:20px"
                     @click="clearVariable()">clear

          </el-button>
        </el-card>
        <div v-if="form.variable_type.toString() === 'json'">
          <div style="margin: 0 0 15px;">
          </div>
          <div
              style="border-style:solid;border-width: 1px;border-color: rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234)">
            <el-container>
              <aceEditor
                  style="font-size: 15px"
                  v-model="apiCaseData.json_variable"
                  @init="editorInit"
                  lang="json"
                  theme="chrome"
                  width="100%"
                  height="500px"
                  :options="{
                             }"
              >
              </aceEditor>
            </el-container>
          </div>
        </div>
        <auto-table v-if="form.variable_type === 'data' || form.variable_type === 'text'"
                    :tableData="apiCaseData.variable"
                    kind="variable"
                    :lineFeed="true"
        ></auto-table>
      </el-tab-pane>
      <el-tab-pane label="提取" style="margin-top: 10px">
        <el-card shadow="hover"
                 :body-style=styleCard>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.extract[0]"
              inactive-text="启动功能">
          </el-switch>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.extract[1]"
              inactive-text="启动新参数">
          </el-switch>
        </el-card>
        <auto-table
            :tableData="apiCaseData.extract"
        ></auto-table>

      </el-tab-pane>
      <el-tab-pane label="断言" style="margin-top: 10px">
        <el-card shadow="hover"
                 :body-style=styleCard>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.validate[0]"
              inactive-text="启动功能">
          </el-switch>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.validate[1]"
              inactive-text="启动新参数">
          </el-switch>
        </el-card>
        <auto-table
            :tableData="apiCaseData.validate"
            kind="assert"
        ></auto-table>
      </el-tab-pane>
      <el-tab-pane label="参数化" style="margin-top: 10px">
        <el-card shadow="hover"
                 :body-style=styleCard>
          <el-switch
              style="margin-left: 10px"
              v-model="apiCaseData.statusCase.parameters"
              inactive-text="启动功能">
          </el-switch>
        </el-card>
        <div
            style="border-style:solid;border-width: 1px;border-color: rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234) rgb(234, 234, 234)">
          <el-container>
            <aceEditor
                style="font-size: 15px"
                v-model="apiCaseData.parameters"
                @init="editorInit"
                lang="json"
                theme="chrome"
                width="100%"
                height="500px"
                :options="{
                         enableSnippets:true,
                         enableBasicAutocompletion: true,
                         enableLiveAutocompletion: true
                         }"
            >
            </aceEditor>
          </el-container>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!--        <div slot="footer" class="dialog-footer" style="margin-top: 5px">-->
    <!--            <el-button @click="initData(tempNum)" size="mini">还 原</el-button>-->
    <!--            <el-button type="primary"-->
    <!--                       @click="sureConfigBtn()" size="mini">保 存-->
    <!--            </el-button>-->
    <!--            <el-tooltip style="margin-left: 10px" content="ps:信息修改后，记得点击保存哦(右下角的保存按钮不保存当前步骤信息)">-->
    <!--                <div class="my-icon-cuowu"></div>-->
    <!--            </el-tooltip>-->
    <!--        </div>-->

    <!--    </div>-->
  </el-dialog>

</template>

<script>

export default {
  components: {},
  name: 'apiMsgDataEdit',
  props: ['apiCases'],
  data() {
    return {
      styleCard: {
        'padding': '5px'
      },
      test: '',
      textarea2: '',
      stepNum:'',
      paramVisible: false,
      form: {
        choiceTypeStatus: false,
        variable_type: 'data',
      },
      apiCaseData: {
        name: '',
        time: '',
        up_func: '',
        down_func: '',
        skip: '',
        url: '',
        // method:'GET',
        statusCase: {variable: [], extract: [], validate: [], param: [], header: [], parameters: 0},
        variable: [{key: '', value: '', param_type: '', remark: ''}],
        json_variable: '',
        extract: [{key: '', value: ''}],
        validate: [{key: '', value: '', comparator: ''}],
        param: [{key: '', value: '', remark: ''}],
        header: [{key: '', value: '', remark: ''}],
        parameters: '',
      },
    }
  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/json');
      require('brace/theme/chrome');
      require('brace/snippets/json')
    },
    loadFormData() {
      // const items = (|| window.clipboardData );
      let arrayList = this.textarea2.split('\n')
      for (let i = 0; i < arrayList.length; i++) {
        let oneData = arrayList[i].split(':')
        if (oneData[0]) {
          this.apiCaseData.variable.push({
            key: oneData.shift().trim(),
            param_type: 'string',
            value: oneData.join(':').trim(),
            remark: null
          })
        }
      }
      this.textarea2 = ''
    },
    clearVariable() {
      this.apiCaseData.variable = [{key: '', param_type: 'string', value: '', remark: null}]
    },
    formatData() {
      // 格式化json字符串
      try {

        this.apiCaseData.json_variable = JSON.parse(this.apiCaseData.json_variable);
        this.apiCaseData.json_variable = JSON.stringify(this.apiCaseData.json_variable, null, 4);

      } catch (err) {
        this.$message({
          showClose: true,
          message: 'json格式错误',
          type: 'warning',
        });
      }
    },
    initData(i,num) {
      //  初始化步骤数据
      this.apiCaseData = i;
      this.stepNum = num
      this.form.variable_type = i['variableType'];
      this.paramVisible = true;
      this.form.choiceTypeStatus = this.form.variable_type === 'json';
    },
  },
  mounted() {
  },
}
</script>
<style>
.cm-s-default .cm-property {
  color: rgb(183, 40, 135);
  /*color: rgb(137, 21, 99);*/
}

.cm-s-default .cm-string {
  /*color: rgb(116,88,255);*/
  color: rgb(71, 35, 255);
}

.cm-s-default .cm-atom {
  color: #000000;
}
</style>
