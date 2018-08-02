<template>
  <div>
    <h2>APP登陆日志</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData" @change="clearStart">
        <el-form-item label="联系电话">
          <el-input placeholder="请输入联系电话" v-model.trim="searchFromData.phone" @change="clearStart"  @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="手机型号">
          <el-input placeholder="请输入手机型号" v-model.trim="searchFromData.phoneModel" @change="clearStart"></el-input>
        </el-form-item>
        <el-form-item label="登录的时间范围" label-width="150px">
          <div class="block">
            <el-date-picker
              v-model="value6"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="setTime">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--3.0 下拉菜单 和 导出数据-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>

    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="logId"
          label="APP登陆ID">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址">
        </el-table-column>
        <el-table-column
          label="登陆时间">
          <template slot-scope="scope">
            {{scope.row.loginTime | moment}}
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneModel"
          label="手机型号">
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild  :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                 v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>
<style scoped>
  .divStyle>.isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .divStyle>.isBtnStyle2 {
    position: absolute;
    right: 0px;
    top: 13px;
  }

  .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
  }

  .divStyle {
    position: relative;
  }

  .searchStyle {
    height: 50px;
  }

  .isInfoStyle {
    color: red;
  }
</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        // 分页所用参数
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        // 表格使用的参数
        tableDatas: [],

        // 搜索和导出需要的参数
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',  // 提示信息是否显示
        text: '',   //  提示信息的内容
        value6:[],
        searchFromData: {
          phone: "",
          phoneModel: "",
          // 创建时间 loginStartTime   loginEndTime
        },
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      getTableDatas(){
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('sys/manage/login/log/list', data).then(res => {
          console.log(res);
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },

      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]') {
          this.value6 = [];
        };

        if (this.isSearch == 0) {
          if (this.searchFromData.phone === "" && this.searchFromData.phoneModel === "" && !this.value6) {
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
              clearInterval(timeId);
            }, 3000);
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.phone === "" && this.searchFromData.phoneModel === "" && !this.value6) {
            this.start = 0;
            this.isSearch = 0;
            this.getTableDatas();
          } else{
            this.paramsData();
          }
        };
      },

      // 带参查询数据，进行搜索
      paramsData(){
//        创建时间 loginStartTime   loginEndTime
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.phone) datas.phone = this.searchFromData.phone;
        if (this.searchFromData.phoneModel) datas.phoneModel = this.searchFromData.phoneModel;
        console.log(this.value6);
        if(this.value6.length != 0){
          if(this.value6[0]) datas.loginStartTime = this.value6[0];
          if(this.value6[1]) datas.loginEndTime = this.value6[1];
        };
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('sys/manage/login/log/list', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else{
            this.text = "输入的搜索条件有误，请重新输入";
            this.isflag = true;
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.text = "";
              this.isflag = false;
              clearInterval(timeId);
            }, 3000);
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },

      // 导出数据
      exportEvent(){
        // 第一点： 禁用导出按钮， 2. 是否有导出条件 （有发送请求，成功启用，不成功启用，没有数据，提示用户） （没有，提示用户，非禁用）
        this.isLoading = true;
        if (this.searchFromData.phone === "" && this.searchFromData.phoneModel === "" && this.value6 == '[object Null]') {
          this.text="导出数据不能为空，请输入导出数据的条件";
          this.isflag = true;
          setInterval(() => {
            this.isLoading = false;
            this.isflag = false;
            this.text='';
          },3000)
          return;
        } else {
          var exportDatas = {};
          if(this.searchFromData.phone) exportDatas.phone = this.searchFromData.phone;
          if(this.searchFromData.phoneModel) exportDatas.phoneModel = this.searchFromData.phoneModel;
          if(this.searchFromData.value6){
            exportDatas.loginStartTime = this.searchFromData.value6[0];
            exportDatas.loginEndTime = this.searchFromData.value6[1];
          }
          var data = Qs.stringify(exportDatas);
          this.$http.post('sys/manage/login/log/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = 'APP登录日志列表的表格'
            var blob = res.data;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
              var a = document.createElement("a");
              a.download = filename + ".xls";
              a.href = e.target.result;
              a.click();
            }
          }).catch(err => {
            this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出!!');
            this.isLoading = false;
          })
        }
      },

      // 下拉菜单的数据
      getChildLength(len){
        var pageData = 0, age = 0;
        console.log(this.page);
        pageData = this.display * (this.page - 1);
        console.log(pageData);
        console.log(pageData / len);
        if (pageData % len == 0) {
          console.log(123);
          age = (pageData / len + 1);
        } else {
          age = Math.ceil(pageData / len);
        }
        // age 是表示从哪一页开始
        this.start = (age - 1) * len;
        this.page = age;
        console.log(age);
        this.compage = age;
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 设置时间
      setTime(){
        this.compage = 1;
        this.start = 0; // 发生改变，从0开始搜索
        if (this.value6 != null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.compage = 1;
        this.start = 0;
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

