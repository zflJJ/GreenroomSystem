<template>
  <div>
    <h2>用户操作日志1.2</h2>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>

    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="logId"
          label="用户操作ID">
        </el-table-column>

        <el-table-column
          label="电话号码">
          <template slot-scope="scope">
            <span>{{scope.row.phone || '暂无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.operateTime | moment}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作日志">
          <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
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
  .searchStyle {
    height: 50px;
  }

  .isInfoStyle {
    color: red;
  }

  .isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .isBtnStyle2 {
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
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        // 分页要处理的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        tableDatas: [],

        // 搜索区域的内容
        isflag: false,
        isLoading: false,
        seachLoading: false,
        text: '',
        isSearch:0, // 表示是否要加搜索条件去做请求数据
        searchFromData: {
          remark:'',
        },
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 获取表格数据
      getTableDatas(){
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('sys/manage/operation/log/list', data).then((res) => {
          console.log(res);
          this.seachLoading = false;
          if (res.data.error_code === 2000 && res.data.data.dataList.length !=0) {
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else {
            console.log('状态码返回错误')
          }
        }).catch((err) => {
          console.log('服务端错误' + err);
        })
      },

      //获取搜索的内容(对发票类型数据做处理，)
      searchEvent(){ // 做判断和验证
        this.seachLoading = true;
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
//
          if (this.searchFromData.remark == "") {
            // 第一次搜索没有字段提示用户信息
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            clearInterval(timeId1);
            var timeId1 = setInterval(() => {
              this.isflag = false;
              this.seachLoading = false;
              clearInterval(timeId1);
            }, 3000);
            return;
          } else {
            // 不管好多页，搜索默认就开始第一页的方式, 长度不变
            this.start = 0;
            // 开始进行带参分页  [第一次搜索]
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          // 如果为空搜索，那么开启默认搜索， 如果为非空搜索进行分页搜索，但是发生变化之后，this.start = 0 从0 开始作为搜索的目标
          if (this.searchFromData.remark == "") {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
            this.getTableDatas();
          } else if (this.searchFromData.remark != "") {
            this.paramsData();
          }
        }
      },
      // 下拉菜单的数据
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
      // 清空文本框里面的内容
      clearStart(){
        this.compage = 1;
        this.start = 0;
      },

    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>


