<template>
  <div>
    <h2>权限列表</h2>
    <br>
    <!--3.0 下拉菜单 和 导出数据-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>

    <!--4.0 表格信息-->
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
          prop="name"
          label="权限名">
        </el-table-column>
        <el-table-column
          prop="url"
          label="权限url">
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime==undefined || scope.row.createTime === '' || scope.row.createTime === null">-</span>
            <span v-else>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">有效</span>
            <span v-else="scope.row.state == 0">失效</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="warning" @click="edit(scope.row)">编辑权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary" @click='addDialog=true'>新增权限</el-button>
    </div>
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>

    <el-dialog title="新增权限" :visible.sync="addDialog">
      <el-form :model="addForm">
        <el-form-item>
          <el-row>
            <el-col :span="12">权限规则说明</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">通配符</el-col>
            <el-col :span="12">说明</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">?</el-col>
            <el-col :span="12">匹配任何单字符</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">*</el-col>
            <el-col :span="12">匹配0或者任意数量的字符</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">**</el-col>
            <el-col :span="12">匹配0或者更多的目录</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">例如：</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">- /parklot/pageable 代表匹配的url为停车场分页列表</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">- /parklot/** 代表匹配/parklot开头的所有url</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">- /file/*.jpg 代表匹配已jpg为后缀名的文件</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="权限名">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限url">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClose">取 消</el-button>
        <el-button type="primary" @click="addSubmit(addForm)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑权限" :visible.sync="editDialog">
      <el-form :model="editForm">
        <el-form-item>
          <el-row>
            <el-col :span="12">权限规则说明</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">通配符</el-col>
            <el-col :span="12">说明</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">?</el-col>
            <el-col :span="12">匹配任何单字符</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">*</el-col>
            <el-col :span="12">匹配0或者任意数量的字符</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">**</el-col>
            <el-col :span="12">匹配0或者更多的目录</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">例如：</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">- /parklot/pageable 代表匹配的url为停车场分页列表</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">- /parklot/** 代表匹配/parklot开头的所有url</el-col>
          </el-row>
          <el-row>
            <el-col :span="12">- /file/*.jpg 代表匹配已jpg为后缀名的文件</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="权限名">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限url">
          <el-input v-model="editForm.url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
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
</style>

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
        addDialog:false,
        addForm:{
          name:'',
          url:''
        },
        editDialog:false,
        editForm:{
          name:'',
          url:''
        },
        editData: null,
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      getTableDatas(){
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('auth/permission/pageable', data).then(res => {
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.seachLoading = false;
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },
      //提交数据
      addSubmit(){
        if(this.addForm.name == ""){
          this.$message.error('错了哦，权限名称不能为空');
        }else if(this.addForm.url == ""){
          this.$message.error('错了哦，权限URL不能为空');
        }else {
          var data = {
            name : this.addForm.name,
            url : this.addForm.url,
          }
          data = Qs.stringify(data);
          this.$http.post("auth/permission/save",data).then(res => {
            if(res.data.error_code == 2000){
              this.addDialog = false;
              this.$message.success('恭喜你，新增权限成功');
              this.getTableDatas();
              this.addForm.name = "";
              this.addForm.url = "";
            }else if(res.data.error_code == 2305){
              this.$message.error('错了哦，权限名称或URL重复');
            }else {
              this.$message.error('错了哦，新增权限失败');
            }
          })
        }
      },
      //取消添加
      addClose(){
        this.addDialog = false;
        this.addForm.name = "";
        this.addForm.url = "";
      },
      //编辑
      edit(row){
        this.editDialog = true;
        this.editForm.name = row.name;
        this.editForm.url = row.url;
        this.editData = row;
      },
      //编辑提交
      editSubmit(){
        if(this.editForm.name == ""){
          this.$message.error('错了哦，权限名称不能为空');
        }else if(this.editForm.url == ""){
          this.$message.error('错了哦，权限URL不能为空');
        }else {
          var data = {
            id: this.editData.id,
            name : this.editForm.name,
            url : this.editForm.url,
          }
          data = Qs.stringify(data);
          this.$http.post("auth/permission/save",data).then(res => {
            if(res.data.error_code == 2000){
              this.editDialog = false;
              this.$message.success('恭喜你，编辑权限成功');
              this.getTableDatas();
            }else if(res.data.error_code == 2305){
              this.$message.error('错了哦，权限URL重复');
            }else {
              this.$message.error('错了哦，新增权限失败');
            }
          })
        }
      },
      //编辑取消
      editClose(){
        this.editDialog = false;
        this.editForm.name = "";
        this.editForm.url = "";
      },
      // 下拉菜单的数据
      getChildLength(len){
        var pageData = 0, age = 0;
        console.log(this.page);
        pageData = this.display * (this.page - 1);
        if (pageData % len == 0) {
          age = (pageData / len + 1);
        } else {
          age = Math.ceil(pageData / len);
        }
        // age 是表示从哪一页开始
        this.start = (age - 1) * len;
        this.page = age;
        this.compage = age;
        this.display = parseInt(len);
        this.getTableDatas();
      },
      // 分页菜单的数据
      pagechanges(val){
        console.log(val);
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTableDatas();
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
