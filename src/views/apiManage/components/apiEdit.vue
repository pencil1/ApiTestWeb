<template>
  <div class="apiEdit">
    <div ref="baseMsg">
      <el-form :inline="true" style="padding: 10px 20px -10px 10px;">
        <el-form-item label="基础信息" labelWidth="80px" style="margin-bottom: 5px">
          <el-select v-model="form.projectId"
                     placeholder="请选择项目"
                     size="small"
                     @change="changeProChoice"
                     style="width: 200px;padding-right:10px">
            <el-option
                v-for="(item) in proAndIdData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-cascader
              placeholder="请选择模块"
              size="small"
              style="padding-right:10px"
              v-model="form.apiSetId"
              :options="currentApiSetList"
              :props="{
                label:'name',
                value:'id',
                checkStrictly: true,
                expandTrigger: 'hover',
                emitPath:false
              }"
          ></el-cascader>
          <el-select v-model="form.choiceUrl"
                     clearable placeholder="请选择url"
                     size="small"
          >
            <el-option
                v-for="(item, index) in proUrlData"
                :key="index"
                :label="item.value"
                :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="接口编号"
                      label-width="80px"
                      prop="num"
                      v-if="apiMsgData.id"
                      style="margin-bottom: 5px">

          <el-input v-model.number="apiMsgData.num"
                    placeholder="接口编号"
                    size="small"
                    style="width: 70px;text-align:center;">
          </el-input>
        </el-form-item>
        <el-form-item prop="name" style="margin-bottom: 5px">
          <el-input v-model="apiMsgData.name" placeholder="接口名称" size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="name" style="margin-bottom: 5px">
          <el-switch
              v-model="highStatus"
              inactive-text="高级功能">
          </el-switch>
        </el-form-item>
      </el-form>
      <el-form :inline="true" v-if="highStatus">
        <el-form-item label="高级功能" prop="name" labelWidth="80px" style="margin-bottom: 5px">

          <el-input v-model="apiMsgData.up_func" placeholder="set_up_hooks" size="small">
          </el-input>

        </el-form-item>
        <el-form-item prop="name" style="margin-bottom: 5px">
          <el-input v-model="apiMsgData.down_func" placeholder="set_down_hooks" size="small">
          </el-input>
        </el-form-item>
        <el-form-item prop="name" style="margin-bottom: 5px">
          <el-input v-model="apiMsgData.skip" placeholder="跳过判断，True跳过该请求" size="small">
          </el-input>
        </el-form-item>

      </el-form>
      <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
      <el-form style="margin: 0 0 0 10px">
        <el-form-item>
          <el-input placeholder="Enter request URL"
                    v-model="apiMsgData.url"
                    class="input-with-select"
                    style="width: 80%;margin-right: 5px">
            <el-select v-model="apiMsgData.method"
                       size="medium"
                       style="width: 100px"
                       slot="prepend"
                       placeholder="选择请求方式">
              <el-option v-for="item in methods"
                         :key="item"
                         :value="item"
                         :label="item">
              </el-option>
            </el-select>
            <el-button
                slot="append"
                type="primary"
                @click="ParamViewStatus = !ParamViewStatus">Params
            </el-button>
          </el-input>
          <el-button type="primary"
                     @click.native="saveAndRun()"
                     size="medium"
                     :loading="this.saveRunStatus">Send
          </el-button>
          <el-button type="primary" @click.native="addApiMsg()" size="medium">Save</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="apiMsgData.param"
              :row-style="{'background-color': 'rgb(250, 250, 250)'}"
              style="width:98.2%;margin-top:-20px;left: 10px;"
              size="mini"
              :show-header="false"
              v-show="this.ParamViewStatus">
      <el-table-column property="key" label="Key" header-align="center" min-width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.key" size="mini" placeholder="key">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column property="value" label="Value" header-align="center" min-width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.value"
                    size="mini" placeholder="value"
                    :id="'param_input' + scope.$index "
                    type="textarea"
                    rows=1
                    @focus="showLine('param_input', scope.$index)"
                    @input="changeLine()"
                    @blur="resetLine(scope.$index)"
                    resize="none"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column property="value" label="操作" header-align="center" width="60">
        <template slot-scope="scope">
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click.native="delTableRow(scope.$index)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-tabs style="margin: 0 0 0 10px" v-model="bodyShow">
      <el-tab-pane label="Headers" name="first">
        <auto-table
            :tableData="apiMsgData.header"
            kind="header"
        ></auto-table>

      </el-tab-pane>
      <el-tab-pane label="Body" name="second" :disabled="apiMsgData.method === 'GET'">
        <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px">
          <el-radio-group v-model="form.variable_type">
            <el-radio label="data">form-data</el-radio>
            <el-radio label="json">raw</el-radio>
            <el-radio label="text">text</el-radio>
          </el-radio-group>
          <el-button type="primary" size="mini"
                     v-if="form.variable_type === 'json' "
                     style="margin-left:20px"
                     @click="formatData()">格式化

          </el-button>
          <el-button type="primary" size="mini"
                     v-if="form.variable_type === 'json' "

                     @click="jsonRemarkStatus = !jsonRemarkStatus">{{ jsonRemarkStatus ? 'json' : '备注' }}
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
          <!-- <i class="el-icon-full-screen"></i>-->
        </el-form>
        <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);"/>

        <div v-if="form.variable_type === 'json'">
          <div style="border:1px solid rgb(234, 234, 234) ">
            <el-container>
              <aceEditor
                  v-show="!jsonRemarkStatus"
                  v-contextmenu:contextmenu
                  style="font-size: 15px"
                  v-model="apiMsgData.jsonVariable"
                  @init="editorInit"
                  lang="json"
                  theme="chrome"
                  width="100%"
                  :height=this.$store.state.tableHeight-180
                  :options="{}"
              >
              </aceEditor>
              <aceEditor
                  v-show="jsonRemarkStatus"
                  v-contextmenu:contextmenu
                  style="font-size: 15px"
                  v-model="apiMsgData.swaggerJsonVariable"
                  @init="editorInit"
                  lang="json"
                  theme="chrome"
                  width="100%"
                  :height=this.$store.state.tableHeight-180
                  :options="{}"
              >
              </aceEditor>

            </el-container>
          </div>
        </div>

        <auto-table v-if="form.variable_type === 'data' || form.variable_type === 'text'"
                    :tableData="apiMsgData.variable"
                    kind="variable"
                    :lineFeed="true"
        ></auto-table>
      </el-tab-pane>
      <el-tab-pane label="提取" name="third">
        <auto-table
            :tableData="apiMsgData.extract"
        ></auto-table>

      </el-tab-pane>
      <el-tab-pane label="断言" name="fourth">
        <auto-table
            :tableData="apiMsgData.validate"
            kind="assert"
        ></auto-table>
      </el-tab-pane>
    </el-tabs>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="handleClick">clear</v-contextmenu-item>
    </v-contextmenu>

    <!--    <result ref="resultFunc">-->
    <!--    </result>-->

    <!--    <errorView ref="errorViewFunc">-->
    <!--    </errorView>-->

  </div>
