<template>
<div class="arrange-group">
  <div class="arrange menu-btn" @click="resetlayout" :disabled="disabled">
    <span class="tab-icons"></span>
    <span class="label">整理布局</span>
  </div>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'arrange',
  computed:{
    ...mapGetters({
      'minder':'getMinder'
    }),
    disabled(){
      return this.minder.queryCommandState && this.minder.queryCommandState('resetlayout') === -1;
    }
  },
  methods:{
    resetlayout(){
      this.minder.queryCommandState('resetlayout') === -1 || this.minder.execCommand('resetlayout')
    }
  }
}

</script>
