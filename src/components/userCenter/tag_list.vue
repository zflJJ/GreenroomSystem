<template>
  <div>
    <h2>标签列表</h2>
    <!--2.0 搜索框的样式-->
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="标签名">
          <el-input placeholder="请输入标签名" v-model.trim="searchFromData.name" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click.native.prevent="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索
      </el-button>
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
          label="标签名称">
        </el-table-column>

        <el-table-column
          label="标签说明">
          <template slot-scope="scope">
            <span>{{scope.row.comment || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="typeStr"
          label="标签类型">
        </el-table-column>
        <el-table-column
          label="编辑时间">
          <template slot-scope="scope">
            <span>{{scope.row.modifyTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.typeStr=='自动标签'" type="primary" size="mini" @click="getBindUsers(scope.row.id)">查看详情</el-button>
            <el-button v-if="scope.row.typeStr=='自动标签'" type="success" size="mini" @click="editTag(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.typeStr=='手动标签'" type="primary" size="mini" @click="getManualBindUsers(scope.row.id)">查看详情</el-button>
            <el-button v-if="scope.row.typeStr=='手动标签'" type="success" size="mini" @click="editManualTag(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteTag(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" class="isBtnStyle3" @click.native.prevent="toAddTag">自动标签</el-button>
      <el-button type="primary" class="isBtnStyle3" @click.native.prevent="toAddManualTag">手动标签</el-button>
    </div>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>
<style scoped>
  .searchStyle {
    height: 50px;
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

  .divStyle > .isBtnStyle3 {
    position: absolute;
    right: 300px;
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
        //分页插件传递的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],

        // 搜索和导出部分的内容
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        searchFromData: {
          name: '',
        },

        // 模态框的信息
        modeltext: '',  // 模态框提示信息
        isShow: false,   // 是否显示
        dialogFormVisible: false,  // 模态框是否显示
        titleText: '',   // 模态框的名字
        showX: false, // 模态框固定参数
        tagname: '',   // 文本框的内容
        tageId: '',    // 修改标签名需要的参数
        submitLoading: false,
        title:'绑定的用户数是个'
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 查看绑定的用户数
      getBindUsers(tagId){
        this.$http.post('tag/' + tagId).then((res) => {
            console.log(res.data.data.number)
          if(res.data.error_code == 2000){
            this.title = '绑定的用户数是'+res.data.data.number + '个';
            this.open2();
          }else if(res.data.error_code !== 2000){
            this.title = '绑定的用户数是0个';
            this.open2();
          }
          // 弹出一个模态框
        }).catch((err) => {
          console.log(err);
        })
      },
      // 模态框显示绑定的用户数
      open2() {
        this.$alert(this.title, '提示信息', {
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      },
      // 编辑标签的时候
      editTag(tag){
        this.$router.push({path: 'edit_tag', query: {tag: tag}});
      },
      // 这里还要添加一个删除标签的接口
      deleteTag(tagId){
        // 显示一个提示框
        this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发送请求删除数据
          var tempData = {id:tagId};
          this.$http.post('tag/delete',tempData).then((res) => {

            if (res.data.error_code == 2000) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.start = 0;
              this.length = 10;
              this.getTableDatas();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 默认搜索条件
      getTableDatas(){
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('tag/pageable', data).then((res) => {
          this.seachLoading = false;
          if (res.data.error_code === 2000 && res.data.data.dataList.length != 0) {
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
            for(var i = 0; i < this.tableDatas.length; i++){
              if(this.tableDatas[i].comment && this.tableDatas[i].comment.length > 20){
                this.tableDatas[i].comment = this.tableDatas[i].comment.slice(0,20)+"...";
              }
            }
          } else {
            console.log('状态码返回错误')
          };
        }).catch((err) => {
          this.seachLoading = false;
          console.log(err);
        })
      },


      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        // 带条件进行分页处理      phone: '', // 联系电话 districtName: '', // 地区名称 estateName: '',//
        // 点击了搜索是按搜索模式做分页， 没点击搜索是按普通模式做分页  ,加上搜索字段
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          // 前提对搜索的条件进行判断
          if (this.searchFromData.name == "") {
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
            }, 3000);
            return;
          } else {
            // 不管好多页，搜索默认就开始第一页的方式, 长度不变
            this.start = 0;
            // 开始进行带参分页
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          // 如果为空搜索，那么开启默认搜索， 如果为非空搜索进行分页搜索，但是发生变化之后，this.start = 0 从0 开始作为搜索的目标
          if (this.searchFromData.name == "") {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
            this.getTableDatas();
          } else if (this.searchFromData.name != "") {
            this.paramsData();
          }
        }
      },
      // 带参分页处理
      paramsData(){
        this.isSearch = 1;
        var searchData = {};
        // 对参数进行了整理
        searchData.start = this.start;
        searchData.sEcho = 3;
        searchData.length = this.display;
        if (this.searchFromData.name) searchData.name = this.searchFromData.name;

        var datas = Qs.stringify(searchData);
        this.$http.post('tag/pageable', datas).then(res => {
          // 按钮不用禁用了
          this.seachLoading = false;
          if (res.data.error_code == 2000 && res.data.data.dataList.length != 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else {
            this.isflag = true;
            this.text = '未能搜索到匹配的条件，请重新数据搜索条件！！';
            setInterval(() => {
              this.text = "";
              this.isflag = false;
            }, 3000);
          }
          ;
        }).catch(err => {
          this.seachLoading = false;
          this.flag = true;
          this.text = '服务器返回错误，联系后台开发人员！！';
          setInterval(() => {
            this.flag = false;
            this.text = "";
          }, 3000);
        })
      },
      // 导出数据
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.name == "") {
          this.text = "没有导出数据的条件，数据无法进行导出";
          this.isflag = true;
          setInterval(() => {
            this.isLoading = false;
            this.isflag = false;
            this.text = '';
          }, 3000)
          return;
        } else {
          var exportDatas = {};
          exportDatas.start = this.start;
          exportDatas.sEcho = 3;
          exportDatas.length = this.display;
          if (this.searchFromData.name) exportDatas.name = this.searchFromData.name;
          var data = Qs.stringify(exportDatas);
          this.$http.post('tag/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = '标签列表表格'
            var blob = res.data;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
              var a = document.createElement("a");
              a.download = filename + ".xls";
              a.href = e.target.result;
              a.click();
            }
          }).catch(err => {
            this.text = "后台数据异常，请联系后台人员";
            this.isflag = true;
            setInterval(() => {
              this.isLoading = false;
              this.isflag = false;
            }, 3000)
            console.log(err);
          })
        }
      },

      // 下拉菜单的数据  和 分页都还没有做处理
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
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getTableDatas();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },

      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
      },

      // 提示框的信息
      open(index, tableDatas, item){
        this.$alert('提交数据成功', '提示信息', {
          confirmButtonText: '确定',
          callback: action => {
            var arr = tableDatas;
            // 对参数status的判断（存在0 或者不存在）
            console.log(arr[index]);
            arr[index].status = item;
            tableDatas.splice(index, 1, arr[index]);
          }
        });
      },

      //查看手动标签详情
      getManualBindUsers(id){
        this.$router.push({path:"manualTag",query:{title:"查看手动标签",id:id}})
      },
      //编辑手动标签详情
      editManualTag(id){
        this.$router.push({path:"manualTag",query:{title:"编辑手动标签",id:id}})
      },

      toAddTag(){
        this.$router.push({path: 'add_tag'});
      },
      toAddManualTag(){
        this.$router.push({path:"manualTag",query:{title:"添加手动标签"}})
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

