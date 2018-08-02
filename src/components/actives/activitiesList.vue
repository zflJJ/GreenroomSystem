<template>
  <div>
    <h2>注册来源标记</h2>
    <br>

    <!--3.0 下拉菜单-->
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
          prop="source"
          label="广告来源">
          <template slot-scope="scope">
            <span v-if="scope.row.source">{{scope.row.source}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="medium"
          label="广告媒介">
          <template slot-scope="scope">
            <span v-if="scope.row.medium">{{scope.row.medium}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="content"
          label="广告内容">
          <template slot-scope="scope">
            <span v-if="scope.row.content">{{scope.row.content}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="keyword"
          label="广告关键词">
          <template slot-scope="scope">
            <span v-if="scope.row.keyword">{{scope.row.keyword}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="series"
          label="广告系列">
          <template slot-scope="scope">
            <span v-if="scope.row.series">{{scope.row.series}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名">
          <template slot-scope="scope">
            <span v-if="scope.row.fileName">{{scope.row.fileName}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="URL">
        </el-table-column>
        <el-table-column
          prop="pv"
          label="pv">
        </el-table-column>
        <el-table-column
          prop="uv"
          label="uv">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="edit(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="footStyle">
      <el-button type="primary" size="small" @click="dialogFormVisible=true">新增活动</el-button>
    </div>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" custom-class="modelStyle" :show-close=false :close-on-press-escape=false>
        <el-form :model="modeForm">
          <el-row :gutter="30">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="广告来源">
                  <el-input auto-complete="off" v-model="modeForm.source" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="广告媒介">
                  <el-input auto-complete="off" v-model="modeForm.medium" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="广告内容">
                  <el-input auto-complete="off" v-model="modeForm.content" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="广告关键字">
                  <el-input auto-complete="off" v-model="modeForm.keyword" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="广告系列">
                  <el-input auto-complete="off" v-model="modeForm.series" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="文件名">
                  <el-input auto-complete="off" v-model="modeForm.fileName" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="备注">
                  <el-input auto-complete="off" v-model="modeForm.remark" :maxlength=20></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close" type="danger">返回</el-button>
          <el-button type="success" @click="addActiveSubmit">提交</el-button>
        </div>
      </el-dialog>

    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>
  </div>
</template>
<style scoped>
  .footStyle {
    height: 60px;
    padding: 5px;
    line-height: 50px;
    border: 1px solid #ebeef5;
    border-top: none;
    text-align: right;
  }

  .isInfoStyle {
    color: red;
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

  .float {
    float: right;
    margin-top: 20px;
  }
</style>
<script>
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  import Qs from 'qs';
  import  baseUrl from '../../server/baseURL';
  export default{
    data(){
      return {
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],//列表数据的数组
        dialogFormVisible: false,//模态框
        // 模态框中的from 表单的数据
        modeForm: {
          source: '',
          medium: '',
          content: '',
          keyword: '',
          series: '',
          remark: '',
          fileName:'',
          id:'',
        },
        url:'',
        title:"新增注册来源标记"
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      //进入页面获取活动信息
      getTableDatas(){
        var data = {
          start :this.start,
          sEcho : 3,
          length : this.display,
        }
        data = Qs.stringify(data)
        this.$http.post("register/pageable",data).then(res => {
          console.log(res);
          if(res.data.error_code == 2000){
            this.tableDatas = res.data.data.dataList;
            this.total = parseInt(res.data.data.itotalRecords);
            for(var i = 0; i <this.tableDatas.length; i++){
              this.tableDatas[i].url = baseUrl.h5BaseUrl + "?id=" + this.tableDatas[i].id ;
            }
          }
        })
      },

      //模态框提交事件
      addActiveSubmit(){
        console.log(this.modeForm)
        var data = Qs.stringify(this.modeForm)
        this.$http.post("register/save", data).then(res => {
          if (res.data.error_code == 2000) {
            if(this.modeForm.id){
              this.$message.success('恭喜你，编辑注册来源标记成功了');
            }else {
              this.$message.success('恭喜你，新增注册来源标记成功了');
            }
            this.dialogFormVisible = false;
            this.modeForm.source = '';
            this.modeForm.medium = '';
            this.modeForm.content = '';
            this.modeForm.keyword = '';
            this.modeForm.series = '';
            this.modeForm.fileName = '';
            this.modeForm.remark = '';
            this.modeForm.id = '';
            this.getTableDatas();
          } else {
            this.$message.error('错了哦，服务器返回了' + res.data.error_message);
          }
        })
      },
      // 模态框返回事件
      close(){
        // 清空表格里面的内容
        this.modeForm.source = '';
        this.modeForm.medium = '';
        this.modeForm.content = '';
        this.modeForm.keyword = '';
        this.modeForm.series = '';
        this.modeForm.fileName = '';
        this.modeForm.remark = '';
        this.modeForm.id = '';
        this.dialogFormVisible = false;
      },
      //编辑
      edit(id){
        this.dialogFormVisible = true;
        this.title = "编辑注册来源标记";
        this.$http.get("register/one/" + id).then(res => {
          console.log(res)
          try {
            this.modeForm.id = res.data.data.id;
            this.modeForm.source = res.data.data.source;
            this.modeForm.medium = res.data.data.medium;
            this.modeForm.content = res.data.data.content;
            this.modeForm.keyword = res.data.data.keyword;
            this.modeForm.series = res.data.data.series;
            this.modeForm.remark = res.data.data.remark;
            this.modeForm.fileName = res.data.data.fileName;
          }catch (e){

          }

        })
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getTableDatas();
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
        this.getTableDatas();
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
