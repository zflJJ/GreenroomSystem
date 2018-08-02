<template >
  <div>
    <h2>车位区域</h2>
    <div class="search_from">
      <el-form :inline="true" class="demo-form-inline" :model="parkingAreaData">
        <el-form-item label="小区名称">
          <el-input placeholder="小区名称" v-model.trim="parkingAreaData.parklotName" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="车位区域">
          <el-input placeholder="车位区域" v-model.trim="parkingAreaData.districtName" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" @click.native.prevent="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent(-1)" :loading="isLoading" class="isBtnStyle2">导出二维码</el-button>
    </div>
    <!--4.0 表格信息-->
    <template>
      <el-table style="width: 100%" :data="tableDatas" border>
        <el-table-column prop="id" width="80px" label="ID">
        </el-table-column>
        <el-table-column prop="parkLotName" label="小区名称">
        </el-table-column>
        <el-table-column width="200px" prop="parkLotTypeStr" label="小区类型">
        </el-table-column>
        <el-table-column prop="districtName" label="车位区域">
        </el-table-column>
        <el-table-column prop="contactPhone" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addArea(scope.row.id)">编辑</el-button>
            <el-button type="success" size="mini" @click="exportEvent(scope.row.id)" :disabled="scope.row.parkLotTypeStr == '车位查询'">二维码</el-button>
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button> -->
            <!-- <el-button size="small">二维码</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="addArea(-1)">新增区域</el-button>
    </div>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
  </div>

</template>

<script>
import Qs from 'qs';
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
import baseUrl from "../../../server/baseURL.js"
export default {
  data() {
    return {
      seachLoading: false,
      isLoading: false,
      isSearch: 0,
      // 分页插件数据
      compage: 1,
      display: 10,
      total: 0,
      pagegroup: 10,
      page: 1,
      // 请求接口的参数
      parkingAreaData: {
        parklotName: '',  // 小区名称
        districtName: '',  // 车位区域
        sEcho: 3,
        start: 0,
        length: 10,
      },
      tableDatas: [], // 列表中的数据
    }
  },
  created() {
    this.getParkingArea()
  },
  methods: {
    // 获取车位区域数据
    getParkingArea() {
      this.parkingAreaData.length = this.display
      let data = Qs.stringify(this.parkingAreaData)
      this.$http.post('district/pageable', data)
        .then((res) => {
          console.log(res)
          if (res.data.data.dataList.length == 0) {
            this.$message.error('未能匹配到数据请重新录入搜索条件，谢谢！！！')
            console.log(this.compage)
            this.compage = 1
            this.tableDatas = res.data.data.dataList;
          } else {
            this.tableDatas = res.data.data.dataList;
            this.total = parseInt(res.data.data.itotalRecords);
          }
        })
        .catch((err) => {
          this.$message.error('后台接口报错，请联系开发人员，谢谢！！！')
        })
    },
    getChildLength(len) {
      var pageData = 0, age = 0;
      pageData = this.display * (this.page - 1);
      if (pageData % len == 0) {
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
        this.getParkingArea();
      } else if (this.isSearch == 1) {
        this.getParkingArea();
      }
    },
    pagechanges(val) {
      console.log(val)
      this.compage = val;
      this.parkingAreaData.start = (val - 1) * this.display;
      // isSearch   1表示带参跳转页面  0 表示非带参
      this.getParkingArea();
      // if (this.isSearch == 1) {
      //   this.estateSearch();
      // } else {
      //   this.getParkingArea();
      // }
    },
    exportEvent(number) {
      let data = []
      if (number === -1) {
        if (this.tableDatas.length != 0) {
          for (let i = 0, len = this.tableDatas.length; i < len; i++) {
            let item = this.tableDatas[i]
            if (item.parkLotTypeStr != "车位查询") {
              data.push(item.id)
            }
          }
        } else {
          this.$message.error('没有可以导出的数据。')
          return
        }
      } else {
        data.push(number)
      }
      if (data.length == 0) {
        this.$message.error('车位查询的数据，不能够导出。')
        return;
      } else {
        location.href = baseUrl.requestUrl + "district/downloadAllQr?data=" + data.join();
      }
    },
    // 搜索数据
    searchEvent() {
      // 判断是否 为空
      // this.seachLoading = true;
      console.log(this.parkingAreaData)
      if (this.isSearch === 0) {
        if (!this.parkingAreaData.parklotName && !this.parkingAreaData.districtName) {
          this.$message.error('错了哦，搜索到的是空数据，请重新输入搜索条件');
          // this.seachLoading = false;
        } else {
          // 开始进行搜索
          this.isSearch = 1;
          this.parkingAreaData.start = 0;
          this.getParkingArea();
          this.compage = 1;
        }
      } else if (this.isSearch == 1) {
        if (!this.parkingAreaData.parklotName && !this.parkingAreaData.districtName) {
          this.parkingAreaData.start = 0;
          this.isSearch = 0;
        }
        this.compage = 1;
        this.getParkingArea();
      };
    },
    addArea(id) {
      this.$router.push({
        path: '/add_parkingarea',
        query: {
          area: id
        }
      });
    }

  },
  components: {
    selectchild,
    paingchild
  },
}

</script>

<style scoped>
.search_from {
  margin-top: 20px;
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
}
</style>


