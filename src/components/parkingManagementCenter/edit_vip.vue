<template>
  <div class="estate">
    <!--{{this.$route.params.estateId}}-->
    <!--{{this.$route.query.type}}-->

    <div class="divStyle">
      <p class="importInfo">&nbsp;&nbsp;&nbsp;&nbsp;全部内容必填</p>
      <div class="divcontent">
        <div>
          <template>
            <h2>修改VIP车位</h2>
            <el-form label-position="top" ref="formAddShare" label-width="80px"
                     :model="formAddShare">

              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="业主姓名">
                      <el-input v-model="formAddShare.contact" placeholder="请输入业主姓名"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="联系电话">
                      <el-input v-model.number="formAddShare.phone" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="车位名称">
                      <el-input v-model.trim="formAddShare.name" placeholder="请输入车位名称"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="车位编号(必须以CrAM_开头)">
                      <el-input v-model.trim="formAddShare.number" placeholder="请输入车位编号(CrAM_XXXXXX)"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="网关ID">
                      <el-input v-model.trim="formAddShare.gatewayId" placeholder="请输入网关ID"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="锁MAC地址(格式必须为0-9A-F共16位)">
                      <el-input v-model.trim="formAddShare.lockMac" placeholder="请输入锁MAC地址(16位)"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="锁密码">
                      <el-input type='password' v-model.number.trim="formAddShare.password"
                                placeholder="请输入锁密码(6位数字)"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="收费标准（单位：元/小时）">
                      <el-input v-model.number.trim="formAddShare.unitPrice" placeholder="请输入收费标准"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content bg-purple">
                    <el-form-item label="担保费（单位：元）">
                      <el-input v-model.number.trim="formAddShare.guaranteeFee" placeholder="请输入担保费"
                                :disabled="isDisabled"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="业主结算比例（%）">
                      <el-input v-model.number.trim="formAddShare.ownerSettle"
                                placeholder="请输入业主结算比例，必须是正整数（最大值90）"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="物业结算比例">
                      <el-input v-model.number.trim="formAddShare.estateSettle"
                                placeholder="请输入物业结算比例，必须是正整数（最大值90）"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="平台结算比例">
                      <el-input v-model.number.trim="formAddShare.platformSettle"
                                placeholder="请输入平台结算比例，必须是正整数（最大值90）"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <!--错误提示信息-->
              <el-alert
                title="错误提示信息"
                type="error"
                v-show="isError == 1"
                :description="errorTtile"
                show-icon>
              </el-alert>
              <br>
              <el-form-item>
                <el-button type="primary" @click="submitFormToOrder('formAddShare')" :loading="isVipLoading">提交
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

  .divStyle {
    border-radius: 4px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px 0 rgba(34, 36, 38, .12), 0 2px 10px 0 rgba(34, 36, 38, .15);
    padding: 14px;
  }

  h3 {
    font-weight: 700;
    color: #000000;
    padding-bottom: 5px;
    border-bottom: 1px solid #dededf;
  }

  .divStyle .importInfo {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 3.5px 15px;
    background-color: #db2828;
    position: relative;
    left: -27px;
    display: inline-block;
  }

  .divStyle .importInfo:after {
    position: absolute;
    content: '';
    border: 6px solid transparent;
    border-top-color: #b21e1e;
    border-right-color: #b21e1e;
    left: 0px;
    top: 24px;
  }

  label {
    margin-bottom: 4px;
  }

  form {
    padding-bottom: 13px;
    border-bottom: 1px solid #ddd;
  }

  .errorInfo {
    border: 1px solid #e0b4b4;
    padding: 14px 21px;
    font-weight: 700;
    position: relative;
  }

  .errorInfo p {
    font-weight: 400;
  }

  .xClose {
    position: absolute;
    top: 10px;
    right: 15px;
    font-family: '微软雅黑';
    cursor: pointer;
  }
</style>

