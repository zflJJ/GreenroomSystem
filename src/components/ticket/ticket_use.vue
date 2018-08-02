<template>
  <div>
    <h3>优惠券统计</h3>
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
    <div id="coupon" style="width: 100%;height:600px;"></div>
  </div>
</template>

<style>
  .el-dropdown {
    vertical-align: top;
  }

  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

<script>
  import Qs from 'qs';
  var echarts = require('echarts');
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
      }
    },
    created(){
      this.getFun(1);
      this.timeChange();
    },
    methods: {
      //点击按钮
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
      //时间改变
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
      //获取数据
      getFun(status){
        var startTime = new Date(this.value7[0]).getTime();
        var endTime = new Date(this.value7[1]).getTime();
        this.getCoupon(startTime, endTime, status);
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
    }
  }
</script>
