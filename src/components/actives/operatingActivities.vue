<template>
  <div>
    <h2>运营活动</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="活动名称">
          <el-input placeholder="请输入活动名称" v-model.trim="searchFromData.name" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchFromData.state" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="searchFromData.type" placeholder="全部" disabled>
            <el-option
              v-for="item in options1"
              :key="item.type"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--3.0 下拉菜单 和 导出数据-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>

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
          prop="name"
          label="活动名称">
        </el-table-column>
        <el-table-column
          label="活动类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">邀请</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Banner（长图）">
          <template slot-scope="scope">
            <template v-if="scope.row.fileLongPath">
              <img :src="scope.row.fileLongPath" alt=""  style="width:60px;height:100px;">
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="password"
          label="Banner（宽图）">
          <template slot-scope="scope">
            <template v-if="scope.row.fileWidePath">
              <img :src="scope.row.fileWidePath" alt=""  style="width:100px;height:60px;">
            </template>
            <template v-else>
              -
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="intro"
          label="活动描述">
        </el-table-column>
        <el-table-column
          prop="href"
          label="活动链接">
        </el-table-column>
        <el-table-column
          label="活动开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="活动结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.endTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">进行中</span>
            <span v-else>已过期</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          label="编辑时间">
          <template slot-scope="scope">
            <span>{{scope.row.updateTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="activitesEdit(scope.row.id)">查看详情</el-button>
            <el-button size="mini" type="danger" @click="activitesDelet(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click="addOperatingActivities">新增活动</el-button>
    </div>
    <!--5.0 分页插件-->
    <paingchild  :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                 v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<style scoped>
  .divStyle>.isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .divStyle>.isBtnStyle2 {
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
    height: 60px;
  }

  .searchStyle {
    height: 50px;
  }

  .isInfoStyle {
    color: red;
  }

  .bottomStyle {
    border: 1px solid #ebeef5;
    border-top: none;
    padding: 5px 20px;
    height: 60px;
    line-height: 50px;
    text-align: right;
  }
</style>

<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        // 发送数据所用
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],

        // 搜索和导出需要的参数
        seachLoading: false,  // 搜索是否禁用
        isSearch: 0, // 是否进行了搜索
        isflag: '',  // 提示信息是否显示
        text: '',   //  提示信息的内容
        searchFromData: {
          name: "",
          state: "",
        },
        options: [{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '进行中'
        }, {
          value: '0',
          label: '已过期'
        }],
        options1: [{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '邀请'
        }, {
          value: '0',
          label: '无效'
        }],
        fileLongPath:'',
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      getTableDatas(){
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display,
          state: -1,
        };
        var data = Qs.stringify(datas);
        this.$http.post('activity/list', data).then(res => {
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);

            this.tableDatas = res.data.data.dataList;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },

      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.name == "" && this.searchFromData.state == "") {
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
            }, 3000);
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.name == "" && this.searchFromData.state == "") {
            this.start = 0;
            this.isSearch = 0;
            this.getTableDatas();
          } else if (this.searchFromData.name == "" ||this.searchFromData.state == "") {
            this.paramsData();
          }
        };
      },

      // 带参查询数据，进行搜索
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        if (this.searchFromData.state) datas.state = this.searchFromData.state;
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('activity/list', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
            console.log(this.tableDatas)
          } else if (res.data.error_code !== 2000) {
            this.text = "输入的搜索条件有误，请重新输入";
            this.isflag = true;
            setInterval(() => {
              this.text = "";
              this.isflag = false;
            }, 3000);
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
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
        console.log(age);
        this.compage = age;
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.compage = 1;
        this.start = 0;
      },

      //跳转到新增
      addOperatingActivities(){
        this.$router.push({path: 'OperatingActivities_add'});
      },
      //编辑
      activitesEdit(id){
        this.$router.push({path: 'OperatingActivities_edit', query:{activitesId:id}});
      },
      //删除
      activitesDelet(id){
        this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http("activity/delete?id=" + id).then(res => {
          console.log(res)
          if(res.data.error_code == 2000){
            this.$message.success('恭喜你，删除活动成功');
            this.getTableDatas();
          }else{
            this.$message.success('错了哦，删除活动失败');
          }
        })}).catch(() => {
            this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
