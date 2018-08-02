<template>
  <div class="common-style-picker">
    <!--显示预约费用-->
    <template>
      <el-tabs type="border-card" v-if="this.proptype != 0">
        <el-tab-pane label="预约费用">
          <!--表格信息-->
          <el-button type="primary" plain v-if="propstate !== 0" @click="getReserveEvent">点击编辑</el-button>
        </el-tab-pane>
        <br>
        <table border style="width:100%;border-color:#ebeef5;" class="myTable">
          <thead>
            <th width="10%">预约费用ID</th>
            <th width="10%;">预约费用名称</th>
            <th width="10%;">时长(分钟数)</th>
            <th v-for="(item,index) in feeRuleReserveObj.finishTime" :key="index">{{item}}分钟</th>
          </thead>
          <tbody style="text-align:center;">
            <tr>
              <td width="10%;">{{feeRuleReserveObj.id}}</td>
              <td width="10%;">{{feeRuleReserveObj.name}}</td>
              <td width="10%;">费用（元）</td>
              <td v-for="(item,index) in feeRuleReserveObj.feeList" :key="index">{{item}}元</td>
            </tr>
          </tbody>
        </table>
      </el-tabs>
      <br>
      <!--显示停车费用-->
      <el-tabs type="border-card" v-if="this.proptype != 0">
        <el-tab-pane label="停车费用">
          <el-button type="primary" plain @click="getPrakingEvent">点击编辑</el-button>
        </el-tab-pane>
        <br>
        <template>
          <el-table :data="feeRuleParkingArr" border>
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
      <!--显示优惠套餐-->
      <el-tabs type="border-card" v-if="this.proptype != 0">
        <el-tab-pane label="优惠套餐">
          <el-button type="primary" plain @click="getDiscountPackageE">点击编辑</el-button>
        </el-tab-pane>
        <br>
        <template>
          <el-table :data="packageByParkLot" border style="width: 100%">
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
                &nbsp;&nbsp;
                <el-switch v-model="switchPackageState" active-text="展示" inactive-text="不展示" active-value="1" inactive-value="0" @change="getSwitchPackageStateE"></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-tabs>
      <br>
      <!--2.0 道闸信息（一对多） -->
      <el-tabs type="border-card" v-if="this.barrierList.length != 0">
        <el-tab-pane label="道闸">
          <el-table style="width: 100%" :data="barrierList" border>
            <el-table-column prop="id" label="道闸ID">
            </el-table-column>
            <el-table-column prop="name" label="道闸名称">
            </el-table-column>
            <el-table-column prop="serverIp" label="服务器IP">
            </el-table-column>
            <el-table-column prop="serverPort" label="服务器端口号">
            </el-table-column>
            <el-table-column prop="password" label="道闸密码">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <br>
      <!--2.0 门禁信息（一对多） -->
      <el-tabs type="border-card" v-if="this.accessList.length != 0">
        <el-tab-pane label="门禁">
          <el-table :data="accessList" border style="width: 100%">
            <el-table-column prop="id" label="ID">
            </el-table-column>
            <el-table-column prop="name" label="门禁名称">
            </el-table-column>
            <el-table-column prop="btName" label="蓝牙名称">
            </el-table-column>
            <el-table-column prop="btPwd" label="蓝牙密码">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <br>
      <!--2.0 继电器（一对多） -->
      <el-tabs type="border-card" v-if="this.relaymeterList.length != 0">
        <el-tab-pane label="继电器">
          <el-table :data="relaymeterList" border style="width: 100%">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="继电器名称" prop="name"></el-table-column>
            <el-table-column label="继电器类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type==1">出口</span>
                <span v-else-if="scope.row.type==0">入口</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <br>
    </template>

    <!--6.1 选择预约费用的ID-->
    <el-dialog title="选择预约的收费的类型" :show-close="showClose" width="60%" :visible.sync="dialogTableVisible" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">

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
              <el-radio class="radio" v-model="reserveId" :label="scope.row.id" @change.native="getCurrentRow(scope.row)"></el-radio>
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
          <el-button type="primary" @click="changeReserveID">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--6.2 选择停车费用的模态框-->
    <el-dialog title="选择停车的收费的类型" :show-close="showClose" width="60%" :visible.sync="dialogTableParking" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">

      <!--2.0 模态框的搜索区域-->
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
              <el-radio class="radio" v-model="parkingId" :label="scope.row.id" @change.native="getCurrentRowparking(scope.row)"></el-radio>
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
          <el-button type="primary" @click="getParkingId">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--6.3 停车费用详情的模态框-->
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
            <el-table-column prop="billingCycle" label="计费周期" width="210px;">
            </el-table-column>
            <el-table-column prop="billingPeriod" label="计费时段" width="190px;">
            </el-table-column>
            <el-table-column label="免费时间（分钟）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首小时（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="次小时（元）">
              <template slot-scope="scope">
                <div>每分 钟</div>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
                <div>收费/元</div>
                <el-input v-model.trim="scope.row.otherTimeFee" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="超时额外收费（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封顶（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
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
            <el-table-column label="计费周期" width="210px;">
              <template slot-scope="scope">
                计费有效期
                <div class="block">
                  <span class="demonstration">开始</span>
                  <el-date-picker v-model="scope.row.startTime" type="date" value-format="timestamp" size="mini">
                  </el-date-picker>
                </div>
                <div class="block">
                  <span class="demonstration">结束</span>
                  <el-date-picker v-model="scope.row.endTime" type="date" value-format="timestamp" @change="endTimeChagne(scope.$index)" size="mini">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计费时段" width="190px;">
              <template slot-scope="scope">
                <div class="demonstration">开始</div>
                <el-time-picker value-format="timestamp" v-model="scope.row.startPeriod" size="mini">
                </el-time-picker>
                <div class="demonstration">结束时间：
                  <span style="color:red;">{{scope.row.day}}</span>
                </div>
                <el-time-picker value-format="timestamp" v-model="scope.row.endPeriod" size="mini">
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column label="免费时间（分钟）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首小时（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="次小时（元）">
              <template slot-scope="scope">
                <div>每分 钟</div>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
                <div>收费/元</div>
                <el-input v-model.trim="scope.row.otherTimeFee" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="超时额外收费（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封顶（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
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
            <el-table-column prop="billingCycle" label="计费周期" width="210px;">
            </el-table-column>
            <el-table-column prop="billingPeriod" label="计费时段" width="190px;">
            </el-table-column>
            <el-table-column label="免费时间（分钟）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首小时（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="次小时（元）">
              <template slot-scope="scope">
                <div>每分 钟</div>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
                <div>收费/元</div>
                <el-input v-model.trim="scope.row.otherTimeFee" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="超时额外收费（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封顶（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
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
            <el-table-column label="计费周期" width="210px;">
              <template slot-scope="scope">
                计费有效期
                <div class="block">
                  <span class="demonstration">开始</span>
                  <el-date-picker v-model="scope.row.startTime" type="date" value-format="timestamp" size="mini">
                  </el-date-picker>
                </div>
                <div class="block">
                  <span class="demonstration">结束</span>
                  <el-date-picker v-model="scope.row.endTime" type="date" value-format="timestamp" @change="endTimeWorkdayChagne(scope.$index)" size="mini">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计费时段" width="190px;">
              <template slot-scope="scope">
                <div class="demonstration">开始</div>
                <el-time-picker value-format="timestamp" v-model="scope.row.startPeriod" size="mini">
                </el-time-picker>
                <div class="demonstration">结束时间：
                  <span style="color:red;">{{scope.row.day}}</span>
                </div>
                <el-time-picker value-format="timestamp" v-model="scope.row.endPeriod" size="mini">
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column label="免费时间（分钟）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首小时（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="次小时（元）">
              <template slot-scope="scope">
                <div>每分 钟</div>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
                <div>收费/元</div>
                <el-input v-model.trim="scope.row.otherTimeFee" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="超时额外收费（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封顶（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
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
            <el-table-column prop="billingCycle" label="计费周期" width="210px;">
            </el-table-column>
            <el-table-column prop="billingPeriod" label="计费时段" width="190px;">
            </el-table-column>
            <el-table-column label="免费时间（分钟）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首小时（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="次小时（元）">
              <template slot-scope="scope">
                <div>每分 钟</div>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
                <div>收费/元</div>
                <el-input v-model.trim="scope.row.otherTimeFee" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="超时额外收费（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封顶（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
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
            <el-table-column label="计费周期" width="210px;">
              <template slot-scope="scope">
                计费有效期
                <div class="block">
                  <span class="demonstration">开始</span>
                  <el-date-picker v-model="scope.row.startTime" type="date" value-format="timestamp" size="mini">
                  </el-date-picker>
                </div>
                <div class="block">
                  <span class="demonstration">结束</span>
                  <el-date-picker v-model="scope.row.endTime" type="date" value-format="timestamp" @change="endTimeChagne(scope.$index)" size="mini">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计费时段" width="190px;">
              <template slot-scope="scope">
                <div class="demonstration">开始</div>
                <el-time-picker value-format="timestamp" v-model="scope.row.startPeriod" size="mini">
                </el-time-picker>
                <div class="demonstration">结束时间：
                  <span style="color:red;">{{scope.row.day}}</span>
                </div>
                <el-time-picker value-format="timestamp" v-model="scope.row.endPeriod" size="mini">
                </el-time-picker>
              </template>
            </el-table-column>
            <el-table-column label="免费时间（分钟）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.freeUseTime" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首小时（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.firstHourFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="次小时（元）">
              <template slot-scope="scope">
                <div>每分 钟</div>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
                <div>收费/元</div>
                <el-input v-model.trim="scope.row.otherTimeFee" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="超时额外收费（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.overTimeFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="封顶（元）">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.maxFeesWork" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
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
        <br>
        <el-button type="primary" @click="goReturn">返回</el-button>
      </div>
    </el-dialog>

    <!-- 6.4 选择优惠套餐模态框 -->
    <el-dialog title="设置优惠费用" :show-close="showClose" width="60%" :visible.sync="dialogDiscountPackage" :close-on-click-modal="false" :close-on-press-escape="false" custom-class="modelTableStyle">
      <div>
        <el-form :model="requireParams">
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
        <br>
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
      <el-form label-width="100px" label-position="left" :model="formDataParmas" class="estate-combo" :inline="true">
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
</template>

