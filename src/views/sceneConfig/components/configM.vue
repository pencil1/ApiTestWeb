<template>
    <div class="sceneConfig">

        <el-form :inline="true" class="demo-form-inline search-style" size="small">
            <el-form-item label="项目名称" labelWidth="110px">
                <el-select v-model="form.projectId" placeholder="请选择项目" @change="findConfig">
                    <el-option
                            v-for="(item) in projectData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="配置名称">
                <el-input placeholder="请输入配置" v-model="form.configName">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click.native="configHandleCurrentChange(1)">
                    搜索
                </el-button>
                <el-button type="primary" @click.native="$refs.configEditFunc.initConfigData()">添加配置
                </el-button>
            </el-form-item>
        </el-form>

        <el-tabs value="first" class="table_padding">
            <el-tab-pane label="模块列表" name="first" style="margin: 0 0 -10px;">
                <el-table :data="tableData"
                          :max-height="this.$store.state.tableHeight"
                          stripe>
                    <el-table-column
                            prop="num"
                            label="编号"
                            min-width="40">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="模块名称"
                            min-width="250">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="250">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click.native="$refs.configEditFunc.editSceneConfig(tableData[scope.$index]['id'])">
                                编辑
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click.native="sureView(delConfig,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination">
                    <el-pagination
                            @current-change="configHandleCurrentChange"
                            @size-change="configHandleSizeChange"
                            :current-page="currentPage"
                            :page-size="sizePage"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="this.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>

        <configEdit
                :proAndIdData="projectData"
                :projectId="form.projectId"
                ref="configEditFunc">
        </configEdit>

    </div>
</template>

<script>
    import configEdit from './configEdit.vue'

    export default {
        components: {
            configEdit: configEdit,
        },
        name: 'config',
        data() {
            return {
                projectData:'',
                tableData: Array(),
                total: 1,
                currentPage: 1,
                sizePage: 20,
                form: {
                    projectId: null,
                    configName: null,
                },
            }
        },
        methods: {
            initBaseData() {
                this.$axios.get(this.$api.baseDataApi).then((response) => {
                        this.projectData = response.data['data'];
                        if (response.data['user_pros']) {
                            this.form.projectId = this.projectData[0].id;
                            this.findConfig();
                        }
                    }
                );
            },
            configHandleCurrentChange(val) {
                this.currentPage = val;
                this.findConfig()
            },
            configHandleSizeChange(val) {
                this.sizePage = val;
                this.findConfig()
            },
            findConfig() {
                this.$axios.post(this.$api.findConfigApi, {
                    'projectId': this.form.projectId,
                    'configName': this.form.configName,
                    'page': this.currentPage,
                    'sizePage': this.sizePage,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.tableData = response.data['data'];
                            this.total = response.data['total'];
                        }
                    }
                )
            },
            delConfig(id) {
                this.$axios.post(this.$api.delConfigApi, {'id': id}).then((response) => {
                        this.messageShow(this, response);
                        this.form.configName = null;
                        if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                            this.currentPage = this.currentPage - 1
                        }
                        this.findConfig();
                    }
                )
            },
        },
        mounted() {
            this.initBaseData();
        },
    }
</script>
<style>
</style>
