<template>
  <el-dialog title="任务配置" :visible.sync="taskData.modelFormVisible" width="42%">
    <el-tabs>
      <el-tab-pane label="messages" style="margin-top: 10px">
        <el-form size="small">
          <el-form-item label="执行选择" :label-width="taskData.formLabelWidth">
            <el-select v-model="form.projectId" placeholder="选择项目"
                       style="width: 150px;padding-right:5px"
                       @change="changeProjectChoice">
              <el-option
                  v-for="(item) in proAndIdData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>

            <el-cascader
                style="width: 150px;padding-right:5px"
                placeholder="请选择用例集"

                v-model="form.caseSet"
                :options="currentCaseSetList"
                @change="changeSceneChoice"
                :props="{
                          label:'name',
                          value:'id',
                          checkStrictly: true,
                          expandTrigger: 'hover',
                          multiple:true,
                          emitPath:false
                        }"
            ></el-cascader>

            <el-select v-model="form.case" multiple placeholder="选择用例" value-key="id"
                       :disabled="caseStatus"
                       style="width: 150px">
              <el-option
                  v-for="item in allCaseList"
                  :key="item.caseId"
                  :label="item.label"
                  :value="item.caseId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称" :label-width="taskData.formLabelWidth">
            <el-input v-model="taskData.name" auto-complete="off" size="small">
            </el-input>
          </el-form-item>
          <el-form-item label="收件人邮箱" :label-width="taskData.formLabelWidth">
            <el-input v-model="taskData.toEmail">
            </el-input>
          </el-form-item>
          <!--          <el-form-item label="发件人邮箱" :label-width="taskData.formLabelWidth">-->
          <!--            <el-input v-model="taskData.SendEmail">-->
          <!--            </el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="邮箱密码" :label-width="taskData.formLabelWidth"-->
          <!--                        prop="desc">-->
          <!--            <el-input v-model="taskData.password" type="password">-->
          <!--            </el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="webhook" :label-width="taskData.formLabelWidth">
            <el-input v-model="taskData.webhook">
            </el-input>
          </el-form-item>
          <el-form-item label="secret" :label-width="taskData.formLabelWidth"
                        prop="desc">
            <el-input v-model="taskData.secret">
            </el-input>
          </el-form-item>
          <el-form-item label="钉钉标题" :label-width="taskData.formLabelWidth"
                        prop="desc">
            <el-input v-model="taskData.title">
            </el-input>
          </el-form-item>
          <el-form-item label="时间配置" :label-width="taskData.formLabelWidth">
            <el-input v-model="taskData.timeConfig"
                      placeholder="second minute hour day month day_of_week(0 0 12 * * ? 每天中午12点触发)">
            </el-input>
          </el-form-item>
          <el-form-item label="发送策略" :label-width="taskData.formLabelWidth">
            <el-radio v-model="taskData.sendEmailStatus" label="1">始终发送</el-radio>
            <el-radio v-model="taskData.sendEmailStatus" label="2">失败发送</el-radio>
            <el-radio v-model="taskData.sendEmailStatus" label="3">从不发送</el-radio>
          </el-form-item>
        </el-form>
      </el-tab-pane>


    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="taskData.modelFormVisible = false" size="small">取 消</el-button>
      <el-button type="primary"
                 @click.native="addTask()" size="small">确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['proAndIdData'],
  name: "editView",
  data() {
    return {
      currentCaseSetList: [],
      allCaseList: [],
      caseStatus: false,
      taskData: {
        id: '',
        num: '',
        modelFormVisible: false,
        projectName: '',
        name: '',
        taskType: '',
        toEmail: '',
        SendEmail: '',
        webhook: '',
        secret: '',
        title: '',
        timeConfig: '',
        password: '',
        formLabelWidth: '90px',
        sendEmailStatus: '',
      },
      form: {
        caseSet: {
          label: null,
          id: null,
        },
        case: {
          label: null,
          id: null,
        },
        case_set_id: '',
        projectId: '',
        taskName: '',
      },
    }
  },
  methods: {
    initTaskData() {
      this.taskData.name = '';
      this.taskData.id = '';
      this.taskData.taskType = '';
      this.taskData.toEmail = '';
      this.taskData.SendEmail = '';
      this.taskData.timeConfig = '';
      this.taskData.password = '';
      this.taskData.title = '自动化测试报告';
      this.form.caseSet = [];
      this.form.case = [];
      this.taskData.num = '';
      this.taskData.modelFormVisible = true;
      this.taskData.sendEmailStatus = '1';
      this.form.projectId = this.$parent.projectId
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.currentCaseSetList = this.proAndIdData[index]['case_set_data'];
    },

    changeProjectChoice() {
      this.form.caseSet = [];
      this.form.case = [];
      let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);
      this.currentCaseSetList = this.proAndIdData[index]['case_set_data'];
    },
    changeSceneChoice() {
      if (this.form.caseSet.length === 1) {
        this.caseStatus = false;
        this.form.case_set_id = this.form.caseSet[0];
        this.findCase()
      } else {
        this.caseStatus = true;
        this.form.case = [];
        this.form.case_set_id = ''

      }
    },
    addTask() {
      console.log(this.form.caseSet)
      let setIds

      this.$axios.post(this.$api.addTaskApi, {
        'projectId': this.form.projectId,
        'setIds': this.form.caseSet,
        'caseIds': this.form.case,
        'id': this.taskData.id,
        'num': this.taskData.num,
        'name': this.taskData.name,
        'taskType': this.taskData.taskType,
        'toEmail': this.taskData.toEmail,
        'sendEmail': this.taskData.SendEmail,
        'webhook': this.taskData.webhook,
        'secret': this.taskData.secret,
        'title': this.taskData.title,
        'timeConfig': this.taskData.timeConfig,
        'password': this.taskData.password,
        'sendEmailStatus': this.taskData.sendEmailStatus,
      }).then((response) => {

            if (response.data['status'] === 0) {
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'warning',
              });
            } else {
              this.taskData.modelFormVisible = false;
              this.$message({
                showClose: true,
                message: response.data['msg'],
                type: 'success',
              });
              this.$parent.findTask();

            }
          }
      )
    },
    editTask(id) {
      this.$axios.post(this.$api.editTaskApi, {'id': id}).then((response) => {
            this.taskData.name = response.data['data']['task_name'];
            this.taskData.timeConfig = response.data['data']['task_config_time'];
            // this.form.projectName = response.data['data']['project_name'];
            this.taskData.taskType = response.data['data']['task_type'];
            this.taskData.toEmail = response.data['data']['task_to_email_address'];
            this.taskData.SendEmail = response.data['data']['task_send_email_address'];
            this.taskData.password = response.data['data']['password'];
            this.taskData.webhook = response.data['data']['webhook'];
            this.taskData.secret = response.data['data']['secret'];
            this.taskData.title = response.data['data']['title'];
            this.taskData.sendEmailStatus = response.data['data']['send_email_status'];
            this.taskData.num = response.data['data']['num'];
            this.taskData.projectName = this.form.projectName;
            this.taskData.id = id;
            this.form.caseSet = response.data['data']['set_ids'];
            // console.log(response.data['data']['set_ids'].length)
            if (response.data['data']['set_ids'].length === 1) {
              // 当用例集只有1个时，赋值set_id，让用例下拉框有数据显示
              this.form.case_set_id = response.data['data']['set_ids'][0]
            } else {
              this.caseStatus = false;
            }
            this.form.case = response.data['data']['case_ids'];
            this.taskData.modelFormVisible = true;

            this.form.projectId = this.$parent.projectId
            let index = this.proAndIdData.map(item => item.id).indexOf(this.form.projectId);  //  获取当前节点的下标
            this.currentCaseSetList = this.proAndIdData[index]['case_set_data'];
            this.findCase()
          }
      )
    },
    findCase() {
      this.$axios.post(this.$api.findCaseApi, {
        'caseSetId': this.form.case_set_id,
        'projectId': this.form.projectId,
        'caseName': this.form.caseName,
        'page': 1,
        'sizePage': 9999,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.allCaseList = response.data['data'];
            }
          }
      )
    },
  }
}
</script>

<style scoped>

</style>