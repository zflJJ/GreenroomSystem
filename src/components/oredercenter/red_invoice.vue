<template>
  <div>
    <h2>发票冲红</h2>
    <br>
    <div>{{num}}</div>
    <el-form ref="form" :model="form" label-width="250px">
      <el-form-item label="请输入发票工单ID">
        <el-input v-model="form.applyId"></el-input>
      </el-form-item>
      <el-form-item label="请输入冲红原因(不能多于200个字符)">
        <el-input v-model="form.redReason"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>

</style>

<script>
  import Qs from 'qs';
  export default {
    data() {
      return {
        num: '',
        form: {
          applyId: '',
          redReason: '',
        },
      }
    },
    methods: {
      onSubmit() {
        var reg = /^\+?[0-9][0-9]*$/;
        if (!reg.test(this.form.applyId)) {
          this.$message.error('错了哦，发票ID只能是数字');
        }else if (this.form.redReason.length > 200 || this.form.redReason.length <= 0) {
          this.$message.error('错了哦，冲红原因不能少于1个字符并且不能多于200个字符');
        } else {
          var data = Qs.stringify(this.form)
          this.$http.post('/invoice/redInvoice', data).then(res => {
            console.log(res)
            console.log(res.data.error_code)
            if (res.data.error_code == 2000) {
              console.log(11111111111)
              this.$message({
                message: '恭喜你，开具红字发票成功,正在下载,请稍后',
                type: 'success'
              });
              var href = res.data.data;
              setTimeout(function () {
                window.location.href = href
              }, 2000)

              this.getLeft();
              this.form.applyId = '';
              this.form.redReason = '';
            }else{
              this.$message.error(res.data.error_message)
            }
          }).catch(err => {
            this.$message.error('错了哦，冲红失败');
          })
        }
      },
      resetForm() {
        this.form.applyId = '';
        this.form.redReason = '';
      },
      getLeft(){
        this.num = "正在获取,请稍后"
        this.$http.post("/invoice/left").then(res => {
          console.log(res)
          if(res.data.error_code == 2000 && res.data.data != ""){
            this.num = "剩余发票数" + res.data.data + "张";
          }else {
            this.num = "正在获取,请稍后"
          }
        }).catch(e =>{
          this.num = "正在获取,请稍后"
        })
      }
    },
    mounted() {
        this.getLeft();
    }
  }
</script>
