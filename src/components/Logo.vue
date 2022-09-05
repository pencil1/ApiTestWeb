<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link class="sidebar-logo-link" to="/home">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'SidebarLogo',
  data() {
    return {
      title: '测试平台',
      logo: 'https://apptest.aulton.com/asset/files/logo_20220720114355666.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #545c64;
  text-align: center;
  overflow: hidden;
  background-image: -webkit-gradient(linear, left top, right top, from(#2c2d2d), to(#393b3e));

  border-bottom: 1px solid #545c64;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      //width: 32px;
      height: 32px;
      vertical-align: middle;
      transform: scale(0.85);

    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #c5acac;
      font-weight: 600;
      line-height: 40px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