<style scopeed>
</style>

<script>
import Qs from 'qs';
import { getReserveData, getParkingData } from "../../server/getData";
import paingchild from '@/components/commonpage/paingchild';
import { format, dispostTime, proofTime, dataValidation } from '../../assets/js/base.js'
// import {  } from '../../../assets/js/base.js'
// 从父组件传递过来的数据是（这几个费用规则，车场的类型）
export default {
  data() {
    return {
      propdata: {},
      proptype: null,   // 表示车位类型   为0 表示静态的数据  其余是动态的数据
      propstate: null,  // 表示是否可以编辑

      feeRuleReserveList: [],  //预约费用集合
      feeRuleReserveObj: {}, // 要显示的预约费用
      tableDatas: [], // 点击绑定时候 展示的一级数据
      reserveId: '', // 预约的ID
      reservePatchArr: {}, // 选中预约表格中临时存放的数据
      dialogTableVisible: false, // 模态框是否显示

      parkingFeeRuleInfoData: [], //停车费用规则
      feeRuleParkingArr: [], // 要显示的停车费用
      ParkingDatas: [], // 停车费用数据集(放置在表格中的数据)
      tablePakingDatas: [], // 刚刚拿到的停车数据集 （到时候要匹配的数据集）
      dialogTableParking: false, // 选择预约费的模态框是否展示
      parkingId: null,         // 停车费用ID

      barrierList: [],  //道闸
      accessList: [], //门禁
      relaymeterList: [], //继电器

      // 模态框的数据
      showClose: false, // 模态框小叉
      searchFromData: {    // 搜索的内容
        name: '',
      },
      display: 10,   // 每页显示条数
      compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
      pagegroup: 5,
      page: 1,
      total: 0,
      start: 0,
      isflag: false,
      text: '',
      expands: [],
      // 搜索
      seachLoading: false,
      isSearch: 0,
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
      tableData: [],
      tableDatas: [],
      tableWorkday: [],
      tableWorkdays: [],
      tableWeekend: [],
      tableWeekends: [],
      disabledDet: false,
      parkingCostRulesData: null,
      // 套餐规则的展示
      packageByParkLot: [],
      dialogDiscountPackage: false,
      preferentialTable: [], // 选择优惠套餐的规则
      requireParams: {
        start: 0,
        length: 10,
        sEcho: 3,
        name: '',
        state:1,
      },
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
      switchPackageState: false,
    }
  },
  created() {
    // 父组件派发的事件
    this.$root.eventHub.$on('handle-data', (item) => {
      this.disdata(item);
    });
    this.$root.eventHub.$on('parkLot-id', (item) => {
      this.proptype = item;
    })
  },
  methods: {
    getSwitchPackageStateE() {
      this.$root.eventHub.$emit('packageState',this.switchPackageState)
    },
    // 处理数据
    disdata(item) {
      this.proptype = item.proptype;
      this.propstate = item.propstate;

      this.feeRuleReserveList = item.feeRuleReserveList;
      this.parkingFeeRuleInfoData = item.parkingFeeRuleInfoData;
      //          barrierList  道闸
      //          accessList 门禁
      //          relaymeterList 继电器
      this.barrierList = [].concat(item.barrierList);
      this.accessList = [].concat(item.accessList);
      this.relaymeterList = [].concat(item.relaymeterList);
      //        console.log(item);
      // 需要处理的数据
      if (this.feeRuleReserveList && this.feeRuleReserveList.length !== 0) {
        // 处理预约数据让其可以在表格中显示
        this.disfeeRuleReserve(this.feeRuleReserveList);
      }
      if (this.parkingFeeRuleInfoData && this.parkingFeeRuleInfoData.length !== 0) {
        // 处理停车费用 让其可以在表格中显示
        this.disfeeRuleParking(this.parkingFeeRuleInfoData);
      }
      // 套餐规则的展示
      if (item.packageByParkLot && item.packageByParkLot.length != 0) {
        this.packageByParkLot.push(item.packageByParkLot)
        if (item.packageByParkLot.packFlot == 1) {
          this.switchPackageState = '1'
        } else {
          this.switchPackageState = '0'
        }
      }
    },
    // 预约费用处理
    disfeeRuleReserve(item) {
      this.reserveId = item[0].id;
      this.$set(this.feeRuleReserveObj, 'id', item[0].id);
      this.$set(this.feeRuleReserveObj, 'name', item[0].name);
      this.$set(this.feeRuleReserveObj, 'feeList', item[0].fee.split(","));
      this.$set(this.feeRuleReserveObj, 'finishTime', item[0].finishTime.split(","));
    },
    // 停车费用处理
    disfeeRuleParking(item) {
      this.parkingCostRulesData = item;
      this.parkingId = item.id;
      let array = [];
      this.feeRuleParkingArr = [];
      array.push({
        id: item.id,
        name: item.name,
      })
      this.feeRuleParkingArr = this.feeRuleParkingArr.concat(array);
      console.log(this.feeRuleParkingArr)
    },
    // 显示预约选择表格
    getReserveEvent() {
      this.dialogTableVisible = true;
      this.getTableDatas();
    },
    // 获取预约数据
    async getTableDatas() {
      let datas = {
        start: this.start,
        sEcho: 3,
        length: this.display
      };

      if (this.searchFromData.name) {
        datas.name = this.searchFromData.name;
        this.isSearch = 1;
      }
      var data = Qs.stringify(datas);
      let res = await getReserveData(data);
      if (res.error_code === 2000) {
        this.seachLoading = false;
        this.total = parseInt(res.data.itotalRecords);
        this.tableDatas = res.data.dataList;
        for (let i = 0; i < this.tableDatas.length; i++) {
          let time = this.tableDatas[i].finishTime.split(",");
          let fee = this.tableDatas[i].fee.split(",");
          let reserveData = [];
          for (let j = 0; j < fee.length; j++) {
            reserveData.push({
              miunte: time[j],
              fee: fee[j]
            })
          }
          this.tableDatas[i].reserveData = reserveData;
        }
      } else {
        console.log(res, '错误码是=' + res.error_code);
      }
    },
    //预约费 关闭模态框按钮的时候（清空start compage）
    closeTagDialogTableVisible() {
      this.start = 0;
      this.compage = 1;
      this.dialogTableVisible = false;
      // 还有文本框的内容要清空
      if (this.searchFromData.name) this.searchFromData.name = '';
    },
    // 2.0 单选预约费用
    getCurrentRow(val) {
      // ID 切换
      this.reserveId = val.id;
      this.reservePatchObj = val;
      this.reservePatchArr = [];
      this.reservePatchArr.push(val);
    },
    // 4.0 预约模态框提交数据
    changeReserveID() {
      // 确定是否存在数据
      if (this.tableDatas.length == 0) {
        this.$message.error('预约费用规则不能提交为空');
      } else {
        this.disfeeRuleReserve(this.reservePatchArr);
        console.log(this.reserveId)
        this.$root.eventHub.$emit('reserveid', this.reserveId);
        if (this.searchFromData.name) this.searchFromData.name = '';
        this.dialogTableVisible = false;
        this.compage = 1;
        this.start = 0;
      }
    },

    // 3.0 预约费用展开 和 关闭
    rowClick(row, event, column) {
      this.reserveData = row.reserveData;
      Array.prototype.remove = function (val) {
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
    // ---停车费用
    getPrakingEvent() {
      this.dialogTableParking = true;
      this.getPakingTableDatas();
    },
    // --停车费用请求
    async getPakingTableDatas() {
      let datas = {
        start: this.start,
        sEcho: 3,
        length: this.display
      };
      if (this.searchFromData.name) {
        datas.name = this.searchFromData.name;
        this.isSearch = 1;
      }
      let data = Qs.stringify(datas);
      let res = await getParkingData(data);
      if (res.error_code === 2000) {
        // 赋值表格处理数据, 表格的总量
        this.seachLoading = false;
        this.total = parseInt(res.data.itotalRecords);
        this.ParkingDatas = res.data.dataList;
        // 开始对数据进行处理
        //          this.disData();
      } else {
        console.log(res, '错误码是=' + res.error_code);
      }
    },
    disData() {
      console.log(this.tablePakingDatas);
      let ParkingDatas = [];
      let params = this.tablePakingDatas;
      for (let i = 0; i < params.length; i++) {
        params[i].weekday = params[i].weekday.split(",");
        params[i].firstHourFee = params[i].firstHourFee.split(",");
        params[i].otherTimeFee = params[i].otherTimeFee.split(",");
        params[i].overTimeFee = params[i].overTimeFee.split(",");
        params[i].freeUseTime = params[i].freeUseTime.split(",");
        params[i].maxFee = params[i].maxFee.split(",");
        for (let j = 0; j < 2; j++) {
          let weekday = (params[i].weekday[j] === '0') ? '周末' : '工作日';
          ParkingDatas.push({
            id: params[i].id,
            name: params[i].name,
            weekday: weekday,
            firstHourFee: params[i].firstHourFee[j],
            otherTimeFee: params[i].otherTimeFee[j],
            overTimeFee: params[i].overTimeFee[j],
            freeUseTime: params[i].freeUseTime[j],
            maxFee: params[i].maxFee[j],
          });
        }
      }
      this.ParkingDatas = ParkingDatas;
    },

    //停车费查看详情
    parkingDetails() {
      console.log(this.parkingCostRulesData)
      this.parkingCostRules = true;
      this.formInline.name = this.parkingCostRulesData.name;
      this.id = this.parkingCostRulesData.id;
      this.tableWorkdays = []
      this.tableWorkday = []
      this.tableWeekends = []
      this.tableWeekend = []
      this.tableDatas = []
      this.tableData = []
      // type == 0 表示每天  type=1  表示工作日和周末
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
          let obj = {}
          let arr = []
          if (!feeRuleParkings[i].endTime) {
            obj.billingCycle = '每天'
            obj.billingPeriod = '24小时'
            this.tableData = this.tableData.concat(this._disponseDateArr(obj, arr, feeRuleParkings[i]))
          } else {
            this.tableFlag = 1;
            obj.billingCycle = '每天'
            obj.billingPeriod = '24小时'
            this.tableDatas = this.tableDatas.concat(this._disposeTimegetArr(obj, arr, feeRuleParkings[i]));
          }
        }
      } else {
        var tableWorkdaysInt = 0;
        var tableWeekendsInt = 0;
        //周末/工作日
        for (var i = 0; i < feeRuleParkings.length; i++) {
          let obj = {}
          let arr = []
          if (!feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 1) {
            //第一个工作日  只会有一个数据
            obj.billingCycle = '工作日'
            obj.billingPeriod = '24小时'
            this.tableWorkday = this.tableWorkday.concat(this._disponseDateArr(obj, arr, feeRuleParkings[i]))
          } else if (feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 1) {
            //              其余工作日
            this.tableWorkdayFlag = 1;
            obj.billingCycle = '工作日'
            obj.billingPeriod = '24小时'
            this.tableWorkdays = this.tableWorkdays.concat(this._disposeTimegetArr(obj, arr, feeRuleParkings[i]));
          } else if (!feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 0) {
            //第一个周末  只会有一个数据
            obj.billingCycle = '周末'
            obj.billingPeriod = '24小时'
            this.tableWeekend = this.tableWeekend.concat(this._disponseDateArr(obj, arr, feeRuleParkings[i]))
          } else if (feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 0) {
            this.tableWeekendFlag = 1;
            obj.billingCycle = '周末'
            obj.billingPeriod = '24小时'
            this.tableWeekends = this.tableWeekends.concat(this._disposeTimegetArr(obj, arr, feeRuleParkings[i]));
          } else {
            this.$message.error("数据出错")
          }
        }
      }
    },
    /**
     * @obj {}
     * @arr []
     * @data 数据 row
    */
    _disposeTimegetArr(obj, arr, data) {
      console.log(data.firstHourFee)
      obj.freeUseTime = data.freeUseTime;
      obj.firstHourFeesWork = data.firstHourFee;
      obj.otherTimePeriodWork = data.otherTimePeriod;
      obj.otherTimeFee = data.otherTimeFee;
      obj.overTimeFeesWork = data.overTimeFee;
      obj.maxFeesWork = data.maxFee;
      obj.startTime = data.startTime;
      obj.endTime = data.endTime;
      obj.startPeriod = data.startTime;
      obj.endPeriod = data.endTime;
      let startTime = format(data.startTime)
      let endTime = format(data.endTime)
      let dis_start_time = new Date('2010-01-01' + " " + startTime.split(" ")[1]);
      let dis_end_time = new Date('2010-01-01' + " " + endTime.split(" ")[1]);
      let dis_day_start_time = new Date(startTime.split(" ")[0] + " " + "00:00:00");
      let dis_day_end_time = new Date(endTime.split(" ")[0] + " " + "00:00:00");
      if (dis_day_start_time.getTime() > dis_day_end_time.getTime()) {
        this.$message.error('当前日期选择错误，费用计算会出现异常！！！')
      } else if (dis_day_start_time.getTime() == dis_day_end_time.getTime()) {
        if (dis_start_time.getTime() >= dis_end_time.getTime()) {
          obj.day = '日期有误'
        } else {
          obj.day = '当天'
        }
      } else {
        if (dis_start_time.getTime() >= dis_end_time.getTime()) {
          obj.day = '次日';
        } else {
          obj.day = '当天';
        }
      }

      if (data.remark != "null") obj.remark = data.remark;
      arr.push(obj)
      return arr
    },
    /**
     * obj {}
     * arr []
     * data 使用的参数
    */
    _disponseDateArr(obj, arr, data) {
      obj.freeUseTime = data.freeUseTime;
      obj.firstHourFeesWork = data.firstHourFee;
      obj.otherTimePeriodWork = data.otherTimePeriod;
      obj.otherTimeFee = data.otherTimeFee;
      obj.overTimeFeesWork = data.overTimeFee;
      obj.maxFeesWork = data.maxFee;
      if (data.remark != "null") {
        obj.remark = data.remark;
      }
      arr.push(obj)
      return obj;
    },
    goReturn() {
      this.parkingCostRules = false;
    },
    // 停车费获取id
    getCurrentRowparking(item) {
      this.parkingId = item.id;
      console.log(item)
      this.parkingCostRulesData = item;
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
    getParkingId() {
      // 确定数据
      if (!this.parkingId) {
        this.$message.error('停车费用规则不能提交为空');
        return false;
      }
      let parkingTable = [];
      for (let i = 0; i < this.ParkingDatas.length; i++) {
        if (this.ParkingDatas[i].id === this.parkingId) {
          parkingTable.push(this.ParkingDatas[i]);
        }
      }
      this.compage = 1;
      this.start = 0;
      this.feeRuleParkingArr = [];
      this.feeRuleParkingArr = [].concat(parkingTable);
      this.$root.eventHub.$emit('parkingId', this.parkingId);
      if (this.searchFromData.name) this.searchFromData.name = '';
      this.dialogTableParking = false;
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
          }, 3000);
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
      };
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
    /* --------优惠规则的显示开始------ */
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
      this.packageByParkLot = [];
      this.packageByParkLot.push(row)
      this.switchPackageState = '0'
      let params = {
        id: this.packageByParkLot[0].id,
        packageState: this.switchPackageState
      }
      this.$root.eventHub.$emit('packageId', params);
      console.log(this.packageByParkLot[0].id)

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
      this.formDataParmas = {
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
            this.everyDay = [
              {
                startTime: '',
                endTime: '',
                messageInfo: '',
                miunte: '',
              }
            ]
            this.weekDay = [
              {
                startTime: '',
                endTime: '',
                messageInfo: '',
                miunte: '',
              }
            ]
            this.workDay = [{
              startTime: '',
              endTime: '',
              messageInfo: '',
              miunte: '',
            }]
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
    /* --------优惠规则的显示结束------ */
  },

  mounted() {
  },
  components: {
    paingchild,
  },
}
</script>

<style scoped>
.title-message {
  color: red;
}
</style>

