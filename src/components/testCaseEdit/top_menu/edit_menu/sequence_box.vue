<template>
<div class="sequence-group">
  <ul :disabled="commandDisabled">
    <li v-for="(item, index) in items" class="menu-btn" :class="classArray(index)" @click="execCommand(index)" :title="title(index)" ></li>
  </ul>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'sequence_box',
  data() {
    return {
      items: [
        { id: '0' },
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        { id: '6' },
        { id: '7' },
        { id: '8' },
        { id: '9' }
      ],
    }
  },
  computed: {
    ...mapGetters({
      'minder': 'getMinder'
    }),
    commandDisabled() {
      var minder = this.minder
      minder.on && minder.on('interactchange', function () {
        this.commandValue = minder.queryCommandValue('priority');
      });
      return minder.queryCommandState && minder.queryCommandState('priority') === -1;
    },
  },
  methods: {
    execCommand(index) {
      this.commandDisabled || this.minder.execCommand('priority', index)
    },
    classArray(index) {
      var isActive = this.minder.queryCommandValue && this.minder.queryCommandValue('priority') == index;
      var sequence = 'sequence-' + index;

      // 用数组返回多个class
      var arr = [
        {'active': isActive}, sequence
      ]
      return arr
    },
    title(index) {
      switch (index) {
        case 0:
          return '移除优先级';
        default:
          return '优先级' + index;
      }
    }
  },

}

</script>
