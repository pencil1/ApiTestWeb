<template>
  <div class="">
    <testToolM />
    <testT />
  </div>
</template>

<script>
import testToolM from './components/testToolM.vue'
import testT from './components/testT.vue'

export default {
  name: 'testTool',
  components: {
    testToolM,
    testT,
  }

}
</script>

