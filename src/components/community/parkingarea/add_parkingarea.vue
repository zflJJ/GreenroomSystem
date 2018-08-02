<template>
  <div>
    <h2>新增区域</h2>
    <div class="add_parkingarea">
      <el-form label-width="80px" class="demo-ruleForm" label-position="left" :model="formData">
        <el-row>
          <el-col :span="8">
            <el-form-item label="*区域名称">
              <el-input :maxlength="20" v-model.trim="formData.districtName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="*小区名称">
              <el-input :disabled="true" v-model="formData.parkLotName"></el-input>
            </el-form-item>
          </el-col>
          <el-button @click="gainPlotE" class="e-cols" :disabled="isDisabled">点击绑定</el-button>
        </el-row>
      </el-form>
      <el-button type="success" @click="submintE">提交</el-button>
    </div>
    <!--小区的模态框-->
    <el-dialog title="选择小区" width="60%" :show-close='false' :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogEstateTable" custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch add-parkingarea">
        <el-form :inline="true" :model="parkLotData">
          <el-form-item label="小区名称" prop="provinceId">
            <el-input v-model="parkLotData.name" @keyup.enter.native="estateSearch"></el-input>
          </el-form-item>
          <el-form-item label="小区类型" prop="cityId">
            <el-select v-model="searchType" placeholder="全部">
              <el-option v-for="item in options" :key="item.estateType" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="estateSearch" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
        </el-form>
      </div>
      <template>
        <el-table style="width: 100%" :data="estateTableDatas" border>
          <el-table-column prop="id" width="100px" label="ID">
          </el-table-column>
          <el-table-column prop="provinceName" label="省份">
          </el-table-column>
          <el-table-column prop="cityName" label="城市">
          </el-table-column>
          <el-table-column prop="areaName" label="区县">
          </el-table-column>
          <el-table-column prop="name" label="小区名称">
          </el-table-column>
          <el-table-column prop="address" label="地址">
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
          <el-table-column prop="id" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state==0">关闭</span>
              <span v-else-if="scope.row.state==1">开放</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="bindEstate(scope.row.name,scope.row.id)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechangesEstate"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogEstateTable">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Qs from 'qs';
