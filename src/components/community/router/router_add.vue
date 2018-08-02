<template>
  <div>
    <h2>新增路由器</h2>
    <el-form label-position="top" label-width="80px" :model="formLabelAlign">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*路由器名称" prop="name">
              <el-input v-model.trim="formLabelAlign.name" placeholder="请输入路由器名称" :maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*路由器编号" prop="number">
              <el-input v-model.trim="formLabelAlign.number" placeholder="请输入路由器编号":maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*路由器厂商" prop="manufacturerName">
              <el-input v-model.trim="formLabelAlign.manufacturerName" placeholder="请输入路由器厂商" :maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*路由器型号" prop="model">
              <el-input v-model.trim="formLabelAlign.model" placeholder="请输入路由器型号" :maxlength=20></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="submitForm">提交</el-button>
    <el-button type="primary" @click="toBefore">返回</el-button>

    <!--小区的模态框-->
    <el-dialog
      title="选择小区"
      width="60%"
      :show-close='false'
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogEstateTable"
      custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true"  :model="estateSearchFromData">
          <el-form-item label="省" prop="provinceId">
            <el-select
              clearable
              placeholder="=请选择省份="
              width="100%"
              v-model="estateSearchFromData.provinceId"
              :clearable="false"
              @change="getIDisNum(estateSearchFromData.provinceId,2)">
              <!-- label表示的是每一个下拉列表的数据 -->
              <el-option v-for="item in province" :label="item.name" :value="item.id" :key="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="cityId">
            <el-select
              :clearable="false"
              placeholder="=请选择城市="
              width="100%"
              v-model="estateSearchFromData.cityId"
              @change="getIDisNum(estateSearchFromData.cityId,3)">
              <!-- label表示的是每一个下拉列表的数据 -->
              <el-option v-for="item in citys" :label="item.name" :value="item.id" :key="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="县/区" prop="areaId">
            <el-select
              :clearable="false"
              placeholder="=请选择县区="
              width="100%"
              v-model="estateSearchFromData.areaId">
              <!-- label表示的是每一个下拉列表的数据 -->
              <el-option v-for="item in zones" :label="item.name" :value="item.id" :key="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='小区名称'>
            <el-input placeholder="请输入小区名称" v-model.trim="estateSearchFromData.name" @change="clearStart"
                      @keyup.enter.native="estateSearch"></el-input>
          </el-form-item>
          <div class="divStyle">
            <selectchild v-on:getlength="getChildLength"></selectchild>
            <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
            <el-button type="primary" @click="estateSearch" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
          </div>
        </el-form>
      </div>
      <template>
        <el-table
          style="width: 100%"
          :data="estateTableDatas"
          ref="singleEstateTable"
          row-key="id"
          border>
          <el-table-column
            prop="id"
            width="100px"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="provinceName"
            label="省份">
          </el-table-column>
          <el-table-column
            prop="cityName"
            label="城市">
          </el-table-column>
          <el-table-column
            prop="areaName"
            label="区县">
          </el-table-column>
          <el-table-column
            prop="name"
            label="小区名称">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
          <el-table-column
            label="小区类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type==0">停车场查询</span>
              <span v-else-if="scope.row.type==1">约车场</span>
              <span v-else-if="scope.row.type==2">约车位</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.state==0">关闭</span>
              <span v-else-if="scope.row.state==1">开放</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="bindEstate(scope.row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                      v-on:pagechange="pagechangesEstate"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogEstateTable">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style>
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

  .bindButton {
    position: absolute;
    top: 50px;
  }
</style>

