<template>
  <div class="add-edit-combo">
    <h2 v-if="this.$route.query.model == 'a'">优惠套餐新增</h2>
    <h2 v-else-if="this.$route.query.model == 'b'">优惠套餐编辑</h2>
    <h2 v-else-if="this.$route.query.model == 'x'">优惠套餐详情</h2>
    <br>
    <el-tabs type="border-card">
      <el-tab-pane label="内容设置">
        <el-form ref="form" label-width="100px" label-position="left" :model="formDataParmas">
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
              <el-col :span="4">
                <el-time-picker v-model="item.startTime" value-format="HH:mm:00" placeholder="开始时间" @change="computeMessageInfoE(item,index)">
                </el-time-picker>
              </el-col>
              <el-col :span="4">
                <el-time-picker v-model="item.endTime" value-format="HH:mm:59" placeholder="结束时间" @change="computeMessageInfoE(item,index)">
                </el-time-picker>
              </el-col>
              <el-col :span="4">
                <el-button type="info" v-if="index != 0" @click="removeTimeHHssmmE(0,index)">删除</el-button>
                <el-button type="success" @click="addTimeHHssmmE(0)" v-if="index == everyDay.length -1">新增</el-button>
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
                <el-time-picker v-model="item.startTime" value-format="HH:mm:00" placeholder="开始时间" @change="computeMessageInfoE(item,index)">
                </el-time-picker>
              </el-col>
              <el-col :span="4">
                <el-time-picker v-model="item.endTime" value-format="HH:mm:59" placeholder="结束时间" @change="computeMessageInfoE(item,index)">
                </el-time-picker>
              </el-col>
              <el-col :span="4">
                <el-button type="info" v-if="index != 0" @click="removeTimeHHssmmE(1,index)">删除</el-button>
                <el-button type="success" @click="addTimeHHssmmE(1)" v-if="index == workDay.length -1">新增</el-button>
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
                <el-time-picker v-model="item.startTime" value-format="HH:mm:00" placeholder="开始时间" @change="computeMessageInfoE(item,index)">
                </el-time-picker>
              </el-col>
              <el-col :span="4">
                <el-time-picker v-model="item.endTime" value-format="HH:mm:59" placeholder="结束时间" @change="computeMessageInfoE(item,index)">
                </el-time-picker>
              </el-col>
              <el-col :span="4">
                <el-button type="info" v-if="index != 0" @click="removeTimeHHssmmE(2,index)">删除</el-button>
                <el-button type="success" @click="addTimeHHssmmE(2)" v-if="index == weekDay.length -1">新增</el-button>
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
              <el-col :span="4">
                <el-date-picker v-model="formDataParmas.effectiveBeginTime" value-format="timestamp" type="date" placeholder="开始日期">
                </el-date-picker>
              </el-col>
              <el-col :span="4">
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
        <br>
        <el-button type="primary" @click="goBackE">返回</el-button>
        <el-button type="primary" @click="submitE" v-show="this.$route.query.model != 'x'">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { dispostTime, proofTime, dataValidation } from '../../assets/js/base.js'
