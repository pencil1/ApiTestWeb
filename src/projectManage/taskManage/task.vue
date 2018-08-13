<template>
    <div class="modeManage">

        <el-form :inline="true" class="demo-form-inline" style="background-color: #f2f2f2;  padding-top: 20px;"
                 size="small">

            <el-form-item label="任务名称" labelWidth="110px">

                <el-input placeholder="" v-model="form.taskName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="findTask()" size="small">
                    搜索
                </el-button>
                <el-button type="primary" size="small" @click.native="initTaskData()">添加任务
                </el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first">
            <el-tab-pane label="任务列表" name="first" style="margin: 0 0 -10px;">
                <div style="margin: 0 0 -20px;">
                </div>
                <el-table :data="tableData" stripe>
                    <el-table-column
                            prop="num"
                            label="编号"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="task_name"
                            label="任务名称"
                            width="190">
                    </el-table-column>
                    <el-table-column
                            prop="task_config_time"
                            label="cron"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"
                    >
                    </el-table-column>
                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] === '创建'"
                                       @click.native="editTask(tableData[scope.$index]['id'])">修改
                            </el-button>
                            <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] === '创建'"
                                       @click.native="startTask(tableData[scope.$index]['id'])">启动
                            </el-button>
                            <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] !== '创建'"
                                       v-show="tableData[scope.$index]['status'] !== '暂停'"
                                       @click.native="pauseTask(tableData[scope.$index]['id'])">暂停
                            </el-button>

                            <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] !== '创建'"
                                       v-show="tableData[scope.$index]['status'] !== '启动'"
                                       @click.native="resumeTask(tableData[scope.$index]['id'])">恢复
                            </el-button>
                            <el-button type="primary" size="mini" v-if="tableData[scope.$index]['status'] !== '创建'"
                                       @click.native="removeTask(tableData[scope.$index]['id'])">移除
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delTask,tableData[scope.$index]['id'])">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block" style="left:68%; position: relative;">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>


        <el-dialog title="任务配置" :visible.sync="taskData.modelFormVisible" width="40%">
            <el-tabs>
                <el-tab-pane label="messages">
                    <el-form :model="taskData">
                        <el-form-item label="任务序号" :label-width="taskData.formLabelWidth"
                                      prop="num"
                                      :rules="[{ required: true, type:'number', message: '请输入数字', trigger: 'blur' },]">
                            <el-input v-model.number="taskData.num" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="任务名称" :label-width="taskData.formLabelWidth">
                            <el-input v-model="taskData.name" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="执行类别" :label-width="taskData.formLabelWidth">
                            <el-select v-model="taskData.taskType" size="medium">
                                <el-option v-for="item in taskTypes" :key="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目名称" :label-width="taskData.formLabelWidth">
                            <el-select v-model="form.projects" placeholder="请选择项目">
                                <el-option
                                        v-for="(item, key) in proGatherData"
                                        :key="key"
                                        :value="key">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.scenes" multiple placeholder="请选择业务集" style="width: 400px;">
                                <el-option
                                        v-for="item in proSceneData[this.form.projects]"
                                        :key="item.id"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="收件人邮箱" :label-width="taskData.formLabelWidth">
                            <el-input v-model="taskData.toEmail" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发件人邮箱" :label-width="taskData.formLabelWidth">
                            <el-input v-model="taskData.SendEmail" auto-complete="off">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="时间配置" :label-width="taskData.formLabelWidth">
                            <el-input v-model="taskData.timeConfig" auto-complete="off">
                            </el-input>
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

    </div>
</template>

<script>
    export default {
        name: 'modeManage',
        data() {
            return {
                proGatherData: '',
                proSceneData: '',
                tableData: [],
                taskTypes: ['cron', 'date'],
                total: 1,
                currentPage: 1,
                sizePage: 10,
                form: {
                    projects: '',
                    modelName: '',
                    taskName: '',
                    scenes: [],

                },
                taskData: {
                    id: '',
                    num: '',
                    modelFormVisible: false,
                    projectName: '',
                    name: '',
                    taskType: '',
                    toEmail: '',
                    SendEmail: '',
                    timeConfig: '',
                    formLabelWidth: '120px',
                }
            }
        },


        methods: {
            httpSend() {
                this.$axios.get('/api/api/proGather/list').then((response) => {
                        this.proGatherData = response.data['data'];
                        for (var key in response.data['data']) {
                            this.form.projects = key;
                            // this.form.gathers = response.data[key][0].toString();
                            break
                        }
                    }
                );
                this.$axios.get('/api/api/proScene/list').then((response) => {
                        this.proSceneData = response.data;
                        for (var key in response.data) {
                            this.form.projects = key;
                            // this.form.gathers = response.data[key][0].toString();
                            break
                        }
                        this.findTask();
                    }
                );

            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findTask()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findTask()
            },
            findTask() {
                this.$axios.post('/api/api/task/find', {
                    'taskName': this.form.taskName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.tableData = response.data['data'];
                            this.total = response.data['total'];
                        }

                    }
                )
            },
            initTaskData() {
                this.taskData.name = '';
                this.taskData.id = '';
                this.taskData.taskType = '';
                this.taskData.toEmail = '';
                this.taskData.SendEmail = '';
                this.taskData.timeConfig = '';
                this.form.projects = '';
                this.form.scenes = [];
                this.taskData.num = '';
                this.taskData.modelFormVisible = true;

            },
            addTask() {
                this.$axios.post('/api/api/task/add', {
                    'projectName': this.form.projects,
                    'sceneNames': this.form.scenes,
                    'id': this.taskData.id,
                    'num': this.taskData.num,
                    'name': this.taskData.name,
                    'taskType': this.taskData.taskType,
                    'toEmail': this.taskData.toEmail,
                    'sendEmail': this.taskData.SendEmail,
                    'timeConfig': this.taskData.timeConfig,
                }).then((response) => {

                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.taskData.modelFormVisible = false;
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.findTask();

                        }
                    }
                )
            },
            editTask(id) {
                this.$axios.post('/api/api/task/edit', {'id': id}).then((response) => {
                        this.taskData.name = response.data['data']['task_name'];
                        this.taskData.timeConfig = response.data['data']['task_config_time'];
                        this.form.projects = response.data['data']['project_name'];
                        this.form.scenes = response.data['data']['scene_names'];
                        this.taskData.taskType = response.data['data']['task_type'];
                        this.taskData.toEmail = response.data['data']['task_to_email_address'];
                        this.taskData.SendEmail = response.data['data']['task_send_email_address'];
                        this.taskData.num = response.data['data']['num'];
                        this.taskData.projectName = this.form.projects;
                        this.taskData.id = id;
                        this.taskData.modelFormVisible = true;
                    }
                )
            },
            startTask(id) {
                this.$axios.post('/api/api/task/start', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.findTask();
                    }
                )
            },
            pauseTask(id) {
                this.$axios.post('/api/api/task/pause', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.findTask();
                    }
                )
            },
            resumeTask(id) {
                this.$axios.post('/api/api/task/resume', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.findTask();
                    }
                )
            },
            removeTask(id) {
                this.$axios.post('/api/api/task/remove', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.findTask();
                    }
                )
            },
            delTask(id) {
                this.$axios.post('/api/api/task/del', {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.form.taskName = '';
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findTask();
                    }
                )
            },
        },
        mounted() {
            this.httpSend();


        },
    }
</script>

<style>

</style>
