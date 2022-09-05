<template>
  <div class="errorView">
    <el-dialog title="错误信息" :visible.sync="$store.state.showStatus" width="50%">
      <el-scrollbar :wrapStyle="this.$store.state.tableHeight+100">
        <pre style="color: #d04a4a">{{ this.$store.state.errorData }}</pre>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'errorView',
  data() {
    return {
      // viewStatus: false,
      // errorData: '',
    }
  },
  computed: {
    ...mapGetters([
      'errorData',
      'showStatus',
    ])
  },
  methods: {
    showData(data) {
      this.viewStatus = true;
      this.errorData = data;
    },
  },

}
</script>
<style>
</style>
