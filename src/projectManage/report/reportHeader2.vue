<template>
    <div class="reportHeader2">
        <el-container>
            <el-container>

                <el-header style="height: 40px;">
                    <div style="margin: 0 0 -12px;">
                    </div>
                    <el-row :gutter="20">

                        <el-col :span="20" style="text-align:left">
                            <div style="font-size: 29px;font-family: KaiTi;color: #fff">Test Report: 测试报告
                            </div>
                        </el-col>
                    </el-row>

                </el-header>

                <!--<el-footer style="height: 30px;">-->
                <!--<span class="demonstration">author</span>-->
                <!--</el-footer>-->
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'reportHeader2',
        data() {
            return {}
        },
        methods: {},
        mounted() {
        },
    }
</script>
<style scoped>
    .el-header {
        background-color: #757677;
    }
</style>
