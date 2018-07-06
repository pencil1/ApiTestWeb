<template>
    <div class="reportShow">
        <div style="margin: 0 0 -15px;">
        </div>
        <div style="text-align:center; line-height: 15px;">
            <el-row :gutter="20">
                <el-col :span="1">
                    <div class="grid-content bg-purple">
                    </div>
                </el-col>
                <el-col :span="21" style="text-align:left;background-color: rgb(215, 235, 255)">
                    <el-row :gutter="10">
                        <el-col :span="5">
                            <div style="margin-top: 10px">开始时间: {{this.reportData1['time']['start_at']}}
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div style="margin-top: 10px">耗时:
                                {{this.reportData1['time']['duration']}}s
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div style="margin-top: 10px">版本:
                                {{this.reportData1['platform']['python_version']}}
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div style="margin-top: 10px">skipped:
                                {{this.reportData1['stat']['skipped']}}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="5">
                            <div class="grid-content bg-purple">用例总数:
                                {{this.reportData1['stat']['testsRun']}}
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div class="grid-content bg-purple" style="color: #67C23A;">成功用例数:
                                {{this.reportData1['stat']['successes']}}
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div class="grid-content bg-purple" style="color: #F56C6C;">失败用例数:
                                {{this.reportData1['stat']['failures']}}
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div class="grid-content bg-purple" style="color: #F56C6C;">错误:
                                {{this.reportData1['stat']['errors']}}
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-button type="info" size="mini" @click.native="returnReport()" style="float: left;">返回</el-button>
            <el-button size="mini" @click.native="showSuccessData('all')" style="float: left;">全部信息</el-button>
            <el-button type="success" size="mini" @click.native="showSuccessData('success')" style="float: left;">
                成功信息
            </el-button>
            <el-button type="danger" size="mini" @click.native="showSuccessData('error')" style="float: left;">错误信息
            </el-button>
        </div>
        <el-table :data="this.reportData1['records']" stripe height="680">
            <el-table-column
                    prop="status"
                    label="状态"
                    width="80"
            >
                <template slot-scope="scope">
                    <div :style="scope.row.status === 'success' ? 'color:#2bef2b': 'color:rgb(255, 74, 74)'">
                        {{scope.row.status}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="meta_data"
                    label="耗时"
                    width="110">
                <template slot-scope="scope">
                    <div>
                        {{reportData1['records'][scope.$index]['meta_data']['response_time(ms)']}}ms
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="meta_data"
                    label="接口地址">
                <template slot-scope="scope">
                    <div>
                        {{reportData1['records'][scope.$index]['meta_data']['url']}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click.native="tempDetail(scope.$index)">详细</el-button>
                    <el-button type="success" size="mini" @click.native="tempRequest(scope.$index)">请求信息</el-button>
                    <el-button type="success" size="mini" @click.native="tempReturn(scope.$index)">返回信息</el-button>
                    <el-button type="danger" size="mini" @click.native="tempError(scope.$index)"
                               v-show="scope.row.status === 'error'">错误信息
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="40%"
        >
            <div style="max-height: 500px;overflow: auto;">
                <pre>{{this.temp}}</pre>

            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'reportShow',
        data() {
            return {
                reportAddress: '',
                dialogVisible: false,
                temp: {},
                reportData1: {
                    'records': [],

                    'platform': {'duration': '', 'python_version': ''},
                    'stat': {'skipped': '', 'testsRun': '', 'successes': '', 'failures': '', 'errors': ''},
                    'time': {'start_at': '', 'duration': 1}
                    ,
                },
            }
        },

        methods: {
            returnReport() {
                this.$router.push({path: 'reportManage'});
            },

            tempDetail(index) {
                this.temp = this.reportData1['records'][index];
                this.dialogVisible = true

            },
            tempRequest(index) {
                this.temp = this.reportData1['records'][index]['meta_data']['request_body'];
                this.dialogVisible = true

            },
            tempReturn(index) {
                this.temp = this.reportData1['records'][index]['meta_data']['response_body'];
                this.dialogVisible = true

            },
            tempError(index) {
                this.temp = this.reportData1['records'][index]['attachment'];
                this.dialogVisible = true

            },
            showData() {
                this.reportAddress = this.$route.query.reportId;
                this.$axios.post('/api/api/report/list', {'reportId': this.reportAddress}).then((response) => {
                    if (response.data['status'] === 0) {
                        this.$message({
                            showClose: true,
                            message: response.data['msg'],
                            type: 'warning',
                        });
                    }
                    else {
                        this.reportData1 = response['data'];

                    }

                    }
                )

            },
            showSuccessData(state) {
                this.$axios.post('/api/api/report/list', {
                    'reportId': this.reportAddress,
                    'state': state
                }).then((response) => {
                        this.reportData1 = response['data'];
                    }
                )

            },
        },
        mounted() {
            this.showData();

        },
    }


</script>

<style>
    .el-row {
        margin-bottom: 10px;

    }

    .el-row:last-child {
        margin-bottom: 2px;
    }

    .el-col {
        border-radius: 4px;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 25px;
    }


</style>