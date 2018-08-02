<template>
  <div>
    <!-- 查看闸道列表页面 -->
    <h2>提现申请列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :label-position="labelPosition" label-width="110px" :model="searchFromData">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="手机号">
                <el-input placeholder="请输入手机号码" v-model.trim="searchFromData.phone" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="提现金额(最小)">
                <el-input type="text" placeholder="请输入提现金额(最小)" v-model.trim="searchFromData.balanceMin" @keyup.enter.native="searchEvent"
                          @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="提现金额(最大)">
                <el-input type="text" placeholder="请输入提现金额(最大)" v-model.trim="searchFromData.balanceMax" @keyup.enter.native="searchEvent"
                          @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="收款账户">
                <el-input type="text" placeholder="请输入收款账户" v-model.trim="searchFromData.accountInfo" @keyup.enter.native="searchEvent"
                          @change="clearStart"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <!--<br>-->
        <el-row :gutter="20">
          <el-col :span="8">
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
          label="工单ID">
        </el-table-column>
        <el-table-column
          label="手机号">
          <template slot-scope="scope">
            <span @click="goTouserDetails(scope.row.phone)" class="linkStyle">{{scope.row.phone || '-'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="提现金额">
          <template slot-scope="scope">
            <span>￥{{scope.row.balance || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="modePayment"
          label="支付方式">
        </el-table-column>

        <el-table-column
          width="400px"
          label="收款账户">
          <template slot-scope="scope">
            <span>{{scope.row.accountInfo}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="160px"
          label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.applyTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="160px"
          label="完成时间">
          <template slot-scope="scope">
            <span v-if="scope.row.completeTime !=undefined">{{scope.row.completeTime | moment}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1600">未审核</span>
            <span v-else-if="scope.row.state == 1601">审核通过</span>
            <span v-else-if="scope.row.state == 1602">审核失败</span>
          </template>
        </el-table-column>

        <el-table-column
          label="查看详情">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewDetails(scope.row.id,scope.row.state)">查看详情</el-button>
          </template>
        </el-table-column>
        <!--ok已经搞定-->
      </el-table>
      <!--<img :src="imgSrc" alt="">-->
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <!--6.0 模态框-->
    <el-dialog title="详细信息"
               :visible.sync="dialogTableVisible"
               :close-on-click-modal='false'
               :close-on-press-escape="false"
               :show-close="false"
               custom-class="modelStyle">
      <table class="table">
        <tbody class="tbodyStyle" v-model="myTable">
        <tr>
          <td>工单ID：</td>
          <td><span>{{myTable.id || '-'}}</span></td>
          <td>会员ID：</td>
          <td><span>{{myTable.userLevelId || '-'}}</span></td>
        </tr>
        <tr>
          <td>手机号：</td>
          <td><span>{{myTable.phone || '-'}}</span></td>
          <td>账户总余额：</td>
          <td><span>￥{{myTable.balanceEarn || 0}}元</span></td>
        </tr>
        <tr>
          <td>提现金额：</td>
          <td><span>￥{{myTable.balance || 0}}元</span></td>
          <td>支付方式：</td>
          <td>
            <span>{{myTable.modePayment}}</span>
          </td>
        </tr>

        <tr>
          <td>账户信息:</td>
          <td>
            <span>{{myTable.accountInfo}}</span>
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>申请时间</td>
          <td>
            <span>{{myTable.applyTime | moment}}</span>
          </td>
          <td>完成时间</td>
          <td>
            <span v-if="myTable.completeTime == null">-</span>
            <span v-else>{{myTable.completeTime | moment}}</span>
          </td>
        </tr>
        <tr v-if="state == 1600">
          <td>支付凭证：</td>
          <td>
            <input :disabled="state != 1600" type="file" multiple="multiple" name="上传" ref="file" @change="postFiles()">
          </td>
          <td>
            <!--<button @click="postFiles" :disabled="state != 1600">上传文件</button>-->
          </td>
          <td>
            <span v-show="isShow">{{modeltext}}</span>
          </td>
        </tr>

        <tr>
          <td>备注：</td>
          <td colspan="3">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              :disabled="state != 1600"
              placeholder="请输入内容"
              v-model="myTable.message">
            </el-input>
          </td>
        </tr>

        <!--查看提现凭证-->
        <tr v-if="state == 1601 || state == 1602">
          <td colspan="4">
            <el-button type="success" size="mini" @click="lookImage">查看凭证</el-button>
          </td>
        </tr>
        <!--是否显示图片，通过查看凭证决定-->
        <tr v-if="isBtn == 1">
          <td colspan="4" style="height:300px;">
            <img :src="imageSrc" alt="" style="width:100%;height:100%;">
          </td>
        </tr>

        <tr v-if="state == 1600">
          <td>状态:</td>
          <td>
            <el-select :disabled="state != 1600" clearable placeholder="请选择状态" width="100%" v-model="myTable.state">
              <el-option v-for="item in payType" :label="item.text" :value="item.id" :key="item.id">
              </el-option>
            </el-select>
          </td>
          <td>操作人:</td>
          <td><span>{{myTable.adminName}}</span></td>
        </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="returnOrderList">返回</el-button>
        <el-button type="danger" @click="closeModel" :disabled="state != 1600">关闭工单</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  /*点击手机号码的样式*/
  .linkStyle {
    cursor: pointer;
    color: #0094ff;
  }

  /*弹出框的样式*/
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
    /*margin-top: 80px;*/
  }
  .searchStyle{
    height: 100%;
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
          phone: '',  // 手机号
          balanceMin: '', // 最小
          balanceMax: '', // 最大
          accountInfo: '',  // 开户行
        },
        isSearch: 0,// 为1 表示进行了数据搜索

        //提示信息
        flag: false,
        modeltext: '123',
        isLoading: false,
        seachLoading: false,
        text: '',

        // 模态框的信息
        dialogTableVisible: false,
        myTable: {},
        state: '', // 审核的状态，到时候对模态框做处理
        isShow: false, // 上传提示信息
        modeltext: '',
        clearfile: '',// type=file
        payType: [
          {id: 1600, text: '未审核'},
          {id: 1601, text: '审核通过'},
          {id: 1602, text: '审核未通过'},
        ],
        orderId: '',  // 这个是文件名
        imageSrc: '',
        isBtn: 0,
        filePath:'',
        imgUrl:'',
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      //查看用户详情
      goTouserDetails(phoneId){
//        this.$router.push({path: 'user_detailes', query: {phoneId: phoneId}})
      },
      // 查看图片
      lookImage(){
        this.imageSrc = this.imgUrl;
        this.isBtn = 1;
      },
      // 获取表格信息
      getTableDatas(){
        // 整合信息
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        try{
          if (this.value6[0]) datas.startApplyTime = this.value6[0];
          if (this.value6[1]) datas.endApplyTime = this.value6[1];
        }catch (e){}
        if (this.searchFromData.phone !== "") datas.phone = this.searchFromData.phone;
        if (this.searchFromData.balanceMin !== "") datas.balanceMin = this.searchFromData.balanceMin;
        if (this.searchFromData.balanceMax !== "") datas.balanceMax = this.searchFromData.balanceMax;
        if (this.searchFromData.accountInfo !== "") datas.accountInfo = this.searchFromData.accountInfo;
        var data = Qs.stringify(datas);
        this.$http.post('order/withdraw/pageable', data).then((res) => {
          if (res.data.error_code === 2000 && res.data.data.dataList.length !== 0) {
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            // 对支付金额进行处理
            var paramDatas = res.data.data.dataList;
            this.tableDatas = paramDatas;
          } else if(res.data.error_code !== 2000 || this.isSearch === 1 || res.data.data.dataList.length === 0){
            this.flag = true;
            this.text = "未能搜索到匹配数据，请重新输入谢谢！！";
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.flag = false;
              this.seachLoading = false;
              clearInterval(timeId);
            }, 3000);
          }else if(res.data.error_code === 0){
            console.log(res.data.error_code);
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //获取搜索的内容
      searchEvent(){ // 做判断和验证
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          // 前提对搜索的条件进行判断
          var gettype = Object.prototype.toString;
          if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
            this.value6 = [];
          };
          if (this.searchFromData.phone === "" && this.searchFromData.balanceMin === ""
            && this.searchFromData.balanceMax === "" && this.searchFromData.accountInfo === ""
            && this.value6 == '[object Null]') {
            // 第一次搜索没有字段提示用户信息
            this.flag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.flag = false;
              this.seachLoading = false;
              clearInterval(timeId);
            }, 3000);
            return;
          } else {
            this.start = 0;
            this.isSearch = 1;
            this.getTableDatas();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.phone === "" && this.searchFromData.balanceMin === ""
            && this.searchFromData.balanceMax === "" && this.searchFromData.accountInfo === ""
            && this.value6 == '[object Null]') {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
          }
          this.getTableDatas();
        }
      },
      // 带参搜索数据
      paramsData(){
        this.isSearch = 1;
        // 对参数进行了整理
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        try{
          if (this.value6[0]) datas.startApplyTime = this.value6[0];
          if (this.value6[1]) datas.endApplyTime = this.value6[1];
        }catch (e){}
        if (this.searchFromData.phone) datas.phone = this.searchFromData.phone;
        if (this.searchFromData.balanceMin) datas.balanceMin = this.searchFromData.balanceMin;
        if (this.searchFromData.balanceMax) datas.balanceMax = this.searchFromData.balanceMax;
        if (this.searchFromData.accountInfo) datas.accountInfo = this.searchFromData.accountInfo;

        var data = Qs.stringify(datas);
        this.$http.post('order/withdraw/pageable', data).then(res => {
          // 按钮不用禁用了
          this.seachLoading = false;
          if(res.data.data.dataList.length === 0){
            this.flag = true;
            this.text = '未能搜索到匹配的条件，请重新数据搜索条件！！';
            setInterval(() => {
              this.flag = false;
            }, 3000);
          }else if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            // 这里可以再次优化（在搜索内容为不合格的时候，提示用户）
            this.tableDatas = res.data.data.dataList;
          } else if (res.data.error_code !== 2000&& res.data.data.dataList.length === 0) {
            this.flag = true;
            this.text = '未能搜索到匹配的条件，请重新数据搜索条件！！';
            setInterval(() => {
              this.flag = false;
            }, 3000);
          } else {
            console.log('输入内容出错');
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },
      // 导出数据
      exportEvent(){
        this.isLoading = true;
        var exportDatas = {};
        // 对时间进行判断
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]') {
          this.value6 = [];
        }
        ;
        // 如果搜索条件为空，是没有数据导出的（并且提示用户）  // 搜索条件不为空，搜索到数据（进行导出操作）  位搜索到数据提示用户输入导出条件有误，请重新输入
        if (this.searchFromData.phone == "" && this.searchFromData.balanceMin == "" && this.searchFromData.balanceMax == "" && this.searchFromData.accountInfo == ""
          && this.value6 == '[object Null]') {
          this.text = "没有导出数据的条件，数据无法进行导出";
          this.flag = true;
          setInterval(() => {
            this.isLoading = false;
            this.flag = false;
          }, 3000)
          return;
        } else {
          this.isLoading = false;
          if (this.value6[0]) exportDatas.startApplyTime = this.value6[0];
          if (this.value6[1]) exportDatas.endApplyTime = this.value6[1];
          if (this.searchFromData.phone) exportDatas.phone = this.searchFromData.phone;
          if (this.searchFromData.balanceMin) exportDatas.balanceMin = this.searchFromData.balanceMin;
          if (this.searchFromData.balanceMax) exportDatas.balanceMax = this.searchFromData.balanceMax;
          if (this.searchFromData.accountInfo) exportDatas.accountInfo = this.searchFromData.accountInfo;
          // 开始进行搜索和导出
          var data = Qs.stringify(exportDatas);
          this.$http.post('order/withdraw/orderWithdrawExcel', data, {responseType: 'blob'}).then(res => {
              this.isLoading = false;
              // 看是否搜索到了数据
              var filename = '提现订单表格'
              var blob = res.data;
              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onload = function (e) {
                var a = document.createElement("a");
                a.download = filename + ".xls";
                a.href = e.target.result;
                a.click();
              }
          }).catch(err =>{
            this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出!!');
            this.isLoading = false;
          })
        }
      },
      // 返回小区列表
      toBefore(){
        this.$router.push({path: 'estate'})
      },
      // 查看详情
      viewDetails(orderId, state){
        this.isBtn = 0;

        // 1. 判断状态
        this.state = state;
        this.orderId = orderId;
        // 3. 处理数据
        this.dialogTableVisible = true;
        this.$http.get('order/withdrawOne/' + orderId).then((res) => {
          console.log(res)
          if (res.data.error_code == 2000) {
            var paramsData = res.data.data;
            if(paramsData.state == 1600){
              paramsData.state = "未审核"
            }else if(paramsData.state == 1601){
              paramsData.state = "审核通过"
            }else if(paramsData.state == 1602){
              paramsData.state = "审核未通过"
            }
            paramsData.adminName = sessionStorage.getItem('loginUserName');
            this.myTable = paramsData;
            if (this.state === 1600 || this.state === 1601) {
              this.imageSrc = paramsData.file;
            }
            this.imgUrl = this.myTable.filePath;
          }
        }).catch((err) => {
          console.log('服务端错误' + err);
        });
      },

      // 上传文件(对文件进行操作，需要判断文件的大小)
      postFiles(){
        var filename = new FormData();
        var maxsize = 2 * 1024 * 1024;
        if (this.$refs.file.files[0].size > maxsize) {
          this.isShow = true;
          this.text = "图片大小超过2M，不能上传";
          setInterval(() => {
            this.isShow = false;
            this.text = '';
          }, 3000);
        }
        //获取图片base64
        var imgFile = new FileReader();
        imgFile.readAsDataURL(this.$refs.file.files[0]);
        var _this = this;
        imgFile.onload = function (e) {
          _this.filePath = e.target.result;
        }
      },

      // 模态框（点击确定关闭模态框）
      closeModel(){
        if (this.myTable.state === 1600 || this.myTable.state == "未审核") {
          this.isShow = false; // 上传提示信息
          this.modeltext = '';
          this.$refs.file.value = '';
          this.open2();
        } else {
          var datas = {};
          datas.id = this.orderId;//订单id
          if(this.myTable.state == "未审核" || this.myTable.state == ""){
            datas.state = 1600
          }else {
            datas.state = this.myTable.state;//状态
          }
          if(!this.filePath){
            this.$message.error('错了哦，提现凭证不能为空');
            return false;
          }
          if (this.myTable.message) datas.message = this.myTable.message;//备注
          datas.filePath = this.filePath;
          datas.webUserId = sessionStorage.getItem('adminId');
          console.log(datas)
          var data = Qs.stringify(datas);
          this.$confirm('是否关闭工单?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.$http.post('order/clseOrderWithdraw', data).then(res => {
              if (res.data.error_code == 2000) {
                // 关闭模态框，提示消息，清空表格
                this.isShow = false; // 上传提示信息
                this.modeltext = '';
                this.$refs.file.value = '';
                this.dialogTableVisible = false;
                if (this.isSearch == 0) {
                  this.getTableDatas();
                } else if (this.isSearch == 1) {
                  this.getParamsData();
                }
                this.open1(); // 提示信息
              }
            }).catch(err => {
                console.log('服务器错误' + err);
            })
          }).catch(() => {});
        }
      },

      // 模态框返回按钮
      returnOrderList(){
          console.log(this.state)
        if(this.state == 1600){
          this.$confirm('确认是否放弃本次操作, 修改的内容将不被保留?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.isBtn = 0;
            this.imageSrc = '';
            this.modeltext = '';
            this.$refs.file.value = '';
            this.dialogTableVisible = false;
          }).catch(() => {});
        }else {
          this.isBtn = 0;
          this.imageSrc = '';
          this.modeltext = '';
          try{
            this.$refs.file.value = '';
          }catch (e){}
          this.dialogTableVisible = false;
        }
      },
      // 提示信息
      open1(){
        this.$message('提现申请工单' + this.orderId + '处理成功!!!!');
      },
      open2(){
        this.$message('提现申请工单' + this.orderId + '未做处理!!!!');
      },
      // 设置时间
      setTime(){
        this.compage = 1;
        this.start = 0; // 发生改变，从0开始搜索
        if (this.value6 != null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },
      // 输入框发生改变的时候
      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
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
      }
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

