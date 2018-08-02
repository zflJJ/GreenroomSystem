<template>
  <div>
    <h2>{{title}}</h2>
    <br>
    <div
      v-loading="loading2"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="*活动名称">
              <el-input v-model="form.name" :maxlength="20" @blur="txtValid(form.name)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="*活动类型">
              <el-select v-model="form.type" @change="typeChange" :disabled="show">
                <el-option label="邀请" value="1"></el-option>
                <el-option label="注册" value="2"></el-option>
                <el-option label="首次下单" value="3"></el-option>
                <el-option label="绑车牌" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动描述">
              <el-input
                :maxlength="100"
                type="textarea"
                autosize
                placeholder="请输入内容"
                v-model="form.intro"
                @blur="txtValid(form.intro)"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="Banner(长图)" class='myUpload'>
              <input type='file' @change="handleChange1" ref="upload1">
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="5">
            <img :src="imgSrc1">
          </el-col>
          <el-col :span="4">
            <el-button type="danger" size="small" @click='removeImg1' :disabled="show">删除图片</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="Banner(宽图)" class='myUpload'>
              <input type='file' @change="handleChange2" ref="upload2">
            </el-form-item>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="5">
            <img :src="imgSrc2">
          </el-col>
          <el-col :span="4">
            <el-button type="danger" size="small" @click='removeImg2' :disabled="show">删除图片</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动链接">
              <el-input v-model="form.href"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <template>
          <div class="block">
            <span class="demonstration">*活动时间 </span>
            <el-date-picker
              :disabled="show"
              v-model="value6"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="endTimeChange">
            </el-date-picker>
          </div>
        </template>
        <br>
        <h3 v-if="form.type==1">邀请设置</h3>
        <el-form v-if="form.type==1||form.type=='邀请'" :model="activityForm" ref="activityForm" label-width="100px"
                 class="demo-dynamic">
          <el-form-item
            v-for="(ruleData, index) in activityForm.ruleDatas"
            :label="'活动规则'+indexes[index]"
            :prop="'ruleDatas.' + index + '.value'"
            :key="ruleData.key">
            <el-button type="danger" @click.prevent="removeRule(ruleData)" :disabled="show">删除规则</el-button>
            <el-button type="success" @click="addRule" v-if="index==activityForm.ruleDatas.length-1" :disabled="show">
              新增规则
            </el-button>
            <br>
            <br>
            *被邀请者需完成
            <el-select v-model="ruleData.triggerType" multiple placeholder="请选择触发条件" :disabled="show">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <br>
            被邀请者奖励
            <el-table :data="ruleData.dataItems" border style="width: 100%">
              <el-table-column label="奖励物品">
                <template slot-scope="scope">
                  <el-select v-model="ruleData.dataItems[scope.$index].prizeId" placeholder="请选择"
                             @visible-change="visibleChange" :disabled="show">
                    <el-option
                      v-for="item in goodSelect"
                      :key="item.id"
                      :label="item.prizeName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="奖励数量">
                <template slot-scope="scope">
                  <el-input v-model="ruleData.dataItems[scope.$index].prizeNumber" placeholder="请输入奖励数量" :maxlength=3
                            @change="inputChange(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="removeDataItems(scope.$index, index)" :disabled="show">删除</el-button>
                  <el-button @click="addDataItems(index)" v-if="scope.$index==ruleData.dataItems.length-1"
                             :disabled="show">添加
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <br>
            *邀请者奖励
            <el-button @click="addDataTablesLadder(index)" :disabled="show">添加阶梯</el-button>
            <div v-for="(item,dataTablesindex) in ruleData.dataTables">
              <el-table
                :data="ruleData.dataTables[dataTablesindex]"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
                <el-table-column
                  prop="ladderStep"
                  label="阶梯">
                </el-table-column>
                <el-table-column
                  label="邀请数量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.inviteNumber" placeholder="请输入邀请数量" :maxlength=3
                              @change="inputChange(scope.row)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  pro="prizeId"
                  label="奖励物品">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.prizeId" placeholder="请选择" @visible-change="visibleChange"
                               :disabled="show">
                      <el-option
                        v-for="item in goodSelect"
                        :key="item.id"
                        :label="item.prizeName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  label="奖励数量">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.prizeNumber" placeholder="请输入奖励数量"
                              @change="inputChange(scope.row)"  :maxlength=3></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="operation">
                  <template slot-scope="scope">
                    <el-button @click="removeDataTable(scope.$index, index,dataTablesindex)" :disabled="show">删除
                    </el-button>
                    <el-button @click="addDataTable(index,scope.$index,dataTablesindex)"
                               v-if="scope.$index == ruleData.dataTables[dataTablesindex].length-1" :disabled="show">添加
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <br>
            *计算类型
            <el-select v-model="ruleData.type" placeholder="请选择" :disabled="show">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <template>
            邀请者（用户）标签包含：
            <el-select v-model="value5" multiple placeholder="请选择" @change="tagChange1" :disabled="show">
              <el-option
                v-for="item in tagOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <br>
            <br>
            邀请者（用户）标签不包含：
            <el-select v-model="value7" multiple placeholder="请选择" @change="tagChange2" :disabled="show">
              <el-option
                v-for="item in tagOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form>
        <br>
        <br>
        <div v-if="form.type==2||form.type==3||form.type==4||form.type=='注册'||form.type=='首次下单'||form.type=='绑车牌'">
          *参与用户需完成
          <el-select v-model="triggerType" multiple placeholder="请选择触发条件" :disabled="show">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <br>
          *参与用户奖励
          <el-table :data="userRewards" border style="width: 100%">
            <el-table-column label="奖励物品">
              <template slot-scope="scope">
                <el-select v-model="scope.row.prizeId" placeholder="请选择" @visible-change="visibleChange" :disabled="show">
                  <el-option
                    v-for="item in goodSelect"
                    :key="item.id"
                    :label="item.prizeName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="奖励数量">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.prizeNumber" placeholder="请输入奖励数量" :maxlength=3
                          @change="inputChange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="removeuserRewards(scope.$index)" :disabled="show">删除</el-button>
                <el-button @click="adduserRewards" v-if="scope.$index==userRewards.length-1" :disabled="show">添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item>
          <el-button @click="returnGo">返回</el-button>
          <el-button type="primary" @click="onSubmitBtn" :disabled="show">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  img {
    max-width: 100%;
    height: 100px;
    margin: 10px 20px;
  }

  .img_list .img-div {
    width: 100px;
    height: 200px;
    float: left;
    overflow: hidden;
    text-align: center;
  }

  .upload {
    position: relative;
  }

  .upload input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 10px;
    height: 100px;
    width: 100px;
  }

  .upload .upload_box {
    width: 100px;
    height: 100px;
    background-color: #beeaff;
    color: #000000;
  }

  .img-div p {
    color: #28a4b0;
    margin: 0;
  }
