<template>
  <div>
    <h2>编辑网关</h2>
    <el-form label-position="top" label-width="80px" :model="formLabelAlign">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*网关ID" prop="identifier">
              <el-input v-model="formLabelAlign.identifier" :maxlength="16"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*网关名称" prop="name">
              <el-input v-model="formLabelAlign.name" placeholder="请输入网关名称" :maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="路由器" prop="routerName">
              <el-input v-model="formLabelAlign.routerName" placeholder="请选择路由器" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="" prop="">
              <el-button class="bindButton" type="primary" plain @click="bindOfRouter">点击绑定</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="submitForm">提交</el-button>
    <el-button type="primary" @click="toBefore">返回</el-button>

    <!--路由器的模态框-->
    <el-dialog title="选择路由器" width="60%" :show-close='false' :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogRouterTable" custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" :model="routerSearchFromData">
          <el-form-item label='路由器名称'>
            <el-input placeholder="请输入路由器名称" v-model.trim="routerSearchFromData.name" @change="clearStart" @keyup.enter.native="routerSearch"></el-input>
          </el-form-item>
          <div class="divStyle">
            <selectchild v-on:getlength="getChildLength"></selectchild>
            <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
            <el-button type="primary" @click="routerSearch" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
          </div>
        </el-form>
      </div>
      <template>
        <el-table style="width: 100%" :data="routerTableDatas" ref="singleRouterTable" row-key="id" border>
          <el-table-column prop="id" width="100px" label="ID">
          </el-table-column>
          <el-table-column prop="name" label="路由器名称">
          </el-table-column>
          <el-table-column prop="number" label="路由器编号">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="bindRouter(scope.row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechangesRouter"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogRouterTable">取消</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<style>
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
}

.searchStyle {
  height: 50px;
}

.isInfoStyle {
  color: red;
}

.bindButton {
  position: absolute;
  top: 50px;
}
</style>

<script>
import Qs from 'qs';
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
export default {
  data() {
    return {
      formLabelAlign: {
        identifier: '',
        name: '',
        routerName: '',
        routerId: ''
      },
      //分页的数据
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 0,
      start: 0,
      text: '',
      isflag: false,
      // 搜索和导出的变量
      seachLoading: false,  // 搜索是否禁用
      isSearch: 0, // 是否进行了搜索

      //绑定路由器的
      dialogRouterTable: false,
      routerTableDatas: null,//路由器的数据
      routerSearchFromData: {//路由器的搜索
        name: '',
      },
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http("gateway/" + this.$route.query.gatewayId).then(res => {
        this.formLabelAlign.identifier = res.data.data.identifier;
        this.formLabelAlign.name = res.data.data.name;
        this.formLabelAlign.routerName = res.data.data.routerName;
      })
    },
    // 提交数据
    submitForm() {
      if (!this.formLabelAlign.identifier || !this.formLabelAlign.name) {
        this.$message.error('所有*号内容为必填');
      } else if (this.formLabelAlign.identifier.length != 16) {
        this.$message.error('网关ID应为16位字符');
      } else {
        var data = {
          id: this.$route.query.gatewayId,
          identifier: this.formLabelAlign.identifier,
          routerId: this.formLabelAlign.routerId,
          name: this.formLabelAlign.name,
        }
        data = Qs.stringify(data)
        this.$http.post('gateway/save', data).then((res) => {
          if (res.data.error_code == 2000) {
            this.$message.success('恭喜你，编辑网关成功了');
            this.$router.go(-1);
          } else {
            this.$message.error('错了哦，服务器返回了' + res.data.error_message);
          };
        }).catch((err) => {
          console.log(err);
        })
      }
    },
    // 返回上一页
    toBefore() {
      this.$router.go(-1);
    },
    //绑定路由器----------------
    bindOfRouter() {
      this.dialogRouterTable = true;
      this.getRouterData();
    },
    //获取数据
    getRouterData() {
      this.routerTableDatas = [];
      var isData = {
        length: this.display,
        start: this.start,
        sEcho: 3,
      }
      var data = Qs.stringify(isData);
      this.$http.post('router/pageable', data).then((res) => {
        this.seachLoading = false;
        if (res.data.error_code !== 2000 && res.data.data.dataList.length != 0) {
          this.error_code = 0;
        } else {
          this.seachLoading = false;
          console.log(res.data.data.dataList);
          this.routerTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
        }
      }).catch((err) => {
        this.seachLoading = false;
        console.log(err);
      });
    },
    //搜索
    routerSearch() {
      console.log(this.routerSearchFromData)
      this.seachLoading = true;
      if (this.isSearch == 0) {
        if (this.routerSearchFromData.name === "") {
          this.isflag = true;
          this.text = "输入的搜索内容不能为空，请填入搜索字段";
          clearInterval(timeId);
          var timeId = setInterval(() => {
            this.isflag = false;
            this.text = '';
            this.seachLoading = false;
            clearInterval(timeId);
          }, 3000);
          return;
        } else {
          this.start = 0;
          this.isSearch = 1;
          this.paramsrouterData();
        }

      } else if (this.isSearch == 1) {
        if (this.routerSearchFromData.name === "") {
          this.start = 0;
          this.isSearch = 0;
          this.getRouterData();
        } else {
          this.paramsrouterData();
        }
      };
    },
    //带参搜索
    paramsrouterData() {
      this.isSearch = 1;
      var datas = {};
      datas.start = this.start;
      datas.sEcho = 3;
      datas.length = this.display;
      if (this.routerSearchFromData.name) datas.name = this.routerSearchFromData.name;
      this.routerTableDatas = [];
      // 开始发送请求
      var data = Qs.stringify(datas);
      this.$http.post('router/pageable', data).then(res => {
        this.seachLoading = false;
        this.routerTableDatas = res.data.data.dataList;
        // 当数据回来之后再做页码处理
        this.total = parseInt(res.data.data.itotalRecords);

      }).catch(err => {
        this.seachLoading = false;
        console.log('服务端错误' + err);
      })
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
        this.getRouterData();
      } else if (this.isSearch == 1) {
        this.paramsrouterData();
      }
    },
    //绑定
    bindRouter(row) {
      console.log(row)
      this.dialogRouterTable = false;
      this.formLabelAlign.routerId = row.id;
      this.formLabelAlign.routerName = row.name;
      // 确定数据
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      this.routerSearchFromData.name = '';
      this.dialogRouterTable = false;
    },
    //取消按钮
    closeDialogRouterTable() {
      // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      this.routerSearchFromData.name = '';
      this.dialogRouterTable = false;
    },
    // 分页菜单的数据
    pagechangesRouter(val) {
      this.page = val;
      this.compage = val;
      this.start = (val - 1) * this.display;
      if (this.isSearch == 1) {
        this.pakingSearch();
      } else {
        this.getRouterData();
      }
    },
    // 输入框发生改变的时候
    clearStart() {
      this.compage = 1;
      this.start = 0; // 改变从0开始搜索
    },
  },
  updated() {
  },
  components: {
    paingchild,
    selectchild,
  },
}
</script>
