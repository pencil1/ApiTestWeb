<template>
    <div class="test">
        <div style="margin: 10px;padding-left: 10px">
            <el-button type="primary" @click.native="initCase()" size="small">测试用例转化</el-button>
            <el-button type="primary" @click.native="buildIdentity()" size="small">生成身份证</el-button>
            <el-button type="primary" size="small" @click.native="dealSql()">执行语句</el-button>
            <el-button type="primary" size="small" @click.native="optimizeError()">错误信息优化显示</el-button>
            <el-button type="primary" size="small" @click.native="sqlData1()">123</el-button>

        </div>

        <div style="margin: 20px 0;"></div>
        <div>
            <el-input
                    type="textarea"
                    :rows="30"
                    placeholder="请输入内容"
                    v-model="showData">
            </el-input>
        </div>

        <el-dialog title="用例转化" :visible.sync="testCase.viewStatus" width="30%">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="文件地址">
                    <el-input v-model="testCase.address" size="medium" :disabled="true">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            :action="this.$api.fileUploadingApi"
                            :show-file-list='false'
                            :on-success="getFileAddress">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="testCase.viewStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="initCaseChange()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'test',
        data() {
            return {
                value6: '',
                token: '',
                showData: '',
                testCase:{
                    viewStatus:false,
                    address:'',
                },
            };
        },
        mounted() {
        },
        methods: {
            initCase(){
                this.testCase.viewStatus = true;
                this.testCase.address =''
            },
            getFileAddress(response, file, fileList) {
                if (response['status'] === 0) {
                    // this.$message({
                    //     showClose: true,
                    //     message: response['msg'],
                    //     type: 'warning',
                    // });
                    this.$confirm('服务器已存在相同名字文件，是否覆盖?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let form = new FormData();
                        form.append("file", file.raw);
                        form.append("skip", '1');
                        this.$axios.post('/api/upload',form ).then((response) => {
                                this.$message({
                                    showClose: true,
                                    message: response.data['msg'],
                                    type: 'success',
                                });
                                this.testCase.address = response['data']['data'];
                            }
                        );
                    }).catch(() => {
                    });
                }
                else {
                    if (response['msg']) {
                        this.$message({
                            showClose: true,
                            message: response['msg'],
                            type: 'success',
                        });
                    }
                    this.testCase.address = response['data'];
                }

            },
            buildIdentity() {
                // 调用 callback 返回建议列表的数据
                this.$axios.get('/api/buildIdentity', {}).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.showData = response.data['data'];

                        }
                    }
                )
            },
            initCaseChange() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/caseChange', {
                    'address':this.testCase.address
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            // let blob = new Blob([response.data['data']],{type:"application/application/vnd.ms-excel"})
                            // let objectUrl = URL.createObjectURL(blob)
                            // window.location.href=objectUrl
                            let link = document.createElement('a');
                            link.style.display = 'none';
                            link.href = response.data['data'];
                            // link.setAttribute('download', 'excel.xlsx')
                            document.body.appendChild(link);
                            link.click();
                            this.testCase.viewStatus = false;
                        }
                    }
                )
            },
            sqlData() {
                try {
                    JSON.parse(this.showData)
                }
                catch (err) {
                    this.$message({
                        showClose: true,
                        message: 'json格式错误',
                        type: 'warning',
                    });
                    console.log(err);
                    for (let i = 0; i < 30; i++) {
                        console.log(this.showData.substring(4787 - i, 4787))
                    }
                    // console.log(this.showData.substring(4787-3,4787+3))
                }
            },
            sqlData1() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/show1', {}).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.showData = response.data['data']
                        }
                    }
                )
            },
            optimizeError() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/optimizeError', {
                    'errorData': this.showData,
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'success',
                            });
                            this.showData = response.data['data'];
                        }
                    }
                )
            },
            dealSql() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/delSql', {}).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                        else {

                        }
                    }
                )
            },
        },

    }
</script>

<style>
    .list {
        max-height: 200px;
    }
</style>
