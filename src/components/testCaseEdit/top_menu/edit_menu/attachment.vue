<template>
  <div class="attachment-group">
    <div class="link ">
      <el-button class="tab-icons insert" @click="showOverlay"></el-button>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          链接
        <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="link-dropdown-list">
          <el-dropdown-item>插入链接</el-dropdown-item>
          <el-dropdown-item>移除已有链接</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="img">
      <el-button class="tab-icons insert" @click="showOverlay"></el-button>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          图片
        <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="img-dropdown-list">
          <el-dropdown-item>插入图片</el-dropdown-item>
          <el-dropdown-item>移除已有图片</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="remark">
      <el-button class="tab-icons insert" @click="showOverlay"> </el-button>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          批注
        <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="remark-dropdown-list">
          <el-dropdown-item>插入批注</el-dropdown-item>
          <el-dropdown-item>移除已有批注</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>

</template>

<script>
  import {
    mapGetters,
    mapActions,
    mapMutations
  } from 'vuex'
  export default {
    name: 'attachment',
    data() {
      return {
        options1: [{
          value: '选项1',
          label: '插入链接'
        }, {
          value: '选项2',
          label: '移除已有链接'
        }],
        options2: [{
          value: '选项1',
          label: '插入图片'
        }, {
          value: '选项2',
          label: '移除已有图片'
        }],
        options3: [{
          value: '选项1',
          label: '插入备注'
        }, {
          value: '选项2',
          label: '移除已有备注'
        }],
        value1: '',
        value2: '',
        value3: ''
      }
    },
    computed: {
      ...mapGetters({
        count: 'count'
      })
    },
    methods: {
      // ...mapMutations({
      //   changeCount: 'changeCount',
      // }),
      ...mapActions([
        'changeCount',
        'increment',
        'clearMemory',
        'setMemory',
      ]),
      test(key, value) {
        this.clearMemory(key, value);
      },
      showOverlay() {
        this.$msgbox({
          title: '输入',
          message: '暂时未实现，敬请期待！',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          }
        }).then(action => {
          // this.$message({
          //   type: 'info',
          //   message: 'action: ' + action
          // });
        });
      },
    }
  }

</script>
