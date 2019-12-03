<template lang="html">
  <header :style='{marginLeft:leftNum}'>

    <ul id="mind_tab">
      <li :class="{selected:switchShow.showEditMenu}">
        <a href="javascritp:;" class="btn-showEditMenu" @click="showMenu">思维导图</a>
      </li>
      <li :class="{selected:switchShow.showViewMenu}">
        <a href="javascritp:;" class="btn-showViewMenu" @click="showMenu">外观样式</a>
      </li>
    </ul>
    <div id="mind_tab-content">
      <div class="mind-tab-panel" v-show="switchShow.showEditMenu">
        <edit-menu></edit-menu>

      </div>
      <div class="mind-tab-panel" v-show="switchShow.showViewMenu">
        <view-menu></view-menu>
      </div>

    </div>

  </header>
</template>

<script>
  import editMenu from './top_menu/edit_menu/edit_menu'
  import viewMenu from './top_menu/view_menu/view_menu'
  export default {
    name: 'headerVue',
    data() {
      return {
        leftNum:'400px',
        switchShow: {

          showEditMenu: true,
          showViewMenu: false
        }
      }
    },
    created() {
            this.$eventBus.$on('setLeftNum', (msg) => {
                this.leftNum = msg.headerMenuNum

            })


        },
    components: {
      editMenu,
      viewMenu
    },
    methods: {
      showMenu: function (e) {
        for (var variable in this.switchShow) {
          if (this.switchShow.hasOwnProperty(variable)) {
            this.switchShow[variable] = false
          }
        }
        this['switchShow'][e.target.className.replace('btn-', '')] = true
      }
    }
  }

</script>

<style lang="scss">
  @import "style/header";

</style>
