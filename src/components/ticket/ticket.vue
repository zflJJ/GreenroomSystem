<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm" label-width="100px" class="demo-ruleForm"
           :label-position="labelPosition">
    <h2>发放优惠券</h2>
    <el-form-item label="优惠券数量:(小于等于10)" prop="quantity">
      <el-input v-model.number="ruleForm2.quantity" label-width="200px"></el-input>
    </el-form-item>
    <el-form-item label="优惠券金额:(不能有小数)" prop="money">
      <el-input v-model.number="ruleForm2.money"></el-input>
    </el-form-item>
    <el-form-item label="选择时间范围:" prop="">
      <div class="block">
        <span class="demonstration"></span>
        <el-date-picker
          v-model="value6"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="setTime">
        </el-date-picker>
      </div>
    </el-form-item>
    <el-form-item label="选择推送账户:" prop="user">
      <el-input v-model="input5" class="input-with-select" disabled>
        <el-button slot="prepend" @click="getUserData()">点击添加用户</el-button>
      </el-input>
    </el-form-item>
    <el-form-item label="选择推送标签:" prop="tag">
      <el-input v-model="input6" class="input-with-select" disabled>
        <el-button slot="prepend" @click="getTagData()">点击添加标签</el-button>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()" :loading="isLoading">发送优惠券</el-button>
    </el-form-item>

    <el-dialog
      title="选择推送账户"
      :show-close="showClose"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible"
      custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-row>
          <el-col :span="2">用户手机号:</el-col>
          <el-col :span="6"><el-input placeholder="请输入用户手机号" v-model.trim="searchFromData.phone" @keyup.enter.native="searchEvent"></el-input></el-col>
          <el-col :span="6"><el-button type="primary" @click="searchEvent" >搜索</el-button></el-col>
        </el-row>
      </div>
      <br>
      <template>
        <el-table
          style="width: 100%"
          :data="tableDatas"
          ref="table"
          row-key="id"
          @select="getRowOne"
          @select-all="getRowAll"
          border>
          <!--多选框，是否为全选的时候-->
          <el-table-column
            :reserve-selection="true"
            type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            width="100px"
            label="用户ID">
          </el-table-column>

          <el-table-column
            label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.phone || '暂无'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="创建日期">
            <template slot-scope="scope">
              <span v-if="scope.row.registerTime != undefined">{{scope.row.registerTime | moment}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :start="start" :currentss="currentss" :display="display" :total="total" :pagegroup="pagegroup" :compage="compage"
                      v-on:pagechange="pagechanges"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogTableVisible">关闭</el-button>
          <el-button type="primary" @click="tableToInputEvent">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="选择推送标签"
      :show-close="showClose"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible2"
      custom-class="modelTableStyle">
      <!--2.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-row>
          <el-col :span="2">标签名称:</el-col>
          <el-col :span="6"><el-input placeholder="请输入标签名称" v-model.trim="searchTagData.name" @keyup.enter.native="tagsearchEvent"></el-input></el-col>
          <el-col :span="6"><el-button type="primary" @click="tagsearchEvent" >搜索</el-button></el-col>
        </el-row>
      </div>
      <br>
      <template>
        <el-table
          style="width: 100%"
          :data="tableDatas"
          ref="table"
          row-key="id"
          @select="getTagRowOne"
          @select-all="getTagRowAll"
          border>

          <!--多选框，是否为全选的时候-->
          <el-table-column
            :reserve-selection="true"
            type="selection">
          </el-table-column>

          <el-table-column
            prop="id"
            width="100px"
            label="标签ID">
          </el-table-column>

          <el-table-column
            label="标签名">
            <template slot-scope="scope">
              <span>{{scope.row.name || '暂无'}}</span>
            </template>
          </el-table-column>

        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                      v-on:pagechange="tagpagechanges"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeTagDialogTableVisible">关闭</el-button>
          <el-button type="primary" @click="tableTagToInputEvent">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </el-form>
</template>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .isBtnStyle1 {
    position: absolute;
    right: 150px;
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
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    data() {
      //自定义验证
      var quantity = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('优惠券数量不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (!Number(value) && value != 10) {
              callback(new Error('必须大于0且小于等于10'));
            } else if (value > 10 || value <= 0) {
              callback(new Error('必须大于0且小于等于10'));
            } else {
              callback();
            }
          }
        }, 10);
      };
      var money = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('优惠券金额不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 10)
      };
      return {
        display: 10,   // 每页显示条数
        currentss: 1,     // 当前第n页 ， 也可以 watch current 的变化
        page: 1,
        compage:1,//按钮选中第几页
        //分页插件
        current: 1,
        pagegroup: 5,
        total: 0,
        searchFromData: {
          phone: '',
        },
        searchTagData: {
          name: ''
        },
        length: 10,
        start: 0,
        seachLoading: false,
        isLoading: false,
        isflag: '',
        text: '',

        labelPosition: "top",
        radio: '0',
        user: '',
        tag: '',
        input5: '',
        input6: '',
        ruleForm2: {
          quantity: '',
          money: '',
        },
        //表单验证
        rules2: {
          quantity: [
            {validator: quantity, trigger: 'blur'}
          ],
          money: [
            {validator: money, trigger: 'blur'}
          ]
        },
        value6: [],
        //--------------------------
        activeWho: 'first',  // 默认打开推送页面时的标签
        labelPosition: 'top', // 表单提示语
        showClose: false,      // 小叉不显示
        typeSelect: [         // 推送的信息列表
          {type: 1, text: '个人信息'},
          {type: 2, text: '活动信息'},
        ],
        dialogTableVisible: false, // 打开模态框的信息,
        checkArray: [], // 这个是选中的元素的ID
        checkFlag: 0, // 这个表示是否是第一次进行添加数据
        imgError: '',  // 错误提示信息（如果为空表示没有提示）
        isSubmitLoading: false,
        errorTitle: '', // 错误的提示信息
        errorTitleFlag: 0,  // 是否显示错误提示信息
        successTitle: '',    // 成功显示的内容
        successTitleFlag: 0, // 上传和提交数据成功的时候应该展示的内容
        tableDatas: [],
        tableArray: [],//选中的数据
        dialogTableVisible2: false,//标签列表的模态框
        userIdList:[],
        pickerOptions:{
            //设置选择今天以及今天之后的日期
          disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      };
    },
    methods: {
      //时间选择器改变参数
      returnFalse(){
          return false;
      },
      setTime(){
        this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
        this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
      },
      getUserData(){//获取用户列表的数据并渲染
        this.tableDatas = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3
        }
        var datas = Qs.stringify(isData);
        this.$http.post("user/pageableByAccount", datas).then(res => {
          this.tableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
        }).catch(err => {
          console.log(err)
        })
        this.dialogTableVisible = true;
      },
      // 实时获取 表格中的单选数据的时候(单选的时候)
      getRowOne(selection, row){
        this.tableArray = selection;
      },
      // 当点击多选的时候，选中的数据
      getRowAll(selection, row){
        this.tableArray = selection;
      },
      //提交用户表单数据
      tableToInputEvent(){
        var arrId = [];
        var obj = {};
        console.log(this.tableArray);
        for (var i = 0; i < this.tableArray.length; i++) {
          if (!obj[this.tableArray[i].phone]) {
            obj[this.tableArray[i].phone] = 1;
            arrId.push(this.tableArray[i].phone);
            this.userIdList.push(this.tableArray[i].id);
          }
        }
        this.userIdList = this.unique(this.userIdList);
        // 确定数据
        this.start = 0;
        this.compage = 1;
        this.checkArray = arrId;
        this.input5 = arrId.toString();
        // 清空搜索框里面的数据
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        this.dialogTableVisible = false;
      },
      //提交
      submitForm() {
        var reg = /^\+?[1-9][0-9]*$/;
        if (this.input5 != '' && this.input6 != '') {
          this.$message.error('错了哦，不能同时提交用户和标签');
          return;
        } else if (this.ruleForm2.quantity == '') {
          this.$message.error('错了哦，没有填写优惠券数量');
          return;
        } else if (this.ruleForm2.money == '') {
          this.$message.error('错了哦，没有填写优惠券金额');
          return;
        } else if (this.input5 == '' && this.input6 == '') {
          this.$message.error('错了哦，没有填写推送人群');
          return;
        } else if (this.value6 == '') {
          this.$message.error('错了哦，没有填写推送时间');
          return;
        }else if(this.ruleForm2.quantity > 10){
          this.$message.error('错了哦，不能一次性发放超过10张的优惠券');
          return;
        }else if(!reg.test(this.ruleForm2.quantity)){
          this.$message.error('错了哦，优惠券的数量只能是正整数');
          return;
        }else if(!reg.test(this.ruleForm2.money)){
          this.$message.error('错了哦，优惠券的金额只能是正整数');
          return;
        }
        this.isLoading = true;
        var data = {
          couponLimit: this.ruleForm2.money.toString(),//优惠券金额
          couponNum: this.ruleForm2.quantity.toString(),//优惠券数量
          beginTime: this.value6[0],//开始时间
          endTime: this.value6[1],//结束时间
          operationType:1,
//          userIdList: this.input5,//用户ID集合
//          tagList: this.input6//标签集合
        };
        if(this.input5){
          data.userIdList = this.userIdList
        }else if(this.input6){
          data.tagList = this.input6
        }
        data = Qs.stringify(data);
        this.$http.post('coupon/save', data).then(res => {
            console.log(res)
          if(res.data.error_code !== 2000){
            this.$message.error('错了哦，' + res.data.error_message);
            return false;
          }
          this.$message.success('已经成功发送优惠券');
          this.ruleForm2.money = '';
          this.ruleForm2.quantity = '';
          this.userIdList = [];
          this.tagData = [];
          this.tableArray = [];
          this.$refs.table.clearSelection();
          this.input5 = '';
          this.input6 = '';
          this.value6 = '';
          this.searchFromData.id = '';
          this.searchFromData.phone = '';
          this.searchTagData.name = '';
          this.compage = 1;
          this.isLoading = false;
        }).catch(err => {
          console.log(err)
        })
      },
      //点击标签模态框关闭按钮
      closeTagDialogTableVisible(){
//        this.$refs.table.clearSelection();
//        this.input6 = '';
        this.start = 0;
        this.compage = 1;
        this.searchTagData.name = "";
        this.dialogTableVisible2 = false;
        if (this.searchFromData.name) this.searchFromData.name = '';
      },


      //点击添加标签按钮
      getTagData(){
        this.dialogTableVisible2 = true;
        this.tableDatas = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3
        }
        var datas = Qs.stringify(isData);
        this.$http.post("tag/pageable", datas).then(res => {
          this.tableDatas = res.data.data.dataList;
          console.log(this.tagDataItems)
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
        }).catch(err => {
          console.log(err)
        })
      },
      // 2.4 模态框点击提交数据按钮的时候  （跳转到第一页，start变成第一页）
      tableTagToInputEvent(){
        var arrId = [];
        var obj = {};
        for (var i = 0; i < this.tableArray.length; i++) {
          if (!obj[this.tableArray[i].id]) {
            obj[this.tableArray[i].id] = 1;
            arrId.push(this.tableArray[i].id);
            this.userIdList.push(this.tableArray[i].id);
          }
        }
        this.userIdList = this.unique(this.userIdList);
        this.input6 = this.unique(arrId);
        // 确定数据
        this.compage = 1;
        this.start = 0;
        this.input6 = arrId.toString();
        if (this.searchFromData.name) this.searchFromData.name = '';
        this.dialogTableVisible2 = false;
      },

      getTagRowAll(selection){
        this.tableArray = selection;
      },
      // 2.2 获取单个数据
      getTagRowOne(selection, row){
        this.tableArray = selection;
      },

      // 关闭用户列表数据
      closeDialogTableVisible(){
        // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
//        this.$refs.table.clearSelection();
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        this.dialogTableVisible = false;
      },
      // 分页的地方
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getUserData();
      },
      // 下拉菜单的选择器
      getChildLength(len){
        var age = Math.ceil(this.total / len);
        console.log(age, this.page);
        if (age < this.page) {
          this.start = 0;
        } else {
          this.start = (this.page - 1) * parseInt(len);
        }
        this.start = (age - 1) * len;
        this.page = age;
        this.compage = age;
        this.display = parseInt(len);
        this.getUserData();
      },
      //搜索
      searchEvent(){
        // 搜索时候，start必须是0，length是当前的display
        this.searchFromData.length = this.display;
        this.searchFromData.sEcho = 3;
        this.searchFromData.start = 0;
        this.seachLoading = true;
        if (this.searchFromData.phone == '') {
          this.$message.error('输入的搜索条件有误，请重新输入');
          this.isflag = false;
        } else {
          var datas = Qs.stringify(this.searchFromData);
          this.$http.post("user/pageableByAccount", datas).then(res => {
            if (res.data.error_code == 2000) {
              this.seachLoading = false;
              this.tableDatas = res.data.data.dataList;
              this.total = parseInt(res.data.data.itotalRecords);
            } else if (res.data.error_code !== 2000) {
              this.$message.error('输入的搜索条件有误，请重新输入');
              this.isflag = false;
            }
          }).catch(err => {
            console.log('服务端错误' + err);
          })
        }
      },
      // 分页的地方
      tagpagechanges(val){
        this.page = val;
        this.start = (val - 1) * this.display;
        this.getTagData();
      },
      // 下拉菜单的选择器
      taggetChildLength(len){
        var age = Math.ceil(this.total / len);
        console.log(age, this.page);
        if (age < this.page) {
          this.start = 0;
        } else {
          this.start = (this.page - 1) * parseInt(len);
        }
        this.display = parseInt(len);
        this.getTagData();
      },
      //搜索
      tagsearchEvent(){
        // 搜索时候，start必须是0，length是当前的display
        this.searchTagData.length = this.display;
        this.searchTagData.sEcho = 3;
        this.searchTagData.start = 0;
        this.seachLoading = true;
        if (this.searchTagData.name == '') {
          this.$message.error('输入的搜索条件有误，请重新输入');
          this.isflag = false;
        } else {
          var datas = Qs.stringify(this.searchTagData);
          this.$http.post("tag/pageable", datas).then(res => {
            if (res.data.error_code == 2000) {
              this.seachLoading = false;
              this.tableDatas = res.data.data.dataList;
              this.total = parseInt(res.data.data.itotalRecords);
            } else if (res.data.error_code !== 2000) {
              this.$message.error('输入的搜索条件有误，请重新输入');
              this.isflag = false;
            }
          }).catch(err => {
            console.log('服务端错误' + err);
          })
        }
      },

      //数组去重
      unique(arr){
        var res =[];
        var json = {};
        for(var i=0;i<arr.length;i++){
          if(!json[arr[i]]){
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        return res;
      }
    },
    mounted(){
      var data = {url: "coupon/save"};
      data = Qs.stringify(data);
      this.$http.post("auth/check",data).then(res => {
        console.log(res)
      });
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