<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        formLabelAlign: {
          name: '',
//          parklotId: '',
//          parklotName:'',
          number: '',
          manufacturerName: '',
          model: '',
        },

        //绑定小区的数据------------
        dialogEstateTable: false,//小区模态框
        estateSearchFromData: {//小区的搜索
          name: '',
          provinceId: '',
          cityId:'',
          areaId:'',
        },
        estateTableDatas: [],//小区表格的数据
        estateSelectDate: null,//选中的数据
        // 搜索和导出需要的参数
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',  // 提示信息是否显示
        text: '',   //  提示信息的内容
        // 小区的搜索省市区下拉列表的信息
        province: [],
        citys: [],
        zones: [],
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
      }

    },
    methods: {
      // 提交数据
      submitForm(){
        if (this.formLabelAlign.name === '') {
          this.$message.error('所有*号内容为必填。');
        }else if (this.formLabelAlign.number === '') {
          this.$message.error('所有*号内容为必填。');
        } else if (this.formLabelAlign.manufacturerName === '') {
          this.$message.error('所有*号内容为必填。');
        } else if (this.formLabelAlign.model === '') {
          this.$message.error('所有*号内容为必填。');
        } else {
          var data = Qs.stringify(this.formLabelAlign)
          this.$http.post('router/save', data).then((res) => {
            if (res.data.error_code == 2000) {
              this.$message.success('恭喜你，新增路由器成功了');
              this.$router.go(-1);
            } else {
              this.$message.error('错了哦，服务器返回了' + res.data.error_message);
            }
            ;
          }).catch((err) => {
            console.log(err);
          })
        }
      },

      //绑定小区
      bindOfEstate(){
        this.dialogEstateTable = true;
        this.getEstateData();
      },
      //获取数据
      getEstateData(){
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
          if (res.data.error_code == 0 && res.data.data.dataList.length != 0) {
            this.error_code = 0;
          } else {
            this.seachLoading = false;
            this.estateTableDatas= res.data.data.dataList;
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
          }
        }).catch((err) => {
          this.seachLoading = false;
          console.log(err);
        });

      },
      // 搜索小区省市区
      getBasicsData(num, flag){
        this.$http.get('area/' + num).then(res => {
          var tempData = res.data.data;
        console.log(tempData)
        if (flag == 1) {
          tempData.unshift({id: 0, name: '=请选择省份='});
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
      getIDisNum(num, flag){
        if (flag == 2) {
          this.estateSearchFromData.cityId = '';
          this.estateSearchFromData.areaId = '';
        } else if (flag == 3) {
          this.estateSearchFromData.areaId = '';
        }
        this.getBasicsData(num, flag);
      },
      //搜索
      estateSearch(){
        console.log(this.estateSearchFromData)
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
      paramsEstateData(){
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
          this.seachLoading = false;
          this.estateTableDatas= res.data.data.dataList;
          // 当数据回来之后再做页码处理
          this.total = parseInt(res.data.data.itotalRecords);
          if(this.estateTableDatas.length == 0){
            this.$message.error('错了哦，没有符合的数据');
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })

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
          this.getEstateData();
        } else if (this.isSearch == 1) {
          this.paramsEstateData();
        }
      },
      //绑定
      bindEstate(row){
        this.estateSelectDate = row;
        this.dialogEstateTable = false;
        console.log(this.estateSelectDate)
        this.formLabelAlign.parklotId = this.estateSelectDate.id;
        this.formLabelAlign.parklotName = this.estateSelectDate.name;
        // 确定数据
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        this.estateSearchFromData.name = '';
        this.estateSearchFromData.cityId = '';
        this.estateSearchFromData.areaId = '';
        this.estateSearchFromData.provinceId = '';
        this.dialogEstateTable = false;
      },
      //取消按钮
      closeDialogEstateTable(){
        // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
        this.estateSelectDate = null;
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        this.estateSearchFromData.name = '';
        this.estateSearchFromData.cityId = '';
        this.estateSearchFromData.areaId = '';
        this.estateSearchFromData.provinceId = '';
        this.dialogEstateTable = false;
      },
      // 分页菜单的数据
      pagechangesEstate(val){
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
      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
      },
      // 返回上一页
      toBefore(){
        this.$router.go(-1);
      }
    },
    updated(){
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
