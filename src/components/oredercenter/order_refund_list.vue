<template>
  <div>
    <h2>退款订单列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :label-position="labelPosition" label-width="110px" :model="searchFromData">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="手机号">
                <el-input placeholder="请输入手机号码" v-model.trim="searchFromData.phone" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="退款支付码">
                <el-input type="text" placeholder="请输入退款支付码" v-model.trim="searchFromData.tradeNo" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="退款费用(最小)">
                <el-input type="text" placeholder="请输入退款费用(最小)" v-model.trim="searchFromData.feeMin" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="退款费用(最大)">
                <el-input type="text" placeholder="请输入退款费用(最大)" v-model.trim="searchFromData.feeMax" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <!--还有两个下拉框-->
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="退款状态">
                <el-select clearable placeholder="请选择状态" width="100%" v-model="searchFromData.state" @change="clearStart">
                  <el-option v-for="item in channelObj" :label="item.text" :value="item.channel" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="退款渠道">
                <el-select clearable placeholder="请选择退款渠道" width="100%" v-model="searchFromData.channel"  @change="clearStart">
                  <el-option v-for="item in stateObj" :label="item.text" :value="item.state" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="订单时间范围">
                <div class="block">
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
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="flag">{{text}}</span>
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
          width="65px"
          label="工单ID">
        </el-table-column>
        <el-table-column
          width="110px"
          label="车主手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone || '-'}}</span>
          </template>
        </el-table-column>
        <!--这里需要在请求回来的数据做处理-->
        <el-table-column
          width="750px"
          label="退款支付码">
          <!--新增退款金额-->
          <template slot-scope="scope">
            <span>{{scope.row.tradeNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          label="退款费用">
          <template slot-scope="scope">
            <span>￥{{scope.row.fee || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column
          width="110px"
          label="退款渠道">
          <template slot-scope="scope">
            <span v-if="scope.row.channel == 1">支付宝</span>
            <span v-else-if="scope.row.channel == 2">微信</span>
            <span v-else-if="scope.row.channel == 3">优惠券抵扣</span>
            <span v-else-if="scope.row.channel == 4">现金支付</span>
            <span v-else-if="scope.row.channel == 5">微信</span>
            <span v-else-if="scope.row.channel == 6">微信</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          label="退款状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1501">退款完成</span>
            <span v-else-if="scope.row.state == 1502">部分退款完成</span>
            <span v-else-if="scope.row.state == 1500">退款中</span>
            <span v-else-if="scope.row.state == 1503">退款失败</span>
            <span v-else>状态未知</span>
          </template>
        </el-table-column>

        <el-table-column
          label="退款时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
        <!--ok已经搞定-->
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>
<style scoped>
  .searchStyle{
    height: 100%;
  }
  .tbodyStyle {
    border: 1px solid rgb(222, 222, 223);
  }

  .tbodyStyle td {
    height: 42px;
    vertical-align: middle;
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
        labelPosition: 'left',

        // 分页要处理的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,


        tableDatas: [],

        // 搜索区域的内容
        value6: [],// 对时间进行处理
        searchFromData: {
          phone:"", // 手机号
          tradeNo:"", // 退款支付码
          feeMin:"", //最小
          feeMax:"",  // 最大
          channel:"", // 退款状态
          state:"",  // 退款渠道
        },
        channelObj:[
          {channel:1501,text:'退款完成'},
          {channel:1502,text:'部分退款完成'},
          {channel:1500,text:'退款中'},
          {channel:1503,text:'退款失败'},
        ],
        stateObj:[
          {state:1,text:'支付宝'},
          {state:"2,5",text:'微信'},
        ],
        isSearch: 0,// 为1 表示进行了数据搜索

        //提示信息
        flag: false,
        modeltext: '123',
        isLoading: false,
        seachLoading: false,
        text: '',
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 获取表格信息
      getTableDatas(){
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if(this.searchFromData.phone !== '') datas.phone = this.searchFromData.phone;
        if (this.searchFromData.tradeNo !== '') datas.tradeNo = this.searchFromData.tradeNo;
        if (this.searchFromData.feeMin !== '') datas.feeMin = this.searchFromData.feeMin;
        if (this.searchFromData.feeMax !== '') datas.feeMax = this.searchFromData.feeMax;
        if (this.searchFromData.channel !== '')datas.channel = this.searchFromData.channel;
        if (this.searchFromData.state !== '') datas.state = this.searchFromData.state;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        } else {
          if (this.value6[0]) datas.startCreateTime = this.value6[0];
          if (this.value6[1]) datas.endCreateTime = this.value6[1];
        }
        var data = Qs.stringify(datas);
        this.$http.post('order/refund/pageable', data).then((res)=>{
          if (res.data.error_code === 2000 && res.data.data.dataList !== 0) {
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            // 处理逻辑方式：
            var paramDatas = res.data.data.dataList;
            // 处理支付码和费用
            for (var i = 0; i < paramDatas.length; i++) {
              var payment = '';
              if(paramDatas[i].tradeNos == undefined){
                  payment = '无';
              }else{
                var payStatus = paramDatas[i].stateStr.split(',');  // 支付状态
                for(var x=0;x<payStatus.length;x++){
                  if(payStatus[x] == 1){
                    payStatus[x] = '';
                  }else if(payStatus[x] == 0){
                    payStatus[x] = '';
                  }else if(payStatus[x] == 1501){
                    payStatus[x] = '退款成功';
                  }else if(payStatus[x] == 1502){
                    payStatus[x] = '部分退款';
                  }else if(payStatus[x] == 1500){
                    payStatus[x] = '退款中';
                  }else if(payStatus[x] == 1503){
                    payStatus[x] = '退款失败';
                  };
                }
                var payMent = paramDatas[i].tradeNos.split(',');   // 支付码
                var payFee =  paramDatas[i].feeStr.split(',');  // 支付费用
                if(payMent.length == 1){
                  payment = payMent[0] + '（ ￥' + payFee[0] +'元）';
                }else if(payMent.length > 1){
                    for(var j=0;j<payMent.length;j++){
                      payment += payMent[j] + '（￥'+payFee[j]+'元）' + payStatus[j];
                    }
                }
              }
              paramDatas[i].payment = payment;
            }
            this.tableDatas = paramDatas;
          } else if(this.isSearch === 1 && res.data.error_code === 0){
            this.seachLoading = false;
            this.$message.error('错了哦，未能搜索到匹配字段，请重新输入搜索条件');
          }else {
            this.seachLoading = false;
            console.log('状态码返回错误');
          }
        }).catch((err) => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },

      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        };
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          if (this.searchFromData.phone === "" && this.searchFromData.tradeNo === ""
            && this.searchFromData.feeMin === "" && this.searchFromData.feeMax === ""
            && this.searchFromData.channel === "" && this.searchFromData.state === "" &&this.value6.length === 0) {
            this.seachLoading = false;
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
          } else {
            this.start = 0;
            this.isSearch = 1;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.phone === "" && this.searchFromData.tradeNo === ""
            && this.searchFromData.feeMin === "" && this.searchFromData.feeMax === ""
            && this.searchFromData.channel === "" && this.searchFromData.state == "" &&this.value6.length == 0) {
            this.isSearch = 0;
            this.start = 0;
          }
          this.getTableDatas();
        }
      },
      // 带参搜索数据
      paramsData(){
        var data = {};
        this.isSearch = 1;
        // 对参数进行了整理
        this.searchFromData.start = this.start;
        this.searchFromData.sEcho = 3;
        this.searchFromData.length = this.display;
        // 对参数进行处理
        if(this.searchFromData.phone) data.phone = this.searchFromData.phone;
        if(this.searchFromData.tradeNo) data.tradeNo = this.searchFromData.tradeNo;
        if(this.searchFromData.feeMin) data.feeMin = this.searchFromData.feeMin;
        if(this.searchFromData.feeMax) data.feeMax = this.searchFromData.feeMax;
        if(this.searchFromData.channel) data.channel = this.searchFromData.channel;
        if(this.searchFromData.state) data.state = this.searchFromData.state;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        } else {
          if (this.value6[0]) data.startCreateTime = this.value6[0];
          if (this.value6[1]) data.endCreateTime = this.value6[1];
        }
        data.start = this.start;
        data.sEcho = 3;
        data.length = this.display;
        console.log(data)
        var datas = Qs.stringify(data);
        this.$http.post('order/refund/pageable', datas).then(res => {
          // 按钮不用禁用了
          this.seachLoading = false;
          if (res.data.error_code == 2000) {

            this.total = parseInt(res.data.data.itotalRecords);
            // 对数据进行处理
            var paramDatas = res.data.data.dataList;
            // 处理支付码和费用
            for (var i = 0; i < paramDatas.length; i++) {
              var payment = '';
              if(paramDatas[i].tradeNos == undefined){
                payment = '无';
              }else{
                var payStatus = paramDatas[i].stateStr.split(',');  // 支付状态
                for(var x=0;x<payStatus.length;x++){
                  if(payStatus[x] == 1){
                    payStatus[x] = '';
                  }else if(payStatus[x] == 0){
                    payStatus[x] = '';
                  }else if(payStatus[x] == 1501){
                    payStatus[x] = '退款成功';
                  }else if(payStatus[x] == 1502){
                    payStatus[x] = '部分退款';
                  }else if(payStatus[x] == 1500){
                    payStatus[x] = '退款中';
                  }else if(payStatus[x] == 1503){
                    payStatus[x] = '退款失败';
                  };
                }
                var payMent = paramDatas[i].tradeNos.split(',');   // 支付码
                var payFee =  paramDatas[i].feeStr.split(',');  // 支付费用
                if(payMent.length == 1){
                  payment = payMent[0] + '（ ￥' + payFee[0] +'元）';
                }else if(payMent.length > 1){
                  for(var j=0;j<payMent.length;j++){
                    payment += payMent[j] + '（￥'+payFee[j]+'元）' + payStatus[j];
                  }
                }
              }
              paramDatas[i].payment = payment;
            }
            this.tableDatas = paramDatas;
          } else {
            this.seachLoading = false;
            this.$message.error('错了哦，未能搜索到匹配的条件，请重新数据搜索条件！！');
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },
      // 导出数据
      exportEvent(){
        this.isLoading = true;
        var data = {};
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        };
        // 如果搜索条件为空，是没有数据导出的（并且提示用户）  // 搜索条件不为空，搜索到数据（进行导出操作）  位搜索到数据提示用户输入导出条件有误，请重新输入
        if (this.searchFromData.phone === "" && this.searchFromData.tradeNo === ""
          && this.searchFromData.feeMin === "" && this.searchFromData.feeMax === ""
          && this.searchFromData.channel === "" && this.searchFromData.state === "" &&this.value6.length == 0) {
          this.isLoading = false;
          this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出');
        } else {
          // 对导出的参数进行处理
          if(this.searchFromData.phone) data.phone = this.searchFromData.phone;
          if(this.searchFromData.tradeNo) data.tradeNo = this.searchFromData.tradeNo;
          if(this.searchFromData.feeMin) data.feeMin = this.searchFromData.feeMin;
          if(this.searchFromData.feeMax) data.feeMax = this.searchFromData.feeMax;
          if(this.searchFromData.channel) data.channel = this.searchFromData.channel;
          if(this.searchFromData.state) data.state = this.searchFromData.state;

          if(this.value6[0]) data.startRefundTime = this.value6[0];
          if(this.value6[1]) data.endRefundTime = this.value6[1];
          var datas = Qs.stringify(data);
          this.$http.post('order/refund/orderRefundExcel', datas, {responseType: 'blob'}).then(res => {

              this.isLoading = false;
              // 看是否搜索到了数据
              var filename = '退款订单表格'
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
            this.$message.error('错了哦，没有符合条件的数据');
          })
        }
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
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },

      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 1) {
          this.searchEvent();
        } else {
          this.getTableDatas();
        }
      },

      // 设置时间
      setTime(){
        this.compage = 1;
        this.start = 0; // 发生改变，从0开始搜索
        if (this.value6 !== null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },
      // 输入框发生改变的时候
      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

