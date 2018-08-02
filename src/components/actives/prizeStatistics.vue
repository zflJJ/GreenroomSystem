<template>
  <div>
    <h2>奖品发放统计</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="奖品名称">
        <el-input placeholder="请输入奖品名称" v-model.trim="searchFromData.prizeName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="领取用户">
        <el-input placeholder="请输入领取用户" v-model.trim="searchFromData.phone" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="奖励触发途径">
        <el-select v-model="searchFromData.triggerType" placeholder="全部">
          <el-option
            v-for="item in triggerTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="获奖时间">
        <div class="block">
          <el-date-picker
            v-model="searchFromData.time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="序号" prop="id">
        </el-table-column>
        <el-table-column label="奖品名称" prop="prizeName">
        </el-table-column>
        <el-table-column label="领取用户" prop="phone">
        </el-table-column>
        <el-table-column label="数量"prop="number">
        </el-table-column>
        <el-table-column label="活动名称"prop="activityName">
        </el-table-column>
        <el-table-column label="奖励触发途径"prop="triggerTypeStr">
        </el-table-column>
        <el-table-column label="获奖时间">
          <template slot-scope="scope">
            {{scope.row.createTime | moment}}
          </template>
        </el-table-column>
      </el-table>
    </template>
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
        isLoading: false,  // 搜索是否禁用
        isSearch: 0, // 是否进行了搜索
        searchFromData: {
          prizeName:"",
          phone:"",
          triggerType:"",
          time:'',
        },
        triggerTypes:[{
          value: '-1',
          label: '全部'
        },{
          value: '1',
          label: '邀请'
        },{
          value: '2',
          label: '注册'
        },{
          value: '3',
          label: '首次下单'
        },{
          value: '4',
          label: '绑车牌'
        }],
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
        datas.triggerType = -1;
        if (this.searchFromData.prizeName) datas.prizeName = this.searchFromData.prizeName;
        if (this.searchFromData.phone) datas.phone = this.searchFromData.phone;
        if (this.searchFromData.triggerType) datas.triggerType = this.searchFromData.triggerType;
        if (this.searchFromData.time) {
            try {
              datas.time = this.searchFromData.time.getTime();
            }catch (err){
              datas.time = '';
            }
        }
        var datas = Qs.stringify(datas);
        this.$http.post("activity/prize/receive/list", datas).then(res => {
          if(res.data.error_code == 2000){
            this.dataItems = res.data.data.dataList;
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
            this.seachLoading = false;
          }else {
            this.$message.error(res.data.error_message)
            this.seachLoading = true;
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log(err);
        })
      },
      formatDuring() {
        var date = new Date(this.searchFromData.time);  //当前标准时间格式
        var year = date.getFullYear(); //取得四位数的年份
        var month = date.getMonth()+1; //返回0~11之间的数字，0代表一月，11代表12月
        var day = date.getDate(); //返回天数，0~31，getDay()返回的是星期几（0~6）
        return year+''+month+''+day;
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.prizeName == '' && this.searchFromData.phone == '' && this.searchFromData.triggerType == '' && this.searchFromData.time== "") {
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
            this.seachLoading = false;
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.isSearch = 1;
            this.getData();
          }
        } else if (this.isSearch == 1) {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.prizeName == '' && this.searchFromData.phone == '' && this.searchFromData.triggerType == '' && this.searchFromData.time== "") {
            this.start = 0;
            this.isSearch = 0;
          }
          this.getData();
        };
      },
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.prizeName == '' && this.searchFromData.phone == '' && this.searchFromData.triggerType == '' && this.searchFromData.time== "") {
          this.$message.error('错了哦，导出的字段不能为空，请输入要导出的字段');
          this.isLoading = false;
        } else {
          var exportDatas = {};
          if (this.searchFromData.prizeName) exportDatas.prizeName = this.searchFromData.prizeName;
          if (this.searchFromData.phone) exportDatas.phone = this.searchFromData.phone;
          if (this.searchFromData.triggerType) exportDatas.triggerType = this.searchFromData.triggerType;
          if (this.searchFromData.time) {
            try {
              exportDatas.time = this.searchFromData.time.getTime();
            }catch (err){
              exportDatas.time = '';
            }
          }
          var data = Qs.stringify(exportDatas);
          this.$http.post('activity/prize/receive/list/excel', data, {responseType: 'blob'}).then((res) => {
            this.isLoading = false;
            var filename = '奖品发放统计表格'
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
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
