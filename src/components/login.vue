<template>
  <div class="loginStyle">
    <div class="logo">
      <a href="#">
        <h1>iHome</h1>
      </a>
    </div>
    <div class="contentStyle">
      <h3 class="form-title">登录</h3>
      <template>
        <el-tabs v-model="activeName2" type="card">
          <!--<el-tabs type="card">-->
          <el-tab-pane label="管理员" name="first">
            <el-form>
              <el-form-item>
                <el-input type="text" placeholder="请输入用户名" v-model="username" clearable :maxlength=20></el-input>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入密码" type="password" v-model="password" clearable :maxlength=20 @keyup.enter.native='loginEvent'></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
      <el-alert v-show="isError === 1" :title="titleError" type="error" show-icon>
      </el-alert>
      <div class="form-actions clearfix">
        <el-button type="primary" @click="loginEvent">登录</el-button>
      </div>
    </div>
    <div class="copyright"> 2017 © iHome.</div>
  </div>
</template>

<style scoped>
.logo {
  padding-top: 60px;
  margin: 0 auto 20px;
  text-align: center;
}

.logo a {
  text-decoration: none;
}

.form-actions {
  text-align: right;
}

.contentStyle {
  background: url('../../static/img/bg-white-lock.png');
  width: 360px;
  margin: 0 auto;
  padding: 20px 30px 15px;
}

.form-title {
  margin-bottom: 20px;
}

.form-control {
  height: 42px;
  padding: 6px 30px;
}

.icon {
  color: #ccc;
  font-size: 14px;
  position: absolute;
  left: 10px;
  top: 13px;
}

.form-group {
  position: relative;
}

.tab-pane {
  margin-top: 15px;
  color: #000;
}

.bottomStyle label {
  vertical-align: bottom;
}

.bottomStyle input {
  width: 20px;
  height: 20px;
}

.copyright {
  text-align: center;
  margin: 0 auto;
  padding: 10px;
  color: #eee;
  font-size: 13px;
}

.remberStyle {
  height: 34px;
}

.clickTag {
  display: inline-block;
  height: 20px;
  width: 20px;
  border: 1px solid #d9d9d9;
  text-align: center;
  cursor: pointer;
}

.icons {
  color: #d9d9d9;
  font-size: 1px;
}

.remberIS {
  color: #fff;
  display: inline-block;
  font-weight: 300;
  /*height: 20px;*/
  line-height: 20px;
  margin-left: 10px;
  cursor: pointer;
}

.closeStyle {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}
</style>

<script>
import $ from 'jquery';
//  import Qs from "qs";
import a from "../../static/img/1.jpg";
import b from "../../static/img/2.jpg";
import c from "../../static/img/3.jpg";
import d from "../../static/img/4.jpg";
//   1. 怎么让一个插进在一个vue组件中生效，跳转到其他路由这个插件不起作用？
import "../../static/plugin/backstretch/jquery.backstretch.min.js";
import Qs from 'qs'
export default {
  data() {
    return {
      username: "",
      password: "",
      isShow: true,
      isError: false,
      titleError: '',
      activeName2: 'first'
    }
  },
  created() {
  },
  methods: {// 方法的使用
    initBgc() {
      $('.loginStyle').backstretch([a, b, c, d,], {
        fade: 1000,
        duration: 8000
      });
    },
    // 点击登录到home页面
    loginEvent() {
      var reg_username = /^[\u4E00-\u9FA5A-Za-z0-9(~!@#￥%&*)]+$/;
      var reg_password = /^[A-Za-z0-9(~!@#￥%&*)]+$/;

      // 先做判断
      if (this.username === '') {
        this.$message.error('错了哦，用户名不能为空！！');
      } else if (!reg_username.test(this.username)) {
        this.$message.error('不支持特殊字符');
      } else if (this.password === '') {
        this.$message.error('错了哦，密码不能为空！！');
      } else if (!reg_password.test(this.password)) {
        this.$message.error('不支持特殊字符');
      } else {
        var datas = Qs.stringify({ "username": this.username, "password": this.password });
        this.$http.post('user/login', datas).then(res => {
          console.log(res)
          if (res.data.error_code == 2000) {
            console.log(res)
            sessionStorage.setItem('adminId', res.data.data.id);
            this.isError = 0;
            this.titleError = '';
            sessionStorage.setItem('loginUserName', res.data.data.username);
            this.$router.push({ path: '/welcome' });
          } else if (res.data.error_code != 2000) {
            this.$message.error(res.data.error_message);
          };
        }).catch(error => {
          console.log(error)
          this.$message.error('错了哦，请求错误！！');
          console.log(error);
        })
      }
    },

    remberMe() {
      this.isShow = !this.isShow
    },
    closeEvent() {
      this.isError = false;
    }
  },
  mounted() {// 元素挂载到页面上去了
    var h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    console.log(h);
    $('.loginStyle').css('height', h);
    this.initBgc();
  }
}
</script>
