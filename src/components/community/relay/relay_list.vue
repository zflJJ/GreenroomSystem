<template>
  <div>
    <h2>继电器列表</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="厂商">
        <el-input placeholder="请输入厂商" v-model.trim="searchFromData.manufacturerName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="型号">
        <el-input placeholder="请输入继电器型号" v-model.trim="searchFromData.model" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="继电器编号">
        <el-input placeholder="请输入继电器编号" v-model.trim="searchFromData.number" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="小区名称">
        <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="">
        状态异常继电器:{{invalidNum}}
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
        <el-table-column label="继电器编号" prop="number">
        </el-table-column>
        <el-table-column label="继电器名称" prop="name">
        </el-table-column>
        <el-table-column label="继电器类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">出口</span>
            <span v-else-if="scope.row.type==0">入口</span>
          </template>
        </el-table-column>
        <el-table-column label="继电器厂商" prop="manufacturerName">
        </el-table-column>
        <el-table-column label="继电器型号" prop="model">
        </el-table-column>
        <el-table-column label="小区名称" prop="parklotName">
        </el-table-column>
        <el-table-column label="回传时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope" >
            <span v-if="scope.row.state==1">正常</span>
            <span v-else-if="scope.row.state==0">异常</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="250px">
            <el-button type="warning" size="small" @click="editRelay(scope.row.id)">编辑继电器
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary"  @click="addRelay">新增继电器</el-button>
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
    height: 60px;
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
        abnormalAmount:'',
        lowBatteryAmount:'',
        searchFromData: {
          manufacturerName: '',
          model: '',
          parklotName: '',
          number: '',
        },
        invalidNum:'0',//状态异常继电器
        tempState:'',
      }
    },
    created(){
      this.getRelayData();
    },
    methods: {
      /*整合无参分页和带参分页*/
      getRelayData(){
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.manufacturerName) datas.manufacturerName = this.searchFromData.manufacturerName;
        if (this.searchFromData.model) datas.model = this.searchFromData.model;
        if (this.searchFromData.parklotName) datas.parklotName = this.searchFromData.parklotName;
        if (this.searchFromData.number) datas.number = this.searchFromData.number;
        var data = Qs.stringify(datas);
        this.$http.post('relaymeter/pageable', data).then((res)=>{
          if (res.data.error_code === 2000 && res.data.data.itotalRecords.length != '0') {
            this.seachLoading = false;
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
          } else if(res.data.error_code === 2001 && this.isSearch === 1){
            this.seachLoading = false;
            this.$message.error("搜索到的是空数据，请重新输入搜索条件")
          }else{
            console.log(res.data.erroced);
          }
        }).catch((err)=>{
          this.seachLoading = false;
          console.log(err);
        })
      },
      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch === 0) {
          if (this.searchFromData.manufacturerName === '' && this.searchFromData.model === '' && this.searchFromData.parklotName === '' && this.searchFromData.number === '') {
            this.seachLoading = false;
            this.$message.error("输入的搜索内容不能为空，请填入搜索字段");
          } else {
            // 开始进行搜索
            this.isSearch = 1;
            this.start = 0;
            this.getRelayData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.manufacturerName === '' && this.searchFromData.model === '' && this.searchFromData.parklotName === '' && this.searchFromData.number === '') {
            this.start = 0;
            this.isSearch = 0;
          }
          this.getRelayData();
        };
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        console.log(this.start)
        if (this.isSearch == 0) {
          this.getRelayData();
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
          this.getRelayData();
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
        if (this.searchFromData.manufacturerName === "" && this.searchFromData.model === "" && this.searchFromData.number === "" && this.searchFromData.parklotName === "") {
          this.isLoading = false;
          this.$message.error("导出的字段不能为空，请输入要导出的字段")
        } else {
          var exportDatas = {};
          if (this.searchFromData.manufacturerName) exportDatas.manufacturerName = this.searchFromData.manufacturerName;
          if (this.searchFromData.model) exportDatas.model = this.searchFromData.model;
          if (this.searchFromData.number) exportDatas.number = this.searchFromData.number;
          if (this.searchFromData.parklotName) exportDatas.parklotName = this.searchFromData.parklotName;
          var data = Qs.stringify(exportDatas);
          this.$http.post('relaymeter/excel', data, {responseType: 'blob'}).then((res) => {
              this.isLoading = false;
              var filename = '继电器列表表格'
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
            this.isLoading = false;
            this.$message.error("输入的导出字段有误，请重新确认导出的字段！")
          })
        }
      },
      //查看日志
      logRelay(id){
        this.$router.push({path: 'relay_log',query:{relayId:id}});
      },
      //跳转编辑
      editRelay(id){
        this.$router.push({path: 'relay_edit',query:{relayId:id}});
      },
      //新增
      addRelay(){
        this.$router.push({path: 'relay_add'});
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
