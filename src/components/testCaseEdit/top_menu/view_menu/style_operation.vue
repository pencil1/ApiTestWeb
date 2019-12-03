<template>
<div class="style-group">
  <div class="clear-style-btn menu-btn" @click="clearstyle" :disabled="disabled1">
    <span class="tab-icons"></span>
    <span class="label">清除样式</span>
  </div>
  <div class="copy-paste-panel" @click="copystyle">
    <div class="copy-style menu-btn" :disabled="disabled2">
      <span class="tab-icons"></span>
      <span class="label">复制样式</span>
    </div>
    <div class="paste-style menu-btn" @click="pastestyle" :disabled="disabled3">
      <span class="tab-icons"></span>
      <span class="label">粘贴样式</span>
    </div>
  </div>
</div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  'name': 'style_opreation',
  computed: {
    ...mapGetters({
      minder: 'getMinder'
    }),
    disabled1() {
      return this.minder.queryCommandState && this.minder.queryCommandState('clearstyle') === -1
    },
    disabled2() {
      return this.minder.queryCommandState && this.minder.queryCommandState('copystyle') === -1
    },
    disabled3() {
      return this.minder.queryCommandState && this.minder.queryCommandState('pastestyle') === -1
    }
  },
  methods: {
    clearstyle() {
      this.minder.queryCommandState('clearstyle') === -1 || this.minder.execCommand('clearstyle')
    },
    copystyle() {
      this.minder.queryCommandState('copystyle') === -1 || this.minder.execCommand('copystyle')
    },
    pastestyle() {
      this.minder.queryCommandState('pastestyle') === -1 || this.minder.execCommand('pastestyle')
    }
  }
}

</script>
