<template>
  <div class="estate">
    <div class="divStyle">
      <p class="importInfo">&nbsp;&nbsp;&nbsp;&nbsp;带*内容必填</p>
      <div class="divcontent">
        <div>
          <template>
            <h2>新增小区</h2>
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
                <!--预约费用规则绑定-->
                <el-tabs type="border-card">
                  <el-tab-pane label="预约费用">
                    <el-button type="primary" plain @click="bookingFeeTable">点击绑定</el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </el-tab-pane>
                  <table border style="width:100%;border-color:#ebeef5;" class="myTable" v-if="miunteList.length !== 0">
                    <thead>
                      <th width="10%">预约费用ID</th>
                      <th width="10%;">时长</th>
                      <th v-for="(item,index) in tableArray.miunteList" :key="index">{{item}}分钟</th>
                    </thead>
                    <tbody style="text-align:center;">
                      <tr>
                        <td width="10%;">{{tableArray.id}}</td>
                        <td width="10%;">费用（元）</td>
                        <td v-for="(item,index) in tableArray.feeAll" :key="index">{{item}}元</td>
                      </tr>
                    </tbody>
                  </table>
                </el-tabs>
                <br>
                <!--停车费用绑定-->
                <el-tabs type="border-card">
                  <el-tab-pane label="停车费用">
                    <el-button type="primary" plain @click="parkingFeeTable">点击绑定</el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </el-tab-pane>
                  <br>
                  <template v-if="parkingTable.length !== 0">
                    <el-table :data="parkingTable" :span-method="objectSpanMethod" border>
                      <el-table-column prop="id" label="ID" width="180">
                      </el-table-column>
                      <el-table-column prop="name" label="停车费用规则">
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button @click="parkingDetails">详情</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-tabs>
                <br>

                <!-- 优惠套餐 -->
                <el-tabs type="border-card">
                  <el-tab-pane label="优惠套餐">
                    <el-button type="primary" plain @click="getDiscountPackageE">点击绑定</el-button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </el-tab-pane>
                  <br>
                  <template v-if="preferentialTable_noModel.length !== 0">
                    <el-table :data="preferentialTable_noModel" border style="width: 100%">
                      <el-table-column label="ID" prop="id">
                      </el-table-column>
                      <el-table-column label="套餐名称" prop="name">
                      </el-table-column>
                      <el-table-column label="套餐类型" prop="typeStr">
                      </el-table-column>
                      <el-table-column label="有效期" prop="effectiveTime" width="220px;">
                      </el-table-column>
                      <el-table-column label="操作" width="300px;">
                        <template slot-scope="scope">
                          <el-button @click="couponPackageDetailsE(scope.row.id)">详情</el-button>
                          <!-- packageState  0 是不展示 1 是展示 -->
                          <!-- <el-button @click="couponSwitchShowOrHiddenE(1)"></el-button> -->
                          &nbsp;&nbsp;
                          <el-switch v-model="switchPackageState" active-text="展示" inactive-text="不展示" active-value="1" inactive-value="0"></el-switch>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-tabs>
                <br>

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
                          <el-input v-model.lazy="timeList.minSharePeriod" placeholder="请输入最短共享时长" :maxlength=4></el-input>
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
                          <el-input v-model.lazy="timeList.minChargePeriod" placeholder="最短计费时长" :maxlength=4></el-input>
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
              <br>
              <el-form-item>
                <el-button type="primary" @click="postData($event)" :loading="load" v-if="this.getInfo!=2">{{butText}}</el-button>
              </el-form-item>
            </el-form>
          </template>
          <!--6.1 选择预约费模态框 parkingCostRules -->
          <el-dialog title="选择套餐费用" :show-close="showClose" width="60%" :visible.sync="dialogTableVisible" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">
            <!--2.0 模态框的搜索区域-->
            <div class="modelSearch">
              <el-row>
                <el-col :span="3">预约费规则名称:</el-col>
                <el-col :span="6">
                  <el-input placeholder="请输入规则名称" v-model.trim="searchFromData.name" @keyup.enter.native="searchEvent"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="searchEvent">搜索</el-button>
                </el-col>
              </el-row>
            </div>
            <br>
            <template>
              <el-table :data="tableDatas" style="width: 100%" row-key="id" :expand-row-keys="expands" @row-click="rowClick" border>
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-table :data="reserveData" height="250" border style="width: 100%">
                      <el-table-column prop="miunte" label="提前时间（分钟）">
                      </el-table-column>
                      <el-table-column prop="fee" label="费用（元）">
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="ID" prop="id">
                </el-table-column>
                <el-table-column label="预约费规则名称" prop="name">
                </el-table-column>
                <el-table-column label="选中" width="136">
                  <template slot-scope="scope">
                    <el-radio class="radio" v-model="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row)"></el-radio>
                  </template>
                </el-table-column>
              </el-table>
            </template>

            <div slot="footer" class="dialog-footer">
              <div class="page">
                <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
              </div>
              <div class="btnStyle">
                <el-button type="danger" @click="closeTagDialogTableVisible">关闭</el-button>
                <el-button type="primary" @click="tableTagToInputEvent">提交</el-button>
              </div>
            </div>
          </el-dialog>
          <!--6.2 选择停车费用模态框-->
          <el-dialog title="选择停车的收费的类型" :show-close="showClose" width="60%" :visible.sync="dialogTableParking" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">
            <div class="modelSearch">
              <el-row>
                <el-col :span="3">停车费规则名称:</el-col>
                <el-col :span="6">
                  <el-input placeholder="请输入规则名称" v-model.trim="searchFromData.name" @keyup.enter.native="searchEvent"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="searchEvent">搜索</el-button>
                </el-col>
              </el-row>
            </div>
            <br>
            <template>
              <el-table :data="ParkingDatas" border>
                <el-table-column prop="id" label="ID" width="180">
                </el-table-column>
                <el-table-column prop="name" label="停车费用规则">
                </el-table-column>
                <!--单选-->
                <el-table-column label="选中" width="136">
                  <template slot-scope="scope">
                    <el-radio class="radio" v-model="parkingFeeRuleId" :label="scope.row.id" @change.native="getCurrentRowparking(scope.row)"></el-radio>
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <div slot="footer" class="dialog-footer">
              <div class="page">
                <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
              </div>
              <div class="btnStyle">
                <el-button type="danger" @click="closeParking">关闭</el-button>
                <el-button type="primary" @click="submitParking">提交</el-button>
              </div>
            </div>
          </el-dialog>
          <!--6.3 停车费用详情模态框-->
          <el-dialog title="详情" :show-close="showClose" width="60%" :visible.sync="parkingCostRules" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">
            <div>
              <el-form :model="formInline" class="demo-form-inline">
                <br>
                <el-row>
                  <el-col :span="6">
                    停车费规则名称
                    <el-input v-model="formInline.name" placeholder="请输入停车费规则名称" :maxlength=20></el-input>
                  </el-col>
                  <el-col :span="4">
                    计费周期
                    <el-select v-model="formInline.billingCycle" placeholder="请选择" :disabled="disabledDet">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-form>
              <template v-if="formInline.billingCycle==1">
                <el-table key="everyday" :data="tableData" border style="width: 100%">
                  <el-table-column prop="billingCycle" label="计费周期">
                  </el-table-column>
                  <el-table-column prop="billingPeriod" label="计费时段">
                  </el-table-column>
                  <el-table-column label="免费时间（分钟）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="首小时（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="次小时（元）">
                    <template slot-scope="scope">
                      每
                      <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                      分钟
                      <br> 收费
                      <el-input v-model.trim="scope.row.otherTimeFee" class="inputClass" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                      元
                    </template>
                  </el-table-column>
                  <el-table-column label="超时额外收费（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="封顶（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input type="textarea" :rows="2" :maxlength=20 v-model.trim="scope.row.remark">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table key="everydays" v-if="tableFlag==1" :data="tableDatas" border :show-header=false style="width: 100%">
                  <el-table-column label="计费周期">
                    <template slot-scope="scope">
                      计费有效期 <br>
                      <div class="block">
                        <span class="demonstration">开始</span>
                        <el-date-picker v-model="scope.row.startTime" type="date" value-format="timestamp">
                        </el-date-picker>
                      </div>
                      <div class="block">
                        <span class="demonstration">结束</span>
                        <el-date-picker v-model="scope.row.endTime" type="date" value-format="timestamp" @change="endTimeChagne(scope.$index)">
                        </el-date-picker>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="计费时段">
                    <template slot-scope="scope">
                      <br>
                      <span class="demonstration">开始</span>
                      <el-time-picker value-format="timestamp" v-model="scope.row.startPeriod">
                      </el-time-picker>
                      <span class="demonstration">结束</span>
                      <el-time-picker value-format="timestamp" v-model="scope.row.endPeriod">
                      </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="免费时间（分钟）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="首小时（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="次小时（元）">
                    <template slot-scope="scope">
                      每
                      <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)"></el-input>
                      分钟
                      <br> 收费
                      <el-input v-model.trim="scope.row.otherTimeFee" :maxlength=3 class="inputClass" @change="inputChange(scope.row)"></el-input>
                      元
                    </template>
                  </el-table-column>
                  <el-table-column label="超时额外收费（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="封顶（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input type="textarea" :rows="2" :maxlength=20 v-model.trim="scope.row.remark">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template v-if="formInline.billingCycle==2">
                <el-table key="workday" :data="tableWorkday" border style="width: 100%">
                  <el-table-column prop="billingCycle" label="计费周期">
                  </el-table-column>
                  <el-table-column prop="billingPeriod" label="计费时段">
                  </el-table-column>
                  <el-table-column label="免费时间（分钟）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="首小时（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="次小时（元）">
                    <template slot-scope="scope">
                      每
                      <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                      分钟
                      <br> 收费
                      <el-input v-model.trim="scope.row.otherTimeFee" class="inputClass" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                      元
                    </template>
                  </el-table-column>
                  <el-table-column label="超时额外收费（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="封顶（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input type="textarea" :rows="2" :maxlength=20 v-model.trim="scope.row.remark">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table key="workdays" v-if="tableWorkdayFlag==1" :data="tableWorkdays" border :show-header=false style="width: 100%">
                  <el-table-column label="计费周期">
                    <template slot-scope="scope">
                      计费有效期 <br>
                      <div class="block">
                        <span class="demonstration">开始</span>
                        <el-date-picker v-model="scope.row.startTime" type="date" value-format="timestamp">
                        </el-date-picker>
                      </div>
                      <div class="block">
                        <span class="demonstration">结束</span>
                        <el-date-picker v-model="scope.row.endTime" type="date" value-format="timestamp" @change="endTimeWorkdayChagne(scope.$index)">
                        </el-date-picker>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="计费时段">
                    <template slot-scope="scope">
                      <br>
                      <span class="demonstration">开始</span>
                      <el-time-picker value-format="timestamp" v-model="scope.row.startPeriod">
                      </el-time-picker>
                      <span class="demonstration">结束</span>
                      <el-time-picker value-format="timestamp" v-model="scope.row.endPeriod">
                      </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="免费时间（分钟）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="首小时（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="次小时（元）">
                    <template slot-scope="scope">
                      每
                      <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)"></el-input>
                      分钟
                      <br> 收费
                      <el-input v-model.trim="scope.row.otherTimeFee" :maxlength=3 class="inputClass" @change="inputChange(scope.row)"></el-input>
                      元
                    </template>
                  </el-table-column>
                  <el-table-column label="超时额外收费（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="封顶（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input type="textarea" :rows="2" :maxlength=20 v-model.trim="scope.row.remark">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <br>
                <br>
                <el-table key="weekend" :data="tableWeekend" border style="width: 100%">
                  <el-table-column prop="billingCycle" label="计费周期">
                  </el-table-column>
                  <el-table-column prop="billingPeriod" label="计费时段">
                  </el-table-column>
                  <el-table-column label="免费时间（分钟）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="首小时（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="次小时（元）">
                    <template slot-scope="scope">
                      每
                      <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                      分钟
                      <br> 收费
                      <el-input v-model.trim="scope.row.otherTimeFee" class="inputClass" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                      元
                    </template>
                  </el-table-column>
                  <el-table-column label="超时额外收费（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="封顶（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input type="textarea" :rows="2" :maxlength=20 v-model.trim="scope.row.remark">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
                <el-table key="weekends" v-if="tableWeekendFlag==1" :data="tableWeekends" border :show-header=false style="width: 100%">
                  <el-table-column label="计费周期">
                    <template slot-scope="scope">
                      计费有效期 <br>
                      <div class="block">
                        <span class="demonstration">开始</span>
                        <el-date-picker v-model="scope.row.startTime" type="date" value-format="timestamp">
                        </el-date-picker>
                      </div>
                      <div class="block">
                        <span class="demonstration">结束</span>
                        <el-date-picker v-model="scope.row.endTime" type="date" value-format="timestamp" @change="endTimeChagne(scope.$index)">
                        </el-date-picker>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="计费时段">
                    <template slot-scope="scope">
                      <br>
                      <span class="demonstration">开始</span>
                      <el-time-picker value-format="timestamp" v-model="scope.row.startPeriod">
                      </el-time-picker>
                      <span class="demonstration">结束</span>
                      <el-time-picker value-format="timestamp" v-model="scope.row.endPeriod">
                      </el-time-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="免费时间（分钟）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="首小时（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="次小时（元）">
                    <template slot-scope="scope">
                      每
                      <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)"></el-input>
                      分钟
                      <br> 收费
                      <el-input v-model.trim="scope.row.otherTimeFee" :maxlength=3 class="inputClass" @change="inputChange(scope.row)"></el-input>
                      元
                    </template>
                  </el-table-column>
                  <el-table-column label="超时额外收费（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="封顶（元）">
                    <template slot-scope="scope">
                      <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="备注">
                    <template slot-scope="scope">
                      <el-input type="textarea" :rows="2" :maxlength=20 v-model.trim="scope.row.remark">
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <el-button type="primary" @click="goReturn">返回</el-button>
            </div>
          </el-dialog>

          <!-- 6.4 选择优惠套餐模态框 -->
          <el-dialog title="设置优惠费用" :show-close="showClose" width="60%" :visible.sync="dialogDiscountPackage" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">
            <div>
              <el-form :model="requireParams" class="demo-form-inline">
                <el-row>
                  <el-col :span="3" style="line-height:40px;">优惠套餐名称</el-col>
                  <el-col :span="8">
                    <el-input placeholder="请输入优惠套餐名称" v-model.trim="requireParams.name" @keyup.enter.native="searchResultE"></el-input>
                  </el-col>
                  <el-col :span="13" style="text-align:right;">
                    <el-button type="primary" @click="searchResultE">搜索</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <template>
                <el-table :data="preferentialTable" border style="width: 100%">
                  <el-table-column label="ID" prop="id">
                  </el-table-column>
                  <el-table-column label="套餐名称" prop="name">
                  </el-table-column>
                  <!-- type -->
                  <el-table-column label="套餐类型" prop="typeStr">
                  </el-table-column>
                  <el-table-column label="有效期" prop="effectiveTime" width="220px;">
                  </el-table-column>
                  <el-table-column label="操作" width="300px;">
                    <!-- 编辑和上下架是对等的 -->
                    <template slot-scope="scope">
                      <el-button type="success" @click="bindDiscountPackageIdE(scope.row)">绑定</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
            <div slot="footer" class="dialog-footer">
              <div class="page">
                <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup" v-on:pagechange="pagechanges"></paingchild>
              </div>
              <div class="btnStyle">
                <el-button type="danger" @click="closeDialogDiscountPackageE">关闭</el-button>
              </div>
            </div>
          </el-dialog>

          <!-- 6.5 +++优惠套餐详情模态框 -->
          <el-dialog title="优惠套餐详情" :show-close="showClose" width="60%" :visible.sync="dialogCoverCombo" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">
            <el-form ref="form" label-width="100px" label-position="left" :model="formDataParmas" class="estate-combo">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="*区域名称">
                    <el-input :maxlength="20" v-model.trim="formDataParmas.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="*套餐类型">
                    <el-select v-model="formDataParmas.type" placeholder="停车类">
                      <el-option v-for="item in packageType" :key="item.estateType" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- switchModel -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="*停车时间段">
                    <el-select v-model="formDataParmas.ruleType" placeholder="每天">
                      <el-option v-for="item in switchModel" :key="item.estateType" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 这里要注意数据  每天 startTime  endTime messageInfo  -->
              <template v-if="formDataParmas.ruleType == '1'">
                <el-row v-for="(item,index) in everyDay" :key="index">
                  <el-col :span="6">
                    <el-time-picker v-model="item.startTime" value-format="HH:mm" placeholder="开始时间" @change="computeMessageInfoE(item,index)">
                    </el-time-picker>
                  </el-col>
                  <el-col :span="6">
                    <el-time-picker v-model="item.endTime" value-format="HH:mm" placeholder="结束时间" @change="computeMessageInfoE(item,index)">
                    </el-time-picker>
                  </el-col>
                  <el-col :span="6">
                    <span class="title-message">{{item.messageInfo}}</span>
                    <span v-if="item.miunte != ''" style="color:red;"> 分钟数是： {{item.miunte}}分钟</span>
                  </el-col>
                </el-row>
              </template>
              <template v-else>
                <span>工作日</span>
                <el-row v-for="(item,index) in workDay" :key="'a'+index">
                  <el-col :span="4">
                    <el-time-picker v-model="item.startTime" value-format="HH:mm" placeholder="开始时间" @change="computeMessageInfoE(item,index)">
                    </el-time-picker>
                  </el-col>
                  <el-col :span="4">
                    <el-time-picker v-model="item.endTime" value-format="HH:mm" placeholder="结束时间" @change="computeMessageInfoE(item,index)">
                    </el-time-picker>
                  </el-col>
                  <el-col :span="6">
                    <span class="title-message">{{item.messageInfo}}</span>
                    <span v-if="item.miunte != ''" style="color:red;"> 分钟数是： {{item.miunte}}分钟</span>
                  </el-col>
                </el-row>
                <br>
                <el-row>
                  <el-col :span="8" style="border-top: 1px solid #000;">
                  </el-col>
                </el-row>
                <br>
                <span>周末</span>
                <el-row v-for="(item,index) in weekDay" :key="'b'+index">
                  <el-col :span="4">
                    <el-time-picker v-model="item.startTime" value-format="HH:mm" placeholder="开始时间" @change="computeMessageInfoE(item,index)">
                    </el-time-picker>
                  </el-col>
                  <el-col :span="4">
                    <el-time-picker v-model="item.endTime" value-format="HH:mm" placeholder="结束时间" @change="computeMessageInfoE(item,index)">
                    </el-time-picker>
                  </el-col>
                  <el-col :span="6">
                    <span class="title-message">{{item.messageInfo}}</span>
                    <span v-if="item.miunte != ''" style="color:red;"> 分钟数是： {{item.miunte}}分钟</span>
                  </el-col>
                </el-row>
              </template>
              <br>
              <!-- 这里还有东西要做 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="*套餐有效期">
                    <el-select v-model="formDataParmas.effectiveDaytime" placeholder="套餐有效期">
                      <el-option v-for="item in validity" :key="item.estateType" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <template v-if="formDataParmas.effectiveDaytime == '1'">
                  <el-col :span="6">
                    <el-date-picker v-model="formDataParmas.effectiveBeginTime" value-format="timestamp" type="date" placeholder="开始日期">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="6">
                    <el-date-picker v-model="formDataParmas.effectiveEndTime" value-format="timestamp" type="date" placeholder="结束日期">
                    </el-date-picker>
                  </el-col>
                </template>

              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="*生效规则">
                    <el-select v-model="formDataParmas.infoRule" placeholder="生效规则">
                      <el-option v-for="item in validityRules" :key="item.estateType" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="*数量上限">
                    <el-input :maxlength="4" v-model="formDataParmas.toplimit" @keyup.native="formDataParmas.toplimit=formDataParmas.toplimit.replace(/[^\d]/g,'')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="this.$route.query.id != -1">
                  <p style="line-height:40px;color:red;">有效车牌数量{{formDataParmas.realQuantity}}个 </p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="套餐描述">
                    <el-input :maxlength="100" type="textarea" :rows="4" placeholder="请输入内容" v-model="formDataParmas.descript"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <h3>金额设置</h3>
              <br>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="计费模式">
                    <el-select placeholder="计费模式" v-model="formDataParmas.pricingModel">
                      <el-option v-for="item in pricingModel" :key="item.estateType" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <el-input v-model="dayTitle" disabled></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.day.day1" @keyup.native="formDataParmas.day.day1=formDataParmas.day.day1.replace(/[^\d]/g,'') "></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.day.day2" @keyup.native="formDataParmas.day.day2=formDataParmas.day.day2.replace(/[^\d]/g,'')  " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.day.day3" @keyup.native="formDataParmas.day.day3=formDataParmas.day.day3.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.day.day4" @keyup.native="formDataParmas.day.day4=formDataParmas.day.day4.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.day.day5" @keyup.native="formDataParmas.day.day5=formDataParmas.day.day5.replace(/[^\d]/g,'') " ng-pattern="/[^a-zA-Z|0]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.day.day6" @keyup.native="formDataParmas.day.day6=formDataParmas.day.day6.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3">
                  <el-input v-model="feeTitle" disabled></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.fee.day1" @keyup.native="formDataParmas.fee.day1=formDataParmas.fee.day1.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.fee.day2" @keyup.native="formDataParmas.fee.day2=formDataParmas.fee.day2.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.fee.day3" @keyup.native="formDataParmas.fee.day3=formDataParmas.fee.day3.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.fee.day4" @keyup.native="formDataParmas.fee.day4=formDataParmas.fee.day4.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.fee.day5" @keyup.native="formDataParmas.fee.day5=formDataParmas.fee.day5.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-input v-model="formDataParmas.fee.day6" @keyup.native="formDataParmas.fee.day6=formDataParmas.fee.day6.replace(/[^\d]/g,'') " ng-pattern="/[^0a-zA-Z]/"></el-input>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <div class="btnStyle">
                <el-button type="danger" @click="closeComboE">返回</el-button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from 'qs';
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
import { dispostTime, proofTime, dataValidation } from '../../../assets/js/base.js'
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
      reserveFeeRuleId: null,  //选中的预约费用规则ID
      parkingFeeRuleId: null,   // 选中的停车费用ID
      parkingTable: [],     // 要在新增小区中显示的表格数据

      //      时间设置
      timeList: {
        minPublishInterval: '',
        minSharePeriod: '',
        freeCancellationTime: '',
        maxDelayTime: '',
        minChargePeriod: '',
        advanceChangeTime: '',
        advanceReservationTime: '',
      },
      //      抽成比例设置
      propfeeList: {
        platformPercent: '',
        ownerPercent: '',
        propCompPercent: '',
        operatorPercent: '0',
        platformAppointmentPercent: '',
        propCompAppointmentPercent: '',
      },

      load: false,
      butText: '提交',
      // 省
      provinceId: 1,
      cityId: '',
      areaId: '',

      carShowText: '显示', //空车位显示不显示按钮
      // 下拉列表的信息
      province: [],
      citys: [],
      zones: [],
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

        type: 2,    // 小区类型 （非0验证）
        kind: -1,   //停车场类型
        state: -1,     //小区状态
        chargeType: 0,//收费模式

        feeIntro: '暂无信息',//停车场收费信息
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
      //停车费规则
      parkingCostRules: false,
      formInline: {
        name: '',     //停车费规则名
        billingCycle: "1",//停车费的选择框
      },
      options: [{
        value: '1',
        label: '每天'
      }, {
        value: '2',
        label: '工作日/周末'
      }],
      tableFlag: 0,//控制表格是否显示1显示
      tableWorkdayFlag: 0,//控制表格是否显示1显示
      tableWeekendFlag: 0,//控制表格是否显示1显示
      tableData: [{
        billingCycle: '每天',
        billingPeriod: '24小时',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }],
      tableDatas: [{
        billingCycle: '每天',
        billingPeriod: '24小时',
        startTime: '',
        endTime: '',
        startPeriod: "",
        endPeriod: '',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }],
      tableWorkday: [{
        billingCycle: '工作日',
        billingPeriod: '24小时',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }],
      tableWorkdays: [{
        billingCycle: '工作日',
        billingPeriod: '24小时',
        startTime: '',
        endTime: '',
        startPeriod: "",
        endPeriod: '',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }],
      tableWeekend: [{
        billingCycle: '周末',
        billingPeriod: '24小时',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }],
      tableWeekends: [{
        billingCycle: '周末',
        billingPeriod: '24小时',
        startTime: '',
        endTime: '',
        startPeriod: "",
        endPeriod: '',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }],
      disabledDet: false,
      parkingCostRulesData: null,
      // 请求参数
      dialogDiscountPackage: false,
      requireParams: {
        start: 0,
        length: 10,
        sEcho: 3,
        name: '',
        state:'1'
      },
      // 优惠套餐的数据
      preferentialTable: [],  // 请求套餐列表的表格
      preferentialTable_noModel: [], // 这个显示在页面中的数据
      preferentialOptions: [{
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
      dialogCoverCombo: false,
      formDataParmas: {
        name: '',
        type: '1',
        effectiveDaytime: '0',
        ruleType: '1',
        infoRule: '1',
        toplimit: '',
        descript: '',
        pricingModel: '1',
        realQuantity: '',
        day: {
          day1: '',
          day2: '',
          day3: '',
          day4: '',
          day5: '',
          day6: ''
        },
        fee: {
          day1: '',
          day2: '',
          day3: '',
          day4: '',
          day5: '',
          day6: ''
        },
        effectiveBeginTime: '',
        effectiveEndTime: '',
      },
      packageType: [{
        value: '1',
        label: '停车类'
      }],
      switchModel: [{
        value: '1',
        label: '每天',
      }, {
        value: '2',
        label: '工作日/周末',
      }],
      everyDay: [
        {
          startTime: '',
          endTime: '',
          messageInfo: '',
          miunte: '',
        }
      ], // 每天的时间
      validity: [{
        value: '0',
        label: '永久有效'
      }, {
        value: '1',
        label: '自定义时间'
      }], // 有效期
      validityRules: [{
        value: '1',
        label: '立即生效'
      }],
      workDay: [
        {
          startTime: '',
          endTime: '',
          messageInfo: '',
          miunte: '',
        }
      ], // 工作日
      weekDay: [
        {
          startTime: '',
          endTime: '',
          messageInfo: '',
          miunte: '',
        }
      ], //周末
      pricingModel: [
        {
          value: '1',
          label: '按天计费'
        }
      ],
      dayTitle: '天数',
      feeTitle: '金额（元）',
      // 默认 是不展示数据
      switchPackageState: '0',
    }
  },
  created() {
    this.getBasicsData(0, 1);
  },
  methods: {
    //当小区类型改变时
    changeType(val) {
      val == 0 ? this.leftAmountDisabled = false : this.leftAmountDisabled = true;
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
    // 获取基本信息
    getBasicsData(num, flag) {
      this.$http.get('area/' + num).then(res => {
        var tempData = res.data.data;
        if (flag == 1) {
          tempData.unshift({ id: 0, name: '=请选择省份=' });
          this.province = tempData;
          this.formLabelAlign.provinceId = 0;
        } else if (flag == 2 && num != 0) {
          this.citys = tempData;
        } else if (flag == 3 && num != 0) {
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
    //空车位显示不显示按钮
    carShow() {
      this.carShowText = this.carShowText == '显示' ? "不显示" : "显示";
      this.formLabelAlign.leftAmountType = this.carShowText == '显示' ? "1" : "0";
    },
    //图片操作
    handleChange1(e) {
      const elInput = this.$refs.upload1
      const reader = new FileReader();
      let isImg = this.isImagUp(elInput.files[0]);
      if (isImg == true) {
        reader.onload = (e) => {
          console.log(e);
          const src = e.target.result;
          this.imgSrc1 = src;
        };
        if (elInput.files && elInput.files[0]) {
          this.imgSrc1Id = 0;
          reader.readAsDataURL(elInput.files[0]);
        }
      } else {
        elInput.value = null;
        return;
      }
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
          this.imgSrc2Id = 0;
          reader.readAsDataURL(elInput.files[0]);
        }
      } else {
        elInput.value = null;
        return;
      }

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
          this.imgSrc3Id = 0;
          reader.readAsDataURL(elInput.files[0]);
        }
      } else {
        elInput.value = null;
        return;
      }
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
          this.imgSrc4Id = 0;
          reader.readAsDataURL(elInput.files[0]);
        }
      } else {
        elInput.value = null;
        return;
      }
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
          this.imgSrc5Id = 0;
          reader.readAsDataURL(elInput.files[0]);
        }
      } else {
        elInput.value = null;
        return;
      }
    },
    isImagUp(item) {
      let maxSize = 2 * 1024 * 1024;
      let imgType = 'PNG,JPG,GIF';
      let size = item.size;
      let type = item.name.split('.')[1].toUpperCase();
      let num = imgType.indexOf(type);
      console.log(num, type, size, imgType, maxSize);
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
    removeImg1() {
      this.imgSrc1 = null;
      this.$refs.upload1.value = '';
      this.imgSrc1Id = null;
    },
    removeImg2() {
      this.imgSrc2 = null;
      this.$refs.upload2.value = '';
      this.imgSrc2Id = null;
    },
    removeImg3() {
      this.imgSrc3 = null;
      this.$refs.upload3.value = '';
      this.imgSrc3Id = null;
    },
    removeImg4() {
      this.imgSrc4 = null;
      this.$refs.upload4.value = '';
      this.imgSrc4Id = null;
    },
    removeImg5() {
      this.imgSrc5 = null;
      this.$refs.upload5.value = '';
      this.imgSrc5Id = null;
    },
    //时间处理
    disparklotTimeParams() {
      for (let i = 0; i < this.parklotTimeParamsList.length; i++) {
        let item = this.parklotTimeParamsList[i];
        let str = item.qhKey;
        let strArr = [];
        strArr = str.split("_");
        strArr[1] = strArr[1].substring(0, 1).toUpperCase() + strArr[1].substring(1);
        strArr[2] = strArr[2].substring(0, 1).toUpperCase() + strArr[2].substring(1);
        str = strArr.join("");
        this.$set(this.parklotTimeParamsArr, str, item.qhValue);
      }
    },
    // ----------------------预约费用-------------
    bookingFeeTable() {
      this.dialogTableVisible = true;
      this.getTableDatas();
    },
    // 1.0 获取预约费用数据
    getTableDatas() {
      var datas = {
        start: this.start,
        sEcho: 3,
        length: this.display
      };
      console.log(datas);
      if (this.searchFromData.name) {
        this.isSearch = 1;
        datas.name = this.searchFromData.name;
      }
      var data = Qs.stringify(datas);
      this.$http.post('fee/rule/reserve/pageable', data).then(res => {
        console.log(res)
        if (res.data.error_code === 2000) {
          // 赋值表格处理数据, 表格的总量
          this.seachLoading = false;
          this.total = parseInt(res.data.data.itotalRecords);
          //            console.log(res.data.data.dataList);
          this.tableDatas = res.data.data.dataList;
          for (let i = 0; i < this.tableDatas.length; i++) {
            //              console.log(this.tableDatas[i]);
            let time = this.tableDatas[i].finishTime.split(",");
            let fee = this.tableDatas[i].fee.split(",");
            //              console.log(fee);
            let reserveData = [];
            for (let j = 0; j < fee.length; j++) {
              reserveData.push({
                miunte: time[j],
                fee: fee[j]
              })
            }
            //              console.log(reserveData);
            this.tableDatas[i].reserveData = reserveData;
          }
          ;
          console.log(this.tableDatas);
        } else {
          console.log('状态码返回错误')
        }
      }).catch(err => {
        console.log('服务端错误' + err);
      })
    },
    // 2.0 单选预约费用
    getCurrentRow(val) {
      this.tableArray = val;
      this.reserveFeeRuleId = this.tableArray.id;
      this.miunteList = [];
      this.tableArray.miunteList = [];
      this.tableArray.feeAll = [];
      for (let i = 0; i < this.tableArray.reserveData.length; i++) {
        this.tableArray.reserveData[i].miunte;
        this.tableArray.reserveData[i].fee;
        this.tableArray.miunteList.push(this.tableArray.reserveData[i].miunte);
        this.miunteList.push(this.tableArray.reserveData[i].miunte);
        this.tableArray.feeAll.push(this.tableArray.reserveData[i].fee);
      }
    },
    // 3.0 预约费用展开 和 关闭
    rowClick(row, event, column) {
      //        console.log(row);
      this.reserveData = row.reserveData;
      Array.prototype.remove = function (val) {
        console.log(val);
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      if (this.expands.indexOf(row.id) < 0) {
        this.expands = []
        this.expands.push(row.id);
      } else {
        this.expands.remove(row.id);
      }
    },
    // 4.0 预约模态框提交数据
    tableTagToInputEvent() {
      if (this.tableDatas.length == 0) {
        this.$message.error('预约费用规则不能提交为空');
        return false;
      }
      // 确定数据
      this.radio = this.tableArray.id;
      this.compage = 1;
      this.start = 0;
      if (this.searchFromData.name) this.searchFromData.name = '';
      this.dialogTableVisible = false;
    },
    //预约费 关闭模态框按钮的时候（清空start compage）
    closeTagDialogTableVisible() {
      this.start = 0;
      this.compage = 1;
      this.dialogTableVisible = false;
      if (this.searchFromData.name) this.searchFromData.name = '';
    },

    // ----------------------停车费用-------------
    parkingFeeTable() {
      this.dialogTableParking = true;
      this.getPakingTableDatas();
    },

    //获取停车费
    getPakingTableDatas() {
      var datas = {
        start: this.start,
        sEcho: 3,
        length: this.display
      };
      if (this.searchFromData.name) {
        this.isSearch = 1;
        datas.name = this.searchFromData.name;
      }

      var data = Qs.stringify(datas);
      this.$http.post('fee/rule/parking/pageable', data).then(res => {
        if (res.data.error_code === 2000) {
          // 赋值表格处理数据, 表格的总量
          this.seachLoading = false;
          this.total = parseInt(res.data.data.itotalRecords);
          this.ParkingDatas = res.data.data.dataList;
        } else {
          console.log('状态码返回错误')
        }
      }).catch(err => {
        console.log('服务端错误' + err);
      })
    },
    //停车费查看详情
    parkingDetails() {
      console.log(this.parkingCostRulesData)
      this.parkingCostRules = true;
      this.formInline.name = this.parkingCostRulesData.name;
      this.id = this.parkingCostRulesData.id;
      if (this.parkingCostRulesData.type == 0) {
        this.formInline.billingCycle = "1";
      } else if (this.parkingCostRulesData.type == 1) {
        this.formInline.billingCycle = "2";
      }
      var feeRuleParkings = this.parkingCostRulesData.feeRuleParkings;
      if (this.parkingCostRulesData.type == 0) {
        //每天
        var int;
        for (var i = 0; i < feeRuleParkings.length; i++) {
          if (i == 0) {
            this.tableData[0].freeUseTime = feeRuleParkings[0].freeUseTime;
            this.tableData[0].firstHourFeesWork = feeRuleParkings[0].firstHourFee;
            this.tableData[0].otherTimePeriodWork = feeRuleParkings[0].otherTimePeriod;
            this.tableData[0].otherTimeFee = feeRuleParkings[0].otherTimeFee;
            this.tableData[0].overTimeFeesWork = feeRuleParkings[0].overTimeFee;
            this.tableData[0].maxFeesWork = feeRuleParkings[0].maxFee;
            if (feeRuleParkings[0].remark != "null") {
              this.tableData[0].remark = feeRuleParkings[0].remark;
            }
          } else {
            int = i - 1;
            this.tableFlag = 1;
            this.tableDatas[int].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableDatas[int].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableDatas[int].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableDatas[int].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableDatas[int].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableDatas[int].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableDatas[int].startTime = feeRuleParkings[i].startTime;
            this.tableDatas[int].endTime = feeRuleParkings[i].endTime;
            this.tableDatas[int].startPeriod = feeRuleParkings[i].startTime;
            this.tableDatas[int].endPeriod = feeRuleParkings[i].endTime;
            if (feeRuleParkings[i].remark != "null") {
              this.tableDatas[int].remark = feeRuleParkings[i].remark;
            }
          }
        }
      } else {
        var tableWorkdaysInt = 0;
        var tableWeekendsInt = 0;
        //周末/工作日
        for (var i = 0; i < feeRuleParkings.length; i++) {
          if (!feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 1) {
            //第一个工作日
            this.tableWorkday[0].freeUseTime = feeRuleParkings[0].freeUseTime;
            this.tableWorkday[0].firstHourFeesWork = feeRuleParkings[0].firstHourFee;
            this.tableWorkday[0].otherTimePeriodWork = feeRuleParkings[0].otherTimePeriod;
            this.tableWorkday[0].otherTimeFee = feeRuleParkings[0].otherTimeFee;
            this.tableWorkday[0].overTimeFeesWork = feeRuleParkings[0].overTimeFee;
            this.tableWorkday[0].maxFeesWork = feeRuleParkings[0].maxFee;
            if (feeRuleParkings[0].remark != "null") this.tableWorkday[0].remark = feeRuleParkings[0].remark;
          } else if (feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 1) {
            //              其余工作日
            this.tableWorkdayFlag = 1;
            this.tableWorkdays[tableWorkdaysInt].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWorkdays[tableWorkdaysInt].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWorkdays[tableWorkdaysInt].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWorkdays[tableWorkdaysInt].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWorkdays[tableWorkdaysInt].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWorkdays[tableWorkdaysInt].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableWorkdays[tableWorkdaysInt].startTime = feeRuleParkings[i].startTime;
            this.tableWorkdays[tableWorkdaysInt].endTime = feeRuleParkings[i].endTime;
            this.tableWorkdays[tableWorkdaysInt].startPeriod = feeRuleParkings[i].startTime;
            this.tableWorkdays[tableWorkdaysInt].endPeriod = feeRuleParkings[i].endTime;
            if (feeRuleParkings[i].remark != "null") this.tableWorkdays[tableWorkdaysInt].remark = feeRuleParkings[i].remark;
            tableWorkdaysInt = tableWorkdaysInt + 1;
          } else if (!feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 0) {
            //第一个周末
            this.tableWeekend[0].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWeekend[0].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWeekend[0].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWeekend[0].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWeekend[0].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWeekend[0].maxFeesWork = feeRuleParkings[i].maxFee;
            if (feeRuleParkings[i].remark != "null") this.tableWeekend[0].remark = feeRuleParkings[i].remark;
          } else if (feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 0) {
            //其余周末
            this.tableWeekendFlag = 1;
            this.tableWeekends[tableWeekendsInt].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWeekends[tableWeekendsInt].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWeekends[tableWeekendsInt].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWeekends[tableWeekendsInt].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWeekends[tableWeekendsInt].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWeekends[tableWeekendsInt].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableWeekends[tableWeekendsInt].startTime = feeRuleParkings[i].startTime;
            this.tableWeekends[tableWeekendsInt].endTime = feeRuleParkings[i].endTime;
            this.tableWeekends[tableWeekendsInt].startPeriod = feeRuleParkings[i].startTime;
            this.tableWeekends[tableWeekendsInt].endPeriod = feeRuleParkings[i].endTime;
            if (feeRuleParkings[i].remark != "null") this.tableWeekends[tableWeekendsInt].remark = feeRuleParkings[i].remark;
            tableWeekendsInt = tableWeekendsInt + 1;
          } else {
            this.$message.error("数据出错")
          }
        }
      }
    },
    goReturn() {
      this.parkingCostRules = false;
    },

    //1.0 关闭 停车费模态框（差清空搜索框的内容）；
    closeParking() {
      // 还用搜索框的内容要清空
      this.start = 0;
      this.compage = 1;
      this.dialogTableParking = false;
      if (this.searchFromData.name) this.searchFromData.name = '';
    },
    //2.0 提交模态框的数据
    submitParking() {
      if (this.ParkingDatas.length == 0) {
        this.$message.error('停车费用规则不能提交为空');
        return false;
      }
      // 确定数据
      this.compage = 1;
      this.start = 0;
      let parkingTable = [];
      for (let i = 0; i < this.ParkingDatas.length; i++) {
        if (this.ParkingDatas[i].id === this.parkingFeeRuleId) {
          parkingTable.push(this.ParkingDatas[i]);
        }
      }
      this.parkingTable = parkingTable;
      if (this.searchFromData.name) this.searchFromData.name = '';
      this.dialogTableParking = false;
    },
    /* -----套餐开始----- */
    /**
    * @function getDiscountPackageE 优惠套餐表格
    * 作用 让弹框显示  请求数据
    * 
   */
    getDiscountPackageE() {
      this.dialogDiscountPackage = true
      this.discountPackage();
    },
    /**
     * @function _discountPackage 请求优惠套餐的数据
    */
    discountPackage() {
      this.$http.post('discountpackage/pagelist', Qs.stringify(this.requireParams))
        .then((res) => {
          if (res.data.error_code === 2000) {
            if (res.data.data.dataList.length == 0) {
              this.$message.error('未能匹配到数据请重新录入搜索条件，谢谢！！！')
              console.log(this.compage)
              this.compage = 1
              this.preferentialTable = res.data.data.dataList;
            } else {
              this.preferentialTable = res.data.data.dataList;
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
     * @function 搜索数据的函数
    */
    searchResultE() {
      if (this.isSearch === 0) {
        if (!this.requireParams.name) {
          this.$message.error('错了哦，搜索到的是空数据，请重新输入搜索条件');
        } else {
          this.isSearch = 1;
          this.requireParams.start = 0;
          this.discountPackage();
          this.compage = 1;
        }
      } else if (this.isSearch == 1) {
        if (!this.requireParams.name && !this.requireParams.state) {
          this.requireParams.start = 0;
          this.isSearch = 0;
        }
        this.compage = 1;
        this.discountPackage();
      };
    },
    /**
     * @function closeDialogDiscountPackageE 关闭模态框
     * 操作清空对应的数据
    */
    closeDialogDiscountPackageE() {
      this.start = 0;
      this.compage = 1;
      if (this.requireParams.name) this.requireParams.name = '';
      this.dialogDiscountPackage = false;
    },
    /**
     * 绑定优惠套餐 的ID
     * @function bindDiscountPackageIdE 
    */
    bindDiscountPackageIdE(row) {
      this.start = 0;
      this.compage = 1;
      if (this.requireParams.name) this.requireParams.name = '';
      this.dialogDiscountPackage = false;
      this.preferentialTable_noModel = [];
      this.preferentialTable_noModel.push(row)
      console.log(this.preferentialTable_noModel[0].id)
    },
    /**
     * @function couponPackageDetailsE  优惠套餐详情
    */
    couponPackageDetailsE(id) {
      // 对数据赋值并且进行处理
      this.viewDetails(id)
      this.dialogCoverCombo = true;
    },
    /**
     * @function closeComboE 关闭查看优惠详情的模态框
    */
    closeComboE() {
      this.dialogCoverCombo = false;
    },
    /**
     * 查看详情时,对表单里面的数据进行赋值操作
    */
    /**
    * @function 这个是用来查看详情和编辑时要使用的接口
    * @param id 表示套餐ID
   */
    viewDetails(id) {
      this.$http.post('discountpackage/findDetailed', Qs.stringify({ id: id }))
        .then((res) => {
          if (res.data.error_code === 2000) {
            let item = res.data.data
            console.log(item)
            // 套餐名称
            this.formDataParmas.name = item.name
            // 套餐类型
            this.formDataParmas.type = item.type + ''
            // 停车时段
            if (item.ruleType != 1) {
              this.formDataParmas.ruleType = '2'
            }
            // 具体停车时段  的时间拆分
            let workDayArr = [];
            let weekDayArr = [];
            let everyDayArr = [];
            for (let i = 0, len = item.ruleTimeList.length; i < len; i++) {
              let row = item.ruleTimeList[i];
              row.startTime = row.beginTime
              row.endTime = row.endTime
              row.miunte = ''
              row.messageInfo = ''
              dispostTime(row)
              if (row.type == 1) {
                everyDayArr.push(row)
              } else if (row.type == 2) {
                workDayArr.push(row);
              } else if (row.type == 3) {
                weekDayArr.push(row)
              }
            }
            console.log(everyDayArr)
            if (this.formDataParmas.ruleType == 1) {
              console.log(everyDayArr.length)
              for (let z = 0, len = everyDayArr.length; z < len; z++) {
                let row = everyDayArr[z]
                this.assignmentData(this.everyDay, z, row)
              }
            } else {
              for (let i = 0, len = workDayArr.length; i < len; i++) {
                let row = workDayArr[i]
                this.assignmentData(this.workDay, i, row)
              }
              for (let j = 0, len = weekDayArr.length; j < len; j++) {
                let row = weekDayArr[j]
                this.assignmentData(this.weekDay, j, row)
              }
            }
            //套餐有效期
            if (item.effectiveDaytime == 0) {
              this.formDataParmas.effectiveDaytime = item.effectiveDaytime + '';
            } else {
              this.formDataParmas.effectiveDaytime = item.effectiveDaytime + ''
              this.formDataParmas.effectiveBeginTime = item.effectiveBeginTime
              this.formDataParmas.effectiveEndTime = item.effectiveEndTime
            }
            // 生效规则
            this.formDataParmas.infoRule = item.infoRule + ''
            // 数量上限
            this.formDataParmas.toplimit = item.toplimit
            // 有效车牌数量
            this.formDataParmas.realQuantity = item.realQuantity;
            // 套餐描述
            this.formDataParmas.descript = item.descript

            // 处理 时间 和 费用
            for (let i = 0, len = item.formatSumList.length; i < len; i++) {
              let row = item.formatSumList[i]
              let x = i + 1;
              let name = 'day' + x;
              this.formDataParmas.day[name] = row.daytime
              this.formDataParmas.fee[name] = row.sumNumber
            }
          } else {
            this.$message.error(res.data.error_message)
          }
        })
        .catch((err) => {
          this.$message.error('后台接口报错，请联系开发人员，谢谢！！！');
        })
    },
    /**
     * @function 在查看详情和编辑时添加数据的时候使用
     * @param Arrobj 具体赋值的对象
     * @param item 具体这一行的参数
    */
    assignmentData(Arrobj, index, row) {
      if (index == 0) {
        Arrobj[0].startTime = row.startTime
        Arrobj[0].endTime = row.endTime
        Arrobj[0].miunte = row.miunte
        Arrobj[0].messageInfo = row.messageInfo
      } else {
        Arrobj = Arrobj.push({
          startTime: row.startTime,
          endTime: row.endTime,
          miunte: row.miunte,
          messageInfo: row.messageInfo
        })
      }
    },
    /* -----套餐结束----- */

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //        console.log(row, column, rowIndex, columnIndex);
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 8) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 停车费获取id
    getCurrentRowparking(item) {
      this.parkingFeeRuleId = item.id;
      this.parkingCostRulesData = item;
    },

    // 提交新增小区的数据到服务器
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
      } else if (this.formLabelAlign.chargeType == -1) {
        this.$message.error('小区的收费模式不能为空');
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
          !this.timeList.minSharePeriod ||
          !this.timeList.freeCancellationTime ||
          !this.timeList.maxDelayTime ||
          !this.timeList.minChargePeriod ||
          !this.timeList.advanceChangeTime ||
          !this.timeList.advanceReservationTime ||
          (regfeeList.test(this.timeList.minPublishInterval) == false) ||
          (regfeeList.test(this.timeList.minSharePeriod) == false) ||
          (regfeeList.test(this.timeList.freeCancellationTime) == false) ||
          (regfeeList.test(this.timeList.maxDelayTime) == false) ||
          (regfeeList.test(this.timeList.minChargePeriod) == false) ||
          (regfeeList.test(this.timeList.advanceChangeTime) == false) ||
          (regfeeList.test(this.timeList.advanceReservationTime) == false)
        ) {
          this.$message.error('时间设置必填,必须是数字');
          return false;
        } else if (Number(this.timeList.minPublishInterval) % 15 != 0) {
          this.$message.error('发布时段间隔必选为15或15的整倍数');
          return false;
        } else if (Number(this.timeList.minChargePeriod) % 15 != 0) {
          this.$message.error('最短共享时长必选为15或15的整倍数');
          return false;
        } else if (Number(this.timeList.minSharePeriod) % 15 != 0) {
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
        } else if (Number(this.propfeeList.platformPercent) + Number(this.propfeeList.ownerPercent) + Number(this.propfeeList.propCompPercent) + Number(this.propfeeList.operatorPercent) != 100 || Number(this.propfeeList.platformAppointmentPercent) + Number(this.propfeeList.propCompAppointmentPercent) != 100) {
          this.$message.error('分成比例之和必须是100');
          return false;
        } else {
          if (
            this.reserveFeeRuleId === null ||
            this.reserveFeeRuleId == 0 ||
            this.parkingFeeRuleId == null ||
            this.parkingFeeRuleId == 0
          ) {
            this.$message.error("预约费用 或 停车费 用没有做选择，请录入对应的数据");
            return;
          }
          formData.append('adminName', this.formLabelAlign.adminName)
          formData.append('adminPhone', this.formLabelAlign.adminPhone)
          // 预约费 和 停车费用 和 优惠套餐的传递
          formData.append('reserveFeeRuleId', this.reserveFeeRuleId)
          formData.append('parkingFeeRuleId', this.parkingFeeRuleId)
          // 时间设置
          formData.append('minPublishInterval', parseInt(this.timeList.minPublishInterval))
          formData.append('minSharePeriod', parseInt(this.timeList.minSharePeriod))
          formData.append('freeCancellationTime', parseInt(this.timeList.freeCancellationTime))
          formData.append('maxDelayTime', parseInt(this.timeList.maxDelayTime))
          formData.append('minChargePeriod', parseInt(this.timeList.minChargePeriod))
          formData.append('advanceChangeTime', parseInt(this.timeList.advanceChangeTime))
          formData.append('advanceReservationTime', parseInt(this.timeList.advanceReservationTime))
          // 收入比例
          formData.append('platformPercent', parseInt(this.propfeeList.platformPercent))
          formData.append('ownerPercent', parseInt(this.propfeeList.ownerPercent))
          formData.append('propCompPercent', parseInt(this.propfeeList.propCompPercent))
          formData.append('operatorPercent', parseInt(this.propfeeList.operatorPercent))
          formData.append('propCompAppointmentPercent', parseInt(this.propfeeList.propCompAppointmentPercent))
          formData.append('platformAppointmentPercent', parseInt(this.propfeeList.platformAppointmentPercent))
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
      if (this.preferentialTable_noModel.length != 0 && this.preferentialTable_noModel[0].id) {
        formData.append('packageId', this.preferentialTable_noModel[0].id)
      }
      formData.append("packageState", this.switchPackageState)
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
      // 新增小区的时候
      formData.append('parklotId', 0)
      //小区图片如果存在就添加
      if (this.$refs.upload1.files[0]) {
        formData.append("files", this.$refs.upload1.files[0])
        this.fileIds.push(0);
      }
      if (this.$refs.upload2.files[0]) {
        formData.append("files", this.$refs.upload2.files[0])
        this.fileIds.push(0);
      }
      if (this.$refs.upload3.files[0]) {
        formData.append("files", this.$refs.upload3.files[0])
        this.fileIds.push(0);
      }
      if (this.$refs.upload4.files[0]) {
        formData.append("files", this.$refs.upload4.files[0])
        this.fileIds.push(0);
      }
      if (this.$refs.upload5.files[0]) {
        formData.append("files", this.$refs.upload5.files[0])
        this.fileIds.push(0);
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
    //返回小区列表
    goBack() {
      this.$router.go(-1)
    },
    //成功提交到服务器
    open() {
      this.$alert('已成功添加小区', '修改成功', {
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
      } else if (this.dialogDiscountPackage === true) {
        this.requireParams.start = start
        this.discountPackage()
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
  },
}

</script>

<style scoped>
.demo-form-inline {
  border-bottom: none;
}

.myTable {
  width: 100%;
  border-color: #ebeef5;
  margin-top: 20px;
}

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
  margin: 10px 0;
  background-color: #adadad;
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
  margin-bottom: 10px;
  display: inline-block;
  height: 30px;
  width: 120px;
  text-align: center;
  line-height: 30px;
  background-color: #e8e8e8;
  color: #000000;
  text-decoration: none;
}

.title-message {
  line-height: 40px;
  color: red;
}
</style>