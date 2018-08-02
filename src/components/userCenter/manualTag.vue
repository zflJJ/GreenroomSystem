<template>
  <div class="addTagStyle">
    <h2>{{title}}</h2>
    <br>
    <el-form label-width="80px">
      <el-form-item label="*标签名称">
        <el-input v-model="name" placeholder="请输入标签名称" :maxlength=20></el-input>
      </el-form-item>
      <el-form-item label="标签描述">
        <el-input
          :maxlength=100
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="comment">
        </el-input>
      </el-form-item>
    </el-form>

    <br>
    <div class="searchStyle">
      <el-form label-width="70px" :model="searchFromData">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="手机号">
                <el-input type="text" placeholder="请输入手机号" v-model.trim="searchFromData.phone" @change="clearStart"
                          @keyup.enter.native="searchEvent"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <el-form-item label="用户类型">
                <el-select clearable placeholder="全部" width="100%" v-model="searchFromData.userType"
                           @change="clearStart">
                  <el-option v-for="item in channelObj" :label="item.text" :value="item.userType" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>

    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        ref="table"
        :row-key="getRowKeys"
        @select="getRowOne"
        @select-all="getRowAll"
        border>
        <el-table-column
          :reserve-selection="true"
          type="selection">
        </el-table-column>
        <el-table-column
          label="ID"
          prop="userId">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="userTypeStr"
          label="用户类型">
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <!--提交和取消按钮-->
    <div style="margin-top:80px;">
      <el-button @click="returnBack">返回</el-button>
      <el-button v-if="title!='查看手动标签'" type="primary" @click="submit" :disabled="isDisabled">提交</el-button>
    </div>
  </div>
</template>
<style scoped>
  .searchStyle {
    height: 100%;
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
        checked: false,
        title: this.$route.query.title,
        id: this.$route.query.id,
        name: '',//标签名称
        comment: '',//标签,描述
        userIdList: [],//要提交用户ID
        bindUsers: [],//详情,编辑返回的绑定的用户数据
        isDisabled: false,
        tableArray: [],//选中的数据
        searchFromData: {//搜索的数据
          phone: '',
          userType: '',
        },
        seachLoading: false,
        // 分页要处理的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        isSearch: 0,
        tableDatas: [],//表格的数据
        channelObj: [  // 用户类型的下拉框
          {userType: -1, text: '全部'},
          {userType: 0, text: '车主'},
          {userType: 1, text: '业主'},
          {userType: 2, text: '管理员'}
        ],
        flag: 0,
        getRowKeys(row) {
          return row.userId;
        },
      }
    },
    created(){
      this.getData();
      if (this.title == "添加手动标签") {
        this.getTableDatas();
      }
    },
    methods: {
      //详情,编辑进入获取信息
      getData(){
        if (!this.id) return false;
        var data = Qs.stringify({tagId: this.id});
        //获取标签名称及选中的数据
        this.$http.post("tag/manual/info", data).then(res => {
          if (res.data.error_code == 2000) {
            this.name = res.data.data.name;
            this.comment = res.data.data.comment;
            this.bindUsers = res.data.data.tagUserListDataList;
            this.tableArray = res.data.data.tagUserListDataList;
            this.userId = res.data.data.bindUsers;
          } else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
            console.log(err)
        })
        this.getTableDatas();
      },
      // 获取表格信息
      getTableDatas(){

        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        if (this.id) {
          datas.tagId = this.id
        }
        var data = Qs.stringify(datas);
        this.$http.post('tag/manual/user/list', data).then(res => {
          if (res.data.error_code === 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
            //判断数据带有isBind就选中
            for (var i = 0; i < this.tableDatas.length; i++) {
              if (this.tableDatas[i].isBind == 1 && this.isSearch == 0) {
                this.$refs.table.toggleRowSelection( this.tableDatas[i],true);
              }
            }
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
            console.log('服务端错误' + err);
        })
      },
      //获取搜索的内容
      searchEvent(){ // 做判断和验证
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          if (this.searchFromData.phone == "" && this.searchFromData.userType === "") {
            this.seachLoading = false;
            this.$message.error("输入的搜索内容不能为空，请填入搜索字段");
          } else {
            this.start = 0;
            // 开始进行带参分页
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.phone == "" && this.searchFromData.userType === "") {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
            this.getTableDatas();  // 做了对图像的处理
          } else{
            this.paramsData();
          }
        }
      },
      // 带参搜索数据
      paramsData(){
        var data1 = {};
        this.isSearch = 1;
        // 对参数进行处理
        data1.start = this.start;
        data1.sEcho = 3;
        data1.length = this.display;
        if (this.id) {
          data1.tagId = this.id
        }
        if (this.searchFromData.phone !== '') data1.phone = this.searchFromData.phone;
        if (this.searchFromData.userType !== '') data1.userType = this.searchFromData.userType;
        var datas = Qs.stringify(data1);
        this.$http.post('tag/manual/user/list', datas).then(res => {
          // 按钮不用禁用了
          this.seachLoading = false;
          if (res.data.error_code == 2000) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
            for (var i = 0; i < this.tableDatas.length; i++) {
              if (this.tableDatas[i].isBind == 1 && this.isSearch == 0) {
                this.$refs.table.toggleRowSelection( this.tableDatas[i],true);
              }
            }
          } else if (res.data.error_code == 2000) {
            this.seachLoading = false;
            this.$message.error("输入的搜索内容不能为空，请填入搜索字段");
          } else {
            this.$message.error(res.data.error_message);
          }
        }).catch(err => {
            this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },
      // 下拉菜单的数据  和 分页都还没有做处理
      getChildLength(len){
        var pageData = 0, age = 0;
        pageData = this.display * (this.page - 1);
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
      // 实时获取 表格中的单选数据的时候(单选的时候)
      getRowOne(selection, row){
        this.tableArray = selection;
      },
      // 当点击多选的时候，选中的数据
      getRowAll(selection, row){
        this.tableArray = selection;
      },

      submit(){
        if (this.name.trim() == "" || this.tableArray.length == 0) {
          this.$message.error("请完善标签信息");
          return false;
        }
        var arrId = [];
        var obj = {};
        for (var i = 0; i < this.tableArray.length; i++) {
//          if (!obj[this.tableArray[i].userId]) {
//            obj[this.tableArray[i].userId] = 1;
//            arrId.push(this.tableArray[i].phone);
          this.userIdList += this.tableArray[i].userId + ",";
//          }
        }
        this.userIdList = this.userIdList.split(",");
        this.userIdList.pop();
        var data = {
          tagName: this.name,
          comment: this.comment,
          userIds: this.userIdList,
        }
        if (this.id) {
          data.tagId = this.id
        }
        data = Qs.stringify(data);
        this.$http.post("tag/manual/saveOrUpdate", data).then(res => {
          if (res.data.error_code == 2000) {
            // 清空搜索框里面的数据
            if (this.searchFromData.userType) this.searchFromData.userType = '';
            if (this.searchFromData.phone) this.searchFromData.phone = '';
            this.tableArray = [];
            this.userIdList = [];
            this.$refs.table.clearSelection();   // 数据提交成功之后，应该将模态框表格选中的状态给清空掉
            this.$router.push({path: 'tag_list'});
          } else {
            this.$message.error(res.data.error_message);
            this.userIdList = [];
        }
        }).catch(err => {
            this.$message.error(err);
        })
      },
      returnBack(){
        this.$router.push({path: 'tag_list'});
      },
      //数组去重
      unique(arr){
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
          if (!json[arr[i]]) {
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        return res;
      }
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
