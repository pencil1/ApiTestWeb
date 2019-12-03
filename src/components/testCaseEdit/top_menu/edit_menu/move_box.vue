<template >
<div class="move-group ">
  <div class="move-up menu-btn" :disabled="disabled1" @click="ArrangeUp">
    <i class="tab-icons"></i>
    <span>上移</span>
  </div>
  <div class="move-down menu-btn" :disabled="disabled2" @click="ArrangeDown">
    <i class="tab-icons"></i>
    <span>下移</span>
  </div>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'move_box',
  computed: {
    ...mapGetters({
      'minder': 'getMinder'
    }),
    disabled1() {
      var bool = false;
      bool = this.minder.queryCommandState && this.minder.queryCommandState('ArrangeUp') === -1
      return bool
    },
    disabled2() {
      var bool = false;
      bool = this.minder.queryCommandState && this.minder.queryCommandState('ArrangeDown') === -1
      return bool
    }
  },
  methods: {
    ArrangeUp() {
      this.minder.queryCommandState('ArrangeUp') === -1 || this.minder.execCommand('ArrangeUp')
    },
    ArrangeDown() {
      this.minder.queryCommandState('ArrangeDown') === -1 || this.minder.execCommand('ArrangeDown')
    }
  }
}

</script>
