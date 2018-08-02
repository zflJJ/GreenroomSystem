<template>
  <div>
    <div class=center>
      <form method="POST" id="videoForm" enctype="multipart/form-data"
            :action="formUrl">
        <p><span class=red>*</span> 页面类型 : 广告页</p>
        <br>
        <p><span class=red>*</span>适应手机 :
          <template>
            <el-radio v-model="phoneType" label="0" @change="AndroidRadio">Android</el-radio>
            <el-radio v-model="phoneType" label="1" @change="IOSRadio">IOS</el-radio>
          </template>
        </p>
        <br>
        <p><span class=red>*</span>屏幕尺寸 : 1080</p>
        <br>
        <p><span class=red>*</span>倒计时：
          <template>
            <el-select v-model="countdown" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </p>
        <br>
        <p><span class=red>*</span>可跳过：
          <template>
            <el-select v-model="jumpable" clearable placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </p>
        <br>
        <p><span class=red>*</span>上传广告页
          <input type='file' @change="changeImg" ref="imgFileData">
        </p>
        <br>
        <img :src="imgSrc" ref="img">
        <br>
        <br>
        <br>
        <br>
        点击跳转链接：
        <el-input v-model="href" placeholder="请输入内容"></el-input>
        <br>
        <br>
        <el-button type="primary" size="small" @click="submit()">提交</el-button>
        <el-button type="danger" size="small" @click='removeImg'>删除</el-button>
      </form>
      <div>
      </div>
    </div>
  </div>
</template>

<style>

  .center {
    font-size: 16px;
  }

  .red {
    color: red;
  }

  img {
    /*width: 1080px;*/
    /*height: 1920px;*/
    border: 1px solid #000000;
  }
</style>

