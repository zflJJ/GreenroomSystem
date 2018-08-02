<template>
  <div>
    <h2>费用规则</h2>
    <br>
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="规则名称">
          <el-input placeholder="请输入规则名称" v-model.trim="searchFromData.name" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="规则类型">
          <el-select v-model="searchFromData.type"  @change="changeType(searchFromData.type)" placeholder="预约费">
            <el-option
              v-for="item in options"
              :key="item.type"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!--3.0 下拉菜单 和 导出数据-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>

    <!--4.0 表格信息-->
    <template v-if="showTable">
        <el-table
          :data="tableDatas"
          style="width: 100%"
          row-key="id"
          :expand-row-keys="expands"
          @row-click="rowClick"
          @expand-change="rowClick"
          border>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                :data="reserveData"
                height="250"
                border
                style="width: 100%">
                <el-table-column
                  prop="miunte"
                  label="提前时间（分钟）">
                </el-table-column>
                <el-table-column
                  prop="fee"
                  label="费用（元）">
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="ID" prop="id">
          </el-table-column>
          <el-table-column label="规则名称" prop="name">
          </el-table-column>
          <!--<el-table-column label="" prop="desc">
          </el-table-column>-->
        </el-table>
    </template>

    <!--5.0 停车费表格信息-->
    <template v-if="showPakingTable">
      <div>
        <el-table
          :data="ParkingDatas"
          border>
          <el-table-column
            prop="id"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="规则名称">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="costRulesEdit(scope.row)">编辑</el-button>
              <el-button @click="costRulesDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click="costRulesAdd">新增规则</el-button>
    </div>
    <!--5.0 分页插件-->
    <paingchild  :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                 v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        // 发送数据所用
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],
        options: [{
          value: '1',
          label: '预约费'
        }, {
          value: '2',
          label: '停车费'
        }],
        ParkingDatas:[], // 停车费用规则
        // 搜索和导出需要的参数
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',  // 提示信息是否显示
        text: '',   //  提示信息的内容
        searchFromData: {
          name: "",
        },
        showTable:true,//预约收费表格
        showPakingTable:false,//停车收费表格
        tablePakingDatas:[],//停车收费表格数据
        flagType:1,
        expands: [], // 表示数据处理的
        reserveData:[], // 预约费用信息

      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 停车费结构拆分
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
//        console.log(row, column, rowIndex, columnIndex);
        if (columnIndex === 0 || columnIndex === 1) {
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
      rowClick(row, event, column) {
        console.log(row);
        console.log(event);
        console.log(column);
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
      changeType(value){
        this.start = 0;
        this.display = 10;
        this.compage = 1;
        if(value == 1){
          this.showTable = true;
          this.showPakingTable = false;
          this.tablePakingDatas = null;
          this.flagType = 1;
          this.getTableDatas();
        }else if(value == 2){
          this.showTable = false;
          this.showPakingTable = true;
          this.tableDatas = null;
          this.flagType = 2;
          this.getPakingTableDatas();
        }

      },

      //获取预约费
      getTableDatas(){
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        if (this.searchFromData.name) datas.name = this.searchFromData.name;

        var data = Qs.stringify(datas);
        this.$http.post('fee/rule/reserve/pageable', data).then(res => {
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
            for(let i=0;i<this.tableDatas.length;i++){
              let time = this.tableDatas[i].finishTime.split(",");
              let fee = this.tableDatas[i].fee.split(",");
//              console.log(fee);
              let reserveData = [];
              for(let j=0;j<fee.length;j++){
                reserveData.push({
                  miunte: time[j],
                  fee: fee[j]
                })
              }
              this.tableDatas[i].reserveData = reserveData;
            };
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },

      //获取停车费
      getPakingTableDatas(){
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        if (this.searchFromData.name) datas.name = this.searchFromData.name;

        var data = Qs.stringify(datas);
        this.$http.post('fee/rule/parking/pageable', data).then(res => {
          console.log(res);
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            this.ParkingDatas = res.data.data.dataList;

            // 开始对数据进行处理
//            this.disData();
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },
      // 处理停车数据结构
      disData(){
//        console.log(this.tablePakingDatas);
        let ParkingDatas = [];
        let params = this.tablePakingDatas;
        for(let i=0;i<params.length;i++){
          params[i].weekday = params[i].weekday.split(",");
          params[i].firstHourFee = params[i].firstHourFee.split(",");
          params[i].otherTimeFee = params[i].otherTimeFee.split(",");
          params[i].overTimeFee = params[i].overTimeFee.split(",");
          params[i].freeUseTime = params[i].freeUseTime.split(",");
          params[i].maxFee = params[i].maxFee.split(",");
          for(let j=0;j<2;j++){
            let weekday = (params[i].weekday[j] === '0') ? '周末' : '工作日';
            console.log(weekday);
            ParkingDatas.push({
              id:params[i].id,
              name:params[i].name,
              weekday:weekday,
              firstHourFee:params[i].firstHourFee[j],
              otherTimeFee:params[i].otherTimeFee[j],
              overTimeFee:params[i].overTimeFee[j],
              freeUseTime:params[i].freeUseTime[j],
              maxFee:params[i].maxFee[j],
            });
          }
        }
        this.ParkingDatas = ParkingDatas;
//        console.log(this.ParkingDatas);
      },

      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.name == "") {
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            setInterval(() => {
              this.isflag = false;
              this.text = '';
              this.seachLoading = false;
            }, 3000);
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.name == "" ) {
            this.start = 0;
            this.isSearch = 0;
            if(this.flagType ==1){
              this.getTableDatas();
            }else {
              this.getPakingTableDatas();
            }
          } else if (this.searchFromData.name == "") {
            this.paramsData();
          }
        };
      },

      // 带参查询数据，进行搜索
      paramsData(){
        this.isSearch = 1;
        this.start = 0;
        this.display = 10;
        if(this.flagType ==1){
          this.getTableDatas();
        }else {
          this.getPakingTableDatas();
        }
      },

      // 下拉菜单的数据
      getChildLength(len){
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
        console.log(age);
        this.compage = age;
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          if(this.flagType ==1){
            this.getTableDatas();
          }else {
            this.getPakingTableDatas();
          }
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          if(this.flagType ==1){
            this.getTableDatas();
          }else {
            this.getPakingTableDatas();
          }
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.compage = 1;
        this.start = 0;
      },

      //跳转到新增
      costRulesAdd(){
        this.$router.push({path: 'costRules',query:{title:"添加规则"}});
      },
      //跳转到编辑
      costRulesEdit(row){
        this.$router.push({path: 'costRules',query: {row: row,title:"编辑规则"}});
      },
      //详情
      costRulesDetails(row){
        this.$router.push({path: 'costRules',query: {row: row,title:"查看规则"}});
      }
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

<style scoped>
  .divStyle>.isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .divStyle>.isBtnStyle2 {
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

  .bottomStyle {
    border: 1px solid #ebeef5;
    border-top: none;
    padding: 5px 20px;
    height: 60px;
    line-height: 50px;
    text-align: right;
  }
</style>
