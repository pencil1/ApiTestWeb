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
                    <!--<el-button type="primary" v-clipboard:copy="JSON.stringify(item.meta_data.response_body)"-->
                    <!--size="small"-->
                    <!--style="position:absolute;right: 3%;">复制-->
                    <!--</el-button>-->
                    <div style="color: #409eff">url：</div>
                    <div>{{item.meta_data.request.url}}</div>
                    <div style="color: #409eff">请求params：</div>
                    <div>{{item.meta_data.request.params}}</div>
                    <!--<div style="color: red">请求body：</div>-->
                    <!--<div>{{item.meta_data.request.body}}</div>-->
                    <div style="color: #409eff">请求参数：</div>
                    <div v-if="item.meta_data.request.data !== '{}'">{{item.meta_data.request.data}}</div>
                    <div v-if="item.meta_data.request.json">{{item.meta_data.request.json}}</div>
                    <div style="color: #409eff">请求头：</div>
                    <div>{{item.meta_data.request.headers}}</div>
                    <div style="color: #409eff">信息提取：</div>
                    <pre style="overflow: auto">{{resultData.out}}</pre>
                    <div style="color: #409eff">返回结果：</div>
                    <div>
                        <pre style="overflow: auto" >{{resultDeal(item.meta_data.response.content)}}</pre>
                        <!--<pre>{{item.meta_data.response.json}}</pre>-->
                        <!--<pre style="overflow: auto" v-if="!item.meta_data.response.json">{{item.meta_data.response.content}}</pre>-->
                    </div>
                    <div style="color: red">错误信息：</div>
                    <div>
                        <pre style="overflow: auto">{{item.attachment}}</pre>
                    </div>
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
                resultViewStatus:false,
                resultData: {
                    out:'',
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
            resultDeal(data){

                try {
                    data = JSON.parse(data);
                    data = JSON.stringify(data, null, 4);
                }
                catch (err) {
                }
                return data
            },
            lastResult(){
                this.resultViewStatus = true;
            },
            showData(data){
                this.resultViewStatus = true;
                this.resultData.resultShowData = data['details'][0]['records'];
                this.resultData.out = data['details'][0]['in_out']['out'];
            },
        },

    }
</script>
<style>
</style>
