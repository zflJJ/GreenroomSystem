<template>
  <div>
    <h2>{{title}}</h2>
    <br>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="*奖品名称">
            <el-input v-model.trim="form.name" :maxlength=20 :disabled="prizeDetailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="优惠券" :disabled="prizeDetailDisabled">
              <el-option label="优惠券" value="1"></el-option>
              <el-option label="现金" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="*金额" :disabled="prizeDetailDisabled">
            <el-input v-model.trim="form.money" :maxlength=3 :disabled="prizeDetailDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="奖品描述">
            <el-input :disabled="prizeDetailDisabled" :maxlength=100 type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="form.intro">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="*图标">
            <input type='file' @change="handleChange1" ref="upload1" :disabled="prizeDetailDisabled">
          </el-form-item>
        </el-col>
        <el-col :span="4">
          图片规定2M以内，支持PNG/JPG/GIF,上传首选PNG
        </el-col>
        <el-col :span="5">
          <img :src="imgSrc1" class="imgclass">
        </el-col>
        <el-col :span="4">
          <el-button type="danger" size="small" @click='removeImg1' :disabled="prizeDetailDisabled">删除图片</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="*有效期">
          <div>
            <el-select v-model="form.timeType" :disabled="prizeDetailDisabled">
              <el-option label="永久有效" value="1"></el-option>
              <el-option label="自定义" value="2"></el-option>
            </el-select>
            <el-date-picker :disabled="prizeDetailDisabled" v-if="form.timeType==2||form.timeType=='自定义'" v-model="value6" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-row>
      <br>
      <el-form-item>
        <el-button @click="returnGo">返回</el-button>
        <el-button type="primary" @click="verify" :disabled="prizeDetailDisabled">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
.imgclass {
  width: 100px;
  height: 100px;
}
</style>

<script>
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
import Qs from 'qs';
export default {
  data() {
    return {
      title: this.$route.query.title,
      form: {
        name: '',
        intro: '',
        money: "",
        beginTime: '',
        endTime: '',
        href: '',
        type: '1',
        timeType: '1',
      },
      imgSrc1: '',
      imgFlag: '',
      value6: [],
      prizeDetailDisabled: this.$route.query.title == "添加奖品" ? false : true
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //获得数据
    getData() {
      if (!this.$route.query.id) return false;
      var datas = {
        id: this.$route.query.id
      };
      datas = Qs.stringify(datas);
      this.$http.post("activity/prize/detail", datas).then(res => {
        if (res.data.error_code == 2000) {
          this.form.name = res.data.data.name;
          this.form.money = res.data.data.money;
          this.form.intro = res.data.data.intro;
          this.imgSrc1 = res.data.data.filePath;
          this.form.type = res.data.data.typeStr;
          if (res.data.data.type == 1) {
            this.form.type = "优惠券";
          } else {
            this.form.type = "现金";
          }
          if (!res.data.data.startTime && !res.data.data.endTime) {
            this.form.timeType = "永久有效"
          } else {
            this.form.timeType = "自定义";
            this.value6 = [res.data.data.startTime, res.data.data.endTime]
            //                [new Date().setHours(0, 0, 0, 0) - 604800000, new Date().setHours(23, 59, 59, 59) - 86400000],
          }
        } else {
          this.$message.error(res.data.error_message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    //校验数据
    verify() {
      var regName = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      var regNumber = /^([1-9][0-9]*|-[1-9][0-9]*)$/;
      if (!this.form.name || !this.form.money || !this.$refs.upload1.files[0]) {
        this.$message.error("请填入所有必填项")
      } else if (!regName.test(this.form.name)) {
        this.$message.error("奖品名称输入错误,仅限输入中文、英文字母、数字")
      } else if (this.form.money == 0 || !regNumber.test(this.form.money)) {
        this.$message.error("请填入正确金额")
      } else if (this.form.intro && !regName.test(this.form.intro)) {
        this.$message.error("奖品描述输入错误,仅限输入中文、英文字母、数字")
      } else {
        this.onSubmit();
      }
    },
    //提交数据
    onSubmit() {
      var formData = new FormData();
      formData.append("name", this.form.name)//奖品名称
      formData.append("type", this.form.type)//类型
      formData.append("money", this.form.money)//金额
      if (this.form.intro) formData.append("intro", this.form.intro);//描述
      if (this.form.timeType == 2) {
        formData.append("startTime", this.value6[0].getTime())
        formData.append("endTime", this.value6[1].getTime())
      } else {
        formData.append("startTime", "")
        formData.append("endTime", "")
      }
      formData.append("files", this.$refs.upload1.files[0])
      this.$http.post("activity/prize/saveOrUpdate", formData).then(res => {
        if (res.data.error_code == 2000) {
          this.$message.success("成功提交奖品");
          this.$router.push({ path: "prizeManagement" })
        } else {
          this.$message.error(res.data.error_message)
        }
      }).catch(err => {
        this.$message.error(err)
      })
    },
    handleChange1(e) {
      const elInput = this.$refs.upload1
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc1 = src;
        };
        if (elInput.files && elInput.files[0]) {
          this.imgSrc1Id = 0;
          reader.readAsDataURL(elInput.files[0]);
        }
      } else {
        elInput.value = null;
        return;
      }
    },
    removeImg1() {
      this.imgSrc1 = "";
      this.$refs.upload1.value = '';
    },
    isImagUp(item) {
      let maxSize = 2 * 1024 * 1024;
      let imgType = 'PNG,JPG,GIF';
      let size = item.size;
      let type = item.name.split('.')[1].toUpperCase();
      let num = imgType.indexOf(type);
      console.log(num, type, size, imgType, maxSize);
      if (num == -1) {
        this.$message.error('图片的类型必须是PNG/JPG/GIF格式');
        return false;
      } else if (size > maxSize) {
        this.$message.error('图片的大小要小于2M');
        return false;
      } else {
        return true;
      }
    },
    returnGo() {
      this.$router.go(-1)
    }
  },
}
</script>
