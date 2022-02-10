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
                                    <pre style="overflow: auto;">{{resultDeal(item.meta_datas.data[0].response.json)}}</pre>
                                </div>
                            </el-scrollbar>
                        </el-tab-pane>
                        <el-tab-pane label="错误信息" v-if="item.attachment">
                            <div>
                                <pre style="overflow: auto">{{item.attachment}}</pre>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="返回信息">
                            <div v-for="(value, key) in item.meta_datas.data[0].response"
                                 :key="key">
                                <div style="color: #409eff"
                                     v-if="JSON.stringify(value) !== '{}' && key !== 'start_timestamp' && value && key !== 'json'">
                                    {{ key }}：
                                    <div style="color: #000000">{{ value }}</div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="请求信息">
                            <div v-for="(value, key) in item.meta_datas.data[0].request"
                                 :key="key">
                                <div style="color: #409eff"
                                     v-if="JSON.stringify(value) !== '{}' && key !== 'timeout'&& key !== 'verify' && value && key !== 'body'">
                                    {{ key }}：
                                    <pre style="overflow: auto;color: #000000">{{ value }}</pre>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="提取信息" v-if="JSON.stringify(item.meta_datas.data[0].extract_msgs) !== '{}'">
                            <div v-for="(value, key) in item.meta_datas.data[0].extract_msgs"
                                 :key="key">
                                <div style="color: #409eff"
                                     v-if="JSON.stringify(value) !== '{}' && key !== 'start_timestamp' && value && key !== 'json'">
                                    {{ key }}：
                                    <div style="color: #000000">{{ value }}</div>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
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
                            meta_datas: {
                                data: [{
                                    extract_msgs:{},
                                    request: {
                                        body: null,
                                        url: null,
                                        headers: null,
                                        data: null,
                                        params: null,
                                        json: null
                                    },
                                    response: {content: null, json: null}
                                }]
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
                } catch (err) {
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
                // this.resultData.out = data['details'][0]['in_out']['out'];
            },
        },

    }
</script>
<style>
</style>
