// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import moment from 'moment';
import ElementUI from 'element-ui'
import echarts from 'echarts'
import store from './store/store'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

Vue.prototype.$http = axios;

/*字体文件 公共的样式 */
import './assets/icon/iconfont.css'
import "./assets/css/common.css"

axios.defaults.timeout = 500000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// axios.defaults.baseURL = '192.168.0.204:3389/'//黄金芽
// axios.defaults.baseURL = 'http://192.168.0.208:8080'//徐文敏
// axios.defaults.baseURL = '192.168.0.201:8080/'//LJJ
axios.defaults.baseURL = '	http://develop.qhiehome.com:8091/web1.2'//研发测试
// axios.defaults.baseURL = 'http://operation.qhiehome.com:8082/web1.2/'//运营
// axios.defaults.baseURL = 'https://www.qhiehome.com/web1.2/'//生产
axios.defaults.withCredentials = true


axios.interceptors.response.use((res) => {
  if(res.data.error_code == 2902){
    sessionStorage.removeItem('adminId');
    router.replace({
      path: '/',
    });
    this.$message.warning('登录失效,请重新登录!!!');
  }
  return res;
}, (error) => {
  if(error.response.data.error_code == 2903){
    router.replace({
      path: '/welcome',
    });
    this.$message.error('无权限访问该页面!!!');
  }else if(error.response.data.error_code == 2902){
    router.replace({
      path: '/',
    });
    this.$message.error('尚未登录,无法访问!!!');
  }
});

router.afterEach((to,from,next) => {
  window.scrollTo(0,0)//页面展示最顶部
});

// 这个是做什么的（待查）
Vue.config.productionTip = false

//定义一个全局的过滤器(专门用来处理时间的)
Vue.filter('moment', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  return moment(value).format(formatString);
});

new Vue({
  el: '#app',
  data:{
    eventHub: new Vue()
  },
  router,
  template: '<App/>',
  components: {App},
  store,
  created() {
    store.eventHub = this;
  }
})
