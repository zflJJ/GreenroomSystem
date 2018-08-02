<template>
  <div>
    <h3>财务统计报表</h3>
    <div class="block">
      <span class="demonstration">选择时间范围</span>
      <el-date-picker
        size="large"
        v-model="value7"
        type="daterange"
        align="left"
        unlink-panels
        @change='timeChange'
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2">
      </el-date-picker>
    </div>
    <br>
    <el-button type="primary" autofocus :status='1' :disabled='daydisabled' size="small" @click='day'>日</el-button>
    <el-button type="primary" :status='2' :disabled='weekdisabled' size="small" @click='week'>周</el-button>
    <el-button type="primary" :status='3' :disabled='monthdisabled' size="small" @click='month'>月</el-button>
    <br>
    <br>
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="财务总流量统计">
        <div id="financial" style="width:100%;height:500px;"></div>
        <!--2.0 下拉菜单（左边））-->
        <selectchild v-on:getlength="getChildLength"></selectchild>
        <el-table :data="tableDatas" border style="width: 100%">
          <el-table-column label="日期" prop="time">
            <template slot-scope="scope">
              {{scope.row.time | moment}}
            </template>
          </el-table-column>
          <el-table-column label="现金流入量" prop="inflow">
            <template slot-scope="scope">
              ￥{{scope.row.inflow}}元
            </template>
          </el-table-column>
          <el-table-column label="现金流出量" prop="outflow">
            <template slot-scope="scope">
              ￥{{scope.row.outflow}}元
            </template>
          </el-table-column>
          <el-table-column label="现金流量余额" prop="balance">
            <template slot-scope="scope">
              ￥{{scope.row.balance}}元
            </template>
          </el-table-column>
        </el-table>
        <!--4.0 分页插件-->
        <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                    v-on:pagechange="pagechanges"></paingchild>
      </el-tab-pane>
      <el-tab-pane label="手续费统计">
        <div id="serviceCharge" style="width:100%;height:500px;"></div>
        <!--2.0 下拉菜单（左边））-->
        <selectchild v-on:getlength="getChildLength"></selectchild>
        <el-table :data="tableDatas" border style="width: 100%">
          <el-table-column label="日期" prop="time">
            <template slot-scope="scope">
              {{scope.row.time | moment}}
            </template>
          </el-table-column>
          <el-table-column label="总手续费" prop="inflow">
            <template slot-scope="scope">
              ￥{{scope.row.tripartiteFee}}元
            </template>
          </el-table-column>
          <el-table-column label="支付宝手续费" prop="outflow">
            <template slot-scope="scope">
              ￥{{scope.row.zfbFee}}元
            </template>
          </el-table-column>
          <el-table-column label="微信手续费" prop="balance">
            <template slot-scope="scope">
              ￥{{+scope.row.wxFee}}元
            </template>
          </el-table-column>
        </el-table>
        <!--4.0 分页插件-->
        <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                    v-on:pagechange="pagechanges"></paingchild>
      </el-tab-pane>
      <el-tab-pane label="发票统计">
        <div id="invoice" style="width:100%;height:500px;"></div>
        <!--2.0 下拉菜单（左边））-->
        <selectchild v-on:getlength="getChildLength"></selectchild>
        <el-table :data="tableDatas" border style="width: 100%">
          <el-table-column label="日期" prop="time">
            <template slot-scope="scope">
              {{scope.row.time | moment}}
            </template>
          </el-table-column>
          <el-table-column label="可开发票总额" prop="inflow">
            <template slot-scope="scope">
              ￥{{scope.row.invoiceFeeTotal}}元
            </template>
          </el-table-column>
          <el-table-column label="已开发票总额" prop="outflow">
            <template slot-scope="scope">
              ￥{{scope.row.invoiceFee}}元
            </template>
          </el-table-column>
          <el-table-column label="申请但未开发票额度" prop="balance">
            <template slot-scope="scope">
              ￥{{+scope.row.invoiceFeeUnexecuted}}元
            </template>
          </el-table-column>
        </el-table>
        <!--4.0 分页插件-->
        <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                    v-on:pagechange="pagechanges"></paingchild>
      </el-tab-pane>
      <el-tab-pane label="提现统计">
        <div id="withdraw" style="width:100%;height:500px;"></div>
        <!--2.0 下拉菜单（左边））-->
        <selectchild v-on:getlength="getChildLength"></selectchild>
        <el-table :data="tableDatas" border style="width: 100%">
          <el-table-column label="日期" prop="time">
            <template slot-scope="scope">
              {{scope.row.time | moment}}
            </template>
          </el-table-column>
          <el-table-column label="转给个人的费用" prop="inflow">
            <template slot-scope="scope">
              ￥{{scope.row.userFee}}元
            </template>
          </el-table-column>
          <el-table-column label="转给业主的费用" prop="outflow">
            <template slot-scope="scope">
              ￥{{scope.row.ownerFee}}元
            </template>
          </el-table-column>
          <el-table-column label="转给物业的费用" prop="balance">
            <template slot-scope="scope">
              ￥{{+scope.row.estateFee}}元
            </template>
          </el-table-column>
        </el-table>
        <!--4.0 分页插件-->
        <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                    v-on:pagechange="pagechanges"></paingchild>
      </el-tab-pane>
      <el-tab-pane label="优惠券统计">
        <div id="coupon" style="width:100%;height:500px;"></div>
        <!--2.0 下拉菜单（左边））-->
        <selectchild v-on:getlength="getChildLength"></selectchild>
        <el-table :data="tableDatas" border style="width: 100%">
          <el-table-column label="日期" prop="time">
            <template slot-scope="scope">
              {{scope.row.time | moment}}
            </template>
          </el-table-column>
          <el-table-column label="使用优惠券总额" prop="inflow">
            <template slot-scope="scope">
              ￥{{scope.row.couponFee}}元
            </template>
          </el-table-column>
          <el-table-column label="新人优惠券使用统计金额" prop="outflow">
            <template slot-scope="scope">
              ￥{{scope.row.couponFeeFreshmen}}元
            </template>
          </el-table-column>
          <el-table-column label="无限制优惠券使用统计金额" prop="balance">
            <template slot-scope="scope">
              ￥{{+scope.row.couponFeeUnlimited}}元
            </template>
          </el-table-column>
        </el-table>
        <!--4.0 分页插件-->
        <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                    v-on:pagechange="pagechanges"></paingchild>
      </el-tab-pane>
    </el-tabs>
    <br>
    <br>
    <!--财务统计-->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>财务总流量统计</h4>
          </div>
          <div class="text item">
            现金流入量
          </div>
          <div class="text item boxCenter">
            ￥{{financialData.inflow}}元
          </div>
          <div class="text item boxCenter">
            (充值总和)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>财务总流量统计</h4>
          </div>
          <div class="text item">
            现金流出量
          </div>
          <div class="text item boxCenter">
            ￥{{financialData.outflow}}元
          </div>
          <div class="text item boxCenter">
            (提现+退款总和)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>财务总流量统计</h4>
          </div>
          <div class="text item">
            现金流量余额
          </div>
          <div class="text item boxCenter">
            ￥{{financialData.balance}}元
          </div>
          <div class="text item boxCenter">
            (钱包余额总和)
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <br>
    <!--手续费统计-->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>手续费统计</h4>
          </div>
          <div class="text item">
            总手续费
          </div>
          <div class="text item boxCenter">
            ￥{{serviceData.tripartiteFee}}元
          </div>
          <div class="text item boxCenter">
            (总手续费6‰)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>手续费统计</h4>
          </div>
          <div class="text item">
            支付宝手续费
          </div>
          <div class="text item boxCenter">
            ￥{{serviceData.zfbFee}}元
          </div>
          <div class="text item boxCenter">
            (支付宝扣费6‰)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>手续费统计</h4>
          </div>
          <div class="text item">
            微信手续费
          </div>
          <div class="text item boxCenter">
            ￥{{serviceData.wxFee}}元
          </div>
          <div class="text item boxCenter">
            (微信手续费6‰)
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <br>
    <!--发票统计-->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>发票统计</h4>
          </div>
          <div class="text item">
            可开发票总额
          </div>
          <div class="text item boxCenter">
            ￥{{invoice.invoiceFeeTotal}}元
          </div>
          <div class="text item boxCenter">
            (可开发票总额，消费总金额，不含优惠券金额)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>发票统计</h4>
          </div>
          <div class="text item">
            已开发票总额
          </div>
          <div class="text item boxCenter">
            ￥{{invoice.invoiceFee}}元
          </div>
          <div class="text item boxCenter">
            (已开发票总额，客户提交申请并完成开票的总额)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>发票统计</h4>
          </div>
          <div class="text item">
            申请但未开发票额度
          </div>
          <div class="text item boxCenter">
            ￥{{invoice.invoiceFeeUnexecuted}}元
          </div>
          <div class="text item boxCenter">
            (申请但未开发票额度，客户提交申请，未完成开票的总额)
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <br>
    <!--提现统计-->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>提现统计</h4>
          </div>
          <div class="text item">
            个人提现
          </div>
          <div class="text item boxCenter">
            ￥{{withdrawData.userFee || 0}}元
          </div>
          <div class="text item boxCenter">
            (转给个人的费用)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>提现统计</h4>
          </div>
          <div class="text item">
            业主提现
          </div>
          <div class="text item boxCenter">
            ￥{{withdrawData.ownerFee || 0}}元
          </div>
          <div class="text item boxCenter">
            (转给业主的费用)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>提现统计</h4>
          </div>
          <div class="text item">
            物业提现
          </div>
          <div class="text item boxCenter">
            ￥{{withdrawData.estateFee || 0}}元
          </div>
          <div class="text item boxCenter">
            (转给物业的费用)
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <br>
    <!--优惠券统计-->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>优惠券统计</h4>
          </div>
          <div class="text item">
            优惠券发放总额
          </div>
          <div class="text item boxCenter">
            ￥{{couponData.couponLimitFee}}元
          </div>
          <div class="text item boxCenter">
            (优惠券发放统计金额)
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h4>优惠券统计</h4>
          </div>
          <div class="text item">
            优惠券使用总额
          </div>
          <div class="text item boxCenter">
            ￥{{couponData.couponUsedFee}}元
          </div>
          <div class="text item boxCenter">
            (优惠券使用统计金额)
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .text.item.boxCenter {
    text-align: center;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs'
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');

  export default {
    data() {
      return {
        type: "primary",
        pickerOptions2: {
          shortcuts: [{
            text: '过去7日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              var endTime = end.setHours(0, 0, 0, 0) - 1;
              start.setTime(endTime - 3600 * 1000 * 24 * 7 + 1);
              end.setTime(endTime);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '过去30日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              var endTime = end.setHours(0, 0, 0, 0) - 1;
              start.setTime(endTime - 3600 * 1000 * 24 * 30 + 1);
              end.setTime(endTime);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '过去60日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              var endTime = end.setHours(0, 0, 0, 0) - 1;
              start.setTime(endTime - 3600 * 1000 * 24 * 60 + 1);
              end.setTime(endTime);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value7: [new Date().setHours(0, 0, 0, 0) - 604800000, new Date().setHours(23, 59, 59, 59) - 86400000],
        daydisabled: false,
        weekdisabled: false,
        monthdisabled: false,
        tabName: '',
        status: 1,
        financialData: {},
        serviceData: {},
        invoice: {},
        withdrawData: {},
        couponData: {},
        //前端分页插件传递的数据 7个
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,//表格数据的长度
        pageDatas: [],//表格所有数据
        tableDatas: [],  // 渲染表格所用到的数据
      };
    },
    methods: {
      day(){
        this.compage = 1;
        this.getFun(1);
      },
      week(){
        this.compage = 1;
        this.getFun(2);
      },
      month(){
        this.compage = 1;
        this.getFun(3);
      },
      handleClick(tab, event) {
        var startTime = new Date(this.value7[0]).getTime();
        var endTime = new Date(this.value7[1]).getTime();
        this.compage = 1;
        if (event.target.innerText == "财务总流量统计") {
          this.tabName = "财务总流量统计";
          this.getFinancialData(startTime, endTime, 1);
        } else if (event.target.innerText == "手续费统计") {
          this.tabName = "手续费统计";
          this.getServiceCharge(startTime, endTime, 1);
        } else if (event.target.innerText == "发票统计") {
          this.tabName = "发票统计";
          this.getInvoice(startTime, endTime, 1);
        } else if (event.target.innerText == "提现统计") {
          this.tabName = "提现统计";
          this.getWithdraw(startTime, endTime, 1);
        } else if (event.target.innerText == "优惠券统计") {
          this.tabName = "优惠券统计";
          this.getCoupon(startTime, endTime, 1);
        }
      },
      timeChange(){
        var startTime = new Date(this.value7[0]).getTime();
        var endTime = new Date(this.value7[1]).getTime();
        var time = endTime - startTime;
        if (time < 604800000) {
          this.monthdisabled = true;
          this.weekdisabled = true;
          this.daydisabled = false;
        } else if (time < 2592000000) {
          this.monthdisabled = true;
          this.weekdisabled = false;
          this.daydisabled = false;
        } else {
          this.monthdisabled = false;
          this.weekdisabled = false;
          this.daydisabled = false;
        }
        this.compage = 1;
        this.getFun(1);
      },
      getFun(status){
        var startTime = new Date(this.value7[0]).getTime();
        var endTime = new Date(this.value7[1]).getTime();
        if (this.tabName == "财务总流量统计") {
          this.getFinancialData(startTime, endTime, status);
        } else if (this.tabName == "手续费统计") {
          this.getServiceCharge(startTime, endTime, status);
        } else if (this.tabName == "发票统计") {
          this.getInvoice(startTime, endTime, status);
        } else if (this.tabName == "提现统计") {
          this.getWithdraw(startTime, endTime, status);
        } else if (this.tabName == "优惠券统计") {
          this.getCoupon(startTime, endTime, status);
        }
      },
      //获取财务总流量统计数据
      getFinancialData: function (startTime, endTime, type) {
        var data = {startTime: startTime, endTime: endTime, type: type}
        data = Qs.stringify(data)
        this.$http.post("finance/total", data).then(res => {
          var data = res.data.data.financeList;
          this.pageDatas = data;
          this.total = data.length;
          this.tableDatas = data.slice(0, this.display);
          var title = "财务总流量统计";
          var content = ['现金流入量', '现金流出量', "现金流量余额"];
          var time = [];
          var strTime = '';
          var inflow = [];//现金流入量
          var outflow = [];//现金流出量
          var balance = [];//现金流量余额
          var arr = [{}, {}, {}];
          for (var i = 0; i < data.length; i++) {
            strTime = data[i].time;
            strTime = this.format(strTime);
            time.push(strTime);
            inflow.push(data[i].inflow);
            outflow.push(data[i].outflow);
            balance.push(data[i].balance);
          }
          arr[0].name = '现金流入量';
          arr[0].type = 'line';
          arr[0].data = inflow;
          arr[1].name = '现金流出量';
          arr[1].type = 'line';
          arr[1].data = outflow;
          arr[2].name = '现金流量余额';
          arr[2].type = 'line';
          arr[2].data = balance;
          this.showChartsFinancial(title, content, time, arr)
        })
      },
      //获取手续费统计数据
      getServiceCharge: function (startTime, endTime, type) {
        var data = {startTime: startTime, endTime: endTime, type: type}
        data = Qs.stringify(data)
        this.$http.post("finance/tripartiteFee", data).then(res => {
          var data = res.data.data.tripartiteFeeList;
          this.pageDatas = data;
          this.total = data.length;
          this.tableDatas = data.slice(0, this.display);
          var title = "手续费统计";
          var content = ['总手续费', '支付宝手续费', "微信手续费"];
          var time = [];
          var strTime = '';
          var tripartiteFee = [];//总手续费
          var zfbFee = [];//支付宝手续费
          var wxFee = [];//微信手续费
          var arr = [{}, {}, {}];
          for (var i = 0; i < data.length; i++) {
            strTime = data[i].time;
            strTime = this.format(strTime);
            time.push(strTime)
            tripartiteFee.push(data[i].tripartiteFee)
            zfbFee.push(data[i].zfbFee)
            wxFee.push(data[i].wxFee)
          }
          arr[0].name = '总手续费';
          arr[0].type = 'line';
          arr[0].data = tripartiteFee;
          arr[1].name = '支付宝手续费';
          arr[1].type = 'line';
          arr[1].data = zfbFee;
          arr[2].name = '微信手续费';
          arr[2].type = 'line';
          arr[2].data = wxFee;
          this.showChartsServiceCharge(title, content, time, arr)
        })
      },
      //获取发票统计数据
      getInvoice: function (startTime, endTime, type) {
        var data = {startTime: startTime, endTime: endTime, type: type}
        data = Qs.stringify(data)
        this.$http.post("finance/invoiceFee", data).then(res => {
          var data = res.data.data.invoiceFeeList;
          this.pageDatas = data;
          this.total = data.length;
          this.tableDatas = data.slice(0, this.display);
          var title = "发票统计";
          var content = ['可开发票总额', '已开发票总额', "申请但未开发票额度"];
          var time = [];
          var strTime = '';
          var invoiceFeeTotal = [];//可开发票总额
          var invoiceFee = [];//已开发票总额
          var invoiceFeeUnexecuted = [];//申请但未开发票额度
          var arr = [{}, {}, {}];
          for (var i = 0; i < data.length; i++) {
            strTime = data[i].time;
            strTime = this.format(strTime);
            time.push(strTime)
            invoiceFeeTotal.push(data[i].invoiceFeeTotal)
            invoiceFee.push(data[i].invoiceFee)
            invoiceFeeUnexecuted.push(data[i].invoiceFeeUnexecuted)
          }
          arr[0].name = '可开发票总额';
          arr[0].type = 'line';
          arr[0].data = invoiceFeeTotal;
          arr[1].name = '已开发票总额';
          arr[1].type = 'line';
          arr[1].data = invoiceFee;
          arr[2].name = '申请但未开发票额度';
          arr[2].type = 'line';
          arr[2].data = invoiceFeeUnexecuted;
          this.showChartsInvoice(title, content, time, arr)
        })
      },
      //获取提现统计数据
      getWithdraw: function (startTime, endTime, type) {
        var data = {startTime: startTime, endTime: endTime, type: type}
        data = Qs.stringify(data)
        this.$http.post("finance/withdrawFee", data).then(res => {
          var data = res.data.data.withdrawFeeList;
          this.pageDatas = data;
          this.total = data.length;
          this.tableDatas = data.slice(0, this.display);
          var title = "发票统计";
          var content = ['转给个人的费用', '转给业主的费用', "转给物业的费用"];
          var time = [];
          var strTime = '';
          var userFee = [];//转给个人的费用
          var ownerFee = [];//转给业主的费用
          var estateFee = [];//转给物业的费用
          var arr = [{}, {}, {}];
          for (var i = 0; i < data.length; i++) {
            strTime = data[i].time;
            strTime = this.format(strTime);
            time.push(strTime)
            userFee.push(data[i].userFee)
            ownerFee.push(data[i].ownerFee)
            estateFee.push(data[i].estateFee)
          }
          arr[0].name = '转给个人的费用';
          arr[0].type = 'line';
          arr[0].data = userFee;
          arr[1].name = '转给业主的费用';
          arr[1].type = 'line';
          arr[1].data = ownerFee;
          arr[2].name = '转给物业的费用';
          arr[2].type = 'line';
          arr[2].data = estateFee;
          this.showChartsWithdraw(title, content, time, arr)
        })
      },
      //获取优惠券统计数据
      getCoupon: function (startTime, endTime, type) {
        var data = {startTime: startTime, endTime: endTime, type: type}
        data = Qs.stringify(data)
        this.$http.post("finance/couponFee", data).then(res => {
          var data = res.data.data.couponFeeList;
          this.pageDatas = data;
          this.total = data.length;
          this.tableDatas = data.slice(0, this.display);
          var title = "优惠券统计";
          var content = ['使用优惠券总额', '发放优惠券总额'];
          var time = [];
          var strTime = '';
          var couponUsedFee = [];//使用优惠券总额
          var couponLimitFee = [];//新人优惠券使用统计金额
          var arr = [{}, {}];
          for (var i = 0; i < data.length; i++) {
            strTime = data[i].time;
            strTime = this.format(strTime);
            time.push(strTime)
            couponUsedFee.push(data[i].couponUsedFee)
            couponLimitFee.push(data[i].couponLimitFee)
          }
          arr[0].name = '使用优惠券总额';
          arr[0].type = 'line';
          arr[0].data = couponUsedFee;
          arr[1].name = '发放优惠券总额';
          arr[1].type = 'line';
          arr[1].data = couponLimitFee;
          this.showChartsCoupon(title, content, time, arr)
        })
      },

      //财务总流量统计图表
      showChartsFinancial: function (title, content, time, arr) {
        var myChart = echarts.init(document.getElementById('financial'));
        myChart.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: content
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: time
            },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          },
          series: arr
        })
      },
      //手续费统计图表
      showChartsServiceCharge: function (title, content, time, arr) {
        var myChart = echarts.init(document.getElementById('serviceCharge'));
        myChart.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: content
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          },
          series: arr
        })
      },
      //发票统计图表
      showChartsInvoice: function (title, content, time, arr) {
        var myChart = echarts.init(document.getElementById('invoice'));
        myChart.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: content
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          },
          series: arr
        })
      },
      //提现统计图表
      showChartsWithdraw: function (title, content, time, arr) {
        var myChart = echarts.init(document.getElementById('withdraw'));
        myChart.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: content
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          },
          series: arr
        })
      },
      //优惠券统计图表
      showChartsCoupon: function (title, content, time, arr) {
        var myChart = echarts.init(document.getElementById('coupon'));
        myChart.setOption({
          title: {
            text: title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: content
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: time
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} '
            }
          },
          series: arr
        })
      },
      //时间格式处理
      format: function (fmt) {
        var da = fmt;
        da = new Date(da);
        var year = da.getFullYear();
        var month = da.getMonth() + 1;
        var date = da.getDate();
        return [year, month, date].join('-');
      },
      // 点击分页的数据
      pagechanges(val){
        var start = 0;
        this.page = val;
        // 计算位置
        this.compage = val;
        start = (val - 1) * this.display;
        this.tableDatas = this.pageDatas.slice(start, this.display + start);
      },
      // 下拉菜单
      getChildLength(len){
        // 数据是一次请求回来的，要对数据进行拆分
        var pageData = 0, age = 0, start;
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
        start = (age - 1) * len;
        this.page = age;
        this.compage = age;
        this.display = parseInt(len);
        this.tableDatas = this.pageDatas.slice(start, start + this.display);
      },
    },
    mounted() {
      this.tabName = "财务总流量统计";
      var startTime = new Date(this.value7[0]).getTime();
      var endTime = new Date(this.value7[1]).getTime();
      this.getFinancialData(startTime, endTime, 1);
      this.timeChange();
      var data = {startTime: null, endTime: null, type: 1}
      data = Qs.stringify(data)
      this.$http.post("finance/total", data).then(res => {
        console.log(res)
        var data = res.data.data.financeList;
        this.financialData = data[0];
      })
      this.$http.post("finance/tripartiteFee", data).then(res => {
        console.log(res)
        var data = res.data.data.tripartiteFeeList;
        this.serviceData = data[0];
      })
      this.$http.post("finance/invoiceFee", data).then(res => {
        console.log(res)
        var data = res.data.data.invoiceFeeList;
        this.invoice = data[0];
      })
      this.$http.post("finance/withdrawFee", data).then(res => {
        console.log(res)
        var data = res.data.data.withdrawFeeList;
        this.withdrawData = data[0];
      })
      this.$http.post("finance/couponFee", data).then(res => {
        console.log(res)
        var data = res.data.data.couponFeeList;
        this.couponData = data[0];
      })
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  };
</script>
