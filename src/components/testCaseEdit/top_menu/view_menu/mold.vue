<template>
<div class="mold-group" :disabled="disabled">
  <el-row class="block-col-1">
    <el-col :span="24">
      <!-- <span class="demonstration">click 激活</span> -->
      <el-dropdown trigger="click" :hide-on-click="true" class="dropdown-toggle mold-icons menu-btn" @command="handleCommand" :class="class_mold_index">
        <span class="el-dropdown-link ">
        <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown" class="mold-dropdown-list">
          <el-dropdown-item class="mold-1 dropdown-item mold-icons" command="0"></el-dropdown-item>
          <el-dropdown-item class="mold-2 dropdown-item mold-icons" command="1"></el-dropdown-item>
          <el-dropdown-item class="mold-3 dropdown-item mold-icons" command="2"></el-dropdown-item>
          <el-dropdown-item class="mold-4 dropdown-item mold-icons" command="3"></el-dropdown-item>
          <el-dropdown-item class="mold-5 dropdown-item mold-icons" command="4"></el-dropdown-item>
          <el-dropdown-item class="mold-6 dropdown-item mold-icons" command="5"></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'mold',
  data() {
    return {
      mold_index: 1,
    }
  },
  computed: {
    ...mapGetters({
      'minder': 'getMinder'
    }),
    class_mold_index() {
      return 'mold-' + this.mold_index
    },
    disabled() {
      return this.minder.queryCommandState && this.minder.queryCommandState('template') === -1
    },
    templateList() {
      return kityminder.Minder.getTemplateList();
    }
  },
  methods: {
    handleCommand(command) {
      this.mold_index = ~~command + 1;
       this.minder.execCommand('template', Object.keys(this.templateList)[command]);
    }
  }
}

</script>
