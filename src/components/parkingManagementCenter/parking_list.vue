<template>
  <div>
    <!-- 查看闸道列表页面 -->
    <h2>VIP车位列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData" @change="clearStart">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="手机号码">
                <el-input placeholder="请输入手机号码" v-model.trim="searchFromData.phone" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="车位编号">
                <el-input placeholder="请输入车位编号" v-model.trim="searchFromData.name" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="车锁编号 ">
                <el-input placeholder="请输入车锁编号" v-model.trim="searchFromData.number" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="小区名称">
                <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.estateName" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="业主名称">
              <el-input placeholder="请输入业主名称" v-model.trim="searchFromData.contact" @change="clearStart"></el-input>
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

    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="id"
          label="车位ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="车位编号">
        </el-table-column>
        <el-table-column
          prop="number"
          label="车锁编号 ">
        </el-table-column>
        <el-table-column
          prop="estateName"
          label="小区名称">
        </el-table-column>
        <el-table-column
          prop="contact"
          label="业主姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="业主手机号码">
        </el-table-column>
        <el-table-column
          prop="gatewayId"
          label="网关ID">
        </el-table-column>
        <el-table-column
          prop="lockMac"
          label="锁地址">
        </el-table-column>
        <el-table-column
          label="收费标准">
          <template slot-scope="scope">
            <span>￥{{scope.row.unitPrice}}元</span>
          </template>
        </el-table-column>
        <el-table-column
          label="担保费">
          <template slot-scope="scope">
            <span>￥{{scope.row.guaranteeFee}}元</span>
          </template>
        </el-table-column>

        <el-table-column
          label="结算比例(物业/业主/平台)">
          <template slot-scope="scope">
            <span>{{scope.row.estateSettle || 0}}%/{{scope.row.ownerSettle || 0}}%/{{scope.row.platformSettle || 0}}%</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 11">物业已发布</span>
            <span v-else-if="scope.row.state == 12">业主已发布</span>
            <span v-if="scope.row.state == 13">正在使用</span>
            <span v-if="scope.row.state == 19">已取消</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="estateName"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewDetails(scope.row.id)">查看详情</el-button>
            <br>
            <el-button size="mini" type="primary" @click="parkingAcListEvent(scope.row.id,scope.row.estateId)">查看门禁
            </el-button>
            <br>
            <el-button size="mini" type="danger" @click="editVip(scope.row.id,scope.row.estateId)">修改车位
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="toBefore">返回小区列表</el-button>
    </div>
    <!--5.0 分页插件-->
    <pagination :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></pagination>
  </div>
</template>
<style scoped>
  .footStyle {
    height: 60px;
    padding: 5px;
    line-height: 50px;
    border: 1px solid #ebeef5;
    border-top: none;
    text-align: right;
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
  import  pagination from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
//        estateId:170 estateName:"asdfsd" id:21 passwd:"QHAY8888" serverIp : "218.17.162.228" servicePort : 18080
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
          phone: '',
          name: '',
          number: '',
          estateName: '',
          contact: '',
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
        if(this.searchFromData.phone !== '') datas.phone = this.searchFromData.phone;
        if(this.searchFromData.name !== '') datas.name = this.searchFromData.name;
        if(this.searchFromData.number !== '') datas.number = this.searchFromData.number;
        if(this.searchFromData.estateName !== '') datas.estateName = this.searchFromData.estateName;
        if(this.searchFromData.contact !== '') datas.contact = this.searchFromData.contact;
        var data = Qs.stringify(datas);
        this.$http.post('parking/pageable', data).then((res)=>{
          if (res.data.errcode === 1 && res.data.data.iTotalRecords.length != '0') {
            this.seachLoading = false;
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.iTotalRecords);
            this.tableDatas = res.data.data.aaData;
          } else if(res.data.errcode === 2 && this.isSearch === 1){
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
          if (this.searchFromData.phone === "" && this.searchFromData.name === "" && this.searchFromData.number === "" &&
            this.searchFromData.estateName === "" && this.searchFromData.contact === '') {
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
          if (this.searchFromData.phone === "" && this.searchFromData.name === "" && this.searchFromData.number === "" &&
            this.searchFromData.estateName === "" && this.searchFromData.contact === '') {
            this.start = 0;
            this.isSearch = 0;
          }
          this.getTableDatas();
        };
      },

      // 导出数据
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.phone == "" && this.searchFromData.name == "" && this.searchFromData.number == "" &&
          this.searchFromData.estateName == "" && this.searchFromData.contact == '') {
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
          if (this.searchFromData.phone) exportDatas.phone = this.searchFromData.phone;
          if (this.searchFromData.name) exportDatas.name = this.searchFromData.name;
          if (this.searchFromData.number) exportDatas.number = this.searchFromData.number;
          if (this.searchFromData.estateName) exportDatas.estateName = this.searchFromData.estateName;
          if (this.searchFromData.contact) exportDatas.contact = this.searchFromData.contact;
          var data = Qs.stringify(exportDatas);
          this.$http.post('parking/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = 'VIP列表表格'
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
            this.text = '服务器错误，请联系开发人员！';
            this.isflag = true;
            if(err.status == 500){
              console.log(123234);
            }
          })
        }
      },


      // 返回小区列表
      toBefore(){
        this.$router.push({path: 'estate'})
      },
      // 查看详情
      viewDetails(parkingId){
        this.$router.push({path: 'parking_details', query: {parkingId: parkingId}});
      },
      // 门禁列表
      parkingAcListEvent(parkingId, estateId){
        this.$router.push({path: 'parking_ac_list', query: {parkingId: parkingId, estateId: estateId}});
      },
      editVip(parkingId,estateId){
        this.$router.push({path: 'edit_vip', query: {parkingId: parkingId, estateId: estateId}});
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
      pagination,
      selectchild,
    },
  }
</script>
