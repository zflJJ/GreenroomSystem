<template>
  <div>
    <!--1.0 标题-->
    <h2>约车位列表</h2>
    <br>
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
          label="地区ID">
        </el-table-column>

        <el-table-column
          label="小区名称">
          <template slot-scope="scope">
            <span>{{scope.row.estateName || '暂无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="约车费(单位:元)">
          <template slot-scope="scope">
            <span>￥{{scope.row.guaranteeFee || 0}}元</span>
          </template>
        </el-table-column>

        <el-table-column
          label="物业结算比例">
          <template slot-scope="scope">
            <span>{{scope.row.estateSettle || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="平台结算比例">
          <template slot-scope="scope">
            <span>{{scope.row.platformSettle || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="签约车位数量">
          <template slot-scope="scope">
            <span>{{scope.row.amount || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="已发布车位数量">
          <template slot-scope="scope">
            <span>{{scope.row.publishAmount || 0}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="空闲车位数量">
          <template slot-scope="scope">
            <span>{{scope.row.idleAmount || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="toBefore">返回小区列表</el-button>
    </div>
    <!--4.0 分页插件-->
    <paingchild  :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
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
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],
        pageDatas:[], // 总数据
      }
    },
    created(){
      // 获取表格数据
      this.getTablesDatas();
    },
    methods: {
      getTablesDatas(){
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('parking/yue/pageable',data).then(res => {
          console.log(res);
          if (res.data.errcode == 1 && res.data.data.aaData.length > 0) {
            this.tableDatas = res.data.data.aaData;
            this.total = parseInt(res.data.data.iTotalRecords);
          } else {
            console.log('请求数据出问题');
          }
          console.log(res.data);
        }).catch(err => {
          console.log('服务器错误' + err);
        })
      },
      // 返回小区列表
      toBefore(){
        this.$router.push({path:'estate'})
      },
      // 点击分页的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTablesDatas();
      },
      // 下拉菜单
      getChildLength(len){
        var pageData = 0, age = 0;
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
        console.log(age);
        this.display = parseInt(len);
        this.getTablesDatas();
      },
    },
    components: {
      // 导入子组件
      selectchild,
      paingchild,
    }
  }
</script>

