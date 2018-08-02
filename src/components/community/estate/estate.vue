<template>
  <div class="estate">
    <h2>小区列表</h2>
    <!--1.0 搜索框-->
    <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
      <el-form-item label="小区名称">
        <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.name" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="小区类型">
        <el-select v-model="searchFromData.type" placeholder="全部">
          <el-option v-for="item in options" :key="item.estateType" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle3">导出数据</el-button>
      <el-button type="success" @click="exportQrCodeEvent(-1)" :loading="isLoading" class="isBtnStyle2">导出二维码</el-button>
    </div>

    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="小区ID" prop="id">
        </el-table-column>
        <el-table-column label="小区名称" prop="name" width="150px">
        </el-table-column>
        <el-table-column label="小区地址" prop="address">
        </el-table-column>
        <el-table-column label="小区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1&&scope.row.innershareStr=='内部共享'">约车场内部共享</span>
            <span v-else-if="scope.row.type==2&&scope.row.innershareStr=='内部共享'">约车位内部共享</span>
            <span v-else-if="scope.row.type == 2">约车位</span>
            <span v-else-if="scope.row.type==1">约车场</span>
            <span v-else-if="scope.row.type==0">车位查询</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="小区总车位数量">
        </el-table-column>
        <el-table-column prop="signedAmount" label="签约车位数量">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span style="color:#67C23A" v-if="scope.row.state==1">已开放</span>
            <span style="color:red" v-else>已关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="更多信息">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="toeOrderDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="estateRevamp(scope.row.id)">修改小区</el-button>
            <el-button size="mini" type="success" @click="exportQrCodeEvent(scope.row.id)" :disabled="scope.row.type == 0">二维码</el-button>
          </template>
        </el-table-column>

      </el-table>
    </template>

    <div class="bottomStyle">
      <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addEntrance">新增小区</el-button>
    </div>
    <pagination :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></pagination>

  </div>
