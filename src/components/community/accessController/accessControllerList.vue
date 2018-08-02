<template>
  <div class="estate">
    <h2>门禁列表1.2</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="小区名称">
        <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="门禁名称">
        <el-input placeholder="请输入门禁名称" v-model.trim="searchFromData.name" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
    </el-form>
    <!--3.0 下拉菜单 和 导出数据-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>
    <!--小区列表-->
    <template>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="parklotName"
          label="小区名称">
        </el-table-column>
        <el-table-column
          label="小区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.parklotType==1&&scope.row.innershareStr=='内部共享'">约车场内部共享</span>
            <span v-else-if="scope.row.parklotType==2&&scope.row.innershareStr=='内部共享'">约车位内部共享</span>
            <span v-else-if="scope.row.parklotType == 2">约车位</span>
            <span v-else-if="scope.row.parklotType==1">约车场</span>
            <span v-else-if="scope.row.parklotType==0">车位查询</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="门禁名称">
        </el-table-column>
        <el-table-column
          prop="btName"
          label="蓝牙名称">
        </el-table-column>
        <el-table-column
          prop="btPwd"
          label="蓝牙密码">
        </el-table-column>
        <el-table-column
          prop="intro"
          label="门禁类型">
        </el-table-column>

        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="state">
            <span>可用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="redactlist(scope.row.id)">编辑门禁</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click="addEntrance">新增门禁</el-button>
    </div>
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

  .bottomStyle {
    border: 1px solid #ebeef5;
    border-top: none;
    padding: 5px 20px;
    height: 60px;
    line-height: 50px;
    text-align: right;
  }
  h2 {
    font-size: 26px;
    font-weight: 700;
  }

  .estate td {
    vertical-align: middle;
  }
  .bottomStyle{
    border: 1px solid #ebeef5;
    border-top:none;
    padding: 5px 20px;
    height: 60px;
    line-height: 50px;
    text-align: right;
  }
</style>

<script>
  // 下拉菜单
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    data(){
      return {
        // 发送数据所用
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableData: [],
        // 分页器要传递的东西
        lists: [],
        length: 10,
        pageLen: 5,
        estateId: '',
        searchFromData: {
          parklotName: '',
          name: '',
        },

        // 搜索和导出需要的参数
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',  // 提示信息是否显示
        text: '',   //  提示信息的内容
      }
    },
    created(){
      this.getTableData();
    },
    methods: {
      //获取数据
      getTableData(){
        var data = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        data = Qs.stringify(data);
        this.$http.post('access/pageable',data).then(res => {
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableData = res.data.data.dataList;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.parklotName === '' && this.searchFromData.name === '') {
            this.seachLoading = false;
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段！！');
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.parklotName === '' && this.searchFromData.name === '') {
            this.start = 0;
            this.isSearch = 0;
            this.getTableData();
          } else if (this.searchFromData.parklotName != '' || this.searchFromData.name != '' ) {
            this.paramsData();
          }
        };
      },
      // 带参搜索数据
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.parklotName) datas.parklotName = this.searchFromData.parklotName;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('access/pageable', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.iTotalRecords);
            this.tableData = res.data.data.dataList;
          }else {
            this.$message.error('错了哦，输入的搜索条件有误，未能匹配到数据！！');
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        console.log(this.start)
        if (this.isSearch == 0) {
          this.getTableData();
        } else if (this.isSearch == 2000) {
          this.paramsData();
        }
      },
      // 下拉菜单的选择器
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
        this.compage = age;
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          this.getTableData();
        } else if (this.isSearch == 2000) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      // 导出数据
      exportEvent(){
        // 第一点： 禁用导出按钮， 2. 是否有导出条件 （有发送请求，成功启用，不成功启用，没有数据，提示用户） （没有，提示用户，非禁用）
        this.isLoading = true;
        if (this.searchFromData.serverIp == "" && this.searchFromData.serverPort == "" && this.searchFromData.password == "" && this.searchFromData.parklotName == "") {
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
          // 处理数据
          if(this.searchFromData.serverIp) exportDatas.serverIp = this.searchFromData.serverIp;
          if(this.searchFromData.serverPort) exportDatas.serverPort = this.searchFromData.serverPort;
          if(this.searchFromData.password) exportDatas.password = this.searchFromData.password;
          if(this.searchFromData.parklotName) exportDatas.parklotName = this.searchFromData.parklotName;
          var data = Qs.stringify(exportDatas);

          this.$http.post('barrier/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = '道闸列表的表格'
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
            this.text="未能正确的匹配到数据,请联系后台管理人员";
            this.isflag = true;
            setInterval(() => {
              this.isLoading = false;
              this.isflag = false;
              this.text='';
            },3000)
            console.log(err);
          })
        }
      },
      //编辑门禁
      redactlist(id){
          this.$router.push({path:'accessControllerEdit',query:{accessControllerId:id}});
      },
      // 新增门禁
      addEntrance(){
        this.$router.push({path:'addentrance'});
      }
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
