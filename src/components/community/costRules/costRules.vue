<template>
  <div>
    <h2>{{title}}</h2>
    <br>
    <el-tabs type="border-card" v-model="activeName">
      <!--预约收费规则-->
      <el-tab-pane :disabled="disabledCard" name="first" label="预约费">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="150px" class="demo-dynamic">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="name" label="*预约费规则名称">
                <el-input v-model.trim="dynamicValidateForm.name" :maxlength=20></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :label="'提前时长(分钟)'" :key="domain.key" :prop="'domains.' + index + '.time'" :rules="{required: true, message: '提前时长(分钟),预约费用(元)不能为空', trigger: 'blur'}">
                <el-input v-model.number.number.trim="domain.time" :maxlength=4></el-input>
                预约费用(元)
                <el-input v-model.number.trim="domain.money" :maxlength=3></el-input>
                <el-button @click.prevent="removeDomain(domain,index)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <br>
          <el-form-item>
            <el-button @click="addDomain(dynamicValidateForm)">新增</el-button>
            <el-button type="primary" @click="submitForm(dynamicValidateForm)">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!--停车费用规则-->
      <el-tab-pane name="second" label="停车费">
        <el-form :model="formInline" class="demo-form-inline">
          <el-row>
            <el-col :span="6">
              <el-form-item label="停车费规则名称">
                <el-input v-model="formInline.name" placeholder="请输入停车费规则名称" :maxlength=20></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="计费周期">
                <el-select v-model="formInline.billingCycle" placeholder="请选择" @change="selectChange" :disabled="disabledDet">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 每天的数据 -->
        <template v-if="formInline.billingCycle==1">
          <el-table key="everyday" :data="tableData" border style="width: 100%">
            <el-table-column prop="billingCycle" label="计费周期" width="280px;">
            </el-table-column>
            <el-table-column prop="billingPeriod" label="计费时段" width="240px">
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
            <el-table-column label="次小时（元）" width="170px;">
              <template slot-scope="scope">
                <span>每分 钟</span>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
                <br>
                <span>收费/元</span>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" @click="addPeriod" v-if="tableFlag!=1" :disabled="disabledDet" size="mini">新增时段</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table key="everydays" v-if="tableFlag==1" :data="tableDatas" border :show-header=false style="width: 100%">
            <el-table-column label="计费周期" width="280px;">
              <template slot-scope="scope">
                <div>计费有效期</div>
                <div class="block">
                  <span class="demonstration">开始</span>
                  <el-date-picker v-model="scope.row.startTime" type="date" value-format="yyyy-MM-dd" size="mini" @change="pickerChangeE(scope.row)">
                  </el-date-picker>
                </div>
                <div class="block">
                  <span class="demonstration">结束</span>
                  <el-date-picker v-model="scope.row.endTime" type="date" value-format="yyyy-MM-dd" @change="pickerChangeDataE(scope.row)" size="mini">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计费时段" width="240px;">
              <template slot-scope="scope">
                <div class="demonstration">开始</div>
                <el-time-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.startPeriod" size="mini" @change="pickerChangeE(scope.row)">
                </el-time-picker>
                <div class="demonstration">结束时间：
                  <span style="color:red;">{{scope.row.day}}</span>
                </div>
                <el-time-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.endPeriod" @change="pickerChangeE(scope.row)" size="mini">
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
            <el-table-column label="次小时（元）" width="170px;">
              <template slot-scope="scope">
                <span>每分 钟</span>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
                <br>
                <span>收费/元</span>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="removePeriod(scope.$index)" :disabled="disabledDet" size="mini">删除</el-button>
                <br>
                <el-button type="success" @click="addPeriod" v-if="scope.$index==tableDatas.length-1" :disabled="disabledDet" size="mini">新增时段</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <!-- 分工作日 和 周末的数据 -->
        <template v-if="formInline.billingCycle==2">
          <el-table key="workday" :data="tableWorkday" border style="width: 100%">
            <el-table-column prop="billingCycle" label="计费周期" width="280px;">
            </el-table-column>
            <el-table-column prop="billingPeriod" label="计费时段" width="240px;">
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
            <el-table-column label="次小时（元）" width="170px">
              <template slot-scope="scope">
                <span>每 分钟</span>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input><br>
                <span>收费/元</span>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" @click="addWorkdayPeriod" v-if="tableWorkdayFlag!=1" :disabled="disabledDet" size="mini">新增时段</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table key="workdays" v-if="tableWorkdayFlag==1" :data="tableWorkdays" border :show-header=false style="width: 100%">
            <el-table-column label="计费周期" width="280px;">
              <template slot-scope="scope">
                <div>计费有效期 </div>
                <div class="block">
                  <span class="demonstration">开始</span>
                  <el-date-picker v-model="scope.row.startTime" type="date" value-format="yyyy-MM-dd" size="mini" @change="pickerChangeE(scope.row)">
                  </el-date-picker>
                </div>
                <div class="block">
                  <span class="demonstration">结束</span>
                  <el-date-picker v-model="scope.row.endTime" type="date" value-format="yyyy-MM-dd" @change="pickerChangeDataE(scope.row)" size="mini">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计费时段" width="240px;">
              <template slot-scope="scope">
                <span class="demonstration">开始</span>
                <br>
                <el-time-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.startPeriod" size="mini" @change="pickerChangeE(scope.row)">
                </el-time-picker>
                <br>
                <span class="demonstration">结束时间：
                  <span style="color:red;">{{scope.row.day}}</span>
                </span>
                <el-time-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.endPeriod" @change="pickerChangeE(scope.row)" size="mini">
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
            <el-table-column label="次小时（元）" width="170px">
              <template slot-scope="scope">
                <span>每分 钟</span>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
                <br>
                <span>收费/元</span>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="removeWorkdayPeriod(scope.$index)" :disabled="disabledDet" size="mini">删除</el-button>
                <br>
                <el-button type="success" @click="addWorkdayPeriod" v-if="scope.$index==tableWorkdays.length-1" :disabled="disabledDet" size="mini">新增时段
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <br>

          <el-table key="weekend" :data="tableWeekend" border style="width: 100%">
            <el-table-column prop="billingCycle" label="计费周期" width="280px;">
            </el-table-column>
            <el-table-column prop="billingPeriod" label="计费时段" width="240px;">
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
            <el-table-column label="次小时（元）" width="170px;">
              <template slot-scope="scope">
                <span>每分 钟</span>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" class="inputClass" :maxlength=3 @change="inputChange(scope.row)" size="mini"></el-input>
                <br>
                <span>收费/元</span>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="success" @click="addWeekendPeriod" v-if="tableWeekendFlag!=1" :disabled="disabledDet" size="mini">新增时段</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table key="weekends" v-if="tableWeekendFlag==1" :data="tableWeekends" border :show-header=false style="width: 100%">
            <el-table-column label="计费周期" width="280px;">
              <template slot-scope="scope">
                <div>计费有效期</div>
                <div class="block">
                  <span class="demonstration">开始</span>
                  <el-date-picker v-model="scope.row.startTime" type="date" value-format="yyyy-MM-dd" size="mini" @change="pickerChangeE(scope.row)">
                  </el-date-picker>
                </div>
                <div class="block">
                  <span class="demonstration">结束</span>
                  <el-date-picker v-model="scope.row.endTime" type="date" value-format="yyyy-MM-dd" @change="pickerChangeDataE(scope.row)" size="mini">
                  </el-date-picker>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="计费时段" width="240px;">
              <template slot-scope="scope">
                <span class="demonstration">开始</span>
                <el-time-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.startPeriod" size="mini" @change="pickerChangeE(scope.row)">
                </el-time-picker>
                <span class="demonstration">结束时间：
                  <span style="color:red;">{{scope.row.day}}</span>
                </span>
                <el-time-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.endPeriod" @change="pickerChangeE(scope.row)" size="mini">
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
            <el-table-column label="次小时（元）" width="170px;">
              <template slot-scope="scope">
                <span>每分 钟</span>
                <el-input v-model.trim="scope.row.otherTimePeriodWork" :maxlength=3 class="inputClass" @change="inputChange(scope.row)" size="mini"></el-input>
                <br>
                <span>收费/元</span>
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
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" @click="removeWeekendPeriod(scope.$index)" :disabled="disabledDet" size="mini">删除</el-button>
                <br>
                <el-button type="success" @click="addWeekendPeriod" v-if="scope.$index==tableWeekends.length-1" :disabled="disabledDet" size="mini">新增时段
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <el-button type="primary" @click="goReturn">返回</el-button>
        <el-button type="success" @click="onSubmit" :disabled="disabledDet">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Qs from 'qs';
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
import { setReserveData } from '../../../server/getData';
export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [{
          time: '',
          money: ''
        }],
        name: ''
      },
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
        day: '',
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
        day: '123',
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
        day: '',
      }],
      activeName: "first",
      //详情编辑
      row: this.$route.query.row,
      disabledDet: false,
      disabledCard: false,
      id: null,
      title: this.$route.query.title,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    pickerChangeDataE(row) {
      var endtime = new Date(row.endTime + " " + "00:00:00")
      var starttime = new Date(row.startTime + " " + "00:00:00")
      if (endtime.getTime() < starttime.getTime()) {
        this.$message.error('计费有效期错误，请重新  选择计费有效期 (开始 <= 结束)，否则提交数据失败');
      }
      if (row.startPeriod && row.endPeriod) {
        this.pickerChangeE(row)
      }
    },
    // 结束时间确定的时候
    pickerChangeE(row) {
      console.log(row)
      var startdate = new Date("2011-11-11"+" "+row.startPeriod.split(" ")[1]);
      var enddate = new Date("2011-11-11"+" "+row.endPeriod.split(" ")[1]);
      var endtime = new Date(row.endTime.split(" ")[0] + " " + "00:00:00")
      var starttime = new Date(row.startTime.split(" ")[0] + " " + "00:00:00")
      console.log(endtime.getTime(), starttime.getTime())
      if (endtime.getTime() < starttime.getTime()) {
        this.$set(row, 'day', '日期有误')
      } else if (endtime.getTime() == starttime.getTime()) {
        if (startdate.getTime() >= enddate.getTime()) {
          this.$set(row, 'day', '时段有误')
        } else {
          this.$set(row, 'day', '当天')
        }
      } else {
        if (startdate.getTime() >= enddate.getTime()) {
          this.$set(row, 'day', '次日')
        } else {
          this.$set(row, 'day', '当天')
        }
      }
    },
    getData() {
      if (!this.row) return false;
      console.log(this.row)
      if (this.title == "查看规则") {
        this.disabledDet = true;//将预约费禁用
        this.disabledCard = true;
      } else if (this.title == "编辑规则") {
        this.disabledCard = true;
      }
      this.activeName = "second";
      this.formInline.name = this.row.name;
      this.id = this.row.id;
      if (this.row.type == 0) {
        this.formInline.billingCycle = "1";
      } else if (this.row.type == 1) {
        this.formInline.billingCycle = "2";
      }
      var feeRuleParkings = this.row.feeRuleParkings;
      if (this.row.type == 0) {
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
            this.tableData[0].remark = feeRuleParkings[0].remark;
          } else {
            int = i - 1;
            this.tableFlag = 1;
            this.tableDatas[int] = {
              freeUseTime: "",
              firstHourFeesWork: "",
              otherTimePeriodWork: "",
              otherTimeFee: "",
              overTimeFeesWork: "",
              maxFeesWork: "",
              remark: "",
              startTime: "",
              endTime: "",
              startPeriod: "",
              endPeriod: "",
              day: '',
            }
            this.tableDatas[int].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableDatas[int].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableDatas[int].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableDatas[int].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableDatas[int].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableDatas[int].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableDatas[int].remark = feeRuleParkings[i].remark;
            var startTime = this.format(feeRuleParkings[i].startTime);
            var endTime = this.format(feeRuleParkings[i].endTime);
            this.tableDatas[int].startTime = startTime;
            this.tableDatas[int].endTime = endTime;
            this.tableDatas[int].startPeriod = startTime;
            this.tableDatas[int].endPeriod = endTime;
            this.tableDatas[int].day = this.disTimeandDate(startTime, endTime)
            // let dis_start_time = new Date('2010-01-01' + " " + startTime.split(" ")[1]);
            // let dis_end_time = new Date('2010-01-01' + " " + endTime.split(" ")[1]);
            // if (dis_start_time.getTime() >= dis_end_time.getTime()) {
            //   this.tableDatas[int].day = '次日';
            // } else {
            //   this.tableDatas[int].day = '当天';
            // }
          }
        }
      } else {
        var tableWorkdaysInt = 0;
        var tableWeekendsInt = 0;
        //周末/工作日
        for (var i = 0; i < feeRuleParkings.length; i++) {
          if (!feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 1) {
            //第一个工作日
            this.tableWorkday[0].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWorkday[0].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWorkday[0].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWorkday[0].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWorkday[0].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWorkday[0].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableWorkday[0].remark = feeRuleParkings[i].remark;
          } else if (feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 1) {
            //              其余工作日
            this.tableWorkdayFlag = 1;
            this.tableWorkdays[tableWorkdaysInt] = {
              freeUseTime: "",
              firstHourFeesWork: "",
              otherTimePeriodWork: "",
              otherTimeFee: "",
              overTimeFeesWork: "",
              maxFeesWork: "",
              remark: "",
              startTime: "",
              endTime: "",
              startPeriod: "",
              endPeriod: "",
              day: "",
            }
            this.tableWorkdays[tableWorkdaysInt].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWorkdays[tableWorkdaysInt].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWorkdays[tableWorkdaysInt].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWorkdays[tableWorkdaysInt].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWorkdays[tableWorkdaysInt].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWorkdays[tableWorkdaysInt].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableWorkdays[tableWorkdaysInt].remark = feeRuleParkings[i].remark;

            var startTime = this.format(feeRuleParkings[i].startTime);
            var endTime = this.format(feeRuleParkings[i].endTime);

            this.tableWorkdays[tableWorkdaysInt].startTime = startTime;
            this.tableWorkdays[tableWorkdaysInt].endTime = endTime;
            this.tableWorkdays[tableWorkdaysInt].startPeriod = startTime;
            this.tableWorkdays[tableWorkdaysInt].endPeriod = endTime;
            this.tableWorkdays[tableWorkdaysInt].day = this.disTimeandDate(startTime, endTime)
            // let dis_start_time = new Date('2010-01-01' + " " + startTime.split(" ")[1]);
            // let dis_end_time = new Date('2010-01-01' + " " + endTime.split(" ")[1]);
            // if (dis_start_time.getTime() >= dis_end_time.getTime()) {
            //   this.tableDatas[int].day = '次日';
            // } else {
            //   this.tableDatas[int].day = '当天';
            // }
            tableWorkdaysInt = tableWorkdaysInt + 1;
          } else if (!feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 0) {
            //第一个周末
            this.tableWeekend[0].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWeekend[0].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWeekend[0].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWeekend[0].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWeekend[0].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWeekend[0].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableWeekend[0].remark = feeRuleParkings[i].remark;
          } else if (feeRuleParkings[i].endTime && feeRuleParkings[i].weekday == 0) {
            //其余周末
            this.tableWeekendFlag = 1;
            this.tableWeekends[tableWeekendsInt] = {
              freeUseTime: "",
              firstHourFeesWork: "",
              otherTimePeriodWork: "",
              otherTimeFee: "",
              overTimeFeesWork: "",
              maxFeesWork: "",
              remark: "",
              startTime: "",
              endTime: "",
              startPeriod: "",
              endPeriod: "",
              day: '',
            }
            this.tableWeekends[tableWeekendsInt].freeUseTime = feeRuleParkings[i].freeUseTime;
            this.tableWeekends[tableWeekendsInt].firstHourFeesWork = feeRuleParkings[i].firstHourFee;
            this.tableWeekends[tableWeekendsInt].otherTimePeriodWork = feeRuleParkings[i].otherTimePeriod;
            this.tableWeekends[tableWeekendsInt].otherTimeFee = feeRuleParkings[i].otherTimeFee;
            this.tableWeekends[tableWeekendsInt].overTimeFeesWork = feeRuleParkings[i].overTimeFee;
            this.tableWeekends[tableWeekendsInt].maxFeesWork = feeRuleParkings[i].maxFee;
            this.tableWeekends[tableWeekendsInt].remark = feeRuleParkings[i].remark;
            var startTime = this.format(feeRuleParkings[i].startTime);
            var endTime = this.format(feeRuleParkings[i].endTime);
            this.tableWeekends[tableWeekendsInt].startTime = startTime;
            this.tableWeekends[tableWeekendsInt].endTime = endTime;
            this.tableWeekends[tableWeekendsInt].startPeriod = startTime;
            this.tableWeekends[tableWeekendsInt].endPeriod = endTime;
            this.tableWeekends[tableWeekendsInt].day = this.disTimeandDate(startTime, endTime)
            tableWeekendsInt = tableWeekendsInt + 1;
          } else {
            this.$message.error("数据出错")
          }
        }
      }

    },
    /**
     * @param starttime 开始 时间
     * @param endtime 结束时间 
     * @return day 返回时间
    */
    disTimeandDate(startTime, endTime) {
      let day = '';
      let dis_start_time = new Date('2010-01-01' + " " + startTime.split(" ")[1]);
      let dis_end_time = new Date('2010-01-01' + " " + endTime.split(" ")[1]);
      let dis_start_day = new Date(startTime.split(" ")[0] + " " + "00:00:00")
      let dis_end_day = new Date(endTime.split(" ")[0] + " " + "00:00:00")
      if (dis_start_day.getTime() > dis_end_day.getTime()) {
        day = '日期有误'
      } else if (dis_start_day.getTime() == dis_end_day.getTime()) {
        if (dis_start_time.getTime() >= dis_end_time.getTime()) {
          day = '时段有误'
        } else {
          day = '当天'
        }
      } else {
        if (dis_start_time.getTime() >= dis_end_time.getTime()) {
          day = '次日';
        } else {
          day = '当天';
        }
      }
      return day
    },
    //预约费提交
    submitForm(formName) {
      // 对数据进行判断和处理
      var name = formName.name;//预约名称
      var advanceTimeList = [];//提前预约时长
      var feeList = [];//预约费用
      if (name == "" || name.length > 20) {
        this.$message.error('费用规则名称不能为空并且字符上限20');
        return false;
      }
      for (let i = 0, len = formName.domains.length; i < len; i++) {
        if (!(/(^[1-9]\d*$)/.test(formName.domains[i].time))) {
          this.$message.error('提前预约时长必须是数字');
          return;
        } else if (!(/(^[0-9]\d*$)/.test(formName.domains[i].money))) {
          this.$message.error('预约费用必须是数字');
          return;
        } else if (len >= 2 && i >= 1 && formName.domains[i].time <= formName.domains[i - 1].time) {
          this.$message.error('提前时长重复,请重新设置');
          return;
        } else if (len >= 2 && i >= 1 && formName.domains[i].money <= formName.domains[i - 1].money) {
          this.$message.error('预约费用重复,请重新设置');
          return;
        } else {
          advanceTimeList.push(formName.domains[i].time);
          feeList.push(formName.domains[i].money);
        }
      }
      let time = advanceTimeList.toString();
      let money = feeList.toString();
      console.log(time, money);
      let data = {
        name: name,
        advanceTimeList: time,
        feeList: money
      }
      data = Qs.stringify(data);
      this.setReserve(data);
    },
    // 添加预约费用
    async setReserve(data) {
      let res = await setReserveData(data);
      if (res.error_code == 2000) {
        this.$message.success('恭喜你，新增预约费成功');
        this.$router.go(-1);
      } else if (res.error_code == 2307) {
        this.$message.error('费用规则名称已存在');
      } else {
        this.$message.error('新增失败');
      }
    },
    //删除预约费
    removeDomain(item, index) {
      if (this.dynamicValidateForm.domains.length == 1) {
        this.$message.error('错了哦，不能删除,必须有一条');
        return false;
      } else if (this.dynamicValidateForm.domains.length - 1 > index) {
        this.$message.error('错了哦，只能从最后一条开始删除');
        return false;
      } else {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      }
    },
    //新增预约费 （对新增的预约费规则做了处理）
    addDomain(item) {
      console.log(item);
      console.log(item.domains.length);
      let len = item.domains.length;
      if (this.dynamicValidateForm.name == '') {
        this.$message.error('预约费规则名称不能够为空');
        return;
      } else if (item.domains[item.domains.length - 1].money === '' || item.domains[item.domains.length - 1].time === '') {
        this.$message.error('提前时长和预约费用不能为空');
        return;
      } else if (len >= 2 && item.domains[len - 1].time <= item.domains[len - 2].time) {
        this.$message.error('后一个提前时长 > 前一个提前时长');
        return;
      } else {
        this.dynamicValidateForm.domains.push({
          time: '',
          money: '',
          key: Date.now()
        });
      }
    },

    //停车费--------每天
    //停车费计费周期下拉框改变时
    selectChange() {
      this.tableFlag = 0;
      this.tableWorkdayFlag = 0;
      this.tableWeekendFlag = 0;
      this.tableData = [{
        billingCycle: '每天',
        billingPeriod: '24小时',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }];
      this.tableDatas = [{
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
      }];
      this.tableWorkday = [{
        billingCycle: '工作日',
        billingPeriod: '24小时',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }];
      this.tableWorkdays = [{
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
      }];
      this.tableWeekend = [{
        billingCycle: '周末',
        billingPeriod: '24小时',
        freeUseTime: '',
        firstHourFeesWork: '',
        otherTimePeriodWork: '',
        otherTimeFee: '',
        overTimeFeesWork: '',
        maxFeesWork: '',
        remark: '',
      }];
      this.tableWeekends = [{
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
      }];
    },
    //新增时段
    addPeriod() {
      if (this.tableFlag == 0) {
        this.tableFlag = 1;
      } else {
        this.tableDatasPush();
      }
    },
    //删除时段
    removePeriod(index) {
      this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableDatas.splice(index, 1);
        if (this.tableDatas.length == 0 || this.tableDatas.length < 0) {
          this.tableFlag = 0;
          this.tableDatasPush();
        }
      }).catch(() => { });
    },
    //每天的push数据
    tableDatasPush() {
      this.tableDatas.push({
        billingCycle: '',
        billingPeriod: '',
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
        day: '',
      })
    },

    //停车费--------工作日
    //新增时段
    addWorkdayPeriod() {
      if (this.tableWorkdayFlag == 0) {
        this.tableWorkdayFlag = 1;
      } else {
        this.tableWorkdaysPush();
      }
    },
    //删除时段
    removeWorkdayPeriod(index) {
      this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableWorkdays.splice(index, 1);
        if (this.tableWorkdays.length == 0 || this.tableWorkdays.length < 0) {
          this.tableWorkdayFlag = 0;
          this.tableWorkdaysPush();
        }
      }).catch(() => { });
    },
    //工作日的push数据
    tableWorkdaysPush() {
      console.log(this.tableWorkdays)
      this.tableWorkdays.push({
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
        day: '',
      })
    },
    //停车费--------周末
    //新增时段
    addWeekendPeriod() {
      if (this.tableWeekendFlag == 0) {
        this.tableWeekendFlag = 1;
      } else {
        this.tableWeekendsPush();
      }
    },
    //删除时段
    removeWeekendPeriod(index) {
      this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableWeekends.splice(index, 1);
        if (this.tableWeekends.length == 0 || this.tableWeekends.length < 0) {
          this.tableWeekendFlag = 0;
          this.tableWeekendsPush();
        }
      }).catch(() => { });
    },
    //周末的push数据
    tableWeekendsPush() {
      this.tableWeekends.push({
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
        day: '',
      })
    },

    //输入框改变时触发
    inputChange(row) {
      var number = /^\d+$/;//整数正则
      try {
        if (!number.test(row.freeUseTime)) {
          row.freeUseTime = "";
        }
        if (!number.test(row.firstHourFeesWork)) {
          row.firstHourFeesWork = "";
        }
        if (!number.test(row.otherTimePeriodWork)) {
          row.otherTimePeriodWork = "";
        }
        if (!number.test(row.otherTimeFee)) {
          row.otherTimeFee = "";
        }
        if (!number.test(row.overTimeFeesWork)) {
          row.overTimeFeesWork = "";
        }
        if (!number.test(row.maxFeesWork)) {
          row.maxFeesWork = "";
        }
      } catch (e) {
      }
    },

    //提交停车费规则
    onSubmit() {
      var startTime = null;
      var endTime = null;
      var periodStr = null;
      var timeStr = null;
      if (this.formInline.name == "") {
        this.$message.error('所有内容均为必填');
        return false;
      }
      if (this.formInline.billingCycle == 1) {   //   表示每天
        if (this.tableData[0].firstHourFeesWork === '' || this.tableData[0].freeUseTime === '' || this.tableData[0].maxFeesWork === '' || this.tableData[0].otherTimeFee === '' || this.tableData[0].otherTimePeriodWork === '') {

          this.$message.error('所有内容均为必填');
          return false;
        }
        if (this.tableData[0].maxFeesWork != 0) {
          if (Number(this.tableData[0].maxFeesWork) < Number(this.tableData[0].firstHourFeesWork) || Number(this.tableData[0].maxFeesWork) < Number(this.tableData[0].otherTimeFee)) {
            this.$message.error('封顶价格设置有误，请重新设置');
            return false;
          }
        }
        if (this.tableFlag != 0) {
          for (var i = 0; i < this.tableDatas.length; i++) {
            if (this.tableDatas[i].firstHourFeesWork === '' || this.tableDatas[i].freeUseTime === '' || this.tableDatas[i].maxFeesWork === '' || this.tableDatas[i].otherTimeFee === '' || this.tableDatas[i].otherTimePeriodWork === '' || this.tableDatas[i].startPeriod === '' || this.tableDatas[i].endPeriod === '' || this.tableDatas[i].startTime === '' || this.tableDatas[i].endTime === '') {
              this.$message.error('所有内容均为必填');
              return false;
            }
            if (this.tableDatas[i].maxFeesWork != 0) {
              if (Number(this.tableDatas[i].maxFeesWork) < Number(this.tableDatas[i].firstHourFeesWork) || Number(this.tableDatas[i].maxFeesWork) < Number(this.tableDatas[i].otherTimeFee)) {
                this.$message.error('封顶价格设置有误，请重新设置');
                return false;
              }
            }
          }
        }
        var formData = new FormData();
        if (this.id) formData.append("id", this.id);
        formData.append("name", this.formInline.name);
        formData.append("type", 0);
        formData.append("feeRuleParkings[0].firstHourFee", this.tableData[0].firstHourFeesWork);
        formData.append("feeRuleParkings[0].otherTimePeriod", this.tableData[0].otherTimePeriodWork);
        formData.append("feeRuleParkings[0].otherTimeFee", this.tableData[0].otherTimeFee);
        formData.append("feeRuleParkings[0].maxFee", this.tableData[0].maxFeesWork);
        formData.append("feeRuleParkings[0].freeUseTime", this.tableData[0].freeUseTime);
        formData.append("feeRuleParkings[0].overTimeFee", this.tableData[0].overTimeFeesWork);
        formData.append("feeRuleParkings[0].remark", this.tableData[0].remark);
        formData.append("feeRuleParkings[0].weekday", 2);
        if (this.tableFlag != 0) {
          var int;
          for (var i = 0; i < this.tableDatas.length; i++) {
            let flag = this.verificationDay(this.tableDatas[i].day)
            if (!flag) {
              this.$message.error('提交日期有误，不能提交数据')
              return
            }
            int = i + 1;
            formData.append("feeRuleParkings[" + int + "].weekday", 2);
            formData.append("feeRuleParkings[" + int + "].firstHourFee", this.tableDatas[i].firstHourFeesWork);
            formData.append("feeRuleParkings[" + int + "].otherTimePeriod", this.tableDatas[i].otherTimePeriodWork);
            formData.append("feeRuleParkings[" + int + "].otherTimeFee", this.tableDatas[i].otherTimeFee);
            formData.append("feeRuleParkings[" + int + "].maxFee", this.tableDatas[i].maxFeesWork);
            formData.append("feeRuleParkings[" + int + "].freeUseTime", this.tableDatas[i].freeUseTime);
            formData.append("feeRuleParkings[" + int + "].overTimeFee", this.tableDatas[i].overTimeFeesWork);
            formData.append("feeRuleParkings[" + int + "].remark", this.tableDatas[i].remark);
            periodStr = this.tableDatas[i].startPeriod.split(" ");
            timeStr = this.tableDatas[i].startTime.split(" ");
            periodStr[0] = timeStr[0];
            startTime = periodStr[0] + " " + periodStr[1];
            periodStr = this.tableDatas[i].endPeriod.split(" ");
            timeStr = this.tableDatas[i].endTime.split(" ");
            periodStr[0] = timeStr[0];
            endTime = periodStr[0] + " " + periodStr[1];
            try {
              startTime = new Date(startTime).getTime();
              endTime = new Date(endTime).getTime();
            } catch (e) {
              startTime = startTime;
              endTime = endTime;
            }
            if (String(startTime).length == 13) {
              formData.append("feeRuleParkings[" + int + "].startTime", startTime);
              formData.append("feeRuleParkings[" + int + "].endTime", endTime);
            }
          }
        }
        this.submitData(formData);
      } else {  // 工作日 和 周末
        if (this.tableWorkday[0].firstHourFeesWork === '' || this.tableWorkday[0].freeUseTime === '' || this.tableWorkday[0].maxFeesWork === '' || this.tableWorkday[0].otherTimeFee === '' || this.tableWorkday[0].otherTimePeriodWork === '') {
          this.$message.error('所有内容均为必填');
          return false;
        }
        if (this.tableWorkday[0].maxFeesWork != 0) {
          if (Number(this.tableWorkday[0].maxFeesWork) < Number(this.tableWorkday[0].firstHourFeesWork) || Number(this.tableWorkday[0].maxFeesWork) < Number(this.tableWorkday[0].otherTimeFee)) {
            this.$message.error('封顶价格设置有误，请重新设置');
            return false;
          }
        }
        if (this.tableWeekend[0].firstHourFeesWork === '' || this.tableWeekend[0].freeUseTime === '' || this.tableWeekend[0].maxFeesWork === '' || this.tableWeekend[0].otherTimeFee === '' || this.tableWeekend[0].otherTimePeriodWork === '') {
          this.$message.error('所有内容均为必填');
          return false;
        }
        if (this.tableWeekend[0].maxFeesWork != 0) {
          if (Number(this.tableWeekend[0].maxFeesWork) < Number(this.tableWeekend[0].firstHourFeesWork) || Number(this.tableWeekend[0].maxFeesWork) < Number(this.tableWeekend[0].otherTimeFee)) {
            this.$message.error('封顶价格设置有误，请重新设置');
            return false;
          }
        }
        if (this.tableWorkdayFlag != 0) {
          for (var i = 0; i < this.tableWorkdays.length; i++) {
            if (this.tableWorkdays[i].firstHourFeesWork === '' || this.tableWorkdays[i].freeUseTime === '' || this.tableWorkdays[i].maxFeesWork === '' || this.tableWorkdays[i].otherTimeFee === '' || this.tableWorkdays[i].otherTimePeriodWork === '' || this.tableWorkdays[i].startPeriod === '' || this.tableWorkdays[i].endPeriod === '' || this.tableWorkdays[i].startTime === '' || this.tableWorkdays[i].endTime === '') {
              this.$message.error('所有内容均为必填');
              return false;
            }
            if (this.tableWorkdays[i].maxFeesWork != 0) {
              if (Number(this.tableWorkdays[i].maxFeesWork) < Number(this.tableWorkdays[i].firstHourFeesWork) || Number(this.tableWorkdays[i].maxFeesWork) < Number(this.tableWorkdays[i].otherTimeFee)) {
                this.$message.error('封顶价格设置有误，请重新设置');
                return false;
              }
            }
          }
        }
        if (this.tableWeekendFlag != 0) {
          for (var i = 0; i < this.tableWeekends.length; i++) {
            if (this.tableWeekends[i].firstHourFeesWork === '' || this.tableWeekends[i].freeUseTime === '' || this.tableWeekends[i].maxFeesWork === '' || this.tableWeekends[i].otherTimeFee === '' || this.tableWeekends[i].otherTimePeriodWork === '' || this.tableWeekends[i].startPeriod === '' || this.tableWeekends[i].endPeriod === '' || this.tableWeekends[i].startTime === '' || this.tableWeekends[i].endTime === '') {
              this.$message.error('所有内容均为必填');
              return false;
            }
            if (this.tableWeekends[i].maxFeesWork != 0) {
              if (Number(this.tableWeekends[i].maxFeesWork) < Number(this.tableWeekends[i].firstHourFeesWork) || Number(this.tableWeekends[i].maxFeesWork) < Number(this.tableWeekends[i].otherTimeFee)) {
                this.$message.error('封顶价格设置有误，请重新设置');
                return false;
              }
            }
          }
        }

        var len = 0;
        var formData = new FormData();
        if (this.id) formData.append("id", this.id);
        formData.append("name", this.formInline.name);
        formData.append("type", 1);
        formData.append("feeRuleParkings[0].firstHourFee", this.tableWorkday[0].firstHourFeesWork);
        formData.append("feeRuleParkings[0].otherTimePeriod", this.tableWorkday[0].otherTimePeriodWork);
        formData.append("feeRuleParkings[0].otherTimeFee", this.tableWorkday[0].otherTimeFee);
        formData.append("feeRuleParkings[0].maxFee", this.tableWorkday[0].maxFeesWork);
        formData.append("feeRuleParkings[0].freeUseTime", this.tableWorkday[0].freeUseTime);
        formData.append("feeRuleParkings[0].overTimeFee", this.tableWorkday[0].overTimeFeesWork);
        formData.append("feeRuleParkings[0].remark", this.tableWorkday[0].remark);
        formData.append("feeRuleParkings[0].weekday", 1);
        if (this.tableWorkdayFlag != 0) {
          for (var i = 0; i < this.tableWorkdays.length; i++) {
            let flag = this.verificationDay(this.tableWorkdays[i].day)
            if (!flag) {
              this.$message.error('提交日期有误，不能提交数据')
              return
            }
            len = i + 2;
            var num = i + 1;
            formData.append("feeRuleParkings[" + num + "].weekday", 1);
            formData.append("feeRuleParkings[" + num + "].firstHourFee", this.tableWorkdays[i].firstHourFeesWork);
            formData.append("feeRuleParkings[" + num + "].otherTimePeriod", this.tableWorkdays[i].otherTimePeriodWork);
            formData.append("feeRuleParkings[" + num + "].otherTimeFee", this.tableWorkdays[i].otherTimeFee);
            formData.append("feeRuleParkings[" + num + "].maxFee", this.tableWorkdays[i].maxFeesWork);
            formData.append("feeRuleParkings[" + num + "].freeUseTime", this.tableWorkdays[i].freeUseTime);
            formData.append("feeRuleParkings[" + num + "].overTimeFee", this.tableWorkdays[i].overTimeFeesWork);
            formData.append("feeRuleParkings[" + num + "].remark", this.tableWorkdays[i].remark);
            periodStr = this.tableWorkdays[i].startPeriod.split(" ");
            timeStr = this.tableWorkdays[i].startTime.split(" ");
            periodStr[0] = timeStr[0];
            startTime = periodStr[0] + " " + periodStr[1];
            periodStr = this.tableWorkdays[i].endPeriod.split(" ");
            timeStr = this.tableWorkdays[i].endTime.split(" ");
            periodStr[0] = timeStr[0];
            endTime = periodStr[0] + " " + periodStr[1];
            try {
              startTime = new Date(startTime).getTime();
              endTime = new Date(endTime).getTime();
            } catch (e) {
              startTime = startTime;
              endTime = endTime;
            }
            if (String(startTime).length == 13) {
              formData.append("feeRuleParkings[" + num + "].startTime", startTime);
              formData.append("feeRuleParkings[" + num + "].endTime", endTime);
            }
          }
        }
        if (len == 0) {
          len = 1;
        }
        formData.append("feeRuleParkings[" + len + "].firstHourFee", this.tableWeekend[0].firstHourFeesWork);
        formData.append("feeRuleParkings[" + len + "].otherTimePeriod", this.tableWeekend[0].otherTimePeriodWork);
        formData.append("feeRuleParkings[" + len + "].otherTimeFee", this.tableWeekend[0].otherTimeFee);
        formData.append("feeRuleParkings[" + len + "].maxFee", this.tableWeekend[0].maxFeesWork);
        formData.append("feeRuleParkings[" + len + "].freeUseTime", this.tableWeekend[0].freeUseTime);
        formData.append("feeRuleParkings[" + len + "].overTimeFee", this.tableWeekend[0].overTimeFeesWork);
        formData.append("feeRuleParkings[" + len + "].remark", this.tableWeekend[0].remark);
        formData.append("feeRuleParkings[" + len + "].weekday", 0);
        if (this.tableWeekendFlag != 0) {
          len = len + 1;
          for (var i = 0; i < this.tableWeekends.length; i++) {
            let flag = this.verificationDay(this.tableWeekends[i].day)
            if (!flag) {
              this.$message.error('提交日期有误，不能提交数据')
              return
            }
            len = len + i;
            formData.append("feeRuleParkings[" + len + "].weekday", 0);
            formData.append("feeRuleParkings[" + len + "].firstHourFee", this.tableWeekends[i].firstHourFeesWork);
            formData.append("feeRuleParkings[" + len + "].otherTimePeriod", this.tableWeekends[i].otherTimePeriodWork);
            formData.append("feeRuleParkings[" + len + "].otherTimeFee", this.tableWeekends[i].otherTimeFee);
            formData.append("feeRuleParkings[" + len + "].maxFee", this.tableWeekends[i].maxFeesWork);
            formData.append("feeRuleParkings[" + len + "].freeUseTime", this.tableWeekends[i].freeUseTime);
            formData.append("feeRuleParkings[" + len + "].overTimeFee", this.tableWeekends[i].overTimeFeesWork);
            formData.append("feeRuleParkings[" + len + "].remark", this.tableWeekends[i].remark);
            periodStr = this.tableWeekends[i].startPeriod.split(" ");
            timeStr = this.tableWeekends[i].startTime.split(" ");
            periodStr[0] = timeStr[0];
            startTime = periodStr[0] + " " + periodStr[1];
            periodStr = this.tableWeekends[i].endPeriod.split(" ");
            timeStr = this.tableWeekends[i].endTime.split(" ");
            periodStr[0] = timeStr[0];
            endTime = periodStr[0] + " " + periodStr[1];
            try {
              startTime = new Date(startTime).getTime();
              endTime = new Date(endTime).getTime();
            } catch (e) {
              startTime = startTime;
              endTime = endTime;
            }
            if (String(startTime).length == 13) {
              formData.append("feeRuleParkings[" + len + "].startTime", startTime);
              formData.append("feeRuleParkings[" + len + "].endTime", endTime);
            }
          }
        }
        this.submitData(formData);
      }
    },
    submitData(formData) {
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      this.$http.post("fee/rule/add/parking", formData, config).then(res => {
        if (res.data.error_code == 2000) {
          this.$message.success('恭喜你，提交规则成功');
          this.$router.go(-1)
        } else {
          this.$message.error(res.data.error_message);
        }
      }).catch(err => {
        console.log(err)
        this.$message.error("服务器返回了一个错误");
      })
    },
    /**
     * @param  day 通过day判断是否可以提交数据
     * @return flag 表示是否可以添加数据  false 表示不能提交数据
    */
    verificationDay(day) {
      console.log(day)
      let flag = '';
      if (day == '当天' || day == '次日') {
        flag = true
        return flag
      } else {
        return flag = false;
      }
    },
    goReturn() {
      this.$router.go(-1)
    },

    add0(m) { return m < 10 ? '0' + m : m },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    },
  },
}
</script>

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
  height: 60px;
}

.searchStyle {
  height: 50px;
}

.isInfoStyle {
  color: red;
}

.bottomStyle {
  border: 1px solid #ebeef5;
  border-top: none;
  padding: 5px 20px;
  height: 60px;
  line-height: 50px;
  text-align: right;
}

.inputClass {
  width: 90px;
}
</style>
