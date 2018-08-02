<template>
  <div class="parking-add">
    <h2>新增车位</h2>
    <br>
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="单个新增">
        <el-form label-position="top" label-width="80px" :model="formLabelAlign">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="*小区名称" prop="parklotName">
                  <el-input v-model="formLabelAlign.parklotName" placeholder="请选择小区" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-button class="bindButton" type="primary" plain @click="bindOfEstate">点击绑定</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="*车位区域" prop="parklotName">
                <el-select v-model="formLabelAlign.parklotDistrictId" placeholder="全部">
                  <el-option v-for="item in options" :key="item.id" :label="item.districtName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="*车位归属" prop="phone">
                  <el-input v-model="formLabelAlign.phone" placeholder="请绑定业主" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-button class="bindButton" type="primary" @click="bindOfUser" plain :disabled="bindDisabled">点击绑定</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="*车位编号" prop="number">
                  <el-input v-model="formLabelAlign.number" placeholder="请输入车位编号" :disabled="bindDisabled"></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="蓝牙名称" prop="serialNumber">
                  <el-input v-model="formLabelAlign.serialNumber" placeholder="请选择蓝牙" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-button class="bindButton" type="primary" plain @click="bindOfLock" :disabled="bindDisabled">点击绑定</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-checkbox v-model="formLabelAlign.checked">推荐</el-checkbox>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" @click="singleIncrease">提交</el-button>
        <el-button type="primary" @click="toBefore">返回</el-button>
      </el-tab-pane>

      <el-tab-pane label="批量新增">
        <el-form label-position="top" label-width="80px" :model="formBatch">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="编号前缀" prop="phone">
                  <el-input v-model.number="fixedNumber" placeholder="请输入编号前缀"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="起始" prop="phone">
                  <el-input v-model.number="startNumber" placeholder="请输入开始编号"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-form-item label="结束" prop="phone">
                  <el-input v-model.number="endNumber" placeholder="请输入结束编号"></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-button class="bindButton" type="primary" plain @click="generate">批量生成</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="车位编号" prop="phone">
                  <el-input type="textarea" :rows="4" placeholder="" v-model="formBatch.textarea">
                  </el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="*绑定小区名称" prop="parklotName">
                  <el-input v-model.number="formBatch.parklotName" placeholder="请绑定小区名称" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-button class="bindButton" type="primary" plain @click="bindOfEstate">点击绑定</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="*车位区域" prop="parklotName">
                <el-select v-model="formBatch.parklotDistrictId" placeholder="全部">
                  <el-option v-for="item in optionsAll" :key="item.id" :label="item.districtName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="*车位归属" prop="phone">
                  <el-input v-model.number="formBatch.phone" placeholder="请绑定车位归属" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                <el-form-item label="" prop="">
                  <el-button class="bindButton" type="primary" plain @click="bindOfUser">点击绑定</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="primary" @click="multipleSubmissions">提交</el-button>
        <el-button type="primary" @click="toBefore">返回</el-button>
      </el-tab-pane>
    </el-tabs>

    <!--小区的模态框-->
    <el-dialog title="选择小区" width="60%" :show-close='false' :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogEstateTable" custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" :model="estateSearchFromData">
          <el-form-item label="省" prop="provinceId">
            <el-select clearable placeholder="=请选择省份=" width="100%" v-model="estateSearchFromData.provinceId" :clearable="false" @change="getIDisNum(estateSearchFromData.provinceId,2)">
              <!-- label表示的是每一个下拉列表的数据 -->
              <el-option v-for="item in province" :label="item.name" :value="item.id" :key="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="cityId">
            <el-select :clearable="false" placeholder="=请选择城市=" width="100%" v-model="estateSearchFromData.cityId" @change="getIDisNum(estateSearchFromData.cityId,3)">
              <!-- label表示的是每一个下拉列表的数据 -->
              <el-option v-for="item in citys" :label="item.name" :value="item.id" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="县/区" prop="areaId">
            <el-select :clearable="false" placeholder="=请选择县区=" width="100%" v-model="estateSearchFromData.areaId">
              <!-- label表示的是每一个下拉列表的数据 -->
              <el-option v-for="item in zones" :label="item.name" :value="item.id" :key="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='小区名称'>
            <el-input placeholder="请输入小区名称" v-model.trim="estateSearchFromData.name" @change="clearStart" @keyup.enter.native="estateSearch"></el-input>
          </el-form-item>
          <div class="divStyle">
            <selectchild v-on:getlength="getChildLength"></selectchild>
            <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
            <el-button type="primary" @click="estateSearch" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
          </div>
        </el-form>
      </div>
      <template>
        <el-table style="width: 100%" :data="estateTableDatas" ref="singleEstateTable" row-key="id" border>
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
              <el-button size="mini" type="warning" @click="bindEstate(scope.row)">绑定</el-button>
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
    <!--车位归属人的模态框-->
    <el-dialog title="选择车位归属人" width="60%" :show-close='false' :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogUserTable" custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" class="demo-form-inline" :model="userSearchFromData">
          <el-form-item label='用户手机号'>
            <el-input placeholder="请输入用户手机号" v-model.trim="userSearchFromData.phone" @keyup.enter.native="userSearch"></el-input>
          </el-form-item>
          <el-button type="primary" @click="userSearch">搜索</el-button>
          <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
        </el-form>
      </div>

      <template>
        <el-table style="width: 100%" :data="userTableDatas" ref="singleTable" row-key="id" border>
          <el-table-column prop="id" width="100px" label="ID">
          </el-table-column>
          <br>
          <br><br>
          <el-table-column label="手机号码">
            <template slot-scope="scope">
              <span>{{scope.row.phone || '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="绑定">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="bindUser(scope.row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compageUser" :display="displayUser" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechangesUser"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogUserTable">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--车锁的模态框-->
    <el-dialog title="选择车锁" width="60%" :show-close='false' :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogLockTable" custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" class="demo-form-inline" :model="lockSearchFromData">
          <el-form-item label="小区名称">
            <el-input placeholder="请输入小区名称" v-model.trim="lockSearchFromData.parklotName" @keyup.enter.native="lockSearch"></el-input>
          </el-form-item>
          <el-form-item label='蓝牙名称'>
            <el-input placeholder="请输入蓝牙名称" v-model.trim="lockSearchFromData.serialNumber" @keyup.enter.native="lockSearch"></el-input>
          </el-form-item>
          <el-form-item label='车锁名称'>
            <el-input placeholder="请输入车锁名称" v-model.trim="lockSearchFromData.serialNumber" @keyup.enter.native="lockSearch"></el-input>
          </el-form-item>
          <el-button type="primary" @click="lockSearch">搜索</el-button>
          <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
        </el-form>
      </div>

      <template>
        <el-table style="width: 100%" :data="lockTableDatas" ref="singleLockTable" row-key="id" border>
          <el-table-column prop="id" label="ID">
          </el-table-column>
          <el-table-column prop="parklotName" label="小区名称">
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="parklotName"-->
          <!--label="小区类型">-->
          <!--</el-table-column>-->
          <el-table-column prop="btName" label="车锁名称">
          </el-table-column>
          <el-table-column prop="btName" label="蓝牙名称">
          </el-table-column>
          <el-table-column label="绑定">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="bindLock(scope.row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compageLock" :display="displayLock" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechangesLock"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogLockTable">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
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

.bindButton.el-button {
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
      // parklotDistrictId
      //单个新增车位的数据
      formLabelAlign: {
        parklotId: '',
        parklotName: '',
        userId: '',
        userName: '',
        number: '',
        serialNumber: '',
        lockId: '',
        checked: false,
        parklotDistrictId: '', // 车位归属
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
      isLoading: false, // 导出是否可用
      isSearch: 0, // 是否进行了搜索
      bindDisabled: false,
      //绑定小区的数据------------
      displayEstate: 10,   // 每页显示条数
      compageEstate: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pageEstate: 1,
      startEstate: 0,
      dialogEstateTable: false,//小区模态框
      // 小区的搜索省市区下拉列表的信息
      province: [],
      citys: [],
      zones: [],
      estateSearchFromData: {//小区的搜索
        name: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      },
      estateTableDatas: [],//小区表格的数据
      //绑定车位归属人的数据------------
      displayUser: 10,   // 每页显示条数
      compageUser: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pageUser: 1,
      startUser: 0,
      dialogUserTable: false,//车位归属人模态框
      userSearchFromData: {//车位归属人的搜索
        phone: ''
      },
      userTableDatas: [],//车位归属人表格的数据
      //绑定车锁的数据-------------
      displayLock: 10,   // 每页显示条数
      compageLock: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pageLock: 1,
      startLock: 0,
      dialogLockTable: false,
      lockSearchFromData: {//车锁的搜索
        parklotName: '',
        name: '',
        serialNumber: '',
      },
      lockTableDatas: null,//车锁表格的数据
      //批量新增---------------------------------------------
      fixedNumber: '',
      startNumber: '',
      endNumber: '',
      formBatch: {
        textarea: '',
        parklotName: '',
        parklotId: '',
        phone: '',
        userId: '',
        parklotDistrictId: '', // 表示批量新增时的车位区域ID
      },
      tabName: '单个新增',
      options: [], // 单个新增的下拉选择器
      optionsAll: [], // 多个新增的下拉选择器
    }
  },
  methods: {
    // 绑定小区，车位区域发生变化
    getParkingAreaE(id) {
      // tabName: '单个新增',
      if (this.tabName === '单个新增') {
        this.options = []
        this.formLabelAlign.parklotDistrictId = ''
      } else {
        this.optionsAll = []
        this.formBatch.parklotDistrictId = ''
      }

      console.log(this.formLabelAlign.parklotId)
      this.$http.get('district/getParklotDistrictByParklotList/' + id)
        .then((res) => {
          console.log(res)
          if (res.data.error_code === 2000) {
            if (this.tabName === '单个新增') {
              this.options = res.data.data
            } else {
              this.optionsAll = res.data.data
            }
            console.log(this.options)
          } else {
            this.$message.error(res.data.error_message)
          }
        })
        .catch((err) => {
          this.$message.error('后台接口报错，请联系开发人员，谢谢！！！')
        })
    },
    //点击切花tab获取tab名称
    tabClick(tab) {
      this.tabName = tab.$options.propsData.label;
      console.log(this.tabName);
    },
    //-------------绑定小区的--------
    bindOfEstate() {
      this.dialogEstateTable = true;
      this.getEstateData();
      this.getBasicsData(0, 1);
    },
    //获取数据
    getEstateData() {
      this.estateTableDatas = [];
      var isData = {
        length: this.display,
        start: this.start,
        sEcho: 3,
      }
      var data = Qs.stringify(isData);
      this.$http.post('parklot/pageable', data).then((res) => {
        console.log(res.data);
        this.seachLoading = false;
        if (res.data.data.dataList.length == 0) {
          this.$message.error('错了哦，没有匹配的数据');
        } else {
          this.estateTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
        }
      }).catch((err) => {
        this.seachLoading = false;
        console.log(err);
      });

    },
    // 搜索小区省市区
    getBasicsData(num, flag) {
      this.$http.get('area/' + num).then(res => {
        var tempData = res.data.data;
        console.log(tempData)
        if (flag == 1) {
          tempData.unshift({ id: 0, name: '=请选择省份=' });
          this.province = tempData;
          this.estateSearchFromData.provinceId = 0;
        } else if (flag == 2) {
          this.citys = tempData;
        } else if (flag == 3) {
          this.zones = tempData;
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 下拉框 省市 级事件
    getIDisNum(num, flag) {
      if (flag == 2) {
        this.estateSearchFromData.cityId = '';
        this.estateSearchFromData.areaId = '';
      } else if (flag == 3) {
        this.estateSearchFromData.areaId = '';
      }
      this.getBasicsData(num, flag);
    },
    //搜索
    estateSearch() {
      //        console.log(this.estateSearchFromData)
      this.seachLoading = true;
      if (this.isSearch == 0) {
        if (this.estateSearchFromData.name === "" && this.estateSearchFromData.provinceId === "" && this.estateSearchFromData.cityId === "" && this.estateSearchFromData.areaId === "") {
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
          this.paramsEstateData();
        }

      } else if (this.isSearch == 1) {
        if (this.estateSearchFromData.name === "" && this.estateSearchFromData.provinceId === "" && this.estateSearchFromData.cityId === "" && this.estateSearchFromData.areaId === "") {
          this.start = 0;
          this.isSearch = 0;
          this.getEstateData();
        } else {
          this.paramsEstateData();
        }
      }
      ;
    },
    //带参搜索
    paramsEstateData() {
      this.isSearch = 1;
      var datas = {};
      datas.start = this.start;
      datas.sEcho = 3;
      datas.length = this.display;
      if (this.estateSearchFromData.name) datas.name = this.estateSearchFromData.name;
      if (this.estateSearchFromData.provinceId) datas.provinceId = this.estateSearchFromData.provinceId;
      if (this.estateSearchFromData.cityId) datas.cityId = this.estateSearchFromData.cityId;
      if (this.estateSearchFromData.areaId) datas.areaId = this.estateSearchFromData.areaId;
      this.estateTableDatas = [];
      // 开始发送请求
      var data = Qs.stringify(datas);
      this.$http.post('parklot/pageable', data).then(res => {
        console.log(res.data);
        this.seachLoading = false;
        if (res.data.data.dataList.length == 0) {
          this.$message.error('错了哦，没有匹配的数据');
        } else {
          this.estateTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
        }
      }).catch(err => {
        this.seachLoading = false;
        console.log('服务端错误' + err);
      })
    },
    //绑定
    bindEstate(row) {
      if (this.tabName == "单个新增") {
        this.formLabelAlign.parklotName = row.name;
        this.formLabelAlign.parklotId = row.id;
      } else {
        this.formBatch.parklotName = row.name;
        this.formBatch.parklotId = row.id;
      }
      console.log(this.formLabelAlign.parklotName)
      console.log(this.formLabelAlign.parklotId)
      // 确定数据
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      if (this.estateSearchFromData.name) this.estateSearchFromData.name = '';
      this.dialogEstateTable = false;
      // 调用后台查询接口
      this.getParkingAreaE(row.id)
    },
    //取消按钮
    closeDialogEstateTable() {
      // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
      this.formLabelAlign.name = '';
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      if (this.estateSearchFromData.name) this.estateSearchFromData.name = '';
      this.dialogEstateTable = false;
    },
    // 分页菜单的数据
    pagechangesEstate(val) {
      this.page = val;
      this.compage = val;
      this.start = (val - 1) * this.display;
      if (this.isSearch == 1) {
        this.estateSearch();
      } else {
        this.getEstateData();
      }
    },
    // 输入框发生改变的时候
    clearStart() {
      this.compage = 1;
      this.start = 0; // 改变从0开始搜索
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
        this.paramsEstateData();
      }
    },
    // 返回上一页
    toBefore() {
      this.$router.go(-1);
    },
    //-----------------绑定车位归属人的--------
    bindOfUser() {
      this.dialogUserTable = true;
      this.getUserData();
    },
    //获取数据
    getUserData() {
      this.userTableDatas = [];
      var isData = {
        length: this.displayUser,
        start: this.startUser,
        sEcho: 3,
      }
      var data = Qs.stringify(isData);
      this.$http.post("user/pageable", data).then(res => {
        this.userTableDatas = res.data.data.dataList;
        // 当数据回来之后再做页码处理
        this.total = parseInt(res.data.data.itotalRecords);
        this.seachLoading = false;
        console.log(res)
      }).catch(err => {
        this.seachLoading = false;
        console.log(err);
      })
    },
    //搜索
    userSearch() {
      this.seachLoading = true;
      if (this.isSearch == 0) {
        if (this.userSearchFromData.name === "") {
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
          this.startUser = 0;
          this.isSearch = 1;
          this.paramsUserData();
        }
      } else if (this.isSearch == 1) {
        if (this.userSearchFromData.name === "") {
          this.startUser = 0;
          this.isSearch = 0;
          this.getUserData();
        } else {
          this.paramsUserData();
        }
      };
    },
    //带参搜索
    paramsUserData() {
      this.isSearch = 1;
      var datas = {};
      datas.start = this.startUser;
      datas.sEcho = 3;
      datas.length = this.displayUser;
      if (this.userSearchFromData.phone) datas.phone = this.userSearchFromData.phone;
      this.userTableDatas = [];
      // 开始发送请求
      var data = Qs.stringify(datas);
      this.$http.post('user/pageable', data).then(res => {
        console.log(res.data);
        this.seachLoading = false;
        if (res.data.error_code !== 2000 && res.data.data.dataList.length != 0) {
          this.errcode = 0;
        } else {
          this.userTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
          this.seachLoading = false;
          console.log(res.data.data.dataList)
        }
      }).catch(err => {
        this.seachLoading = false;
        console.log('服务端错误' + err);
      })
    },
    // 分页菜单的数据
    pagechangesUser(val) {
      this.pageUser = val;
      this.compageUser = val;
      this.startUser = (val - 1) * this.displayUser;
      if (this.isSearch == 1) {
        this.getUserData();
      } else {
        this.getUserData();
      }
    },
    // 下拉菜单的选择器
    getChildLengthUser(len) {
      var pageData = 0, age = 0;
      pageData = this.displayUser * (this.pageUser - 1);
      if (pageData % len == 0) {
        console.log(123);
        age = (pageData / len + 1);
      } else {
        age = Math.ceil(pageData / len);
      }
      // age 是表示从哪一页开始
      this.startUser = (age - 1) * len;
      this.pageUser = age;
      this.compageUser = age;
      this.displayUser = parseInt(len);
      if (this.isSearch == 0) {
        this.getUserData();
      } else if (this.isSearch == 1) {
        this.paramsUserData();
      }
    },
    //绑定
    bindUser(row) {
      console.log(row)
      this.dialogLockTable = false;
      if (this.tabName == "单个新增") {
        this.formLabelAlign.phone = row.phone;
        this.formLabelAlign.userId = row.id;
      } else if (this.tabName == "批量新增") {
        this.formBatch.phone = row.phone;
        this.formBatch.userId = row.id;
      } else {
        this.$message.error('错了哦，绑定出错了');
      }
      // 确定数据
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      this.userSearchFromData.phone = '';
      this.dialogUserTable = false;
    },
    //取消按钮
    closeDialogUserTable() {
      // 点击关闭按钮的时候， 清空文本框中的数据
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      this.userSearchFromData.phone = '';
      this.dialogUserTable = false;
    },
    //----------------绑定车锁编号的---------
    bindOfLock() {
      this.dialogLockTable = true;
      this.getLockData();
    },
    //获取数据
    getLockData() {
      this.lockTableDatas = [];
      var isData = {
        length: this.displayLock,
        start: this.startLock,
        sEcho: 3,
      }
      var data = Qs.stringify(isData);
      this.$http.post("lock/noParkloc", data).then(res => {
        if (res.data.error_code == 2000) {
          this.lockTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
          this.seachLoading = false;
          console.log(res)
        } else {
          this.$message.error(res.data.error_message)
        }
      }).catch(err => {
        this.seachLoading = false;
        console.log(err);
      })
    },
    //搜索
    lockSearch() {
      this.seachLoading = true;
      if (this.isSearch == 0) {
        if (this.lockSearchFromData.name === "" && this.lockSearchFromData.id === "") {
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
          this.startLock = 0;
          this.isSearch = 1;
          this.paramsLockData();
        }
      } else if (this.isSearch == 1) {
        if (this.lockSearchFromData.name === "" && this.lockSearchFromData.id === "") {
          this.startLock = 0;
          this.isSearch = 0;
          this.getLockData();
        } else {
          this.paramsLockData();
        }
      };
    },
    //带参搜索
    paramsLockData() {
      this.isSearch = 1;
      var datas = {};
      datas.start = this.startLock;
      datas.sEcho = 3;
      datas.length = this.displayLock;
      if (this.lockSearchFromData.name) datas.name = this.lockSearchFromData.name;
      if (this.lockSearchFromData.id) datas.id = this.lockSearchFromData.id;
      this.lockTableDatas = [];
      // 开始发送请求
      var data = Qs.stringify(datas);
      this.$http.post('lock/noParkloc', data).then(res => {
        console.log(res.data);
        this.seachLoading = false;
        if (res.data.error_code !== 2000 && res.data.data.dataList.length != 0) {
          this.errcode = 0;
        } else {
          this.lockTableDatas = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
          this.seachLoading = false;
          console.log(res)
        }
      }).catch(err => {
        this.seachLoading = false;
        console.log('服务端错误' + err);
      })
    },
    // 分页菜单的数据
    pagechangesLock(val) {
      this.pageLock = val;
      this.compageLock = val;
      this.startLock = (val - 1) * this.displayLock;
      if (this.isSearch == 1) {
        this.getLockData();
      } else {
        this.getLockData();
      }
    },
    // 下拉菜单的选择器
    getChildLengthLock(len) {
      var pageData = 0, age = 0;
      pageData = this.displayLock * (this.pageLock - 1);
      if (pageData % len == 0) {
        console.log(123);
        age = (pageData / len + 1);
      } else {
        age = Math.ceil(pageData / len);
      }
      // age 是表示从哪一页开始
      this.startLock = (age - 1) * len;
      this.pageLock = age;
      this.compageLock = age;
      this.displayLock = parseInt(len);
      if (this.isSearch == 0) {
        this.getLockData();
      } else if (this.isSearch == 1) {
        this.paramsLockData();
      }
    },
    //绑定
    bindLock(row) {
      console.log(row)
      this.dialogLockTable = false;
      this.formLabelAlign.serialNumber = row.btName;
      this.formLabelAlign.lockId = row.id;
      // 确定数据
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      this.lockSearchFromData.parklotName = '';
      this.lockSearchFromData.name = '';
      this.lockSearchFromData.serialNumber = '';
      this.dialogLockTable = false;
    },
    //取消按钮
    closeDialogLockTable() {
      // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
      this.formLabelAlign.name = '';
      this.start = 0;
      this.compage = 1;
      // 清空搜索框里面的数据
      this.lockSearchFromData.parklotName = '';
      this.lockSearchFromData.name = '';
      this.lockSearchFromData.serialNumber = '';
      this.dialogLockTable = false;
    },
    //-----------单个新增 提交
    singleIncrease() {
      if (!this.formLabelAlign.parklotId) {
        this.$message.error('错了哦，请选择小区名称');
      } else if (!this.formLabelAlign.parklotDistrictId) {
        this.$message.error('错了哦, 请选择车位区域');
      } else if (!this.formLabelAlign.number) {
        this.$message.error('错了哦, 请录入车位编号');
      } else if (!this.formLabelAlign.userId) {
        this.$message.error('错了哦，请选择车位归属');
      } else {
        var recommend = this.formLabelAlign.checked == true ? 1 : 0;
        var data = {
          parklotId: this.formLabelAlign.parklotId,
          userId: this.formLabelAlign.userId,
          number: this.formLabelAlign.number,
          lockId: this.formLabelAlign.lockId,
          parklotDistrictId: this.formLabelAlign.parklotDistrictId,
          parklocId: 0,
          recommend: recommend
        };
        data = Qs.stringify(data);
        this.$http.post("parkloc/add", data).then(res => {
          if (res.data.error_code == 2315) {
            this.$message({
              message: "车位编号已存在，请重新输入。",
              type: 'error'
            });
            return false;
          }
          if (res.data.error_code == 2000) {
            this.$message({
              message: '恭喜你，成功添加车位',
              type: 'success'
            });
            this.formLabelAlign.checked = 0;
            this.formLabelAlign = {}
            this.$router.go(-1);
          } else if (res.data.error_code == 2102) {
            this.$message.error('错了哦，约车场与管理员不匹配');
          } else {
            this.$message.error(res.data.error_message);
          }
        })
      }
    },
    //-------------------------------------------------批量绑定-------------
    //批量生成
    generate() {
      if (!this.startNumber || !this.endNumber) {
        this.$message.error("请先填入起始和结束数字");
        return false;
      }
      this.formBatch.textarea = '';
      for (var i = this.startNumber; i <= this.endNumber; i++) {
        if (i < this.endNumber) {
          this.formBatch.textarea += "" + this.fixedNumber + i + ",";
        } else {
          this.formBatch.textarea += "" + this.fixedNumber + i;
        }
      }
    },
    //批量提交
    multipleSubmissions() {

      if (this.formBatch.textarea == '') {
        this.$message.error('错了哦，车位编号为空');
      } else if (this.formBatch.userId == '') {
        this.$message.error('错了哦，车位归属人为空');
      } else if (this.formBatch.parklotId == '') {
        this.$message.error('错了哦，小区名称为空');
      } else if(!this.formBatch.parklotDistrictId){
        this.$message.error('错了哦，车位区域不能为空');
      }else {
        var data = {
          numbers: this.formBatch.textarea,
          userId: this.formBatch.userId,
          parklotId: this.formBatch.parklotId,
          parklotDistrictId: this.formBatch.parklotDistrictId
        }
        data = Qs.stringify(data);
        this.$http.post("parkloc/add/batch", data).then(res => {
          console.log(res)
          if (res.data.error_code == 2315) {
            this.$message({
              message: "车位编号已存在，请重新输入。",
              type: 'error'
            });
            return false;
          }
          if (res.data.error_code == 2000) {
            this.$message({
              message: '恭喜你，成功添加车位',
              type: 'success'
            });
            this.$router.go(-1);
          } else if (res.data.error_code == 2102) {
            this.$message.error('错了哦，约车场与管理员不匹配');
          } else {
            this.$message.error(res.data.error_message);
          }
        })
      }
    },
    // 返回上一页
    toBefore() {
      this.$router.go(-1);
    }
  },
  updated() {
  },
  components: {
    paingchild,
    selectchild,
  },
}
</script>
