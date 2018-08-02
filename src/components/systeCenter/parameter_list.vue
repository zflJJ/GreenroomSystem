<template>
  <div>
    <h2>参数列表1.2</h2>
    <!--1.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
    </div>

    <!--2.0 表格信息-->
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
          prop="qhKey"
          label="参数名">
        </el-table-column>
        <el-table-column
          prop="qhValue"
          label="参数值">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">有效</span>
            <span v-else>无效</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="编辑操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="editTag(scope.row.id,scope.row)">编辑参数</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="addTag">新增参数</el-button>
    </div>
    <!--3.0 分页插件-->
    <paingchild  :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                 v-on:pagechange="pagechanges"></paingchild>
    <!--4.0模态框-->
    <el-dialog
      :title="titleText"
      :visible.sync="dialogFormVisible"
      :show-close="showX"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="modelStyle">
      <el-form>
        <el-form-item label="参数名">
          <el-input auto-complete="off" v-model="key" :disabled="tageId != ''"></el-input>
        </el-form-item>
        <el-form-item label="参数值">
          <el-input auto-complete="off" v-model="value"></el-input>
        </el-form-item>
        <span v-show="isShow">{{modeltext}}</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="returnEvent">取消</el-button>
        <el-button type="primary" @click="gitDatas" :loading="submitLoading">{{subText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
  .isBtnStyle1 {
    position: absolute;
    right: 150px;
    top: 13px;
  }

  .isBtnStyle2 {
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
</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        // 分页所用参数
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        // 表格使用的参数
        tableDatas: [],
        pageDatas:[],

        // 模态框中的数据
        // 模态框的信息
        modeltext: '',  // 模态框提示信息
        isShow: false,   // 是否显示
        dialogFormVisible: false,  // 模态框是否显示
        submitLoading:false,
        titleText: '',   // 模态框的名字
        showX: false, // 模态框固定参数
        value: '',   // 参数值
        key:'',      // 参数名
        state:1,
        tageId: '',    // 修改标签名需要的参数
        paramsName:'',
        subText:'',
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
        this.$http.post('params/pageable',data).then(res => {
          if (res.data.error_code === 2000) {
            // 赋值表格处理数据, 表格的总量
            this.total = parseInt(res.data.data.itotalRecords);
            this.tableDatas = res.data.data.dataList;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log('服务端错误' + err);
        })
      },

      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTableDatas()
      },
      // 下拉菜单的数据
      getChildLength(len){
        // 数据是一次请求回来的，要对数据进行拆分
        var pageData = 0, age = 0,start;
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
        start = (age - 1) * len;
        this.page = age;
        this.compage = age;
        this.display = parseInt(len);
        this.tableDatas = this.pageDatas.slice(start,start + this.display);
      },

      // 新增参数
      addTag(){
        this.titleText = '新增参数';
        this.subText = '新增参数';
        this.dialogFormVisible = true;
      },

      // 修改标签名
      editTag(tagId,scopeRow){
        this.tageId = tagId;
        this.key = scopeRow.key;
        this.titleText = '编辑参数';
        this.subText = '编辑参数';
        this.dialogFormVisible = true;
        this.key = scopeRow.qhKey;
        this.value = scopeRow.qhValue;
      },

      // 模态框搜索数据
      gitDatas(){
        // 对数据进行判断
        this.submitLoading = true;
        if(this.tageId == ''){  // 表示新增数据
          if(this.value.trim() == '' || this.key.trim()  == ''){
            this.$message.error('参数名 或 参数值不能为空');
          }else{
            var data = Qs.stringify({qhvalue:this.value,qhkey:this.key,state:1});
          }
        }else{  // 有id表示修改数据 ，只需要判断value即可，存在 ： 进行数据整合 不存在返回并且提示用户
          if(this.value.trim() == '' || this.key.trim() == ''){
            this.$message.error('参数名 或 参数值不能为空');
          }else{
              var data = Qs.stringify({qhvalue:this.value,qhkey:this.key,state:1,id:this.tageId});
          }
        }
        // 发送请求
        this.$http.post('params/saveUpdate', data).then((res) => {
          this.submitLoading = false;
          if (res.data.error_code !== 2000) {
            this.$message.error(res.data.error_message);
          } else if (res.data.error_code == 2000) {
            this.$message({
              message: '恭喜你，成功提交系统参数',
              type: 'success'
            });
            // 关闭模态框  , 跳转到第一页
            this.modeltext = '';
            this.isShow = false;
            this.key = '';
            this.value = '';
            this.dialogFormVisible = false;
            this.key = '';

            if(this.tageId == ''){
              // 新增数据
              this.start = 0;
              // 对数据进行处理
              this.compage = 1;
              this.getTableDatas();
            }else{
              // 编辑数据
              this.tageId = '';
              console.log(this.compage);
              this.start = (this.compage - 1) * this.display;
              this.getTableDatas();
            }
          }
        }).catch((err) => {
          this.submitLoading = false;
          console.log(err);
        });
      },

      returnEvent(){
        this.modeltext = '';
        this.isShow = false;
        this.tagname = '';
        this.tageId = '';
        this.key = '';
        this.value = '';
        this.dialogFormVisible = false;
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>

