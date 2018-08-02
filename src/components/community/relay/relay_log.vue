<template>
  <div>
    <h2>继电器日志</h2>
    <!--引入下拉框子组件-->
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="继电器ID" prop="id">
        </el-table-column>
        <el-table-column label="继电器编号" prop="number">
        </el-table-column>
        <el-table-column label="继电器名称" prop="gatewayId">
        </el-table-column>
        <el-table-column label="状态" prop="rockerState">
          <template slot-scope="scope">
            <span v-if="scope.row.rockerState == 1">上锁</span>
            <span v-else-if="scope.row.rockerState == 2">解锁</span>
            <span v-else-if="scope.row.rockerState == 3" class='background red'>异常</span>
          </template>
        </el-table-column>
        <el-table-column label="回传时间" prop="time">
          <template slot-scope="scope">
            <span>{{scope.row.time | moment}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<style>
  .background {
    width: 8px;
    height: 4px;
    padding: 4px;
  }

  .red {
    background-color: #F56C6C;
  }
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default{
    data(){
      return {
        relayId:this.$route.query.relayId,
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        dataItems: [],
        isflag:'',
        text:'',
        isLoading:false,
      }
    },
    created(){
      this.getLockMacData();
    },
    methods:{
      getLockMacData(){

        this.$http.get("relaymeter/"+this.relayId).then(res=>{
            console.log(res)
          this.dataItems = res.data.data.aaData;
          for(var i = 0; i < this.dataItems.length; i++){
            this.dataItems[i].number = res.data.data.number;
            this.dataItems[i].gatewayId = res.data.data.gatewayId;
            this.total = parseInt(res.data.data.iTotalRecords);
            console.log(this.dataItems[i].buzzerState)
          }
          console.log(res)
        }).catch(err=>{
          this.$message.error('错了哦，没有数据');
          console.log("没有数据,走了err")
          console.log(err)
        })
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getLockMacData();
      },
      // 下拉菜单的选择器
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
        this.getLockData();
      },
      exportEvent(){},
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
