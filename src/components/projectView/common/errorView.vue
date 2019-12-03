<template>
    <div class="errorView">
        <el-dialog title="错误信息" :visible.sync="viewStatus" width="50%" >
            <el-scrollbar wrapStyle="height:700px;">
            <pre style="color: #d04a4a">{{errorData}}</pre>
            </el-scrollbar>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'errorView',
        data() {
            return {
                viewStatus:false,
                errorData:'',

            }
        },
        methods: {
            showData(data){
                this.viewStatus = true;
                this.errorData = data;
            },
        },

    }
</script>
<style>
</style>
