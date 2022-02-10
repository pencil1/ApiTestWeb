<template>
  <div class="tags" v-if="showTags">
    <ul style="margin: 1px;padding-left: 2px">
      <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index"
          v-contextmenu:contextmenu
          @contextmenu.prevent="getItem(item)">
        <router-link :to="item.path" class="tags-li-title">
          {{ item.title }}
        </router-link>
        <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
      </li>
    </ul>
    <v-contextmenu ref="contextmenu" >
      <v-contextmenu-item @click="refreshE">刷新</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'tags',
  data() {
    return {
      tagsList: [],
      tempItem: '',
    }
  },
  computed: {
    ...mapGetters([
      'cachedViews',

    ]),
    showTags() {
      return this.tagsList.length > 0;
    },
  },
  methods: {
    ...mapMutations('tags', ['SET_CACHED','REFRESH','DEL_CACHED']),

    isActive(path) {
      return path === this.$route.fullPath;
    },

    getItem(item) {
      // 右键标签的时候，触发该事件
      this.tempItem = item;
    },
    refreshE() {
      this.REFRESH(this.tempItem.name)
    },
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0];
      const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
      this.DEL_CACHED(delItem.name)
      // console.log(item)
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path);
      } else {

        this.$router.push('/home');
        this.setTags(this.$route);
      }
    },
    // 关闭全部标签
    closeAll() {
      this.tagsList = [];
      this.$router.push('/manage');
      this.setTags(this.$route);
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter(item => {
        return item.path === this.$route.fullPath;
      })
      this.tagsList = curItem;
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath;
      })
      if (!isExist) {
        if (this.tagsList.length >= 8) {
          this.tagsList.shift();
        }
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.name
        })
        this.SET_CACHED(route.name)
      }
    },
  },

  watch: {
    $route(newValue) {
      this.setTags(newValue);
    }
  },
  created() {
    this.setTags(this.$route);
  }
}

</script>


<style>
.tags {
  height: 35px;
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0 -1px 1px #a9cdf3;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 23px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all .1s ease-in;
  -moz-transition: all .1s ease-in;
  transition: all .1s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  text-decoration: none;
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 35px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
  z-index: 10;
}

.plugins-tips a {
  color: #20a0ff;
}

.el-upload--text em {
  color: #20a0ff;
}

.pure-button {
  background: #20a0ff;
}

.tags-li.active {
  border: 1px solid #26ccc2;
  background-color: #26ccc2;
}

.message-title {
  color: #20a0ff;
}

.collapse-btn:hover {
  background: rgb(40, 52, 70);
}
</style>
