<template>
  <div class="app-container">
    <el-row>
      <div style="display: flex;justify-content: space-evenly">
        <el-col :span="7" style="margin: 5px" :offset="3">
          <el-card class="box-card" shadow="hover">
            <div style="font-size: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#my-icon-zuixing-91"></use>
              </svg>
              {{ this.otherData.project_num }}个项目
            </div>
            <div style="color: #999;font-size:15px;margin-top:20px">
              项目总数
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" style="margin: 5px">
          <el-card class="box-card" shadow="hover">
            <div style="font-size: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#my-icon-kejiziyuan"></use>
              </svg>
              {{ this.otherData.case_num }}个用例
            </div>
            <div style="color: #999;font-size:15px;margin-top:20px">
              用例总数
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" style="margin: 5px">
          <el-card class="box-card" shadow="hover">
            <div style="font-size: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#my-icon-lianjie"></use>
              </svg>
              {{ this.otherData.api_num }}个接口
            </div>
            <div style="color: #999;font-size:15px;margin-top:20px">
              接口总数
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>

    <el-row>
      <div style="display: flex;justify-content: space-evenly">
        <el-col :span="7" style="margin: 5px">
          <el-card class="box-card" shadow="hover">
            <div style="font-size: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#my-icon-zhinengzhizao"></use>
              </svg>
              {{ this.otherData.task_num }}个任务
            </div>
            <div style="color: #999;font-size:15px;margin-top:20px">
              任务总数
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" style="margin: 5px">
          <el-card class="box-card" shadow="hover">
            <div style="font-size: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#my-icon-zuixing-73"></use>
              </svg>
              {{ this.otherData.report_num }}个报告
            </div>
            <div style="color: #999;font-size:15px;margin-top:20px">
              报告总数
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" style="margin: 5px">
          <el-card class="box-card" shadow="hover">
            <div style="font-size: 20px;">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#my-icon-shitou"></use>
              </svg>
              {{ this.otherData.config_num }}个配置
            </div>
            <div style="color: #999;font-size:15px;margin-top:20px">
              配置总数
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <!--    <div style="height: 50px"></div>-->
    <!--    <ve-line :data="chartData"></ve-line>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      otherData: {
        project_num: 0,
        case_num: 0,
        api_num: 0,
        task_num: 0,
        report_num: 0,
        config_num: 0,
      },
      chartData: {
        columns: ['日期', '访问人数', '阅读次数'],
        rows: [{'日期': '2021-03-16', '访问人数': 3, '阅读次数': 3}]
      }
    }
  },
  methods: {
    d() {
      if (window.header.token) {
        return
      }
    },
    findMsg() {

      setTimeout(() => {   //设置延迟执行
        this.$axios.get(this.$api.msgApi, {}).then((response) => {
            this.chartData.rows = response.data.data['time_data'];
            this.otherData = response.data.data['other_data'];
          }
      )
      }, 1500);



    },
  },
  mounted() {
    this.findMsg();
  },
}
</script>
<style rel="stylesheet/stylus" lang="stylus" scoped>

</style>
