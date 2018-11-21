<template>
    <div class="suiteEdit">

        <el-dialog title="套件配置" :visible.sync="suiteData.suiteViewStatus" @close="changeStatus">
            <el-form :inline="true">
                <el-form-item label="编号" label-width="75px" v-if="suiteData.id">
                    <el-input v-model.number="suiteData.num">
                    </el-input>
                </el-form-item>
                <el-form-item label="套件名称" label-width="75px">
                    <el-input v-model="suiteData.name">
                    </el-input>
                </el-form-item>
            </el-form>
            <hr style="border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -10px"/>
            <el-table
                    :data="suiteData.apiList"
                    stripe>
                <el-table-column
                        :show-overflow-tooltip=true
                        prop="name"
                        label="接口名称"
                        min-width="60">
                </el-table-column>
                <el-table-column
                        :show-overflow-tooltip=true
                        prop="url"
                        label="接口地址">
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click.native="upNum(scope.$index)">升序</el-button>
                        <el-button type="primary" size="mini" @click.native="downNum(scope.$index)">降序</el-button>
                        <el-button type="danger" size="mini" @click.native="delNum(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="suiteData.suiteViewStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="addSuite()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'suiteEdit',
        props: ['projectName', 'modelName', 'apiMsgList'],
        data() {
            return {
                suiteData: {
                    apiList: Array(),
                    suiteViewStatus: false,
                    id: null,
                    name: null,
                    num: null,
                },
            }
        },
        methods: {
            changeStatus() {
                this.$emit('listenSuiteEditStatus', false)
            },
            initData() {
                this.suiteData.name = null;
                this.suiteData.num = null;
                this.suiteData.id = null;
                this.suiteData.apiList = JSON.parse(JSON.stringify(this.apiMsgList));
                this.suiteData.suiteViewStatus = true
            },
            editData(suiteId) {
                this.$axios.post('/apiMessage/apiMessage/suite/edit', {'suiteId': suiteId}).then((response) => {
                        this.suiteData.apiList = response['data']['data']['apiData'];
                        this.suiteData.num = response['data']['data']['num'];
                        this.suiteData.name = response['data']['data']['name'];
                        this.suiteData.id = response['data']['data']['id'];
                        this.suiteData.suiteViewStatus = true
                    }
                )
            },
            addSuite() {
                let apiData = Array();
                for (let i = 0; i < this.suiteData.apiList.length; i++) {
                    apiData.push(this.suiteData.apiList[i].caseId);
                }
                this.$axios.post('/apiMessage/apiMessage/suite/add', {
                    'projectName': this.projectName,
                    'gatherName': this.modelName,
                    'num': this.suiteData.num,
                    'suiteId': this.suiteData.id,
                    'suiteName': this.suiteData.name,
                    'apiData': apiData,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.$parent.findSuite();
                            this.$parent.cancelSelection();
                            this.suiteData.suiteViewStatus = false;
                        }
                    }
                )
            },
            upNum(i) {
                let d = this.suiteData.apiList[i];
                this.suiteData.apiList.splice(i, 1);
                this.suiteData.apiList.splice(i - 1, 0, d);
            },
            downNum(i) {
                let d = this.suiteData.apiList[i];
                this.suiteData.apiList.splice(i, 1);
                this.suiteData.apiList.splice(i + 1, 0, d);
            },
            delNum(i) {
                this.suiteData.apiList.splice(i, 1);
            },
        },
        mounted() {
        },
    }
</script>
<style>
</style>
