<template lang="html">
<div class="menu-container">
   <expand></expand>
   <selection></selection>
  <insert-box></insert-box>
  <move-box></move-box>
  <edit-del></edit-del>
  <sequence-box></sequence-box>
  <progress-box></progress-box>


</div>
</template>

<script>
import insertBox from './insert_box'
import moveBox from './move_box'
import editDel from './edit_del'
import sequenceBox from './sequence_box'
import progressBox from './progress_box'
import expand from './expand'
import selection from './selection'


export default {
  name: 'edit_menu',
  components: {
    insertBox,
    moveBox,
    editDel,
    sequenceBox,
    progressBox,
    expand,
    selection,

  }
}

</script>
