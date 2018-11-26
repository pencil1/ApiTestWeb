<template>
    <div class="configEdit">

        <el-dialog title="配置管理" :visible.sync="configData.modelFormVisible" width="50%">
            <el-tabs value="second">


                <el-tab-pane label="基础信息" name="second" style="margin-top: 10px">
                        <el-form :inline="true"  size="small" >
                            <el-form-item label="项目名称">
                                <el-select v-model="configData.projectName" placeholder="请选择项目" size="small">
                                    <el-option
                                            v-for="(item, key) in proModelData"
                                            :key="key"
                                            :value="key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="配置名称">
                                <el-input v-model="configData.name" size="small">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    <el-form :inline="true"  size="small" class="demo-form-inline" >
                        <el-form-item label="函数文件">
                            <el-select v-model="configData.funcAddress" multiple  placeholder="请选择导入函数文件" size="small">
                                <el-option
                                        v-for="item in this.funcAddress"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="配置序号"
                                      v-if="configData.id">
                            <el-input v-model.number="configData.num" size="small">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="addConfigVariable()">添加变量</el-button>
                        </el-form-item>
                    </el-form>

                    <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top: -5px"/>
                    <el-table :data="configData.variable" stripe :show-header="false">
                        <el-table-column label="Key" header-align="center" minWidth="100">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.key" size="mini" placeholder="key">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="Value" header-align="center" minWidth="200">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.value" size="mini" placeholder="Value">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" header-align="center" minWidth="80">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="mini" placeholder="备注">
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" header-align="center" width="80">
                            <template slot-scope="scope">
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click.native="delConfigVariable(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click="configData.modelFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click.native="addSceneConfig()" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'configEdit',
        props: ['proModelData', 'funcAddress', 'projectName'],
        data() {
            return {
                configData: {
                    funcAddress: Array(),
                    id: null,
                    num: null,
                    modelFormVisible: false,
                    projectName: null,
                    name: null,
                    formLabelWidth: '80px',
                }
            }
        },
        methods: {
            initConfigData() {
                this.configData.name = null;
                this.configData.projectName = this.projectName;
                this.configData.funcAddress = Array();
                this.configData.id = null;
                this.configData.num = null;
                this.configData.variable = [{key: null, value: null, remark: null}];
                this.configData.modelFormVisible = true;

            },
            addConfigVariable() {
                this.configData.variable.push({key: null, value: null, remark: null});
            },
            addConfigVariable1() {
                console.log(this.configData.funcAddress)
                console.log(this.funcAddress)
            },
            delConfigVariable(i) {
                this.configData.variable.splice(i, 1);
            },
            addSceneConfig() {
                this.$axios.post(this.$api.addConfigApi, {
                    'projectName': this.configData.projectName,
                    'sceneConfigName': this.configData.name,
                    'funcAddress': this.configData.funcAddress,
                    'num': this.configData.num,
                    'id': this.configData.id,
                    'variable': JSON.stringify(this.configData.variable),
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.configData.modelFormVisible = false;
                            if (typeof this.$parent.findConfig === "function") {
                                this.$parent.findConfig();
                            }

                            // this.findConfig();
                        }
                    }
                )
            },
            editSceneConfig(id) {
                if (!id) {
                    this.$message({
                        showClose: true,
                        message: '请选择配置',
                        type: 'warning',
                    });
                    // if(response.data['error']){
                    //     return 'error'
                    // }
                    return
                }
                this.$axios.post(this.$api.editConfigApi, {'id': id}).then((response) => {
                        this.configData.name = response.data['data']['name'];
                        this.configData.num = response.data['data']['num'];
                        this.configData.variable = response.data['data']['variables'];
                        this.configData.funcAddress = response.data['data']['func_address'];
                        this.configData.projectName = this.projectName;
                        this.configData.id = id;
                        this.configData.modelFormVisible = true;
                    }
                )
            },
        },
        mounted() {
        },
    }
</script>
<style>
</style>
