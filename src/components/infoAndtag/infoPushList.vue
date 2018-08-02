<template>
  <div>
    <!-- 查看闸道列表页面 -->
    <h2>信息推送日志1.2</h2>
    <!--2.0 搜索框的样式-->
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="电话号码">
          <el-input placeholder="请输入电话号码" v-model.trim="searchFromData.phone" @change="clearStart"></el-input>
        </el-form-item>
        <el-form-item label="推送内容">
          <el-input placeholder="请输入推送内容" v-model.trim="searchFromData.content" @change="clearStart"></el-input>
        </el-form-item>
        <el-form-item label="创建的时间范围">
          <div class="block">
            <span class="demonstration"></span>

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
      <!--<el-button type="success" @click="exportEvent">导出数据</el-button>-->
    </div>

    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="flag">{{text}}</span>
      <el-button type="primary" @click.native.prevent="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索
      </el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>

    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          label="推送ID">
          <template slot-scope="scope">
            <span>{{scope.row.id || '无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="电话号码">
          <template slot-scope="scope">
            <span>{{scope.row.phone || '无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="推送内容">
          <template slot-scope="scope">
            <span>{{scope.row.content || '无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="推送类型">
          <template slot-scope="scope">
            <span>{{scope.row.typeAndKind}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="推送人ID">
          <template slot-scope="scope">
            <span>{{scope.row.webUserId || '无'}}</span>
          </template>
        </el-table-column>


        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime != undefined">{{scope.row.createTime | moment}}</span>
            <span v-else>'无'</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>
<style scoped>
  .tbodyStyle {
    border: 1px solid rgb(222, 222, 223);
  }

  .tbodyStyle td {
    height: 42px;
    vertical-align: middle;
  }

  tr > :first-child {
    width: 110px;
  }

  .footStyle {
    height: 60px;
    padding: 5px;
    line-height: 50px;
    border: 1px solid #ebeef5;
    border-top: none;
    text-align: right;
  }

  .searchStyle {
    height: 50px;
  }

  .isInfoStyle {
    color: red;
  }

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

</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        // 分页要处理的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,


        tableDatas: [],

        // 搜索区域的内容
        isSearch: 0,
        flag: false,
        isLoading: false,
        seachLoading: false,
        text: '',
        value6: [],// 对时间进行处理
        searchFromData: {
          phone: '', // 推送的账户
          content: '',//  推送的内容
//          startTime:1514390400000
//          endTime:1514476799999
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
        this.$http.post('tag/message/pageable', data).then((res) => {
          this.seachLoading = false;
          console.log(res.data);
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            // 对发票类型进行处理
            var paramsData = res.data.data.dataList;
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = paramsData;
          } else {
            console.log('状态码返回错误')
          };
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },

      //获取搜索的内容(对发票类型数据做处理，)
      searchEvent(){ // 做判断和验证
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]') {
          this.value6 = [];
        };
        this.seachLoading = true;
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          // 前提对搜索的条件进行判断
          if (this.searchFromData.phone == "" && this.searchFromData.content == ""  && this.value6.length == 0) {
            // 第一次搜索没有字段提示用户信息
            this.flag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.flag = false;
              this.seachLoading = false;
              clearInterval(timeId);
            }, 3000);
            return;
          } else {
            // 不管好多页，搜索默认就开始第一页的方式, 长度不变
            this.start = 0;
            // 开始进行带参分页
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          // 如果为空搜索，那么开启默认搜索， 如果为非空搜索进行分页搜索，但是发生变化之后，this.start = 0 从0 开始作为搜索的目标
          if (this.searchFromData.phone == "" && this.searchFromData.content == "" && this.value6.length == 0) {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
            this.getTableDatas();
          } else{
            this.paramsData();
          }
        }
      },
      // 带参请求数据
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if(this.value6[0]) datas.startTime = this.value6[0];
        if(this.value6[1]) datas.endTime = this.value6[1];
        if(this.searchFromData.phone) datas.phone = this.searchFromData.phone;
        if(this.searchFromData.content) datas.content= this.searchFromData.content;

        var data = Qs.stringify(datas);
        this.$http.post('tag/message/pageable', data).then((res) => {
          // 按钮不用禁用了

          if (res.data.error_code == 2000 && res.data.data.dataList.length != 0) {
            this.seachLoading = false;
            var paramsData = res.data.data.dataList;
            this.total = parseInt(res.data.data.itotalRecords);
            // 这里可以再次优化（在搜索内容为不合格的时候，提示用户）
            this.tableDatas = paramsData;
          } else{
            this.flag = true;
            this.text = '未能搜索到匹配的条件，请重新数据搜索条件！！';
            clearInterval(timeIds);
            var timeIds = setInterval(()=>{
              this.seachLoading = false;
              this.flag = false;
              this.text = '';
              clearInterval(timeIds);
            }, 3000);
          }
        }).catch(err => {
          this.text = '系统错误请联系开发人员';
          this.flag = true;
          clearInterval(timeId);
          var timeId = setInterval(()=>{
            this.seachLoading = false;
            this.text = '';
            this.flag = false;
            clearInterval(timeId);
          },3000);
        })
      },

      // 导出数据(接口有问题，暂时不处理)
      exportEvent(){
        this.isLoading = true;
        var exportDatas = {};
        // 对时间进行判断
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]') {
          this.value6 = [];
        };
        // 如果搜索条件为空，是没有数据导出的（并且提示用户）  // 搜索条件不为空，搜索到数据（进行导出操作）  位搜索到数据提示用户输入导出条件有误，请重新输入
        if (this.searchFromData.phone == "" && this.searchFromData.content == "" && this.value6.length == 0) {
          this.text = "没有导出数据的条件，数据无法进行导出";
          this.flag = true;
          clearInterval(timeId1);
          var timeId1 = setInterval(() => {
            this.isLoading = false;
            this.flag = false;
            clearInterval(timeId1);
          }, 3000)
          return;
        } else {
          // 对导出的参数进行处理
          if(this.value6[0]) exportDatas.startTime = this.value6[0];
          if(this.value6[1]) exportDatas.endTime = this.value6[1];
          if(this.searchFromData.phone) exportDatas.phone = this.searchFromData.phone;
          if(this.searchFromData.content) exportDatas.content= this.searchFromData.content;
          var data = Qs.stringify(exportDatas);
          this.$http.post('tag/message/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = '信息推送表格'
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
            this.text = "导出数据有误，请输入正确的导出条件";
            this.flag = true;
            clearInterval(timeId2);
            var timeId2 = setInterval(() => {
              this.isLoading = false;
              this.flag = false;
              clearInterval(timeId2);
            }, 3000)
          })
        }
      },

      // 输入框内容，改变重置start
      clearStart(){
        this.compage = 1;
        this.start = 0;
      },

      // 设置时间
      setTime(){
        this.start = 0;
        this.compage = 1;
        if (this.value6 != null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },


      // 下拉菜单的数据
      getChildLength(len){
        var pageData = 0, age = 0;
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
        this.compage = age;
        console.log(age);
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },



    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

