<template>
    <div class="importApi">

        <el-dialog title="接口信息导入" :visible.sync="importApiData.importApiStatus" width="30%">
            <el-form>
                <el-form-item label="请选择导入格式">
                    <el-radio-group v-model="importApiData.importFormat">
                        <el-radio label="HAR"></el-radio>
                        <el-radio label="postman(JSON)"></el-radio>
                        <!--<el-radio label="swagger"></el-radio>-->
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="文件地址">
                    <el-input v-model="importApiData.importApiAddress" size="medium" :disabled="true">
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
                <el-button size="small" @click="importApiData.importApiStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="importCase()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'importApi',
        props: ['projectName', 'moduleData'],
        data() {
            return {
                importApiData: {importApiStatus: false, importFormat: null, importApiAddress: null,},
            }
        },
        methods: {
            initData() {
                if (!this.moduleData) {
                    this.$message({
                        showClose: true,
                        message: '请选择模块',
                        type: 'warning',
                    });
                    return
                }
                this.importApiData.importFormat = null;
                this.importApiData.importApiAddress = null;
                this.importApiData.importApiStatus = true
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
                            this.importApiData.importApiAddress = response['data']['data'];
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
                    this.importApiData.importApiAddress = response['data'];
                }

            },
            importCase() {
                this.$axios.post(this.$api.importApiApi, {
                    'importApiAddress': this.importApiData.importApiAddress,
                    'projectName': this.projectName,
                    'moduleId': this.moduleData.moduleId,
                    'importFormat': this.importApiData.importFormat,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.importApiData.importApiStatus = false;
                            this.importApiAddress = null;
                            this.$parent.findApiMsg();
                        }
                    }
                )
            },
        },
        mounted() {
        },
    }
</script>
<style>
</style>
