<template>
  <div class="caseHeader">
    <div @click.prevent="collapse1">
      <i :class="asideStatus? 'el-icon-s-unfold' : 'el-icon-s-fold'"
         style="cursor:pointer;float:left;line-height:40px;color: rgb(255, 255, 255);font-size: 25px"></i>
    </div>
    <el-dropdown style="float:right;line-height:25px;top:6px;color: rgb(255, 255, 255);"
                 @command="logOut">
                        <span class="el-dropdown-link">{{ this.userInfo.name }}<i
                            class="el-icon-arrow-down el-icon--right"></i></span>
      <el-dropdown-menu slot="dropdown" style="line-height:10px">
<!--        <el-dropdown-item command="b">修改密码</el-dropdown-item>-->
        <el-dropdown-item command="a">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
        title="修改密码"
        :visible.sync="passwordData.formVisible"
        width="30%"
        customClass="password-style"
    >
      <el-form>

        <el-form-item label="旧密码" :label-width="passwordData.formLabelWidth">
          <el-input v-model="passwordData.oldPassword" type="password">
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="passwordData.formLabelWidth">
          <el-input v-model="passwordData.newPassword" type="password">
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="passwordData.formLabelWidth">
          <el-input v-model="passwordData.surePassword" type="password">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="passwordData.formVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click.native="changePassword()" size="small">确 定</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {

  name: 'caseHeader',
  data() {
    return {
      userName: '',
      passwordData: {
        oldPassword: '',
        newPassword: '',
        surePassword: '',
        formVisible: false,
        formLabelWidth: '80px',
      },
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'asideStatus',

    ])
  },
  methods: {
    ...mapMutations('user', ['SET_COLLAPSE']),
    collapse1() {
      this.SET_COLLAPSE(!this.asideStatus)
    },
    changePassword() {
      this.$axios.post(this.$api.changePasswordApi,
          {
            'oldPassword': this.passwordData.oldPassword,
            'newPassword': this.passwordData.newPassword,
            'surePassword': this.passwordData.surePassword,

          }).then((response) => {
            if (this.messageShow(this, response)) {
              this.passwordData.formVisible = false;
            }
          }
      );
    },
    logOut(command) {
      if (command === "a") {
        // this.$store.commit(types.LOGOUT);
        window.location.token = ''
        window.open(this.$store.state.platformsUrl, "_self");

      } else if (command === 'b') {
        this.passwordData.oldPassword = '';
        this.passwordData.newPassword = '';
        this.passwordData.surePassword = '';
        this.passwordData.formVisible = true;
      }
    },
  },
  watch: {},
  mounted() {
  },
}
</script>

<style>
.el-header {
  background-color: #5c8eea;
  background-image: -webkit-gradient(linear, left top, right top, from(#393b3e), to(#5d6c79));
  color: #434650;

  line-height: 60px;
}

.password-style {
  line-height: 10px;
  border-radius: 5px;
}

.el-breadcrumb__inner {
  color: rgb(255, 255, 255);
}

.el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  color: rgb(255, 255, 255);
}


</style>
