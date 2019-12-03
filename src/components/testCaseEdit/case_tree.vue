<template>
    <div>
        <el-card class="box-card" style="width: 70px;position: absolute;margin-top: 3px;margin-left: 5px;height: 905px;"
                 :body-style="{ padding: '10px' }" shadow="always" v-show="!showView">
            <el-button type="primary" size="mini" @click.native="collapse()">展示</el-button>
        </el-card>
        <el-card class="box-card" style="width: 390px;position: absolute;margin-top: 3px;margin-left: 5px;"
                 :body-style="{ padding: '10px' }" shadow="always" v-show="showView">
            <el-button-group style="float: right;">
                <el-button type="primary" size="mini" @click.native="initTestCaseFile()">新增</el-button>
                <el-button type="primary" size="mini" @click.native="initEditTestCaseFile()">编辑</el-button>
                <el-button type="primary" size="mini" @click.native="saveTestCaseFile(true)"
                           :disabled="tempTestCaseFileData.id === null || tempTestCaseFileData.status === 0">保存
                </el-button>
                <el-button type="primary" size="mini" @click.native="privatesTestCaseFile(true)" v-show="!privates">私人
                </el-button>
                <el-button type="primary" size="mini" @click.native="privatesTestCaseFile(false)" v-show="privates">所有
                </el-button>
                <el-button type="primary" size="mini" @click.native="collapse()">隐藏</el-button>
                <el-button type="danger" size="mini"
                           @click.native="delTestCaseFileBtn">
                    删除
                </el-button>
            </el-button-group>
            <hr style="height:1px;border:none;border-top:1px solid rgb(241, 215, 215);margin-top:30px"/>
            <el-scrollbar wrapStyle="height:860px;">


                <el-tree :data="treeData"
                         :props="defaultProps"
                         @node-click="handleNodeClick"
                         highlight-current

                >
                            <span class="custom-tree-node span-ellipsis" slot-scope="{ node, data }">
                            <span :title="node.label">
                                <i :class=" data.status === 0? 'el-icon-folder test1' :  'el-icon-document test'"
                                ></i>{{ node.label }}
                            </span>
                        </span>

                </el-tree>
            </el-scrollbar>
        </el-card>


        <el-dialog title="文件夹配置" :visible.sync="tempTestCaseFileData.viewStatus">
            <el-divider></el-divider>
            <el-radio-group v-model="addTestCaseFileData.status" :disabled="this.addTestCaseFileData.id !== null">
                <el-radio :label=0>文件夹类</el-radio>
                <el-radio :label=1>测试文件</el-radio>
            </el-radio-group>
            <el-divider direction="vertical"></el-divider>

            <el-radio-group v-model="addTestCaseFileData.idChoice" :disabled="this.addTestCaseFileData.id !== null">
                <el-radio :label=1>新增同级</el-radio>
                <el-radio :label=2>新增下级</el-radio>
            </el-radio-group>
            <el-divider></el-divider>
            <el-form>
                <el-form-item label="文件夹名称" label-width="100px">
                    <el-input v-model="addTestCaseFileData.name">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="tempTestCaseFileData.viewStatus = false">取 消</el-button>
                <el-button type="primary" size="small" @click.native="addTestCaseFile()">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import {mapGetters, mapActions, mapMutations} from "vuex";

    export default {

        name: 'case_tree',
        components: {},
        computed: {
            ...mapGetters({
                minder: "getMinder",
                config: "config"
            }),
            monitorFileDataStatus() {
                return this.tempTestCaseFileData.status;
            }
            ,
        },
        watch: {
            monitorFileDataStatus: {
                handler: function () {
                    if (this.tempTestCaseFileData.status === 0) {

                        clearInterval(this.timer);

                    } else {
                        this.timer = window.setInterval(() => {
                            setTimeout(this.saveTestCaseFile(false), 0)
                        }, 30000)
                    }
                }
                ,
                deep: true
            }
        },
        data() {
            return {
                showView: true,
                timer: null,
                privates: true,
                tempTestCaseFileData: {
                    name: null,
                    viewStatus: false,
                    id: null,
                    higherId: 0,
                    status: 0,
                },
                addTestCaseFileData: {
                    name: null,
                    id: null,
                    higherId: 0,
                    status: 0,
                    idChoice: 1,
                    num: null,
                },
                tempTreeData: {
                    data: Object,
                    node: Object,
                },
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods: {
            ...mapActions([
                'executeCallback'
            ]),
            ...mapMutations([
                'setMinder',
                'setEditor'
            ]),

            collapse: function () {
                this.showView = !this.showView;
                if (this.showView) {
                    let leftNums = {headerMenuNum: '400px', mainEditorNum: '400px', navigatorNum: '420px'};
                    this.$eventBus.$emit('setLeftNum', leftNums)
                } else {
                    let leftNums = {headerMenuNum: '80px', mainEditorNum: '80px', navigatorNum: '100px'};
                    this.$eventBus.$emit('setLeftNum', leftNums)
                }

            },
            initTestCaseFile() {
                this.addTestCaseFileData.status = 0;
                this.addTestCaseFileData.idChoice = 1;
                this.addTestCaseFileData.id = null;
                this.addTestCaseFileData.name = null;
                this.tempTestCaseFileData.viewStatus = true

            },
            initEditTestCaseFile() {
                this.addTestCaseFileData = this.tempTestCaseFileData;
                this.tempTestCaseFileData.viewStatus = true

            },
            privatesTestCaseFile(status) {
                this.privates = status;
                this.findTestCaseFile()


            },
            getTestCaseFile(ids) {
                this.$axios.post(this.$api.getTestCaseFileApi, {'id': ids}).then((response) => {
                        if (this.messageShow(this, response)) {
                            window.localStorage.mindText = response.data.data;
                            this.$eventBus.$emit('getTestCaseFileData', true)
                        }
                    }
                )
            },
            saveTestCaseFile(show) {

                this.$axios.post(this.$api.saveTestCaseFileApi, {
                    'ids': this.tempTestCaseFileData.id,
                    'show': show,
                    'data': window.localStorage.mindText
                }).then((response) => {
                        this.messageShow(this, response)
                    }
                )
            },
            delTestCaseFileBtn() {
                if (!this.tempTestCaseFileData.id) {
                    this.$message({
                        showClose: true,
                        message: '请先选择右侧文件',
                        type: 'warning',
                    });
                    return
                }
                this.sureView(this.delTestCaseFile, this.tempTestCaseFileData.id, this.tempTestCaseFileData.name)
            },
            delTestCaseFile(id) {

                this.$axios.post(this.$api.delTestCaseFileApi, {'id': id}).then((response) => {
                        if (this.messageShow(this, response)) {
                            const parent = this.tempTreeData.node.parent;
                            const children = parent.data.children || parent.data;
                            const index = children.findIndex(d => d.id === this.tempTreeData.data.id);
                            children.splice(index, 1);

                            // 顺便初始化临时数据
                            this.tempTestCaseFileData.status = 0;
                            this.tempTestCaseFileData.idChoice = 1;
                            this.tempTestCaseFileData.higherId = 0;
                            this.tempTestCaseFileData.id = null;
                            this.tempTestCaseFileData.name = null;
                        }

                        // this.form.configName = null;
                        // if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
                        //     this.currentPage = this.currentPage - 1
                        // }
                        // this.findConfig();
                    }
                )
            },
            addTestCaseFile() {
                //  添加文件
                if (this.addTestCaseFileData.idChoice === 1) {
                    this.addTestCaseFileData.higherId = this.tempTestCaseFileData.higherId
                } else if (this.addTestCaseFileData.idChoice === 2) {
                    if (!this.tempTestCaseFileData.id) {
                        this.$message({
                            showClose: true,
                            message: '请先选择右侧文件',
                            type: 'warning',
                        });
                        return
                    }
                    this.addTestCaseFileData.higherId = this.tempTestCaseFileData.id
                }
                this.$axios.post(this.$api.addTestCaseFileApi, {
                    'name': this.addTestCaseFileData.name,
                    'higherId': this.addTestCaseFileData.higherId,
                    'status': this.addTestCaseFileData.status,
                    'id': this.addTestCaseFileData.id,
                    'num': this.addTestCaseFileData.num,
                }).then((response) => {
                        if (this.messageShow(this, response)) {
                            this.tempTestCaseFileData.viewStatus = false;
                            if (this.addTestCaseFileData.id) {
                                this.tempTreeData.data.name = this.addTestCaseFileData.name
                            } else {
                                if (this.addTestCaseFileData.idChoice === 1) {
                                    const newChild = {
                                        name: this.addTestCaseFileData.name,
                                        children: [],
                                        status: this.addTestCaseFileData.status,
                                        'higherId': response.data.higher_id,
                                        'id': response.data.id,
                                    };
                                    if (response.data.higher_id === 0) {
                                        this.treeData.push(newChild);
                                    } else {

                                        this.tempTreeData.node.parent.data.children.push(newChild);
                                    }


                                } else if (this.addTestCaseFileData.idChoice === 2) {
                                    const newChild = {
                                        name: this.addTestCaseFileData.name,
                                        children: [],
                                        status: this.addTestCaseFileData.status,
                                        'higherId': response.data.higher_id,
                                        'id': response.data.id,
                                    };
                                    if (!this.tempTreeData.data.children) {
                                        this.$set(this.tempTreeData.data, 'children', []);
                                    }
                                    this.tempTreeData.data.children.push(newChild);
                                }
                            }


                            // this.initBaseData();
                        }
                    }
                )
            },

            handleNodeClick(data, node) {
                if (this.tempTestCaseFileData.status === 1) {

                    this.saveTestCaseFile(false);
                }
                this.tempTreeData.data = data;
                this.tempTreeData.node = node;

                this.tempTestCaseFileData.id = data.id;
                this.tempTestCaseFileData.higherId = data.higher_id;
                this.tempTestCaseFileData.name = data.name;
                this.tempTestCaseFileData.num = data.num;
                this.tempTestCaseFileData.status = data.status;

                if (data.status === 1) {
                    this.getTestCaseFile(data.id)
                } else {
                    this.$eventBus.$emit('getTestCaseFileData', false)
                }
            },

            findTestCaseFile() {

                this.$axios.post('/api/testCaseFile/find', {'privates': this.privates}).then((response) => {
                        if (response.data['status'] === 0) {
                            this.$message({
                                showClose: true,
                                message: response.data['msg'],
                                type: 'warning',
                            });
                        } else {
                            this.treeData = response.data['data'];

                        }
                    }
                )
            },

        },

        mounted() {
            this.findTestCaseFile();

        },
    }

</script>
<style lang="scss">
    .test {
        color: #66b1ff;
    }

    .test1 {
        color: #d27676;
    }

    .span-ellipsis {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>