<template>
  <div class="estate">
    <div class="divStyle">
      <div class="divcontent">
        <div>
          <template>
            <h2>修改小区</h2>
            <div style="margin: 20px;"></div>
            <el-form label-position="top" label-width="80px" ref="formLabelAlign" v-loading="loading" :model="formLabelAlign">
              <!--省市级联动判断还有待优化-->
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*省" prop="provinceId">
                      <el-select placeholder="=请选择省份=" v-model="formLabelAlign.provinceId" :clearable="false" @change="getIDisNum(formLabelAlign.provinceId,2)">
                        <!-- label表示的是每一个下拉列表的数据 -->
                        <el-option v-for="item in province" :label="item.name" :value="item.id" :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*市" prop="cityId">
                      <el-select :clearable="false" placeholder="=请选择城市=" width="100%" v-model="formLabelAlign.cityId" @change="getIDisNum(formLabelAlign.cityId,3)">
                        <!-- label表示的是每一个下拉列表的数据 -->
                        <el-option v-for="item in citys" :label="item.name" :value="item.id" :key="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>

                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*县/区" prop="areaId">
                      <el-select :clearable="false" placeholder="=请选择县区=" width="100%" v-model="formLabelAlign.areaId">
                        <!-- label表示的是每一个下拉列表的数据 -->
                        <el-option v-for="item in zones" :label="item.name" :value="item.id" :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区详细地址" prop="address">
                      <el-input v-model="formLabelAlign.address" placeholder="请输入小区详细地址" :maxlength=100></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区名称" prop="name">
                      <el-input v-model.trim="formLabelAlign.name" placeholder="请输入小区名称" :maxlength=20></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区车位总数量" prop="totalAmount">
                      <el-input v-model="formLabelAlign.totalAmount" placeholder="请输入车位总数量" :maxlength=4></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="小区联系人" prop="contactName">
                      <el-input v-model="formLabelAlign.contactName" placeholder="请输入联系人" :maxlength=4></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="小区联系电话" prop="contactPhone">
                      <el-input v-model.number="formLabelAlign.contactPhone" placeholder="请输入联系电话" :maxlength=11></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="签约车位数量" prop="signedAmount">
                      <el-input v-model.lazy="formLabelAlign.signedAmount" placeholder="请输入签约车位数量" :maxlength=4></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区经纬度" prop="latLng">
                      <el-input v-model="formLabelAlign.latLng" placeholder="请输入小区经度"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*车库入口经纬度" prop="naviLatLng">
                      <el-input v-model="formLabelAlign.naviLatLng" placeholder="请输入车库入口经度"></el-input>
                      <a href="http://lbs.amap.com/console/show/picker" target="_blank" class="linkStyle">
                        <i class="el-icon-search"></i>查询位置信息 </a>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="空车位数量(注意：空车位数为0表示没有继电器)" prop="leftAmount">
                      <el-input v-model.number="formLabelAlign.leftAmount" placeholder="请输入空车位数量" :disabled="leftAmountDisabled" :maxlength=4></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="grid-content bg-purple">
                    <el-form-item label="是否显示" prop="">
                      <el-button plain @click="carShow" :disabled="leftAmountDisabled">{{carShowText}}</el-button>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区类型" prop="type">
                      <template>
                        <el-select v-model="formLabelAlign.type" placeholder="=请选择小区类型=" @change="changeType">
                          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*停车场类型" prop="kind">
                      <el-select clearable v-model="formLabelAlign.kind" placeholder="=请选择停车场类型=">
                        <el-option v-for="item in parkingTypeOptions" :label="item.name" :value="item.type" :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区状态" prop="state">
                      <el-select clearable v-model="formLabelAlign.state" placeholder="=请选择小区状态=">
                        <el-option v-for="item in estateTypeOptions" :label="item.name" :value="item.type" :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*收费模式" prop="charge">
                      <el-select clearable v-model="formLabelAlign.chargeType" placeholder="=请选择收费模式=">
                        <el-option v-for="item in chargeOptions" :label="item.name" :value="item.type" :disabled="item.disabled" :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <!--新增管理员和联系方式-->
              <template v-if="formLabelAlign.type != -1 && formLabelAlign.type != 0">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <el-form-item label="*管理员姓名">
                        <el-input v-model.trim="formLabelAlign.adminName" placeholder="请输入管理员姓名"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple">
                      <el-form-item label="*管理员联系方式">
                        <el-input v-model.lazy="formLabelAlign.adminPhone" placeholder="请输入管理员联系方式"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </template>
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item label="停车场收费信息(限制255个汉字)">
                    <el-input type="textarea" :rows="3" v-model.lazy="formLabelAlign.feeIntro" :maxlength=255></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="小区图片1" class='myUpload'>
                    <input type='file' @change="handleChange1" ref="upload1">
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  图片规定2M以内，支持PNG/JPG/GIF,上传首选PNG
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc1">
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" size="small" @click='removeImg1'>删除图片</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片2" class='myUpload'>
                    <input type='file' @change="handleChange2" ref="upload2">
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc2">
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" size="small" @click='removeImg2'>删除图片</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片3" class='myUpload'>
                    <input type='file' @change="handleChange3" ref="upload3">
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc3">
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" size="small" @click='removeImg3'>删除图片</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片4" class='myUpload'>
                    <input type='file' @change="handleChange4" ref="upload4">
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc4">
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" size="small" @click='removeImg4'>删除图片</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片5" class='myUpload'>
                    <input type='file' @change="handleChange5" ref="upload5">
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc5">
                </el-col>
                <el-col :span="4">
                  <el-button type="danger" size="small" @click='removeImg5'>删除图片</el-button>
                </el-col>
              </el-row>
              <br>
              <template v-if="formLabelAlign.type != -1 && formLabelAlign.type != 0">
                <!--时长设置-->
                <el-tabs type="border-card">
                  <el-tab-pane label="时间设置">
                  </el-tab-pane>
                  <el-form :model="timeList" class="demo-form-inline">
                    <el-row :span="24">
                      <el-col :span="3">
                        <el-form-item label="发布时段间隔(分钟)">
                          <el-input v-model.lazy="timeList.minPublishInterval" placeholder="请输入发布时段间隔" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="最短共享时长(分钟)">
                          <el-input v-model.lazy="timeList.minSharingPeriod" placeholder="请输入最短共享时长" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="免费取消时长(分钟)">
                          <el-input v-model.lazy="timeList.freeCancellationTime" placeholder="请输入免费取消时长" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="车位保留时长（分钟）">
                          <el-input v-model.lazy="timeList.maxDelayTime" placeholder="请输入车位保留时长" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="最短计费时长(分钟)">
                          <el-input v-model.lazy="timeList.minChargingPeriod" placeholder="最短计费时长" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="提前变更车位时间(分钟)">
                          <el-input v-model.lazy="timeList.advanceChangeTime" placeholder="请输入提前变更车位时间" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="3">
                        <el-form-item label="提前可预约车位时间(分钟)">
                          <el-input v-model.lazy="timeList.advanceReservationTime" placeholder="请输入提前可预约车位时间)" :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-tabs>
                <br>
                <!--分成比例-->
                <el-tabs type="border-card">
                  <el-tab-pane label="分成比例">
                  </el-tab-pane>
                  <table>
                    <tr>
                      <td>归属人</td>
                      <td align="center">平台</td>
                      <td align="center">业主</td>
                      <td align="center">物业</td>
                      <td align="center">运营商</td>
                    </tr>
                    <tr>
                      <td>物业</td>
                      <td>
                        <el-input v-model.lazy="propfeeList.platformAppointmentPercent" placeholder="请输入平台抽成"></el-input>
                      </td>
                      <td>
                        <el-input placeholder="0" :disabled="true"></el-input>
                      </td>
                      <td>
                        <el-input v-model.lazy="propfeeList.propCompAppointmentPercent" placeholder="请输入物业抽成"></el-input>
                      </td>
                      <td>
                        <el-input placeholder="0" :disabled="true"></el-input>
                      </td>
                    </tr>
                    <tr>
                      <td>业主</td>
                      <td>
                        <el-input v-model.lazy="propfeeList.platformPercent" placeholder="请输入平台抽成"></el-input>
                      </td>
                      <td>
                        <el-input v-model.lazy="propfeeList.ownerPercent" placeholder="请输入业主抽成"></el-input>
                      </td>
                      <td>
                        <el-input v-model.lazy="propfeeList.propCompPercent" placeholder="请输入物业抽成"></el-input>
                      </td>
                      <td>
                        <el-input v-model.lazy="propfeeList.operatorPercent" placeholder="0" :disabled="true"></el-input>
                      </td>
                    </tr>
                  </table>
                </el-tabs>
              </template>
              <br>

              <!--集成了子组件当中去把这个模块-->
              <common-info></common-info>

              <el-form-item>
                <el-button type="primary" @click="postData">提交
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
img {
  width: 100px;
  height: 100px;
}

