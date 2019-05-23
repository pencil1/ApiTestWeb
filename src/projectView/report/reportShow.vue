<template>
    <div class="reportShow" style="line-height: 36px;font-family:LiSu">
        <el-row>
            <el-col :span="24">
                <div class="grid-content" style="background-color: #f5f5f5 !important;">
                    <el-button type="primary" round style="padding: 4px 10px ;" v-show="false">{{null}}</el-button>
                    <el-button type="primary" size="mini" round style="margin-top: 5px;padding: 4px 10px ;"
                               @click.native="hideShowPic(false)"
                               v-show="this.picStatus">隐藏图表
                    </el-button>
                    <el-button type="primary" size="mini" round style="padding: 4px 10px ;"
                               @click.native="hideShowPic(true)"
                               v-show="!this.picStatus">展示图表
                    </el-button>
                    <!--<el-button-group>-->
                    <!--<el-button type="primary" icon="el-icon-check" style="padding: 4px 10px ;"></el-button>-->
                    <!--<el-button type="danger" icon="el-icon-close" style="padding: 4px 10px ;"></el-button>-->
                    <!--</el-button-group>-->
                    <el-dropdown @command="handleCommand" style="line-height:15px;margin-left:10px;color: #3a8ee6;">
                          <span class="el-dropdown-link">
                            业务展示<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="None">全部业务</el-dropdown-item>
                            <el-dropdown-item command="success">成功业务</el-dropdown-item>
                            <el-dropdown-item command="error">失败业务</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span style="font-family: Source Sans Pro;float: right;font-size: 13px;color: #3a8ee6;margin-right: 40px">time: {{this.reportData.time.start_datetime}}</span>
                </div>
            </el-col>
        </el-row>

        <el-row v-show="this.picStatus">
            <el-col :span="10"
                    style="border-style:solid;border-color: #ffffff rgb(234, 234, 234) #ffffff #ffffff;border-width: 1px;">
                <div style="height: 200px;float:left;">
                    <ve-pie :data="caseChartData" :settings="caseChartSettings" height="200px" width="350px"></ve-pie>
                </div>

                <ol style="margin-top:5px;font-size:14px;line-height:25px" class="remote-line">
                    <li style="font-weight:700;font-size:16px">apis result</li>
                    <li style="font-weight:600;color: rgb(146, 123, 139)">总数:{{this.reportData.stat.teststeps.total}}
                    </li>
                    <li style="color: rgb(25,212,174);font-weight:600">成功:{{this.reportData.stat.teststeps.successes}}
                    </li>
                    <li style="color: rgb(250,110,134);font-weight:600">失败:{{this.reportData.stat.teststeps.failures}}
                    </li>
                    <li style="color: #E87C25;font-weight:600">错误:{{this.reportData.stat.teststeps.errors}}</li>
                </ol>
            </el-col>
            <el-col :span="14" style="border-width: 1px;">
                <div style="height: 200px;float:left;">
                    <ve-ring :data="suiteChartData" :settings="suiteChartSettings" height="200px"
                             width="350px"></ve-ring>
                </div>
                <ol style="margin-top:5px;font-size:14px;line-height:25px" class="remote-line">
                    <li style="font-weight:700;font-size:16px">cases result</li>
                    <li style="font-weight:600;color: rgb(146, 123, 139)">总数:{{this.reportData.stat.testcases.total}}
                    </li>
                    <li style="color: rgb(25,212,174);font-weight:600">成功:{{this.reportData.stat.testcases.success}}
                    </li>
                    <li style="color: rgb(250,110,134);font-weight:600">失败:{{this.reportData.stat.testcases.fail}}</li>
                </ol>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"
                    style="border-style:solid;border-color: rgb(234, 234, 234) #ffffff #ffffff #ffffff;border-width: 1px;">
                <el-scrollbar>
                    <div :style={height:picHeight}>
                        <el-collapse accordion>
                            <el-collapse-item
                                    v-for="(item, index) in reportData['details']"
                                    :key="index"
                                    v-show="item.success === true ? showScene[0]: showScene[1]"
                            >
                                <template slot="title">
                                    <div style="font-weight:600 ;font-size: 15px;margin-left: 10px"
                                         :style="item.success === true ? 'color:#409eff': 'color:rgb(255, 74, 74)'"
                                    >
                                        {{item.name}}
                                    </div>

                                </template>
                                <div>
                                    <ol id="test" style="padding:5px;font-family:Times New Roman">
                                        <li style="list-style-type:none;border-bottom: 1px solid #eee;margin-left: 10px"
                                            :class="{'active':index === showColor[0] && index1 === showColor[1],
                                            'wire': index1 === 0}"
                                            v-for="(item1, index1) in item['records']"
                                            :key="index1"
                                            @click="handleNodeClick(index, index1)">
                                            <div :style="item1.status === 'success' ? 'color:#67c23a': 'color:rgb(255, 74, 74)'">
                                                <span class="test-name">{{item1.name}}</span>
                                                <span class="test-time">{{item1.meta_datas.stat.response_time_ms}} ms</span>
                                                <span class="test-status right pass">{{item1.status}}</span>
                                            </div>
                                        </li>
                                    </ol>
                                </div>

                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-scrollbar>
            </el-col>
            <el-col :span="18"
                    style="border-style:solid;border-color:rgb(234, 234, 234) #ffffff rgb(234, 234, 234) rgb(234, 234, 234);border-width: 1px;font-family:Serif">


                <el-scrollbar :wrapStyle={height:picHeight}>
                    <div style="float:right;padding-right:15px;position:absolute;z-index:100;right: 1px;top:-2px">
                        <el-tooltip content="查看主要信息" placement="top-start" @click.native="showInfo()">
                            <el-button size="mini" type="info" icon="el-icon-info" circle></el-button>
                        </el-tooltip>
                        <el-tooltip content="查看所有信息" placement="top-start">
                            <el-button size="mini" type="primary" circle @click.native="showAll()">all</el-button>
                        </el-tooltip>
                        <!--<el-button size="mini" type="success" icon="el-icon-check" circle></el-button>-->
                        <!--<el-button size="mini" type="info" icon="el-icon-message" circle></el-button>-->
                        <!--<el-button size="mini" type="warning" icon="el-icon-star-off" circle></el-button>-->
                        <el-tooltip content="查看报错信息" placement="top-start">
                            <el-button size="mini" type="danger" icon="el-icon-error" circle
                                       @click.native="showError()"></el-button>
                        </el-tooltip>
                    </div>
                    <div :style={height:picHeight}>
                        <table style="padding:10px;font-size: 14px;line-height: 25px;width: 100%;position:relative;"
                               border="0" cellpadding="0" cellspacing="0">
                            <thead>
                            <tr>
                                <th style="border-bottom:1px solid #d0d0d0;width: 100px">Identity</th>
                                <th style="border-bottom:1px solid #d0d0d0;width: 90%">Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-show="statusShow[0]">
                                <td class="my-table">url</td>
                                <td class="content" style=" overflow:auto;">
                                    {{this.meta_datas.data[0].request.url}}
                                </td>
                            </tr>
                            <tr v-show="statusShow[1]">
                                <td class="my-table">method</td>
                                <td class="content">
                                    {{this.meta_datas.data[0].request.method}}
                                </td>
                            </tr>
                            <tr v-show="statusShow[2]">
                                <td class="my-table">status_code</td>
                                <td class="content">
                                    {{this.meta_datas.data[0].response.status_code}}
                                </td>
                            </tr>
                            <tr v-show="statusShow[3]">
                                <td class="my-table">req_headers</td>
                                <td class="content">
                                    <pre style="overflow: auto">{{optimizeShow(this.meta_datas.data[0].request.headers)}}</pre>
                                </td>
                            </tr>
                            <tr v-show="statusShow[4]">
                                <td class="my-table">json</td>
                                <td class="content">
                                    <!--<pre style="overflow: auto">{{this.meta_data['request']['body']}}</pre>-->
                                    <pre style="white-space: pre-wrap;word-wrap: break-word;">{{this.meta_datas.data[0].request.json}}</pre>
                                </td>
                            </tr>
                            <tr v-show="statusShow[5]">
                                <td class="my-table">data</td>
                                <td class="content">
                                    <!--<pre style="overflow: auto">{{this.meta_data['request']['data']}}</pre>-->
                                    <pre style="overflow: auto">{{optimizeShow(this.meta_datas.data[0].request.data)}}</pre>

                                </td>
                            </tr>
                            <tr v-show="statusShow[6]">
                                <td class="my-table">params</td>
                                <td class="content">
                                    <pre>{{optimizeShow(this.meta_datas.data[0].request.params)}}</pre>
                                </td>
                            </tr>
                            <tr v-show="statusShow[7]">
                                <td class="my-table">resp_headers</td>
                                <td class="content">
                                    <pre style="overflow: auto">{{optimizeShow(this.meta_datas.data[0].response.headers)}}</pre>
                                    <!--<pre style="overflow: auto">{{this.meta_data['response']['headers']}}</pre>-->
                                </td>
                            </tr>

                            <tr v-show="statusShow[8]">
                                <td class="my-table">resp_data</td>
                                <td class="content">
                                    <pre style="white-space: pre-wrap;word-wrap: break-word;">{{this.meta_datas.data[0].response.json}}</pre>
                                    <!--<pre v-show="this.meta_data['response']['json'] !== ''"-->
                                         <!--style="white-space: pre-wrap;word-wrap: break-word;">{{this.meta_data['response']['content']}}</pre>-->
                                </td>
                            </tr>

                            <tr v-show="statusShow[8]">
                                <td class="my-table">resp_text</td>
                                <td class="content">
                                    <pre style="white-space: pre-wrap;word-wrap: break-word;">{{this.meta_datas.data[0].response.text}}</pre>
                                    <!--<pre v-show="this.meta_data['response']['json'] !== ''"-->
                                    <!--style="white-space: pre-wrap;word-wrap: break-word;">{{this.meta_data['response']['content']}}</pre>-->
                                </td>
                            </tr>

                            <tr v-show="attachment !== ''">
                                <td class="my-table">attachment</td>
                                <td class="content">
                                    <pre style="overflow: auto;color:red">{{this.attachment}}</pre>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </el-scrollbar>
            </el-col>
        </el-row>
    </div>
