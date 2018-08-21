<template>
    <div class="test">
        <el-form>
            <el-form-item size="medium">
                <el-input placeholder="Enter request URL" v-model="url" class="input-with-select" style="width: 80%;">
                    <el-select v-model="method" slot="prepend" placeholder="请选择">
                        <el-option label="POST" value="1"></el-option>
                        <el-option label="GET" value="2"></el-option>
                        <el-option label="PUT" value="3"></el-option>
                        <el-option label="DELETE" value="3"></el-option>
                    </el-select>
                    <el-button slot="append" type="primary" @click="paramFormVisible = true">Params</el-button>
                </el-input>

                <el-button type="primary" @click.native="sendMethod()" size="medium">Send</el-button>
            </el-form-item>
        </el-form>
        <!--<el-dialog title="" :visible.sync="paramFormVisible" width="42%">-->
        <el-table :data="theRequest" style="width:90%" size="mini" stripe :show-header="false">
            <el-table-column property="key" label="Key" header-align="center"
                             min-width="80">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.key" size="medium">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column property="value" label="Value" header-align="center" min-width="200">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.value" size="medium">
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column property="value" label="操作" header-align="center" width="80">
                <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                               @click.native="delParam(scope.$index)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addParam()" size="small" type="primary" style="float: left;">添加</el-button>
            <el-button @click="paramFormVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click.native="sureParam()" size="small">确 定
            </el-button>
        </div>
        <!--</el-dialog>-->
    </div>

</template>

<script>

    export default {
        name: 'test',
        data() {
            return {
                paramFormVisible: false,
                method: 'POST',
                theRequest: [{key: '', value: ''}],
                url: '',
                tableData: [],
                titleData: [],
                token: '',
                sqlList: '',
                showData: '',
            };
        },
        watch: {
            url: function () {
                if (!this.url){
                    return
                }
                if (this.url.indexOf('?') === -1){

                    return
                }
                let url = this.url.split("?");
                let strParam = url[1].split("&");
                if (strParam[0]) {
                    this.theRequest = Array();
                    for (let i = 0; i < strParam.length; i++) {
                        if (strParam[i].indexOf('=') !== -1) {
                            this.theRequest.push({
                                key: strParam[i].split("=")[0],
                                value: unescape(strParam[i].split("=")[1])
                            });
                        }
                        else {
                            this.theRequest.push({key: strParam[i], value: ''});
                        }
                    }
                }
            },
            theRequest: {
                handler: function (newVal) {
                    if (this.theRequest[this.theRequest.length - 1]['key'] || this.theRequest[this.theRequest.length - 1]['value']) {
                        this.addParam()
                    }
                    let strParam = '';
                    for (let i in this.theRequest) {
                        if (parseInt(i) + 2 === this.theRequest.length && this.theRequest[i].key) {
                            if (this.theRequest[i].value) {
                                strParam += this.theRequest[i].key + '=' + this.theRequest[i].value;
                            }
                            else {
                                strParam += this.theRequest[i].key;
                            }
                        }
                        else if (this.theRequest[i].key) {
                            strParam += this.theRequest[i].key + '=' + this.theRequest[i].value + '&';
                        }

                    }
                    if (strParam.substr(strParam.length - 1, 1) === '&') {
                        strParam = strParam.substring(0, strParam.length - 1)
                    }
                    this.url = this.url.split("?")[0] + '?' + strParam
                },
                deep: true
            }
        },
        mounted() {
        },
        methods: {
            delParam(i) {
                this.theRequest.splice(i, 1);
            },
            addParam() {
                this.theRequest.push({key: '', value: ''});
            },
            sureParam() {
                this.paramFormVisible = false;
                let strParam = '';
                for (let i in this.theRequest) {
                    if (parseInt(i) + 1 === this.theRequest.length && this.theRequest[i].key) {
                        strParam += this.theRequest[i].key + '=' + this.theRequest[i].value;
                    }
                    else if (this.theRequest[i].key) {
                        strParam += this.theRequest[i].key + '=' + this.theRequest[i].value + '&';
                    }

                }
                if (strParam.substr(strParam.length - 1, 1) === '&') {
                    strParam = strParam.substring(0, strParam.length - 1)
                }
                // for (var i = 0; i < this.theRequest.length; i++) {
                //
                //     if(i === this.theRequest.length){
                //         strParam += this.theRequest[i].key + '=' + this.theRequest[i].value;
                //     }
                //     else {
                //         strParam += this.theRequest[i].key + '=' + this.theRequest[i].value + '&';
                //     }
                // }
                this.url = this.url.split("?")[0] + '?' + strParam
            },
            hideShowParam(){
                console.log(123)
                // this.hideShowParamStatus = !this.hideShowParamStatus
            },
            sendMethod() {
                //     this.$axios({
                //         method:'post',
                //         url:'http://192.168.6.130:7022/bxr/users/login',
                //         data:{
                //         'agent.phone': '15813316716',
                //         'agent.password': '78929709',
                //     }
                // }).then((response) => {
                //     console.log(response.data())
                //         }
                //     )


                this.$axios.post('http://192.168.6.130:7022/bxr/users/login', {
                    'agent.phone': '15813316716',
                    'agent.password': '78929709',
                }).then((response) => {
                        // console.log(response.data())
                    }
                )
            },

        },

        mounted() {

        },

    }
</script>

<style>
    .el-select .el-input {
        width: 100px;
    }

    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
