<template>
  <el-dialog title="加载配置" :visible.sync="configShow" width="30%">
    <el-form :inline="true" class="demo-form-inline " size="small">
      <el-form-item label=" " labelWidth="10px">
        <el-select v-model="form.configProjectId" placeholder="请选择项目"
                   @change="changeConfigChoice"
                   style="width: 150px;padding-right:5px">
          <el-option
              v-for="(item) in proAndIdData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="form.configId" value-key="configId" placeholder="请选择配置"
                   style="width: 150px;padding-right:5px">
          <el-option
              v-for="item in configData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="configShow = false">取 消</el-button>
      <el-button type="primary" size="small" @click.native="addConfigData()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['proAndIdData'],
  name: "loadConfigView",
  data() {
    return {
      configShow:false,
      configData:[],
      form: {
        configProjectId: '',
        configId: '',
      },
    }
  },
  methods: {
    initData(){

    },
    changeConfigChoice() {
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.configProjectId);
      this.configData = this.proAndIdData[index]['config_data']
    },
    addConfigData() {
      //  复制配置信息到用例配置里面
      this.$axios.post(this.$api.configDataApi, {
        'configId': this.form.configId
      }).then((response) => {
            this.$parent.caseData.variable = this.$parent.caseData.variable.concat(response.data['data']['variables']);
            this.$parent.caseData.variable = JSON.parse(JSON.stringify(this.$parent.caseData.variable));
            this.$parent.caseData.funcAddress = response.data['data']['func_address'];
            this.configShow = false;
          }
      )
    },
  },
}
</script>

<style scoped>

</style>