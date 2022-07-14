<template>
  <div class="app-container">
    <h1>{{this.d}}</h1>
    <el-button type="primary" @click.native="findMsg()">请点击</el-button>
  </div>
</template>

<script>
  export default {
    name:"hello",
    data() {
      return {
        d:'helloi',

      }
    },
    methods: {
      findMsg() {
        this.$axios.get('/api/test/list', {}).then((response) => {
          this.d = response.data.msg
              console.log(response.data)
            }
        )
      },
    },
    mounted() {
      this.findMsg();
    },
  }
</script>
<style>

.h1 {
  font-size:100px;/*px*/
  text-align:center;
  margin-top:10vh;
}

</style>
