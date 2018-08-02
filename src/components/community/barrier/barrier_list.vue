<template>
  <div>
    <h2>道闸列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="道闸名称">
          <el-input placeholder="请输入道闸名称" v-model.trim="searchFromData.name" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="小区名称">
          <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
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
          prop="id"
          label="道闸ID">
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
          label="道闸名称">
        </el-table-column>
        <el-table-column
          prop="serverIp"
          label="服务器IP">
        </el-table-column>
        <el-table-column
          prop="serverPort"
          label="服务器端口号">
        </el-table-column>
        <el-table-column
          prop="password"
          label="道闸密码">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="barrierEdit(scope.row.id)">编辑道闸</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click="barrierAdd">新增道闸</el-button>
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
</style>

<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
//        estateId:170 parklotName:"asdfsd" id:21 password:"QHAY8888" serverIp : "218.17.162.228" serverPort : 18080
        // 发送数据所用
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],

        // 搜索和导出需要的参数
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',  // 提示信息是否显示
        text: '',   //  提示信息的内容
        searchFromData: {
          name: "",
          parklotName: "",
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
        this.$http.post('barrier/pageable', data).then(res => {
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
        if (this.isSearch == 0) {
          if (this.searchFromData.name == "" && this.searchFromData.parklotName == "") {
            this.seachLoading = false;
            this.$message.error("输入的搜索内容不能为空，请填入搜索字段");
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.name == "" && this.searchFromData.parklotName == "") {
            this.start = 0;
            this.isSearch = 0;
            this.getTableDatas();
          } else {
            this.paramsData();
          }
        };
      },

      // 带参查询数据，进行搜索
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        if (this.searchFromData.parklotName) datas.parklotName = this.searchFromData.parklotName;
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('barrier/pageable', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
            console.log(this.tableDatas)
          } else if (res.data.error_code !== 2000) {
            this.$message.error("输入的搜索条件有误，请重新输入");
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
        if (this.searchFromData.name == "" && this.searchFromData.parklotName == "") {
          this.isLoading = false;
          this.$message.error("导出数据不能为空，请输入导出数据的条件");
        } else {
          var exportDatas = {};
          if(this.searchFromData.name) exportDatas.name = this.searchFromData.name;
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
            this.$message.error("导出数据错误，请输入导出数据的条件");
            this.isLoading = false;
            this.$message.error(err);
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

      //跳转到新增道闸
      barrierAdd(){
        this.$router.push({path: 'barrier_add'});
      },
      //跳转到编辑道闸
      barrierEdit(barrierId){
        this.$router.push({path: 'barrier_edit',query: {barrierId: barrierId}});
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
