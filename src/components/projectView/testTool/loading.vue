<template>
    <div class="app-container">
        <h1>hello H5</h1>
        <el-upload
                class="upload-demo"
                action="/api/upload1"
                :show-file-list='false'>
            <el-button size="medium" type="primary"
                       @click="tempNum()">点击上传
            </el-button>
        </el-upload>
        <el-input v-model="datas" size="medium" >
                            </el-input>
        <el-button size="medium" type="primary"
                       @click="buildIdentity()">文本
            </el-button>
    </div>
</template>

<script>
    export default {
        name: "hello",
        data() {
            return {
                datas:'',
            }
        },
        methods: {
            tempNum(){

            },
            buildIdentity() {
                // 调用 callback 返回建议列表的数据
                this.$axios.post('/api/test/list1', {
                    'd':this.datas
                }).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        }
                    }
                )
            },
        }
    }
</script>
<style rel="stylesheet/stylus" lang="stylus" scoped>
    h1
        font-size: 200px; /*px*/
        text-align: center
        margin-top: 10vh
</style>
