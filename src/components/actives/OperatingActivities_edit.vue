<template>
  <div>
    <h2>编辑活动</h2>
    <br>
    <el-form ref="form" :model="form" label-width="80px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="*活动名称">
            <el-input v-model="form.name" :maxlength=20></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="*活动状态">
            <el-select v-model="form.state" placeholder="进行中">
              <el-option label="进行中" value="1"></el-option>
              <el-option label="已过期" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="*活动类型">
            <el-select v-model="form.type" placeholder="邀请" disabled>
              <el-option label="邀请" value="1"></el-option>
              <el-option label="被邀请" value="2"></el-option>
              <el-option label="停车" value="3"></el-option>
              <el-option label="支付" value="4"></el-option>
              <el-option label="抽奖" value="5"></el-option>
              <el-option label="登录" value="6"></el-option>
              <el-option label="注册" value="7"></el-option>
              <el-option label="好友下单" value="8"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动描述">
            <el-input
              :maxlength=100
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="form.intro">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="Banner(长图)" class='myUpload'>
            <input type='file' @change="handleChange1" ref="upload1">
          </el-form-item>
        </el-col>
        <el-col :span="4">
          图片规定2M以内，支持PNG/JPG/GIF,上传首选PNG
        </el-col>
        <el-col :span="5">
          <img :src="imgSrc1">
        </el-col>
        <el-col :span="4">
          <el-button type="danger" size="small" @click='removeImg1'>删除图片</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="Banner(宽图)" class='myUpload'>
            <input type='file' @change="handleChange2" ref="upload2">
          </el-form-item>
        </el-col>
        <el-col :span="4">
          图片规定2M以内，支持PNG/JPG/GIF,上传首选PNG
        </el-col>
        <el-col :span="5">
          <img :src="imgSrc2">
        </el-col>
        <el-col :span="4">
          <el-button type="danger" size="small" @click='removeImg2'>删除图片</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动链接">
            <el-input v-model="form.href"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <template>
        <div class="block">
          <span class="demonstration">活动开始结束时间 </span>
          <el-date-picker
            v-model="value6"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </template>
      <br>
      <el-form-item>
        <el-button @click="returnGo">返回</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  img {
    max-width: 100%;
    height: 100px;
    margin: 10px 20px;
  }

  .img_list .img-div {
    width: 100px;
    height: 200px;
    float: left;
    overflow: hidden;
    text-align: center;
  }

  .upload {
    position: relative;
  }

  .upload input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 10px;
    height: 100px;
    width: 100px;
  }

  .upload .upload_box {
    width: 100px;
    height: 100px;
    background-color: #beeaff;
    color: #000000;
  }

  .img-div p {
    color: #28a4b0;
    margin: 0;
  }
</style>

<script>
  import Qs from 'qs';
  export default {
    data() {
      return {
        form: {
          name: '',
          type: '1',
          intro: '',
          beginTime: '',
          endTime: '',
          href: '',
          state: '1',
          id: '',
          fileLongId: '',
          fileWideId: '',
        },
        imgSrc1: '',
        imgSrc2: '',
        imgFlag: '',
        value6:[],
      }
    },
    created(){
      this.getData();
    },
    methods: {
      getData(){
        this.$http("activity/detail?id=" + this.$route.query.activitesId).then(res => {
          console.log(res)
          if (res.data.error_code == 2000) {
            this.form.id = res.data.data.id;
            this.form.name = res.data.data.name;
            this.form.href = res.data.data.href;
            this.form.intro = res.data.data.intro;
            this.form.fileLongId = res.data.data.fileLongId;
            this.form.fileWideId = res.data.data.fileWideId;
            this.imgSrc1 = res.data.data.fileLongPath;
            this.imgSrc2 = res.data.data.fileWidePath;
            this.value6 = [new Date(res.data.data.beginTime),new Date(res.data.data.endTime)];
            if (res.data.data.state == 1) {
              this.form.state = "进行中";
            } else {
              this.form.state = "已过期";
            }
          }
        })
      },
      //提交
      onSubmit() {
        if (this.form.name == "") {
          this.$message.error('错了哦，活动名称不能为空');
        } else if (this.form.type == "") {
          this.$message.error('错了哦，活动类型不能为空');
        } else if(!this.value6){
          this.$message.error('错了哦，活动时间不能为空');
        } else if (this.imgSrc1 == "" || this.imgSrc2 == "") {
          this.$message.error('错了哦，图片必须上传两张');
        } else {
          var formData = new FormData();
          formData.append("name", this.form.name)
          formData.append("type", this.form.type)
          formData.append("id", this.form.id)
          if (this.form.intro) formData.append("intro", this.form.intro);
          if (this.form.href) formData.append("href", this.form.href);
          formData.append("fileLongId", this.form.fileLongId)
          formData.append("fileWideId", this.form.fileWideId)
          formData.append("beginTime", this.value6[0].getTime())
          formData.append("endTime", this.value6[1].getTime())
          if (this.$refs.upload1.files[0] && this.form.fileWideId) {
            if (this.imgSrc1) formData.append("fileLong", this.$refs.upload1.files[0])
            if (this.imgSrc2) formData.append("fileWide", this.$refs.upload2.files[0])
          }
          console.log(this.form.state)
          if (this.form.state == "进行中" || this.form.state == 1) {
            formData.append("state", 1)
          } else {
            formData.append("state", 0)
          }
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          this.$http.post("activity/saveOrUpdate", formData, config).then(res => {
            if (res.data.error_code == 2000) {
              this.$message.success('恭喜你，编辑活动成功');
              this.$router.go(-1)
            } else if (res.data.error_code == 2004) {
              this.$message.error('错了哦，上传文件过大');
            } else {
              this.$message.error('错了哦，编辑活动失败');
            }
          })
        }
      },
      handleChange1(e){
        const elInput = this.$refs.upload1
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc1 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          var type = elInput.files[0].type;
          if (type != "image/jpeg" && type != "image/png" && type != "image/png") {
            this.$message.error('错了哦，仅支持PNG/JPG/GIF');
            this.imgFlag = false;
          } else {
            this.imgFlag = true;
          }
        }
      },
      removeImg1(){
        this.imgSrc1 = "";
        this.$refs.upload1.value = '';
      },
      handleChange2(e){
        const elInput = this.$refs.upload2
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc2 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          var type = elInput.files[0].type;
          if (type != "image/jpeg" && type != "image/png" && type != "image/gif") {
            this.$message.error('错了哦，仅支持PNG/JPG/GIF');
            this.imgFlag = false;
          } else {
            this.imgFlag = true;
          }
        }
      },
      removeImg2(){
        this.imgSrc2 = "";
        this.$refs.upload2.value = '';
      },
      returnGo(){
        this.$router.go(-1)
      }
    }
  }
</script>