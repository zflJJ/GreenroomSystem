<template>
  <div class="addTagStyle">
    <!-- 新增标签 -->
    <h2>新增自动标签</h2>
    <!--这个是标签名称和标签说明的from表单-->

    <el-form :label-position="labelPosition" label-width="80px" v-model="activeName1">
      <span class="titleStyle"><i>*</i>标签名</span>

      <el-form-item label="">
        <el-input
          :maxlength=20
          v-model.trim="activeName1.name"></el-input>
      </el-form-item>
      <span class="titleStyle">标签说明</span>
      <el-form-item label="">
        <el-input
          type="textarea"
          :maxlength=100
          :rows="3"
          v-model.trim="activeName1.comment"
          placeholder="请输入内容">
        </el-input>
      </el-form-item>

      <span class="titleStyle">绑定用户</span>
    </el-form>

    <!--2.0 这个是绑定用户的表单-->
    <el-form v-model="activeName2">

      <el-form-item label="用户类型">
        &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-select
          :clearable="true"
          clearable width="100%"
          @clear="clearSelect"
          @change="selectEvent"
          v-model="activeName2.userType">
          <el-option v-for="item in typeSelect" :label="item.text" :value="item.userType" :key="item.userType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="80">
        <el-col :span="12">
          <div class="grid-content bg-purple">

            <el-form-item>
              <el-checkbox name="type" @change="getChecked1" v-model="checked1">
                <div class="block">
                  <span>注册时间</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <!--时间非form-->
                  <el-date-picker
                    v-model="value6"
                    type="daterange"
                    :clearable="false"
                    :disabled="check1"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="setTime"
                    end-placeholder="结束日期">
                  </el-date-picker>

                </div>
              </el-checkbox>
            </el-form-item>

          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item>
              <el-checkbox
                @change="getChecked2"
                v-model="checked2"
                name="type1">
                <span>未登陆天数</span>
                &nbsp;
                <el-input
                  :disabled="check2"
                  v-model.trim="activeName2.unsigninDays"
                  class="inputWidthStyle">
                </el-input>

              </el-checkbox>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="80" v-show="activeName2.userType == 0">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item>
              <el-checkbox
                @change="getChecked3"
                v-model="checked3"
                name="type1">
                <span>消费金额</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input
                  :disabled="check3"
                  v-model.trim="activeName2.orderAmount"
                  class="inputWidthStyle"></el-input>

              </el-checkbox>
            </el-form-item>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item>
              <el-checkbox
                v-model="checked4"
                @change="getChecked4"
                name="type4">
                <span>下单次数</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-input
                  :disabled="check4"
                  v-model.trim="activeName2.orderNumber"
                  class="inputWidthStyle"></el-input>

              </el-checkbox>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--错误提示用户信息用的-->
    <div>
      <!--错误提示信息-->
      <el-alert
        :closable="false"
        v-show="errorFlag == 1"
        title="错误提示的文案"
        type="error"
        :description="errorTitle"
        show-icon>
      </el-alert>

    </div>
    <!--提交和取消按钮-->
    <div style="margin-top:10px;">
      <el-button type="danger" @click="returnTagList">取消</el-button>
      <el-button type="success" @click="addTageEvent" :disabled="isDisabled">提交</el-button>
    </div>

  </div>
</template>
<style scoped>
  .titleStyle {
    font-size: 18px;
    color: #606266;
    font-weight: 400;
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
  }

