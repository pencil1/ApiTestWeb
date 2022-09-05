<template>
  <div class="">
    <el-container :class="{'hideSidebar':asideStatus}">
      <MyAside/>
      <el-container class="main-container">
        <el-header style="height: 40px;">
          <MyHeader/>

        </el-header>
      <el-main style="background-color: #ffffff;box-shadow:0px 0px 3px #abbed4;margin:10px">
        <Tags/>
          <keep-alive :include="cachedViews">
        <router-view v-if="cacheStatus"></router-view>
        </keep-alive>

      </el-main>
    </el-container>
    </el-container>
  <errorView/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {

  components: {
    // login
  },
  methods: {
     initData(){
       this.$store.dispatch('GET_FUNC_DATA')
    }

  },
  created() {

   this.initData()
  },
  computed: {
    ...mapGetters([
      'asideStatus',
        'cachedViews',
        'cacheStatus',

    ])
  },

}
</script>
