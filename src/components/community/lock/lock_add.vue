<template>
  <div>
    <h2>新增车锁</h2>
    <el-form label-position="top" label-width="80px" :model="formLabelAlign">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*蓝牙名称（必须以CrAm_开头)">
              <el-input v-model.trim="formLabelAlign.btName" placeholder="请输入蓝牙名称（必须以CrAm_开头)" :maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*蓝牙密码">
              <el-input v-model.trim="formLabelAlign.btPassword" placeholder="请输入蓝牙密码" :maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*锁MAC地址" prop="mac">
              <el-input v-model.trim="formLabelAlign.mac" placeholder="请输入锁MAC地址"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <el-form-item label="*类型">
            <el-select v-model="formLabelAlign.type" placeholder="请选择" @change="changeType">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formLabelAlign.type==0 || formLabelAlign.type=='zigbee车锁' || formLabelAlign.type==3 || formLabelAlign.type=='Lora车锁'">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*网关ID">
              <el-input v-model="formLabelAlign.gatewayId" placeholder="请选择网关ID" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="">
              <el-button class="bindButton" type="primary" plain @click="bindOfGateway">点击绑定</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="submitForm">提交</el-button>
    <el-button type="primary" @click="toBefore">返回</el-button>

    <!--网关的模态框-->
    <el-dialog
      title="选择网关"
      width="60%"
      :show-close='false'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogGatewayTable"
      custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" :model="gatewaySearchFromData">
          <el-form-item label='*网关ID'>
            <el-input placeholder="请输入网关ID" v-model.trim="gatewaySearchFromData.identifier" @change="clearStart"
                      @keyup.enter.native="gatewaySearch"></el-input>
          </el-form-item>
          <div class="divStyle">
            <selectchild v-on:getlength="getChildLength"></selectchild>
            <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
            <el-button type="primary" @click="gatewaySearch" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
          </div>
        </el-form>
      </div>
      <template>
        <el-table
          style="width: 100%"
          :data="gatewayTableDatas"
          ref="singleEstateTable"
          row-key="id"
          border>
          <el-table-column
            prop="id"
            width="100px"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="name"
            label="网关名称">
          </el-table-column>
          <el-table-column
            prop="identifier"
            label="网关ID">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="bindGateway(scope.row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                      v-on:pagechange="pagechangesGateway"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogGatewayTable">取消</el-button>
        </div>
      </div>
    </el-dialog>

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
    height: 50px;
  }

  .isInfoStyle {
    color: red;
  }

  .bindButton {
    position: absolute;
    top: 50px;
  }
</style>

