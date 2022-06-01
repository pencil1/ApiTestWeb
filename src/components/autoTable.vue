<template>
    <div>
        <el-table :data="tableData"
                  size="mini"
                  stripe :show-header="false"
                  class="h-b-e-a-style"
                  :row-style="{'background-color': 'rgb(250, 250, 250)'}">
            <!--      <el-table-column v-for="(item,key,index) in temp" :key="item" header-align="center" :style="{width: '50px'}">-->
            <el-table-column v-for="(item,key,index) in temp" :key="item" header-align="center"
                             :minWidth="widthList[index]" :width="getStyle(key)">
                <template slot-scope="scope">
                    <div v-if="key === 'comparator'">
                        <el-autocomplete
                                class="inline-input"
                                v-model="scope.row.comparator"
                                :fetch-suggestions="querySearch"
                                placeholder="请选择"
                                size="mini"
                        ></el-autocomplete>
                    </div>
                    <div v-else-if="key === 'param_type'">
                            <el-select v-model="scope.row.param_type" size="mini">
                                <el-option v-for="item in paramTypes" :key="item" :value="item">
                                </el-option>
                            </el-select>
                    </div>
                    <div v-else>
                        <div v-if="key === 'value' && lineFeed">
                            <div v-if="scope.row.param_type === 'string'">
                                <el-input v-model="scope.row[key]"
                                          :placeholder="key"
                                          :id="'data_input'+ kind + scope.$index "
                                          type="textarea"
                                          rows=1
                                          @focus="showLine('data_input'+ kind , scope.$index)"
                                          @input="changeLine()"
                                          @blur="resetLine()"
                                          size="mini"
                                          resize="none">
                                </el-input>
                            </div>
                            <div v-else>
                                <el-row>
                                    <el-col :span="21">
                                        <el-input v-model="scope.row.value" size="mini" :disabled="true" >
                                        </el-input>
                                    </el-col>
                                    <el-col :span="2" style="padding-left:10px;">
                                        <el-upload
                                                class="upload-demo"
                                                action="/api/upload"
                                                :show-file-list='false'
                                                :on-success="fileChange">
                                            <el-button size="mini" type="primary"
                                                       @click="tempNum(scope.$index)">点击上传
                                            </el-button>
                                        </el-upload>
                                    </el-col>
                                </el-row>
                            </div>

                        </div>
                        <div v-else>
                            <el-input v-model="scope.row[key]" size="mini" :placeholder="key">
                            </el-input>
                        </div>

                    </div>
                </template>
            </el-table-column>
            <el-table-column property="value" label="操作" header-align="center" width="80">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                               @click.native="delTableRow(scope.$index)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'autoTable',
        props: {
            tableData: Array,
            kind: {
                type: String,
                default: 'extract'
            },
            lineFeed: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                temp: {key: null, value: null, remark: null},
                widthList: [100, 200, 80],
                s1: {'min-width': '100px'},
                paramTypes: ['string', 'file'],
                temp_num:0,
                comparators: [
                    {'value': 'equals'},
                    {'value': 'less_than'},
                    {'value': 'less_than_or_equals'},
                    {'value': 'greater_than'},
                    {'value': 'greater_than_or_equals'},
                    {'value': 'not_equals'},
                    {'value': 'string_equals'},
                    {'value': 'length_equals'},
                    {'value': 'length_greater_than'},
                    {'value': 'count_greater_than_or_equals'},
                    {'value': 'length_less_than'},
                    {'value': 'length_less_than_or_equals'}],
            }
        },
        methods: {
            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.comparators);
            },
            getStyle(key) {
                let s;
                if (key === 'comparator') {
                    s = '200px'
                } else if (key === 'param_type') {
                    s = '100px'
                }else if (key === 'remark') {
                    s = '100px'
                }
                return s
            },
            getKind() {
                if (this.kind === 'extract') {
                    this.temp = {key: null, value: null, remark: null}
                } else if (this.kind === 'header') {
                    this.temp = {key: null, value: null, remark: null}
                } else if (this.kind === 'assert') {
                    this.temp = {key: null, comparator: '', value: null, remark: null};
                    this.widthList = [100, 100, 200, 80]
                }else if (this.kind === 'variable') {
                    this.temp = {key: null, param_type: 'string', value: null, remark: null};
                    this.widthList = [100, 100, 200, 80]
                }else if (this.kind === 'url') {
                    this.temp = {value: null}
                }
                if (this.tableData.length === 0){
                  this.addTableRow()
                }
                // console.log()
            },
            addTableRow() {
                if (this.kind === 'extract') {
                    this.tableData.push({key: null, value: null, remark: null})
                } else if (this.kind === 'header') {
                    this.tableData.push({key: null, value: null, remark: null})
                } else if (this.kind === 'assert') {
                    this.tableData.push({key: null, comparator: '', value: null, remark: null})
                }else if (this.kind === 'variable') {
                    this.tableData.push({key: null, param_type: 'string', value: null, remark: null})
                }
            },
            delTableRow(i) {
                this.tableData.splice(i, 1);
            },
            resetLine() {
                //  重置单元格高度
                this.cell.style.height = '18px';
            },
            showLine(prefix, n) {
                //  获取单元格的滚动条高度，并使单元格为该高度
                this.cell = document.getElementById(prefix + n);
                console.log(this.cell.scrollHeight)
                this.cell.style.height = this.cell.scrollHeight + 'px';
            },
            changeLine() {
                //  当单元格高度和滚动条高度不一致时，改变单元格高度
                if (this.cell.style.height !== this.cell.scrollHeight + 'px') {
                    let i = parseInt(this.cell.style.height.substring(0, this.cell.style.height.length - 2));
                    if (i - this.cell.scrollHeight === 2) {
                        //  为true时，为减少高度操作
                        this.cell.style.height = (i - 18) + 'px'
                    } else {
                        this.cell.style.height = this.cell.scrollHeight + 'px';
                    }

                }
            },
            fileChange(response, file) {
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
                            this.tableData[this.temp_num]['value'] = response.data['data'];
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
                    this.tableData[this.temp_num]['value'] = response['data'];
                }

            },
            tempNum(i) {
                this.temp_num = i;
            },
        },
        computed: {
            monitorData() {
                return this.tableData;
            },
        },
        watch: {
            monitorData: {
                handler: function () {
                    if (this.tableData.length === 0) {
                        this.addTableRow()
                    }
                    if (this.tableData[this.tableData.length - 1]['key'] || this.tableData[this.tableData.length - 1]['value']) {
                        this.addTableRow()
                    }
                },
                deep: true
            },
        },
        mounted() {
            this.getKind()
        }

    }
</script>
<style>
</style>
