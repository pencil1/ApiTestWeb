<template>
    <div>
        <div style="margin: 10px;padding-left: 10px">
            <el-button type="primary" @click.native="initCase(1)" size="small">测试用例转化</el-button>
            <el-button type="primary" @click.native="initCase(2)" size="small">测试用例转化2</el-button>
            <el-button type="primary" @click.native="buildIdentity()" size="small">生成身份证12</el-button>
            <el-button type="primary" @click.native="erweima()" size="small">二维码</el-button>
            <el-button type="primary" @click.native="erweima1()" size="small">loading</el-button>
            <!--<el-button type="primary" size="small" @click.native="dealSql()">执行语句</el-button>-->
            <!--<el-button type="primary" size="small" @click.native="optimizeError()">错误信息优化显示</el-button>-->
            <!--<el-button type="primary" size="small" @click.native="sqlData1()">123</el-button>-->

        </div>
        <div style="margin: 20px 0;"></div>
        <el-dialog
                :visible.sync="a"
                width="252px"
                :showClose="false"
        >
            <div v-if="a" id="qrcode"></div>
        </el-dialog>

        <!--        <el-tree-->
        <!--                :data="data"-->
        <!--                node-key="id"-->
        <!--                :expand-on-click-node="false"-->
        <!--                default-expand-all-->
        <!--                @node-drag-start="handleDragStart"-->
        <!--                @node-drag-enter="handleDragEnter"-->
        <!--                @node-drag-leave="handleDragLeave"-->
        <!--                @node-drag-end="handleDragEnd"-->
        <!--                @node-drop="handleDrop"-->
        <!--                draggable-->
        <!--                :allow-drop="allowDrop"-->
        <!--                :allow-drag="allowDrag">-->
        <!--        </el-tree>-->
        <div class="box">
            <div id="preview" v-on:paste="handlePaste">
                <el-input placeholder="点击此处" v-model="path">
                </el-input>
            </div>