</template>

<script>
// import result from './result.vue'
// import errorView from '../common/errorView.vue'
// import json5 from 'json5'

import AutoTable from "../../../components/autoTable";

export default {
  components: {
    AutoTable,
    // editor: require('vue2-ace-editor'),
    // result: result,
    // errorView: errorView,
  },
  name: 'apiEdit',
  props: ['proAndIdData', 'projectId', 'apiSetId', 'config'],
  data() {
    return {
      picHeight: parseInt(document.documentElement.clientHeight - 400) + 'px',
      bodyShow: 'second',
      paramTypes: ['string', 'file'],
      cell: Object(),
      textarea2: '',
      highStatus: false,//高级功能按钮状态
      proUrlData: null,
      saveRunStatus: false,
      currentApiSetList: [],
      ParamViewStatus: false,
      jsonRemarkStatus: false,
      //上传文件时，记录数组下当前数据的下标，用于把返回文件路径地址赋值
      temp_num: '',
      methods: ['POST', 'GET', 'PUT', 'DELETE'],
      form: {
        projectId: null,
        configName: null,
        apiSetId: null,
        choiceUrl: 0,
        variable_type: 'data',
      },
      comparators: [
        {'value': 'equals'},
        {'value': 'less_than'},
        {'value': 'less_than_or_equals'},
        {'value': 'greater_than'},
        {'value': 'greater_than_or_equals'},
        {'value': 'not_equals'},
        {'value': 'string_equals'},
        {'value': 'length_equals'},
        {'value': 'length_greater_than'},
        {'value': 'count_greater_than_or_equals'},
        {'value': 'length_less_than'},
        {'value': 'length_less_than_or_equals'}
      ],
      apiMsgData: {
        id: null,
        project: null,
        method: 'POST',
        status_url: null,
        name: null,
        num: null,
        desc: null,
        funcAddress: null,
        up_func: null,
        down_func: null,
        skip: null,
        formLabelWidth: '80px',
        url: '',
        param: [{key: null, value: null}],
        header: Array(),
        variable: Array(),
        jsonVariable: '',
        swaggerJsonVariable: '',
        extract: Array(),
        validate: Array(),
      },
    }
  },
  methods: {
    delTableRow(i) {
      this.apiMsgData.param.splice(i, 1);
    },
    scrollbarHeight() {
      let t = this.$store.state.tableHeight;
      t = t - 200;
      return "height:" + t + "px;"
    },
    editorInit() {
      require('brace/ext/language_tools');
      require('brace/mode/jsoniq');
      require('brace/theme/chrome');
      require('brace/snippets/json')
    },
    handleClick() {
      this.apiMsgData.jsonVariable = ''
    },
    changeProChoice() {
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);  //  获取当前节点的下标
      this.currentApiSetList = this.proAndIdData[index]['api_set_data'];
      this.proUrlData = this.proAndIdData[index]['url']
      //  改变项目选项时，清空模块和基础url的选择
      this.form.apiSetId = '';
      this.form.choiceUrl = '';
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb(this.comparators);
    },
    loadFormData() {
      // const items = (|| window.clipboardData );
      let arrayList = this.textarea2.split('\n')
      for (let i = 0; i < arrayList.length; i++) {
        let oneData = arrayList[i].split(':')
        if (oneData[0]) {
          this.apiMsgData.variable.push({key: oneData[0], param_type: 'string', value: oneData[1], remark: null})
        }

      }
      // console.log(window.clipboardData)
      // mac.clipboardData
      // console.log(window.clipboardData.getData)
    },
    formatData() {
      // 格式化json字符串
      try {
        // this.apiMsgData.jsonVariable = JSON.parse(this.apiMsgData.jsonVariable);
        // this.apiMsgData.jsonVariable = JSON.stringify(this.apiMsgData.jsonVariable, null, 4);
        if (this.jsonRemarkStatus) {
          this.apiMsgData.swaggerJsonVariable = JSON.parse(this.apiMsgData.swaggerJsonVariable);
          this.apiMsgData.swaggerJsonVariable = JSON.stringify(this.apiMsgData.swaggerJsonVariable, null, 4);
        } else {
          this.apiMsgData.jsonVariable = JSON.parse(this.apiMsgData.jsonVariable);
          this.apiMsgData.jsonVariable = JSON.stringify(this.apiMsgData.jsonVariable, null, 4);
        }
      } catch (err) {
        this.$message({
          showClose: true,
          message: 'json格式错误',
          type: 'warning',
        });
      }
    },
    fileChange(response, file) {
      if (response['status'] === 0) {
        this.$confirm('服务器已存在相同名字文件，是否覆盖?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let form = new FormData();
          form.append("file", file.raw);
          form.append("skip", '1');
          this.$axios.post('/api/upload', form).then((response) => {
                this.$message({
                  showClose: true,
                  message: response.data['msg'],
                  type: 'success',
                });
                this.apiMsgData.variable[this.temp_num]['value'] = response.data['data'];
              }
          );
        }).catch(() => {

        });
      } else {
        if (response['msg']) {
          this.$message({
            showClose: true,
            message: response['msg'],
            type: 'success',
          });
        }
        this.apiMsgData.variable[this.temp_num]['value'] = response['data'];
      }
    },
    tempNum(i) {
      this.temp_num = i;
    },
    getNewApiSetList() {
      //  返回编辑页面的时候，刷新一下用例集合数据
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.currentApiSetList = this.proAndIdData[index]['api_set_data'];
    },
    initApiMsgData() {
      this.form.variable_type = 'data';
      this.form.jsonRemarkStatus = false;
      this.apiMsgData.header = Array();
      this.apiMsgData.variable = Array();
      this.apiMsgData.param = Array();
      this.apiMsgData.jsonVariable = '';
      this.apiMsgData.swaggerJsonVariable = '';
      this.apiMsgData.extract = Array();
      this.apiMsgData.validate = Array();
      this.apiMsgData.name = null;
      this.apiMsgData.num = null;
      this.apiMsgData.funcAddress = null;
      this.apiMsgData.up_func = null;
      this.apiMsgData.down_func = null;
      this.apiMsgData.desc = null;
      this.apiMsgData.id = null;
      this.apiMsgData.skip = null;
      this.apiMsgData.url = String();
      this.form.projectId = this.projectId;
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.currentApiSetList = this.proAndIdData[index]['api_set_data'];
      this.proUrlData = this.proAndIdData[index]['url'];
      this.form.apiSetId = this.apiSetId;
      this.form.choiceUrl = 0;

    },
    addApiMsg(messageClose = false) {
      if (this.apiMsgData.jsonVariable) {
        try {
          JSON.parse(this.apiMsgData.jsonVariable)
        } catch (err) {
          this.$message({
            showClose: true,
            message: 'json格式错误',
            type: 'warning',
          });
          return
        }
      }
      if (!this.form.projectId) {
        this.$message({
          showClose: true,
          message: '请选择项目',
          type: 'warning',
        });
        return
      }
      // if (this.form.choiceUrl === '') {
      //   this.$message({
      //     showClose: true,
      //     message: '请填写基础URL',
      //     type: 'warning',
      //   });
      //   return
      // }
      // console.log(this.form.choiceUrl)
      return this.$axios.post(this.$api.addApiApi, {
        'apiSetId': this.form.apiSetId,
        'projectId': this.form.projectId,
        'apiMsgName': this.apiMsgData.name,
        'num': this.apiMsgData.num,
        // 'choiceUrl': this.form.choiceUrl,
        'choiceUrl': this.form.choiceUrl,
        'variableType': this.form.variable_type,
        'desc': this.apiMsgData.desc,
        'funcAddress': this.apiMsgData.funcAddress,
        'upFunc': this.apiMsgData.up_func,
        'downFunc': this.apiMsgData.down_func,
        'url': this.apiMsgData.url,
        'skip': this.apiMsgData.skip,
        'apiMsgId': this.apiMsgData.id,
        'param': JSON.stringify(this.apiMsgData.param.filter(items => items.key !== null)),
        'header': JSON.stringify(this.apiMsgData.header.filter(items => items.key !== null)),
        'variable': JSON.stringify(this.apiMsgData.variable.filter(items => items.key !== null)),
        'jsonVariable': this.apiMsgData.jsonVariable,
        'swaggerJsonVariable': this.apiMsgData.swaggerJsonVariable,
        'extract': JSON.stringify(this.apiMsgData.extract.filter(items => items.key !== null)),
        'method': this.apiMsgData.method,
        'validate': JSON.stringify(this.apiMsgData.validate.filter(items => items.key !== null))
      }).then((response) => {
            if (messageClose) {
              this.apiMsgData.id = response.data['api_msg_id'];
              this.apiMsgData.num = response.data['num'];
              return response
            } else {
              if (this.messageShow(this, response)) {
                this.apiMsgData.id = response.data['api_msg_id'];
                this.apiMsgData.num = response.data['num'];
                this.$emit('updateTab', this.apiMsgData.name, this.apiMsgData.id.toString(), response.data.msg)
                return true
              }
            }
          }
      )
    },
    editCopyApiMsg(apiMsgId, status) {
      this.$axios.post(this.$api.editAndCopyApiApi, {'apiMsgId': apiMsgId}).then((response) => {
            this.apiMsgData.name = response.data['data']['name'];
            if (status === 'edit') {
              this.apiMsgData.num = response.data['data']['num'];
              this.apiMsgData.id = apiMsgId;
            } else {
              this.apiMsgData.num = '';
              this.apiMsgData.id = '';
            }
            this.apiMsgData.variable = response.data['data']['variable'];
            if (!response.data['data']['json_variable']) {
              this.apiMsgData.jsonVariable = ''
            } else {
              this.apiMsgData.jsonVariable = response.data['data']['json_variable'];
              this.apiMsgData.swaggerJsonVariable = response.data['data']['swagger_json_variable'];
            }
            this.apiMsgData.desc = response.data['data']['desc'];
            this.apiMsgData.funcAddress = response.data['data']['funcAddress'];
            this.apiMsgData.up_func = response.data['data']['up_func'];
            this.apiMsgData.down_func = response.data['data']['down_func'];
            this.apiMsgData.url = response.data['data']['url'];
            this.apiMsgData.skip = response.data['data']['skip'];
            this.apiMsgData.header = response.data['data']['header'];
            this.form.variable_type = response.data['data']['variableType'];
            this.apiMsgData.param = response.data['data']['param'];
            this.apiMsgData.extract = response.data['data']['extract'];
            this.apiMsgData.validate = response.data['data']['validate'];
            this.apiMsgData.method = response.data['data']['method'];
            this.form.apiSetId = response.data['data']['api_set_id'];
            this.form.projectId = this.projectId;

            let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);  //  获取当前节点的下标
            this.currentApiSetList = this.proAndIdData[index]['api_set_data'];
            this.proUrlData = this.proAndIdData[index]['url']
            this.form.choiceUrl = response.data['data']['status_url']
            // console.log()
            // this.form.choiceUrl = this.proUrlData[response.data['data']['status_url']];
            this.form.apiSetId = this.apiSetId;
            this.jsonRemarkStatus = false;
          }
      );
    },
    saveAndRun() {
      //  保存并执行接口
      this.addApiMsg(true).then(res => {
        //  先判断保存是否成功，再决定是否执行接口
        if (res.data['status'] === 0) {
          this.$message({
            showClose: true,
            message: res.data['msg'],
            type: 'warning',
          });
        } else {
          this.$emit('apiTest', [{'apiMsgId': res.data['api_msg_id'], 'num': '1'}], false);
        }
      });
    },
    resetLine() {
      //  重置单元格高度
      this.cell.style.height = '18px';
    },
    showLine(prefix, n) {
      //  获取单元格的滚动条高度，并使单元格为该高度
      this.cell = document.getElementById(prefix + n);
      this.cell.style.height = this.cell.scrollHeight + 'px';
    },
    changeLine() {
      //  当单元格高度和滚动条高度不一致时，改变单元格高度
      if (this.cell.style.height !== this.cell.scrollHeight + 'px') {
        let i = parseInt(this.cell.style.height.substring(0, this.cell.style.height.length - 2));
        if (i - this.cell.scrollHeight === 2) {
          //  为true时，为减少高度操作
          this.cell.style.height = (i - 18) + 'px'
        } else {
          this.cell.style.height = this.cell.scrollHeight + 'px';
        }
      }
    },
    addTableRow() {
      this.apiMsgData.param.push({key: null, value: null});
    },
  },
  computed: {
    monitorParam() {
      return this.apiMsgData.param;
    },
    monitorUrl() {
      return this.apiMsgData.url;
    },
    monitorMethod() {
      return this.apiMsgData.method;
    },

  },
  watch: {
    monitorParam: {
      handler: function () {
        if (this.apiMsgData.param.length === 0) {
          this.addTableRow()
        } else if (this.apiMsgData.param[this.apiMsgData.param.length - 1]['key'] || this.apiMsgData.param[this.apiMsgData.param.length - 1]['value']) {
          this.addTableRow()
        }
        let strParam = '';

        for (let i in this.apiMsgData.param) {
          if (parseInt(i) + 2 === this.apiMsgData.param.length && this.apiMsgData.param[i].key) {
            if (this.apiMsgData.param[i].value) {
              strParam += this.apiMsgData.param[i].key + '=' + this.apiMsgData.param[i].value;
            } else {
              strParam += this.apiMsgData.param[i].key;
            }
          } else if (this.apiMsgData.param[i].key) {
            strParam += this.apiMsgData.param[i].key + '=' + this.apiMsgData.param[i].value + '&';
          }
        }
        if (strParam.substr(strParam.length - 1, 1) === '&') {
          strParam = strParam.substring(0, strParam.length - 1)
        }
        if (strParam) {
          this.apiMsgData.url = this.apiMsgData.url.split("?")[0] + '?' + strParam
        } else {
          this.apiMsgData.url = this.apiMsgData.url.split("?")[0]
        }
      },
      deep: true
    },
    monitorUrl() {
      if (!this.apiMsgData.url) {
        this.apiMsgData.param = [{key: '', value: ''}];
        return
      }
      if (this.apiMsgData.url.indexOf('?') === -1) {
        this.apiMsgData.param = [{key: '', value: ''}];
        return
      }

      let url = this.apiMsgData.url.split("?");
      url.splice(0, 1);
      url = url.join("?");
      if (!url) {
        this.apiMsgData.param = [{key: '', value: ''}];
        return
      }
      let strParam = url.split("&");
      if (strParam[0]) {
        this.apiMsgData.param = Array();
        for (let i = 0; i < strParam.length; i++) {
          if (strParam[i].indexOf('=') !== -1) {
            let _array = strParam[i].split("=");

            let d = _array[0];
            _array.splice(0, 1);

            this.apiMsgData.param.push({
              key: d,
              value: _array.join("=")
            });
            // console.log(unescape(_array.join("=")))
          } else {
            this.apiMsgData.param.push({key: strParam[i], value: ''});
          }
        }
      }
    },
    monitorMethod(newValue) {
      if (newValue === 'GET') {
        this.bodyShow = 'first'
      }
    },

  },
  mounted() {
    if (this.config.mounted === 'init') {
      this.initApiMsgData()
    } else {
      this.editCopyApiMsg(this.config.apiMsgId, this.config.mounted)
    }

    // console.log(this.config)
  },
}
</script>
<style>

</style>
