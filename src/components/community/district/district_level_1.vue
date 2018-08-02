<template>
  <div>
    <!--1.0 标题-->
    <h2>地区列表 <span class="specOfH4">省级</span></h2>
    <!--2.0 下拉菜单（左边） 和 搜索框（右边）-->
    <selectchild v-on:getlength="getChildLength"></selectchild>
    <!--3.0 列表-->
    <template>
      <el-table
        border
        :data="tableDatas"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="地区ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="地区名称">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <!--这里还有一个状态需要在后期添加（需要注意）-->
            <span>已开放</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="editPage(scope.row.id,scope.$index,tableDatas)">编辑名称
            </el-button>
            <el-button type="success" size="small" @click="Viewdetails(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="addPage">新增地区</el-button>
    </div>
    <!--4.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <!--5.0模态框-->
    <el-dialog :title="modetext" :visible.sync="dialogFormVisible" :show-close="showX" custom-class="modelStyle">
      <el-form>
        <el-form-item label="">
          <el-input auto-complete="off" v-model="name"></el-input>
        </el-form-item>
        <span v-show="isShow">{{text}}</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="returnPage">返回</el-button>
        <el-button type="primary" @click="gitDatas">提交</el-button>
      </div>
    </el-dialog>

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
        //分页插件传递的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        //表格数据
        tableDatas: [],  // 渲染表格所用到的数据
        pageDatas: [],  // 存储的总的数据量
        page: 1,

        // 模态框
        modetext: '',
        dialogFormVisible: false,
        showX: false,
        // 地区名称
        name: '',
        isShow: false,
        text: '',
        // 编辑数据时的一个状态
        pageId: '',

        /*这个是数组的东西*/
        abc: '',
        index: '',
      }
    },
    created(){
      // 获取表格数据
      this.getTablesDatas();
    },
    methods: {
      getTablesDatas(){
        var data = {
          parentId: 0,
          sEcho: 3,
          length: this.display,
          start: this.start
        }
        data = Qs.stringify(data)
        this.$http.post('area/pageable', data).then((res) => {
          console.log(res);
          if (res.data.error_code == 2000 && res.data.data.dataList.length != 0) {
            this.tableDatas = res.data.data.dataList;
            this.total = parseInt(res.data.data.itotalRecords);
          } else {
            console.log('请求数据出问题');
          }
          ;
          console.log(res.data);
        }).catch((err) => {
          console.log('服务器错误' + err);
        });
      },
      // 点击分页的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTablesDatas();
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
        this.getTablesDatas();
      },


      // 提交数据( 没有ID是新增数据 || 有ID是编辑数据), 不管是新增数据，还是提交数据，做完之后，都跳转到第一页去
      gitDatas(){
        if (this.pageId == '') {
          var data = Qs.stringify({name: this.name, parentId: 0, level: 1, state: 1});
        } else {
          var data = Qs.stringify({name: this.name, parentId: 0, level: 1, id: this.pageId, state: 1});
        }
        if(!/^[\u4e00-\u9fa5]+$/gi.test(this.name)){
          this.$message.error('错了哦,请输入正确的地区名称');
        }else if (this.name == '') {
          this.$message.error('错了哦,地区名不能为空');
          this.dialogFormVisible = true;
        } else {
          this.$http.post('area/save', data).then(res => {
            console.log(res)
            if (res.data.error_code == 2301) {
              this.$message.error('错了哦，地区名称重复,请输入不同名的地区名');
            } else if (res.data.error_code == 2000) {
              this.pageId = '';
              this.name = "";
              this.isShow = false;
              this.text = "";
//                    this.length = 10;
              this.dialogFormVisible = false;
              this.getTablesDatas(0);
            }
            ;
          }).catch(err => {
            console.log('服务器错误' + err);
          });
        }
        ;
      },
      // 返回按钮
      returnPage(){
        this.name = "";
        this.isShow = false;
        this.text = "";
        this.dialogFormVisible = false;
      },
      // 编辑数据---> 可以拿到数据
      editPage(id, index, tableDatas){
        this.name = tableDatas[index].name
        this.modetext = "编辑地区";
        this.dialogFormVisible = true;
        this.pageId = id;
      },
      // 新增地区
      addPage(){
        this.modetext = "新增地区"
        this.dialogFormVisible = true;
      },
      // 查看详情页面
      Viewdetails(id){
        this.$router.push({path: 'district_level_2', query: {parentId: id}});
      }
    },
    components: {
      // 导入子组件
      selectchild,
      paingchild,
    }
  }
</script>