.divStyle {
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
    0 2px 10px 0 rgba(34, 36, 38, 0.15);
  padding: 14px;
  height: 100%;
}

h3 {
  font-weight: 700;
  color: #000000;
  padding-bottom: 5px;
  border-bottom: 1px solid #dededf;
}

.divStyle .importInfo {
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 3.5px 15px;
  background-color: #db2828;
  position: relative;
  left: -27px;
  display: inline-block;
}

.divStyle .importInfo:after {
  position: absolute;
  content: '';
  border: 6px solid transparent;
  border-top-color: #b21e1e;
  border-right-color: #b21e1e;
  left: 0px;
  top: 24px;
}

label {
  margin-bottom: 4px;
}

form {
  padding-bottom: 13px;
  border-bottom: 1px solid #ddd;
}

.errorInfo {
  border: 1px solid #e0b4b4;
  padding: 14px 21px;
  font-weight: 700;
  position: relative;
}

.errorInfo p {
  font-weight: 400;
}

.xClose {
  position: absolute;
  top: 10px;
  right: 15px;
  font-family: '微软雅黑';
  cursor: pointer;
}

.linkStyle {
  display: inline-block;
  height: 30px;
  width: 120px;
  text-align: center;
  line-height: 30px;
  background-color: #e8e8e8;
  color: #000000;
  text-decoration: none;
}
</style>

