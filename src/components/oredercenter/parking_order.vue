<template>
  <div>
    <h2>停车订单列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :label-position="labelPosition" label-width="110px" :model="searchFromData">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="订单编号">
                <el-input placeholder="请输入订单编号" v-model.trim="searchFromData.serialNumber" @keyup.enter.native="searchEvent" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="小区名称">
                <el-input type="text" placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @keyup.enter.native="searchEvent" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="车主手机号">
                <el-input type="text" placeholder="请输入车主手机号" v-model.trim="searchFromData.phone" @keyup.enter.native="searchEvent" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="管理员手机号">
                <el-input type="text" placeholder="请输入管理员手机号" v-model.trim="searchFromData.parkingPhone" @keyup.enter.native="searchEvent" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="小区类型">
                <el-select v-model="searchFromData.parklotType" placeholder="请选择小区类型">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="车牌号">
                <el-input type="text" placeholder="请输入车牌号" v-model.trim="searchFromData.plateNumber" @keyup.enter.native="searchEvent" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="支付码">
                <el-input type="text" placeholder="请输入支付码" v-model.trim="searchFromData.tradeNo" @keyup.enter.native="searchEvent" @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="订单状态">
                <el-select v-model="searchFromData.stateList" placeholder="请选择订单状态">
                  <el-option v-for="item in options1" :key="item.label" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="订单时间范围">
                <div class="block">
                  <el-date-picker v-model="value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setTime">
                  </el-date-picker>
                </div>
              </el-form-item>
            </div>
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
      <el-table :data="tableDatas" style="width: 100%" border>
        <el-table-column label="订单编号">
          <template slot-scope="scope">
            <span>{{scope.row.serialNumber}}</span>
            <br>
            <span style="background-color:red; color: #fff; padding: 3px 5px;" v-if="scope.row.chargeTypeStr">车锁计费</span>
          </template>
        </el-table-column>
        <el-table-column prop="parklotName" label="小区名称">
        </el-table-column>
        <el-table-column label="小区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.parklotType==1&&scope.row.innershareStr=='内部共享'">约车场内部共享</span>
            <span v-else-if="scope.row.parklotType==2&&scope.row.innershareStr=='内部共享'">约车位内部共享</span>
            <span v-else-if="scope.row.parklotType == 2">约车位</span>
            <span v-else-if="scope.row.parklotType==1">约车场</span>
            <span v-else-if="scope.row.parklotType==0">车位查询</span>
          </template>
        </el-table-column>
        <el-table-column label="车位编号">
          <template slot-scope="scope">
            <span>{{scope.row.parkingNumber || '暂无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="车主手机号">
          <template slot-scope="scope">
            <span v-if="scope.row.phone === undefined || scope.row.phone === '' || scope.row.phone === null">-</span>
            <span v-else class="linkStyle">{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="车牌号">
          <template slot-scope="scope">
            <span>{{scope.row.plateNumber || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="车位管理员手机号">
          <template slot-scope="scope">
            <span v-if="scope.row.parkingPhone === undefined || scope.row.parkingPhone === ''|| scope.row.parkingPhone === null">-</span>
            <span v-else class="linkStyle">{{scope.row.parkingPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约时间">
          <template slot-scope="scope">
            <span style="color: green;">起:
              <span style="color: #000;">{{scope.row.startTime | moment}}</span>
            </span>
            <br>
            <span style="color: red;">终:
              <span style="color: #000;">{{scope.row.endTime | moment}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="入场时间">
          <template slot-scope="scope">
            <span v-if="scope.row.realStartTime==undefined || scope.row.realStartTime === '' || scope.row.realStartTime === null">-</span>
            <span v-else>{{scope.row.realStartTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="离场时间">
          <template slot-scope="scope">
            <span v-if="scope.row.realEndTime==undefined || scope.row.realEndTime === '' || scope.row.realEndTime === null">-</span>
            <span v-else>{{scope.row.realEndTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="停车时长">
          <template slot-scope="scope">
            <span v-if="!scope.row.stoptimeStr">-</span>
            <span v-else>{{scope.row.stoptimeStr}}</span>
            <div v-if="scope.row.overtimeStr">
              <span style="background-color:red; color: #fff; padding: 3px 5px;">超时</span>
              <br>
              <span style="color: red;">{{scope.row.overtimeStr}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.totalFee || 0}}元</span>
            <div v-if="scope.row.overtimeFee">
              <span style="background-color:red; color: #fff; padding: 3px 5px;">超时费用</span>
              <br>
              <span style="color: red;">￥{{scope.row.overtimeFee}}元</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="优惠总金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.discountFee || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column label="支付总金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.realFee || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column label="支付码">
          <template slot-scope="scope">
            <span>{{scope.row.tradeNo || '-'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1300">未支付</span>
            <span v-else-if="scope.row.state == 1301">已预约</span>
            <span v-else-if="scope.row.state == 1302">停车中</span>
            <span v-else-if="scope.row.state == 1303">未支付</span>
            <span v-else-if="scope.row.state == 1304">已完成</span>
            <span v-else-if="scope.row.state == 1307">已关闭</span>
            <span v-else-if="scope.row.state == 1308">超时取消</span>
            <span v-else-if="scope.row.state == 1309">已取消</span>
            <span v-else-if="scope.row.state == 1310">客服取消</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="estateName" label="订单详情">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewDetails(scope.row.id)">查看详情</el-button>
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
    <!--6.0 模态框-->
    <el-dialog title="详细信息" :visible.sync="dialogTableVisible" :show-close='false' :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelStyle">
      <table class="table">
        <tbody class="tbodyStyle" v-model="myTable">
          <tr>
            <td>
              <h4>基本信息</h4>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>订单状态：
              <span v-if="myTable.state == 1300">未支付</span>
              <span v-else-if="myTable.state == 1301">已预约</span>
              <span v-else-if="myTable.state == 1302">停车中</span>
              <span v-else-if="myTable.state == 1303">未支付</span>
              <span v-else-if="myTable.state == 1304">已完成</span>
              <span v-else-if="myTable.state == 1307">已关闭</span>
              <span v-else-if="myTable.state == 1308">超时取消</span>
              <span v-else-if="myTable.state == 1309">已取消</span>
              <span v-else-if="myTable.state == 1310">客服取消</span>
            </td>
            <td></td>
            <td>车位编号：
              <span>{{myTable.parkingNumber}}</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>预订人手机号：
              <span>{{myTable.phone}}</span>
            </td>
            <td></td>
            <td>车牌号：
              <span>{{myTable.plateNumber}}</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>小区名称：
              <span>{{myTable.parklotName}}</span>
            </td>
            <td></td>
            <td>创建时间：
              <span>{{myTable.createTime | moment}}</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <h4>预约信息</h4>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>预约时间：
              <span>{{reservation.startTime | moment}}--{{reservation.endTime | moment}}</span>
            </td>
            <td></td>
            <td>预约费用:
              <span>￥{{reservation.totalFee || 0}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>优惠金额(预约)：
              <span>￥{{reservation.discountFee}}元</span>
            </td>
            <td></td>
            <td>支付金额(预约):
              <span>￥{{reservation.realFee}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>支付方式(预约)：
              <span v-if="reservation.payChannelStr== '未支付费用'">-</span>
              <span v-else-if="reservation.payChannelStr">{{reservation.payChannelStr}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
            <td>支付码(预约):
              <span v-if="reservation.tradeNo">{{reservation.tradeNo}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>优惠券编码(预约)：
              <span v-if="reservation.couponCodes">{{reservation.couponCodes}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
            <td>手续费(预约):
              <span>￥{{reservation.tripartiteFee}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>预约编号：
              <span>{{reservation.serialNumber}}</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <h4>停车信息</h4>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>入场时间：
              <span v-if="parking.realStartTime == undefined">-</span>
              <span v-else>{{parking.realStartTime | moment}}</span>
            </td>
            <td></td>
            <td>离场时间:
              <span v-if="parking.realEndTime == undefined">-</span>
              <span v-else>{{parking.realEndTime | moment}}</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>正常停车费：
              <span>￥{{parking.parkingFee || 0}}元</span>
            </td>
            <td></td>
            <td>超时停车费：
              <span>￥{{parking.overtimeFee || 0}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>优惠金额(停车)：
              <span>￥{{parking.discountFee || 0}}元</span>
            </td>
            <td></td>
            <td>支付金额(停车):
              <span>￥{{parking.realFee || 0}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>支付方式(停车)：
              <span v-if="parking.payChannelStr">{{parking.payChannelStr}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
            <td>支付码(停车):
              <span v-if="parking.tradeNo">{{parking.tradeNo}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>优惠券编码(停车)：
              <span v-if="parking.couponCodes">{{parking.couponCodes}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
            <td>手续费(停车):
              <span>￥{{parking.tripartiteFee || 0}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>订单编号：
              <span v-if="myTable.state==1302||myTable.state==1303||myTable.state==1304">{{myTable.serialNumber}}</span>
              <span v-else>-</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              <h4>财务信息</h4>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>
              订单总金额：￥{{finance.totalFee || 0}}元
            </td>
            <td></td>
            <td> 支付总金额：
              <span>￥{{finance.realFee || 0}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>优惠总金额：
              <span>￥{{finance.discountFee || 0}}元</span>
            </td>
            <td></td>
            <td>订单总手续费：
              <span>￥{{finance.tripartiteFee || '0'}}元</span>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>结算比例：
              <span>业主：{{finance.ownerIncome || 0}}元</span>&nbsp;&nbsp;
              <span>物业：{{finance.manageIncome || 0}}元</span>&nbsp;&nbsp;
              <span>平台：{{finance.platformIncome || 0}}元</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="closeModel">确 定</el-button>
      </div>
    </el-dialog>
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

.searchStyle {
  height: 180px;
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
      labelPosition: 'left',
      // 发送数据所用
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 0,
      start: 0,
      tableDatas: [],
      // 搜索区域的内容
      value6: [],// 对时间进行处理
      isSearch: 0,// 为 0 表示没有带参搜索， 1表示带参搜索
      isflag: false,
      text: '123',
      isLoading: false,    // 导出
      seachLoading: false, // 搜索
      searchFromData: {   // 搜索的内容
        serialNumber: '',
        parklotName: '',
        phone: '',
        parkingPhone: '',
        parklotType: '',
        stateList: '',
        plateNumber: '',
        tradeNo: '',
      },
      // 模态框的信息
      dialogTableVisible: false,
      myTable: {},
      finance: {},
      reservation: {},
      parking: {},
      options: [{
        value: '1',
        label: '约车场'
      }, {
        value: '2',
        label: '约车位'
      }],
      options1: [{
        value: null,
        label: '全部'
      }, {
        value: [1300, 1303],
        label: '未支付'
      }, {
        value: 1301,
        label: '已预约'
      }, {
        value: 1302,
        label: '停车中'
      }, {
        value: 1304,
        label: '已完成'
      }, {
        value: 1308,
        label: '超时取消'
      }, {
        value: 1309,
        label: '已取消'
      }, {
        value: 1307,
        label: '已关闭'
      }, {
        value: 1310,
        label: '客服取消'
      }],
    }
  },
  created() {
    this.getTableDatas();
  },
  methods: {
    // 查看用户的详情
    goTouserDetails(phoneId) {
      this.$router.push({ path: 'user_detailes', query: { phoneId: phoneId } })
    },
    // 获取数据
    getTableDatas() {
      var datas = {};
      datas.start = this.start;
      datas.sEcho = 3;
      datas.length = this.display;
      var gettype = Object.prototype.toString;
      if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
        this.value6 = [];
      } else {
        if (this.value6[0]) datas.startCreateTime = this.value6[0];
        if (this.value6[1]) datas.endCreateTime = this.value6[1];
      }
      if (this.searchFromData.serialNumber !== '') datas.serialNumber = this.searchFromData.serialNumber;
      if (this.searchFromData.parklotName !== '') datas.parklotName = this.searchFromData.parklotName;
      if (this.searchFromData.phone !== '') datas.phone = this.searchFromData.phone;
      if (this.searchFromData.parkingPhone !== '') datas.parkingPhone = this.searchFromData.parkingPhone;
      if (this.searchFromData.plateNumber !== '') datas.plateNumber = this.searchFromData.plateNumber;
      if (this.searchFromData.tradeNo !== '') datas.tradeNo = this.searchFromData.tradeNo;
      if (this.searchFromData.parklotType !== '') datas.parklotType = this.searchFromData.parklotType;
      if (this.searchFromData.stateList !== '') datas.stateList = this.searchFromData.stateList;
      var data = Qs.stringify(datas);
      this.$http.post('order/pageable', data).then(res => {
        if (res.data.error_code === 2000 && res.data.data.dataList.length != 0) {
          // 赋值表格处理数据, 表格的总量
          this.seachLoading = false
          this.total = res.data.data.itotalRecords;
          // 对支付金额进行处理
          this.tableDatas = res.data.data.dataList;
          var temp = '';
          for (var i = 0; i < this.tableDatas.length; i++) {
            if (this.tableDatas[i].realEndTime) {
              temp = this.tableDatas[i].realEndTime - this.tableDatas[i].realStartTime;
              this.tableDatas[i].parkingTime = this.getMyDate(temp)
            }
            if (this.tableDatas[i].overtime) {
              this.tableDatas[i].overtime = this.getMyDate(this.tableDatas[i].overtime)
            }
          }
        } else if (res.data.error_code !== 2000 && this.isSearch === 1) {
          this.seachLoading = false;
          this.$message.error('错了哦，匹配的数据为空，请重新输入搜索的条件！！');
          this.total = 0;
          this.tableDatas = [];
        } else if (res.data.data.dataList.length === 0 && this.isSearch === 1) {
          this.seachLoading = false;
          this.$message.error('错了哦，匹配的数据为空，请重新输入搜索的条件！！');
          this.total = 0;
          this.tableDatas = [];
        } else {
          this.seachLoading = false;
          console.log('状态码返回错误')
        }
      }).catch(err => {
        this.isflag = true;
        this.text = '服务端错误' + err;
        clearInterval(timeId);
        var timeId = setInterval(() => {
          this.isflag = false;
          this.seachLoading = false;
          clearInterval(timeId);
        }, 3000);
      })
    },
    //获取搜索的内容
    searchEvent() {
      // 禁用 搜索按钮
      this.seachLoading = true;
      // 对时间的类型进行判断
      var gettype = Object.prototype.toString;
      if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
        this.value6 = [];
      }
      ;
      if (this.isSearch == 0) {
        // 到时候还要加上 parkingPhone（业主手机）
        if (this.searchFromData.serialNumber === '' && this.searchFromData.parklotName === ''
          && this.searchFromData.phone === '' && this.searchFromData.parkingPhone === '' && this.searchFromData.plateNumber === ''
          && this.searchFromData.tradeNo === '' && this.value6.length === 0 && this.searchFromData.parklotType === "" && this.searchFromData.stateList === "") {
          this.seachLoading = false;
          this.$message.error('错了哦，匹配的数据为空，请重新输入搜索的条件！！');
        } else {
          this.start = 0;
          this.isSearch = 1;
          // 开始进行带参分页
          this.getTableDatas();
        }
      } else if (this.isSearch == 1) {
        if (this.searchFromData.serialNumber === '' && this.searchFromData.parklotName === ''
          && this.searchFromData.phone === '' && this.searchFromData.parkingPhone === '' && this.searchFromData.plateNumber === ''
          && this.searchFromData.tradeNo === '' && this.value6.length === 0 && this.searchFromData.parklotType === "" && this.searchFromData.stateList === "") {
          // 为空
          this.start = 0;
          this.isSearch = 0;
        }
        this.getTableDatas();
      }
    },
    // 导出数据
    exportEvent() {
      this.isLoading = true;
      var exportData = {};
      // 对时间进行判断
      var gettype = Object.prototype.toString;
      if (gettype.call(this.value6) === '[object Null]') {
        this.value6 = [];
      }
      ;

      if (this.searchFromData.serialNumber == "" && this.searchFromData.parklotName == ""
        && this.searchFromData.phone == "" && this.searchFromData.parkingPhone === '' && this.searchFromData.plateNumber == "" && this.value6.length == 0 && this.searchFromData.parklotType === "" && this.searchFromData.stateList === "" && this.value6.length == 0) {
        this.isLoading = false;
        this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出！！');
      } else {

        // 对导出的参数进行处理
        if (this.searchFromData.serialNumber) exportData.serialNumber = this.searchFromData.serialNumber;
        if (this.searchFromData.parklotName) exportData.parklotName = this.searchFromData.parklotName;
        if (this.searchFromData.phone) exportData.phone = this.searchFromData.phone;
        if (this.searchFromData.parkingPhone) exportData.parkingPhone = this.searchFromData.parkingPhone;
        if (this.searchFromData.plateNumber) exportData.plateNumber = this.searchFromData.plateNumber;
        if (this.searchFromData.parklotType) exportData.parklotType = this.searchFromData.parklotType;
        if (this.searchFromData.stateList) exportData.stateList = this.searchFromData.stateList;
        if (this.value6[0]) exportData.startCreateTime = this.value6[0];
        if (this.value6[1]) exportData.endCreateTime = this.value6[1];
        var data = Qs.stringify(exportData);
        this.$http.post('order/excel', data, { responseType: 'blob' }).then((res) => {
          this.isLoading = false;
          var filename = '停车订单的表格'
          var blob = res.data;
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function (e) {
            var a = document.createElement("a");
            a.download = filename + ".xls";
            a.href = e.target.result;
            a.click();
          };
        }).catch((err) => {
          this.isLoading = false;
          this.$message.error('错了哦，没有符合条件的数据');
        })
      }
    },

    // 返回小区列表
    toBefore() {
      this.$router.push({ path: 'estate' })
    },
    // 查看详情
    viewDetails(orderId) {
      this.dialogTableVisible = true;
      // 数据
      this.$http.get('order/' + orderId).then(res => {
        if (res.data.error_code == 2000) {
          // 对数据进行处理
          this.myTable = res.data.data;
          this.parking = res.data.data.parking;
          this.reservation = res.data.data.reservation;
          this.finance = res.data.data.finance;
          console.log(this.myTable)
        }
      }).catch(err => {
        console.log('服务端错误' + err);
      })
    },

    // 设置时间
    setTime() {
      this.start = 0; // 发生改变，从0开始搜索
      this.compage = 1;
      if (this.value6 != null) {
        this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
        this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
      }
    },
    //文本框发生改变的时候，start为0
    clearStart() {
      this.compage = 1;
      this.start = 0; // 改变从0开始搜索
    },

    // 下拉菜单的数据
    getChildLength(len) {
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
    pagechanges(val) {
      this.page = val;
      this.compage = val;
      this.start = (val - 1) * this.display;
      this.getTableDatas();
    },
    // 模态框（点击确定关闭模态框）
    closeModel() {
      this.dialogTableVisible = false;
    },
    getMyDate(mss) {
      var days = parseInt(mss / (1000 * 60 * 60 * 24));
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = (mss % (1000 * 60)) / 1000;
      return hours + " : " + minutes + " : " + seconds;
    },
  },
  components: {
    paingchild,
    selectchild,
  },
}
</script>

