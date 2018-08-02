<template>
  <div>
    <!-- 查看闸道列表页面 -->
    <h2>用户反馈列表</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="用户账号">
          <el-input placeholder="请输入用户账号" v-model.trim="searchFromData.phone" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="反馈时间">
          <div class="block">
            <el-date-picker
              v-model="value6"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="setTime">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="反馈意见">
          <el-select v-model="searchFromData.proIdList" placeholder="全部">
            <el-option
              v-for="item in problems"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>

    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="feedbackId"
          width="100px"
          label="反馈意见ID">
        </el-table-column>

        <el-table-column
          label="用户账号">
          <template slot-scope="scope">
            <span>{{scope.row.phone || '暂无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="反馈时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>

        <!--<el-table-column-->
          <!--label="来源">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.resource || '暂无'}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column
          label="反馈意见">
          <template slot-scope="scope">
            <span>{{scope.row.proIntro || '暂无'}}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="252px"
          label="图片">
          <template slot-scope="scope">
            <template v-if="scope.row.filePaths === '暂无' || scope.row.filePaths === null">用户没有反馈问题的截屏</template>
            <template v-else>
              <el-button type="primary" size="mini" @click="lookImage(scope.row.filePaths)">查看图片</el-button>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          label="补充说明">
          <template slot-scope="scope">
            <span>{{scope.row.remark || '暂无'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <!--6.0 显示一个模态框-->
    <el-dialog
      :visible.sync="dialogTableVisible"
      :show-close='true'
      width="21%"
      :before-close="handleClose"
      :close-on-press-escape="false">
      <el-dialog
        width="30%"
        :visible.sync="innerVisible"
        append-to-body>
        <img :src="imgSrc" alt="" class="imgStyle">
      </el-dialog>
      <template v-for="item in imageList">
        <img :src="item" alt="" style="width:80px;height:80px;" @click="getImage(item)">&nbsp;
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
  .searchStyle .el-select {
    width: 400px;
  }

  .imgStyle {
    width: 100%;
    height: 100%;
  }

  img {
    height: 50px;
    width: 50px;
  }

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

  .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
  }

  .divStyle {
    position: relative;
    height: 60px;
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
        isSearch: 0, // 表示是否要加搜索条件去做请求数据
        searchFromData: {
          phone: "",
          proIdList: '',
        },
        value6: [],     // 时间的范围

        problems: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '费用错误'
        }, {
          value: '2',
          label: '物业纠纷'
        }, {
          value: '3',
          label: '停车场信息错误'
        }, {
          value: '4',
          label: '开不了锁'
        }, {
          value: '5',
          label: '举报违停'
        }, {
          value: '6',
          label: '车位信息错误'
        }, {
          value: '7',
          label: '地锁故障'
        }, {
          value: '8',
          label: '车位占用'
        }, {
          value: '9',
          label: '账户问题'
        }, {
          value: '10',
          label: '其他'
        }], // 反馈的问题
        dialogTableVisible: false, // 模态框是否显示
        imgSrc: '',    // 这个表示图片的url
        imageList: [],   // 图片地址的数据
        innerVisible: false,  // 二级模态框是否要展示
        searchFlag: false,
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      handleClose() {
        this.imageList = [];
        this.dialogTableVisible = false;
      },
      // 点击查看图片已缩略图的形式显示
      lookImage(imgList){
        this.dialogTableVisible = true;
        this.imageList = imgList;
        console.log(this.imageList)
      },
      // 模态框显示图片
      getImage(item){
        this.innerVisible = true;
        this.imgSrc = item;
        console.log(this.imgSrc)
      },
      // 获取表格数据
      getTableDatas(){
        // 整合信息
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.phone !== "") datas.phone = this.searchFromData.phone;
        if (this.searchFromData.proIdList.length !== 0) datas.proIdList = this.searchFromData.proIdList;
        if (this.value6[0]) datas.startTime = this.value6[0];
        if (this.value6[1]) datas.endTime = this.value6[1];
        var data = Qs.stringify(datas);
        this.$http.post('sys/manage/feekback/list', data).then(res => {
          if (res.data.error_code === 2000 && res.data.data.dataList) {
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            var paramsDatas = res.data.data.dataList;
            this.tableDatas = paramsDatas;
          } else {
            this.$message.error("后台未能匹配到数据，请重新输入搜索条件！！");
            this.seachLoading = false;
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log(err);
        })
      },

      searchEvent(){ // 做判断和验证
        this.seachLoading = true;
        this.searchFlag = true;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        }
        ;
        if (this.isSearch === 0) {  // 点击了一次搜索，过后这里的判断就会失效
          if (this.searchFromData.phone === "" && this.value6.length === 0 && this.searchFromData.proIdList.length === 0) {
            this.seachLoading = false;
            this.$message.error("输入的搜索内容不能为空，请填入搜索字段");
          } else {
            this.start = 0;
            this.isSearch = 1;
            this.compage = 1;
            this.getTableDatas();
          }
        } else if (this.isSearch === 1) {
          if (this.searchFromData.phone === "" && this.value6.length === 0 && this.searchFromData.proIdList.length === 0) {
            this.isSearch = 0;
            this.start = 0;
            this.compage = 1;
            this.searchFlag = false;
          }
          this.getTableDatas();
        }
      },

      // 导出数据
      exportEvent(){
        this.isLoading = true;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === []) {
          this.value6 = [];
        };
        if (this.searchFromData.phone === "" && this.value6.length === 0 && this.searchFromData.proIdList.length === 0) {
          this.$message.error("没有导出数据的条件，数据无法进行导出");
          this.isLoading = false;
        } else {
          // 整合数据 + 发送请求
          var exportDatas = {};
          if (this.searchFromData.phone !== "") exportDatas.phone = this.searchFromData.phone;
          if (this.searchFromData.proIdList.length !== 0) exportDatas.proIdList = this.searchFromData.proIdList;
          if (this.value6[0]) exportDatas.startTime = this.value6[0];
          if (this.value6[1]) exportDatas.endTime = this.value6[1];
          var data = Qs.stringify(exportDatas);
          this.$http.post('sys/manage/feekback/excel', data, {responseType: 'blob'}).then(res => {
              this.isLoading = false;
              var filename = '用户反馈意见表格'
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
            this.$message.error('错了哦，没有导出数据的条件，数据无法进行导出!!');
            this.isLoading = false;
          })
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
        if(this.searchFlag === false ){
          this.searchFromData.phone = "";
          this.value6 = [];
          this.searchFromData.proIdList = [];
        }
        this.getTableDatas();
      },

      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if(this.searchFlag === false ){
          this.searchFromData.phone = "";
          this.value6 = [];
          this.searchFromData.proIdList = [];
        }
        this.getTableDatas();
      },

      clearStart(){
//        this.compage = 1;
//        this.start = 0;
      },
      // 设置时间
      setTime(){
//        this.compage = 1;
//        this.start = 0; // 发生改变，从0开始搜索
        if (this.value6 !== null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>


