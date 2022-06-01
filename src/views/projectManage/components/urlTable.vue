<template>
    <div>
      <el-table :data="tableData" size="mini" stripe :show-header="false">
        <el-table-column property="value" label="Value" header-align="center" minWidth="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value" size="mini"
                      placeholder="http://127.0.0.1:8010">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column property="value" label="操作" header-align="center" width="60">
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
        name: 'urlTable',
      props: ['tableData'],
        data() {
            return {
            }
        },
        methods: {
          addTableRow() {
              this.tableData.push({value: null});
            },
          delTableRow(i) {
            this.$confirm('删除url会影响到整体排序,接口那边的引用是依据url的顺序来的,请认真考虑一下?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.tableData.splice(i, 1);
            }).catch(() => {
            });
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

          this.tableData.push({value: null});
      }

    }
</script>
<style>
</style>