<!--            <el-button-->
<!--                    v-on:click="uploadPlans"-->
<!--            >上传文件-->
<!--            </el-button>-->
        </div>

        <!--        <el-dialog title="用例转化" :visible.sync="testCase.viewStatus" width="30%">-->
        <!--            <el-form :inline="true" class="demo-form-inline">-->
        <!--                <el-form-item label="文件地址">-->
        <!--                    <el-input v-model="testCase.address" size="medium" :disabled="true">-->
        <!--                    </el-input>-->
        <!--                </el-form-item>-->
        <!--                <el-form-item>-->
        <!--                    <el-upload-->
        <!--                            class="upload-demo"-->
        <!--                            :action="this.$api.fileUploadingApi"-->
        <!--                            :show-file-list='false'-->
        <!--                            :on-success="getFileAddress">-->
        <!--                        <el-button size="small" type="primary">点击上传</el-button>-->
        <!--                    </el-upload>-->
        <!--                </el-form-item>-->
        <!--            </el-form>-->
        <!--            <div slot="footer" class="dialog-footer">-->
        <!--                <el-button size="small" @click="testCase.viewStatus = false">取 消</el-button>-->
        <!--                <el-button type="primary" size="small" @click.native="initCaseChange()">确 定</el-button>-->
        <!--            </div>-->
        <!--        </el-dialog>-->
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2'

    export default {
        name: 'test',
        data() {
            return {
                path:'',
                qrcode1: Object,
                status: 1,
                a: false,
                value6: '',
                token: '',
                showData: '',
                testCase: {
                    viewStatus: false,
                    address: '',
                },
            };
        },
        mounted() {
        },
        methods: {

            erweima() {
                this.a = true;
                this.$nextTick(function () {
                    this.qrcode1 = new QRCode('qrcode',
                        {
                            width: 230,
                            height: 230,
                            text: 'https://www.jin10.com/newyear-game/index.html?',
                            colorDark: '#000',
                            colorLight: '#fff'
                        }
                    );
                });

            },
            erweima1() {
                this.a = true;
                this.$nextTick(function () {
                    this.qrcode1 = new QRCode('qrcode',
                        {
                            width: 230,
                            height: 230,
                            text: 'http://192.168.3.214:8010/#/loading',
                            colorDark: '#000',
                            colorLight: '#fff'
                        }
                    );
                });

            },
            handlePaste(event) {
                const items = (event.clipboardData || window.clipboardData).items;
                let file = null;

                if (!items || items.length === 0) {
                    this.$message.error("当前浏览器不支持本地");
                    return;
                }
                // 搜索剪切板items
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        file = items[i].getAsFile();
                        break;
                    }
                }
                if (!file) {
                    this.$message.error("粘贴内容非图片");
                    return;
                } else {
                    let form = new FormData();
                        form.append("file", file);
                    this.$axios.post('/api/upload/pic', form).then((response) => {
                                this.path = response.data['data']
                            }
                        );
                }
                // 此时file就是我们的剪切板中的图片对象
                // 如果需要预览，可以执行下面代码
                // const reader = new FileReader();
                // reader.onload = event => {
                //     preview.innerHTML = `<img src="${event.target.result}">`;
                // };
                // reader.readAsDataURL(file);
                // this.file = file;
            },
            //上传文件成功后回调
            uploadPlans() {
                let file = this.file;
                if (!file) {
                    this.$message.error("请粘贴图片后上传");
                    return;
                }
                this.loading = true;
                let form = new FormData();
                form.append("file", file);
                form.append("type", this.type);
                // uploadCertificate(form)
                //     .then(data => {
                //         if (data.data && data.data.success) {
                //             this.certificate_pic = data.data.data.source;
                //             this.$message.success(this.name + "上传成功！");
                //         } else {
                //             this.$message.error(this.name + "上传失败！");
                //         }
                //     }).catch(() => {
                // });
            },
            //uploadCertificate是封装的axios请求，自己根据需求传参

            // handleDragEnter(draggingNode, dropNode, ev) {
            //     console.log('tree drag enter: ', dropNode.label);
            // },
            // handleDragLeave(draggingNode, dropNode, ev) {
            //     console.log('tree drag leave: ', dropNode.label);
            // },
            // handleDragOver(draggingNode, dropNode, ev) {
            //     console.log('tree drag over: ', dropNode.label);
            // },
            // handleDragEnd(draggingNode, dropNode, dropType, ev) {
            //     console.log('tree drag end: ', dropNode && dropNode.label, dropType);
            // },
            // handleDrop(draggingNode, dropNode, dropType, ev) {
            //     console.log('tree drop: ', dropNode.label, dropType);
            // },
            // allowDrop(draggingNode, dropNode, type) {
            //     if (dropNode.data.label === '二级 3-1') {
            //         return type !== 'inner';
            //     } else {
            //         return true;
            //     }
            // }
            // ,
            allowDrag(draggingNode) {
                return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
            }
            ,
            initCase(status) {
                this.status = status;
                this.testCase.viewStatus = true;
                this.testCase.address = ''
            }
            ,
            getFileAddress(response, file) {
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
                        this.$axios.post('/api/upload', form).then((response) => {
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
                } else {
                    if (response['msg']) {
                        this.$message({
                            showClose: true,
                            message: response['msg'],
                            type: 'success',
                        });
                    }
                    this.testCase.address = response['data'];
                }

            }
            ,
            buildIdentity() {
                // 调用 callback 返回建议列表的数据
                this.$axios.get('/api/testCaseFile/find', {}).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        } else {
                            this.showData = response.data['data'];

                        }
                    }
                )
            }
            ,
            initCaseChange() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/caseChange', {
                    'address': this.testCase.address,
                    'choice': this.status
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        } else {
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
            }
            ,


        }
        ,

    }
</script>

<style>

    .list {
        max-height: 200px;
    }
</style>
