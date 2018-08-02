<template>
  <div>
    <h2>车锁日志详情</h2>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="序号" prop="id">
        </el-table-column>
        <el-table-column label="车锁编号" prop="lockNumber">
        </el-table-column>
        <el-table-column label="网关ID" prop="identifier">
        </el-table-column>
        <el-table-column label="锁地址" prop="lockMac">
        </el-table-column>
        <el-table-column label="摇臂状态" prop="rockerState">
          <template slot-scope="scope">
            <span v-if="scope.row.rockerState == 1">上锁</span>
            <span v-else-if="scope.row.rockerState == 2">解锁</span>
            <span v-else-if="scope.row.rockerState == 3" class='background red'>异常</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="蜂鸣器状态" prop="buzzerState">
          <template slot-scope="scope">
            <span v-if="scope.row.buzzerState == 0">鸣响</span>
            <span v-else-if="scope.row.buzzerState == 1">未鸣响</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="地磁状态" prop="geomagneticState">
          <template slot-scope="scope">
            <span v-if="scope.row.geomagneticState == 0">正常</span>
            <span v-else-if="scope.row.geomagneticState == 1" class='background red'>故障</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="使能失能状态" prop="workState">
          <template slot-scope="scope">
            <span v-if="scope.row.workState == 1">使能</span>
            <span v-else-if="scope.row.workState == 0" class='background red'>失能</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余电量" prop="battery">
          <template slot-scope="scope">
            <span v-if='scope.row.battery == 1'>{{scope.row.battery*100}}%</span>
            <span v-else-if='scope.row.battery == 10'>{{scope.row.battery*10}}%</span>
            <span v-else-if='scope.row.battery == 100'>{{scope.row.battery}}%</span>
            <span v-else-if='scope.row.battery <= 0.3' class="background red">{{scope.row.battery*100}}%</span>
            <span v-else>{{scope.row.battery*100}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="time">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
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
        lockId:this.$route.query.lockId,
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        dataItems: [],
      }
    },
    created(){
      this.getLockMacData();
    },
    methods:{
      getLockMacData(){
        console.log(this.lockMac)
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
          id:this.lockId
        }
        var data = Qs.stringify(isData);
        this.$http.post("lock/log/pageable",data).then(res=>{
          this.dataItems = res.data.data.dataList;
          for(var i = 0; i < this.dataItems.length; i++){
            this.dataItems[i].number = res.data.data.number;
            this.dataItems[i].gatewayId = res.data.data.gatewayId;
            this.total = parseInt(res.data.data.itotalRecords);
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
        this.getLockMacData();
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