import paingchild from '@/components/commonpage/paingchild';
export default {
  name: 'aOeParkingArea',
  data() {
    return {
      formData: {
        districtName: '',
        parklotId: '',
        parkLotName: '',
      },
      parkLotData: {
        start: 0,
        sEcho: 3,
        length: 10,
        name: '',
        type: '',
        innershareStr: '',
      },
      dialogEstateTable: false,
      estateTableDatas: {},
      estateSearchFromData: {},
      seachLoading: false,
      display: 10,   // 每页显示条数
      compage: 1,
      total: 0,
      pagegroup: 10,
      isSearch: 0, // 是否进行了搜索
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
      searchType: '',
      isDisabled:false,
    }
  },
  created() {
    // 编辑的时候传入ID=xxx, 新增的时候ID=null  这个地方要判断一下是否要编辑还是新增
    // 编辑功能还没有做
    console.log(this.$route.query.area)
    if (this.$route.query.area != -1) {
      this.isDisabled = true
      this.parkingDetails(this.$route.query.area)
    }
  },
  methods: {
    isKongeFlag(event){
      console.log(12343)
      console.log(event)
    },
    // 车场区域详情
    parkingDetails(id) {
      this.$http.get('district/' + id)
        .then((res) => {
          console.log(res)
          if (res.data.error_code === 2000) {
            console.log(res.data.data)
            this.formData.parkLotName = res.data.data.parkLotName
            this.formData.parklotId = res.data.data.parklotId
            this.formData.districtName = res.data.data.districtName
          } else {
            this.$message.error(res.data.error_message)
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('接口出错，请联系开发人员，谢谢！！！')
        })
    },
    // 添加小区
    submintE() {
      let pattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (!this.formData.districtName || !this.formData.parklotId) {
        this.$message.error('所有内容均为必填。');
      } else if(!(pattern.test(this.formData.districtName))){
        this.$message.error('区域名称只能录入（数字，字母，汉字）其余字段为非法字符')
      }else {
        let data = {}
        if (this.$route.query.area !== -1) {
          data.id = this.$route.query.area;
        }
        data.districtName = this.formData.districtName
        data.parklotId = this.formData.parklotId
        this.$http.post('district/addNewParklotDistrict', Qs.stringify(data))
          .then((res) => {
            console.log(res)
            if (res.data.error_code === 2000) {
              this.$router.go(-1);
            } else {
              this.$message.error(res.data.error_message)
            }
          })
          .catch((err) => {
            this.$message.error('请求后台接口报错，请联系开发人员，谢谢！！')
          })
      }

    },
    // 查询小区
    gainPlotE() {
      // start	是	int	请求的列表起始位置
      // length	是	int	请求的列表长度
      // sEcho	是	int	已经请求的次数
      // name	否	str	小区名称
      // type 否	int	小区类型(0是静态车场车位查询，1是约车场，2是约车位)
      // innershare: 1 表示内部  0 表示外部
      if (this.searchType !== '') {
        if (this.searchType == 3) {
          this.parkLotData.type = 1
          this.parkLotData.innershare = 1
        } else if (this.searchType == 4) {
          this.parkLotData.type = 2;
          this.parkLotData.innershare = 1
        } else {
          this.parkLotData.type = this.searchType
          this.parkLotData.innershare = 0
        }
      } else {
        this.parkLotData.type = ''
        this.parkLotData.innershare = ''
      }
      var data = Qs.stringify(this.parkLotData);
      this.$http.post('parklot/pageable', data)
        .then((res) => {
          console.log(res.data);
          if (res.data.data.dataList.length == 0) {
            this.$message.error('错了哦，没有匹配的数据');
          } else {
            this.estateTableDatas = res.data.data.dataList;
            this.dialogEstateTable = true;
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
            console.log(this.total)
          }
        }).catch((err) => {
          console.log('服务端错误' + err);
        })
    },
    // 搜索小区的数据
    estateSearch() {
      console.log(this.parkLotData.name)
      console.log(this.parkLotData)
      if (this.isSearch == 0) {
        if (!this.parkLotData.name && !this.searchType) {
          this.$message.error('请您输入要搜索的条件！！！');
        } else {
          // 开始进行搜索
          this.isSearch = 1;
          this.parkLotData.start = 0;
          this.gainPlotE()
        }
      } else if (this.isSearch == 1) {
        if (!this.parkLotData.name && !this.searchType) {
          this.isSearch = 0;
          this.compage = 1;
          this.parkLotData.start = 0;
        }
        this.gainPlotE()
      }
    },
    // 当下标发生变化的时候
    pagechangesEstate(val) {
      console.log(val)
      this.page = val;
      this.compage = val;
      this.parkLotData.start = (val - 1) * this.display;
      // isSearch   1表示带参跳转页面  0 表示非带参
      if (this.isSearch == 1) {
        this.estateSearch();
      } else {
        this.gainPlotE();
      }
    },
    // 关闭搜索框
    closeDialogEstateTable() {
      this.parkLotData.name = ''
      this.parkLotData.type = ''
      this.parkLotData.innershareStr = ''
      this.searchType = ''
      this.dialogEstateTable = false;
    },
    // 绑定小区
    bindEstate(name, id) {
      this.formData.parkLotName = name
      this.formData.parklotId = id
      this.parkLotData.name = ''
      this.parkLotData.type = ''
      this.parkLotData.innershareStr = ''
      this.searchType = ''
      this.dialogEstateTable = false;
    },
  },
  components: {
    paingchild
  }
}
</script>

<style scoped>
.add_parkingarea {
  margin-top: 20px;
}
.e-cols {
  margin-left: 30px;
}
</style>

