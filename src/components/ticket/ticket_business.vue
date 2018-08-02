<template>
  <div class="estate">
    <h2>合作商家1.2</h2>
    <!--1.0 搜索框-->
    <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
      <el-form-item label="商家名称">
        <el-input placeholder="请输入商家名称" v-model.trim="searchFromData.businessName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <template>
          <el-select v-model="searchFromData.businessStatus" placeholder="请选择状态">
            <el-option
              @change="clearStart"
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>

    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column label="商家名称" prop="businessName">
        </el-table-column>
        <el-table-column label="商家描述" prop="businessDescription">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.businessStatus == 1">正常</span>
            <span v-else-if="scope.row.businessStatus==0">终止</span>
          </template>
        </el-table-column>
        <el-table-column label="编辑时间">
          <template slot-scope="scope">
            <span v-if="scope.row.modifyTime">{{scope.row.modifyTime | moment}}</span>
            <span v-else>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="particularMerchant(scope.row.id)">详情</el-button>
            <el-button size="mini" type="danger" @click="deleteMerchant(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" icon="el-icon-circle-plus" @click="dialogAddMerchant=true">添加合作商家</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>

    <el-dialog title="新增商家" :visible.sync="dialogAddMerchant">
      <el-form :model="AddMerchantModeForm">
        <el-form-item label="*商家名称" :label-width="dialogAddMerchantWidth">
          <el-input v-model.trim="AddMerchantModeForm.businessName" :maxlength=20></el-input>
        </el-form-item>
        <br>
        <el-form-item label="商家描述" :label-width="dialogAddMerchantWidth">
          <el-input type="textarea" v-model="AddMerchantModeForm.businessDescription" :maxlength=200></el-input>
        </el-form-item>
        <br>
        <el-form-item label="*状态" :label-width="dialogAddMerchantWidth">
          <el-select v-model="AddMerchantModeForm.businessStatus" placeholder="请选择">
            <el-option label="正常" value="1"></el-option>
            <el-option label="终止" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddMerchant = false">返 回</el-button>
        <el-button type="primary" @click="addMerchant">提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogDeteleMerchant" width="30%">
      <span>是否删除商家</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogDeteleMerchant = false">返 回</el-button>
    <el-button type="primary" @click="deleteMerchantSubmit">提 交</el-button>
  </span>
    </el-dialog>
    <el-dialog title="商家详情" :visible.sync="dialogParticularMerchant">
      <el-form :model="ParticularMerchantModeForm">
        <el-form-item label="*商家名称" :label-width="dialogAddMerchantWidth">
          <el-input v-model.trim="ParticularMerchantModeForm.businessName" disabled></el-input>
        </el-form-item>
        <br>
        <el-form-item label="商家描述" :label-width="dialogAddMerchantWidth">
          <el-input type="textarea" v-model="ParticularMerchantModeForm.businessDescription"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="*状态" :label-width="dialogAddMerchantWidth">
          <el-select v-model="ParticularMerchantModeForm.businessStatus" placeholder="请选择状态">
            <el-option label="正常" value="1"></el-option>
            <el-option label="终止" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogParticularMerchant = false">返 回</el-button>
        <el-button type="primary" @click="particularMerchantSubmit">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
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
    color: red;
  }

  .divStyle {
    position: relative;
    height: 60px;
  }

  .el-form {
    margin-top: 14px;
  }

  .el-form-item {
    margin-bottom: 0px;
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

  .estate td {
    vertical-align: middle;
  }

  h2 {
    margin: 0;
    padding: 0;
  }

  .estate td > sapan {
    display: inline-block;
    height: 30px;
    padding: 20px;
  }

  .colspan p {
    font-size: 16px;
    color: red;
  }

  /*显示模态框的提示信息*/
  .spanStyle {
    color: red;
  }
</style>
<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default {
    //显示的声明组件
    data() {
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        dataItems: [],
        // 模态框编辑和删除是否禁用标识
        flag: false,
        // 是否显示模态框的小叉
        isShow: false,
        // 提示信息的显示(默认不显示，只有点击增加的时候并且没有内容的时候显示为true)
        isSpan: false,
        // 搜索和导出的变量
        seachLoading: false,  // 搜索是否禁用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        options:[{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '正常'
        }, {
          value: '0',
          label: '终止'
        }],
        // 这个是搜索区域的内容
        searchFromData: {
          businessName: "",
          businessStatus: "",
        },
        //新增商家的模态框
        dialogAddMerchant:false,
        dialogAddMerchantWidth:'120px',
        // 新增商家模态框中的from 表单的数据
        AddMerchantModeForm: {
          businessName: '',
          businessStatus: '1',
          businessDescription:'',
        },
        ParticularMerchantModeForm: {//查看详情商家模态框中的from 表单的数据
          businessName: '',
          businessStatus: '',
          businessDescription:'',
        },
        deleteMerchantId: '',//删除商家的ID
        dialogDeteleMerchant:false,//删除商家的模态框
        dialogParticularMerchant:false,//商家详情模态框
        ParticularMerchantId:'',//详情ID
      };
    },
    created() {
      this.getMerchantData();
    },
    methods: {
      // 不带参请求数据的地方
      getMerchantData() {
        this.dataItems = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post('buiness/pageable', data).then((res) => {
          console.log(res.data);
          this.seachLoading = false;
          if (res.data.error_code !== 2000 && res.data.data.dataList.length != 0) {
            this.error_code = 0;
          } else {
            this.dataItems = res.data.data.dataList;
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
          }
        }).catch((err) => {
          this.seachLoading = false;
          console.log(err);
        });
      },
      //新增合作商家
      addMerchant(){
        if(!this.AddMerchantModeForm.businessName){
          this.$message.error('错了哦，商家名称必须填写');
          return;
        }
        if(!this.AddMerchantModeForm.businessStatus){
          this.$message.error('错了哦，商家状态必须选择');
          return;
        }
        var data = Qs.stringify(this.AddMerchantModeForm);
        this.$http.post("buiness/save",data).then(res => {
          console.log(res)
          if(res.data.error_code == 2306){
            this.$message.error('错了哦，商家名称重复');
            return;
          }else if(res.data.error_code == 2001){
            this.$message.error('错了哦，'+ res.data.error_message);
            return;
          }
          this.$message.success('新增合作商家成功');
          this.getMerchantData();
          this.dialogAddMerchant = false;
          this.AddMerchantModeForm.businessName = '';
          this.AddMerchantModeForm.businessStatus = '';
          this.AddMerchantModeForm.businessDescription = '';
        })
      },
      //删除合作商家
      deleteMerchant(id){
        this.dialogDeteleMerchant = true;
        this.deleteMerchantId = id;
      },
      //删除合作商家提交
      deleteMerchantSubmit(){
        var id = this.deleteMerchantId;
        this.$http.get("buiness/remove/" + id).then(res => {
          console.log(res)
          this.dialogDeteleMerchant = false;
          this.getMerchantData();
          this.$message.success('删除合作商家成功');
        })
      },
      //查看商家详情
      particularMerchant(id){
        this.dialogParticularMerchant = true;
        this.ParticularMerchantId = id;
        this.$http.get("buiness/"+id).then(res => {
          console.log(res)
          var data = res.data.data;
          this.ParticularMerchantModeForm.businessName = data.businessName;
          this.ParticularMerchantModeForm.businessDescription = data.businessDescription;
          if(data.businessStatus == 1){
            this.ParticularMerchantModeForm.businessStatus = "正常"
          }else {
            this.ParticularMerchantModeForm.businessStatus = "终止"
          }
        })
      },
      //商家详情提交
      particularMerchantSubmit(){
        if(this.ParticularMerchantModeForm.businessStatus == "正常"){
          this.ParticularMerchantModeForm.businessStatus = 1;
        }else if(this.ParticularMerchantModeForm.businessStatus == "终止") {
          this.ParticularMerchantModeForm.businessStatus = 0;
        }
          var data = {
          "id": this.ParticularMerchantId,
          "businessName": this.ParticularMerchantModeForm.businessName,
          "businessDescription": this.ParticularMerchantModeForm.businessDescription,
          "businessStatus": this.ParticularMerchantModeForm.businessStatus,
        }
        data = Qs.stringify(data);
        this.$http.post("buiness/save",data).then(res => {
          if(res.data.error_code == 2306){
            this.$message.error('错了哦，商家名称重复');
            return;
          }else if(res.data.error_code == 2001){
            this.$message.error('错了哦，'+ res.data.error_message);
            return;
          }
          this.dialogParticularMerchant = false;
          this.ParticularMerchantModeForm.businessStatus = "";
          this.ParticularMerchantModeForm.businessDescription = "";
          this.ParticularMerchantModeForm.businessName = "";
          this.$message.success('编辑合作商家成功');
          this.getMerchantData();
        })
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.businessName === "" && this.searchFromData.businessStatus === "") {
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
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.businessName === "" && this.searchFromData.businessStatus === "") {
            this.start = 0;
            this.isSearch = 0;
            this.getMerchantData();
          } else {
            this.paramsData();
          }
        }
        ;
      },
      // 带参搜索数据
      paramsData(){
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.businessName) datas.businessName = this.searchFromData.businessName;
        if (this.searchFromData.businessStatus) datas.businessStatus = this.searchFromData.businessStatus;
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('buiness/pageable', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
          } else if (res.data.error_code !== 2000 || res.data.data.dataList.length == 0) {
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
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        console.log(this.compage);
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getMerchantData();
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
          this.getMerchantData();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
    },

    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  };
</script>
