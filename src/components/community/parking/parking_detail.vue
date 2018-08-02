<template>
  <div class="estate">
    <h2 class="h2Style">车位详情1.2</h2>
    <!--3.0 下拉菜单-->
    <!--<div class="divStyle">-->
      <!--<selectchild v-on:getlength="getChildLength"></selectchild>-->
      <!--<span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>-->
    <!--</div>-->

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
    <!--5.0 分页插件-->
    <!--<paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"-->
                <!--v-on:pagechange="pagechanges"></paingchild>-->
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

  .isInfoStyle {
    color: red;
  }

  .divStyle > .isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .divStyle > .isBtnStyle2 {
    position: absolute;
    right: 0px;
    top: 13px;
  }

  .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
  }

  .divStyle {
    position: relative;
  }

</style>

<script>
  import Qs from 'qs';
  import  paingchild from '@/components/commonpage/paingchild';
  import  selectchild from '@/components/commonpage/selectchild';
  export default {
    data(){
      return {
        //分页的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        text: '',
        isflag: false,
        // 搜索和导出的变量
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        pageDatas: [], // 保存总数据的量
        tableDatas:[],
      }
    },
    created(){
      this.getData();
    },
    methods: {
      //获取数据
      getData(){
        var data = {parklocId:this.$route.query.parkingId}
        data = Qs.stringify(data);
        this.$http.post("parkloc/publish/info",data).then(res => {
          console.log(res)
          if(res.data.data == "当前该车位未发布"){
            return false;
          }else if(res.data.error_code == 2000){
            this.tableDatas = res.data.data;
            var temp = null;
            for(var i = 0; i <res.data.data.length;i++){
              var dayOfWeeks = "周:";
              this.tableDatas[i].id = this.$route.query.parkingId;
              if(res.data.data[i].dayOfWeeks){
                temp = res.data.data[i].dayOfWeeks;
                temp = temp.split(",")
                for(var j = 0; j < temp.length; j++){
                    console.log(temp[j])
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
                  console.log(dayOfWeeks)
                }
                this.tableDatas[i].dayOfWeeks = dayOfWeeks;
                continue
              }else if(!res.data.data[i].dayOfWeeks){
                this.tableDatas[i].dayOfWeeks = "-";
              }
            }
          }
        })
      },
      // 分页处理方法
      pagechanges(val){
        var start = 0;
        this.page = val;
        // 计算位置
        this.compage = val;
        start = (val - 1) * this.display;
        this.tableList = this.pageDatas.slice(start, this.display + start);
      },
      // 下拉菜单
      getChildLength(len){
        // 数据是一次请求回来的，要对数据进行拆分
        var pageData = 0, age = 0, start;
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
        console.log(this.compage);
        this.display = parseInt(len);
        this.tableList = this.pageDatas.slice(start, start + this.display);

      },
    },
    components: {
      paingchild,
      selectchild,
    }
  }
</script>
