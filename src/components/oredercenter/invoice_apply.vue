<template>
  <div>
    <h2>发票申请列表</h2>
    <br>
    <!--2.0 搜索框的样式-->
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="手机号">
          <el-input placeholder="请输入手机号" v-model.trim="searchFromData.phone" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="发票抬头">
          <el-input placeholder="请输入发票抬头" v-model.trim="searchFromData.title" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="订单的时间范围">
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
          prop="id"
          width="80px"
          label="工单ID">
        </el-table-column>

        <!-- <el-table-column
           prop="userId"
           label="用户ID">
         </el-table-column>-->

        <el-table-column
          width="200px"
          prop="phone"
          label="手机号">
        </el-table-column>

        <el-table-column
          label="纳税人识别号">
          <template slot-scope="scope">
            <span>{{scope.row.taxpayerId || '无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="title"
          label="发票抬头">
        </el-table-column>

        <el-table-column
          label="发票金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.fee || 0}}元</span>
          </template>
        </el-table-column>

        <!--单独处理-->
        <el-table-column
          label="发票类型">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="电子邮件">
          <template slot-scope="scope">
            <span>{{scope.row.email || '无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.applyTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1700">未审核</span>
            <span v-else-if="scope.row.state == 1701">审核通过</span>
            <span v-else-if="scope.row.state == 1702">审核未通过</span>
            <span v-else-if="scope.row.state == 1703">发票已冲红</span>
          </template>
        </el-table-column>

        <el-table-column
          label="详细信息">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="viewDetails(scope.row.id,scope.row.state)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <!--6.0 模态框-->
    <el-dialog title="详细信息"
    :visible.sync="dialogTableVisible"
     custom-class="modelStyle"
     :close-on-click-modal='false'
     :close-on-press-escape="false"
     :show-close='false'>
      <table class="table">
        <tbody class="tbodyStyle" v-model="myTable">
        <tr>
          <td>工单ID：</td>
          <td><span>{{myTable.id || '无'}}</span></td>
          <td>状态：</td>
          <td>
            <span v-if="state == 1700">未审核</span>
            <span v-else-if="state == 1701">审核通过</span>
            <span v-else-if="state == 1702">审核未通过</span>
            <span v-else-if="state == 1703">发票已冲红</span>
          </td>
        </tr>
        <tr>
          <td>手机号：</td>
          <td><span>{{myTable.phone || '无'}}</span></td>
          <td>可开发票总余额：</td>
          <td>
            <span>￥{{myTable.totalFee || 0}}元</span>
          </td>
        </tr>
        <tr>
          <td>发票金额：</td>
          <td><span>￥{{myTable.fee || 0}}元</span></td>
          <td>发票类型：</td>
          <td><span>电子发票</span>&nbsp;<span v-if="myTable.type==0">个人发票</span><span v-else-if="myTable.type==1">企业发票</span></td>
        </tr>
        <tr>
          <td>申请时间：</td>
          <td>{{myTable.applyTime | moment}}</td>
          <td>完成时间：</td>
          <td>
            <span v-if="state == 1700">无</span>
            <span v-else>{{myTable.completeTime | moment}}</span>
          </td>
        </tr>
        <tr>
          <td>发票抬头：</td>
          <td>{{myTable.title}} </td>
          <td></td>
          <td></td>
        </tr>
        <tr v-if="state !== 1700">
          <td>
            <el-button type="success" @click="lookImage(myTable.path)">查看发票</el-button>
          </td>
          <td colspan="3"></td>
        </tr>
        <tr v-show="isImageShow">
          <td colspan="4">
            <!--<iframe-->
              <!--:src="pdfurls"-->
              <!--class="iframeStyle"></iframe>-->
            <img :src="pdfurls"class="iframeStyle" alt="">
          </td>
        </tr>
        </tbody>
      </table>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="returnOrderList">返回</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<style scoped>
  .iframeStyle {
    frameborder: 0;
    scrolling: no;
    width: 100%;
    height: 450px;
    scrolling: auto;
  }

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
  }

  .divStyle {
    position: relative;
    height: 60px;
  }

</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';

  export default{
    data(){
      return {

        // pdf的展示数据
        pdfurls: '',
        isshowpdf: true,
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
          phone: '', // 联系电话
          title: '', // 地区名称
//          content: '',// 内容
//          startApplyTime:1514390400000
//          endApplyTime:1514476799999
        },
        //搜索提示信息
        // 模态框的参数
        dialogTableVisible: false,
        myTable: {},
        paramsUrl:'',
        state: '',
        isShow: false, // 上传提示信息
        modeltext: '',
        payType: [
          {id: 0, text: '未审核'},
          {id: 1, text: '审核通过'},
          {id: 2, text: '审核未通过'},
          {id: 3, text: "发票已冲红"},
        ],
        orderId: '',
        fileData: '',
        isImageShow: false, // 发票是不显示的
        imgUrl: '',
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 1.0 查看发票
      lookImage(path){
        // 发送请求显示图片
        this.isImageShow = true;
        this.pdfurls = path;
      },
      //2.0 获取无参数据的地方
      getTableDatas(){
        // 整合信息
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.value6[0]) datas.startApplyTime = this.value6[0];
        if (this.value6[1]) datas.endApplyTime = this.value6[1];
        if (this.searchFromData.phone !== "") datas.phone = this.searchFromData.phone;
        if (this.searchFromData.title  !== "") datas.title = this.searchFromData.title;
        var data = Qs.stringify(datas);
        this.$http.post('order/invoice/pageable', data).then(res => {
          // 把一些公共的东西给抽离出来
          if (res.data.error_code === 2000 && res.data.data.dataList.length !== 0) {
            this.seachLoading = false;
            var paramsData = res.data.data.dataList;
            for (var i = 0; i < paramsData.length; i++) {
              if (paramsData[i].type == 0) {
                paramsData[i].type = '个人发票';
              } else {
                paramsData[i].type = '企业发票';
              }
            }
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = paramsData;
          } else if(res.data.error_code !== 2000  || this.isSearch === 1){
            this.seachLoading = false;
            var paramsData = res.data.data.dataList;
            this.$message.error('错了哦，未能匹配到搜索条件,请重新输入搜索条件!!');
          }else {
            console.log('状态码返回错误');
          };
        }).catch(err => {
          console.log(err);
        })
      },

      //获取搜索的内容(对发票类型数据做处理，)
      searchEvent(){ // 做判断和验证
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        };
        this.seachLoading = true;
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          // 前提对搜索的条件进行判断
          if (this.searchFromData.phone === "" && this.searchFromData.title === "" && this.value6.length === 0) {
            this.seachLoading = false;
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
          } else {
            // 不管好多页，搜索默认就开始第一页的方式, 长度不变
            this.start = 0;
            this.isSearch = 1;
            this.getTableDatas();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.phone === "" && this.searchFromData.title === "" && this.value6.length === 0) {
            this.isSearch = 0;
            this.start = 0;
          }
          this.getTableDatas();
        }
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
        if (this.searchFromData.phone == "" && this.searchFromData.title == "" &&  this.value6.length == 0) {
          this.seachLoading = false;
          this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出!!');
        } else {
          // 对导出的参数进行处理
          exportDatas.length = this.display;
          exportDatas.sEcho = 3;
          exportDatas.start = this.start;
          if (this.value6[0]) exportDatas.startApplyTime = this.value6[0];
          if (this.value6[1]) exportDatas.endApplyTime = this.value6[1];
          if (this.searchFromData.phone) exportDatas.phone = this.searchFromData.phone;
          if (this.searchFromData.title) exportDatas.title = this.searchFromData.title;
//          if (this.searchFromData.content) exportDatas.content = this.searchFromData.content;
          var data = Qs.stringify(exportDatas);
          this.$http.post('order/invoice/orderInvoiceExcel', data, {responseType: 'blob'}).then(res => {
              this.isLoading = false;
              var filename = '发票申请表格'
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
            console.log(err);
            this.isLoading = false;
            this.$message.error('错了哦，导出数据错误，请重新输入数据');
          })
        }
      },

      // 查看详情
      viewDetails(orderId, state){
        // 1. 判断状态
        this.state = state;
        this.orderId = orderId;
        // 2. 请求数据
        // 3. 处理数据
        this.dialogTableVisible = true;
        this.$http.get('order/invoiceOne/' + orderId).then((res) => {
          if (res.data.error_code == 2000) {
            var paramsData = res.data.data;
            paramsData.adminId = sessionStorage.getItem('adminId');
            this.paramsUrl = paramsData.pdfUrl;
            this.myTable = paramsData;
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      // 点击模态框的内容的时候
      returnOrderList(){
         this.isImageShow = false;
         this.paramsUrl = '';
        this.dialogTableVisible = false;
      },
      // 输入框内容，改变重置start
      clearStart(){
        this.compage = 1;
        this.start = 0;
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
        this.getTableDatas();
      },
      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTableDatas();
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

    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

