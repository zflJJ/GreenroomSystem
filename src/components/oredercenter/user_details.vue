<template>
  <div class="estate">
    <h2 class="h2Style">用户详情    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <el-button type="primary" @click="gotoAfter" size="mini">返回上一级</el-button></h2>
    <!--1.0 图表布局-->
    <div>
      <ul class="ulStyle">
        <li>
          <div class="indivStyle">
            <h4>基本信息</h4>
            <ul class="listStyle">
              <!--回去查一下资料在处理-->
              <li>
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">用户ID</span></el-tag>&nbsp;<span>{{parkData.id}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">手机号码</span></el-tag>&nbsp;<span>{{parkData.phone || '暂无'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">注册时间</span></el-tag>&nbsp;<span>{{parkData.signinTime | moment('YYYY年MM月DD日 HH时mm分ss秒')}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">最后登录时间</span></el-tag>&nbsp;<span>{{parkData.activeTime | moment('YYYY年MM月DD日 HH时mm分ss秒')}}</span>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="indivStyle">
            <!--账户余额    车牌号码    用户类型     标签-->
            <h4>其他信息</h4>
            <ul class="listStyle">
              <li>
                <!--<span class="listSpan bg-primary">账户余额</span>&nbsp;<span>￥{{parkData.balance || 0}}元</span>-->
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">账户余额</span></el-tag>&nbsp;<span>￥{{parkData.balance || 0}}元</span>
              </li>
              <li class="item">
                <!--<span class="listSpan bg-primary">车牌号码</span>&nbsp;<span>{{plate}}</span>-->
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">车牌号码</span></el-tag>&nbsp;<span>{{plate}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">用户类型</span></el-tag>&nbsp;
                <!--<span class="listSpan bg-primary">用户类型</span>&nbsp;-->
                <span v-if="parkData.type ===  0">默认</span>
                <span v-else-if="parkData.type ===  1">业主</span>
                <span v-else-if="parkData.type ===  0">停车场管理员</span>
                <span v-else>状态未知</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  ul {
    list-style: none;
  }

  .cols4 {
    text-align: center;
    height: 40px;
  }

  .ulStyle {
    display: flex;
    justify-content: space-between;
    height: 350px;
    list-style: none;
  }

  .ulStyle > li {
    height: 100%;
    width: 48.5%;
    border: 1px solid rgba(34, 36, 38, 0.15);
    padding: 14px;
    box-sizing: border-box;
  }

  .indivStyle {
    width: 100%;
    height: 100%;
    padding: 14px;
    background: #f8f8f9;
    border: 1px solid #cecfcf;
    box-sizing: border-box;
  }

  .listStyle > li {
    /*padding-top: 8px;*/
    line-height: 36px;
    min-height: 36px;
  }

  .item {
    border-top: 1px solid rgba(34, 36, 38, .15);
    margin-bottom: 0px;
  }

  .listSpan {
    padding: 3px 9px;
  }

  h4 {
    font-weight: 700;
  }

  .iconStyle {
    margin-top: 5px;
    padding-left: 5px;
  }

  .iconStyle > i {
    font-size: 14px;
  }

  .iconStyle span {
    font-size: 18px;
    color: rgba(0, 0, 0, 0.87);
    /*font-weight: 700;*/
  }

  .textStyle {
    display: inline-block;
    margin-left: 5px;
  }

  .ratioStyle {
    margin: 0 8px;
  }


</style>

<script>
  import Qs from 'qs';
  import  paingchild from '@/components/commonpage/paingchild';
  import  selectchild from '@/components/commonpage/selectchild';
  export default {
    data(){
      return {
        parkData: {},
        plate: '',
        tag: '',
        tableList: [],
        tablelen: 1,
        userId:'',
        parentId: this.$route.query.userId,
      }
    },
    created(){
      this.getContact();
    },
    methods: {
      // 1. 先获取到用户的ID, 在通过ID在获取到 用户的车牌号码   在通过ID获取到用户的标签类型即可
      // 请求图文的数据，需要对电量进行处理
      //      用户ID   手机号码   注册时间    最后 登录时间   账户余额    车牌号码    用户类型     标签
      getContact(){
        var datas = {phone:this.$route.query.phoneId};
        var data =  Qs.stringify(datas);
        this.$http.post('user/query',data).then((res)=>{
          if(res.data.errcode == 1){
            this.parkData = res.data.data.user;
            this.userId = res.data.data.user.id;
            // 调用车牌号接口
            this.getPlate();
            // 调用标签接口（现在先去掉了）
//            this.getTag();
          }
        }).catch((err)=>{
          console.log(err);
        })
      },
      // 获取车牌号信息
      getPlate(){
        this.$http.get('user/' + this.userId + '/plate').then((res) => {
          var paramsData = res.data.data.plateList, plate = '';
          if (res.data.errcode == 1) {
            if (paramsData.length == 0) {
              plate = '暂无';
            } else if (paramsData.length > 0) {
              for (var j = 0; j < paramsData.length; j++) {
                if(paramsData[j].state != 9){
                  plate += paramsData[j].number + ' ';
                }
              }
            }
            this.plate = plate;
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      // 获取用户的标签类型
      getTag(){
        this.$http.get('user/' + this.userId + '/tag').then((res) => {
          var paramsData = res.data.data.tagList, tag = '';
          console.log(res);
          if (res.data.errcode == 1) {
            if (paramsData.length == 0) {
              tag = '暂无';
            } else if (paramsData.length > 0) {
              for (var i = 0; i < paramsData.length; i++) {
               tag += paramsData[i].name + ' ';
              }
            }
            console.log(tag);
            this.tag = tag;
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      // 返回上一页
      gotoAfter(){
        this.$router.go(-1);
      }
    },
  }
</script>

