<template>
<div class="menu-container">
  <mold></mold>
  <arrange></arrange>
  <styleOperation></styleOperation>
  <fontOperation></fontOperation>
</div>

</template>

<script>
import mold from './mold'
import arrange from './arrange'
import styleOperation from './style_operation'
import fontOperation from './font_operation.vue'

export default {
  name: 'view_menu',
  components: {
    mold,
    arrange,
    styleOperation,
    fontOperation
  }
}

</script>
