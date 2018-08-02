<template>
  <div>
    <h2>活动管理</h2>
    <br>
    <!--1.0 搜索框-->
    <el-form :inline="true" :model="searchFromData" class="demo-form-inline">
      <el-form-item label="活动名称">
        <el-input placeholder="请输入活动名称" v-model.trim="searchFromData.name" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
      </el-form-item>
      <el-form-item label="活动类型">
        <el-select v-model="searchFromData.type" placeholder="全部">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchFromData.state" placeholder="全部">
          <el-option
            v-for="item in states"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--引入下拉框子组件-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <el-button type="primary" @click="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索</el-button>
    </div>
    <template>
      <!--宽度设置成百分比-->
      <el-table :data="dataItems" border style="width: 100%">
        <el-table-column label="序号" prop="id">
        </el-table-column>
        <el-table-column label="活动名称" prop="name">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动描述" prop="intro">
        </el-table-column>
        <el-table-column label="活动类型" prop="typeStr">
        </el-table-column>
        <el-table-column label="活动链接" prop="href">
        </el-table-column>
        <el-table-column label="累计浏览人数" prop="browseCount">
        </el-table-column>
        <el-table-column label="累计参与人数" prop="participateCount">
        </el-table-column>
        <el-table-column label="累计获奖总数" prop="prizeCount">
        </el-table-column>
        <el-table-column label="活动时间">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime | moment}}至{{scope.row.endTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="stateStr">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="info" @click="activityDetail(scope.row.id)">查看详情
            </el-button>
            <br>
            <el-button size="mini" type="success" @click="prizeStatistics(scope.row.id,scope.row.name,scope.row.beginTime,scope.row.endTime,scope.row.typeStr,scope.row.type)">查看统计
            </el-button>
            <br>
            <el-button size="mini" type="warning" @click="activityEdit(scope.row.id)" :disabled="scope.row.stateStr!='待开始'">编辑
            </el-button>
            <br>
            <el-button size="mini" type="danger" @click="activityStop(scope.row.id)" :disabled="scope.row.stateStr=='已停止'||scope.row.stateStr=='已过期'">停止活动
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="bottomStyle">
      <el-button type="primary"  @click="activityAdd">添加活动</el-button>
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

        dataItems: [],
        seachLoading: false,  // 搜索是否禁用
        isSearch: 0, // 是否进行了搜索
        searchFromData: {
          name:"",
          type:"",
          state:"",
        },
        types:[{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '邀请'
        },{
          value: '2',
          label: '注册'
        },{
          value: '3',
          label: '首次下单'
        },{
          value: '4',
          label: '绑车牌'
        }],
        states:[{
          value: '',
          label: '全部'
        },{
          value: '0',
          label: '已停止'
        },{
          value: '1',
          label: '进行中'
        },{
          value: '2',
          label: '待开始'
        },{
          value: '3',
          label: '已过期'
        }],
      }
    },
    created(){
      this.getData();
    },
    methods: {
      //获得数据
      getData(){
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        if (this.searchFromData.type) datas.type = this.searchFromData.type;
        if (this.searchFromData.state) datas.state = this.searchFromData.state;
        var datas = Qs.stringify(datas);
        this.$http.post("activity/list", datas).then(res => {
          if(res.data.error_code == 2000){
            this.dataItems = res.data.data.dataList;
            for(var i = 0; i < this.dataItems.length; i++){
              try{
                if(this.dataItems[i].intro.length > 20){
                  this.dataItems[i].intro = this.dataItems[i].intro.slice(0,20)+"...";
                }
              }catch (err){}

            }
            // 当数据回来之后再做页码处理
            this.total = parseInt(res.data.data.itotalRecords);
            this.seachLoading = false;
          }else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err=>{
          this.seachLoading = false;
          console.log(err);
        })
      },
      // 搜索数据
      searchEvent(){
        this.seachLoading = true;
        if (this.isSearch == 0) {
          if (this.searchFromData.name == '' && this.searchFromData.type == '' && this.searchFromData.state == '') {
            this.$message.error('错了哦，输入的搜索内容不能为空，请填入搜索字段');
            this.seachLoading = false;
            return;
          } else {
            // 开始进行搜索
            this.start = 0;
            this.isSearch = 1;
            this.getData();
          }
        } else if (this.isSearch == 1) {
          //第二次都为空搜索第一条数据
          if (this.searchFromData.name == '' && this.searchFromData.type === '' && this.searchFromData.state == '') {
            this.start = 0;
            this.isSearch = 0;
          }
          this.getData();
        };
      },
      // 分页的地方(这里逻辑还有待处理)
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        this.getData();
      },
      // 下拉菜单的选择器
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
        this.getData();
      },
      // 文本输入框变化的时候，start置0
      clearStart(){
        this.start = 0;
        this.compage = 1;
      },

      //查看统计
      prizeStatistics(id,name,beginTime,endTime,typeStr,type){
        console.log(type)
        //id,活动名称,开始结束时间,活动类型(用于表格是否显示多两列)
        this.$router.push({path: 'activityStatistics',query:{id:id,name:name,beginTime:beginTime,endTime:endTime,typeStr:typeStr,type:type}});
      },
      //停止活动
      activityStop(id){
        this.$http.get("activity/delete?id="+id).then(res =>{
          console.log(res)
          if(res.data.error_code == 2000){
            this.$message.success("成功停止活动");
            this.getData();
          }else {
            this.$message.error(res.data.error_message)
          }
        })
      },
      //编辑
      activityEdit(id){
        this.$router.push({path: 'activity', query: {title: "编辑活动",id:id}});
      },
      //查看详情
      activityDetail(id){
        this.$router.push({path: 'activity', query: {title: "查看活动",id:id}});
      },
      //添加
      activityAdd(){
        this.$router.push({path: 'activity', query: {title: "添加活动"}});
      },
    },
    // 子组件
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