</style>

<script>
  import Qs from 'qs';
  export default {
    data() {
      return {
        title: this.$route.query.title,
        id: this.$route.query.id,
        show: this.$route.query.title == "查看活动" ? true : false,
        fileLongId: null,
        fileWideId: null,
        activityForm: {  //
          ruleDatas: [{
            dataItems: [{//被邀请者奖励表格
              prizeId: '',
              prizeNumber: '',
            }],
            dataTables: [[{//邀请者奖励表格
              ladderStep: "1",//阶梯
              inviteNumber: "",//邀请数量
              prizeId: '',
              prizeNumber: "",
            }]],
            triggerType: [],//被邀请需要完成 触发条件
            type: "",//活动规则计算类型
          }],
        },
        form: {
          name: '',
          type: '1',
          intro: '',
          beginTime: '',
          endTime: '',
          href: '',
          state: '1',
        },
        imgSrc1: '',
        imgSrc2: '',
        imgFlag: true,//判断图片格式
        imgSrc1Falg:false,//判断是否提交
        imgSrc2Falg:false,
        value6: [],
        //被邀请需要完成的选择器
        options: [{
          value: '1',
          label: '注册'
        }, {
          value: '2',
          label: '绑车牌'
        }, {
          value: '3',
          label: '支付'
        }],
        //活动规则计算类型
        typeOptions: [{
          value: '0',
          label: '请选择'
        }, {
          value: '1',
          label: '一次'
        }, {
          value: '2',
          label: '重复'
        }],
        //奖励物品
        goodSelect: [],
        ladderStep: 1,
        len: 1,
        triggerType: [],
        userRewards: [{// 参与者奖励表格
          prizeId: '',      // 奖品Id
          prizeNumber: '',  // 奖励数量
        }],
        value5: [],
        value7: [],
        tagOptions: [],
        typeFlag: null,//活动类型的值
        indexes:[],
        loading2:false,
        regFlag:true,
        endTimeFlag:null,
      }
    },
    created(){
      this.getTagData();
      this.getData();
      this.getIndexes();
    },
    watch:{
      activityForm:{
        //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
        handler(curVal,oldVal){
          this.getIndexes();
        },
        deep:true
      },
    },
    methods: {
      getIndexes(){
        this.indexes = [];
        var temp = null;
        for(var i = 0 ; i < this.activityForm.ruleDatas.length; i++){
          temp = 1 + i;
          this.indexes.push(temp);
        }
      },
      //编辑 详情时获取数据
      getData(){

        if (!this.id) return false;
        this.$http.get("activity/detail?id=" + this.id).then(res => {
          if (res.data.error_code == 2000) {
          var data = res.data.data;
//            console.log(data)
          this.form.name = data.name;
          try {
            this.form.type = data.type;
            this.typeFlag = data.type;
            if (this.form.type == 1) {
              this.form.type = "邀请"
            } else if (this.form.type == 2) {
              this.form.type = "注册"
            } else if (this.form.type == 3) {
              this.form.type = "首次下单"
            } else if (this.form.type == 4) {
              this.form.type = "绑车牌"
            }
          } catch (e) {
          }
          this.form.intro = data.intro;
          this.form.href = data.href;
          this.imgSrc1 = data.fileLongPath;
          this.imgSrc2 = data.fileWidePath;
          this.fileWideId = data.fileWideId;
          this.fileLongId = data.fileLongId;
          this.value6 = [data.beginTime, data.endTime];
          this.endTimeFlag = false;
          this.endTimeChange(this.value6);

          if (this.form.type == 1 || this.form.type == "邀请") {
            //标签
            for (var i = 0; i < data.activityTagBs.length; i++) {
              if (data.activityTagBs[i].type == 1) {
                this.value5.push(data.activityTagBs[i].tagId)
              } else {
                this.value7.push(data.activityTagBs[i].tagId)
              }
            }
            for (var i = 0; i < data.activityRules.length; i++) {
              if (data.activityRules[i].type == 1) {
                this.activityForm.ruleDatas[i].type = "一次"
              } else if (data.activityRules[i].type == 2) {
                this.activityForm.ruleDatas[i].type = "重复"
              }else {
                this.activityForm.ruleDatas[i].type = data.activityRules[i].type;
              }
              for (var j = 0; j < data.activityRules[i].triggers.length; j++) {//被邀请者需要完成
                // if (data.activityRules[i].triggers[j].triggerType == 1) {
                //   this.activityForm.ruleDatas[i].triggerType.push("注册");
                // } else if (data.activityRules[i].triggers[j].triggerType == 2) {
                //   this.activityForm.ruleDatas[i].triggerType.push("绑车牌");
                // } else if (data.activityRules[i].triggers[j].triggerType == 3) {
                //   this.activityForm.ruleDatas[i].triggerType.push("支付");
                // }else {
                  this.activityForm.ruleDatas[i].triggerType.push(String(data.activityRules[i].triggers[j].triggerType));
                // }
              }
              var temp = 0;
              var dataTablesFlag = false;
              for (var b = 0; b < data.activityRules[i].ladders.length; b++) {
                if (data.activityRules[i].ladders[b].type == 2) {
                  dataTablesFlag = true;
                  for (var v = 0; v < data.activityRules[i].ladders[b].prizes.length; v++) {
                    this.activityForm.ruleDatas[i].dataItems.push({
                      prizeId: data.activityRules[i].ladders[b].prizes[v].prizeId,
                      prizeNumber: data.activityRules[i].ladders[b].prizes[v].prizeNumber,
                    })
                  }
                } else {
                  var ladderStep = 1;
                  var inviteNumber = data.activityRules[i].ladders[b].inviteNumber;
                  if (ladderStep != data.activityRules[i].ladders[b].ladderStep) {
                    ladderStep = data.activityRules[i].ladders[b].ladderStep;
                    temp = temp + 1;
                    this.activityForm.ruleDatas[i].dataTables[temp] = [];
                  }
                  ladderStep = data.activityRules[i].ladders[b].ladderStep;
                  for (var f = 0; f < data.activityRules[i].ladders[b].prizes.length; f++) {
                    this.activityForm.ruleDatas[i].dataTables[temp].push({
                      prizeId: data.activityRules[i].ladders[b].prizes[f].prizeId,
                      prizeNumber: data.activityRules[i].ladders[b].prizes[f].prizeNumber,
                      ladderStep: ladderStep,
                      inviteNumber: inviteNumber,
                    })
                  }
                }
              }
              //删除调初始化的数据,如果不删会有一条空数据显示
              if(dataTablesFlag) this.activityForm.ruleDatas[i].dataItems.splice(0, 1);
              this.activityForm.ruleDatas[i].dataTables[0].splice(0, 1);
            }
            for (var i = 0; i < this.activityForm.ruleDatas.length; i++) {
              for (var j = 0; j < this.activityForm.ruleDatas[i].dataTables.length; j++) {
                this.len = this.activityForm.ruleDatas[i].dataTables[j].length;
              }
            }
          } else {
            //非邀请的活动类型
            data = data.activityRules[0];
            for (var i = 0; i < data.triggers.length; i++) {
              // if (data.triggers[i].triggerType == 1) {
              //   this.triggerType.push("注册")
              // } else if (data.triggers[i].triggerType == 2) {
              //   this.triggerType.push("绑车牌")
              // } else if (data.triggers[i].triggerType == 3) {
              //   this.triggerType.push("支付")
              // }else {
                this.triggerType.push(String(data.triggers[i].triggerType))
              // }
            }
            for(var j = 0; j < data.ladders[0].prizes.length; j++){
              this.userRewards.push({
                prizeId: data.ladders[0].prizes[j].prizeId,
                prizeNumber:data.ladders[0].prizes[j].prizeNumber,
              })
            }
            this.userRewards.splice(0,1)
          }
          this.getIndexes();
        } else {
          this.$message.error(res.data.error_message)
        }
      })
      },

      //删除规则
      removeRule(item) {
        if (this.activityForm.ruleDatas.length == 1) return false;
        var index = this.activityForm.ruleDatas.indexOf(item)
        if (index !== -1) {
          this.activityForm.ruleDatas.splice(index, 1)
        }
      },
      //新增规则
      addRule() {
        this.activityForm.ruleDatas.push({
          key: Date.now(),
          dataItems: [{//被邀请者奖励表格
            prizeId: '',
            prizeNumber: '',
          }],
          dataTables: [[{//邀请者奖励表格
            ladderStep: "1",//阶梯
            inviteNumber: "",//邀请数量
            prizeId: '',    //奖品ID
            prizeNumber: "",//奖品数量
          }]],
          triggerType: [],//被邀请需要完成 触发条件
          type: "",//活动规则计算类型
        });
      },
      //新增被邀请者奖励一列
      addDataItems(index){
        //index  属于哪个规则的索引
        this.activityForm.ruleDatas[index].dataItems.push({
          prizeId: '',
          prizeNumber: '',
        })
      },
      //删除被邀请者奖励一列
      removeDataItems(index, row){
        //index 在被邀请者奖励的索引   index 在被邀请者奖励的索引
        if (this.activityForm.ruleDatas[row].dataItems.length == 1) return false;
        if (index !== -1) {
          this.activityForm.ruleDatas[row].dataItems.splice(index, 1)
        }
      },
      //新增邀请者奖励一列
      addDataTable(index, row, dataTablesindex){
//        //index  属于哪个规则的索引  row 那一列 dataTablesindex第几个邀请者奖励表格
        var len = this.activityForm.ruleDatas[index].dataTables[dataTablesindex].length - 1;
        var ladderStep = Number(dataTablesindex) + 1;
        var inviteNumber = this.activityForm.ruleDatas[index].dataTables[dataTablesindex][len].inviteNumber;

        this.activityForm.ruleDatas[index].dataTables[dataTablesindex].splice(row + 1, 0, {
          ladderStep: ladderStep,
          inviteNumber: inviteNumber,
          prizeId: '',
          prizeNumber: '',
        })
        this.len = this.activityForm.ruleDatas[index].dataTables[dataTablesindex].length;
        var arr = [];
        for(var i = 0; i < this.activityForm.ruleDatas[row].dataTables.length ; i++){
          arr.push(this.activityForm.ruleDatas[row].dataTables[i].length)
        }
        var max = arr[0];
        for (var i = 0; i < arr.length - 1; i++) {
          max = max < arr[i+1] ? arr[i+1] : max
        }
        this.len = max;
      },
      //删除邀请者奖励一列
      removeDataTable(index, row, dataTablesindex){
        //index 在邀请者奖励的索引   index 在邀请者奖励的索引
        if (this.activityForm.ruleDatas[row].dataTables.length == 1 && this.activityForm.ruleDatas[row].dataTables[dataTablesindex].length == 1)return false;
        if (index !== -1) {
          this.activityForm.ruleDatas[row].dataTables[dataTablesindex].splice(index, 1);
        }
        //邀请者奖励表格的长度
        this.len = this.activityForm.ruleDatas[row].dataTables[dataTablesindex].length;
        console.log(this.len)
        if (this.len == 0 || this.len < 0) {
          this.activityForm.ruleDatas[row].dataTables.splice(dataTablesindex, 1);
          try{
            this.len = this.activityForm.ruleDatas[row].dataTables[dataTablesindex-1].length;
          }catch (e){
            this.len = this.activityForm.ruleDatas[row].dataTables[0].length;
          }
        }
        var arr = [];
        for(var i = 0; i < this.activityForm.ruleDatas[row].dataTables.length ; i++){
            arr.push(this.activityForm.ruleDatas[row].dataTables[i].length)
        }
        var max = arr[0];
        for (var i = 0; i < arr.length - 1; i++) {
          max = max < arr[i+1] ? arr[i+1] : max
        }
        this.len = max;
        this.ladderStepChange(row);
        this.$forceUpdate();//强制更新视图
      },
      //添加邀请者奖励阶梯
      addDataTablesLadder(index){
        //index  属于哪个规则的索引
        this.activityForm.ruleDatas[index].dataTables.push([{
          ladderStep: this.ladderStep,
          inviteNumber: "",
          prizeId: '',
          prizeNumber: '',
        }])
        this.ladderStepChange(index);
        this.$forceUpdate();//强制更新视图
      },
      //当删除邀请者奖励一列,添加邀请者奖励阶梯  改变阶梯
      ladderStepChange(index){
        var data = this.activityForm.ruleDatas[index].dataTables
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            data[i][j].ladderStep = Number(i) + Number(1);
          }
        }
      },
      //根据活动的截止时间改变奖励物品
      endTimeChange(val){
        var endTime = val[1],
          startTime = val[0];
        try {
          endTime = endTime.getTime();
          startTime = startTime.getTime();
        } catch (e) {
          endTime = endTime;
          startTime = startTime;
        }
        this.$http.get("activity/prize/all?endTime=" + endTime + "&startTime=" + startTime ).then(res => {
          if (res.data.error_code == 2000) {
          this.goodSelect = res.data.data;
          if(!this.endTimeFlag) {
            this.endTimeFlag = true;
            return false;
          }
          if(this.userRewards[0].prizeId){
            for(var i = 0; i < this.userRewards.length; i++) {
              this.userRewards[i].prizeId = "";
            }
          }
          var dataItems = [];//被邀请者奖励表格
          var dataTables = [];//邀请者奖励表格
          for(var i = 0 ; i < this.activityForm.ruleDatas.length; i++){
            dataItems = this.activityForm.ruleDatas[i].dataItems
            dataTables = this.activityForm.ruleDatas[i].dataTables
            if(dataItems[0].prizeId){
              for(var j = 0;j < dataItems.length; j++){
                dataItems[i].prizeId = ""
              }
            }
            if(dataTables[0][0].prizeId){
              for(var j = 0;j < dataTables.length; j++){
                for(var v = 0; v < dataTables[j].length; v++){
                  dataTables[j][v].prizeId = "";
                }
              }
            }

          }
        } else {
          this.$message.error(res.data.error_message)
        }

      }).catch(err => {
          this.$message.error(err);
      })
      },
      //控制邀请者表格的合并状态
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0 || columnIndex == 1) {
          if (rowIndex % this.len === 0) {
            return {
              rowspan: this.len,
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
      //参与用户需要完成----
      //删除参与用户奖励一列
      removeuserRewards(index){
        if (this.userRewards.length == 1) {
          this.$message.error('请填入所有必填项');
          return false;
        }
        this.userRewards.splice(index, 1);
      },
      //新增参与用户奖励一列
      adduserRewards(){
        this.userRewards.push({
          prizeId: '',
          prizeNumber: '',
        })
      },
      //活动类型切换清空数据
      typeChange(){
        this.triggerType = [];
        this.userRewards = [{
          prizeId: '',
          prizeNumber: '',
        }];
        //邀请类型的数据清空
        this.activityForm = {
          ruleDatas: [{
            value: '',
            dataItems: [{//被邀请者奖励表格
              prizeId: '',
              prizeNumber: '',
            }],
            dataTables: [[{//邀请者奖励表格
              ladderStep: "1",//阶梯
              inviteNumber: "",//邀请数量
              prizeId: '',
              prizeNumber: "",
            }]],
          }],
        }
      },
      //奖励物品下拉框在没有选择活动时间时触发
      visibleChange(val){
        if (this.value6.length == 0 && val == true) {
          this.$message.error('请先填写活动时间，再选择奖品');
        }
      },
      //奖励数量输入框改变时触发
      inputChange(row){
        var number = /^\d+$/;//整数正则
        try {
          if (!number.test(row.prizeNumber)) {
            row.prizeNumber = "";
          }
          if (!number.test(row.inviteNumber)) {
            row.inviteNumber = "";
          }
        } catch (e) {
        }
      },
      //获取所有标签
      getTagData(){
        this.$http.post("tag/all").then(res => {
          if (res.data.error_code == 2000) {
          this.tagOptions = res.data.data;
          } else {
            this.$message.error(res.data.error_message)
          }
        })
      },
      //标签只能选择一个,清空另一个
      tagChange1(val){
        this.value7 = [];
      },
      tagChange2(val){
        this.value5 = [];
      },
      /* 活动名称、活动描述不能输入特殊字符 */
      txtValid(val){
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;='[\]]/im,
          regCn = /[·！#￥（——）：-；“”‘、，|《。》？、【】[\]]/im,
          title='';
        switch (val){
          case this.form.name:
            title = "活动名称";
            break;
          case this.form.intro:
            title="活动描述";
            break;
        }
        if(regEn.test(val) || regCn.test(val) ){
          this.$message.error(title + '不能输入特殊字符');
          this.regFlag = false;
          return false;
        }else{
          this.regFlag = true;
          return true;
        }
      },

      handleChange1(e){
        const elInput = this.$refs.upload1
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc1 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          var type = elInput.files[0].type;
          if (type != "image/jpeg" && type != "image/png" && type != "image/gif") {
            this.$message.error('错了哦，仅支持PNG/JPG/GIF');
            this.imgFlag = false;
          } else {
            this.imgFlag = true;
            this.imgSrc1Falg = true;
          }
        }
      },
      removeImg1(){
        this.imgSrc1 = "";
        this.$refs.upload1.value = '';
        this.imgSrc1Falg = true;
      },
      handleChange2(e){
        const elInput = this.$refs.upload2
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          this.imgSrc2 = src;
        };
        if (elInput.files && elInput.files[0]) {
          reader.readAsDataURL(elInput.files[0]);
          var type = elInput.files[0].type;
          if (type != "image/jpeg" && type != "image/png" && type != "image/gif") {
            this.$message.error('错了哦，仅支持PNG/JPG/GIF');
            this.imgFlag = false;
          } else {
            this.imgFlag = true;
            this.imgSrc2Falg = true;
          }
        }
      },
      removeImg2(){
        this.imgSrc2 = "";
        this.$refs.upload2.value = '';
        this.imgSrc2Falg = true;
      },

      onSubmitBtn() {
        try {
          var beginTime = this.value6[0].getTime();
          var endTime = this.value6[1].getTime();
        } catch (e) {
          var beginTime = this.value6[0];
          var endTime = this.value6[1];
        }
        var g = /^-?[1-9]+[0-9]*$/;
        if (this.form.name == "") {
          this.$message.error('请填入所有必填项');
          return false;
        } else if (this.form.type == "") {
          this.$message.error('请填入所有必填项');
          return false;
        } else if (!this.value6) {
          this.$message.error('请填入所有必填项');
          return false;
        } else if (beginTime == endTime || beginTime > endTime) {
          this.$message.error('请选择正确的活动时间');
          return false;
        } else if (this.imgFlag == false) {
          this.$message.error('图片格式错误');
          return false;
        } else if (this.form.type == 1 || this.form.type=="邀请") {
          var data = this.activityForm.ruleDatas;
          for (var i = 0; i < data.length; i++) {
            if (data[i].triggerType.length == 0) {//被邀请者需要完成
              this.$message.error('请填入所有必填项');
              return false;
            } else if (data[i].type == "" || data[i].type == 0) {//计算类型
              this.$message.error('请填入所有必填项');
              return false;
            } else {
              var inviteNumber = [];//规则内的邀请数量
              var prizeId = [];//阶梯内的奖品
              for (var j = 0; j < data[i].dataItems.length; j++) {
                if(data[i].dataItems[j].prizeId != ""){
                  prizeId.push(data[i].dataItems[j].prizeId)
                  if(!g.test(data[i].dataItems[j].prizeNumber)){
                    this.$message.error('填入数据格式错误');
                    return false;
                  }
                }
                if(data[i].dataItems[j].prizeId == "" && data[i].dataItems[j].prizeNumber != ""){
                  this.$message.error('填入数据格式错误');
                  return false;
                }
              }
              var temp = this.unique(prizeId);
              if (temp == 1) {
                this.$message.error('存在相同的奖品，请重新设置');
                return false;
              }
              inviteNumber = [];
              for (var h = 0; h < data[i].dataTables.length; h++) {
                inviteNumber.push(data[i].dataTables[h][0].inviteNumber);
                prizeId = [];
                for (var b = 0; b < data[i].dataTables[h].length; b++) {
                  prizeId.push(data[i].dataTables[h][b].prizeId);
                  if (!data[i].dataTables[h][b].inviteNumber || data[i].dataTables[h][b].prizeId=="" || !data[i].dataTables[h][b].prizeNumber) {
                    this.$message.error('请填入所有必填项');
                    return false;
                  }
                  if(!g.test(data[i].dataTables[h][b].prizeNumber)){
                    this.$message.error('填入数据格式错误');
                    return false;
                  }
                }
                var temp = this.unique(prizeId);
                if (temp == 1) {
                  this.$message.error('存在相同的奖品，请重新设置');
                  return false;
                }
              }
              var temp = this.unique(inviteNumber);
              if (temp == 1) {
                this.$message.error('邀请数量重复，请重新设置');
                return false;
              }

            }
          }
          if(this.txtValid(this.form.name)){
            if(this.form.intro !=""){
              if(this.txtValid(this.form.intro)){
                this.submit(1);
                return false;
              }
            }
            this.submit(1);
          }
        } else {
          if (this.triggerType.length == 0) {
            this.$message.error('请填入所有必填项');
            return false;
          } else {
            for (var i = 0; i < this.userRewards.length; i++) {
              if (this.userRewards[i].prizeId =="" || this.userRewards[i].prizeNumber == "") {
                this.$message.error('请填入所有必填项');
                return false;
              }
              if(!g.test(this.userRewards[i].prizeNumber)){
                this.$message.error('填入数据格式错误');
                return false;
              }
            }
          }
          if(this.txtValid(this.form.name)){
            if(this.form.intro !=""){
              if(this.txtValid(this.form.intro)){
                this.submit(2);
                return false;
              }
            }
            this.submit(2);
          }

        }
      },
      //提交
      submit(num){
        if(!this.regFlag)return false;
        this.loading2 = true;
        var formData = new FormData();
        formData.append("name", this.form.name)
        if (this.form.intro) formData.append("intro", this.form.intro);
        if (this.form.href) formData.append("href", this.form.href);
        if (this.imgSrc1&&this.$refs.upload1.files[0]) formData.append("fileLong", this.$refs.upload1.files[0])
        if (this.imgSrc2&&this.$refs.upload2.files[0]) formData.append("fileWide", this.$refs.upload2.files[0])
        if (this.imgSrc2Falg&&this.fileWideId) formData.append("fileWideId", this.fileWideId)
        if (this.imgSrc1Falg&&this.fileLongId) formData.append("fileLongId", this.fileLongId)
        if (this.id) formData.append("id", this.id)
        try {
          formData.append("beginTime", this.value6[0].getTime())
          formData.append("endTime", this.value6[1].getTime())
        } catch (e) {
          formData.append("beginTime", this.value6[0])
          formData.append("endTime", this.value6[1])
        }
        if (!this.id) {
          formData.append("type", this.form.type)
        } else {
          if (this.form.type == "邀请") {
            formData.append("type", 1)
          } else if (this.form.type == "注册") {
            formData.append("type", 2)
          } else if (this.form.type == "首次下单") {
            formData.append("type", 3)
          } else if (this.form.type == "绑车牌") {
            formData.append("type", 4)
          } else {
            formData.append("type", this.form.type)
          }
        }
        if (num == 1) {
          //添加数据
          var num = null;
          var data = this.activityForm.ruleDatas;
          var triggerType = [];
          for (var i = 0; i < data.length; i++) {
            if (data[i].type == "一次") {
              formData.append("activityRules[" + i + "].type", 1);
            } else if (data[i].type == "重复") {
              formData.append("activityRules[" + i + "].type", 2);
            } else {
              formData.append("activityRules[" + i + "].type", data[i].type);//计算类型
            }
            for (var j = 0; j < data[i].triggerType.length; j++) {
              if (data[i].triggerType[j] == "注册") {
                formData.append("activityRules[" + i + "].triggers[" + j + "].triggerType", 1);
                triggerType.push(1);
              } else if (data[i].triggerType[j] == "绑车牌") {
                formData.append("activityRules[" + i + "].triggers[" + j + "].triggerType", 2);
                triggerType.push(2);
              } else if (data[i].triggerType[j] == "支付") {
                formData.append("activityRules[" + i + "].triggers[" + j + "].triggerType", 3);
                triggerType.push(3);
              } else {
                formData.append("activityRules[" + i + "].triggers[" + j + "].triggerType", data[i].triggerType[j]);//被邀请者需完成
                triggerType.push(Number(data[i].triggerType[j]));
              }
            }
            var temp = this.unique(triggerType);
            if (temp == 1) {
              this.$message.error("不同规则间不能含有相同的触发条件");
              this.loading2 = false;
              return false;
            }
            if(data[i].dataItems[0].prizeId){
              formData.append("activityRules[" + i + "].ladders[0].type", 2);//阶梯类型 被邀请
              for (var b = 0; b < data[i].dataItems.length; b++) {
                formData.append("activityRules[" + i + "].ladders[0].prizes[" + b + "].prizeId", data[i].dataItems[b].prizeId);//被邀请者奖品ID和数量
                formData.append("activityRules[" + i + "].ladders[0].prizes[" + b + "].prizeNumber", data[i].dataItems[b].prizeNumber);//被邀请者奖品ID和数量
              }
            }

            var ladderStep = 1;
            for (var v = 0; v < data[i].dataTables.length; v++) {
              if(data[i].dataTables[0][0].prizeId&&data[i].dataItems[0].prizeId) {
                num = v + 1;
              }else if(data[i].dataTables[0][0].prizeId&&!data[i].dataItems[0].prizeId){
                num = v;
              }
              formData.append("activityRules[" + i + "].ladders[" + num + "].type", 1);//阶梯类型 邀请
              formData.append("activityRules[" + i + "].ladders[" + num + "].ladderStep", ladderStep);//邀请者阶梯
              formData.append("activityRules[" + i + "].ladders[" + num + "].inviteNumber", data[i].dataTables[v][0].inviteNumber);//邀请数量
              for (var h = 0; h < data[i].dataTables[v].length; h++) {
                formData.append("activityRules[" + i + "].ladders[" + num + "].prizes[" + h + "].prizeNumber", data[i].dataTables[v][h].prizeNumber);//邀请者奖品ID和数量
                formData.append("activityRules[" + i + "].ladders[" + num + "].prizes[" + h + "].prizeId", data[i].dataTables[v][h].prizeId);//邀请者奖品ID和数量
              }
              ladderStep = ladderStep + 1;
            }
          }
          if (this.value5.length > 0) {//包含标签
            for (var i = 0; i < this.value5.length; i++) {
              formData.append("activityTagBs[" + i + "].type", 1);
              formData.append("activityTagBs[" + i + "].tagId", this.value5[i]);
            }
          } else if (this.value7.length > 0) {
            for (var i = 0; i < this.value7.length; i++) {
              formData.append("activityTagBs[" + i + "].type", 2);
              formData.append("activityTagBs[" + i + "].tagId", this.value7[i]);
            }
          }
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          this.$http.post("activity/saveOrUpdate", formData, config).then(res => {
            if (res.data.error_code == 2000) {
            this.$message.success('恭喜你，提交活动成功');
            this.loading2 = false;
            this.$router.push("activityManagement")
            return false;
          } else if (res.data.error_code == 2004) {
            this.loading2 = false;
            this.$message.error('错了哦，上传文件过大');
          } else if(res.data.error_code == 2315){
            this.loading2 = false;
            this.$message.error("活动时间内，已存在同类型活动");
          }else {
            this.loading2 = false;
            this.$message.error(res.data.error_message);
          }
        }).catch(err => {
            console.log(err)
          this.loading2 = false;
          this.$message.error("服务器返回了一个错误");
        })

        } else {
          var prizeId = [];//
          for (var i = 0; i < this.triggerType.length; i++) {
            if (this.triggerType[i] == "注册") {
              formData.append("activityRules[0].triggers[" + i + "].triggerType", 1)
            } else if (this.triggerType[i] == "绑车牌") {
              formData.append("activityRules[0].triggers[" + i + "].triggerType", 2)
            } else if (this.triggerType[i] == "支付") {
              formData.append("activityRules[0].triggers[" + i + "].triggerType", 3)
            } else {
              formData.append("activityRules[0].triggers[" + i + "].triggerType", this.triggerType[i])
            }
          }
          for (var i = 0; i < this.userRewards.length; i++) {
            prizeId.push(this.userRewards[i].prizeId);
            formData.append("activityRules[0].ladders[0].prizes[" + i + "].prizeId", this.userRewards[i].prizeId)
            formData.append("activityRules[0].ladders[0].prizes[" + i + "].prizeNumber", this.userRewards[i].prizeNumber)
          }
          formData.append("activityRules[0].ladders[0].type", 2)//阶梯类型
          formData.append("activityRules[0].type", 1)//活动规则类型
          var temp = this.unique(prizeId);
          if (temp == 1) {
            this.$message.error("存在相同的奖品，请重新设置");
            this.loading2 = false;
            return false;
          }
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          this.$http.post("activity/saveOrUpdate", formData, config).then(res => {
            if (res.data.error_code == 2000) {
              this.$message.success('恭喜你，提交活动成功');
              this.loading2 = false;
              this.$router.push("activityManagement")
              return false;
            } else if (res.data.error_code == 2004) {
            this.loading2 = false;
            this.$message.error('错了哦，上传文件过大');
            }  else if(res.data.error_code == 2315){
            this.loading2 = false;
            this.$message.error("活动时间内，已存在同类型活动");
            } else {
            this.loading2 = false;
            this.$message.error(res.data.error_message);
            }
          }).catch (err => {
            this.loading2 = false;
        })
        }
      },

      returnGo(){
        this.$router.go(-1)
      },
      //数组重复检测
      unique(arr){
        // 遍历arr，把元素分别放入tmp数组(不存在才放)
        var tmp = new Array();
        for (var i in arr) {
          //该元素在tmp内部不存在才允许追加
          if (tmp.indexOf(arr[i]) == -1) {
            tmp.push(arr[i]);
          } else {
            return 1;
          }
        }
        return 0;
      }
    },
  }
</script>
