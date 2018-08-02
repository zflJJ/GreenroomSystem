<template>
  <div>
    <h2>版本提交1.2</h2>
    <form v-loading="loading">
      <template>
        选择版本
        <el-radio v-model="type" label="0" @change="changeType">Android</el-radio>
        <el-radio v-model="type" label="1" @change="changeType">IOS</el-radio>
      </template>
      <br>
      <br>
      <template>
        是否强制更新
        <el-radio v-if="type==0" v-model="coerce" label="0">否</el-radio>
        <el-radio v-model="coerce" label="1">是</el-radio>
      </template>
      <br>
      <br>
      请输入版本号
      <el-input v-model="vcode" placeholder="请输入内容"></el-input>
      <br>
      <br>
      请输入版本说明 （请勿超过72个字数）
      <el-input type="textarea" v-model="updateinfo" :maxlength=72></el-input>
      <br>
      <br>
      <div>
        文件上传：(文件名必须app-release.apk,IOS不用上传文件)
        <br>
        <br>
        <input ref="fileUploadVersion" type="file" name="filename" @change="fileChange($event)">
      </div>
      <br>
      <el-button type="primary" :loading="loadingFlag" @click="submitfile($event)">提交</el-button>
    </form>
    <br>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="progress" status="success"></el-progress>
  </div>
</template>

<style>

</style>

<script>
  import Qs from 'qs';

  export default {
    data () {
      return {
        type: '0',//选择版本
        coerce: '0',//是否强制更新
        vcode: '',//版本号
        updateinfo: '',//版本说明
        fileUploadVersion: '',//上传的文件
        flag: false,
        forceupdate: '',//强制升级的版本号
        index: 0,
        progress: 0,
        loadingFlag: false,
        loading: false,
      }
    },
    methods: {
      //单选框改变
      changeType(val){
        if(val == 1){
          this.coerce = "1";
        }else {
          this.coerce ="0";
        }
      },
      submitfile($event){
        if (this.type == 1 && this.index == 1) {
          this.$confirm('错了哦，IOS不用上传安装包, 是否删除Android安装包,继续IOS强制升级?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then((res) => {
            this.$refs.fileUploadVersion.value = '';
            this.index = 0;
            this.flag = true;
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          return false;
        }
        if (this.type == 1) {
          this.flag = true;
        }
        if (!this.flag) {
          this.$message.error('错了哦，Android文件名必须是app-release.apk');
          return false;
        } else if (this.vcode == '') {
          this.$message.error('错了哦，版本号必须填写');
          return false;
        } else if (this.updateinfo == '') {
          this.$message.error('错了哦，版本说明必须填写');
          return false;
        } else if (this.getStrLeng(this.updateinfo) > 216) {
          this.$message.error('错了哦，版本说明不能多于72个汉字的长度');
          return false;
        } else if (!this.fileUploadVersion && this.type == 0) {
          this.$message.error('错了哦，没有上传安装包');
          return false;
        }
        if (this.coerce == 1) {
          this.forceupdate = this.vcode;
        }
        event.preventDefault();
        let formData = new FormData();
        formData.append('file', this.fileUploadVersion);
        formData.append('name', this.fileUploadVersion.name);
        if (this.type == 1) {
          this.submitIOS();
          return false;
        }
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        var data = {
          "vcode": this.vcode,
          "updateinfo": this.updateinfo,
          "type": this.type,
          "forceupdate": this.forceupdate
        }
        data = Qs.stringify(data);
        var _this = this;
        this.loading = true;
        var timer = setInterval(function () {
          _this.progress += 2;
          if (_this.progress > 90) {
            clearInterval(timer);
          }
        }, 1000)
        this.loadingFlag = true;
        this.$http.post('/update/upload', formData, config).then(function (res) {
          clearInterval(timer);
          if (res.data.error_code == 2000) {
            _this.$http.post("/update/save", data).then(res => {
              console.log(res)
              _this.progress = 100;
              _this.cleardata();
            }).catch(err => {
              console.log(err)
            })
          } else {
            this.loadingFlag = false;
            _this.$message.error('错了哦，上传失败,返回了errcode : 0');
          }
        }).catch(err => {
          clearInterval(timer);
          console.log(err)
          this.loadingFlag = false;
          this.$message.error('错了哦，上传失败,进入了catch');
        })
      },
      //上传IOS
      submitIOS(){
        var data = {
          "vcode": this.vcode,
          "updateinfo": this.updateinfo,
          "type": this.type,
        }
        if (this.coerce == 1) {
          data.forceupdate = this.forceupdate;
        }
        data = Qs.stringify(data);
        var _this = this;
        this.loadingFlag = true;
        this.$http.post("/update/save", data).then(res => {
          if (res.data.error_code == 2000) {
            this.progress = 100;
            this.cleardata();
          } else {
            this.loadingFlag = false;
            this.$message.error('错了哦，上传失败');
          }
        }).catch(err => {
          this.loadingFlag = false;
          this.$message.error('错了哦，上传失败');
        })
        return false;
      },
      //文件改变
      fileChange($event){
        var val = event.currentTarget;
        var imgSrc = val.value;
        this.index = 1;

        if (!/(app-release.apk)$/.test(imgSrc) && this.type == 0) {
          this.$message.error('错了哦，Android文件名必须是app-release.apk');
          this.flag = false;
          this.index = 1;
          return false;
        } else if (this.type == 1) {
          this.$message.error('错了哦，IOS不用上传安装包');
          this.flag = false;
          this.index = 1;
          return false;
        } else {
//          this.index = 1;
          this.flag = true;
          this.fileUploadVersion = event.target.files[0];
        }
      },
      //上传成功后,清除数据
      cleardata(){
        this.$message({
          message: '恭喜你，强制更新已上传成功',
          type: 'success'
        });
//        this.type = "1";
        this.coerce = "0";
        this.vcode = '';
        this.updateinfo = '';
        this.$refs.fileUploadVersion.value = '';
        this.index = 0;
        this.flag = false;
        this.progress = 0;
        this.loadingFlag = false;
        this.loading = false;
      },
      // 获取汉字长度
      getStrLeng(str) {
        var realLength = 0;
        var len = str.length;
        var charCode = -1;
        for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
          } else {
            // 如果是中文则长度加3
            realLength += 3;
          }
        }
        return realLength;
      },
    },
    mounted(){
      var data = {url: "update/save"};
      data = Qs.stringify(data);
      this.$http.post("auth/check",data).then(res => {
        console.log(res)
      })
    },
  }
</script>
