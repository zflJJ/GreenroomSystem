<template>
  <div class="estate">
    <!--{{this.$route.query.parkingId}}-->
    <h2 class="h2Style">车位详情</h2>
    <!--1.0 图表布局-->
    <div>
      <ul class="ulStyle">
        <li>
          <div class="indivStyle">
            <h4>基本信息</h4>
            <ul class="listStyle">
              <li>
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">车位编号</span></el-tag>&nbsp;<span>{{parkData.number || '暂无'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">车位名称</span></el-tag>&nbsp;<span>{{parkData.name || '暂无'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">网关ID</span></el-tag>&nbsp;<span>{{parkData.gatewayId || '暂无'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">锁地址</span></el-tag>&nbsp;<span>{{parkData.lockMac || '暂无'}}</span>
              </li>
              <li class="item">
                <!--这个地方的数据还有待改动-->
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">车位状态</span></el-tag>&nbsp;
                <span v-if="parkData.state == 11">物业已发布</span>
                <span v-else-if="parkData.state == 12">业主已发布</span>
                <span v-else-if="parkData.state == 13">正在使用</span>
                <span v-else-if="parkData.state == 19">已取消</span>
                <span v-else>其他状态</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">业主姓名</span></el-tag>&nbsp;<span>{{parkData.contact || '暂无'}}</span>
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div class="indivStyle">
            <h4>其他信息</h4>
            <ul class="listStyle">
              <li>
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">联系电话</span></el-tag>&nbsp;<span>{{parkData.phone || '暂无'}}</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">收费标准</span></el-tag>&nbsp;<span>{{parkData.unitPrice || 0}}元</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">担保费</span></el-tag>&nbsp;<span>{{parkData.guaranteeFee || 0}}元</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">电量</span></el-tag>&nbsp;<span>{{parkData.battery}}%</span>
              </li>
              <li class="item">
                <el-tag color="#337ab7" size="small"><span style="color:#ffffff;">结算比例</span></el-tag>
                <div class="iconStyle">
                  <p>
                    <i class="icon-ali-electronics-o" aria-hidden="true"></i>
                    <span class="textStyle">物业</span>
                    <span class="ratioStyle">{{parkData.estateSettle||"暂无"}}%</span>

                    <i class="icon-ali-account"></i>
                    <span class="textStyle">业主</span>
                    <span class="ratioStyle">{{parkData.ownerSettle||"暂无"}}%</span>

                    <i class="icon-ali-international-o"></i>
                    <span class="textStyle">平台</span>
                    <span class="ratioStyle">{{parkData.platformSettle||"暂无"}}%</span>

                    <i class="icon-ali-process-o"></i>
                    <span class="textStyle">其他</span>
                    <span class="ratioStyle">{{parkData.otherSettle||"暂无"}}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <!--2.0 共享时间段列表-->
    <h4 class="h4Style">共享时间段列表</h4>
    <selectchild v-on:getlength="getChildLength"></selectchild>

    <!--3.0表格-->
    <template>
      <el-table
        :data="tableList"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="序号">
        </el-table-column>

        <el-table-column
          label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="province"
          label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.endTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="发布类型">
          <template slot-scope="scope">
            <span v-if="scope.row.mode == 1">仅发布一次</span>
            <span v-else>循环发布</span>
          </template>
        </el-table-column>

        <el-table-column
          width="400px"
          label="发布周期">
          <template slot-scope="scope">
            <!--<span>{{scope.row.}}</span>-->
            <span v-if="scope.row.dayOfWeek == ''"></span>
            <span v-else>{{scope.row.dayOfWeek}}</span>
          </template>
        </el-table-column>


        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 59">取消发布</span>
            <span v-else-if="scope.row.state == 51">正常可预约</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="toBefore">返回上一页</el-button>
    </div>
    <!--分页插件的处理-->
    <pagination  :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                 v-on:pagechange="pagechanges"></pagination>
  </div>
</template>

<style scoped>
  .footStyle {
    height: 60px;
    padding: 5px;
    line-height: 50px;
    border: 1px solid #ebeef5;
    border-top: none;
    text-align: right;
  }
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
    /*border: 1px solid #0c91e5;*/
    list-style: none;
  }

  .ulStyle > li {
    height: 100%;
    width: 48.5%;
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
  .listStyle {
    width: 100%;
  }
  .listStyle > li {
    width: 100%;
    min-height: 36px;
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
  import  pagination from '@/components/commonpage/paingchild';
  import  selectchild from '@/components/commonpage/selectchild';
  export default {
    data(){
      return {
        parkData: {},
        tableList: [],   // 表格要渲染的数据
        tableAllDatas:[],// 数据总量
        tablelen: 1,

        // 传递给子组件的数据
        //分页插件传递的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
      }
    },
    created(){
      this.getContact();
      this.getTable();
    },
    methods: {
      // 获取图文信息
      getContact(){
        this.$http.get('parking/' + this.$route.query.parkingId).then(res => {
          this.parkData = res.data.data.parking;
          // 对电量进行判断
          if(this.parkData.battery == 10){
            this.parkData.battery = this.parkData.battery * 10;
          }else if(this.parkData.battery == 100){
            this.parkData.battery = this.parkData.battery;
          }else{
            this.parkData.battery = Math.round(this.parkData.battery * 100);
            console.log(this.parkData.battery);
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 请求表格数据
      getTable(){
        this.$http.get('parking/' + this.$route.query.parkingId + '/publish').then(res => {
          var templateData = res.data.data.publish;
          console.log(templateData);
          for (var i = 0, len = templateData.length; i < len; i++) {
              // 这里怎么有些有字段，有些有没有字段 dayOfWeek
            if(templateData[i].dayOfWeek == undefined){
              templateData[i].dayOfWeek = "";
            }
            if (templateData[i].dayOfWeek != "") {
              console.log(templateData[i].dayOfWeek);
              var arrTemp = templateData[i].dayOfWeek.split(',');
              console.log(arrTemp.length);
              for(var j=0,lens = arrTemp.length;j<lens;j++){
                if(arrTemp[j] == '0'){
                  arrTemp[j] = '星期天';
                } else if (arrTemp[j] == '1') {
                  arrTemp[j] = '星期一';
                } else if (arrTemp[j] == '2') {
                  arrTemp[j] = '星期二';
                } else if (arrTemp[j] == '3') {
                  arrTemp[j] = '星期三';
                } else if (arrTemp[j] == '4') {
                  arrTemp[j] = '星期四';
                } else if (arrTemp[j] == '5') {
                  arrTemp[j] = '星期五';
                } else if (arrTemp[j] == '6') {
                  arrTemp[j] = '星期六';
                }
              }
              console.log(arrTemp);
              templateData[i].dayOfWeek = arrTemp.toString();
            }
            console.log(templateData);
          }
          // 保存数据的总数
          this.tableAllDatas = templateData;
          // 传递到分页组件中的总长度
          this.total = parseInt(templateData.length);
          // 没有搜索
          this.tableList = templateData.slice(0, this.display);
        }).catch(err => {
          console.log(err);
        })
      },

      // 分页处理方法
      pagechanges(val){
        var start = 0;
        this.page = val;
        // 计算位置
        this.compage  = val;
        start = (val - 1) * this.display;
        this.tableList = this.tableAllDatas.slice(start,this.display+start);
      },
      // 下拉菜单
      getChildLength(len){
        // 数据是一次请求回来的，要对数据进行拆分
        var pageData = 0, age = 0,start;
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
        start = (age - 1) * len;
        this.page = age;
        this.compage = age;
        this.display = parseInt(len);
        this.tableList = this.tableAllDatas.slice(start,start + this.display);
      },
      // 返回上一页
      toBefore(){
        this.$router.go(-1);
      },
    },
    components: {
      pagination,
      selectchild,
    }
  }
</script>
