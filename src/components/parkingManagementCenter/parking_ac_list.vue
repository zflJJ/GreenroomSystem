<template>
  <div>
    <!--1.0 标题-->
    <h2>车位绑定门禁列表</h2>
    <!--2.0 下拉菜单（左边） 和 搜索框（右边）-->
    <selectchild v-on:getlength="getChildLength"></selectchild>
    <!--3.0 列表-->
    <template>
      <el-table
        border
        :data="tableDatas"
        style="width: 100%">
        <el-table-column
          prop="estateId"
          label="小区ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="门禁名称">
        </el-table-column>

        <el-table-column
          label="门禁类型">
          <template slot-scope="scope">
            <!--这里还有一个状态需要在后期添加（需要注意）-->
            <span>日常门禁</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="password"
          label="密码">
        </el-table-column>

        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">可用</span>
            <span v-else>不可用</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="untieGuard">解绑门禁</el-button>
      <el-button type="primary" size="small" @click="addGuard">新增绑定门禁</el-button>
    </div>
    <!--4.0 分页插件-->
    <paingchild  :currentss="currentss" :display="display" :total="total" :pagegroup="pagegroup"
                 v-on:pagechange="pagechanges"></paingchild>
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

  .specOfH4 {
    font-size: 22px;
  }
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default{
    data(){
      return {
        // 门禁ID
        estateId:'',
        //表格数据
        tableDatas: [],

        currentss:1,
        pagegroup:5,
        display:10,
        currentPage: 1,
        pagesArray: [10, 25, 50, 100],
        total: 0,
        pageDatas:[],
        page:1,

        // 模态框
        dialogFormVisible: false,
        showX: false,
        // 地区名称
        name: '',
        isShow:false,
        text:'',
        // 编辑数据时的一个状态
        pageId: '',
      }
    },
    created(){
      // 获取表格数据
      this.getTablesDatas();
    },
    methods: {
      // 获取表格数据
      getTablesDatas(){
        this.$http.get('parking/'+this.$route.query.parkingId+'/access').then(res => {
          if (res.data.errcode == 1 && res.data.data.accessList.length != 0) {
            // 门禁ID
            this.estateId = res.data.data.accessList[0].estateId;
            console.log(this.estateId);
            this.lists = res.data.data.accessList;
            this.pageDatas = res.data.data.accessList;
            this.tableDatas = res.data.data.accessList.slice(0, this.display);
            this.total = parseInt(res.data.data.accessList.length);
          } else {
            console.log('没有数据');
          }
          console.log(res.data);
        }).catch(err => {
          console.log('服务器错误' + err);
        })
      },
      // 新增门禁
      addGuard(){
          this.$router.push({path:'add_guard',query:{parkingId:this.$route.query.parkingId,estateId:this.$route.query.estateId}});
      },
      // 解绑门禁
      untieGuard(){
        this.$router.push({path:'untie_guard',query:{parkingId:this.$route.query.parkingId,estateId:this.$route.query.estateId}});
      },
      // 点击分页的数据
      pagechanges(val){
//        console.log(val);
        this.page = val;
        // 计算位置
        this.start = (val - 1) * this.display;
        this.tableDatas = this.pageDatas.slice(this.start,this.display+this.start);
      },
      // 下拉菜单
      getChildLength(val){
        console.log(this.page,val); // 33页数据
        var start = (this.page -1) * this.display;
        var start1 = Math.floor( start / val);
        console.log(start1);
        console.log(start);
        this.display = parseInt(val);
        this.tableDatas = this.pageDatas.slice(start1 * val,(start1 *val)+val);
      },
    },
    components: {
      // 导入子组件
      selectchild,
      paingchild,
    }
  }
</script>

