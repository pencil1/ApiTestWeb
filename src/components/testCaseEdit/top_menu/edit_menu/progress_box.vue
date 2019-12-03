<template>
  <div class="progress-group">
    <ul>
      <ul :disabled="commandDisabled">
        <li v-for= "(item, index) in items" class="menu-btn" :class="classArray(index)" @click="execCommand(index)" :title="title(index)" ></li>
      </ul>
    </ul>
  </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'progress_box',
  data() {
    return {
      items: [
        { text: '0' },
        { text: '1' },
        { text: '2' },
        { text: '3' },
        { text: '4' },
        { text: '5' },
        { text: '6' },
        { text: '7' },
        { text: '8' },
        { text: '9' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      'minder': 'getMinder'
    }),
    commandDisabled() {
      var minder = this.minder
      minder.on && minder.on('interactchange', function () {
        this.commandValue = minder.queryCommandValue('progress');
      });
      return minder.queryCommandState && minder.queryCommandState('progress') === -1;
    },
  },
  methods: {
    execCommand(index) {
      this.commandDisabled || this.minder.execCommand('progress', index)
    },
    classArray(index) {
      var isActive = this.minder.queryCommandValue && this.minder.queryCommandValue('progress') == index;
      var sequence = 'progress-' + index;

      // 用数组返回多个class
      var arr = [
        {'active': isActive}, sequence
      ]
      return arr
    },
    title(index) {
      switch (index) {
        case 0: return '移除进度';
						case 1: return '未开始';
						case 9: return '全部完成';
						default: return '完成' + (index - 1) + '/8';
      }
    }
  },
  created(){
  }
}

</script>
