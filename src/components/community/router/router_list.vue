<template>
  <div>
    <h2>路由器列表1.2</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="厂商">
        <el-input placeholder="请输入厂商" v-model.trim="searchFromData.manufacturerName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="型号">
        <el-input placeholder="请输入型号" v-model.trim="searchFromData.model" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="小区名称">
        <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="路由器名称">
        <el-input placeholder="请输入路由器名称" v-model.trim="searchFromData.name" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="小区名称" prop="parklotName">
        </el-table-column>
        <el-table-column label="路由器名称" prop="name">
        </el-table-column>
        <el-table-column label="路由器编号" prop="number">
        </el-table-column>
        <el-table-column label="路由器厂商" prop="manufacturerName">
        </el-table-column>
        <el-table-column label="路由器型号" prop="model">
        </el-table-column>
        <!--<el-table-column label="网关ID" prop="name">-->
        <!--</el-table-column>-->
        <!--<el-table-column label="网关名称" prop="name">-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope" width="250px">
            <el-button type="success" size="small" @click="logRouter(scope.row.id)">查看详情
            </el-button>
            <el-button type="warning" size="small" @click="editRouter(scope.row.id)">编辑路由器
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary"  @click="addRouter">新增路由器</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
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
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    data(){
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        dialogFormVisible: false,
        dataItems: [],
        flag: false,
        isShow: false,
        isSpan: false,
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        searchFromData: {
          manufacturerName: '',
          model: '',
          parklotName: '',
          name: '',
        },
      }
    },
    created(){
      this.getRouterData();
    },
    methods: {
      //获得数据
      getRouterData(){
        this.dataItems = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post("router/pageable", data).then(res => {
          console.log(res)
          this.dataItems = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
          this.seachLoading = false;
          console.log(res)
        }).catch(err=>{
          this.seachLoading = false;
          console.log(err);
        })
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.manufacturerName === '' && this.searchFromData.model === '' && this.searchFromData.parklotName === '' && this.searchFromData.name === '') {
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
            this.seachLoading = false;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.manufacturerName === '' && this.searchFromData.model === '' && this.searchFromData.parklotName === '' && this.searchFromData.name === '') {
            this.start = 0;
            this.isSearch = 0;
            this.getRouterData();
          } else if (this.searchFromData.manufacturerName != '' || this.searchFromData.model != '' || this.searchFromData.parklotName != '' || this.searchFromData.name != '') {
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
        if (this.searchFromData.manufacturerName) datas.manufacturerName = this.searchFromData.manufacturerName;
        if (this.searchFromData.model) datas.model = this.searchFromData.model;
        if (this.searchFromData.parklotName) datas.parklotName = this.searchFromData.parklotName;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('router/pageable', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2001 || !res.data.data.dataList) {
            this.$message.error('错了哦，输入的搜索条件有误，未能匹配到数据！！');
          }else if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
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
          this.getRouterData();
        } else if (this.isSearch == 1) {
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
          this.getRouterData();
        } else if (this.isSearch == 1) {
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
        this.isLoading = true;
        if (this.searchFromData.manufacturerName === '' && this.searchFromData.model === '' && this.searchFromData.parklotName === '' && this.searchFromData.name === '') {
          this.isLoading = false;
          this.$message.error('错了哦，导出的字段不能为空，请输入要导出的字段');
        } else {
          var exportDatas = {};
          if (this.searchFromData.manufacturerName) exportDatas.manufacturerName = this.searchFromData.manufacturerName;
          if (this.searchFromData.model) exportDatas.model = this.searchFromData.model;
          if (this.searchFromData.parklotName) exportDatas.parklotName = this.searchFromData.parklotName;
          if (this.searchFromData.name) exportDatas.name = this.searchFromData.name;
          var data = Qs.stringify(exportDatas);
          this.$http.post('router/excel', data, {responseType: 'blob'}).then((res) => {
              this.isLoading = false;
              var filename = '路由器列表表格'
              var blob = res.data;
              console.log(blob);
              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = function (e) {
                console.log(e);
                var a = document.createElement("a");
                a.download = filename + ".xls";
                a.href = e.target.result;
                a.click();
              }
          }).catch((err) => {
            this.$message.error('错了哦，输入的导出字段有误，请重新确认导出的字段！');
            this.isLoading = false;
          })
        }
      },
      //查看详情
      logRouter(id){
        this.$router.push({path: 'router_log',query:{routerId:id}});
      },
      //跳转编辑
      editRouter(id){
        this.$router.push({path: 'router_edit',query:{routerId:id}});
      },
      //新增
      addRouter(){
        this.$router.push({path: 'router_add'});
      },

    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