</template>

<script>

    export default {
        name: 'reportShow',
        data() {
            this.caseChartSettings = {
                radius: 80,
                avoidLabelOverlap: false,
                offsetY: 110,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            let colorList = [
                                'rgb(25,212,174)', 'rgb(250,110,134)', '#FE8463', '#E87C25', '#27727B',
                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                label: {
                    normal: {position: 'center', show: false,},
                },
                labelLine: {
                    normal: {show: false}
                },

            };
            this.suiteChartSettings = {
                radius: [50, 80],
                avoidLabelOverlap: false,
                offsetY: 110,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            let colorList = [
                                'rgb(25,212,174)', 'rgb(250,110,134)', '#fb2828', '#E87C25', '#27727B',
                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                label: {
                    normal: {position: 'center', show: false,},
                },
                labelLine: {
                    normal: {show: false}
                },
            };
            return {
                reportAddress: '',
                picHeight: '635px',
                picStatus: true,
                active: true,
                showScene: [true, true],
                statusShow: [true, true, true, true, true, true, true, true, true],
                showColor: [],
                attachment: '',
                meta_datas: {data:[{
                        request: {body: null, url: null, headers: null, data: null, params: null, json: null},
                        response: {content: null, json: null,status_code:null}
                    }]},
                caseChartData: {
                    columns: ['caseName', 'num'],
                    rows: [
                        {'caseName': '成功api', num: 0},
                        {"caseName": '失败api', num: 0},
                        {'caseName': '错误api', num: 0},


                    ]
                },
                suiteChartData: {

                    columns: ['name', 'num',],
                    rows: [
                        {'name': '成功case', 'num': 0},
                        {'name': '失败case', 'num': 0},
                    ]
                },

                reportData: {
                    'details': [{name: ''}],
                    'platform': {'duration': '', 'python_version': ''},
                    'stat': {
                        'teststeps': {
                            'errors': '',
                            'expectedFailures': '',
                            'failures': '',
                            'skipped': '',
                            'successes': '',
                            'total': '',
                            'unexpectedSuccesses': '',
                        },
                        'testcases': {'fail': '', 'success': '', 'total': '',},
                    },
                    'time': {'start_at': '', 'duration': 1,'start_datetime':''}
                    ,
                },
            }
        },

        methods: {
            handleNodeClick(i1, i2) {
                this.showColor = [i1, i2];
                this.meta_datas = this.reportData['details'][i1]['records'][i2]['meta_datas'];
                this.attachment = this.reportData['details'][i1]['records'][i2]['attachment']
            },
            handleCommand(command) {
                // this.showData(command);
                if (command === 'error') {
                    this.showScene = [false, true]
                } else if (command === 'success') {
                    this.showScene = [true, false]
                } else {
                    this.showScene = [true, true]
                }
            },
            optimizeShow(dict) {
                if (dict) {
                    let line='';
                    for (let key in dict) {
                        line = line + key + ':' + dict[key] + '\n'
                    }
                    return line
                }
            },
            showInfo() {
                this.statusShow = [true, true, true, false, false, false, false, false, true];

            },
            showAll() {
                this.statusShow = [true, true, true, true, true, true, true, true, true];

            },
            showError() {
                this.statusShow = [false, false, false, false, false, false, false, false, false];

            },
            showData(state = 'None') {
                this.reportAddress = this.$route.query.reportId;
                this.$axios.post('/api/report/list', {
                    'reportId': this.reportAddress,
                    'state': state,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.reportData = response['data'];
                            this.meta_datas = this.reportData['details'][0]['records'][0]['meta_datas'];
                            this.attachment = this.reportData['details'][0]['records'][0]['attachment'];
                            this.caseChartData['rows'][0]['num'] = this.reportData.stat.teststeps.successes;
                            this.caseChartData['rows'][1]['num'] = this.reportData.stat.teststeps.failures;
                            this.caseChartData['rows'][2]['num'] = this.reportData.stat.teststeps.errors;
                            this.suiteChartData['rows'][0]['num'] = this.reportData.stat.testcases.success;
                            this.suiteChartData['rows'][1]['num'] = this.reportData.stat.testcases.fail;

                        }
                    }
                )

            },
            hideShowPic(s) {
                if (s) {
                    this.picStatus = true;
                    this.picHeight = '635px';
                } else {
                    this.picStatus = false;
                    this.picHeight = '835px';
                }
            },
        },
        mounted() {
            this.showData();

        },
    }


</script>

<style scoped>
    .el-main {
        line-height: 36px;
    }

    .wire {
        border-top: 1px solid #eee;

    }

    .remote-line {
        list-style-type: none;
    }

    .active {
        background: #f7f7f7;
        font-weight: 600;
    }

    .test-name {
        display: inline-block;
        word-break: break-all;
        font-size: 16px;
        width: 100% !important;
    }

    .test-status {
        text-transform: capitalize;
        font-size: 13px;
        float: right !important;
        margin-right: 20px;
    }

    .grid-content {
        min-height: 36px;
    }

    .content {
        height: auto;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        border-bottom: 1px solid #d0d0d0;
    }

    .my-table {
        border-bottom: 1px solid #d0d0d0;
        font-weight: 600;
        color: #66b1ff
    }
</style>