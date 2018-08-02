<template>
  <div>
    <h2>路由器详情</h2><br>
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataTable" border style="width: 100%">
        <el-table-column label="路由器ID" prop="routerId">
        </el-table-column>
        <el-table-column label="路由器名称" prop="routerName">
        </el-table-column>
        <el-table-column label="路由器编号" prop="routerNumber">
        </el-table-column>
        <el-table-column label="网关ID" prop="identifier">
        </el-table-column>
        <el-table-column label="网关名称" prop="name">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="edit(scope.row)">编辑网关
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary"  @click="dialogVisible=true">新增网关</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <el-dialog
      title="请输入网关信息"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form :model="searchFromData" class="demo-form-inline">
        <el-form-item label="网关名称">
          <el-input placeholder="请输入网关名称" v-model.trim="gateway.name" ></el-input>
        </el-form-item>
        <el-form-item label="网关ID">
          <el-input placeholder="请输入网关16位ID" v-model.trim="gateway.identifier"></el-input>
        </el-form-item>
      </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="closedialogVisible">取 消</el-button>
    <el-button type="primary" @click="dialogVisibleSubmit">新增</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="请输入网关信息"
      :visible.sync="dialogVisibleEdit"
      width="50%">
      <el-form :model="searchFromData" class="demo-form-inline">
        <el-form-item label="网关名称">
          <el-input placeholder="请输入网关名称" v-model.trim="gateway.name" ></el-input>
        </el-form-item>
        <el-form-item label="网关ID">
          <el-input placeholder="请输入网关16位ID" v-model.trim="gateway.identifier"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeEditdialogVisible">取 消</el-button>
    <el-button type="primary" @click="dialogVisibleEditSubmit">编辑</el-button>
  </span>
    </el-dialog>
  </div>
</template>
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
  h2 {
    font-size: 26px;
    font-weight: 700;
  }

  .estate td {
    vertical-align: middle;
  }
  .bottomStyle{
    border: 1px solid #ebeef5;
    border-top:none;
    padding: 5px 20px;
    height: 60px;
    line-height: 50px;
    text-align: right;
  }
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default{
    data(){
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        dataItems: {},
        flag: false,
        isShow: false,
        isSpan: false,
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        searchFromData: {
          parklotName: '',
          name: '',
        },
        dataTable:[],
        dialogVisible: false,
        gateway:{
          name:'',
          identifier:'',
          id:'',
        },
        dialogVisibleEdit:false,
      }
    },
    created(){
      this.getData();
    },
    methods:{
      getData(){
        var data = {
          routerId:this.$route.query.routerId,
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        data = Qs.stringify(data)
        this.$http.post("router/one",data).then(res=>{
          console.log(res.data.data)
//          data = res.data;
          this.dataTable = res.data.data.gatewayList.dataList
          for(var i = 0; i < this.dataTable.length; i++){
              this.dataTable[i].routerId =  res.data.data.id;
              this.dataTable[i].routerName =  res.data.data.name;
              this.dataTable[i].routerNumber =  res.data.data.number;
          }
          this.total = parseInt(res.data.data.gatewayList.itotalRecords);
        }).catch(err=>{
          this.$message.error('错了哦，没有数据');
        })
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getData();
        console.log(this.start)
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
        this.getData();
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },
      //取消网关操作
      closedialogVisible(){
        this.dialogVisible = false;
        this.gateway.name = '';
        this.gateway.identifier = '';
      },
      //提交网关数据
      dialogVisibleSubmit(){
        if (this.gateway.name === '' || this.gateway.name.length>20) {
          this.$message.error('错了哦，网关名称不能为空并且网关名称不能超过20个字符');
        } else if(this.gateway.identifier === ''){
          this.$message.error('错了哦，网关ID不能为空');
        } else{
          this.dialogVisible = false;
          var data = {
            name : this.gateway.name,
            identifier : this.gateway.identifier,
            routerId:this.$route.query.routerId,
          }
          data = Qs.stringify(data)
          this.$http.post("gateway/save",data).then(res => {
            if(res.data.error_code == 2000){
              console.log(res)
              this.gateway.name = '';
              this.gateway.identifier = '';
              this.getData();
            }else {
              this.$message.error(res.data.error_message);
            }
          })
        }
      },
      //编辑网关
      edit(row){
        this.dialogVisibleEdit = true;
        this.gateway.name = row.name;
        this.gateway.identifier = row.identifier;
        this.gateway.id = row.id;
      },
      //编辑网关取消按钮
      closeEditdialogVisible(){
        this.dialogVisibleEdit = false;
        this.gateway.name = '';
        this.gateway.identifier = '';
      },
      //编辑网关提交数据
      dialogVisibleEditSubmit(){
        if (this.gateway.name === '' || this.gateway.name.length>20) {
          this.$message.error('错了哦，网关名称不能为空并且网关名称不能超过20个字符');
        } else if(this.gateway.identifier === ''){
          this.$message.error('错了哦，网关ID不能为空');
        }else {
          this.dialogVisibleEdit = false;
          var data = {
            id:this.gateway.id,
            name : this.gateway.name,
            identifier : this.gateway.identifier,
            routerId:this.$route.query.routerId,
          }
          data = Qs.stringify(data)
          this.$http.post("gateway/save",data).then(res => {
            if(res.data.error_code == 2000){
              console.log(res);
              this.gateway.name = '';
              this.gateway.identifier = '';
              this.gateway.id = '';
              this.getData();
            }else {
              this.$message.error(res.data.error_message);
            }
          })
        }
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
