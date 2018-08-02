<template>
  <div class="package_statistics">
    <h2>套餐统计</h2>
    <br>
    <el-form :inline="true" class="demo-form-inline" :model="form">
      <el-form-item label="套餐名称">
        <el-input placeholder="请输入套餐名称" v-model.trim="form.name" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="套餐类型">
        <el-input  v-model.trim="form.type" :disabled=true></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.packageState" placeholder="全部">
          <el-option v-for="item in options" :key="item.estateType" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input placeholder="请输入车牌号" v-model.trim="form.number"></el-input>
      </el-form-item>
      <el-form-item label="剩余天数">
        <el-select v-model="form.inNumber" placeholder="全部">
          <el-option v-for="item in inNumberOptions" :key="item.estateType" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span>有效车牌号: {{realQuantity}}  剩余数量:{{overNumber}}  </span>
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength" class="divStyle-sel"></selectchild>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading">导出数据</el-button>
    </div>
    <template>
      <el-table :data="tableItems" border style="width: 100%">
        <el-table-column label="ID" prop="packageId">
        </el-table-column>
        <el-table-column label="车牌号" prop="number">
        </el-table-column>
        <el-table-column label="使用时效" prop="effectiveTime">
        </el-table-column>
        <el-table-column label="剩余天数" prop="inNumber">
        </el-table-column>
        <el-table-column label="状态" prop="termState">
        </el-table-column>
      </el-table>
    </template>
    <pagination :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></pagination>
  </div>
</template>

<script>
  import selectchild from '@/components/commonpage/selectchild';
  import pagination from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    name: 'package_statistics',
    data() {
      return {
        // 分页的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 10,
        isSearch:0,
        isLoading:false,
        // 请求参数
        form: {
          start: 0,
          length: 10,
          sEcho: 3,
          name: this.$route.query.name,
          type: this.$route.query.typeStr,
          id: this.$route.query.id,
          packageState:'',
          number:'',
          inNumber:'',
        },
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '2',
          label: '已到期'
        }, {
          value: '3',
          label: '已过期'
        }],
        inNumberOptions:[{
          value: '',
          label: '全部'
        }, {
          value: '10',
          label: '≤10天'
        }, {
          value: '30',
          label: '≤30天'
        }],
        // 请求回来的表格参数
        tableItems: [],
        realQuantity:"0",
        overNumber:"0",
        seachLoading:true,
      }
    },
    created() {
      this.getTabbleList()
    },
    methods: {
      // 获取表格数据
      getTabbleList() {
        var data = {
          sEcho:this.form.sEcho,
          start:this.form.start,
          length:this.display,
          id:this.form.id,
        }
        if(this.form.name) data.name = this.form.name;
        if(this.form.number) data.number = this.form.number;
        if(this.form.inNumber) data.inNumber = this.form.inNumber;
        if(this.form.packageState) data.packageState = this.form.packageState;
        this.$http.post('discountpackage/pageStaticlist', Qs.stringify(data))
          .then((res) => {
          if (res.data.error_code === 2000) {
            if (res.data.data.dataList.length == 0) {
              this.$message.error('未能匹配到数据请重新录入搜索条件，谢谢！！！')
              this.compage = 1
              this.tableItems = res.data.data.dataList;
              this.total = parseInt(res.data.data.itotalRecords);
            } else {
              this.tableItems = res.data.data.dataList;
              this.total = parseInt(res.data.data.itotalRecords);
              this.realQuantity = res.data.data.dataList[0].realQuantity;
              this.overNumber = res.data.data.dataList[0].overNumber;
            }
          } else {
            this.$message.error(res.data.error_message);
            this.tableItems = res.data.data.dataList;
            this.total = parseInt(res.data.data.itotalRecords);
          }
          this.seachLoading = false;
        })
        .catch((err) => {
          this.seachLoading = false;
          this.$message.error('接口报错，请联系开发人员，谢谢！！！');
        })
      },
      //获取搜索的内容
      searchEvent() {
        this.seachLoading = true;
        if (this.isSearch === 0) {
          if (this.form.packageState === "" && this.form.number === "" && this.form.inNumber === "") {
            this.$message.error('错了哦，搜索到的是空数据，请重新输入搜索条件');
            this.seachLoading = false;
          } else {
            // 开始进行搜索
            this.isSearch = 1;
            this.form.start = 0;
            this.compage = 1;
            this.getTabbleList();
          }
        } else if (this.isSearch == 1) {
          if ( this.form.packageState === "" && this.form.number === "" && this.form.inNumber === "") {
            this.form.start = 0;
            this.compage = 1;
            this.isSearch = 0;
          }
          this.getTabbleList();
        };
      },
      // 导出数据
      exportEvent() {
        this.isLoading = true;
        // if (this.form.packageState === "" && this.form.number === "" && this.form.inNumber === "") {
        //   this.$message.error('错了哦，导出的字段不能为空，请输入要导出的字段');
        //   this.isLoading = false;
        // } else {
          var exportDatas = {};
          if (this.form.packageState) exportDatas.packageState = this.form.packageState;
          if (this.form.number) exportDatas.number = this.form.number;
          if (this.form.inNumber) exportDatas.inNumber = this.form.inNumber;
          exportDatas.id = this.$route.query.id
          var data = Qs.stringify(exportDatas);
          this.$http.post('discountpackage/excelStatic', data, { responseType: 'blob' }).then((res) => {
              this.isLoading = false;
          var filename = '优惠套餐列表表格'
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
        // }
      },
      clearStart() {
        this.start = 0;
        this.compage = 1;
      },
      pagechanges(val) {
        console.log(val);
        this.page = val;
        this.compage = val;
        this.form.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getTabbleList();
        } else if (this.isSearch == 1) {
          this.getTabbleList();
        }
      },
      // 下拉菜单的选择器
      getChildLength(len) {
        var pageData = 0, age = 0;
        pageData = this.display * (this.page - 1);
        if (pageData % len == 0) {
          console.log(123);
          age = (pageData / len + 1);
        } else {
          age = Math.ceil(pageData / len);
        }
        // age 是表示从哪一页开始
        this.form.start = (age - 1) * len;
        this.page = age;
        this.compage = age;
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          this.getTabbleList();
        } else if (this.isSearch == 1) {
          this.getTabbleList();
        }
      },
    },
    components: {
      selectchild,
      pagination
    }
  }
</script>

<style scoped>
  .package_statistics .divStyle {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .divStyle > .divStyle-sel {
    flex: 1;
  }
  .bottomStyle {
    border: 1px solid #ebeef5;
    border-top: none;
    padding: 5px 20px;
    height: 40px;
    line-height: 40px;
    text-align: right;
  }
</style>
