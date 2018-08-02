<template>
  <div>
    <h2>优惠券列表</h2>
    <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
      <el-row type="flex" class="row-bg">
        <el-col :span="6">
          <el-form-item label="优惠券编码:">
            <el-input placeholder="请输入优惠券编码" @change="clearStart" v-model="searchFromData.couponCode" @keyup.enter.native="searchEvent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券金额(最小):">
            <el-input placeholder="请输入优惠券金额(最小):" @change="clearStart" v-model="searchFromData.minCouponLimit" @keyup.enter.native="searchEvent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券金额(最大):">
            <el-input placeholder="请输入优惠券金额(最大):"@change="clearStart" v-model="searchFromData.maxCouponLimit" @keyup.enter.native="searchEvent"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-row type="flex" class="row-bg">
        <el-col :span="6">
          <el-form-item label="手机号:">
            <el-input placeholder="请输入手机号"@change="clearStart" v-model="searchFromData.userPhone" @keyup.enter.native="searchEvent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券使用金额(最小):">
            <el-input placeholder="请输入优惠券使用金额(最小):"@change="clearStart" v-model="searchFromData.minUsedMoney" @keyup.enter.native="searchEvent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="优惠券使用金额(最大):">
            <el-input placeholder="请输入优惠券使用金额(最大):"@change="clearStart" v-model="searchFromData.maxUsedMoney" @keyup.enter.native="searchEvent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态:">
            <el-select v-model="searchFromData.state" placeholder="请选择"@change="clearStart">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-form-item label="生效时间范围:"@change="clearStart">
        <div class="block">
          <el-date-picker
            v-model="valueTime6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="创建时间范围:"@change="clearStart">
        <div class="block">
          <el-date-picker
            v-model="valueTime7"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="使用优惠券时间范围:"@change="clearStart">
        <div class="block">
          <el-date-picker
            v-model="valueTime8"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
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
    <el-table
      :data="dataItems"
      border
      style="width: 100%">
      <el-table-column
        prop="couponCode"
        label="优惠券编码">
      </el-table-column>
      <el-table-column
        prop="couponPassword"
        label="优惠卷密码">
      </el-table-column>
      <el-table-column
        prop="beginTime"
        label="生效时间">
        <template slot-scope="scope">
          {{ scope.row.beginTime | moment }}
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="失效时间">
        <template slot-scope="scope">
          {{ scope.row.endTime | moment }}
        </template>
      </el-table-column>
      <el-table-column

        label="优惠券类型">
        <template slot-scope="scope">
          <span v-if="scope.row.couponType == 1">优惠券</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="couponLimit"
        label="优惠券金额">
        <template slot-scope="scope">
          <span v-if="!scope.row.couponLimit">{{"￥" + 0 + "元"}}</span>
          <span v-else="scope.row.couponLimit">{{"￥" + scope.row.couponLimit + "元"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="useMoney"
        label="使用优惠券金额">
        <template slot-scope="scope">
          <span v-if="!scope.row.usedMoney">{{"￥" + 0 + "元"}}</span>
          <span v-else="scope.row.usedMoney">{{"￥" + scope.row.usedMoney + "元"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.createTime | moment }}
        </template>
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="使用人电话">
      </el-table-column>
      <el-table-column
        label="使用时间">
        <template slot-scope="scope">
          <span v-if="scope.row.usedTime != undefined">{{scope.row.usedTime | moment}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1901">未领取</span>
          <span v-else-if="scope.row.state == 1902">已兑换</span>
          <span v-else-if="scope.row.state == 1900">已使用</span>
          <span v-else-if="scope.row.state == 1903">已过期</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
    </el-table>
    <paingchild :start="start" :currentss="currentss" :display="display" :total="total" :pagegroup="pagegroup" :compage="compage"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<style>
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

  .divStyle .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
    color: red;
  }

  .divStyle {
    position: relative;
    height: 60px;
  }

  .pageation li {
    float: left;
    display: inline-block;
    padding: 10px;
    background-color: #adadad;
    margin: 10px;
  }

  .colspan p {
    font-size: 16px;
    color: red;
  }

  .el-form {
    margin-top: 14px;
  }

  .el-form-item {
    margin-bottom: 0px;
  }
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    data() {
      return {
        display: 10,   // 每页显示条数
        currentss: 1,     // 当前第n页 ， 也可以 watch current 的变化
        page: 1,
        compage:1,//按钮选中第几页
        //分页插件
        current: 1,
        pagegroup: 5,
        currentPage: 1,
        pagesArray: [10, 25, 50, 100],
        total: 0,
        // 传递的数据
        length: 10,
        start: 0,
        // 按钮禁用的样式 提示文本
        seachLoading: false,
        isLoading: false,
        isflag: true,
        text: '',
        options: [{
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
        dataItems: [],
        searchFromData: {
          couponCode: '',
          minCouponLimit: '',
          maxCouponLimit: '',
          userPhone: '',
          minUsedMoney: '',
          maxUsedMoney: '',
          state: '',
          couponType: '',
          start:'',
          length:'',
          sEcho:''
        },
        valueTime6: '',
        valueTime7: '',
        valueTime8: '',
        isSearch: 0, // 是否进行了搜索
      }
    },
    created() {
      this.couponList();
    },
    methods: {
      //加载优惠券列表
      couponList(){
        this.dataItems = [];
        var data = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        };
        data = Qs.stringify(data);
        this.$http.post('coupon/couponUserAll', data).then(res => {
          this.dataItems = res.data.data.dataList;
          this.total = parseInt(res.data.data.itotalRecords);
          console.log(this.dataItems)
        })
      },
      //状态下拉
      handleCommand(command) {
        this.$message('click on item ' + command);
      },
      //搜索事件
      searchEvent(){
          console.log(this.valueTime8=='[object Null]')
        if (this.isSearch == 0) {
          if (this.searchFromData.couponCode == '' && this.searchFromData.minCouponLimit == '' && this.searchFromData.maxCouponLimit == '' && this.searchFromData.userPhone == '' && this.searchFromData.minUsedMoney == '' && this.searchFromData.maxUsedMoney == '' && this.searchFromData.state == '' && this.searchFromData.couponType == '' && this.valueTime6 == '[object Null]' && this.valueTime7 == '[object Null]' && this.valueTime8 == '[object Null]') {
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
            }, 3000);
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.couponCode == '' && this.searchFromData.minCouponLimit == '' && this.searchFromData.maxCouponLimit == '' && this.searchFromData.userPhone == '' && this.searchFromData.minUsedMoney == '' && this.searchFromData.maxUsedMoney == '' && this.searchFromData.state == '' && this.searchFromData.couponType == '' && this.valueTime6 == '[object Null]'&& this.valueTime7 == '[object Null]'&& this.valueTime8 == '[object Null]') {
            this.start = 0;
            this.isSearch = 0;
            this.couponList();
          } else if (this.searchFromData.couponCode == '' || this.searchFromData.minCouponLimit == '' || this.searchFromData.maxCouponLimit == '' || this.searchFromData.userPhone == '' || this.searchFromData.minUsedMoney == '' || this.searchFromData.maxUsedMoney == '' || this.searchFromData.state == '' || this.searchFromData.couponType == '' || this.valueTime6 == '[object Null]'|| this.valueTime7 == '[object Null]'|| this.valueTime8 =='[object Null]') {
            this.paramsData();
          }
        }
      },
      //带参搜索
      paramsData(){
        this.isSearch = 1;
        this.searchFromData.start = this.start;
        this.searchFromData.length = this.display;
        this.searchFromData.sEcho = 3;
        if (this.valueTime6) {
          this.searchFromData.beginTime = this.valueTime6[0].getTime();
          this.searchFromData.endTime = this.valueTime6[1].getTime() + 1000 * 60 * 60 * 24 - 1;
        }
        if (this.valueTime7) {
          this.searchFromData.startCreateTime = this.valueTime7[0].getTime();
          this.searchFromData.endCreateTime = this.valueTime7[1].getTime() + 1000 * 60 * 60 * 24 - 1;
        }
        if (this.valueTime8) {
          this.searchFromData.startUsedTime = this.valueTime8[0].getTime();
          this.searchFromData.endUsedTime = this.valueTime8[1].getTime() + 1000 * 60 * 60 * 24 - 1;
        }
        var datas = Qs.stringify(this.searchFromData);
        this.$http.post('coupon/couponUserAll', datas).then(res => {
          console.log(res)
          this.seachLoading = false;
          if (res.data.error_code == 2000) {
            this.display = 10;
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
          } else if (res.data.error_code !== 2000) {
            this.text = "输入的搜索条件有误，请重新输入";
            this.isflag = true;
            setInterval(function () {
              this.text = "";
              this.isflag = false;
            }, 3000)
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },
      // 导出数据
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.couponCode == '' && this.searchFromData.minCouponLimit == '' && this.searchFromData.maxCouponLimit == '' && this.searchFromData.userPhone == '' && this.searchFromData.minUsedMoney == '' && this.searchFromData.maxUsedMoney == '' && this.searchFromData.state == '' && this.searchFromData.couponType == '' && this.valueTime6 == '[object Null]'&& this.valueTime7 == '[object Null]'&& this.valueTime8 == '[object Null]') {
          var _this = this;
          this.text = "数据未能正确查找到，请输入正确的查找条件";
          this.isflag = true;
          setInterval(function () {
            _this.isLoading = false;
            _this.isflag = false;
          }, 3000)
          return;
        } else {
          if (this.valueTime6) {
            this.searchFromData.beginTime = this.valueTime6[0].getTime();
            this.searchFromData.endTime = this.valueTime6[1].getTime() + 1000 * 60 * 60 * 24 - 1;
          }
          if (this.valueTime7) {
            this.searchFromData.startCreateTime = this.valueTime7[0].getTime();
            this.searchFromData.endCreateTime = this.valueTime7[1].getTime() + 1000 * 60 * 60 * 24 - 1;
          }
          if (this.valueTime8) {
            this.searchFromData.startUsedTime = this.valueTime8[0].getTime();
            this.searchFromData.endUsedTime = this.valueTime8[1].getTime() + 1000 * 60 * 60 * 24 - 1;
          }
          var data = Qs.stringify(this.searchFromData);
          this.$http.post('coupon/couponUserExcel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = '优惠券列表表格'
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
            this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出!!');
            this.isLoading = false;
          })
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
        console.log(this.compage);
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        console.log(this.start)
        if (this.isSearch == 0) {
          this.couponList();
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
          this.getEstateData();
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
  }
</script>
