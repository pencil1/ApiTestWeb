
<template lang="jade">

div
  h1( align="center") Vue Scrollbar
  vue-scrollbar( classes="my-scrollbar" v-bind:speed=53 )
    .scroll-me
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .kolom
      .clearfix
br
br
h3( align="center" )
  a( href="https://github.com/BosNaufal/vue-scrollbar" ) Fork Me On Github!
</template>

<script>

  require('../../sass/main.sass');
  import vueScrollbar from './vue-scrollbar.vue';

  export default {
    components: { vueScrollbar }
  };


</script>
