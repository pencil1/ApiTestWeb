<template>
    <div class="result">
        <el-dialog title="测试结果" :visible.sync="resultViewStatus" width="45%">
            <el-collapse accordion>
                <el-collapse-item
                        v-for="(item, index) in resultData.resultShowData"
                        :key="index">
                    <template slot="title">
                        <div :style="item.attachment ? 'color:rgb(255, 74, 74)': 'color:#45b90c'">{{item.name}}</div>
                    </template>

                    <el-tabs type="card">
                        <el-tab-pane label="返回结果">
                            <el-scrollbar wrapStyle="max-height:540px;">
                            <div>
                                <pre style="overflow: auto;">{{resultDeal(item.meta_data.response.content)}}</pre>
                            </div>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane  label="错误信息">
                            <div>
                                <pre style="overflow: auto">{{item.attachment}}</pre>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="基础信息">
                            <div v-for="(value, key) in item.meta_data.request"
                            :key="key">
                                <div style="color: #409eff"
                                     v-if="JSON.stringify(value) !== '{}' && key !== 'start_timestamp' && value">
                                    {{ key }}：
                                    <div style="color: #000000">{{ value }}</div>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    <!--<el-button type="primary" v-clipboard:copy="JSON.stringify(item.meta_data.response_body)"-->
                    <!--size="small"-->
                    <!--style="position:absolute;right: 3%;">复制-->
                    <!--</el-button>-->

                    <!--<div v-for="(value, key) in item.meta_data.request">-->
                    <!--<div style="color: #409eff" v-if="JSON.stringify(value) !== '{}' && key !== 'start_timestamp'">-->
                    <!--{{ key }}：-->
                    <!--<div  style="color: #000000">{{ value }}</div>-->
                    <!--</div>-->

                    <!--</div>-->

                    <!--<div style="color: #409eff">返回结果：</div>-->
                    <!--<div>-->
                    <!--<pre style="overflow: auto" >{{resultDeal(item.meta_data.response.content)}}</pre>-->
                    <!--</div>-->
                    <!--<div style="color: red">错误信息：</div>-->
                    <!--<div>-->
                    <!--<pre style="overflow: auto">{{item.attachment}}</pre>-->
                    <!--</div>-->

                </el-collapse-item>
            </el-collapse>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'result',
        data() {
            return {
                resultViewStatus: false,
                resultData: {
                    out: '',
                    resultShowData: [
                        {
                            name: null,
                            attachment: null,
                            meta_data: {
                                request: {body: null, url: null, headers: null, data: null, params: null, json: null},
                                response: {content: null, json: null}
                            },
                        },
                    ],
                },
            }
        },
        methods: {
            resultDeal(data) {

                try {
                    data = JSON.parse(data);
                    data = JSON.stringify(data, null, 4);
                }
                catch (err) {
                    null;
                }
                return data
            },
            lastResult() {
                this.resultViewStatus = true;
            },
            showData(data) {
                this.resultViewStatus = true;
                this.resultData.resultShowData = data['details'][0]['records'];
                this.resultData.out = data['details'][0]['in_out']['out'];
            },
        },

    }
</script>
<style>
</style>