import Qs from 'qs';
export default {
  data() {
    return {
      // 维护的数据  type  1   everyDay  [] 每天( switchModel='')  workDay weekDay  [] 每天( switchModel='')
      // effectiveDaytime 有效期  ( '' 表示永久有效   1表示自定义时间 )  后台缺少参数    传0 表示永久有效  1表示自定义时间（effectiveBeginTime， effectiveEndTime） 时间戳
      // ruleType 生效规则 （'' 表示立即生效 传1）
      // toplimit 数量上限  只要录入即可
      // descript 备注  表单
      // 后台接口 
      //  按天计费 传什么字段
      //  天数 怎么传递
      // 费用怎么传递
      // 套餐类型   传1
      // 生效规则 传1
      // packageAmount: 套餐金额
      // realQuantity 表示数量上限
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
      value0: '',
      value2: '',
      day: '次日',
      dayTitle: '天数',
      feeTitle: '金额（元）',
      // 套餐类型
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
      requireParams: {

      },// 提交数据的参数
    }
  },
  created() {
    if (this.$route.query.id != -1) {
      this.viewDetails()
    }
  },
  methods: {
    /**
     * @param  type 表示是每天  还是 周末 工作日新增
    */
    addTimeHHssmmE(type) {
      let data = []
      data.push({
        startTime: '',
        endTime: '',
        messageInfo: '',
        miunte: '',
      })
      if (type == 0) {
        this.everyDay = this.everyDay.concat(data);
      } else if (type == 1) {
        this.workDay = this.workDay.concat(data)
      } else if (type == 2) {
        this.weekDay = this.weekDay.concat(data)
      }
    },
    /**
     * @param type 表示是删除哪个 
     * @param index 表示删除具体的哪个值
    */
    removeTimeHHssmmE(type, index) {
      if (type == 0) {
        this.everyDay.splice(index, 1);
      } else if (type == 1) {
        this.workDay.splice(index, 1);
      } else if (type == 2) {
        this.weekDay.splice(index, 1)
      }
    },
    /**
     * @param  item 表示这一行的数据
     * @param index 表示下标
    */
    computeMessageInfoE(item, index) {
      console.log(item, index)
      dispostTime(item)
    },
    /**
     * @function 这个函数用来处理需要提交的参数
    */
    submitE() {
      let pattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      // 要验证的是 套餐名称 和 套餐描述
      // 套餐类型 传1 
      // 判断时间  
      // startTime: '',
      // endTime: '',
      // messageInfo: '',
      // miunte: '',
      console.log(this.formDataParmas)
      this.requireParams.type = 1; // 类型
      this.requireParams.infoRule = 1; // 生效规则
      this.requireParams.state = 3; // 新增默认是待上架


      this.requireParams.name = this.formDataParmas.name;
      if (!this.formDataParmas.name && !(pattern.test(this.formDataParmas.name))) {
        this.$message.error('*区域名称 仅限输入中文、英文字母、数字。长度上限20个字符');
        return;
      } else {
        this.requireParams.name = this.formDataParmas.name;
      }

      // 对套餐描述
      if (this.formDataParmas.descript) {
        if (!(pattern.test(this.formDataParmas.descript))) {
          this.$message.error('套餐描述 仅限输入中文、英文字母、数字。长度上限100个字符');
          return;
        } else {
          this.requireParams.descript = this.formDataParmas.descript
        }
      } else {
        this.requireParams.descript = this.formDataParmas.descript
      }
      // 数量上限
      if (!this.formDataParmas.toplimit || this.formDataParmas.toplimit[0] == 0) {
        this.$message.error('*数量上限字段不能为空')
        return;
      } else {
        this.requireParams.toplimit = this.formDataParmas.toplimit
      }

      // 确定停车时间段  每天everyDay   工作日/周末  workDay  weekDay
      if (this.formDataParmas.ruleType == '1') {
        let params = proofTime(this.everyDay)
        if (!params.flag) {
          this.$message.error('当前停车时段有误，请重新确认是否满足提交的条件');
          return;
        } else {
          this.requireParams.everyDay = params.arr;
          this.requireParams.ruleType = 1;
          this.$set(this.formDataParmas, 'everyDay', params.arr)
        }
      } else if (this.formDataParmas.ruleType == '2') {
        let workparams = proofTime(this.workDay)
        if (!workparams.flag) {
          this.$message.error('当前停车时段有误，请重新确认是否满足提交的条件');
          return;
        } else {
          this.requireParams.workDay = workparams.arr;
          this.requireParams.ruleType = 2;
          this.$set(this.formDataParmas, 'workDay', workparams.arr)
        }
        // 周末校验
        let weekparams = proofTime(this.weekDay)
        if (!weekparams.flag) {
          this.$message.error('当前停车时段有误，请重新确认是否满足提交的条件');
          return;
        } else {
          this.requireParams.ruleType = 2;
          this.requireParams.weekDay = weekparams.arr;
          this.$set(this.formDataParmas, 'weekDay', weekparams.arr)
        }
      }
      // 确定 套餐有效期  effectiveDaytime（0） 表示 永久有效   （1）表示自定义日期
      if (this.formDataParmas.effectiveDaytime == '0') {
        // 表示要变成0
        this.requireParams.effectiveDaytime = 0
      } else if (this.formDataParmas.effectiveDaytime == '1') {
        if (!this.formDataParmas.effectiveBeginTime || !this.formDataParmas.effectiveEndTime) {
          this.$message.error('套餐有效期错误（开始时间和结束时间不能为空）');
          return;
        } else if (this.formDataParmas.effectiveBeginTime > this.formDataParmas.effectiveEndTime) {
          this.$message.error('套餐有效期错误（开始时间<=结束时间）');
          return;
        } else {
          this.requireParams.effectiveDaytime = 1;
          this.requireParams.effectiveBeginTime = this.formDataParmas.effectiveBeginTime;
          this.requireParams.effectiveEndTime = this.formDataParmas.effectiveEndTime;
        }
      }
      // 在编辑的时候确定修改的套餐上限是否大于已有的数量
      if (this.$route.query.model == 'b') {
        if (this.formDataParmas.toplimit < this.formDataParmas.realQuantity) {
          this.$message.error('新编辑的数量上限需大于等于有效车牌号数量')
          return;
        }
      }
      // 套餐规则 packageAmount
      // 天数   需属于大于等于1的整数；  金额：需属于大于等于0的整数；
      let validation_params = dataValidation(this.formDataParmas.day, this.formDataParmas.fee)
      if (!validation_params.flag) {
        this.$message.error(validation_params.packageAmount)
        return;
      } else {
        this.requireParams.packageAmount = validation_params.packageAmount
      }
      console.log(this.requireParams)
      // 新增数据的接口
      this.backendInterface()
    },
    /**
     * @function 这个是新增或者编辑后向后台提交数据
    */
    backendInterface() {
      // 这里在编辑的时候要处理这个参数， 新增的时候传0 
      if (this.$route.query.model == 'a') {
        this.requireParams.realQuantity = '0'
      } else {
        this.requireParams.realQuantity = this.formDataParmas.realQuantity;
        this.requireParams.id = this.$route.query.id
      }
      this.$http.post('discountpackage/saveOrUpdate', Qs.stringify(this.requireParams))
        .then((res) => {
          console.log(res)
          if (res.data.error_code === 2000) {
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.error_message)
          }
        })
        .catch((err) => {
          this.$message.error('后台接口报错，请联系开发人员，谢谢！！！')
        })
    },
    /**
     * @function 用来返回上一级的函数
    */
    goBackE() {
      this.$router.go(-1)
    },
    /**
     * @function 这个是用来查看详情和编辑时要使用的接口
     * @param id 表示套餐ID
    */
    viewDetails() {
      this.$http.post('discountpackage/findDetailed', Qs.stringify({ id: this.$route.query.id }))
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
    }
  },
}
</script>

<style scoped>
.add-edit-combo .title-message {
  line-height: 40px;
  margin-left: 50px;
  color: red;
}
</style>