</template>
<script>
import selectchild from '@/components/commonpage/selectchild';
import pagination from '@/components/commonpage/paingchild';
import baseUrl from '../../../server/baseURL.js';
import Qs from 'qs';
export default {
  //显示的声明组件
  data() {
    return {
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 0,
      start: 0,
      // 新增需求
      idred: '',

      // 可能存在问题
      dialogFormVisible: false,
      dataItems: [],
      // 传递的数据


      // 模态框编辑和删除是否禁用标识
      flag: false,
      // 是否显示模态框的小叉
      isShow: false,
      // 提示信息的显示(默认不显示，只有点击增加的时候并且没有内容的时候显示为true)
      isSpan: false,


      // 搜索和导出的变量
      seachLoading: false,  // 搜索是否禁用
      isLoading: false, // 导出是否可用
      isSearch: 0, // 是否进行了搜索
      isflag: '',
      text: '',
      // 这个是搜索区域的内容
      searchFromData: {
        name: "",
        type: ""
      },
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '2',
        label: '约车位'
      }, {
        value: '1',
        label: '约车场'
      }, {
        value: '0',
        label: '车位查询'
      }, {
        value: '3',
        label: '约车场内部共享'
      }, {
        value: '4',
        label: '约车位内部共享'
      }],
    };
  },
  created() {
    this.getEstateData();
  },
  methods: {

    /*整合无参分页和带参分页*/
    getEstateData() {
      var datas = {};
      datas.start = this.start;
      datas.sEcho = 3;
      datas.length = this.display;
      if (this.searchFromData.name) datas.name = this.searchFromData.name;
      if (this.searchFromData.type) {
        var type = this.searchFromData.type;
        if (type == 3) {
          datas.type = 1;
          datas.innershare = datas.type = 1;
          datas.innershare = 1
        } else if (type == 4) {
          datas.type = 2;
          datas.innershare = 1
        } else {
          datas.type = type;
          datas.innershare = 0
        }
      }
      var data = Qs.stringify(datas);
      this.$http.post('parklot/pageable', data).then((res) => {
        if (res.data.error_code === 2000 && res.data.data.itotalRecords.length != '0') {
          this.seachLoading = false;
          // 赋值表格处理数据, 表格的总量
          this.total = parseInt(res.data.data.itotalRecords);
          this.dataItems = res.data.data.dataList;
        } else if (res.data.error_code === 2001 && this.isSearch === 1) {
          this.$message.error('错了哦，搜索到的是空数据，请重新输入搜索条件');
          this.seachLoading = false;
        } else {
          console.log(res.data.erroced);
        }
      }).catch((err) => {
        this.seachLoading = false;
        console.log(err);
      })
    },
    //获取搜索的内容
    searchEvent() {
      this.seachLoading = true;
      if (this.isSearch === 0) {
        if (this.searchFromData.name === "" && this.searchFromData.type === "") {
          this.$message.error('错了哦，搜索到的是空数据，请重新输入搜索条件');
          this.seachLoading = false;
        } else {
          // 开始进行搜索
          this.isSearch = 1;
          this.start = 0;
          this.getEstateData();
        }
      } else if (this.isSearch == 1) {
        if (this.searchFromData.name === "" && this.searchFromData.type === "") {
          this.start = 0;
          this.isSearch = 0;
        }
        this.getEstateData();
      };
    },
    clearStart() {
      this.start = 0;
      this.compage = 1;
    },

    // 分页的地方(这里逻辑还有待处理)
    pagechanges(val) {
      console.log(val);
      this.page = val;
      this.compage = val;
      console.log(this.compage);
      this.start = (val - 1) * this.display;
      if (this.isSearch == 0) {
        this.getEstateData();
      } else if (this.isSearch == 1) {
        this.getEstateData();
      }
    },
    // 下拉菜单的选择器
    getChildLength(len) {
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
        this.getEstateData();
      } else if (this.isSearch == 1) {
        this.getEstateData();
      }
    },

    // 导出数据
    exportEvent() {
      this.isLoading = true;
      if (this.searchFromData.name === "" && this.searchFromData.type === "") {
        this.$message.error('错了哦，导出的字段不能为空，请输入要导出的字段');
        this.isLoading = false;
      } else {
        var exportDatas = {};
        if (this.searchFromData.name) exportDatas.name = this.searchFromData.name;
        if (this.searchFromData.type) exportDatas.type = this.searchFromData.type;
        var data = Qs.stringify(exportDatas);
        this.$http.post('parklot/excel', data, { responseType: 'blob' }).then((res) => {
          this.isLoading = false;
          var filename = '小区列表表格'
          var blob = res.data;
          console.log(blob);
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function (e) {
            console.log(e);
            var a = document.createElement("a");
            a.download = filename + ".xls";
            a.href = e.target.result;
            a.click();
          }
        }).catch((err) => {
          this.$message.error('错了哦，输入的导出字段有误，请重新确认导出的字段！');
          this.seachLoading = false;
        })
      }
    },

    exportQrCodeEvent(parklotid) {
      let data = []
      if (parklotid != -1) {
        data.push(parklotid)
      } else {
        if (this.dataItems.length == 0) {
          this.$message.error('没有可以导出的数据')
        }
        for (let i = 0, len = this.dataItems.length; i < len; i++) {
          let item = this.dataItems[i]
          if (item.type != 0) {
            data.push(item.id)
          }else {

          }
        }
      }
      if (data.length === 0) {
        this.$message.error('该类型小区没有二维码');
        return false;
      }
      location.href = baseUrl.requestUrl + "parklot/downloadAllQr?data=" + data.join();
    },


    //跳转到小区详情界面{{this.$route.params.allId}}{{this.$route.params.threeId}}
    toeOrderDetail(id) {
      //        this.$router.push({path: 'estateOrderDetail', query: {allId: id}})
      this.$router.push({ path: 'estateDetail', query: { estateId: id } })
      //        this.$router.push({path: 'estateAdd',query:{estateId:id,getInfo:2}});

    },

    // 跳转到修改小区列表
    estateRevamp(id) {
      this.$router.push({ path: 'estateRevamp', query: { estateId: id } });
      //        this.$router.push({path: 'estateAdd',query:{estateId:id,getInfo:1}});

    },
    // 跳转到新增小区物业
    addEntrance() {
      //        this.$router.push({path: 'estateadds'});
      this.$router.push({ path: 'estateAdd', query: { estateId: 0, getInfo: 0 } });
    },
  },

  // 子组件
  components: {
    pagination,
    selectchild,
  },
};
</script>


<style scoped>
.divStyle > .isBtnStyle1 {
  position: absolute;
  right: 300px;
  top: 13px;
}

.divStyle > .isBtnStyle2 {
  position: absolute;
  right: 0px;
  top: 13px;
}
.divStyle > .isBtnStyle3 {
  position: absolute;
  right: 150px;
  top: 13px;
}

.isShowStyle {
  top: 25px;
  position: absolute;
  right: 500px;
  color: red;
}

.divStyle {
  position: relative;
  height: 60px;
}

.el-form {
  margin-top: 14px;
}

.el-form-item {
  margin-bottom: 0px;
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

.estate td {
  vertical-align: middle;
}

h2 {
  margin: 0;
  padding: 0;
}

.estate td > sapan {
  display: inline-block;
  height: 30px;
  padding: 20px;
}

.colspan p {
  font-size: 16px;
  color: red;
}

/*显示模态框的提示信息*/
.spanStyle {
  color: red;
}
</style>
