<template>
  <div class="estate">
    <h2>优惠券兑换1.2</h2>
    <!--1.0 搜索框-->
    <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
      <el-form-item label="商家名称">
        <el-input placeholder="请输入商家名称" v-model.trim="searchFromData.businessName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="优惠券编号">
        <el-input placeholder="请输入优惠券编号" v-model.trim="searchFromData.couponCode" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-input placeholder="优惠券" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <template>
          <el-select v-model="searchFromData.state" placeholder="全部">
            <el-option
              @change="clearStart"
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <br>
      <br>
      <el-form-item label="时间">
        <div class="block">
          <span class="demonstration"></span>
          <el-date-picker
            v-model="searchFromData.value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="setTime">
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>

    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>

    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="商家名称" prop="businessName">
        </el-table-column>
        <el-table-column label="优惠券编号" prop="couponCode">
        </el-table-column>
        <el-table-column label="面额" prop="couponLimit">
          <template slot-scope="scope">
            ￥{{scope.row.couponLimit}}元
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            优惠券
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1901">未兑换</span>
            <span v-else-if="scope.row.state == 1902">已兑换</span>
            <span v-else-if="scope.row.state == 1900">已使用</span>
            <span v-else-if="scope.row.state == 1903">已过期</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" icon="el-icon-circle-plus" @click="createCoupons">创建优惠券</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>

    <el-dialog title="创建优惠券" :visible.sync="dialogAddTicket">
      <el-form :model="AddTicketModeForm">
        <el-form-item label="*商家名称" :label-width="dialogAddTicketWidth">
          <template>
            <el-select v-model="AddTicketModeForm.businessId" placeholder="请选择商家">
              <el-option
                v-for="item in optionsName"
                key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
        <br>
        <el-form-item label="*类型" :label-width="dialogAddTicketWidth">
          <el-input disabled placeholder="优惠券"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="*面额" :label-width="dialogAddTicketWidth">
          <el-input v-model.trim="AddTicketModeForm.couponLimit" placeholder="1-999范围内的整数"  :maxlength=3></el-input>
        </el-form-item>
        <br>
        <el-form-item label="*生成数量" :label-width="dialogAddTicketWidth">
          <el-input v-model.trim="AddTicketModeForm.couponNum" placeholder="1-9999范围内的整数"  :maxlength=4></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddTicket = false">取 消</el-button>
        <el-button type="primary" @click="createCouponsSubmit">确 定</el-button>
      </div>
    </el-dialog>

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
    height: 60px;
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
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    //显示的声明组件
    data() {
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        dataItems: [],
        // 模态框编辑和删除是否禁用标识
        flag: false,
        // 是否显示模态框的小叉
        isShow: false,
        // 提示信息的显示(默认不显示，只有点击增加的时候并且没有内容的时候显示为true)
        isSpan: false,
        // 搜索和导出的变量
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        stateOptions: [{//搜索的状态下拉框,
          value: '1900',
          label: '已使用'
        }, {
          value: '1901',
          label: '未兑换'
        }, {
          value: '1902',
          label: '已兑换'
        }, {
          value: '1903',
          label: '已过期'
        }],
        // 这个是搜索区域的内容
        searchFromData: {
          businessName: "",
          state: "",
          couponCode: "",
          value6: [],
        },
        //新增商家的模态框
        dialogAddTicket: false,
        dialogAddTicketWidth: '120px',
        optionsName: [],// 新增优惠券模态框中的商家名称
        // 新增优惠券模态框中的from 表单的数据
        AddTicketModeForm: {
          businessId: '',//商家id
          couponLimit: '',//金额
          couponNum: '',//数量
          operationType:2,
          beginTime:29779200000,
          endTime:4100688000000,
        },
      };
    },
    created() {
      this.getData();
    },
    methods: {
      // 不带参请求数据的地方
      getData() {
        this.dataItems = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post('coupon/couponBusinessAll', data).then((res) => {
          console.log(res)
          this.seachLoading = false;
          if (res.data.error_code !== 2000 && res.data.data.dataList .length != 0) {
            this.error_code = 0;
          } else {
            this.dataItems = res.data.data.dataList;
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
          }
        }).catch((err) => {
          this.seachLoading = false;
          console.log(err);
        });
      },
      //创建优惠券
      createCoupons(){
        this.dialogAddTicket = true;
        this.$http.get("buiness/all").then(res => {
          var data = res.data.data;
          this.optionsName = [];
          console.log(res)
          if (data.length > 0) {
            var obj = {};
            for (var i = 0; i < data.length; i++) {
              obj = {};
              obj.label = data[i].businessName;
              obj.value = data[i].id;
              this.optionsName.push(obj);
            }
            console.log(this.optionsName)
          } else {
            this.$message.error('错了哦，没有找到商家名称');
          }
        })
      },
      //创建优惠券提交
      createCouponsSubmit(){
        var reg1 = /^(?!0)\d{1,3}$/;
        var reg2 = /^(?!0)\d{1,4}$/;
        if (!this.AddTicketModeForm.businessId) {
          this.$message.error('错了哦，商家名称不能为空');
          return false;
        } else if (!reg1.test(this.AddTicketModeForm.couponLimit)) {
          this.$message.error('错了哦，面额只能在1-999之间');
          return false;
        } else if (!reg2.test(this.AddTicketModeForm.couponNum)) {
          this.$message.error('错了哦，数量只能在1-9999之间');
          return false;
        }
        var data = Qs.stringify(this.AddTicketModeForm)
        this.$http.post("coupon/save", data).then(res => {
          if(res.data.error_code == 2000){
            this.$message.success('成功发放商家优惠券');
            this.dialogAddTicket = false;
            this.AddTicketModeForm.businessId = "";
            this.AddTicketModeForm.couponLimit = "";
            this.AddTicketModeForm.couponNum = "";
            this.getData();
          }else {
            this.$message.error('错了哦，创建失败');
          }
        })
      },

      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.searchFromData.value6) === '[object Null]' || this.searchFromData.value6 === []) {
          this.searchFromData.value6 = [];
        };
        if (this.isSearch == 0) {
          if (this.searchFromData.businessName === "" && this.searchFromData.state === "" && this.searchFromData.couponCode === "" && this.searchFromData.value6.length === 0) {
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
            this.start = 0;
            this.isSearch = 1;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.businessName === "" && this.searchFromData.state === "" && this.searchFromData.couponCode === "" && this.searchFromData.value6.length === 0) {
            this.start = 0;
            this.isSearch = 0;
            this.getData();
          } else {
            this.paramsData();
          }
        };
      },
      // 带参搜索数据
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.businessName) datas.businessName = this.searchFromData.businessName;
        if (this.searchFromData.state) datas.state = this.searchFromData.state;
        if (this.searchFromData.couponCode) datas.couponCode = this.searchFromData.couponCode;
        if (this.searchFromData.value6) {
            datas.startCreateTime = this.searchFromData.value6[0];
            datas.endCreateTime = this.searchFromData.value6[1];
        }
        console.log(datas)
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('coupon/couponBusinessAll', data).then(res => {
          this.seachLoading = false;
          if(!res.data.data.dataList ){
            this.text = "输入的搜索条件有误，未能匹配到数据！！";
            this.isflag = true;
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.text = "";
              this.isflag = false;
              clearInterval(timeId);
            }, 3000);
          }else if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList ;
          } else if (res.data.error_code !== 2000 || res.data.data.dataList.length == 0) {
            this.text = "输入的搜索条件有误，未能匹配到数据！！";
            this.isflag = true;
            clearInterval(timeId);
            this.dataItems = res.data.data.dataList ;
            var timeId = setInterval(() => {
              this.text = "";
              this.isflag = false;
              clearInterval(timeId);
            }, 3000);
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },
      //时间选择器改变参数
      setTime(){
        this.compage = 1;
        this.start = 0; // 发生改变，从0开始搜索
        this.searchFromData.value6[0] = new Date(this.searchFromData.value6[0]).getTime();//开始时间
        this.searchFromData.value6[1] = new Date(this.searchFromData.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
      },
      //清空输入框
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      // 导出数据
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.businessName === "" && this.searchFromData.state === "" && this.searchFromData.couponCode === "" && this.searchFromData.value6.length === 0) {
          this.text = "导出的字段不能为空，请输入要导出的字段";
          this.isflag = true;
          clearInterval(timeId);
          var timeId = setInterval(() => {
            this.isLoading = false;
            this.isflag = false;
            clearInterval(timeId);
          }, 3000);
          return;
        } else {
          var exportDatas = {};
          if (this.searchFromData.businessName) exportDatas.businessName = this.searchFromData.businessName;
          if (this.searchFromData.state) exportDatas.state = this.searchFromData.state;
          if (this.searchFromData.couponCode) exportDatas.couponCode = this.searchFromData.couponCode;
          if (this.searchFromData.value6) {
            exportDatas.startCreateTime = this.searchFromData.value6[0];
            exportDatas.endCreateTime = this.searchFromData.value6[1];
          }
          var data = Qs.stringify(exportDatas);
          this.$http.post('coupon/couponBusinessExcel', data, {responseType: 'blob'}).then((res) => {
            this.isLoading = false;
            var filename = '优惠券兑换列表表格'
            var blob = res.data;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
              var a = document.createElement("a");
              a.download = filename + ".xls";
              a.href = e.target.result;
              a.click();
            }
          }).catch((err) => {
            this.text = '输入的导出字段有误，请重新确认导出的字段！';
            this.isflag = true;
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.isLoading = false;
              this.text = '';
              this.isflag = false;
            }, 3000);
          })
        }
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        console.log(this.compage);
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getData();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 下拉菜单的选择器
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
        if (this.isSearch == 0) {
          this.getData();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
    },

    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  };
</script>
