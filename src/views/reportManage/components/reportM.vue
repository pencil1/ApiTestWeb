<template>
    <div class="reportManage">


        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目" labelWidth="110px">
                <el-select v-model="form.projectId" placeholder="请选择项目" @change="projectChoice">
                    <el-option
                            v-for="(item) in this.proAndIdData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入报告名称" v-model="form.caseName" style="left: 10px">
                </el-input>
            </el-form-item>

            <el-form-item  style="padding-left: 15px">
                <el-button type="primary" @click.native="handleCurrentChange(1)" size="small">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first" class="table_padding">
            <el-tab-pane label="报告列表" name="first">

                <!--<el-scrollbar wrap-class="scrollbarList">-->
                <el-table :data="tableData"
                          :max-height="this.$store.state.tableHeight"
                          stripe>

                    <el-table-column
                            prop="project_name"
                            label="所属项目"
                            minWidth="100">
                    </el-table-column>

                    <el-table-column
                            :show-overflow-tooltip=true
                            minWidth="200"
                            prop="name"
                            label="用例"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="create_time"
                            label="时间"
                            minWidth="150">
                    </el-table-column>
                    <el-table-column
                            prop="performer"
                            label="执行者"
                            minWidth="80">
                    </el-table-column>
                  <el-table-column
                      prop="read_status"
                      label="结果"
                      width="80"
                      align="center">
                    <template slot-scope="scope">
                      <!--<div :style="scope.row.read_status === '已读' ? 'color:#2bef2b': 'color:rgb(255, 74, 74)'">-->
                      <!--{{scope.row.read_status}}-->
                      <!--</div>-->
                      <el-tag size="small" :type="scope.row.result === '通过' ? 'success' : 'danger'" >
                        {{scope.row.result}}
                      </el-tag>
                    </template>
                  </el-table-column>
                    <el-table-column
                            prop="read_status"
                            label="状态"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <!--<div :style="scope.row.read_status === '已读' ? 'color:#2bef2b': 'color:rgb(255, 74, 74)'">-->
                            <!--{{scope.row.read_status}}-->
                            <!--</div>-->
                            <el-tag size="small" :type="scope.row.read_status === '已读' ? 'success' : 'danger'" >
                                {{scope.row.read_status}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="300"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-zoom-in" size="mini"
                                       @click.native="check(tableData[scope.$index]['id'])">查看
                            </el-button>
                            <el-button type="primary" icon="el-icon-download" size="mini"
                                       @click.native="downReport(tableData[scope.$index]['id'])">下载
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delReport, tableData[scope.$index]['id'],'该报告')">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--</el-scrollbar>-->
                <div class="pagination">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            :current-page="currentPage"
                            :page-size="sizePage"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: 'reportManage',
        data() {
            return {
                proAndIdData: '',
                tableData: [],
                total: 1,
                currentPage: 1,
                sizePage: 20,
                form: {
                    projectId: '',
                    caseName: '',
                },
                reportData: {
                    'data': {'records': []},
                    'body': {
                        'platform': {'duration': '', 'python_version': ''},
                        'stat': {'skipped': '', 'testsRun': '', 'successes': '', 'failures': '', 'errors': ''}
                    },

                },
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                this.findReport()
            },
            handleSizeChange(val) {
                this.sizePage = val;
                this.findReport()
            },
          projectChoice() {
                this.findReport()
            },
            initData() {
              this.$axios.get(this.$api.baseDataApi).then((response) => {
                    this.proAndIdData = response.data['data'];
                    if (response.data['user_pros']) {
                      this.form.projectId = this.proAndIdData[0].id;
                      this.findReport();
                    }
                  }
              );
            },
            findReport() {
                this.$axios.post(this.$api.findReportApi, {
                    'page': this.currentPage,
                    'projectId': this.form.projectId,
                    'caseName': this.form.caseName,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.tableData = response.data.data;
                            this.total = response.data.total;
                        }
                    }
                )
            },
            delReport(report_id) {
                this.$axios.post(this.$api.delReportApi, {'report_id': report_id}).then((response) => {
                        this.messageShow(this, response);
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findReport();
                    }
                )
            },
            check(reportId) {

                // this.$router.push({path: 'reportShow', query: {reportId: reportId}});
                let {href} = this.$router.resolve({path: 'reportShow', query: {reportId: reportId}});
                window.open(href, '_blank');
            },
            downReport(reportId) {
                this.$axios.post('/api/report/download', {'reportId': reportId}).then((response) => {
                        // console.log(response.data['data']);
                        // download(response.data['data'], "测试报告.html", "text/html")
                        this.download(response.data.data, "测试报告.html", "text/html")
                    }
                )
            },
            download(data, strFileName, strMimeType) {

                let self = window, // this script is only for browsers anyway...
                    defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
                    mimeType = strMimeType || defaultMime,
                    payload = data,
                    anchor = document.createElement("a"),
                    toString = function (a) {
                        return String(a);
                    },
                    myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
                    fileName = strFileName || "download",
                    blob,
                    reader;
                myBlob = myBlob.call ? myBlob.bind(self) : Blob;

                //go ahead and download dataURLs right away
                blob = payload instanceof myBlob ?
                    payload :
                    new myBlob([payload], {type: mimeType});
                function saver(url, winMode) {
                    if ('download' in anchor) { //html5 A[download]
                        anchor.href = url;
                        anchor.setAttribute("download", fileName);
                        anchor.className = "download-js-link";
                        anchor.innerHTML = "downloading...";
                        anchor.style.display = "none";
                        document.body.appendChild(anchor);
                        setTimeout(function () {
                            anchor.click();
                            document.body.removeChild(anchor);
                            if (winMode === true) {
                                setTimeout(function () {
                                    self.URL.revokeObjectURL(anchor.href);
                                }, 250);
                            }
                        }, 66);
                        return true;
                    }
                }//end saver
                if (self.URL) { // simple fast and modern way using Blob and URL:
                    saver(self.URL.createObjectURL(blob), true);
                } else {
                    // handle non-Blob()+non-URL browsers:
                    if (typeof blob === "string" || blob.constructor === toString) {
                        try {
                            return saver("data:" + mimeType + ";base64," + self.btoa(blob));
                        } catch (y) {
                            return saver("data:" + mimeType + "," + encodeURIComponent(blob));
                        }
                    }
                    // Blob but not URL support:
                    reader = new FileReader();
                    reader.onload = function () {
                        saver(this.result);
                    };
                    reader.readAsDataURL(blob);
                }
                return true;
            },

        },
        mounted() {
          this.initData()
        },
    }
</script>

<style>


    .el-footer {
        background-color: #8db7ef;
        color: #333;
        text-align: left;
        line-height: 30px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    /*.el-tabs__header {*/
    /*margin: 0 0 10px;*/
    /*}*/

    .el-button--mini {
        padding: 5px 9px;
    }

    .el-dialog__body {
        padding: 5px 10px;
    }

    .row-bg {
        padding: 5px 0;
    }

    .el-breadcrumb {
        line-height: 3;
    }

</style>