<script>
  import Qs from 'qs';
  export default{
    data(){
      // 对用户输入的密码做验证
      var patt1 = new RegExp("[A-Fa-f0-9]{16}");
      var patt2 = new RegExp("^CrAM_");
      var pass = /^\d{6}$/;
      var regs = /^1\d{10}$/;
      return {
        isDisabled: true,
        isError: 0,
        errorTtile: '',        // 错误提示信息
        isVipLoading: false,  // vip车位的loading
        formAddShare: {
          estateId: this.$route.query.estateId,
          contact: '', // 业主
          phone: '', // 业主电话
          name: '',//车位名称
          number: '',//车位编号
          gatewayId: '',//网关地址
          lockMac: '',// 锁MAC地址
          password: '',//锁密码
          unitPrice: '',//收费标准
          guaranteeFee: 0,// 担保费
          ownerSettle: '',//业主结算比例
          estateSettle: '',//物业结算比例
          platformSettle: '',// 平台结算比例
          otherSettle: 0,// 预留结算比例
          battery: 1,
          type: 1,
          state: 11,
        },
      }
    },
    created(){
      // 这里需要获取VIP车位的信息赋值
      this.getEstateId();
    },
    methods: {
      // 获取车位信息  parking/{id}
      getEstateId(){
        this.$http.get('parking/'+this.$route.query.parkingId).then((res)=>{
            console.log(res);
            if(res.data.errcode == 1){
              this.formAddShare = res.data.data.parking;
            }
        }).catch((err)=>{
           console.log(err);
        });
      },

      // 错误提示信息
      errorTitle(text){
        this.errorTtile = text;
        this.isError = 1;
        this.isVipLoading = true;
        clearInterval(timeId);
        var timeId = setInterval(() => {
          this.errorTtile = '';
          this.isError = 0;
          this.isVipLoading = false;
          clearInterval(timeId);
        }, 3000);
      },
      // 提交数据
      submitFormToOrder(formAddShare){
        // 对用户输入的密码做验证
        var patt1 = new RegExp("[A-Fa-f0-9]{16}");
        var patt2 = new RegExp("^CrAM_");
        var pass = /^\d{6}$/;
        var regs = /^1\d{10}$/;
        console.log(isNaN(this.formAddShare.password));
        var count = parseInt(this.formAddShare.ownerSettle) + parseInt(this.formAddShare.estateSettle) + parseInt(this.formAddShare.platformSettle);
        if(this.formAddShare.contact === ""){
          this.errorTitle('业主姓名不能为空！！');
        }else if (this.formAddShare.phone === '') {
          this.errorTitle('联系电话不能为空！！');
        }else if (this.formAddShare.name === '') {
          this.errorTitle('车位名称不能为空！！');
        }else if(this.formAddShare.number === ''){
          this.errorTitle('车位编号不能为空！！');
        }else if(patt2.test(this.formAddShare.number) === false){
          this.errorTitle('车位编号必须以CrAM_开头！！');
        }else if(this.formAddShare.gatewayId === ''){
          this.errorTitle('网关ID不能为空！！');
        }else if(this.formAddShare.lockMac === ''){
          this.errorTitle('锁MAC不能为空！！');
        }else if(patt1.test(this.formAddShare.lockMac) === false){
          this.errorTitle('锁MAC须以16位的字母或者数字！！');
        }else if(this.formAddShare.password === ''){
          this.errorTitle('密码不能为空！！');
        }else if(isNaN(this.formAddShare.password) === true){
          this.errorTitle('密码必须是数字！！');
        }else if(pass.test(this.formAddShare.password) === false){
          this.errorTitle('密码的长度必须是6位数！！');
        }else if(this.formAddShare.unitPrice === ''){
          this.errorTitle('请输入收费标准！！');
        }else if(isNaN(this.formAddShare.unitPrice) === true){
          this.errorTitle('收费标准必须是数字！！');
        }else if(this.formAddShare.ownerSettle === '' || this.formAddShare.estateSettle === '' || this.formAddShare.platformSettle === ''){
          this.errorTitle('结算比例不能为空！！');
        }else if(isNaN(this.formAddShare.ownerSettle) === true ||isNaN(this.formAddShare.estateSettle)=== true || isNaN(this.formAddShare.platformSettle)=== true ){
          this.errorTitle('结算比例必须是数字！！');
        }else if(parseInt(this.formAddShare.ownerSettle)> 90){
          this.errorTitle('业主收入比例最大不能超过90%！！');
        }else if(parseInt(this.formAddShare.estateSettle) > 90){
          this.errorTitle('物业收入比例最大不能超过90%！！');
        }else if(parseInt(this.formAddShare.platformSettle) > 90){
          this.errorTitle('平台收入比例最大不能超过90%！！');
        }else if(count != 100){
          this.errorTitle('业主收入比例 + 停车场收入比例 + 平台收入比例之和要为100！！');
        }else{
          console.log('可以提交数据了哈哈哈');
          var datas = Qs.stringify(this.formAddShare);
          this.$http.post('parking/save',datas).then((res)=>{
            if(res.data.errcode === 1){
              this.$router.go(-1);
            }
          }).catch((err)=>{
            console.log(err);
          })
        }
//        this.$refs[formAddShare].validate((valid) => {
//          if (valid) {
//            this.isVipLoading = false;
//            if (parseInt(this.formAddShare.ownerSettle) > 90) {
//              this.isError = 1;
//              this.text = "业主收入比例最大不能超过90%";
//            } else if (parseInt(this.formAddShare.estateSettle) > 90) {
//              this.isError = 1;
//              this.text = "物业收入比例最大不能超过90%";
//            } else if (parseInt(this.formAddShare.platformSettle) > 90) {
//              this.isError = 1;
//              this.text = "平台收入比例最大不能超过90%";
//            } else if (count != 100) {
//              this.isError = 1;
//              this.text = "业主收入比例 + 停车场收入比例 + 平台收入比例之和要为100";
//            } else {
//              var dataPhone = Qs.stringify({phone: this.formAddShare.phone});
//              var data = Qs.stringify(this.formAddShare);
//              this.$http.post('user/query', dataPhone).then(res => {
//                if (res.data.errcode == 1) {
//                  this.$http.post('parking/save', data).then(res => {
//                    this.isVipLoading = false;
//                    if (res.data.errcode == 205) {
//                      this.isError = 1;
//                      this.text = "VIP车位名称已经存在，请重新输入";
//                    } else if (res.data.errcode == 1) {
//                      this.open2();
//                    }
//                  }).catch(err => {
//                    this.isVipLoading = false;
//                    console.log(err);
//                  })
//                }
//              }).catch(err => {
//                this.isVipLoading = false;
//                console.log(err);
//              })
//            }
//          } else {
//            console.log('error submit!!');
//            this.isError = 1;
//            this.text = "必填的字段为空，数据无法进行提交！！";
//            clearInterval(timeId);
//            var timeId = setInterval(() => {
//              this.isError = 0;
//              this.text = "";
//              this.isVipLoading = false;
//              clearInterval(timeId);
//            }, 3000)
//            return false;
//          }
//        });
      },
      // 给一个弹框进行提示
      open2() {
        this.$confirm('新增车位成功, 是否继续新增车位?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          // 返回上一页
          this.formAddShare.contact = '', // 车主
            this.formAddShare.phone = '', // 电话
            this.formAddShare.name = '',//车位名称
            this.formAddShare.number = '',//车位编号
            this.formAddShare.gatewayId = '',//网关地址
            this.formAddShare.lockMac = '',// 锁MAC地址
            this.formAddShare.password = '',//锁密码
            this.formAddShare.unitPrice = '',//收费标准
            this.formAddShare.guaranteeFee = '',// 担保费
            this.formAddShare.ownerSettle = '',//业主结算比例
            this.formAddShare.estateSettle = '',//物业结算比例
            this.formAddShare.platformSettle = '',// 平台结算比例
            this.formAddShare.otherSettle = 0, // 预留结算比例
            this.formAddOrder.contact = '',
            this.formAddOrder.phone = '',
            this.formAddOrder.guaranteeFee = '',
            this.formAddOrder.amount = '',
            this.formAddOrder.estateSettle = '',
            this.formAddOrder.platformSettle = ''
        }).catch(() => {
          this.$router.go(-1);
          // 清空输入框的内容
        });
      },
    }
  }
</script>

