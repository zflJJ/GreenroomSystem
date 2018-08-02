<template>
  <div>
    <h2>奖品管理</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="奖品名称">
        <el-input placeholder="请输入奖品名称" v-model.trim="searchFromData.name" @change="clearStart"
                  @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="goPrizeStatistics" class="isBtnStyle2">奖品发放统计</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="奖品名称" prop="name">
        </el-table-column>
        <el-table-column label="奖品描述" prop="intro">
        </el-table-column>
        <el-table-column label="有效期" width="300px">
          <template slot-scope="scope">
            <span v-if="!scope.row.startTime&&!scope.row.endTime">永久有效</span>
            <span v-else>{{scope.row.startTime | moment}}--{{scope.row.endTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">有效</span>
            <span v-else-if="scope.row.state==0">已过期</span>
            <span v-else-if="scope.row.state==9999">已删除</span>
            <span v-else-if="scope.row.state==9998">冻结</span>
          </template>
        </el-table-column>
        <el-table-column label="编辑时间">
          <template slot-scope="scope">
            <span v-if='scope.row.modifyTime'>{{scope.row.modifyTime | moment}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="prizeDetails(scope.row.id)">查看详情
            </el-button>
            <br>
            <el-button v-if="scope.row.state==9998" size="mini" type="warning" @click="prizeUnfreeze(scope.row.id)">解冻
            </el-button>
            <el-button v-else size="mini" type="warning" @click="prizeFreeze(scope.row.id)">冻结
            </el-button>
            <br>
            <el-button size="mini" type="danger"
                       @click="prizeBtnDel(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click="prizeAdd">添加奖品</el-button>
    </div>
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

  .divStyle {
    position: relative;
    height: 60px;
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
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    data(){
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        dataItems: [],
        seachLoading: false,  // 搜索是否禁用
        isSearch: 0, // 是否进行了搜索
        searchFromData: {
          name: "",
        },
      }
    },
    created(){
      this.getData();
    },
    methods: {
      //获得数据
      getData(){
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        var datas = Qs.stringify(datas);
        this.$http.post("activity/prize/list", datas).then(res => {
          if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
            for (var i = 0; i < this.dataItems.length; i++) {
              try{
                if (this.dataItems[i].intro.length > 20) {
                  this.dataItems[i].intro = this.dataItems[i].intro.slice(0, 20) + "...";
                }
              }catch (e){}
            }
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
            this.seachLoading = false;
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log(err);
        })
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.name === '') {
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
            this.seachLoading = false;
            return;
          } else {
            // 开始进行搜索
            this.isSearch = 1;
            this.start = 0;
            this.getData();
          }
        } else if (this.isSearch == 1) {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.name === '') {
            this.start = 0;
            this.isSearch = 0;
            this.getData();
          } else if (this.searchFromData.name != '') {
            this.getData();
          }
        }
        ;
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        console.log(this.start)
        if (this.isSearch == 0) {
          this.getData();
        } else if (this.isSearch == 1) {
          this.getData();
        }
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
        if (this.isSearch == 0) {
          this.getData();
        } else if (this.isSearch == 1) {
          this.getData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      //删除按钮
      prizeBtnDel(id){
        var data = Qs.stringify({id:id})
        this.$http.post("activity/prize/delete/check",data).then(res => {
          if(res.data.error_code == 2000){
            this.open2(id);
          }else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      //确认是否删除
      open2(id) {
        this.$confirm('此操作将永久删除该奖品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.prizedDelSuccess(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //删除奖品
      prizedDelSuccess(id){
        var data = Qs.stringify({id: id});
        this.$http.post("activity/prize/delete", data).then(res => {
          if (res.data.error_code == 2000) {
            this.getData();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message.error(res.error_message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      //冻结按钮
      prizeFreeze(id){
        var data = Qs.stringify({id: id});
        this.$http.post("activity/prize/frozen/check", data).then(res => {
          if (res.data.error_code == 2000) {
            this.open3(id);
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      //确认是否冻结
      open3(id) {
        this.$confirm('此操作将冻结该奖品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.prizeFreezeSuccess(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消冻结'
          });
        });
      },
      //冻结奖品
      prizeFreezeSuccess(id){
        var data = Qs.stringify({id: id});
        this.$http.post("activity/prize/frozen", data).then(res => {
          if (res.data.error_code == 2000) {
            this.getData();
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },

      //解冻按钮
      prizeUnfreeze(id){
        var data = Qs.stringify({id: id});
        this.$http.post("activity/prize/unfreeze/check", data).then(res => {
          if (res.data.error_code == 2000) {
            this.open4(id);
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },
      //确认是否解冻
      open4(id) {
        this.$confirm('此操作将解冻该奖品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.prizeUnfreezeSuccess(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解冻'
          });
        });
      },
      //解冻
      prizeUnfreezeSuccess(id){
        var data = Qs.stringify({id: id});
        this.$http.post("activity/prize/unfreeze", data).then(res => {
          if (res.data.error_code == 2000) {
            this.getData();
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.$message.error(err)
        })
      },

      //查看详情
      prizeDetails(id){
        this.$router.push({path: 'prize', query: {title: "查看奖品", id: id}});
      },
      //新增
      prizeAdd(){
        this.$router.push({path: 'prize', query: {title: "添加奖品"}});
      },
      //奖品统计
      goPrizeStatistics(){
        this.$router.push({path: 'prizeStatistics'});
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
