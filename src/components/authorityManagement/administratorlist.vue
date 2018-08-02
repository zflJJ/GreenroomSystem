<template>
  <div>
    <h2>管理员列表1.2</h2>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="name"
          label="管理员姓名">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="拥有的角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">有效</span>
            <span v-else="scope.row.state == 0">失效</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | moment}}
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="assignRoles(scope.row.id)">分配角色</el-button>
            <br>
            <el-button size="mini" type="warning" @click="unbundlingRole(scope.row.id)">解绑角色</el-button>
            <br>
            <el-button size="mini" type="danger" @click="editAccount(scope.row)">编辑管理员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click='addAccountDialog=true'>新增管理员</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
    <el-dialog title="新增管理员" :visible.sync="addAccountDialog">
      <el-form :model="addAccountForm">
        <el-form-item label="用户名">
          <el-input v-model="addAccountForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addAccountForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input v-model="addAccountForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addAccountForm.state" placeholder="--状态--">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="可用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAccountSubmit(addAccountForm)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑管理员" :visible.sync="editAccountDialog">
      <el-form :model="editAccountForm">
        <el-form-item label="用户名">
          <el-input v-model="editAccountForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editAccountForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input v-model="editAccountForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editAccountForm.state" placeholder="--状态--">
            <el-option label="禁用" value="0"></el-option>
            <el-option label="可用" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAccountSubmit(editAccountForm)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="assignRolesDialog">
      <el-table :data="assignRolesData" @select="roleRowOne" @select-all="roleRowAll">
        <el-table-column type="selection"></el-table-column>
        <el-table-column property="id" label="角色ID"></el-table-column>
        <el-table-column property="name" label="角色名称"></el-table-column>
        <el-table-column property="state" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1" style="color:#67C23A">可用</span>
            <span v-else="scope.row.state!=1" style="color:#67C23A">禁用</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRolesSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="解绑角色" :visible.sync="unbundlingDialog">
      <el-table :data="unbundlingRoleData"  @select="roleUnbindRowOne" @select-all="roleUnbindRowAll">
        <el-table-column type="selection"></el-table-column>
        <el-table-column property="id" label="角色ID"></el-table-column>
        <el-table-column property="name" label="角色名称"></el-table-column>
        <el-table-column property="state" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1" style="color:#67C23A">可用</span>
            <span v-else="scope.row.state==0" style="color:#67C23A">禁用</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unbundlingDialog = false">取 消</el-button>
        <el-button type="primary" @click="unbundlingSubmit">提 交</el-button>
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
</style>

