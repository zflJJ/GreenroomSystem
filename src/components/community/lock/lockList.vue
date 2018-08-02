<template>
  <div>
    <h2>车锁列表</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="小区名称">
        <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="蓝牙名称">
        <el-input placeholder="请输入蓝牙名称" v-model.trim="searchFromData.serialNumber" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchFromData.state" placeholder="请选择" @change="clearStart">
          <el-option v-for="item in positions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="searchFromData.type" placeholder="请选择" @change="clearStart">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电量">
        <el-select v-model="searchFromData.battery" placeholder="请选择" @change="clearStart">
          <el-option v-for="item in batterys" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态异常车锁">
        {{invalidNum}}个
      </el-form-item>
      <el-form-item label="电量过低的车锁">
        {{noPowerNum}}个
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="primary" @click="linkClick" class="isBtnStyle3">批量二维码</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%" :row-key="getRowKeys" @select="getRowOne" @select-all="getRowAll"ref="singleTable">
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="小区名称" prop="parklotName">
        </el-table-column>
        <el-table-column label="小区类型">
          <template slot-scope="scope">
            <span v-if="scope.row.parklotType==1&&scope.row.innershareStr=='内部共享'">约车场内部共享</span>
            <span v-else-if="scope.row.parklotType==2&&scope.row.innershareStr=='内部共享'">约车位内部共享</span>
            <span v-else-if="scope.row.parklotType == 2">约车位</span>
            <span v-else-if="scope.row.parklotType==1">约车场</span>
            <span v-else-if="scope.row.parklotType==0">车位查询</span>
          </template>
        </el-table-column>
        <el-table-column label="蓝牙名称" prop="btName">
        </el-table-column>
        <el-table-column label="类型" prop="typeStr">
        </el-table-column>
        <el-table-column label="状态" prop="state">
          <template slot-scope="scope">
            <span v-if='scope.row.state == 0' class='background red'>异常</span>
            <span v-if='scope.row.state == 1'>正常</span>
            <span v-else  class='background red'>无数据回传</span>
          </template>
        </el-table-column>
        <el-table-column label="电量" prop="battery">
          <template slot-scope="scope">
            <span v-if='scope.row.battery==100'>{{scope.row.battery}}%</span>
            <span v-else-if='scope.row.battery<=0.3' class="background red">{{scope.row.battery*100}}%</span>
            <span v-else>{{scope.row.battery*100}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="500px">
            <el-button size="mini" type="success" @click="seeLog(scope.row.id)">日志
            </el-button>
            <br>
            <el-button size="mini" type="info" @click="lockDetails(scope.row.id)">详情
            </el-button>
            <br>
            <el-button size="mini" type="warning" @click="lockEdit(scope.row.id)">编辑
            </el-button>
            <br>
            <el-button size="mini" @click="down(scope.row.btName)">二维码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary"  @click="addlock">新增车位锁</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>

<style>
  .background {
    width: 8px;
    height: 4px;
    padding: 4px;
  }

  .red {
    background-color: #F56C6C;
  }

  .divStyle > .isBtnStyle1 {
      position: absolute;
      right: 150px;
      top: 13px;
    }

  .divStyle > .isBtnStyle2 {
    position: absolute;
    right: 0px;
    top: 13px;
    height: 40px;
    line-height: 40px;
    padding: 0 11px;
    background: #02bafa;
    border: 1px #26bbdb solid;
    border-radius: 3px;
    color: #fff;
    text-decoration: none;
    font-size: 14px;
    outline: none;
  }
  .divStyle > .isBtnStyle3 {
    position: absolute;
    right: 350px;
    top: 13px;
  }

  .isShowStyle {
    top: 25px;
    position: absolute;
    right: 500px;
    color: red;
  }

  .divStyle {
    position: relative;
    height: 60px;
  }

  ul {
    list-style: none;
    display: inline-block;
  }

  .pageation li {
    float: left;
    display: inline-block;
    padding: 10px;
    background-color: #adadad;
    margin: 10px;
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

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import baseUrl from "../../../server/baseURL.js"
  import Qs from 'qs';
  export default {
    data(){
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        dialogFormVisible: false,
        dataItems: [],
        flag: false,
        isShow: false,
        isSpan: false,
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        invalidNum:'',
        noPowerNum:'',
        searchFromData: {
          parklotName: '',
          serialNumber: '',
          state: '',
          type: '',
          battery: '',
          userName: '',
          phone: '',
        },
        positions: [{
          value: '',
          label: '全部'
        },{
          value: '0',
          label: '异常'
        }, {
          value: '1',
          label: '正常'
        }],
        types: [{
          value: '',
          label: '全部'
        },{
          value: '0',
          label: 'zigbee车锁'
        }, {
          value: '1',
          label: 'NB车锁'
        }, {
          value: '2',
          label: '蓝牙车锁'
        }, {
          value: '3',
          label: 'Lora车锁'
        }],
        batterys: [{
          value: '',
          label: '全部'
        },{
          value: '<=0.1',
          label: '≤10%'
        }, {
          value: '<=0.3',
          label: '<=30%'
        }, {
          value: '<=0.5',
          label: '<=50%'
        }, {
          value: '>=0.3',
          label: '>=30%'
        }, {
          value: '>=0.5',
          label: '>=50%'
        }],
        linkHref:'',
        tableArray:[],
        getRowKeys(row) {
          return row.id;
        },
      }
    },
    created(){
      this.getLockData();
    },
    methods: {
      linkClick(){
        var btName = [];
        for(var i =0; i < this.tableArray.length; i++){
          btName.push(this.tableArray[i].btName);
        }
        btName = btName.join(",");
        if(btName == ""){
            this.$message.error("请选择车锁")
            return false;
        }

        location.href = baseUrl.requestUrl + "lock/downloadAllQr?data="+btName;
        this.$refs.singleTable.clearSelection();
        btName = [];
        this.tableArray = [];
      },
      // 实时获取 表格中的单选数据的时候(单选的时候)
      getRowOne(selection, row){
        this.tableArray = selection;
      },
      // 当点击多选的时候，选中的数据
      getRowAll(selection, row){
        this.tableArray = selection;
      },
      down(btName){
        location.href = baseUrl.requestUrl+"lock/downloadAllQr?data="+btName;
      },
      //获得数据
      getLockData(){
        this.dataItems = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post("lock/pageable", data).then(res => {
            console.log(res)
          this.dataItems = res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
          this.noPowerNum =  res.data.data.noPowerNum;
          this.invalidNum =  res.data.data.invalidNum;
          this.seachLoading = false;
          console.log(res)
        }).catch(err=>{
          this.seachLoading = false;
          console.log(err);
        })
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.parklotName === '' && this.searchFromData.serialNumber === '' && this.searchFromData.state === '' && this.searchFromData.type === '' && this.searchFromData.battery === '') {
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
            this.seachLoading = false;
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.parklotName === '' && this.searchFromData.serialNumber === '' && this.searchFromData.state === '' && this.searchFromData.type === ''  && this.searchFromData.battery === '') {
            this.start = 0;
            this.isSearch = 0;
            this.getLockData();
          } else if (this.searchFromData.parklotName != '' || this.searchFromData.serialNumber != '' || this.searchFromData.state != '' || this.searchFromData.type != ''  || this.searchFromData.battery != '') {
            this.paramsData();
          }
        };
      },
      // 带参搜索数据
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.parklotName) datas.parklotName = this.searchFromData.parklotName;
        if (this.searchFromData.serialNumber) datas.serialNumber = this.searchFromData.serialNumber;
        if (this.searchFromData.state) datas.state = this.searchFromData.state;
        if (this.searchFromData.type) datas.type = this.searchFromData.type;
        if (this.searchFromData.battery) datas.battery = this.searchFromData.battery;
        // 开始发送请求
        var data = Qs.stringify(datas);
        console.log(datas)
        this.$http.post('lock/pageable', data).then(res => {
          this.noPowerNum =  res.data.data.noPowerNum;
          this.invalidNum =  res.data.data.invalidNum;
          this.seachLoading = false;
          if(res.data.data.dataList.length == 0){
            this.dataItems = [];
          }else if (res.data.error_code !== 2000 && !res.data.data.dataList) {
            this.text = "输入的搜索条件有误，未能匹配到数据！！";
            this.isflag = true;
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.text = "";
              this.isflag = false;
              clearInterval(timeId);
            }, 3000);
          }else if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
          }else if (res.data.error_code !== 2000) {
            this.text = "输入的搜索条件有误，未能匹配到数据！！";
            this.isflag = true;
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.text = "";
              this.isflag = false;
              clearInterval(timeId);
            }, 3000);
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        console.log(this.start)
        if (this.isSearch == 0) {
          this.getLockData();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 下拉菜单的选择器
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
        this.compage = age;
        this.display = parseInt(len);
        if (this.isSearch == 0) {
          this.getLockData();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      //跳转查看日志
      seeLog(lockId){
        this.$router.push({path: 'lock_the_log', query: {lockId: lockId}});
      },
      lockDetails(id){
        this.$router.push({path: 'lock_details',query:{lockId:id}});
      },
      lockEdit(id){
        this.$router.push({path: 'lock_edit',query:{lockId:id}});
      },
      //新增车位锁
      addlock(){
        this.$router.push({path: 'lock_add'});
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
