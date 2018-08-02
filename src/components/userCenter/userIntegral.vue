<template>
  <div>
    <h2>信用积分</h2>
    <br>
    <h3>积分配置</h3>
    <br>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">加分项</el-col>
      <el-col :span="12">积分</el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">车主按时离场</el-col>
      <el-col :span="4">
        <el-input v-model="bonusPoint" :maxlength=3></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">减分项</el-col>
      <el-col :span="12">积分</el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">车主超时离场</el-col>
      <el-col :span="4">
        <el-input v-model="deduction" :maxlength=3></el-input>
      </el-col>
    </el-row>
    <br>
    <h3>积分权限</h3>
    <br>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">积分等级</el-col>
      <el-col :span="12">预约费系数</el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">较差(0-30)</el-col>
      <el-col :span="4">
        <el-input v-model="bad" :maxlength=11></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">一般(31-50)</el-col>
      <el-col :span="4">
        <el-input v-model="ordinary" :maxlength=11></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">良好(51-60)</el-col>
      <el-col :span="4">
        <el-input v-model="well" :maxlength=11></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">优秀(61-70)</el-col>
      <el-col :span="4">
        <el-input v-model="excellent" :maxlength=11></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="1">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
      <el-col :span="4">极好(71-100)</el-col>
      <el-col :span="4">
        <el-input v-model="meritoriously" :maxlength=11></el-input>
      </el-col>
    </el-row>
    <br>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>
<style scoped>
  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #ffffff;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<script>
  import Qs from 'qs';
  export default{
    data(){
      return {
        bonusPoint: '',//加分
        deduction: '',//减分
        bad: '',//较差
        ordinary: '',//一般
        well: '',//良好
        excellent: '',//优秀
        meritoriously: '',//极好

        bonusPointId: '',//加分
        deductionId: '',//减分
        badId: '',//较差
        ordinaryId: '',//一般
        wellId: '',//良好
        excellentId: '',//优秀
        meritoriouslyId: '',//极好
      }
    },
    created(){
      this.getData();
    },
    methods: {
      getData(){
        var data = Qs.stringify({"integralType": 1});
        this.$http.post("integral/all", data).then(res => {
          if (res.data.error_code == 2000) {
            this.bonusPoint = res.data.data[0].integralPluses;
            this.bonusPointId = res.data.data[0].id;
          } else {
            this.$message.error(res.data.error_message);
          }
        })

        data = Qs.stringify({"integralType": 2});
        this.$http.post("integral/all", data).then(res => {
          if (res.data.error_code == 2000) {
            this.deduction = res.data.data[0].integralPluses;
            this.deductionId = res.data.data[0].id;
          } else {
            this.$message.error(res.data.error_message);
          }
        })

        this.$http.post("integral/allPermissions").then(res => {
          if (res.data.error_code == 2000) {
            this.bad = res.data.data[0].integralPermissionsCoefficient;
            this.ordinary = res.data.data[1].integralPermissionsCoefficient;
            this.well = res.data.data[2].integralPermissionsCoefficient;
            this.excellent = res.data.data[3].integralPermissionsCoefficient;
            this.meritoriously = res.data.data[4].integralPermissionsCoefficient;

            this.badId = res.data.data[0].id;
            this.ordinaryId = res.data.data[1].id;
            this.wellId = res.data.data[2].id;
            this.excellentId = res.data.data[3].id;
            this.meritoriouslyId = res.data.data[4].id;
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch(res => {
          this.$message.error(res);
        })
      },

      submit(){
        let regNum = /^[0-9]([0-9]{0,3})$/;
        if(this.bonusPoint == "" ||this.deduction == "" ||this.bad == "" ||this.ordinary == "" ||this.well == "" ||this.excellent == "" ||this.meritoriously == ""){
          this.$message.error("所有内容均为必填");
        }else if(!regNum.test(this.bonusPoint)){
          this.$message.error("加分项积分仅可输入整数");
        }else if(!regNum.test(this.deduction)){
          this.$message.error("减分项积分仅可输入整数");
        }else if(!/^\d+(\.\d{1,2})?$/.test(this.bad)){
          this.$message.error("较差(0-30)仅支持小数点后两位的数字");
        }else if(!/^\d+(\.\d{1,2})?$/.test(this.ordinary)){
          this.$message.error("一般(31-50)仅支持小数点后两位的数字");
        }else if(!/^\d+(\.\d{1,2})?$/.test(this.well)){
          this.$message.error("良好(51-60)仅支持小数点后两位的数字");
        }else if(!/^\d+(\.\d{1,2})?$/.test(this.excellent)){
          this.$message.error("优秀(61-70)仅支持小数点后两位的数字");
        }else if(!/^\d+(\.\d{1,2})?$/.test(this.meritoriously)){
          this.$message.error("极好(71-100)仅支持小数点后两位的数字");
        }else {
          var data = {
            integralRequestList: [
              {integralType: 1, ratio: this.bonusPoint, id: this.bonusPointId},
              {integralType: 1, ratio: this.deduction, id: this.deductionId},
              {integralType: 2, ratio: this.bad, id: this.badId},
              {integralType: 2, ratio: this.ordinary, id: this.ordinaryId},
              {integralType: 2, ratio: this.well, id: this.wellId},
              {integralType: 2, ratio: this.excellent, id: this.excellentId},
              {integralType: 2, ratio: this.meritoriously, id: this.meritoriouslyId},
            ]
          };
          this.$http.post("integral/saveUpdateIntegral", data).then(res => {
            if(res.data.error_code == 2000){
              this.$message.success("提交数据成功");
            }else {
              this.$message.error(res.data.error_message);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        }

      },
    },
  }
</script>

