
<template>
  <div>
    <vue-scrollbar classes="my-scrollbar" ref="Scrollbar">
      <div class="scroll-me">
        <a href="https://google.com">
          <div class="kolom">Go To Google</div>
        </a>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="kolom"></div>
        <div class="clearfix"></div>
      </div>
    </vue-scrollbar>
  </div>
</template>

<script>

  import VueScrollbar from './vue-scrollbar.vue';
  require("../../../dist/style/vue2-scrollbar.css")
  require("../../../dist/style/app.css")

  export default {
    components: { VueScrollbar },
  };

</script>
