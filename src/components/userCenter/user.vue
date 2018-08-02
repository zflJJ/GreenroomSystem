<template>
  <div>
    <h2>用户列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :label-position="labelPosition" label-width="120px" :model="searchFromData">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="手机号">
                <el-input type="text" placeholder="请输入手机号" v-model.trim="searchFromData.phone" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="用户类型">
                <el-select clearable placeholder="请选择用户类型" width="100%" v-model="searchFromData.userType"
                           @change="clearStart">
                  <el-option v-for="item in channelObj" :label="item.text" :value="item.userType" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="状态">
                <el-select clearable placeholder="请选择状态" width="100%" v-model="searchFromData.state"
                           @change="clearStart">
                  <el-option v-for="item in stateObj" :label="item.text" :value="item.state" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <!--还有两个下拉框-->

          <el-col :span="10">
            <div class="grid-content bg-purple">
              <el-form-item label="最后登录的时间范围" label-width="150px">
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
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="注册的时间范围">
                <div class="block">
                  <el-date-picker
                    v-model="value7"
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
          <el-col :span="8">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="广告来源">
                <el-input type="text" placeholder="请输入广告来源" v-model.trim="searchFromData.source" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="广告媒介">
                <el-input type="text" placeholder="请输入广告媒介" v-model.trim="searchFromData.medium" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="广告内容">
                <el-input type="text" placeholder="请输入广告内容" v-model.trim="searchFromData.content" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="广告关键词">
                <el-input type="text" placeholder="请输入广告关键词" v-model.trim="searchFromData.keyword" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="广告系列">
                <el-input type="text" placeholder="请输入广告系列" v-model.trim="searchFromData.series" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="套餐车牌">
                <el-select clearable placeholder="请选择" width="100%" v-model="searchFromData.isPackage"
                           @change="clearStart">
                  <el-option v-for="item in isPackage" :label="item.text" :value="item.state" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <br>
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
          label="用户ID">
        </el-table-column>

        <el-table-column
          label="微信ID">
          <template slot-scope="scope">
            <span>{{scope.row.wxUnionId || '-'}}</span>
          </template>
        </el-table-column>
        <!--这里是头像需要做处理-->
        <el-table-column
          label="头像">
          <template slot-scope="scope">
            <template v-if="scope.row.path === undefined || scope.row.path === null">用户没有上传头像</template>
            <template v-else>
              <img :src="scope.row.path" alt="" style="width:60px;height:60px;">
            </template>
          </template>
        </el-table-column>

        <el-table-column
          label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.phone || '-'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="余额">
          <!--新增退款金额-->
          <template slot-scope="scope">
            <span>￥{{scope.row.balanceEarn || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column
          label="车牌号">
          <template slot-scope="scope">
            <span v-if="scope.row.plateNumber == ''">-</span>
            <span v-else>{{scope.row.plateNumber}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="最后登录时间">
          <template slot-scope="scope">
            <span v-if="scope.row.latestLoginTime == undefined">-</span>
            <span v-else>{{scope.row.latestLoginTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="注册时间">
          <template slot-scope="scope">
            <span v-if="scope.row.registerTime == undefined">-</span>
            <span v-else>{{scope.row.registerTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">正常</span>
            <span v-else-if="scope.row.state == 9999">已删除</span>
            <span v-else-if="scope.row.state == 0">异常</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名">
          <template slot-scope="scope">
            <span v-if="scope.row.name == undefined">-</span>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户类型">
          <template slot-scope="scope">
            <span v-if="scope.row.userType == 0">车主</span>
            <span v-else-if="scope.row.userType == ''">车主</span>
            <span v-else-if="scope.row.userType == 1">业主</span>
            <span v-else-if="scope.row.userType == 2">管理员</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="integral"
          label="信用积分">
        </el-table-column>
        <el-table-column
          label="套餐车牌">
          <template slot-scope="scope">
            <span v-if="scope.row.userPlateId">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="edit(scope.row)">编辑</el-button>
            <br>
            <el-button size="mini" type="success" @click="detail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
        <!--ok已经搞定-->
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="form.identityNumber" :maxlength=18 @change="identityNumberChange"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">返 回</el-button>
        <el-button type="primary" @click="editSubmit">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style scoped>
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
  }

  .searchStyle {
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
        value6: [],// 对登陆的时间范围做处理
        value7: [], // 对注册时间范围做处理
        text: '',
        searchFromData: {
          id: '', // 用户ID
          phone: '', // 退款支付码
          userType: '',    // 用户类型
          state: '',  // 状态
          source: '',  //
          medium: '',  //
          content: '',  //
          keyword: '',  //
          series: '',  //
          isPackage:0,
        },
        channelObj: [  // 用户类型的下拉框
          {userType: 0, text: '车主'},
          {userType: 1, text: '业主'},
          {userType: 2, text: '管理员'}
        ],
        stateObj: [  // 状态的下拉框数据
          {state: 1, text: '正常'},
          {state: 0, text: '异常'},
        ],
        isPackage:[
          {state: 0, text: '全部'},
          {state: 1, text: '是'},
          {state: 2, text: '否'},
        ],
        isSearch: 0,// 为1 表示进行了数据搜索

        //提示信息
        flag: false,
        isLoading: false,
        seachLoading: false,
        //编辑身份证
        dialogFormVisible: false,
        form: {
          name: '',
          identityNumber: '',
        },
        userId: '',
      }
    },
    watch: {
      form: {
        handler(curVal, oldVal){
            //判断身份证输入 支持字母及数字输入，汉字输入不显示；
          var reg_chinese = /[\u4e00-\u9fa5]/g;
          if (reg_chinese.test(this.form.identityNumber)) {
            var text = this.form.identityNumber;
            for (var i = 0; i < text.length; i++) {
              if (reg_chinese.test(text[i])) {
                this.form.identityNumber = text.replace(/[\u4e00-\u9fa5]/g, '')
              }
            }
          }
        },
        deep: true
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {

      // 获取表格信息
      getTableDatas(){
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('user/pageable', data).then(res => {
          console.log(res.data);
          if (res.data.error_code === 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            // 处理逻辑方式：
            var paramDatas = res.data.data.dataList, path = '';
            for (var i = 0; i < paramDatas.length; i++) {
              paramDatas[i].plateNumber = res.data.data.dataList[i].plateNumber.toString();
            };
            // 处理支付码和费用
            this.tableDatas = paramDatas;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },

      //获取搜索的内容
      searchEvent(){ // 做判断和验证
        console.log(this.compage);
        //console.log(this.searchFromData.channel == 0);
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          // 前提对搜索的条件进行判断
          var gettype = Object.prototype.toString;
          if (gettype.call(this.value6) === '[object Null]') {
            this.value6 = [];
          }
          ;
          if (gettype.call(this.value7) === '[object Null]') {
            this.value7 = [];
          }
          ;
          if (this.searchFromData.phone == "" && this.searchFromData.id == "" && this.searchFromData.state === ""
            && this.searchFromData.userType === "" && this.value6.length == 0 && this.value7.length == 0 && this.searchFromData.source === "" && this.searchFromData.medium === "" && this.searchFromData.content === "" && this.searchFromData.keyword === "" && this.searchFromData.series === ""&& this.searchFromData.isPackage === 0) {
            // 第一次搜索没有字段提示用户信息
            this.flag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            setInterval(() => {
              this.flag = false;
              this.seachLoading = false;
            }, 3000);
            return;
          } else {
            this.start = 0;
            // 开始进行带参分页
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          // 如果为空搜索，那么开启默认搜索， 如果为非空搜索进行分页搜索，但是发生变化之后，this.start = 0 从0 开始作为搜索的目标
          var gettype = Object.prototype.toString;
          if (gettype.call(this.value6) === '[object Null]') {
            this.value6 = [];
          }
          ;
          if (gettype.call(this.value7) === '[object Null]') {
            this.value7 = [];
          }
          ;
          if (this.searchFromData.phone == "" && this.searchFromData.id == "" && this.searchFromData.state === ""
            && this.searchFromData.userType === "" && this.value6.length == 0 && this.value7.length == 0 && this.searchFromData.source === "" && this.searchFromData.medium === "" && this.searchFromData.content === "" && this.searchFromData.keyword === "" && this.searchFromData.series === ""&& this.searchFromData.isPackage === 0) {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
            this.getTableDatas();  // 做了对图像的处理
          } else if (this.searchFromData.phone == "" || this.searchFromData.id == "" || this.searchFromData.state === "" || this.searchFromData.userType === ""
            || this.value6.length == 0 || this.value7.length == 0 && this.searchFromData.source === "" || this.searchFromData.medium === "" || this.searchFromData.content === "" || this.searchFromData.keyword === "" || this.searchFromData.series === ""&& this.searchFromData.isPackage === 0) {
            this.paramsData();
          }
        }
      },
      // 带参搜索数据
      paramsData(){
        var data1 = {};
        this.isSearch = 1;
        // 对参数进行处理
        data1.start = this.start;
        data1.sEcho = 3;
        data1.length = this.display;
//        console.log(this.searchFromData.userType);
        if (this.searchFromData.id !== '') data1.id = this.searchFromData.id;
        if (this.searchFromData.phone !== '') data1.phone = this.searchFromData.phone;
        if (this.searchFromData.state !== '') data1.state = this.searchFromData.state;
        if (this.searchFromData.userType !== '') data1.userType = this.searchFromData.userType;
        if (this.searchFromData.source !== '') data1.source = this.searchFromData.source;
        if (this.searchFromData.medium !== '') data1.medium = this.searchFromData.medium;
        if (this.searchFromData.content !== '') data1.content = this.searchFromData.content;
        if (this.searchFromData.keyword !== '') data1.keyword = this.searchFromData.keyword;
        if (this.searchFromData.series !== '') data1.series = this.searchFromData.series;
        if (this.searchFromData.isPackage !== 0) data1.isPackage = this.searchFromData.isPackage;
        // 对两个时间进行处理（登陆时间 和 注册时间）
        // 最后登录时间 beginLatestLoginTime / endLatestLoginTime  value6
        // 注册时间  beginRegisterTime/ endRegisterTime    value7
        if (this.value6.length != 0) {
          if (this.value6[0]) data1.beginLatestLoginTime = this.value6[0];
          if (this.value6[1]) data1.endLatestLoginTime = this.value6[1];
        }
        if (this.value7.length != 0) {
          if (this.value7[0]) data1.beginRegisterTime = this.value7[0];
          if (this.value7[1]) data1.endRegisterTime = this.value7[1];
        }
        console.log(data1);
        var datas = Qs.stringify(data1);
        console.log(datas);
        this.$http.post('user/pageable', datas).then(res => {

          // 按钮不用禁用了
          this.seachLoading = false;
          console.log(res);
          if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            // 处理支付码和费用// 处理逻辑方式：
            var paramDatas = res.data.data.dataList, imgUrl = '';
            for (var i = 0; i < paramDatas.length; i++) {
              paramDatas[i].plateNumber = res.data.data.dataList[i].plateNumber.toString();
            }
            ;
            this.tableDatas = paramDatas;
          } else if (res.data.error_code == 2000) {
            var _this = this;
            this.flag = true;
            this.text = '未能搜索到匹配的条件，请重新数据搜索条件！！';
            setInterval(function () {
              _this.flag = false;
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
        var data = {};
        // 对时间进行判断
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]') {
          this.value6 = [];
        }
        ;
        if (gettype.call(this.value7) === '[object Null]') {
          this.value7 = [];
        }
        ;
        // 如果搜索条件为空，是没有数据导出的（并且提示用户）  // 搜索条件不为空，搜索到数据（进行导出操作）  位搜索到数据提示用户输入导出条件有误，请重新输入
        if (this.searchFromData.phone == "" && this.searchFromData.id == "" && this.searchFromData.state === ""
          && this.searchFromData.userType === "" && this.value6.length == 0 && this.value7.length == 0 && this.searchFromData.source === "" && this.searchFromData.medium === "" && this.searchFromData.content === "" && this.searchFromData.keyword === "" && this.searchFromData.series === ""&& this.searchFromData.isPackage === 0) {
          this.text = "没有导出数据的条件，数据无法进行导出";
          this.flag = true;
          setInterval(() => {
            this.isLoading = false;
            this.flag = false;
          }, 3000)
          return;
        } else {
          // 对导出的参数进行处理
          if (this.searchFromData.id) data.id = this.searchFromData.id;
          if (this.searchFromData.phone) data.phone = this.searchFromData.phone;
          if (this.searchFromData.state) data.state = this.searchFromData.state;
          if (this.searchFromData.userType) data.userType = this.searchFromData.userType;
          if (this.searchFromData.source !== '') data.source = this.searchFromData.source;
          if (this.searchFromData.medium !== '') data.medium = this.searchFromData.medium;
          if (this.searchFromData.content !== '') data.content = this.searchFromData.content;
          if (this.searchFromData.keyword !== '') data.keyword = this.searchFromData.keyword;
          if (this.searchFromData.series !== '') data.series = this.searchFromData.series;
          // 对两个时间进行处理（登陆时间 和 注册时间）
          // 最后登录时间 beginLatestLoginTime / endLatestLoginTime  value6
          // 注册时间  beginRegisterTime/ endRegisterTime    value7
          if (this.value6.length != 0) {
            if (this.value6[0]) data.beginLatestLoginTime = this.value6[0];
            if (this.value6[1]) data.endLatestLoginTime = this.value6[1];
          }
          if (this.value7.length != 0) {
            if (this.value7[0]) data.beginRegisterTime = this.value7[0];
            if (this.value7[1]) data.endRegisterTime = this.value7[1];
          }
          // 开始进行搜索和导出
          var datas = Qs.stringify(data);
          this.$http.post('user/excel', datas, {responseType: 'blob'}).then(res => {
            console.log(res);
            this.isLoading = false;
            // 看是否搜索到了数据
            var filename = '用户列表表格'
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
        if (this.value6 != null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
        if (this.value7 != null) {
          this.value7[0] = new Date(this.value7[0]).getTime();//开始时间
          this.value7[1] = new Date(this.value7[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },
      // 输入框发生改变的时候
      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
      },
      // 点击跳转到详情页面
      detail(userId){
        this.$router.push({path: '/user_detail', query: {userId: userId}});
      },

      edit(row){
        this.userId = row.id;
        this.dialogFormVisible = true;
        if (row.name !== "") {
          this.$http.get("user/" + row.id).then(res => {
            console.log(res)
            this.form.name = res.data.data.name;
            this.form.identityNumber = res.data.data.identityNumber;
          })
        }
      },
      //输入身份证判断
      identityNumberChange(val){
        console.log(val)
      },
      editSubmit(){
        var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        if (!reg.test(this.form.identityNumber)) {
          this.$message.error('错了哦，身份证不合法');
        } else if (this.form.name == '') {
          this.$message.error('错了哦，姓名不能为空');
        } else if (this.form.identityNumber == "") {
          this.$message.error('错了哦，身份证不能为空');
        } else {
          this.open2();
        }
      },
      open2() {
        this.$confirm('确定提交信息？是/否?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          var data = {
            name: this.form.name,
            identityNumber: this.form.identityNumber,
            id: this.userId
          };
          data = Qs.stringify(data);
          this.$http.post("user/edit", data).then(res => {
            if (res.data.error_code == 2000) {
              this.$message.success('恭喜你，成功编辑身份信息');
              this.dialogFormVisible = false;
              this.getTableDatas();
            } else {
              this.$message.error('编辑身份信息失败');
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '编辑身份信息失败'
          });
          this.dialogFormVisible = false;
        });
      }
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

