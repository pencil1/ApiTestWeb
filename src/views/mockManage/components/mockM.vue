<template>
  <div class="mockManage">


    <el-form :inline="true" class="demo-form-inline search-style" size="small">
      <el-form-item label="项目" labelWidth="110px">
        <el-select v-model="form.projectId" placeholder="请选择项目" @change="ProjectChoice">
          <el-option
              v-for="(item) in this.proAndIdData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="请输入名称" v-model="form.mockName" style="left: 10px">
        </el-input>

      </el-form-item>
      <el-form-item>

        <el-input placeholder="请输入地址" v-model="form.url" style="left: 10px">
        </el-input>
      </el-form-item>
      <el-form-item style="padding-left: 15px">
        <el-button type="primary" @click.native="handleCurrentChange(1)" size="small">搜索</el-button>
        <el-button type="primary" @click.native="$refs.mockEditViewFunc.initData()">添加mock接口
        </el-button>
      </el-form-item>
    </el-form>
    <el-tabs value="first" class="table_padding">
      <el-tab-pane label="mock接口列表" name="first">
        <!--<el-scrollbar wrap-class="scrollbarList">-->
        <el-table :data="tableData"
                  :max-height="this.$store.state.tableHeight"
                  stripe>

          <el-table-column
              :show-overflow-tooltip=true
              width="200"
              prop="name"
              label="名称"
          >
          </el-table-column>
          <el-table-column
              prop="url"
              label="url"
              minWidth="150">
          </el-table-column>
          <el-table-column
              label="操作"
              width="300"
          >
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click.native="editCopyMockApi(tableData[scope.$index]['id'],'edit')">
                编辑
              </el-button>
              <el-button type="primary" icon="el-icon-tickets" size="mini"
                         @click.native="editCopyMockApi(tableData[scope.$index]['id'],'copy')">
                复制
              </el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click.native="sureView(delMockApi,tableData[scope.$index]['id'],tableData[scope.$index]['name'])">
                删除
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
    <mockEditView :projectId="form.projectId" @findMockApi="findMockApi" ref="mockEditViewFunc"></mockEditView>
  </div>
</template>

<script>
import mockEditView from './mockEditView.vue'

export default {
  components: {
    mockEditView,
  },
  name: 'mockManage',
  data() {
    return {
      proAndIdData: '',
      tableData: [],
      total: 1,
      currentPage: 1,
      sizePage: 20,
      form: {
        projectId: '',
        mockName: '',
        url: '',
      },
    }
  },
  methods: {
    ProjectChoice() {
      this.findMockApi();
    },
    initData() {
      this.$axios.get(this.$api.baseDataApi).then((response) => {
            this.proAndIdData = response.data['data'];
            if (response.data['user_pros']) {
              this.form.projectId = this.proAndIdData[0].id;
              this.findMockApi();
            }
          }
      );
    },
    findMockApi() {
      this.$axios.post(this.$api.findMockApiApi, {
        'page': this.currentPage,
        'projectId': this.form.projectId,
        'mockName': this.form.mockName,
        'url': this.form.url,
        'sizePage': this.sizePage,
      }).then((response) => {
            if (this.messageShow(this, response)) {
              this.tableData = response.data.data;
              this.total = response.data.total;
            }
          }
      )
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.findMockApi()
    },
    handleSizeChange(val) {
      this.sizePage = val;
      this.findMockApi()
    },
    editCopyMockApi(mockId, status) {
      this.$refs.mockEditViewFunc.editCopyData(mockId, status)

    },
    delMockApi(mockApiId) {
      this.$axios.post(this.$api.delMockApiApi, {'id': mockApiId}).then((response) => {
            this.messageShow(this, response);
            this.form.apiName = null;
            if ((this.currentPage - 1) * this.sizePage + 1 === this.total) {
              this.currentPage = this.currentPage - 1
            }
            this.findMockApi();
          }
      )
    },
  },
  mounted() {
    this.initData()
  },
}
</script>

<style>

</style>
