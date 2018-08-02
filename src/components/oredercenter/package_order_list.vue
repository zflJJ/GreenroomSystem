<template>
  <div>
    <h2>套餐订单列表</h2>
    <br>
    <!--2.0 搜索框的样式-->
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="套餐名称">
          <el-input placeholder="请输入套餐名称" v-model.trim="searchFromData.name" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="套餐类型">
          <el-select v-model="searchFromData.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买用户">
          <el-input placeholder="请输入购买用户" v-model.trim="searchFromData.phone" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input placeholder="请输入车牌号" v-model.trim="searchFromData.number" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="searchFromData.pay_channel" placeholder="请选择">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付码">
          <el-input placeholder="请输入支付码" v-model.trim="searchFromData.tradeNo" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="下单时间">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker v-model="value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setTime">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" @click.native.prevent="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索
      </el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>

    <!--4.0 表格信息-->
    <template>
      <el-table style="width: 100%" :data="tableDatas" border>
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="name" label="套餐名称">
        </el-table-column>
         <el-table-column label="套餐类型">
           <template slot-scope="scope">
             <span>停车类</span>
           </template>
        </el-table-column>
        <el-table-column prop="number" label="车牌号">
        </el-table-column>

        <el-table-column prop="phone" label="购买用户">
        </el-table-column>

        <el-table-column label="订单金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.totalFee || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column label="优惠金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.discountFee||0}}元</span>
          </template>
        </el-table-column>

        <el-table-column label="实际支付">
          <template slot-scope="scope">
            <span>￥{{scope.row.realFee || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column prop="tradeNo" label="支付码">
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">已支付</span>
            <span v-else-if="scope.row.state == 0">未支付</span>
            <span v-else-if="scope.row.state == 2">已取消</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="viewDetails(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
    <!--6.0 模态框-->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible" custom-class="modelStyle" :close-on-click-modal='false' :close-on-press-escape="false" :show-close='false'>
      <table class="table">
        <tbody class="tbodyStyle" v-model="myTable">
          <tr>
            <td>订单编号：</td>
            <td>
              <span>{{myTable.serialNumber || '-'}}</span>
            </td>
            <td>套餐名称: </td>
            <td>
              <span>{{myTable.name || '-'}}</span>
            </td>
          </tr>
          <tr>
            <td>套餐类型：</td>
            <td>
              <span>停车类</span>
            </td>
            <td>创建时间：</td>
            <td>
              <span>{{myTable.createTime | moment}}</span>
            </td>
          </tr>
          <tr>
            <td>购买用户：</td>
            <td>
              <span>{{myTable.phone}}</span>
            </td>
            <td>车牌号：</td>
            <td>
              <span>{{myTable.number}}</span>
            </td>
          </tr>
          <tr>
            <td>套餐使用天数：</td>
            <td>{{myTable.inNumber}}</td>
            <td>订单金额：</td>
            <td>
              <span>￥{{myTable.totalFee}}元</span>
            </td>
          </tr>
          <tr>
            <td>优惠金额：</td>
            <td>￥{{myTable.discountFee||0}}元 </td>
            <td>优惠券编号：</td>
            <td>
              <span v-if="myTable.couponCode">{{myTable.couponCode}}</span>
              <span v-else>-</span>
            </td>
          </tr>
          <tr>
            <td>实际支付金额：</td>
            <td>￥{{myTable.realFee||0}}元 </td>
            <td>支付方式：</td>
            <td>
              <span v-if="myTable.payChannel==1">支付宝</span>
              <span v-if="myTable.payChannel==2">微信支付</span>
            </td>
          </tr>
          <tr>
            <td>支付码：</td>
            <td>
              <span v-if="myTable.tradeNo">{{myTable.tradeNo}} </span>
              <span v-else>-</span>
            </td>
            <td>状态：</td>
            <td>
              <span v-if="myTable.state == 1">已支付</span>
              <span v-else-if="myTable.state== 0">未支付</span>
              <span v-else-if="myTable.state == 2">已取消</span>
              <span v-else>-</span>
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
  height: 120px;
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
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';

export default {
  data() {
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
        name: '', //
        phone: '', //
        number: '', //
        type: '', //
        pay_channel: '', //
        tradeNo: '', //
      },
      //搜索提示信息
      // 模态框的参数
      dialogTableVisible: false,
      myTable: {},
      state: '',
      isShow: false, // 上传提示信息
      modeltext: '',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '停车类'
      }],
      payOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '2',
        label: '微信支付'
      }, {
        value: '1',
        label: '支付宝'
      }],
      orderId: '',
      fileData: '',
      imgUrl: '',
    }
  },
  created() {
    this.getTableDatas();
  },
  methods: {
    //2.0 获取无参数据的地方
    getTableDatas() {
      // 整合信息
      var datas = {};
      datas.start = this.start;
      datas.sEcho = 3;
      datas.length = this.display;
      if (this.searchFromData.name !== "") datas.name = this.searchFromData.name;
      if (this.searchFromData.phone !== "") datas.phone = this.searchFromData.phone;
      if (this.searchFromData.number !== "") datas.number = this.searchFromData.number;
      if (this.searchFromData.type !== "") datas.type = this.searchFromData.type;
      if (this.searchFromData.pay_channel !== "") datas.pay_channel = this.searchFromData.pay_channel;
      if (this.searchFromData.tradeNo !== "") datas.tradeNo = this.searchFromData.tradeNo;
      if (this.value6[0]) {
        datas.beginTime = this.value6[0];
        datas.endTime = this.value6[1];
      }
      var data = Qs.stringify(datas);
      this.$http.post('packageorder/pagelist', data).then(res => {
        // 把一些公共的东西给抽离出来
        if (res.data.error_code === 2000 && res.data.data.dataList.length !== 0) {
          this.seachLoading = false;
          var paramsData = res.data.data.dataList;
          this.total = parseInt(res.data.data.itotalRecords);
          this.tableDatas = paramsData;
        } else if (res.data.error_code !== 2000 || this.isSearch === 1) {
          this.seachLoading = false;
          this.tableDatas = [];
          var paramsData = res.data.data.dataList;
          this.$message.error('错了哦，未能匹配到搜索条件,请重新输入搜索条件!!');
        } else {
          console.log('状态码返回错误');
        };
      }).catch(err => {
        console.log(err);
      })
    },

    //获取搜索的内容(对发票类型数据做处理，)
    searchEvent() { // 做判断和验证
      var gettype = Object.prototype.toString;
      if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
        this.value6 = [];
      };
      this.seachLoading = true;
      if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
        // 前提对搜索的条件进行判断
        if (this.searchFromData.name == "" && this.searchFromData.phone == "" && this.value6.length == 0 && this.searchFromData.pay_channel == "" && this.searchFromData.type == "" && this.searchFromData.tradeNo == "") {
          this.seachLoading = false;
          this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
        } else {
          // 不管好多页，搜索默认就开始第一页的方式, 长度不变
          this.start = 0;
          this.isSearch = 1;
          this.getTableDatas();
        }
      } else if (this.isSearch == 1) {
        if (this.searchFromData.name == "" && this.searchFromData.phone == "" && this.value6.length == 0 && this.searchFromData.pay_channel == "" && this.searchFromData.type == "" && this.searchFromData.tradeNo == "") {
          this.isSearch = 0;
          this.start = 0;
        }
        this.getTableDatas();
      }
    },

    // 导出数据(接口有问题，暂时不处理)
    exportEvent() {
      this.isLoading = true;
      var exportDatas = {};
      // 对时间进行判断
      var gettype = Object.prototype.toString;
      if (gettype.call(this.value6) === '[object Null]') {
        this.value6 = [];
      };
      // 如果搜索条件为空，是没有数据导出的（并且提示用户）  // 搜索条件不为空，搜索到数据（进行导出操作）  位搜索到数据提示用户输入导出条件有误，请重新输入
      if (this.searchFromData.name == "" && this.searchFromData.phone == "" && this.value6.length == 0 && this.searchFromData.pay_channel == "" && this.searchFromData.type == "" && this.searchFromData.tradeNo == "") {
        this.isLoading = false;
        this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出!!');
      } else {
        // 对导出的参数进行处理
        exportDatas.length = this.display;
        exportDatas.sEcho = 3;
        exportDatas.start = this.start;
        if (this.searchFromData.name !== "") exportDatas.phone = this.searchFromData.name;
        if (this.searchFromData.phone !== "") exportDatas.title = this.searchFromData.phone;
        if (this.searchFromData.number !== "") exportDatas.number = this.searchFromData.number;
        if (this.searchFromData.type !== "") exportDatas.type = this.searchFromData.type;
        if (this.searchFromData.pay_channel !== "") exportDatas.pay_channel = this.searchFromData.pay_channel;
        if (this.searchFromData.tradeNo !== "") exportDatas.tradeNo = this.searchFromData.tradeNo;
        if (this.value6[0]) {
          exportDatas.beginTime = this.value6[0];
          exportDatas.endTime = this.value6[1];
        }
        var data = Qs.stringify(exportDatas);
        this.$http.post('packageorder/excel', data, { responseType: 'blob' }).then(res => {
          this.isLoading = false;
          var filename = '套餐订单表格'
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
    viewDetails(orderId) {
      // 1. 判断状态
      this.orderId = orderId;
      // 2. 请求数据
      // 3. 处理数据
      var data = {
        id: orderId
      };
      data = Qs.stringify(data)
      this.dialogTableVisible = true;
      this.$http.post('packageorder/findDetailed', data).then((res) => {
        if (res.data.error_code == 2000) {
          var paramsData = res.data.data;
          paramsData.adminId = sessionStorage.getItem('adminId');
          this.myTable = paramsData;
        }
      }).catch((err) => {
        console.log(err);
      })
    },
    // 点击模态框的内容的时候
    returnOrderList() {
      this.dialogTableVisible = false;
    },
    // 输入框内容，改变重置start
    clearStart() {
      this.compage = 1;
      this.start = 0;
    },
    // 下拉菜单的数据
    getChildLength(len) {
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
    pagechanges(val) {
      this.page = val;
      this.compage = val;
      this.start = (val - 1) * this.display;
      this.getTableDatas();
    },
    // 设置时间
    setTime() {
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