<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  export default{
    data(){
      return {
        //前端分页插件传递的数据 7个
        display: 10,   // 每页显示条数
        start: 0,
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,//表格数据的长度
        tableDatas: [],  // 渲染表格所用到的数据
        roles: [],//拥有的角色
        addAccountDialog: false,//新增管理员的模态框
        addAccountForm: {//新增管理员存储的数据
          name: '',
          password: '',
          username: '',
          state: '',
        },
        editAccountID: "",//编辑管理员ID
        editAccountDialog: false,//编辑管理员的模态框
        editAccountForm: {//编辑管理员的数据
          name: '',
          password: '',
          username: '',
          state: '',
        },
        assignRolesId: '',//分配角色的管理员ID
        assignRolesDialog: false,//分配角色模态框
        assignRolesData: [],//分配角色数据
        assignRolesSelectionData: '',//分配角色选中数据
        unbundlingDialog: false,//解绑角色的模态框
        unbundlingId: '',//解绑角色的ID
        unbundlingRoleData: [],//解绑角色的数据
        unbundlingRoleSelection: '',//解绑角色的选中的数据
      }
    },

    created(){
      this.getAdminData();
    },
    methods: {
      //请求管理员列表数据
      getAdminData(){
        var data = {
          sEcho : 3,
          start:this.start,
          length:this.display
        }
        data = Qs.stringify(data);
        this.$http.post("auth/admin/pageable",data).then(res => {
          if (res.data.error_code === 2000) {
            this.tableDatas = res.data.data.dataList;
            this.total = res.data.data.itotalRecords;
            this.seachLoading = false;
          } else {
            console.log('状态码返回错误')
          }
        })
      },
      //新增管理员
      addAccountSubmit(formData){
        if (formData.username == '') {
          this.$message.error('错了哦，用户名必须填写');
        }else if (formData.password == '') {
          this.$message.error('错了哦，密码必须填写');
        } else if(/[\u4e00-\u9fa5]/g.test(formData.password)){
          this.$message.error('错了哦，密码不能为汉字');
        } else if (formData.name == '') {
          this.$message.error('错了哦，管理员姓名必须填写');
        } else if(/[\u4e00-\u9fa5]/g.test(formData.password)){
          this.$message.error('错了哦，密码不能为汉字');
        } else if (formData.state == '') {
          this.$message.error('错了哦，状态必须选择');
        }
        var reg_username = /^[\u4E00-\u9FA5A-Za-z0-9(~!@#￥%&*)]+$/;
        var reg_password = /^[A-Za-z0-9(~!@#￥%&*)]+$/;
        // 先做判断
        if(!reg_username.test(formData.username)){
          this.$message.error('不支持特殊字符');
        } else if(!reg_password.test(formData.password)){
          this.$message.error('不支持特殊字符');
        } else {
          formData = Qs.stringify(formData)
          this.$http.post("auth/admin/save", formData).then(res => {
            if (res.data.error_code == 102) {
              this.$message.error('新增管理员失败,用户名重复');
            } else {
              this.$message({
                message: '成功新增管理员',
                type: 'success'
              });
              this.addAccountDialog = false;
              this.addAccountForm.name = '';
              this.addAccountForm.password = '';
              this.addAccountForm.username = '';
              this.addAccountForm.phone = '';
              this.addAccountForm.state = '';
              this.getAdminData();
            }
          })
        }
      },
      //分配角色
      assignRoles(id){
        this.assignRolesDialog = true;
        this.assignRolesId = id;
        var data = {
          length: 999,
          start: 0,
          sEcho: 3,
        }
        data = Qs.stringify(data);
        this.$http.post("auth/role/pageable",data).then(res => {
          console.log(res)
          if(res.data.error_code == 2000){
            this.assignRolesData = res.data.data.dataList
          }else {
            this.$message.error('错了哦，数据请求失败');
          }
        })
      },
      // 2.3 获取分配时所有数据
      roleRowAll(selection){
        this.assignRolesSelectionData = selection;
      },
      // 2.2 获取分配时单个数据
      roleRowOne(selection, row){
        this.assignRolesSelectionData = selection;
      },
      //分配角色提交
      assignRolesSubmit(){
        var selectId = [];
        for(var i = 0; i < this.assignRolesSelectionData.length; i++){
          selectId.push(this.assignRolesSelectionData[i].id)
        }
        var dataId = selectId.join(",");
        var data = {
          "userId": this.assignRolesId,
          "roleId": dataId
        }
        data = Qs.stringify(data);
        this.$http.post("auth/admin/bind", data).then(res => {
          console.log(res)
          if(res.data.error_code == 2000){
            this.assignRolesSelectionData = "";
            this.assignRolesDialog = false;
            this.$message({
              message: '成功分配角色',
              type: 'success'
            });
            this.getAdminData();
          }else {
            this.$message.error('错了哦，分配角色失败');
          }
        })
      },
      //解绑角色
      unbundlingRole(id){
        this.unbundlingId = id;
        this.unbundlingDialog = true;
        var data = {
          id:this.unbundlingId
        }
        data = Qs.stringify(data);
        this.$http.post("auth/admin/role",data).then(res => {
          if(res.data.error_code == 2000){
            this.unbundlingRoleData =  res.data.data;
          }else {
            this.$message.error('错了哦，获取数据失败');
          }
        })
      },
      // 2.3 获取解绑时所有数据
      roleUnbindRowAll(selection){
        this.unbundlingRoleSelection = selection;
      },
      // 2.2 获取解绑时单个数据
      roleUnbindRowOne(selection, row){
        this.unbundlingRoleSelection = selection;
      },
      //解绑角色提交
      unbundlingSubmit(){
        var selectId = [];
        for(var i = 0; i < this.unbundlingRoleSelection.length; i++){
          selectId.push(this.unbundlingRoleSelection[i].id)
        }
        var dataId = selectId.join(",");
        var data = {
          "roleId": dataId,
          "userId": this.unbundlingId,
        }
        data = Qs.stringify(data);
        this.$http.post("auth/admin/unbind", data).then(res => {
          console.log(res)
          if(res.data.error_code == 2000){
            this.unbundlingRoleSelection = "";
            this.unbundlingDialog = false;
            this.$message({
              message: '成功解绑角色',
              type: 'success'
            });
            this.getAdminData();
          }else {
            this.$message.error('错了哦，解绑角色失败');
          }
        })
      },
      //编辑管理员
      editAccount(row){
        this.editAccountID = row.id;
        this.editAccountForm.name = row.name;
        this.editAccountForm.password = row.password;
        this.editAccountForm.username = row.username;
        this.editAccountForm.state = row.state;
        if (row.state == '0') {
          this.editAccountForm.state = "禁用"
        } else if (row.state == '1') {
          this.editAccountForm.state = "可用"
        }
        this.editAccountDialog = true;
      },
      //编辑管理员提交
      editAccountSubmit(formData){
        var patt1 = /^1(3|4|5|7|8)\d{9}$/;
        if (formData.username == '') {
          this.$message.error('错了哦，用户名必须填写');
          return false
        }else if (formData.password == '') {
          this.$message.error('错了哦，密码必须填写');
          return false
        } else if(/[\u4e00-\u9fa5]/g.test(formData.password)){
          this.$message.error('错了哦，密码不能为汉字');
          return false
        } else if (formData.name == '') {
          this.$message.error('错了哦，管理员姓名必须填写');
          return false
        } else if (formData.state == '') {
          this.$message.error('错了哦，状态必须选择');
          return false
        }
        var reg_username = /^[\u4E00-\u9FA5A-Za-z0-9(~!@#￥%&*)]+$/;
        var reg_password = /^[A-Za-z0-9(~!@#￥%&*)]+$/;
        // 先做判断
        if(!reg_username.test(formData.username)){
          this.$message.error('不支持特殊字符');
        } else if(!reg_password.test(formData.password)){
          this.$message.error('不支持特殊字符');
        }
        if (formData.state == "禁用") {
          formData.state = "0"
        } else if (formData.state == "可用") {
          formData.state = "1"
        }
        formData.id = this.editAccountID;
        formData = Qs.stringify(formData)
        this.$http.post("auth/admin/save", formData).then(res => {
          console.log(res)
          if (res.data.error_code == 102) {
            this.$message.error('编辑管理员失败,管理员名重复');
          } else {
            this.$message({
              message: '成功编辑管理员',
              type: 'success'
            });
            this.editAccountDialog = false;
            this.editAccountForm.name = '';
            this.editAccountForm.password = '';
            this.editAccountForm.username = '';
            this.editAccountForm.phone = '';
            this.editAccountForm.state = '';
            this.getAdminData();
          }
        })
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
        this.getAdminData();
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getAdminData();
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
