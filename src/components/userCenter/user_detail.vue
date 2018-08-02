<template>
  <div class="estate">
    <h2>用户详情</h2>
    <!--{{this.$route.query.parkingListId}}-->
    <!--1.0 图表布局-->
    <div>
      <ul class="ulStyle">
        <li>
          <div class="indivStyle">
            <h4>基本信息</h4>
            <ul class="listStyle">
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">用户ID</span></el-tag>&nbsp;<span>{{parkData.id}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">手机号</span></el-tag>&nbsp;<span>{{parkData.phone || '-'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">姓名</span></el-tag>&nbsp;<span>{{parkData.name || '-'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">身份证</span></el-tag>&nbsp;<span>{{parkData.identityNumber || '-'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">注册时间</span></el-tag>&nbsp;
                <span v-if="parkData.signinTime == ''">-</span>
                <span v-else>{{parkData.registerTime | moment('YYYY年MM月DD日')}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">余额</span></el-tag>&nbsp;<span>￥{{parkData.balanceEarn || 0}}元</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">车牌号</span></el-tag>&nbsp;<span>{{parkData.plateNumber || '-'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">有效订单数</span></el-tag>&nbsp;<span>{{parkData.orderCount || 0}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">首单时间</span></el-tag>&nbsp;
                <span v-if="parkData.orderCreateTime">{{parkData.orderCreateTime | moment}}</span>
                <span v-else-if="!parkData.orderCreateTime">-</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <br>
    <h2>车位信息</h2>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>
    <br>
    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="parklotName"
          label="小区名称">
        </el-table-column>
        <el-table-column
          prop="parklotType"
          label="小区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.parklotType==1&&scope.row.innershareStr=='内部共享'">约车场内部共享</span>
            <span v-else-if="scope.row.parklotType==2&&scope.row.innershareStr=='内部共享'">约车位内部共享</span>
            <span v-else-if="scope.row.parklotType==2">约车位</span>
            <span v-else-if="scope.row.parklotType==1">约车场</span>
            <span v-else-if="scope.row.parklotType==0">车位查询</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="车位编号">
        </el-table-column>
        <el-table-column
          prop="lockNumber"
          label="蓝牙名称">
        </el-table-column>
        <el-table-column
          width="200px"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewDetails(scope.row.id)">详情</el-button>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>

    <!--车位详情的发布信息-->
    <el-dialog title="发布时段" :visible.sync="dialogTableVisible">
      <!--4.0 表格信息-->
      <template>
        <el-table
          style="width: 100%"
          :data="tableDatasDialog"
          border>
          <!--<el-table-column-->
            <!--prop="id"-->
            <!--label="ID">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="startTime"
            label="开始时间">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结束时间">
          </el-table-column>
          <el-table-column
            prop="dayOfWeeks"
            label="自动发布">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state == 1101">未被预约</span>
              <span v-else-if="scope.row.state == 1102">已被预约</span>
            </template>
          </el-table-column>
        </el-table>
      </template>

    </el-dialog>
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
    height: 480px;
    /*border: 1px solid #0c91e5;*/
    list-style: none;
  }

  .ulStyle > li {
    height: 100%;
    width: 100%;
    border: 1px solid rgba(34, 36, 38, 0.15);
    padding: 14px;
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
    /*min-height: 36px;*/
    line-height: 36px;
  }

  .item {
    border-top: 1px solid rgba(34, 36, 38, .15);
    margin-bottom: 0px;
  }

  .listSpan {
    padding: 3px 9px;
    /*width: 20px;*/
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

  .divStyle > .isBtnStyle1 {
    position: absolute;
    right: 150px;
    /*top: 13px;*/
  }

  .divStyle > .isBtnStyle2 {
    position: absolute;
    right: 0px;
    /*top: 13px;*/
  }

  .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
    color: red;
  }

  .divStyle {
    position: relative;
  }

  .el-form {
    margin-top: 14px;
  }

  .el-form-item {
    margin-bottom: 0px;
  }

  ul {
    list-style: none;
    display: inline-block;
  }

  .pageation li {
    float: left;
    display: inline-block;
    padding: 10px;
    background-color: #adadad;
    margin: 10px;
  }

  .bottomStyle {
    border: 1px solid #ebeef5;
    border-top: none;
    padding: 5px 20px;
    height: 60px;
    line-height: 50px;
    text-align: right;
  }

  .estate td {
    vertical-align: middle;
  }

  h2 {
    margin: 0;
    padding: 0;
  }

  .estate td > sapan {
    display: inline-block;
    height: 30px;
    padding: 20px;
  }

  .colspan p {
    font-size: 16px;
    color: red;
  }

  /*显示模态框的提示信息*/
  .spanStyle {
    color: red;
  }
</style>

<script>
  import  paingchild from '@/components/commonpage/paingchild';
  import  selectchild from '@/components/commonpage/selectchild';
  import Qs from 'qs';

  export default {
    data(){
      return {
        parkData: {},
        plate:'',
        tag:'',
        tableList: [],
        tablelen: 1,
        parentId: this.$route.query.userId,
        // 发送数据所用
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        text: '',
        isflag: false,

        tableDatas: [],
        dialogTableVisible:false,
        tableDatasDialog:[],
      }
    },
    created(){
      this.getContact();
    },
    methods: {
      getContact(){
        this.$http.get('user/'+this.parentId).then(res => {
          if (res.data.error_code == 2000) {
          var paramsData = res.data.data;
          if (paramsData.registerTime) {
              paramsData.registerTime = paramsData.registerTime;
            } else {
              paramsData.registerTime = '-';
            };
            paramsData.plateNumber = paramsData.plateNumber.toString()
            this.parkData = paramsData;
            console.log(this.parkData);
            this.getTableDatas();
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getTableDatas(){
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        datas.userPhone = this.parkData.phone;
        var data = Qs.stringify(datas);
        this.$http.post('parkloc/pageable', data).then((res)=>{
          if (res.data.error_code === 2000 && res.data.data.itotalRecords.length != '0') {
              console.log(res)
            this.seachLoading = false;
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else if(res.data.error_code === 2001 && this.isSearch === 1){
            this.isflag = true;
            this.text = "搜索到的是空数据，请重新输入搜索条件";
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
              clearInterval(timeId);
            }, 3000);
          }else{
            console.log(res.data.erroced);
          }
        }).catch((err)=>{
          this.seachLoading = false;
          console.log(err);
        })
      },
      // 下拉菜单的数据
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
        this.getTableDatas();
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTableDatas();
      },
      // 查看详情
      viewDetails(parkingId){
        this.dialogTableVisible = true;
        this.tableDatasDialog = [];
        var data = {parklocId:parkingId}
        data = Qs.stringify(data);
        this.$http.post("parkloc/publish/info",data).then(res => {
          console.log(res)
          if(res.data.data == "当前该车位未发布"){
            return false;
          }else if(res.data.error_code == 2000){
            this.tableDatasDialog = res.data.data;
            var temp = null;
            var dayOfWeeks = "周:";
            for(var i = 0; i <res.data.data.length;i++){
              if(res.data.data[i].dayOfWeeks){
                temp = res.data.data[i].dayOfWeeks;
                temp = temp.split(",")
                for(var j = 0; j < temp.length; j++){
                  if(temp[j] == 0){
                    dayOfWeeks += "日"
                  }else if(temp[j] == 1){
                    dayOfWeeks += "一"
                  }else if(temp[j] == 2){
                    dayOfWeeks += "二"
                  }else if(temp[j] == 3){
                    dayOfWeeks += "三"
                  }else if(temp[j] == 4){
                    dayOfWeeks += "四"
                  }else if(temp[j] == 5){
                    dayOfWeeks += "五"
                  }else if(temp[j] == 6){
                    dayOfWeeks += "六"
                  }
                }
                this.tableDatasDialog[i].dayOfWeeks = dayOfWeeks;
              }else {
                this.tableDatasDialog[i].dayOfWeeks = "一次";
              }
            }
          }
        })
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