<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        formLabelAlign: {
          mac: '',
          gatewayId: '',
          btName: 'CrAM_',
          btPassword: '',
          type: '',
        },
        types: [{
          value: '0',
          label: 'zigbee车锁'
        }, {
          value: '1',
          label: 'NB车锁'
        }, {
          value: '2',
          label: '蓝牙车锁'
        }, {
          value: '3',
          label: 'Lora车锁'
        }],
        //分页的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        text: '',
        isflag: false,
        // 搜索和导出的变量
        seachLoading: false,  // 搜索是否禁用
        isSearch: 0, // 是否进行了搜索
        //绑定网关的数据------------
        dialogGatewayTable: false,//网关模态框
        gatewayTableDatas: null,//网关的数据
        gatewaySearchFromData: {//网关的搜索
          identifier: ''
        },
      }
    },
    methods: {
      changeType(val){
        if (val == 1) {
          this.gatewayTableDatas = null;
          this.formLabelAlign.gatewayId = "";
        }
      },
      // 提交数据
      submitForm(){
        console.log(this.formLabelAlign)
        var patt1 = new RegExp("[A-Fa-f0-9]{16}");
        var patt2 = new RegExp("^CrAM_");
        var pass = /^\d{6}$/;
        if (this.formLabelAlign.btName === 'CrAM_') {
          this.$message.error('所有*号内容为必填');
        } else if (!patt2.test(this.formLabelAlign.btName)) {
          this.$message.error('错了哦，蓝牙名称必须以CrAM_开头');
        } else if (this.formLabelAlign.btPassword == '') {
          this.$message.error('所有*号内容为必填');
        } else if (!pass.test(this.formLabelAlign.btPassword)) {
          this.$message.error('错了哦，蓝牙密码必须为6位数字');
        } else if (this.formLabelAlign.mac === '' ) {
          this.$message.error('所有*号内容为必填');
        } else if (this.formLabelAlign.type == '') {
          this.$message.error('所有*号内容为必填');
        } else if (this.formLabelAlign.gatewayId == null || this.formLabelAlign.gatewayId == "" && (this.formLabelAlign.type == "zigbee车锁" || this.formLabelAlign.type == 0 || this.formLabelAlign.type==3 || this.formLabelAlign.type=='Lora车锁')) {
          this.$message.error('所有*号内容为必填');
        } else {
          var type = null;
          if(this.formLabelAlign.type == "zigbee车锁" || this.formLabelAlign.type == 0){
            type = 0;
          }else if(this.formLabelAlign.type == "NB车锁"){
            type = 1;
          }else if(this.formLabelAlign.type == "蓝牙车锁"){
            type = 2;
          }else if(this.formLabelAlign.type == "Lora车锁"){
            type = 3;
          }else {
            type = this.formLabelAlign.type;
          }
          var data = {
            name: this.formLabelAlign.btName,
            serialNumber: this.formLabelAlign.btName,
            mac: this.formLabelAlign.mac,
            gatewayId: this.formLabelAlign.gatewayId,
            btName: this.formLabelAlign.btName,
            btPassword: this.formLabelAlign.btPassword,
            type: type,
            state: 1,
            battery: 1,
          }
          data = Qs.stringify(data)
          console.log(data)
          this.$http.post('lock/save', data).then((res) => {
            if (res.data.error_code == 2000) {
            this.$message.success('恭喜你，新增车位锁成功了');
            this.$router.go(-1);
          } else {
            this.$message.error('错了哦，服务器返回了' + res.data.error_message);
          };
        }).catch((err) => {
            console.log(err);
        })
        }
      },
      toBefore(){
        this.$router.go(-1);
      },
      //绑定网关----------------
      bindOfGateway(){
        this.dialogGatewayTable = true;
        this.getGatewayData();
      },
      //获取数据
      getGatewayData(){
        this.gatewayTableDatas = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post('gateway/pageable', data).then((res) => {
          this.seachLoading = false;
        if (res.data.error_code !== 2000 && res.data.data.dataList.length != 0) {
          this.error_code = 0;
        } else {
          this.seachLoading = false;
          console.log(res.data.data.dataList);
          this.gatewayTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
        }
      }).catch((err) => {
          this.seachLoading = false;
        console.log(err);
      });

      },
      //搜索
      gatewaySearch(){
        console.log(this.gatewaySearchFromData)
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.gatewaySearchFromData.identifier === "") {
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
            this.paramsgatewayData();
          }

        } else if (this.isSearch == 1) {
          if (this.gatewaySearchFromData.identifier === "") {
            this.start = 0;
            this.isSearch = 0;
            this.getGatewayData();
          } else {
            this.paramsgatewayData();
          }
        }
        ;
      },
      //带参搜索
      paramsgatewayData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.gatewaySearchFromData.identifier) datas.identifier = this.gatewaySearchFromData.identifier;
        this.gatewayTableDatas = [];
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('gateway/pageable', data).then(res => {
          this.seachLoading = false;
        this.gatewayTableDatas = res.data.data.dataList;
        // 当数据回来之后再做页码处理
        this.total = parseInt(res.data.data.itotalRecords);
        if (this.gatewayTableDatas.length == 0) {
          this.$message.error('错了哦，没有符合的数据');
        }
      }).catch(err => {
          this.seachLoading = false;
        console.log('服务端错误' + err);
      })

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
          this.getGatewayData();
        } else if (this.isSearch == 1) {
          this.paramsgatewayData();
        }
      },
      //绑定
      bindGateway(row){
        this.dialogGatewayTable = false;
        this.formLabelAlign.gatewayId = row.id;
        // 确定数据
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        this.gatewaySearchFromData.identifier = '';
        this.dialogGatewayTable = false;
      },
      //取消按钮
      closeDialogGatewayTable(){
        // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        this.gatewaySearchFromData.identifier = '';
        this.dialogGatewayTable = false;
      },
      // 分页菜单的数据
      pagechangesGateway(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 1) {
          this.pakingSearch();
        } else {
          this.getGatewayData();
        }
      },
      // 输入框发生改变的时候
      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
      },
    },
    updated(){
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