</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        isclearable: true,    // 小叉是否禁用
        typeSelect: [         // 推送的信息列表
          {userType: 0, text: '车主'},
          {userType: 1, text: '业主'}
        ],
        labelPosition: 'top',  // 标题显示头部
        value6: [],            // 这个是时间范围的存储
        activeName1: {  // 标签名 和 标签说明
          name: '',  // 标签名称
          comment: '', // 标签内容
        },
        activeName2: {  // 用户类型和一些选项
          userType: 0,   // 用户类型(车主为0 业主为1)
          orderNumber: '',  // 下单次数
          orderAmount: '',  // 消费金额
          unsigninDays: '', // 未登陆天数
        },
        check1: true,
        check2: true,
        check3: true,
        check4: true,

        checked3: false,
        checked1: false,
        checked2: false,
        checked4: false,

        // 错误提示信息
        errorFlag: 0,
        errorTitle: '',
        isDisabled: false,  // 不禁用
      }
    },
    created(){
    },

    /*点击用户类型的时候，需要对所有的编程true,并清空文本框的内容*/
    methods: {
      // 点击提交按钮的时候
      addTageEvent(){
        var reg2 = /^[0-9]{1,3}$/;
        var reg3 = /^[0-9]{1,5}$/;
        var reg4 = /^[0-9]{1,4}$/;
        console.log(!reg2.test(this.activeName2.unsigninDays));
        // 1. 对数据进行判断
        if (this.activeName1.name === ''
          || (this.check2 === false && this.activeName2.unsigninDays === '') || (this.check3 === false && this.activeName2.orderAmount === '')
          || (this.check4 === false && this.activeName2.orderNumber === '') || (this.check1 === false && this.value6.length == 0)) {
          this.errorFlag = 1;
          this.errorTitle = '请完善标签信息';
          this.isDisabled = true;
          clearInterval(timeId);
          var timeId = setInterval(() => {
            this.errorFlag = 0;
            this.isDisabled = false;
            clearInterval(timeId);
          }, 3000);
        } else if (this.activeName1.name.length > 20 || this.activeName1.comment.length > 100
          || (this.check2 === false && !reg2.test(this.activeName2.unsigninDays))
          || (this.check3 === false && !reg3.test(this.activeName2.orderAmount))
          || (this.check4 === false && !reg4.test(this.activeName2.orderNumber))) {
          this.errorFlag = 1;
          this.errorTitle = '标签信息不正确';
          this.isDisabled = true;
          clearInterval(timeId);
          var timeId = setInterval(() => {
            this.errorFlag = 0;
            this.isDisabled = false;
            clearInterval(timeId);
          }, 3000);
        } else {
          var dataObj = {};
          if(this.activeName1.name) dataObj.name = this.activeName1.name;
          if(this.activeName1.comment) dataObj.comment = this.activeName1.comment;
          if(this.value6[0]) dataObj.startSignupTime = this.value6[0];
          if(this.value6[1]) dataObj.endSignupTime = this.value6[1];
          if(this.activeName2.unsigninDays) dataObj.unsigninDays = this.activeName2.unsigninDays;
          if(this.activeName2.orderAmount) dataObj.orderAmount = this.activeName2.orderAmount;
          if(!this.activeName2.orderAmount) dataObj.orderAmount = 0;
          if(this.activeName2.orderNumber) dataObj.orderNumber = this.activeName2.orderNumber;
          dataObj.userType = this.activeName2.userType;
          console.log(dataObj);
          var data = Qs.stringify(dataObj);
          /*tag/save*/
          this.$http.post('tag/save',data).then((res)=>{
              console.log(res);
              if(res.data.error_code == 2000){
                this.$message({
                  message: '恭喜你，成功添加标签',
                  type: 'success'
                });
                 this.$router.go(-1);
              }else if(res.data.error_code == 2312){
                this.errorFlag = 1;
                this.errorTitle = '提交的标签名已经存在了，请重新考虑一个吧！';
                this.isDisabled = true;
                clearInterval(timeId);
                var timeId = setInterval(() => {
                  this.errorFlag = 0;
                  this.isDisabled = false;
                  clearInterval(timeId);
                }, 3000);
              }else if(res.data.error_code !== 0){
                this.errorFlag = 1;
                this.errorTitle = '新增标签出错，请检查提交数据是否合法';
                this.isDisabled = true;
                clearInterval(timeId);
                var timeId = setInterval(() => {
                  this.errorFlag = 0;
                  this.isDisabled = false;
                  clearInterval(timeId);
                }, 3000);
              }
          }).catch((err)=>{
              console.log(err);
          })
        }
        // 2. 数据符合提交数据
      },



      // 点击下拉清空按钮的时候
      clearSelect(){
        this.activeName2.userType = 0;
      },
      // 切换用户类型的时候
      selectEvent(){
        // 全部东西要清空
        this.check1 = false;
        this.check2 = false;
        this.check3 = false;
        this.check4 = false;
        this.checked3 = false;
        this.checked1 = false;
        this.checked2 = false;
        this.checked4 = false;
        this.activeName2.orderAmount = "";
        this.activeName2.orderNumber = "";
        this.getChecked4();
        this.getChecked3();
        this.getChecked2();
        this.getChecked1();
      },

      // 点击取消按钮的时候
      returnTagList(){
        this.$router.go(-1);
      },

      // 第四个多选框（下单次数）
      getChecked4(){
        if (this.check4) {
          this.check4 = false;
        } else {
          // 清空里面的数据，并且要禁用
          this.activeName2.orderNumber = ''
          this.check4 = true;
        }
      },
      // 第三个多选框（消费金额）
      getChecked3(){
        if (this.check3) {
          this.check3 = false;
        } else {
          // 清空里面的数据，并且要禁用
          this.activeName2.orderAmount = ''
          this.check3 = true;
        }
      },
      // 第二个多选框(未登陆天数)
      getChecked2(){
        if (this.check2) {
          this.check2 = false;
        } else {
          // 清空里面的数据，并且要禁用
          this.activeName2.unsigninDays = ''
          this.check2 = true;
        }
      },
      // 第一个多选框的状态
      getChecked1(){
        if (this.check1) {
          this.check1 = false;
        } else {
          // 清空里面的数据，并且要禁用
          this.value6 = [];
          this.check1 = true;
        }
      },

      // 设置时间
      setTime(){
//        console.log(this.value6);
        if (this.value6 != null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },

    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

