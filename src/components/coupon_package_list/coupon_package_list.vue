<template>
  <div class="coupon-package-list">
    <h2>优惠套餐列表</h2>
    <br>
    <el-form :inline="true" class="demo-form-inline" :model="requireParams">
      <el-form-item label="套餐名称">
        <el-input placeholder="请输入套餐名称" v-model.trim="requireParams.name"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="requireParams.state" placeholder="全部">
          <el-option v-for="item in options" :key="item.estateType" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength" class="divStyle-sel"></selectchild>
      <el-button type="primary" @click="searchResultE">搜索</el-button>
      <el-button type="success" @click="derivedTableE">导出数据</el-button>
    </div>

    <template>
      <el-table :data="tableItems" border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="套餐名称" prop="name">
        </el-table-column>
        <!-- type -->
        <el-table-column label="套餐类型" prop="typeStr">
        </el-table-column>
        <el-table-column label="有效期" prop="effectiveTime" width="220px;">
        </el-table-column>
        <el-table-column label="车牌数量上限" prop="toplimit">
        </el-table-column>
        <el-table-column label="剩余数量" prop="inNumber">
        </el-table-column>
        <!-- 处理时间 updateTime-->
        <el-table-column label="编辑时间" width="180px;">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime != null">{{scope.row.updateTime | moment}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- state -->
        <el-table-column label="状态" prop="stateStr">
        </el-table-column>

        <el-table-column label="操作" width="300px;">
          <!-- 编辑和上下架是对等的 -->
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addNewComboE(scope.row.id, 'x')">详情</el-button>
            <!-- 下架传2 上架传1 -->
            <el-button type="info" size="mini" v-if="scope.row.state == 1 || scope.row.state == 4" @click="upOdownframeE(2,scope.row.id)">下架</el-button>
            <el-button type="success" size="mini" v-else-if="scope.row.state == 2 || scope.row.state == 3" @click="upOdownframeE(1,scope.row.id)">上架</el-button>
            <el-button type="warning" size="mini" :disabled="scope.row.state == 1 || scope.row.state == 4" @click="addNewComboE(scope.row.id,'b')">编辑</el-button>
            <!-- statistics -->
            <el-button type="danger" size="mini" @click="goToStatisticsE(scope.row)">统计</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" size="mini" icon="el-icon-circle-plus" @click="addNewComboE(-1,'a')">新增套餐</el-button>
    </div>
    <pagination :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></pagination>
  </div>
</template>

<script>
import selectchild from '@/components/commonpage/selectchild';
import pagination from '@/components/commonpage/paingchild';
import Qs from 'qs';
export default {
  name: 'coupon-package-list',
  data() {
    return {
      // 分页的数据
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 20,
      isSearch: 0, // 表示是否进行了搜索
      // 请求参数
      requireParams: {
        start: 0,
        length: 10,
        sEcho: 3,
        name: '',
        state: '',
      },
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '已上架'
      }, {
        value: '2',
        label: '已下架'
      }, {
        value: '3',
        label: '待上架'
      }, {
        value: '4',
        label: '已满额'
      }],
      // 请求回来的表格参数
      tableItems: [],
    }
  },
  created() {
    this.getTabbleList()
  },
  methods: {
    // 获取表格数据
    getTabbleList() {
      console.log(this.requireParams);
      this.requireParams.length = this.display
      this.$http.post('discountpackage/pagelist', Qs.stringify(this.requireParams))
        .then((res) => {
          if (res.data.error_code === 2000) {
            if (res.data.data.dataList.length == 0) {
              this.$message.error('未能匹配到数据请重新录入搜索条件，谢谢！！！')
              console.log(this.compage)
              this.compage = 1
              this.tableItems = res.data.data.dataList;
            } else {
              this.tableItems = res.data.data.dataList;
              this.total = parseInt(res.data.data.itotalRecords);
            }
          } else {
            this.$message.error(res.data.error_message);
          }
        })
        .catch((err) => {
          this.$message.error('接口报错，请联系开发人员，谢谢！！！');
        })
    },
    /**
     * @function upOdownframeE 对这个套餐进行上架和下架操作
     * @param state  1||2   下架传2 上架传1
     * @param id 操作的套餐ID;
    */
    upOdownframeE(state, id) {
      this.$http.post('discountpackage/updateState', Qs.stringify({ state: state, id: id }))
        .then((res) => {
          if (res.data.error_code === 2000) {
            this.getTabbleList()
          } else {
            this.$message.error(res.data.error_message)
          }
        })
        .catch((err) => {
          this.$message.error('接口有误，请联系开发人员，谢谢！！！')
        })
    },
    // 新增套餐
    addNewComboE(id, model) {
      this.$router.push({
        path: '/add_edit_combo',
        query: {
          id: id,
          model: model
        }
      })
    },
    // 跳转到统计页面去  套餐统计
    goToStatisticsE(item) {
      this.$router.push({
        path: '/package_statistics',
        query: {
          id: item.id,
          name: item.name,
          typeStr: item.typeStr
        }
      })
    },
    /**
     * @function 搜索数据的函数
    */
    searchResultE() {
      if (this.isSearch === 0) {
        if (!this.requireParams.name && !this.requireParams.state) {
          this.$message.error('错了哦，搜索到的是空数据，请重新输入搜索条件');
        } else {
          this.isSearch = 1;
          this.requireParams.start = 0;
          this.getTabbleList();
          this.compage = 1;
        }
      } else if (this.isSearch == 1) {
        if (!this.requireParams.name && !this.requireParams.state) {
          this.requireParams.start = 0;
          this.isSearch = 0;
        }
        this.compage = 1;
        this.getTabbleList();
      };
    },
    /**
     * @function 导出数据
     * @param name 套餐名称
     * @param state 表示状态
    */
    derivedTableE() {
      console.log(this.requireParams.name, this.requireParams.state)
      this.$http.post('discountpackage/excel', Qs.stringify({ name: this.requireParams.name, state: this.requireParams.state }), { responseType: 'blob' })
        .then((res) => {
          var filename = '优惠套餐列表数据'
          var blob = res.data;
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function (e) {
            var a = document.createElement("a");
            a.download = filename + ".xls";
            a.href = e.target.result;
            a.click();
          }
        })
        .catch((err) => {
          this.$message.error('接口有问题，请联系开发人员，谢谢！！！');
        })
    },
    /**
     * @function 改变页面数据展示长度的函数
     * @param len 表示改变的长度
    */
    getChildLength(len) {
      var pageData = 0, age = 0;
      pageData = this.display * (this.page - 1);
      if (pageData % len == 0) {
        age = (pageData / len + 1);
      } else {
        age = Math.ceil(pageData / len);
      }
      // age 是表示从哪一页开始
      this.requireParams.start = (age - 1) * len;
      this.page = age;
      this.compage = age;
      this.display = parseInt(len);
      if (this.isSearch == 0) {
        this.getTabbleList();
      } else if (this.isSearch == 1) {
        this.getTabbleList();
      }
    },
    /**
     * @function 改变页码的函数
     * @param val 表示点击的页码
    */
    pagechanges(val) {
      console.log(val);
      this.page = val;
      this.compage = val;
      console.log(this.compage);
      this.requireParams.start = (val - 1) * this.display;
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
.coupon-package-list .divStyle {
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

