<template>
  <div class="">
    <el-container :class="{'hideSidebar':asideStatus}">
      <MyAside/>
      <el-container class="main-container">
        <el-header style="height: 40px;">
        <reportHeader />
        </el-header>
        <el-main style="background-color: #ffffff;box-shadow:0px 0px 3px #abbed4;margin:10px">
          <reportShowM />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import reportShowM from './components/reportShowM'
import reportHeader from './components/reportHeader'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'reportManage',
  components: {
    reportShowM,
    reportHeader,
  },
  methods: {
    ...mapMutations('user', ['SET_COLLAPSE']),
  },
  mounted() {
    // this.getTitle();
    this.SET_COLLAPSE(true)
  },
  computed: {
    ...mapGetters([
      'asideStatus',

    ])
  },

}
</script>