<script>
  import Qs from 'qs';

  export default {
    data () {
      return {
        formUrl: "",
        phoneType: '0',
        href: '',
        options: [{
          value: '2',
          label: '2秒'
        }, {
          value: '3',
          label: '3秒'
        }, {
          value: '5',
          label: '5秒'
        }],
        countdown: '',
        options1: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        jumpable: '',
        imgSrc: "",//
        elInput: null,
        imgFile: '',//上传文件
        imgFileName: '',//上传文件名称
        file: '',
        imgAndroidId: '',//广告页对象ID
        fileAndroidId:'',//图片Id
        imgIOSId: '',//广告页对象ID
        fileIOSId:'',//图片Id
//        flag: false,
      };
    },
    methods: {
      //图片改变
      changeImg(e){
        if (!/(.JPG|.jpg|.png|.PNG)$/.test(e.target.value)) {
          this.$message.error('错了哦，格式必须是.jpg或者.png');
          return false;
        }
//        this.flag = true;
        this.file = event.target.files[0];
        const refs = this.$refs
        const elInput = refs.imgFileData
        const elImg = refs.img
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
        }
      },
      //删除图片
      removeImg(){
        var data = {}
        if(this.imgAndroidId){
          data.id = this.imgAndroidId;
          data.fileId = this.fileAndroidId;
        }else if(this.imgIOSId){
          data.id = this.imgIOSId;
          data.fileId = this.fileIOSId;
        }
        if(!this.fileAndroidId && !this.fileIOSId){
          this.countdown = "";
          this.jumpable = "";
          this.href = "";
          this.src = "";
          this.imgSrc = "";
          this.imgAndroidId = "";
          this.fileAndroidId = "";
          this.imgIOSId = "";
          this.fileIOSId = "";
          return false;
        }
        if(!this.imgSrc){
          this.$message.error('错了哦，当前没有图片可以删除');
          return false;
        }
        this.$http.post("advert/delete",data).then(res => {
          if(res.data.error_code == 2000){
            console.log(res)
            this.countdown = "";
            this.jumpable = "";
            this.href = "";
            this.src = "";
            this.imgSrc = "";
            this.$message({
              message: '恭喜你，成功删除广告页信息',
              type: 'success'
            });
          }else {
            this.$message.error(res.data.error_message)
          }
        })
      },
      //上传
      submit(){
        var formData = new FormData();
        var phoneType = this.phoneType;//适配的手机类型 0：安卓 1：iOS
        var countdown = this.countdown;//倒计时
        var jumpable = this.jumpable;//是否可跳过
        var href = this.href;//跳转链接

        if (countdown == '') {
          this.$message.error('错了哦，倒计时必须填写');
          return false;
        } else if (jumpable == "") {
          this.$message.error('错了哦，是否跳过必须填写');
          return false;
        }
//        console.log(this.$refs.imgFileData.files[0])
        try {
          formData.append('file', this.$refs.imgFileData.files[0]);
          var imgFileName = this.$refs.imgFileData.files[0].name;
        } catch (e) {
//          this.$message.error('错了哦，图片必须上传,如果有图片请先删除图片重新上传');
//          return false;
        }
        if (this.countdown == '2秒') {
          this.countdown = '2'
        } else if (this.countdown == '3秒') {
          this.countdown = '3'
        } else if (this.countdown == '5秒') {
          this.countdown = '5'
        }
        if (this.jumpable == "是") {
          this.jumpable = "1"
        } else if (this.jumpable == "否") {
          this.jumpable = "0"
        }
        formData.append('phoneType', this.phoneType);
        formData.append('countdown', this.countdown);
        formData.append('jumpable', this.jumpable);
        formData.append('href', this.href);
        if(this.fileAndroidId){
          formData.append('id', this.imgAndroidId);
          formData.append('fileId', this.fileAndroidId);
        }else if(this.fileIOSId){
          formData.append('id', this.imgIOSId);
          formData.append('fileId', this.fileIOSId);
        }
//        console.log(this.imgIOSId)
//        console.log(this.fileIOSId)
//        console.log(this.imgAndroidId)
//        console.log(this.fileAndroidId)
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.$http.post('advert/saveOrUpdate', formData, config).then(res => {//file  文件
          if(res.data.error_code == 2000){
              console.log(res)
            this.$message({
              message: '恭喜你，广告页信息上传成功',
              type: 'success'
            });
            if(this.phoneType == 0){
              this.imgAndroidId = res.data.data.id;
              this.fileAndroidId = res.data.data.fileId;
            }else {
              this.imgIOSId = res.data.id;
              this.fileIOSId = res.data.fileId;
            }
          }else {
            this.$message.error('错了哦，' + res.data.error_message);
          }
        }).catch(err => {
          this.$message.error('错了哦，' + err.data.error_message);
        })
      },
      //单选框发生改变
      AndroidRadio(){
        this.$http.get("advert/query?phoneType=0").then(res => {
          try {
            var data = res.data.data;
            if (data.countdown == 2) {
              this.countdown = "2秒"
            } else if (data.countdown == 3) {
              this.countdown = "3秒"
            } else if (data.countdown == 5) {
              this.countdown = "5秒"
            }
            if (data.jumpable == 0) {
              this.jumpable = "否"
            } else if (data.jumpable == 1) {
              this.jumpable = "是"
            }
            this.href = data.href;
            this.imgAndroidId = data.id;
            this.fileAndroidId = data.fileId;
            this.imgSrc = res.data.data.filePath;
            this.imgAndroidId = '';
            this.fileAndroidId = '';
            this.imgIOSId = "";
            this.fileIOSId = "";
          } catch (e) {
            this.imgAndroidId = '';
            this.fileAndroidId = '';
            this.imgIOSId = "";
            this.fileIOSId = "";
            this.imgSrc = "";
            this.countdown = "";
            this.jumpable = "";
            this.href = "";
          }
        }).catch(err => {
          this.imgAndroidId = '';
          this.fileAndroidId = '';
          this.imgSrc = "";
          this.countdown = "";
          this.jumpable = "";
          this.href = "";
        })
      },
      IOSRadio(){
        this.$http.get("advert/query?phoneType=1").then(res => {
          try {
            var data = res.data.data;
            if (data.countdown == 2) {
              this.countdown = "2秒"
            } else if (data.countdown == 3) {
              this.countdown = "3秒"
            } else if (data.countdown == 5) {
              this.countdown = "5秒"
            }
            if (data.jumpable == 0) {
              this.jumpable = "否"
            } else if (data.jumpable == 1) {
              this.jumpable = "是"
            }
            this.href = data.href;
            this.imgIOSId = data.id;
            this.fileIOSId = data.fileId;
            this.imgSrc = res.data.data.filePath;
            console.log(res.data.data.filePath)
            this.imgAndroidId = '';
            this.fileAndroidId = '';
          } catch (e) {
            this.imgAndroidId = '';
            this.fileAndroidId = '';
            this.imgIOSId = "";
            this.fileIOSId = "";
            this.imgSrc = "";
            this.countdown = "";
            this.jumpable = "";
            this.href = "";
          }
        }).catch(err => {
          this.imgAndroidId = '';
          this.fileAndroidId = '';
          this.imgIOSId = "";
          this.fileIOSId = "";
          this.imgSrc = "";
          this.countdown = "";
          this.jumpable = "";
          this.href = "";
        })
      }
    },
    mounted(){
      var data = {url: "advert/query"};
      data = Qs.stringify(data);
      this.$http.post("auth/check",data).then(res => {
        console.log(res)
      });

      this.$http.get("advert/query?phoneType=0").then(res => {
        console.log(res)
        try {
          var data = res.data.data;
          if (data.countdown == 2) {
            this.countdown = "2秒"
          } else if (data.countdown == 3) {
            this.countdown = "3秒"
          } else if (data.countdown == 5) {
            this.countdown = "5秒"
          }
          if (data.jumpable == 0) {
            this.jumpable = "否"
          } else if (data.jumpable == 1) {
            this.jumpable = "是"
          }
          this.href = data.href;
          this.imgAndroidId = data.id;
          this.fileAndroidId = data.fileId;
          this.imgSrc = res.data.data.filePath;
          this.imgIOSId = "";
          this.fileIOSId = "";
        } catch (e) {
          this.imgSrc = "";
          this.countdown = "";
          this.jumpable = "";
          this.href = "";
          this.imgAndroidId = '';
          this.fileAndroidId = '';
          this.imgIOSId = "";
          this.fileIOSId = "";
        }
      }).catch(err => {
        this.imgAndroidId = '';
        this.fileAndroidId = '';
        this.imgIOSId = "";
        this.fileIOSId = "";
        this.imgSrc = "";
        this.countdown = "";
        this.jumpable = "";
        this.href = "";
      })
    }
  }
</script>
