<template>
  <div class="estate">
    <div class="divStyle">
      <div class="divcontent">
        <div>
          <template>
            <h2>查看小区详情</h2>
            <div style="margin: 20px;"></div>
            <el-form label-position="top" label-width="80px" ref="formLabelAlign" v-loading="loading"
                     :model="formLabelAlign">
              <!--省市级联动判断还有待优化-->
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*省" prop="provinceId">
                      <el-select
                        disabled
                        placeholder="=请选择省份="
                        v-model="formLabelAlign.provinceId"
                        :clearable="false">
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
                      <el-select
                        disabled
                        :clearable="false"
                        placeholder="=请选择城市="
                        width="100%"
                        v-model="formLabelAlign.cityId">
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
                      <el-select
                        disabled
                        :clearable="false"
                        placeholder="=请选择县区="
                        width="100%"
                        v-model="formLabelAlign.areaId">
                        <!-- label表示的是每一个下拉列表的数据 -->
                        <el-option v-for="item in areaId" :label="item.name" :value="item.id" :key="item.type">
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
                      <el-input v-model="formLabelAlign.name" placeholder="请输入小区名称" :maxlength=20></el-input>
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
                      <el-input v-model.number="formLabelAlign.contactPhone" placeholder="请输入联系电话"
                                :maxlength=11></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <el-form-item label="签约车位数量" prop="signedAmount">
                      <el-input v-model.lazy="formLabelAlign.signedAmount" placeholder="请输入签约车位数量"
                                :maxlength=4></el-input>
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
                      <a href="http://lbs.amap.com/console/show/picker" target="_blank" class="linkStyle"><i
                        class="el-icon-search"></i>查询位置信息 </a>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="空车位数量(注意：空车位数为0表示没有继电器)" prop="leftAmount">
                      <el-input v-model.number="formLabelAlign.leftAmount" placeholder="请输入空车位数量"
                                :disabled="leftAmountDisabled" :maxlength=4></el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="grid-content bg-purple">
                    <el-form-item label="是否显示" prop="">
                      <el-button plain :disabled="leftAmountDisabled">{{carShowText}}</el-button>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区类型" prop="type">
                      <template>
                        <el-select v-model="formLabelAlign.type" placeholder="=请选择小区类型=">
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
                        <el-option v-for="item in parkingTypeOptions" :label="item.name" :value="item.type"
                                   :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*小区状态" prop="state">
                      <el-select clearable v-model="formLabelAlign.state" placeholder="=请选择小区状态=">
                        <el-option v-for="item in estateTypeOptions" :label="item.name" :value="item.type"
                                   :key="item.type">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-form-item label="*收费模式" prop="charge">
                      <el-select clearable v-model="formLabelAlign.chargeType" placeholder="=请选择收费模式=">
                        <el-option v-for="item in chargeOptions" :label="item.name" :value="item.type"
                                   :key="item.type">
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
                    <el-input type="textarea" :rows="3" v-model.lazy="formLabelAlign.feeIntro"
                              :maxlength=255></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="小区图片1" class='myUpload'>
                    <input type='file' ref="upload1" :disabled=true>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  图片规定2M以内，支持PNG/JPG/GIF,上传首选PNG
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc1">
                </el-col>
                <el-col :span="4">
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片2" class='myUpload'>
                    <input type='file' ref="upload2" :disabled=true>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc2">
                </el-col>
                <el-col :span="4">
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片3" class='myUpload'>
                    <input type='file' ref="upload3" :disabled=true>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc3">
                </el-col>
                <el-col :span="4">
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片4" class='myUpload'>
                    <input type='file' ref="upload4" :disabled=true>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc4">
                </el-col>
                <el-col :span="4">
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">
                  <el-form-item label="小区图片5" class='myUpload'>
                    <input type='file' ref="upload5" :disabled=true>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <img :src="imgSrc5">
                </el-col>
                <el-col :span="4">
                </el-col>
              </el-row>
              <br>
              <template v-if="formLabelAlign.type != -1 && formLabelAlign.type != 0">
                <!--时长设置-->
                <el-tabs type="border-card">
                  <el-tab-pane label="时间设置">
                  </el-tab-pane>
                  <el-form :model="parklotTimeParamsArr" class="demo-form-inline">
                    <el-row :span="24">
                      <el-col :span="3">
                        <el-form-item label="发布时段间隔(分钟)">
                          <el-input v-model.lazy="parklotTimeParamsArr.minPublishInterval" placeholder="请输入发布时段间隔"
                                    :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="最短共享时长(分钟)">
                          <el-input v-model.lazy="parklotTimeParamsArr.minSharingPeriod" placeholder="请输入最短共享时长"
                                    :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="免费取消时长(分钟)">
                          <el-input v-model.lazy="parklotTimeParamsArr.freeCancellationTime" placeholder="请输入免费取消时长"
                                    :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="车位保留时长（分钟）">
                          <el-input v-model.lazy="parklotTimeParamsArr.maxDelayTime" placeholder="请输入车位保留时长"
                                    :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="最短计费时长(分钟)">
                          <el-input v-model.lazy="parklotTimeParamsArr.minChargingPeriod" placeholder="最短计费时长"
                                    :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item label="提前变更车位时间(分钟)">
                          <el-input v-model.lazy="parklotTimeParamsArr.advanceChangeTime" placeholder="请输入提前变更车位时间"
                                    :maxlength=4></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="3">
                        <el-form-item label="提前可预约车位时间(分钟)">
                          <el-input v-model.lazy="parklotTimeParamsArr.advanceReservationTime" placeholder="请输入提前可预约车位时间)"
                                    :maxlength=4></el-input>
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
                      <td><el-input v-model.lazy="propfeeList.platformAppointmentPercent" placeholder="请输入平台抽成"></el-input></td>
                      <td><el-input placeholder="0" :disabled="true"></el-input></td>
                      <td><el-input v-model.lazy="propfeeList.propCompAppointmentPercent" placeholder="请输入物业抽成"></el-input></td>
                      <td><el-input placeholder="0" :disabled="true"></el-input></td>
                    </tr>
                    <tr>
                      <td>业主</td>
                      <td><el-input v-model.lazy="propfeeList.platformPercent" placeholder="请输入平台抽成"></el-input></td>
                      <td><el-input v-model.lazy="propfeeList.ownerPercent" placeholder="请输入业主抽成"></el-input></td>
                      <td><el-input v-model.lazy="propfeeList.propCompPercent" placeholder="请输入物业抽成"></el-input></td>
                      <td><el-input v-model.lazy="propfeeList.operatorPercent" placeholder="0" :disabled="true"></el-input></td>
                    </tr>
                  </table>
                </el-tabs>
              </template>
              <br>

              <!--集成了子组件当中去把这个模块-->
              <common-info></common-info>

              <el-form-item>
                <el-button type="primary" @click="goBack">返回小区列表
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Qs from 'qs';
  import commonInfo from "@/components/commonpage/commonInfo"

  export default {
    data(){
      return {
//       预约费用模态框的数据
        radio: null,
        showClose: false, // 模态框小叉
        searchFromData: {
          name: '',
        },
        isflag: false,
        isSearch: 0,
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
        parklotTimeParamsArr: {},  //设置时间集合的表格

        parklotPlatformParamsList: [],  //平台收费比例集合
        parklotPlatformParamsArr:{}, // 要显示平台收费的表格
//      抽成比例设置
        propfeeList: {
          platformPercent: '',
          ownerPercent: '',
          propCompPercent: '',
          operatorPercent: '',
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
          {value: -1, label: '=请选择小区类型='},
          {value: 0, label: '车位查询'},
          {value: 1, label: '约车场'},
          {value: 2, label: '约车位'},
          {value: 3, label: '约车场内部共享'},
          {value: 4, label: '约车位内部共享'},
        ],
        estateTypeOptions: [
          {type: -1, name: '=请选择小区状态='},
          {type: 0, name: '关闭'},
          {type: 1, name: '开放'},
        ],
        parkingTypeOptions: [
          {type: -1, name: '=请选择停车场类型='},
          {type: 0, name: '室内'},
          {type: 1, name: '室外'},
          {type: 2, name: '室内+室外'}
        ],
        chargeOptions:[
          {type: -1, name: '=请选择收费模式='},
          {type: 0, name: '道闸计费'},
          {type: 1, name: '车锁计费'},
          {type: 2, name: '无'},
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
          chargeType:0,//收费模式

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
      }
    },
    created(){
      this.getData();
    },
    methods: {
      // 获取省市区
      getBasicsData(num, flag){
        this.$http.get('area/' + num).then(res => {
          var tempData = res.data.data;
        if (flag == 1) {
          this.province = tempData;
        } else if (flag == 2) {
          this.citys = tempData;
        } else if (flag == 3) {
          this.areaId = tempData;
        }
      }).catch(err => {
          console.log(err);
      })
      },
      // 下拉框 省市 级事件
      getIDisNum(num, flag){
        if (flag == 2) {
          this.formLabelAlign.cityId = '';
          this.formLabelAlign.areaId = '';
        } else if (flag == 3) {
          this.formLabelAlign.areaId = '';
        }
        this.getDatasList(num, flag);
      },
      getData(){
        this.$http("parklot/"+this.$route.query.estateId).then(res => {
          if (res.data.error_code === 2000) {
          let tempData = res.data.data;
          console.log(tempData)
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
          if(tempData.innershareStr == "内部共享" && tempData.type == 2){
            this.formLabelAlign.type = 4;
          }else if(tempData.innershareStr == "内部共享" && tempData.type == 1){
            this.formLabelAlign.type = 3;
          }else {
            this.formLabelAlign.type = tempData.type;
          }
          this.formLabelAlign.kind = tempData.kind;
          this.formLabelAlign.state = tempData.state;
          this.formLabelAlign.chargeType = tempData.chargeType;
          if(tempData.leftAmountType == 0){
            this.carShowText = '不显示'
          }else if(tempData.leftAmountType == 1){
            this.carShowText = '显示'
          }
//        新增管理员的联系方式和号码
//          debugger
          if(tempData.userMobile !== null){
            this.formLabelAlign.adminName = tempData.userMobile.name;
            this.formLabelAlign.adminPhone = tempData.userMobile.phone;
          }else{
            this.formLabelAlign.adminName = null;
            this.formLabelAlign.adminPhone = null;
          }

// row6
          this.formLabelAlign.feeIntro = tempData.feeIntro;

          var file = tempData.fileList;
          if (file[0]) {
            this.imgSrc1 =file[0].path;
          }
          if (file[1]) {
            this.imgSrc2 =file[1].path;
          }
          if (file[2]) {
            this.imgSrc3 =file[2].path;
          }
          if (file[3]) {
            this.imgSrc4 =file[3].path;
          }
          if (file[4]) {
            this.imgSrc5 =file[4].path;
          }
//            console.log(this.imgSrc1);
          this.parklotTimeParamsList = tempData.parklotTimeParamsList;
          this.disparklotTimeParams();
          try{
            this.propfeeList.platformPercent = tempData.parklotPlatformParamsList[5].qhValue;//平台
            this.propfeeList.ownerPercent = tempData.parklotPlatformParamsList[4].qhValue;//业主
            this.propfeeList.propCompPercent = tempData.parklotPlatformParamsList[3].qhValue;//物业
            this.propfeeList.operatorPercent = tempData.parklotPlatformParamsList[2].qhValue;//运营商
            this.propfeeList.platformAppointmentPercent = tempData.parklotPlatformParamsList[1].qhValue;//物业平台
            this.propfeeList.propCompAppointmentPercent = tempData.parklotPlatformParamsList[0].qhValue;//物业物业
          }catch (e){}
          this.propdata = {
            feeRuleReserveList: tempData.feeRuleReserveList,
            parkingFeeRuleInfoData: tempData.parkingFeeRuleInfoData,
            parklotTimeParamsList: tempData.parklotTimeParamsList,
            parklotPlatformParamsList: tempData.parklotPlatformParamsList,
            userMobile: tempData.userMobile,
            barrierList: tempData.barrierList,
            accessList: tempData.accessList,
            relaymeterList: tempData.relaymeterList,
            packageByParkLot:tempData.packageByParkLot,
            proptype: tempData.type,
            propstate: 0,
          };
          this.proptype = tempData.type;
          this.$root.eventHub.$emit('handle-data', this.propdata);
        }else {
          this.$message.error(res.data.error_message)
        }
      })
      },
      // 时间处理
      disparklotTimeParams(){
        for(let i=0;i<this.parklotTimeParamsList.length;i++){
          let item = this.parklotTimeParamsList[i];
          let str = item.qhKey;
          let strArr = [];
          strArr = str.split("_");
          strArr[1] = strArr[1].substring(0,1).toUpperCase()+strArr[1].substring(1);
          strArr[2] = strArr[2].substring(0,1).toUpperCase()+strArr[2].substring(1);
          str = strArr.join("");
          this.$set(this.parklotTimeParamsArr,str,item.qhValue);
        }
      },
      goBack(){
        this.$router.go(-1);
      },
    },
    components: {
      commonInfo
    },
  }

</script>

<style scoped>
  img {
    width: 100px;
    height: 100px;
  }

  .divStyle {
    border-radius: 4px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px 0 rgba(34, 36, 38, .12), 0 2px 10px 0 rgba(34, 36, 38, .15);
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