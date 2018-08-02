<template>
  <div>
    <h2>车位列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData" @change="clearStart" @keyup.enter.native="searchEvent">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="车位编号">
                <el-input placeholder="请输入车位编号" v-model.trim="searchFromData.number" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="蓝牙名称">
                <el-input placeholder="请输入蓝牙名称" v-model.trim="searchFromData.lockSerialNumber" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="小区名称">
                <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="业主姓名">
                <el-input placeholder="请输入业主姓名" v-model.trim="searchFromData.userName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号码">
              <el-input placeholder="请输入手机号码" v-model.trim="searchFromData.userPhone" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>
    <br>
    <!--<br>-->
    <!--<br>-->
    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="number"
          label="车位编号">
        </el-table-column>
         <el-table-column
          prop="parklotDistrictName"
          label="车位区域">
        </el-table-column>
        <el-table-column
          prop="lockNumber"
          label="蓝牙名称">
        </el-table-column>
        <el-table-column
          prop="parklotName"
          label="小区名称">
        </el-table-column>
        <el-table-column
          prop="parklotType"
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
          prop="userName"
          label="业主姓名">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="手机号码">
        </el-table-column>
        <el-table-column
          width="200px"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewDetails(scope.row.id)">详情</el-button>
            <el-button size="mini" type="warning" @click="editParking(scope.row.id,scope.row.estateId)">编辑车位
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="addParking">新增车位</el-button>
    </div>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>


<style scoped>
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
    margin-top: 50px;
  }

  .el-form {
    margin-top: 14px;
  }

  .el-form-item {
    margin-bottom: 0px;
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

  .estate td {
    vertical-align: middle;
  }

  h2 {
    margin: 0;
    padding: 0;
  }

  .estate td > sapan {
    display: inline-block;
    height: 30px;
    padding: 20px;
  }

  .colspan p {
    font-size: 16px;
    color: red;
  }

  /*显示模态框的提示信息*/
  .spanStyle {
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
//        estateId:170 parklotName:"asdfsd" id:21 passwd:"QHAY8888" serverIp : "218.17.162.228" servicePort : 18080
        // 发送数据所用
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        tableDatas: [],
        // 搜索和导出要用的变量
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        searchFromData: {
          userName: '',
          lockSerialNumber: '',
          number: '',
          parklotName: '',
          userPhone: '',
        },
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      /*整合无参分页和带参分页*/
      getTableDatas(){
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if(this.searchFromData.userName !== '') datas.userName = this.searchFromData.userName;
        if(this.searchFromData.lockSerialNumber !== '') datas.lockSerialNumber = this.searchFromData.lockSerialNumber;
        if(this.searchFromData.number !== '') datas.number = this.searchFromData.number;
        if(this.searchFromData.parklotName !== '') datas.parklotName = this.searchFromData.parklotName;
        if(this.searchFromData.userPhone !== '') datas.userPhone = this.searchFromData.userPhone;
        var data = Qs.stringify(datas);
        this.$http.post('parkloc/pageable', data).then((res)=>{
          if (res.data.error_code === 2000 && res.data.data.itotalRecords.length != '0') {
            this.seachLoading = false;
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else if(res.data.error_code === 2001 && this.isSearch === 1){
            this.isflag = true;
            this.text = "搜索到的是空数据，请重新输入搜索条件";
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
              clearInterval(timeId);
            }, 3000);
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
          if (this.searchFromData.userName === "" && this.searchFromData.lockSerialNumber === "" && this.searchFromData.number === "" &&
            this.searchFromData.parklotName === "" && this.searchFromData.userPhone === '') {
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
            this.isSearch = 1;
            this.start = 0;
            this.getTableDatas();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.userName === "" && this.searchFromData.lockSerialNumber === "" && this.searchFromData.number === "" &&
            this.searchFromData.parklotName === "" && this.searchFromData.userPhone === '') {
            this.start = 0;
            this.isSearch = 0;
          }
          this.getTableDatas();
        };
      },

      // 导出数据
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.userName == "" && this.searchFromData.lockSerialNumber == "" && this.searchFromData.number == "" &&
          this.searchFromData.parklotName == "" && this.searchFromData.userPhone == '') {
          this.text = "数据未能正确查找到，请输入正确的查找条件";
          this.isflag = true;
          setInterval( ()=> {
            this.isLoading = false;
            this.isflag = false;
          }, 3000)
          return;
        } else {
          var exportDatas = {};
          exportDatas.length = this.display;
          exportDatas.sEcho = 3;
          exportDatas.start = this.start;
          if (this.searchFromData.userName) exportDatas.userName = this.searchFromData.userName;
          if (this.searchFromData.userPhone) exportDatas.userPhone = this.searchFromData.userPhone;
          if (this.searchFromData.lockSerialNumber) exportDatas.lockSerialNumber = this.searchFromData.lockSerialNumber;
          if (this.searchFromData.number) exportDatas.number = this.searchFromData.number;
          if (this.searchFromData.parklotName) exportDatas.parklotName = this.searchFromData.parklotName;
          var data = Qs.stringify(exportDatas);
          this.$http.post('parkloc/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = '车位列表表格'
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
            this.isLoading = false;
            this.$message.error("导出数据错误，请输入导出数据的条件");
          })
        }
      },


      // 新增车位
      addParking(){
        this.$router.push({path: '/parking_add'});
      },
      // 查看详情
      viewDetails(parkingId){
        this.$router.push({path: 'parking_detail', query: {parkingId: parkingId}});
      },
      editParking(parkingId,estateId){
        this.$router.push({path: 'parking_edit', query: {parkingId: parkingId, estateId: estateId}});
      },


      // 文本输入框变化的时候，start置0
      clearStart(){
        this.compage = 1;
        this.start = 0;
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
        this.compage = age;
        this.display = parseInt(len);
        this.getTableDatas();
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTableDatas();
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
