<template>
  <div>
    <h2>网关列表</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline" @submit.native.prevent>
      <el-form-item label="网关ID">
        <el-input placeholder="" v-model.trim="searchFromData.identifier" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="网关名称" prop="name">
        </el-table-column>
        <el-table-column label="网关ID" prop="identifier">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="editGateway(scope.row.id)">编辑网关
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary"  @click="addGateway">新增网关</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<style>
  .background {
    width: 8px;
    height: 4px;
    padding: 4px;
  }

  .red {
    background-color: #F56C6C;
  }

  .divStyle > .isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .divStyle > .isBtnStyle2 {
    position: absolute;
    right: 0px;
    top: 13px;
  }

  .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
    color: red;
  }

  .divStyle {
    position: relative;
  }

  ul {
    list-style: none;
    display: inline-block;
  }

  .pageation li {
    float: left;
    display: inline-block;
    padding: 10px;
    background-color: #adadad;
    margin: 10px;
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
          parklotName: '',
          identifier: '',
        },
      }
    },
    created(){
      this.getGatewayData();
    },
    methods: {
      //获得数据
      getGatewayData(){
        this.dataItems = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post("gateway/pageable", data).then(res => {
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
          if (this.searchFromData.identifier === '') {
            this.total = 0;
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
            this.seachLoading = false;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.identifier === '') {
            this.start = 0;
            this.isSearch = 0;
            this.getGatewayData();
          } else{
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
        if (this.searchFromData.identifier) datas.identifier = this.searchFromData.identifier;
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('gateway/pageable', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code !== 2000 || res.data.data.dataList == 0) {
            this.total = 0;
//            this.dataItems = [];
            this.$message.error('错了哦，输入的搜索条件有误，未能匹配到数据！！');
          }else if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
            console.log(this.dataItems);
          }else {
            this.total = 0;
            this.$message.error('错了哦，输入的搜索条件有误，未能匹配到数据！！');
            //            this.dataItems = [];
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
          this.getGatewayData();
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
          this.getGatewayData();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      //跳转编辑网关
      editGateway(id){
        this.$router.push({path: 'gateway_edit',query:{gatewayId:id}});
      },
      //新增网关
      addGateway(){
        this.$router.push({path: 'gateway_add'});
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