<script>
import Qs from 'qs';
import commonInfo from "@/components/commonpage/commonInfo"
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
import { removeImgId } from '../../../server/getData';
export default {
  data() {
    return {
      //       预约费用模态框的数据
      radio: null,
      showClose: false, // 模态框小叉
      searchFromData: {
        name: '',
      },
      isflag: false,
      isSearch: 0,
      // 下拉列表的信息
      province: [],
      citys: [],
      zones: [],
      // 发送数据所用
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 0,
      start: 0,
      tableDatas: [], // 获取的数据
      tableArray: {},  // 单选框选中的数据
      miunteList: [],
      //      停车费用的模态框数据
      dialogTableParking: false,
      ParkingDatas: [], // 停车费用数据集
      tablePakingDatas: [], // 刚刚拿到的停车数据集
      reserveFeeRuleId: null,  //选中的预约费用规则ID
      parkingFeeRuleId: null,   // 选中的停车费用ID
      parkingTable: [],     // 要在新增小区中显示的表格数据

      parklotTimeParamsList: [],  //时间集合
      timeList: {},  //设置时间集合的表格

      parklotPlatformParamsList: [],  //平台收费比例集合
      parklotPlatformParamsArr: {}, // 要显示平台收费的表格
      //      抽成比例设置
      propfeeList: {
        platformPercent: '',
        ownerPercent: '',
        propCompPercent: '',
        operatorPercent: '0',
        platformAppointmentPercent: '',
        propCompAppointmentPercent: '',
      },
      butText: '提交',

      carShowText: '显示', //空车位显示不显示按钮
      // 下拉列表的信息
      province: [],
      citys: [],
      areaId: [],
      types: [
        { value: -1, label: '=请选择小区类型=' },
        { value: 0, label: '车位查询' },
        { value: 1, label: '约车场' },
        { value: 2, label: '约车位' },
        { value: 3, label: '约车场内部共享' },
        { value: 4, label: '约车位内部共享' },
      ],
      estateTypeOptions: [
        { type: -1, name: '=请选择小区状态=' },
        { type: 0, name: '关闭' },
        { type: 1, name: '开放' },
      ],
      parkingTypeOptions: [
        { type: -1, name: '=请选择停车场类型=' },
        { type: 0, name: '室内' },
        { type: 1, name: '室外' },
        { type: 2, name: '室内+室外' }
      ],
      chargeOptions: [
        { type: -1, name: '=请选择收费模式=' },
        { type: 0, name: '道闸计费' },
        { type: 1, name: '车锁计费' },
        { type: 2, name: '无' },
      ],
      // 表单信息
      formLabelAlign: {
        provinceId: '',   // 非空验证
        cityId: '',      // 非空验证
        areaId: '',   //县区ID非空

        address: '',      // 小区详细地址（非空）
        name: '',         // 小区名称 （非空）
        totalAmount: '',// 车位总数量（数字和非空）

        contactName: '',      // 紧急联系人（非空）
        contactPhone: '',        //紧急联系电话（正则做匹配）
        signedAmount: '',//签约车位数

        latLng: '',            // 小区经纬度（非空，数字）
        naviLatLng: '',     // 车库入口经纬度（数字，非空）
        leftAmount: '',//空车位数量

        type: -1,    // 小区类型 （非0验证）
        kind: -1,   //停车场类型
        state: -1,     //小区状态
        chargeType: 0,//收费模式

        feeIntro: '',//停车场收费信息
        files: [],//图片数组
        filesArr: [],//图片数组
        adminName: '', //管理员姓名
        adminPhone: '',//管理员电话

      },
      imgSrc1: null,
      imgSrc2: null,
      imgSrc3: null,
      imgSrc4: null,
      imgSrc5: null,
      loading: false,
      isError: 2,
      text: '',
      flag: 0,
      dialogTableVisible: false, // 预约费用的模态框
      expands: [],
      fileIds: [],  // 上传图片要用的参数
      imgSrc1Id: null,// 这个表示是否上传图片
      imgSrc2Id: null,// 这个表示是否上传图片
      imgSrc3Id: null,// 这个表示是否上传图片
      imgSrc4Id: null,// 这个表示是否上传图片
      imgSrc5Id: null,// 这个表示是否上传图片
      leftAmountDisabled: true, //空车位数 是否存在

      getInfo: this.$route.query.getInfo, //从哪里进入该页面 0新增 1修改 2查看
      estateId: null,
      lastAdminName: null,
      lastAdminPhone: null,
      packageId: null, // 表示套餐规则的Id
      switchPackageState: '0',
    }
  },
  created() {
    this.getData();
    this.$root.eventHub.$on('reserveid', (reserveId) => {
      // 这里还要 赋值
      this.reserveFeeRuleId = reserveId;
    });
    this.$root.eventHub.$on('parkingId', (parkingId) => {
      this.parkingFeeRuleId = parkingId;
    });
    this.$root.eventHub.$on('packageId', (params) => {
      //  id: this.packageByParkLot[0].id,
      // packageState: this.switchPackageState
      this.packageId = params.id;
      this.switchPackageState = params.packageState
      console.log(this.packageId)
    });
    this.$root.eventHub.$on('packageState',(switchPackageState)=>{
      this.switchPackageState = switchPackageState
    })
  },
  methods: {
    // 获取省市区
    getBasicsData(num, flag) {
      this.$http.get('area/' + num).then(res => {
        var tempData = res.data.data;
        if (flag == 1) {
          this.province = tempData;
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
        this.formLabelAlign.cityId = '';
        this.formLabelAlign.areaId = '';
        this.citys = 0;
        this.zones = 0;
      } else if (flag == 3) {
        this.formLabelAlign.areaId = '';
      }
      this.getBasicsData(num, flag);
      if (num == 0) {
        this.citys = 0;
        this.zones = 0;
      }
    },
    //获取小区详细信息
    getData() {
      this.$http("parklot/" + this.$route.query.estateId).then(res => {
        if (res.data.error_code === 2000) {
          let tempData = res.data.data;
          //            console.log(tempData)
          this.getBasicsData(0, 1); // 获取数据
          this.getBasicsData(tempData.provinceId, 2); // 请求小区数据
          this.getBasicsData(tempData.cityId, 3); // 请求小区数据
          this.formLabelAlign.provinceId = tempData.provinceId;
          this.formLabelAlign.cityId = tempData.cityId;
          this.formLabelAlign.areaId = tempData.areaId;
          // 对数据进行 处理
          //row2
          this.formLabelAlign.address = tempData.address;
          this.formLabelAlign.name = tempData.name;
          this.formLabelAlign.totalAmount = tempData.totalAmount;
          // row3
          this.formLabelAlign.contactName = tempData.contactName;
          this.formLabelAlign.contactPhone = tempData.contactPhone;
          this.formLabelAlign.signedAmount = tempData.signedAmount;
          // row4
          this.formLabelAlign.latLng = tempData.lng + ',' + tempData.lat;
          this.formLabelAlign.naviLatLng = tempData.naviLng + ',' + tempData.naviLat;
          this.formLabelAlign.leftAmount = tempData.leftAmount;
          // row5
          if (tempData.innershareStr == "内部共享" && tempData.type == 2) {
            this.formLabelAlign.type = 4;
          } else if (tempData.innershareStr == "内部共享" && tempData.type == 1) {
            this.formLabelAlign.type = 3;
          } else {
            this.formLabelAlign.type = tempData.type;
          }
          if (tempData.type == 0) {
            this.chargeOptions[0].disabled = true;
            this.chargeOptions[1].disabled = true;
            this.chargeOptions[2].disabled = true;
            this.chargeOptions[3].disabled = true;
          } else if (tempData.type == 1 || tempData.type == 3) {
            this.chargeOptions[0].disabled = true;
            this.chargeOptions[1].disabled = true;
            this.chargeOptions[2].disabled = true;
            this.chargeOptions[3].disabled = true;
          } else if (tempData.type == 2 || tempData.type == 4) {
            this.chargeOptions[0].disabled = true;
            this.chargeOptions[3].disabled = true;
            this.chargeOptions[1].disabled = false;
            this.chargeOptions[2].disabled = false;
          }
          this.formLabelAlign.kind = tempData.kind;
          this.formLabelAlign.state = tempData.state;
          this.formLabelAlign.chargeType = tempData.chargeType;
          if (tempData.leftAmountType == 0) {
            this.carShowText = '不显示'
          } else if (tempData.leftAmountType == 1) {
            this.carShowText = '显示'
          }
          if (this.formLabelAlign.type == 0) {
            this.leftAmountDisabled = false;
          }
          //        新增管理员的联系方式和号码
          if (tempData.userMobile !== null) {
            this.formLabelAlign.adminName = tempData.userMobile.name;
            this.formLabelAlign.adminPhone = tempData.userMobile.phone;
            this.lastAdminName = tempData.userMobile.name;
            this.lastAdminPhone = tempData.userMobile.phone;
          } else {
            this.formLabelAlign.adminName = null;
            this.formLabelAlign.adminPhone = null;
          }

          // row6
          this.formLabelAlign.feeIntro = tempData.feeIntro;
          let file = tempData.fileList;
          if (file[0]) {
            this.imgSrc1 = file[0].path;
            this.imgSrc1Id = file[0].id;
          }
          if (file[1]) {
            this.imgSrc2 = file[1].path;
            this.imgSrc2Id = file[1].id;
          }
          if (file[2]) {
            this.imgSrc3 = file[2].path;
            this.imgSrc3Id = file[2].id;
          }
          if (file[3]) {
            this.imgSrc4 = file[3].path;
            this.imgSrc4Id = file[3].id;
          }
          if (file[4]) {
            this.imgSrc5 = file[4].path;
            this.imgSrc5Id = file[4].id;
          }
          if (tempData.feeRuleReserveList.length != 0) {
            this.reserveFeeRuleId = tempData.feeRuleReserveList[0].id; // 预约费用ID
          }
          console.log(tempData)
          if (tempData.parkingFeeRuleInfoData && tempData.parkingFeeRuleInfoData.length != 0) {
            this.parkingFeeRuleId = tempData.parkingFeeRuleInfoData.id;
          }
          if (tempData.packageByParkLot) {
            this.packageId = tempData.packageByParkLot.id
          }
          this.parklotTimeParamsList = tempData.parklotTimeParamsList;
          this.disparklotTimeParams();
          try {
            this.propfeeList.platformPercent = tempData.parklotPlatformParamsList[5].qhValue;//平台
            this.propfeeList.ownerPercent = tempData.parklotPlatformParamsList[4].qhValue;//业主
            this.propfeeList.propCompPercent = tempData.parklotPlatformParamsList[3].qhValue;//物业
            this.propfeeList.operatorPercent = tempData.parklotPlatformParamsList[2].qhValue;//运营商
            this.propfeeList.platformAppointmentPercent = tempData.parklotPlatformParamsList[1].qhValue;//物业平台
            this.propfeeList.propCompAppointmentPercent = tempData.parklotPlatformParamsList[0].qhValue;//物业物业
          } catch (e) { }
          // 保存当前优惠套餐是否显示 和 不显示
          if (tempData.packageByParkLot) {
            if (tempData.packageByParkLot.packFlot == 1) {
              this.switchPackageState = '1'
            } else {
              this.switchPackageState = '0'
            }
          }
          this.propdata = {
            feeRuleReserveList: tempData.feeRuleReserveList,
            parkingFeeRuleInfoData: tempData.parkingFeeRuleInfoData,
            parklotTimeParamsList: tempData.parklotTimeParamsList,
            parklotPlatformParamsList: tempData.parklotPlatformParamsList,
            userMobile: tempData.userMobile,
            barrierList: tempData.barrierList,
            accessList: tempData.accessList,
            relaymeterList: tempData.relaymeterList,
            packageByParkLot: tempData.packageByParkLot,
            proptype: tempData.type,
            propstate: 1,
          };
          this.proptype = tempData.type;

          this.$root.eventHub.$emit('handle-data', this.propdata);
        } else {
          this.$message.error(res.data.error_message)
        }
      })
    },
    //空车位显示不显示按钮
    carShow() {
      this.carShowText = this.carShowText == '显示' ? "不显示" : "显示";
      this.formLabelAlign.leftAmountType = this.carShowText == '显示' ? "1" : "0";
    },
    // 时间设置的处理
    disparklotTimeParams() {
      for (let i = 0; i < this.parklotTimeParamsList.length; i++) {
        let item = this.parklotTimeParamsList[i];
        let str = item.qhKey;
        let strArr = [];
        strArr = str.split("_");
        strArr[1] = strArr[1].substring(0, 1).toUpperCase() + strArr[1].substring(1);
        strArr[2] = strArr[2].substring(0, 1).toUpperCase() + strArr[2].substring(1);
        str = strArr.join("");
        this.$set(this.timeList, str, item.qhValue);
      }
    },
    //图片操作
    handleChange1(e) {
      const elInput = this.$refs.upload1;
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc1 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          if (this.imgSrc1Id === null) {
            this.imgSrc1Id = 0;
          }
        }
      } else {
        elInput.value = null;
        return;
      }
      this.imgDisabled1 = true;
    },
    handleChange2(e) {
      const elInput = this.$refs.upload2
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc2 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          if (this.imgSrc2Id === null) {
            this.imgSrc2Id = 0;
          }
        }
      } else {
        elInput.value = null;
        return;
      }
      this.imgDisabled2 = true;
    },
    handleChange3(e) {
      const elInput = this.$refs.upload3
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc3 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          if (this.imgSrc3Id === null) {
            this.imgSrc3Id = 0;
          }
        }
      } else {
        elInput.value = null;
        return;
      }
      this.imgDisabled3 = true;
    },
    handleChange4(e) {
      const elInput = this.$refs.upload4
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc4 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          if (this.imgSrc4Id === null) {
            this.imgSrc4Id = 0;
          }
        }
      } else {
        elInput.value = null;
        return;
      }
      this.imgDisabled4 = true;
    },
    handleChange5(e) {
      const elInput = this.$refs.upload5
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc5 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          if (this.imgSrc5Id === null) {
            this.imgSrc5Id = 0;
          }
        }
      } else {
        elInput.value = null;
        return;
      }
      this.imgDisabled5 = true;
    },
    isImagUp(item) {
      let maxSize = 2 * 1024 * 1024;
      let imgType = 'PNG,JPG,GIF';
      let size = item.size;
      let type = item.name.split('.')[1].toUpperCase();
      let num = imgType.indexOf(type);
      if (num == -1) {
        this.$message.error('图片的类型必须是PNG/JPG/GIF格式');
        return false;
      } else if (size > maxSize) {
        this.$message.error('图片的大小要小于2M');
        return false;
      } else {
        return true;
      }
    },
    async removeImg1() {
      if (this.imgSrc1Id === null) {
        return;
      } else if (this.imgSrc1Id === 0) {
        this.imgDisabled1 = false;
        this.imgSrc1 = "";
        this.$refs.upload1.value = '';
        this.formLabelAlign.deleteImg += this.imgName[0] + ','
        this.imgSrc1Id = null;
      } else {
        let datas = {
          parklotId: this.$route.query.estateId,
          fileId: this.imgSrc1Id,
        };
        let data = Qs.stringify(datas);
        let res = await removeImgId(data);
        if (res.error_code === 2000) {
          this.imgDisabled1 = false;
          this.imgSrc1 = "";
          this.$refs.upload1.value = '';
          this.formLabelAlign.deleteImg += this.imgName[0] + ',';
          this.imgSrc1Id = null;
        } else {
          console.log(res, '错误码是=' + res.error_code);
        }
      }
    },
    async removeImg2() {
      if (this.imgSrc2Id === null) {
        return;
      } else if (this.imgSrc2Id === 0) {
        this.imgDisabled2 = false;
        this.imgSrc2 = "";
        this.$refs.upload2.value = '';
        this.formLabelAlign.deleteImg += this.imgName[1] + ','
        this.imgSrc2Id = null;
      } else {
        let datas = {
          parklotId: this.$route.query.estateId,
          fileId: this.imgSrc2Id,
        };
        let data = Qs.stringify(datas);
        let res = await removeImgId(data);
        if (res.error_code === 2000) {
          this.imgDisabled2 = false;
          this.imgSrc2 = "";
          this.$refs.upload2.value = '';
          this.formLabelAlign.deleteImg += this.imgName[1] + ','
          this.imgSrc2Id = null;
        } else {
          console.log(res, '错误码是=' + res.error_code);
        }
      }
    },
    async removeImg3() {
      if (this.imgSrc3Id === null) {
        return;
      } else if (this.imgSrc3Id === 0) {
        this.imgDisabled3 = false;
        this.imgSrc3 = "";
        this.$refs.upload3.value = '';
        this.formLabelAlign.deleteImg += this.imgName[2] + ','
        this.imgSrc3Id = null;
      } else {
        let datas = {
          parklotId: this.$route.query.estateId,
          fileId: this.imgSrc3Id,
        };
        let data = Qs.stringify(datas);
        let res = await removeImgId(data);
        if (res.error_code === 2000) {
          this.imgDisabled3 = false;
          this.imgSrc3 = "";
          this.$refs.upload3.value = '';
          this.formLabelAlign.deleteImg += this.imgName[2] + ','
          this.imgSrc3Id = null;
        } else {
          console.log(res, '错误码是=' + res.error_code);
        }
      }
    },
    async removeImg4() {
      if (this.imgSrc4Id === null) {
        return;
      } else if (this.imgSrc4Id === 0) {
        this.imgDisabled4 = false;
        this.imgSrc4 = "";
        this.$refs.upload4.value = '';
        this.formLabelAlign.deleteImg += this.imgName[3] + ','
        this.imgSrc3Id = null;
      } else {
        let datas = {
          parklotId: this.$route.query.estateId,
          fileId: this.imgSrc4Id,
        };
        let data = Qs.stringify(datas);
        let res = await removeImgId(data);
        if (res.error_code === 2000) {
          this.imgDisabled4 = false;
          this.imgSrc4 = "";
          this.$refs.upload4.value = '';
          this.formLabelAlign.deleteImg += this.imgName[3] + ','
          this.imgSrc4Id = null;
        } else {
          console.log(res, '错误码是=' + res.error_code);
        }
      }
    },
    async removeImg5() {
      if (this.imgSrc5Id === null) {
        return;
      } else if (this.imgSrc5Id === 0) {
        this.imgDisabled5 = false;
        this.imgSrc5 = "";
        this.$refs.upload5.value = '';
        this.formLabelAlign.deleteImg += this.imgName[4] + ','
        this.imgSrc5Id = null;
      } else {
        let datas = {
          parklotId: this.$route.query.estateId,
          fileId: this.imgSrc5Id,
        };
        let data = Qs.stringify(datas);
        let res = await removeImgId(data);
        if (res.error_code === 2000) {
          this.imgDisabled5 = false;
          this.imgSrc5 = "";
          this.$refs.upload5.value = '';
          this.formLabelAlign.deleteImg += this.imgName[4] + ','
          this.imgSrc5Id = null;
        } else {
          console.log(res, '错误码是=' + res.error_code);
        }
      }
    },
    //当小区类型改变时
    changeType(val) {
      console.log(val)
      val == 0 ? this.leftAmountDisabled = false : this.leftAmountDisabled = true;
      this.$root.eventHub.$emit('parkLot-id', this.formLabelAlign.type);
      if (val == 0) {
        this.formLabelAlign.chargeType = 2;
        this.chargeOptions[0].disabled = true;
        this.chargeOptions[1].disabled = true;
        this.chargeOptions[2].disabled = true;
        this.chargeOptions[3].disabled = true;
      } else if (val == 1 || val == 3) {
        this.formLabelAlign.chargeType = 0;
        this.chargeOptions[0].disabled = true;
        this.chargeOptions[1].disabled = true;
        this.chargeOptions[2].disabled = true;
        this.chargeOptions[3].disabled = true;
      } else if (val == 2 || val == 4) {
        this.formLabelAlign.chargeType = 0;
        this.chargeOptions[0].disabled = true;
        this.chargeOptions[3].disabled = true;
        this.chargeOptions[1].disabled = false;
        this.chargeOptions[2].disabled = false;
      }
    },
    //提交数据
    postData(event) {
      var formData = new FormData();
      var patt1 = /^1[3|4|5|7|8][0-9]{9}$/;
      let lnglatreg = /^(\-)?\d+(\.\d+)$/;
      let regNum = /^[0-9]([0-9]{0,3})$/;
      let regfeeList = /^[0-9]([0-9]{0,4})$/;
      let latLng = this.formLabelAlign.latLng;
      let naviLatLng = this.formLabelAlign.naviLatLng;
      // 小区经纬度
      if (latLng == '') {
        this.$message.error('小区经纬度不能为空');
        return false;
      } else {
        let num = latLng.indexOf(',');
        if (num == -1) {
          this.$message.error('小区经纬度录入有误');
          return false;
        } else {
          let lnglatDataArr = latLng.split(',');
          if (lnglatreg.test(lnglatDataArr[0]) == false || lnglatreg.test(lnglatDataArr[1]) == false) {
            this.$message.error('小区经纬度录入有误');
            return false;
          }
        }
      }
      // 判断车库的经纬度
      if (naviLatLng == '') {
        this.$message.error('车库入口经纬度不能为空');
        return;
      } else {
        let num = naviLatLng.indexOf(',');
        if (num == -1) {
          this.$message.error('车库入口经纬度不正确');
          return;
        } else {
          let lnglatDataArr = naviLatLng.split(',');
          if (lnglatreg.test(lnglatDataArr[0]) == false || lnglatreg.test(lnglatDataArr[1]) == false) {
            this.$message.error('车库入口经纬度不正确');
            return;
          }
        }
      }
      let pattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (this.formLabelAlign.areaId == '') {
        this.$message.error('区/县的数据不能为空');
        return false;
      } else if (this.formLabelAlign.address == '') {
        this.$message.error('小区详细地址不能为空');
        return false;
      } else if (this.formLabelAlign.name == '') {
        this.$message.error('小区名称不能为空');
        return false;
      } else if (!(pattern.test(this.formLabelAlign.name))) {
        this.$message.error('小区名称只能录入（数字，字母，汉字）其余字段为非法字符');
        return false;
      } else if (this.formLabelAlign.totalAmount == '' && this.formLabelAlign.totalAmount != 0) {
        this.$message.error('小区车位总数量不能为空');
        return false;
      } else if (regNum.test(this.formLabelAlign.totalAmount) == false) {
        this.$message.error('车位总数量仅可输入整数1-9999');
        return false;
      } else if (regNum.test(this.formLabelAlign.signedAmount) == false) {
        this.$message.error('签约车位数量仅可输入整数1-9999');
        return false;
      } else if (Number(this.formLabelAlign.signedAmount) > Number(this.formLabelAlign.totalAmount)) {
        this.$message.error('签约车位数量应小于等于车位总数量');
        return false;
      } else if (patt1.test(this.formLabelAlign.contactPhone) == false) {
        this.$message.error('电话号码必须是一个11位以1开头的数字');
        return false;
      } else if (this.formLabelAlign.type == -1) {
        this.$message.error('小区的类型不能为空');
        return false;
      } else if (this.formLabelAlign.kind == -1) {
        this.$message.error('停车场的类型不能为空');
        return false;
      } else if (this.formLabelAlign.state == -1) {
        this.$message.error('小区的状态不能为空');
        return false;
      } else if (this.formLabelAlign.feeIntro && this.formLabelAlign.feeIntro.length > 255) {
        this.$message.error('停车场收费信息的字数最多是255个');
        return false;
      } else if (this.formLabelAlign.type === 0) {  //车位查询
        if (!regNum.test(this.formLabelAlign.leftAmount)) {
          this.$message.error('空车位数量仅可输入整数1-9999');
          return false;
        } else if (Number(this.formLabelAlign.leftAmount) > Number(this.formLabelAlign.totalAmount)) {
          this.$message.error('空车位数量应小于等于车位总数量');
          return false;
        }
        this.formLabelAlign.leftAmountType = this.carShowText == '显示' ? "1" : "0";
        formData.append("isShow", this.formLabelAlign.leftAmountType)
        formData.append("leftAmount", this.formLabelAlign.leftAmount)   //车位查询传递空车位数和空车位数是否显示
      }
      else if (this.formLabelAlign.type != 0 && this.formLabelAlign.type != -1) { //非车位查询
        // 这里要做判断处理
        if (this.formLabelAlign.adminName === '' || this.formLabelAlign.adminName === undefined) {
          this.$message.error('管理员姓名是必填项');
          return false;
        } else if (this.formLabelAlign.adminPhone === '' || this.formLabelAlign.adminPhone === undefined) {
          this.$message.error('管理员联系方式是必填项');
          return false;
        } else if (patt1.test(this.formLabelAlign.adminPhone) == false) {
          this.$message.error('管理员联系方式是以1开头的11位数字');
          return false;
        } else if (
          !this.timeList.minPublishInterval ||
          !this.timeList.minSharingPeriod ||
          !this.timeList.freeCancellationTime ||
          !this.timeList.maxDelayTime ||
          !this.timeList.minChargingPeriod ||
          !this.timeList.advanceChangeTime ||
          !this.timeList.advanceReservationTime ||
          (regfeeList.test(this.timeList.minPublishInterval) == false) ||
          (regfeeList.test(this.timeList.minSharingPeriod) == false) ||
          (regfeeList.test(this.timeList.freeCancellationTime) == false) ||
          (regfeeList.test(this.timeList.maxDelayTime) == false) ||
          (regfeeList.test(this.timeList.minChargingPeriod) == false) ||
          (regfeeList.test(this.timeList.advanceChangeTime) == false) ||
          (regfeeList.test(this.timeList.advanceReservationTime) == false)
        ) {
          this.$message.error('时间设置必填,必须是数字');
          return false;
        } else if (Number(this.timeList.minPublishInterval) % 15 != 0) {
          this.$message.error('发布时段间隔必选为15或15的整倍数');
          return false;
        } else if (Number(this.timeList.minSharingPeriod) % 15 != 0) {
          this.$message.error('最短共享时长必选为15或15的整倍数');
          return false;
        } else if (Number(this.timeList.minChargingPeriod) % 15 != 0) {
          this.$message.error('最短计费时长间隔必选为15或15的整倍数');
          return false;
        } else if (
          (regfeeList.test(this.propfeeList.platformPercent) == false) ||
          (regfeeList.test(this.propfeeList.ownerPercent) == false) ||
          (regfeeList.test(this.propfeeList.propCompPercent) == false) ||
          (regfeeList.test(this.propfeeList.operatorPercent) == false) ||
          (regfeeList.test(this.propfeeList.platformAppointmentPercent) == false) ||
          (regfeeList.test(this.propfeeList.propCompAppointmentPercent) == false)
        ) {
          this.$message.error('分成比例必填,必须是整数');
          return false;
        } else if (Number(this.propfeeList.platformPercent) + Number(this.propfeeList.ownerPercent) + Number(this.propfeeList.propCompPercent) + Number(this.propfeeList.operatorPercent) !== Number(100) || Number(this.propfeeList.platformAppointmentPercent) + Number(this.propfeeList.propCompAppointmentPercent) != Number(100)) {
          this.$message.error('分成比例之和必须是100');
          return false;
        } else {
          if (this.reserveFeeRuleId === null || this.reserveFeeRuleId == 0 || this.parkingFeeRuleId == null || this.parkingFeeRuleId == 0) {
            this.$message.error("预约费用 或 停车费用没有做选择");
            return;
          }
          if (!this.lastAdminName) {
            this.lastAdminName = this.formLabelAlign.adminName;
            this.lastAdminPhone = this.formLabelAlign.adminPhone;
          }
          formData.append('adminName', this.formLabelAlign.adminName)
          formData.append('adminPhone', this.formLabelAlign.adminPhone)
          formData.append('lastAdminName', this.lastAdminName)
          formData.append('lastAdminPhone', this.lastAdminPhone)
          formData.append('reserveFeeRuleId', this.reserveFeeRuleId)
          formData.append('parkingFeeRuleId', this.parkingFeeRuleId)
          // 时间设置
          formData.append('minPublishInterval', parseInt(this.timeList.minPublishInterval))
          formData.append('minSharePeriod', parseInt(this.timeList.minSharingPeriod))
          formData.append('freeCancellationTime', parseInt(this.timeList.freeCancellationTime))
          formData.append('maxDelayTime', parseInt(this.timeList.maxDelayTime))
          formData.append('minChargePeriod', parseInt(this.timeList.minChargingPeriod))
          formData.append('advanceChangeTime', parseInt(this.timeList.advanceChangeTime))
          formData.append('advanceReservationTime', parseInt(this.timeList.advanceReservationTime))
          // 收入比例
          formData.append('platformPercent', parseInt(this.propfeeList.platformPercent))
          formData.append('ownerPercent', parseInt(this.propfeeList.ownerPercent))
          formData.append('propCompPercent', parseInt(this.propfeeList.propCompPercent))
          formData.append('operatorPercent', parseInt(this.propfeeList.operatorPercent))
          formData.append('propCompAppointmentPercent', parseInt(this.propfeeList.propCompAppointmentPercent))
          formData.append('platformAppointmentPercent', parseInt(this.propfeeList.platformAppointmentPercent))
          this.formLabelAlign.leftAmountType = this.carShowText == '显示' ? "1" : "0";
          formData.append("isShow", 0)  //空车位是否显示,非车位查询时 传 0
        }
      }
      //加载动画
      const loading = this.$loading({
        lock: true,
        text: '上传中,请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      console.log(this.packageId);
      if (this.packageId) {
        formData.append("packageId", this.packageId)
      }
      // 对其是否展示优惠套餐做赋值操作
      formData.append('packageState',this.switchPackageState)
      formData.append("parklotId", this.$route.query.estateId)
      formData.append("areaId", this.formLabelAlign.areaId)
      formData.append("name", this.formLabelAlign.name)
      formData.append("address", this.formLabelAlign.address)
      formData.append("latLng", this.formLabelAlign.latLng)
      formData.append("naviLatLng", this.formLabelAlign.naviLatLng)
      formData.append("contactName", this.formLabelAlign.contactName)
      formData.append("contactPhone", this.formLabelAlign.contactPhone)
      formData.append("type", this.formLabelAlign.type)
      formData.append("state", this.formLabelAlign.state)
      formData.append("chargeType", this.formLabelAlign.chargeType)
      formData.append("totalAmount", this.formLabelAlign.totalAmount)
      formData.append("signedAmount", this.formLabelAlign.signedAmount)
      formData.append("kind", this.formLabelAlign.kind)
      formData.append("feeIntro", this.formLabelAlign.feeIntro)
      // 停车费用 和 预约费用设置
      if (this.$refs.upload1.files[0]) {
        formData.append("files", this.$refs.upload1.files[0]);
        this.fileIds.push(this.imgSrc1Id);
      }
      if (this.$refs.upload2.files[0]) {
        formData.append("files", this.$refs.upload2.files[0]);
        this.fileIds.push(this.imgSrc2Id);
      }
      if (this.$refs.upload3.files[0]) {
        formData.append("files", this.$refs.upload3.files[0])
        this.fileIds.push(this.imgSrc3Id);
      }
      if (this.$refs.upload4.files[0]) {
        formData.append("files", this.$refs.upload4.files[0])
        this.fileIds.push(this.imgSrc4Id);
      }
      if (this.$refs.upload5.files[0]) {
        formData.append("files", this.$refs.upload5.files[0])
        this.fileIds.push(this.imgSrc5Id);
      }
      formData.append('fileIds', this.fileIds);

      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.$http.post('parklot/add', formData, config).then(res => {
        this.load = false;
        if (res.data.error_code == 2000) {
          loading.close();
          this.open();
        } else {
          this.fileIds = [];
          this.$message.error(res.data.error_message);
          loading.close();
        }
      }).catch(err => {
        this.fileIds = [];
        this.$message.error(err);
        loading.close();
      })
    },
    //成功提交到服务器
    open() {
      this.$alert('已成功编辑小区', '修改成功', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.go(-1);
        }
      });
    },
    // 搜索框的数据(公共的方法)
    searchEvent() {
      this.seachLoading = true;
      if (this.isSearch == 0) {
        if (this.searchFromData.name == "") {
          this.$message.error('搜索名称为空，请输入内容才能进行搜索');
          let timer = setInterval(() => {
            this.seachLoading = false;
            clearInterval(timer);
          }, 1500);
          return;
        } else {
          // 开始进行搜索
          this.start = 0;
          this.paramsData();
        }
      } else if (this.isSearch == 1) {
        if (this.searchFromData.name !== "") {
          this.start = 0;
          this.isSearch = 0;
          if (this.dialogTableVisible === true) {
            this.getTableDatas();
          } else if (this.dialogTableParking === true) {
            this.getPakingTableDatas();
          }
        } else if (this.searchFromData.name == "") {
          this.paramsData();
        }
      }
      ;
    },
    // 带参查询数据，进行搜索
    paramsData() {
      this.isSearch = 1;
      this.start = 0;
      this.display = 10;
      if (this.dialogTableVisible === true) {
        this.getTableDatas();
      } else if (this.dialogTableParking === true) {
        this.getPakingTableDatas();
      }
    },
    // 分页菜单的数据
    pagechanges(val) {
      var start = 0;
      this.page = val;
      // 计算位置
      this.compage = val;
      start = (val - 1) * this.display;
      this.start = start;
      if (this.dialogTableVisible === true) {
        this.getTableDatas();
      } else if (this.dialogTableParking === true) {
        this.getPakingTableDatas();
      }
    },
    searchReturn(ev) {
      ev.preventDefault();
      return false;
    },
  },
  components: {
    paingchild,
    selectchild,
    commonInfo
  },
}

</script>
