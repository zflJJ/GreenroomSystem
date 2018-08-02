<template>
  <div>
    <h2>角色列表</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" class="demo-form-inline" :model="searchFromData" @keyup.enter.native="searchEvent">
      <el-form-item label="角色名">
        <el-input placeholder="请输入角色名称" v-model.trim="searchFromData.name" @change="clearStart"></el-input>
      </el-form-item>
      <el-form-item label="创建的时间范围:">
        <div class="block">
          <el-date-picker
            v-model="valueTime6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="clearStart">
          </el-date-picker>
        </div>
      </el-form-item>
    </el-form>

    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="ID" prop="id" width="180px">
        </el-table-column>
        <el-table-column label="角色名称" prop="name" width="180px">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="350px">
          <template slot-scope="scope">
            {{scope.row.createTime|moment}}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180px">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1" style="color:#67C23A">已开放</span>
            <span v-else="scope.row.state!=1" style="color:#67C23A">已关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="viewPermissions(scope.row.id)">查看已有权限</el-button>
            <el-button size="mini" type="warning" @click="assign(scope.row.id)">分配权限</el-button>
            <el-button size="mini" type="danger" @click="unbundling(scope.row.id)">解绑权限</el-button>
            <el-button size="mini" type="primary" @click="editRole(scope.row.id,scope.row)">编辑角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" icon="el-icon-circle-plus" @click="addRoleDialogVisible = true">新增角色
      </el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>

    <el-dialog
      title="新增角色"
      :visible.sync="addRoleDialogVisible"
      width="30%">
      <span>角色名称</span>
      <el-input v-model="addRoleInput" placeholder="请输入角色名"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑"
      :visible.sync="editRoleDialogVisible"
      width="30%">
      <span>角色名称</span>
      <el-input v-model="editRoleInput" placeholder="请输入角色名"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看已有权限" :visible.sync="viewExistingPermissions">
      <el-table :data="viewPermissionsData">
        <el-table-column property="id" label="权限ID"></el-table-column>
        <el-table-column property="name" label="权限名称"></el-table-column>
        <el-table-column property="url" label="权限URL"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewExistingPermissions = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配权限" :visible.sync="assignPermissions">
      <el-table :data="assignPermissionsData"  @select="assignRowOne" @select-all="assignRowAll" ref="multipleTable">
        <el-table-column
          :reserve-selection="true"
          type="selection">
        </el-table-column>
        <el-table-column property="id" label="权限ID"></el-table-column>
        <el-table-column property="name" label="权限名称"></el-table-column>
        <el-table-column property="url" label="权限URL"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignPermissions = false">取 消</el-button>
        <el-button type="primary" @click="assignPermissionsSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="解绑权限" :visible.sync="unbundlingPermissions">
      <el-table :data="unbundlingPermissionsData"  @select="unbundlingPermissionsRowOne" @select-all="unbundlingPermissionsRowAll">
        <el-table-column type="selection"></el-table-column>
        <el-table-column property="id" label="权限ID"></el-table-column>
        <el-table-column property="name" label="权限名称"></el-table-column>
        <el-table-column property="url" label="权限URL"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unbundlingPermissions = false">取 消</el-button>
        <el-button type="primary" @click="unbundlingPermissionsSubmit">解除绑定</el-button>
      </span>
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
    color: red;
  }

  .divStyle {
    position: relative;
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
    data() {
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        searchFromData: {
          name: '',
          startCreateTime: '',
        },
        dataItems: [],
        valueTime6: [],
        addRoleDialogVisible: false,//新增角色的模态框
        addRoleInput: '',//新增角色的绑定input
        editRoleDialogVisible: false,//编辑角色模态框
        editRoleInput: '',//编辑角色input
        editId: '',//编辑角色的id,
        viewExistingPermissions: false,//查看已有权限的模态框
        viewPermissionsData: [],//查看已有权限的数据
        assignPermissions: false,//分配权限的模态框
        assignPermissionsData: [],//分配权限提交的权限数据的ID
        assignPermissionsSelectData: null,//分配权限选中的数据
        assignPermissionsSelectDataId: [],//分配权限选中的数据
        role:"",//角色ID
        unbundlingPermissions: false,//解绑权限模态框
        unbundlingPermissionsData: [],//解绑权限展示数据
        unbundlingPermissionsSelectionData: null,//解绑权限选择的数据
      }
    },
    created(){
      this.getRoleList();
    },
    methods: {
      // 不带参请求数据的地方
      getRoleList() {
        this.dataItems = [];
        var isData = {
          length: this.display,
          start: this.start,
          sEcho: 3,
        }
        var data = Qs.stringify(isData);
        this.$http.post('auth/role/pageable', data).then(res => {
          console.log(res.data);
          this.seachLoading = false;
          if (res.data.error_code !== 2000 && res.data.data.dataList.length != 0) {
            this.error_code = 0;
          } else {
            console.log(res.data.data.dataList)
            this.dataItems = res.data.data.dataList;
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log(err);
        });
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
          this.getRoleList();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        if (this.isSearch == 0) {
          this.getRoleList();
        } else if (this.isSearch == 1) {
          this.paramsData();
        }
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
        console.log(this.valueTime6[0].getTime())
        if (this.valueTime6 != '[object Null]') {
          this.valueTime6[0] = new Date(this.valueTime6[0]).getTime();//开始时间
          this.valueTime6[1] = new Date(this.valueTime6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.name == '' && this.valueTime6.length == 0) {
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
          if (this.searchFromData.name == '' && this.valueTime6 == '[object Null]') {
            this.start = 0;
            this.isSearch = 0;
            this.getRoleList();
          } else if (this.searchFromData.name != '' || this.valueTime6 != '[object Null]') {
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
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        if (this.valueTime6) {
          datas.startCreateTime = this.valueTime6[0];
          datas.endCreateTime = this.valueTime6[1];
        }
        // 开始发送请求
        var data = Qs.stringify(datas);
        this.$http.post('auth/role/pageable', data).then(res => {
          this.seachLoading = false;
          if (res.data.error_code == 2000 && res.data.data.dataList.length > 0) {
            this.total = parseInt(res.data.data.itotalRecords);
            this.dataItems = res.data.data.dataList;
            console.log(this.dataItems);
          } else {
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
      // 导出数据
      exportEvent(){
        this.isLoading = true;
        if (this.searchFromData.name === "" && this.valueTime6.length == 0) {
          this.text = "导出的字段不能为空，请输入要导出的字段";
          this.isflag = true;
          clearInterval(timeId);
          var timeId = setInterval(() => {
            this.isLoading = false;
            this.isflag = false;
            clearInterval(timeId);
          }, 3000);
          return;
        } else {
          var exportDatas = {};
          if (this.searchFromData.name) exportDatas.name = this.searchFromData.name;
          if (this.valueTime6) {
              exportDatas.startCreateTime = this.valueTime6[0];
              exportDatas.endCreateTime = this.valueTime6[1];
          }
          var data = Qs.stringify(exportDatas);
          this.$http.post('auth/role/excel', data, {responseType: 'blob'}).then((res) => {
            this.isLoading = false;
            var filename = '角色列表表格'
            var blob = res.data;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
              var a = document.createElement("a");
              a.download = filename + ".xls";
              a.href = e.target.result;
              a.click();
            }
          }).catch((err) => {
            this.text = '输入的导出字段有误，请重新确认导出的字段！';
            this.isflag = true;
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.isLoading = false;
              this.text = '';
              this.isflag = false;
            }, 3000);
          })
        }
      },
      //新增角色
      addRole() {
        if (this.addRoleInput == '') {
          this.$message.error('错了哦，角色名称必须填写');
        } else {
          var name = {
            "name": this.addRoleInput
          };
          var data = Qs.stringify(name);
          console.log(name)
          this.$http.post('auth/role/save', data).then(res => {
            console.log(res)
            if(res.data.error_code == 2305){
              this.$message.error('错了哦，角色名称重复');
            }else if(res.data.error_code == 2000){
              this.$message.success('恭喜你，新增角色成功');
              this.getRoleList();
              this.addRoleDialogVisible = false;
              this.addRoleInput = "";
            }else {
              this.$message.error('错了哦，新增角色失败');
            }
          }).catch(err=>{
              console.log(err)
          })
        }
      },
      //编辑角色
      editRole(id, row){
        this.editRoleInput = row.name;
        this.editRoleDialogVisible = true;
        this.role = id;
      },
      //提交编辑角色
      editRoleSubmit(){
        if (this.editRoleInput == '') {
          this.$message.error('错了哦，角色名称必须填写');
        } else {
          var name = {
            "id": this.role,
            "name": this.editRoleInput
          };
          var data = Qs.stringify(name);
          this.$http.post('auth/role/save', data).then(res => {
            if(res.data.error_code == 2305){
              this.$message.error('错了哦，角色名称重复');
              return false;
            }else if(res.data.error_code == 2000){
              this.$message.success('恭喜你，编辑角色成功');
              this.getRoleList();
              this.editRoleDialogVisible = false;
            }else {
              this.$message.error('错了哦，编辑角色失败');
            }
          })
        }
      },
      //查看已有权限
      viewPermissions(id){
        this.viewExistingPermissions = true;
        var data = {
          id:id
        }
        data = Qs.stringify(data);
        this.$http.post("auth/role/permission",data).then(res => {
          if(res.data.error_code == 2000){
            this.viewPermissionsData = res.data.data;
          }else {
            this.$message.error('错了哦，请求失败');
          }
        })
      },
      //分配权限
      assign(id){
        this.role = id;
        this.assignPermissions = true;
        var data = {
          id:id
        }
        data = Qs.stringify(data);
        this.$http.post("auth/role/noPermission",data).then(res => {
          if(res.data.error_code == 2000){
            this.assignPermissionsData = res.data.data;
          }else {
            this.$message.error('错了哦，请求失败');
          }
        })
      },
      // 2.3 获取分配时所有数据
      assignRowAll(selection){
        this.assignPermissionsSelectData = selection;
        selection = null;
      },
      // 2.2 获取分配时单个数据
      assignRowOne(selection, row){
        this.assignPermissionsSelectData = selection;
        console.log(this.assignPermissionsSelectData )
        selection = null;
      },
      //分配权限提交事件
      assignPermissionsSubmit(){
        var selectId = [];
        for(var i = 0; i < this.assignPermissionsSelectData.length; i++){
          selectId.push(this.assignPermissionsSelectData[i].id)
        }
        var dataId = selectId.join(",");
        var data = {
          "roleId": this.role,
          "permissionId": dataId
        };
        data = Qs.stringify(data);
        console.log(dataId)
//        return false;
        this.$http.post("auth/role/bind", data).then(res => {
          console.log(res)
          if(res.data.error_code == 2000){
            this.assignPermissions = false;
            this.assignPermissionsSelectData = null;
            this.assignPermissionsSelectDataId = [];
            selectId = null;
            this.$message.success('恭喜你，分配权限成功');
            //清除选择的权限数据
            this.$refs.multipleTable.clearSelection();
          }else {
            this.$message.error('错了哦，请求失败');
          }
        })
      },
      //解绑权限
      unbundling(id){
        this.role = id;
        var data = {
          "id": this.role,
        };
        data = Qs.stringify(data);
        this.unbundlingPermissions = true;
        this.$http.post("auth/role/permission",data).then(res => {
          if(res.data.error_code == 2000){
            this.unbundlingPermissionsData = res.data.data;
          }else {
            this.$message.error('错了哦，请求失败');
          }
        })
      },
      // 2.3 获取解绑时所有数据
      unbundlingPermissionsRowAll(selection){
        this.unbundlingPermissionsSelectionData = selection;
        selection = null;
      },
      // 2.2 获取解绑时单个数据
      unbundlingPermissionsRowOne(selection){
        this.unbundlingPermissionsSelectionData = selection;
        selection = null;
      },
      //解绑权限提交
      unbundlingPermissionsSubmit(){
        var selectId = [];
        for(var i = 0; i < this.unbundlingPermissionsSelectionData.length; i++){
          selectId.push(this.unbundlingPermissionsSelectionData[i].id)
        }
        selectId = selectId.join(",");

        var data = {
          "permissionId": selectId,
          "roleId": this.role.toString()
        }
        console.log(data)
        data = Qs.stringify(data);
        this.$http.post("auth/role/unbind", data).then(res => {
          console.log(res)
          if(res.data.error_code == 2000){
            this.unbundlingPermissionsSelectionData = null;
            this.unbundlingPermissions = false;
            selectId = [];
            this.$message.success('恭喜你，解绑权限成功');
          }else {
            this.$message.error('错了哦，解绑权限失败');
          }
        })
      }
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
