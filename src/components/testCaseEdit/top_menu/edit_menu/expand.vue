<template>
<div class="expand-group">

  <el-button class="tab-icons expand" @click="expandAll"></el-button>
  <el-row class="block-col-1">
    <el-col :span="24">
      <!-- <span class="demonstration">click 激活</span> -->
      <el-dropdown trigger="click" :hide-on-click="true" class="dropdown-toggle menu-btn" @command="handleCommand">
        <span class="el-dropdown-link ">
            展开
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown" class="expand-dropdown-list">
          <el-dropdown-item class="expand-1 dropdown-item " command="1">展开到一级节点</el-dropdown-item>
          <el-dropdown-item class="expand-2 dropdown-item " command="2">展开到二级节点</el-dropdown-item>
          <el-dropdown-item class="expand-3 dropdown-item " command="3">展开到三级节点</el-dropdown-item>
          <el-dropdown-item class="expand-4 dropdown-item " command="4">展开到四级节点</el-dropdown-item>
          <el-dropdown-item class="expand-5 dropdown-item " command="5">展开到五级节点</el-dropdown-item>
          <el-dropdown-item class="expand-6 dropdown-item " command="6">展开到六级节点</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</div>

</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'expand',
  computed: {
    ...mapGetters({
      'minder': 'getMinder'
    })

  },
  methods: {
    handleCommand(command) {
      this.minder.execCommand && this.minder.execCommand('ExpandToLevel', command);
    },

    expandAll() {
      this.minder.execCommand && minder.execCommand('ExpandToLevel', 9999);
    }
  }
}

</script>
