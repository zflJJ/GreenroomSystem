<template>
  <div>
    <h2>活动统计</h2>
    <br>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="活动名称">
        <el-input v-model="name" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="活动时间">
        <!--<el-input  v-model="beginTime" :disabled=true class="inputWidth"></el-input>-->
        {{beginTime}}
      </el-form-item>
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      <el-form-item label="选择时间范围">
        <div class="block">
          <el-date-picker size="large" v-model="valueTime" type="daterange" align="left" unlink-panels @change='timeChange' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>
    <br>
    <el-row :gutter="24">
      <el-col :span="12">
        <div class="block">
          <span class="demonstration">累计浏览量</span>
          <el-date-picker size="large" v-model="cumulativePageViewsTime" type="daterange" align="left" unlink-panels @change='cumulativePageViewsTimeChange' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div id="cumulativePageViews" style="width:100%;height:500px;"></div>
        <!--<div v-else class="noData">暂无数据</div>-->
      </el-col>
      <el-col :span="12">
        <div class="block">
          <span class="demonstration">累计参与人数</span>
          <el-date-picker size="large" v-model="cumulativeParticipantsTime" type="daterange" align="left" unlink-panels @change='cumulativeParticipantsTimeChange' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div id="cumulativeParticipants" style="width:100%;height:500px;"></div>
        <!--<div v-else class="noData">暂无数据</div>-->
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="24">
      <el-col :span="12">
        <div class="block">
          <span class="demonstration">累计获奖人数</span>
          <el-date-picker size="large" v-model="cumulativeWinnersTime" type="daterange" align="left" unlink-panels @change='cumulativeWinnersTimeChange' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div id="cumulativeWinners" style="width:100%;height:500px;"></div>
        <!--<div v-else class="noData">暂无数据</div>-->
      </el-col>
      <el-col :span="12">
        <div class="block">
          <span class="demonstration">活动触发统计</span>
          <el-date-picker size="large" v-model="activityTriggerStatisticsTime" type="daterange" align="left" unlink-panels @change='activityTriggerStatisticsTimeChange' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div id="activityTriggerStatistics" style="width:100%;height:500px;"></div>
        <!--<div v-else class="noData">暂无数据</div>-->
      </el-col>
    </el-row>
    <br>
    <h3>活动详情列表</h3>
    <br>
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" class="btn" @click="btnexcel">导出</el-button>
    </div>
    <template>
      <el-table style="width: 100%" :data="tableDatas" border>
        <el-table-column prop="id" label="序号">
        </el-table-column>
        <el-table-column prop="phone" label="获奖用户">
        </el-table-column>
        <!--TODO-->
        <el-table-column v-if="typeStr=='邀请'" prop="tagNames" label="用户标签">
        </el-table-column>
        <el-table-column v-if="typeStr=='邀请'" prop="laTypeStr" label="邀请类型">
        </el-table-column>
        <el-table-column v-if="typeStr=='邀请'" prop="targetPhone" label="邀请用户">
        </el-table-column>
        <el-table-column prop="prizeName" label="奖品">
        </el-table-column>
        <el-table-column prop="prizeNumber" label="奖品数量">
        </el-table-column>
        <el-table-column prop="triggerTypesStr" label="奖品触发途径">
        </el-table-column>
        <el-table-column prop="url" label="获奖时间">
          <template slot-scope="scope">
            <span v-if="scope.row.prizeCreateTime">{{scope.row.prizeCreateTime | monet}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<style>
.inputWidth {
  width: 640px;
}
.noData {
  position: relative;
  left: 5rem;
  top: 5rem;
}
.btn {
  float: right;
  right: 20px;
}
</style>

<script>
var echarts = require('echarts/lib/echarts');
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
import Qs from 'qs';
export default {
  data() {
    return {
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 0,
      start: 0,
      id: this.$route.query.id,//id,活动名称,开始结束时间,活动类型(用于表格是否显示多两列)
      name: this.$route.query.name,
      beginTime: this.$route.query.beginTime,
      endTime: this.$route.query.endTime,
      typeStr: this.$route.query.typeStr,
      valueTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 59)],//总的时间
      cumulativePageViewsTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 59)],//累计浏览量的时间
      cumulativeParticipantsTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 59)],//累计参与人数的时间
      cumulativeWinnersTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 59)],//累计获奖人数的时间
      activityTriggerStatisticsTime: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 59)],//活动触发统计的时间
      pickerOptions: {
        shortcuts: [{
          text: '当日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            var startTime = start.setHours(0, 0, 0, 0);
            var endTime = end.setHours(0, 0, 0, 0) - 1 + 3600 * 1000 * 24;
            start.setTime(startTime);
            end.setTime(endTime);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近7日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            var endTime = end.setHours(0, 0, 0, 0) - 1 + 3600 * 1000 * 24;
            var startTime = endTime - 3600 * 1000 * 24 * 7 + 1;
            start.setTime(startTime);
            end.setTime(endTime);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近30日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            var endTime = end.setHours(0, 0, 0, 0) - 1 + 3600 * 1000 * 24;
            var startTime = endTime - 3600 * 1000 * 24 * 30 + 1;
            start.setTime(startTime);
            end.setTime(endTime);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近60日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            var endTime = end.setHours(0, 0, 0, 0) - 1 + 3600 * 1000 * 24;
            var startTime = endTime - 3600 * 1000 * 24 * 60 + 1;
            start.setTime(startTime);
            end.setTime(endTime);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近90日',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            var endTime = end.setHours(0, 0, 0, 0) - 1 + 3600 * 1000 * 24;
            var startTime = endTime - 3600 * 1000 * 24 * 90 + 1;
            start.setTime(startTime);
            end.setTime(endTime);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      cumulativePageViewsFlag: false,
      cumulativeParticipantsFlag: false,
      cumulativeWinnersFlag: false,
      activityTriggerStatisticsFlag: false,
      tableDatas: [],
    }
  },
  created() {
    this.getData();
    this.getDataList();
    this.cumulativePageViewsTimeChange();
    this.cumulativeParticipantsTimeChange();
    this.cumulativeWinnersTimeChange();
    this.activityTriggerStatisticsTimeChange();
  },
  methods: {
    //获得上个页面传递的数据,展示到页面
    getData() {
      var beginTime = this.beginTime;
      var endTime = this.endTime;
      beginTime = Number(beginTime);
      endTime = Number(endTime);
      this.beginTime = this.format(beginTime) + "至" + this.format(endTime);
    },
    //表格
    getDataList() {
      var datas = {};
      datas.start = this.start;
      datas.sEcho = 3;
      datas.length = this.display;
      datas.activityId = this.id;
      datas = Qs.stringify(datas)
      this.$http.post("statistics/getActivityOffCountData", datas).then(res => {
        if (res.data.error_code == 2000) {
          this.tableDatas = res.data.data.dataList;
          this.total = parseInt(res.data.data.itotalRecords);
        } else {
          this.$message.error(res.data.error_message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    // 分页的地方(这里逻辑还有待处理)
    pagechanges(val) {
      this.page = val;
      this.compage = val;
      this.start = (val - 1) * this.display;
      this.getData();
    },
    // 下拉菜单的选择器
    getChildLength(len) {
      var pageData = 0, age = 0;
      // console.log(this.page);
      pageData = this.display * (this.page - 1);
      if (pageData % len == 0) {
        age = (pageData / len + 1);
      } else {
        age = Math.ceil(pageData / len);
      }
      // age 是表示从哪一页开始
      this.start = (age - 1) * len;
      this.page = age;
      this.compage = age;
      this.display = parseInt(len);
      this.getData();
    },
    //导出
    btnexcel() {
      var data = {
        activityId: this.id
      }
      if (this.typeStr == "邀请") {
        data.activityType = 1;
      } else if (this.typeStr == "注册") {
        data.activityType = 2;
      } else if (this.typeStr == "绑车牌") {
        data.activityType = 4;
      } else if (this.typeStr == "首次下单") {
        data.activityType = 3;
      }
      var exportDatas = Qs.stringify(data);
      this.$http.post('statistics/excel', exportDatas, { responseType: 'blob' }).then((res) => {
        var filename = '活动详情列表表格'
        var blob = res.data;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          // console.log(e);
          var a = document.createElement("a");
          a.download = filename + ".xls";
          a.href = e.target.result;
          a.click();
        }
      }).catch((err) => {
        // console.log(err)
        this.$message.error(err.status);
      })
    },
    //总的时间改变时执行其余4个时间要改变
    timeChange() {
      // console.log(this.valueTime)
      this.cumulativePageViewsTime = this.valueTime;
      this.cumulativeParticipantsTime = this.valueTime;
      this.cumulativeWinnersTime = this.valueTime;
      this.activityTriggerStatisticsTime = this.valueTime;
      this.cumulativePageViewsTimeChange();
      this.cumulativeParticipantsTimeChange();
      this.cumulativeWinnersTimeChange();
      this.activityTriggerStatisticsTimeChange();
    },
    //累计浏览量的时间改变
    cumulativePageViewsTimeChange() {
      var type = 1;
      try {
        var beginStatistTime = this.cumulativePageViewsTime[0].getTime();
        var endStatistTime = this.cumulativePageViewsTime[1].getTime();
      } catch (err) {
        var beginStatistTime = this.cumulativePageViewsTime[0];
        var endStatistTime = this.cumulativePageViewsTime[1];
      }

      this.send(type, beginStatistTime, endStatistTime);
    },
    //累计参与人数的时间改变
    cumulativeParticipantsTimeChange() {
      var type = 2;
      try {
        var beginStatistTime = this.cumulativeParticipantsTime[0].getTime();
        var endStatistTime = this.cumulativeParticipantsTime[1].getTime();
      } catch (e) {
        var beginStatistTime = this.cumulativeParticipantsTime[0];
        var endStatistTime = this.cumulativeParticipantsTime[1];
      }
      this.send(type, beginStatistTime, endStatistTime);
    },
    //累计获奖人数的时间改变
    cumulativeWinnersTimeChange() {
      var type = 3;
      try {
        var beginStatistTime = this.cumulativeWinnersTime[0].getTime();
        var endStatistTime = this.cumulativeWinnersTime[1].getTime();
      } catch (e) {
        var beginStatistTime = this.cumulativeWinnersTime[0];
        var endStatistTime = this.cumulativeWinnersTime[1];
      }
      this.send(type, beginStatistTime, endStatistTime);
    },
    //活动触发统计的时间改变
    activityTriggerStatisticsTimeChange() {
      var type = 4;
      try {
        var beginStatistTime = this.activityTriggerStatisticsTime[0].getTime();
        var endStatistTime = this.activityTriggerStatisticsTime[1].getTime();
      } catch (e) {
        var beginStatistTime = this.activityTriggerStatisticsTime[0];
        var endStatistTime = this.activityTriggerStatisticsTime[1];
      }
      this.send(type, beginStatistTime, endStatistTime);
    },
    //4个时间改变调用接口的,判断类型去
    send(type, beginStatistTime, endStatistTime) {
      //时间选择当天时,将结束时间设为23:59:59
      var endTime = String(endStatistTime).slice(12, 13);
      if (endTime != 9) {
        endStatistTime = endStatistTime - 1 + 3600 * 1000 * 24;
      }
      var time = endStatistTime - beginStatistTime
      console.log(time)
      var data = {};
      data.dateType = "default";
      data.activityId = this.id;
      data.type = type;
      data.beginStatistTime = beginStatistTime;
      data.endStatistTime = endStatistTime;
      data = Qs.stringify(data);
      this.$http.post("statistics/allData", data).then(res => {
        if (res.data.error_code == 2000) {
          if (type == 1) {
            //判断time是因为选择当天要显示的时间为小时,time存在则取hours
            if (time < 86400000) {
              this.cumulativePageViews(res.data.data, 1)
            } else {
              this.cumulativePageViews(res.data.data)
            }
          } else if (type == 2) {
            if (time < 86400000) {
              this.cumulativeParticipants(res.data.data, 1)
            } else {
              this.cumulativeParticipants(res.data.data)
            }
          } else if (type == 3) {
            if (time < 86400000) {
              this.cumulativeWinners(res.data.data, 1)
            } else {
              this.cumulativeWinners(res.data.data)
            }
          } else if (type == 4) {
            if (time < 86400000) {
              this.activityTriggerStatistics(res.data.data, 1)
            } else {
              this.activityTriggerStatistics(res.data.data)
            }
          }
        } else {
          this.$message.error(res.data.error_message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    //累计浏览量处理请求回的数据
    cumulativePageViews(data, flag) {
      if (data) {
        this.cumulativePageViewsFlag = false;
      } else {
        this.cumulativePageViewsFlag = true;
      }
      var title = "累计浏览量";
      var content = ['人数', '次数', "人均数"];
      var time = [];
      var hours = [];
      var countNum = [];//人数
      var sumNum = [];//次数
      var avgNum = [];//人均数
      var arr = [{}, {}, {}];
      for (var i = 0; i < data.length; i++) {
        countNum.push(data[i].countNum);
        sumNum.push(data[i].sumNum);
        avgNum.push(data[i].avgNum);
        time.push(data[i].daysDate);
        hours.push(data[i].hours);
      }
      arr[0].name = '人数';
      arr[0].type = 'line';
      arr[0].data = countNum;
      arr[1].name = '次数';
      arr[1].type = 'line';
      arr[1].data = sumNum;
      arr[2].name = '人均数';
      arr[2].type = 'line';
      arr[2].data = avgNum;
      if (flag) {
        this.showCumulativePageViews(title, content, hours, arr)
      } else {
        this.showCumulativePageViews(title, content, time, arr)
      }
    },
    //累计参与人数处理请求回的数据
    cumulativeParticipants(data, flag) {
      if (data) {
        this.cumulativeParticipantsFlag = false;
      } else {
        this.cumulativeParticipantsFlag = true;
      }
      var title = "累计浏览量";
      var content = ['人数'];
      var time = [];
      var hours = [];
      var countNum = [];//人数
      var arr = [{}];
      for (var i = 0; i < data.length; i++) {
        countNum.push(data[i].countNum);
        time.push(data[i].daysDate);
        hours.push(data[i].hours);
      }
      arr[0].name = '人数';
      arr[0].type = 'line';
      arr[0].data = countNum;
      if (flag) {
        this.showCumulativeParticipants(title, content, hours, arr)
      } else {
        this.showCumulativeParticipants(title, content, time, arr)
      }
    },
    //累计获奖人数处理请求回的数据
    cumulativeWinners(data, flag) {
      if (data) {
        this.cumulativeWinnersFlag = false;
      } else {
        this.cumulativeWinnersFlag = true;
      }
      var title = "累计获奖人数";
      var content = ['邀请人', '被邀请人', "总人数"];
      var time = [];
      var hours = [];
      var countNum = [];//
      var sumNum = [];//
      var allSumNum = [];//
      var arr = [{}, {}, {}];
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        if (this.$route.query.type == 3) {

        }
        countNum.push(data[i].countNum);
        sumNum.push(data[i].sumNum);
        allSumNum.push(data[i].allSumNum);
        time.push(data[i].daysDate);
        hours.push(data[i].hours);
      }
      arr[0].name = '邀请人';
      arr[0].type = 'line';
      arr[0].data = countNum;
      arr[1].name = '被邀请人';
      arr[1].type = 'line';
      arr[1].data = sumNum;
      arr[2].name = '总人数';
      arr[2].type = 'line';
      arr[2].data = allSumNum;
      console.log(arr)
      //  第一次进来的话，为true, 时间大约一天的话按小时算
      if (flag) {
        this.showCumulativeWinners(title, content, hours, arr)
      } else {
        this.showCumulativeWinners(title, content, time, arr)
      }
    },
    //活动触发统计处理请求回的数据
    activityTriggerStatistics(data, flag) {
      if (data) {
        this.activityTriggerStatisticsFlag = false;
      } else {
        this.activityTriggerStatisticsFlag = true;
      }
      var title = "活动触发统计";
      var content = ['总数', '注册', "首次下单", '绑车牌'];
      var time = [];
      var hours = [];
      var allTypeSumNum = [];//
      var registerNum = [];//
      var firstOrderNum = [];//
      var bindNum = [];// 
      var arr = [{}, {}, {}, {}];
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        for (let j = 0, len = item.length; j < len; j++) {
          let params = item[j]
          // 注册人数
          console.log(params.sourceType)
          if (params.sourceType == 5) {
            // allTypeSumNum.push(params.countNum);
            registerNum.push(params.registerNum);
            time.push(params.daysDate);
            hours.push(params.hours);
          } else if (params.sourceType == 6) {  // 首次下单触发人数
            firstOrderNum.push(params.firstOrderNum);
            hours.push(params.hours);
            time.push(params.daysDate);
          } else if (params.sourceType == 7) { // 绑定车牌触发人数
            bindNum.push(params.bindNum);
            hours.push(params.hours);
            time.push(params.daysDate);
          }

        }
      }
      arr[0].name = '总数';
      arr[0].type = 'line';
      arr[0].data = allTypeSumNum;

      arr[1].name = '注册';
      arr[1].type = 'line';
      arr[1].data = registerNum;

      arr[2].name = '首次下单';
      arr[2].type = 'line';
      arr[2].data = firstOrderNum;

      arr[3].name = '绑车牌';
      arr[3].type = 'line';
      arr[3].data = bindNum;
      console.log(time)
      console.log(arr)
      if (flag) {
        this.showActivityTriggerStatistics(title, content, hours, arr)
      } else {
        this.showActivityTriggerStatistics(title, content, time, arr)
      }
    },

    //累计浏览量图表
    showCumulativePageViews(title, content, time, arr) {
      var myChart = echarts.init(document.getElementById('cumulativePageViews'));
      myChart.setOption({
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
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
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
    //累计参与人数图表
    showCumulativeParticipants(title, content, time, arr) {
      var myChart = echarts.init(document.getElementById('cumulativeParticipants'));
      myChart.setOption({
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
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
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
    //累计获奖人数图表
    showCumulativeWinners(title, content, time, arr) {
      console.log(arr)
      var myChart = echarts.init(document.getElementById('cumulativeWinners'));
      myChart.setOption({
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
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
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
    //活动触发统计图表
    showActivityTriggerStatistics(title, content, time, arr) {
      console.log(arr)
      var myChart = echarts.init(document.getElementById('activityTriggerStatistics'));
      myChart.setOption({
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
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
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

    //时间补零
    add0(m) { return m < 10 ? '0' + m : m },
    //时间戳转时间格式
    format(time) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(time);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    },
  },
  actived() {
  },
  // 子组件
  components: {
    paingchild,
    selectchild,
  },
}
</script>
