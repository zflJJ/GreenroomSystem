<template>
  <div>
    <h2>车位申请列表</h2>
    <br>
    <!--2.0 搜索框的样式-->
    <div class="searchStyle">
      <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
        <el-form-item label="地区名称">
          <el-input placeholder="请输入地区名称" v-model.trim="searchFromData.areaName" @change="clearStart" @keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="小区名称">
          <el-input placeholder="请输入小区名称" v-model.trim="searchFromData.parklotName" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input placeholder="请输入联系电话" v-model.trim="searchFromData.contactPhone" @change="clearStart"@keyup.enter.native="searchEvent"></el-input>
        </el-form-item>
        <el-form-item label="申请的时间范围">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="value6"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="setTime">
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--3.0 下拉菜单-->
    <div class="divStyle">
      <selectchild v-on:getlength="getChildLength"></selectchild>
      <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
      <el-button type="primary" @click.native.prevent="searchEvent" :loading="seachLoading" class="isBtnStyle1">搜索
      </el-button>
      <el-button type="success" @click="exportEvent" :loading="isLoading" class="isBtnStyle2">导出数据</el-button>
    </div>
    <!--4.0 表格信息-->
    <template>
      <el-table
        style="width: 100%"
        :data="tableDatas"
        border>
        <el-table-column
          prop="id"
          width="80px"
          label="工单ID">
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="地区名称">
        </el-table-column>
        <el-table-column
          width="200px"
          prop="parklotName"
          label="小区名称">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="用户手机号">
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话">
        </el-table-column>

        <el-table-column
          label="申请日期">
          <template slot-scope="scope">
            <span>{{scope.row.applyTime | moment}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="完成日期">
          <template slot-scope="scope">
            <span v-if="scope.row.completeTime">{{scope.row.completeTime | moment}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 0 || !scope.row.state">未处理</span>
            <span v-else-if="scope.row.state == 1700">未处理</span>
            <span v-else-if="scope.row.state == 1701">通过</span>
            <span v-else-if="scope.row.state == 1702">已拒绝</span>
          </template>
        </el-table-column>

        <el-table-column
          label="审核">
          <template slot-scope="scope">
            <!--未作出处理的情况-->
            <template v-if="!scope.row.state || scope.row.state == 1700">
              <el-button type="success" size="small" @click.native.prevent="passEvent(scope.$index,tableDatas,1)">通过
              </el-button>
              <el-button type="warning" size="small" @click.native.prevent="passEvent(scope.$index,tableDatas,2)">不通过
              </el-button>
            </template>
            <template v-else>
              <el-button type="info" disabled size="small">已处理</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--5.0 分页插件-->
    <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                v-on:pagechange="pagechanges"></paingchild>

    <!--6.0 模态框-->
    <el-dialog title="输入不通过的理由（字数限制72个字包括，包括标点符号）" :visible.sync="dialogFormVisible" :show-close="false"
               custom-class="modelStyle">
      <el-input
        type="textarea"
        :rows="4"
        maxlength="72"
        placeholder="请输入内容不通过的理由"
        v-model="remark">
      </el-input>
      <br><br>
      <el-alert
        v-show="errorShow === 1"
        :title="errorTitle"
        :closable="false"
        type="error"
        show-icon>
      </el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="returnPage">返回</el-button>
        <el-button type="primary" @click="gitDatas" :loading="NgLoading">提交</el-button>
      </div>
    </el-dialog>
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

  .searchStyle {
    height: 50px;
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
  }

</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        //分页插件传递的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        tableDatas: [],
        // 搜索区域的内容
        seachLoading: false,  // 搜索是否禁用
        isLoading: false, // 导出是否可用
        isSearch: 0, // 是否进行了搜索
        isflag: '',
        text: '',
        value6: [],// 对时间进行处理

        searchFromData: {
          contactPhone: '', // 联系电话
          areaName: '', // 地区名称
          parklotName: '',// 小区名称
        },

        dialogFormVisible: false, // 模态框是否显示
        remark: '', // 输入短信的内容
        params: {}, // 不通过的时候，一些公共的属性
        errorTitle: '', // 错误提示信息
        NgLoading: false, // 是否显示加载
        errorShow: 0,
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      getTableDatas(){
        // 1. 对输入框中的内容做判断
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        if (this.searchFromData.contactPhone !== '') datas.contactPhone = this.searchFromData.contactPhone;
        if (this.searchFromData.areaName !== '') datas.areaName = this.searchFromData.areaName;
        if (this.searchFromData.parklotName !== '') datas.parklotName = this.searchFromData.parklotName;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]' || this.value6 === [] || this.value6 == null) {
          this.value6 = [];
        } else {
          if (this.value6[0]) datas.startApplyTime = this.value6[0];
          if (this.value6[1]) datas.endApplyTime = this.value6[1];
        }
        console.log(datas);
        var data = Qs.stringify(datas);
        this.$http.post('apply/pageable', data).then(res => {
          if(res.data.error_code == 2000){
            // 按钮不用禁用了
            this.seachLoading = false;
            if (res.data.error_code == 2000 && res.data.data.dataList.length != 0) {
              this.total = parseInt(res.data.data.itotalRecords);
              // 这里可以再次优化（在搜索内容为不合格的时候，提示用户）
              this.tableDatas = res.data.data.dataList;
            } else {
              this.$message.error("未能搜索到匹配的条件，请重新数据搜索条件！！");
              this.isLoading = false;
              this.isflag = false;
            };
          }else {
            this.$message.error(res.data.error_message)
          }
        }).catch(err => {
          this.seachLoading = false;
          this.flag = true;
          this.text = '服务器返回错误，联系后台开发人员！！';
          setInterval(() => {
            this.isLoading = false;
            this.flag = false;
          }, 3000);
        })
      },

      //获取搜索的内容
      searchEvent(){
        this.seachLoading = true;
        // 带条件进行分页处理      contactPhone: '', // 联系电话 areaName: '', // 地区名称 parklotName: '',//
        // 点击了搜索是按搜索模式做分页， 没点击搜索是按普通模式做分页  ,加上搜索字段
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          // 前提对搜索的条件进行判断
          var gettype = Object.prototype.toString;
          if (gettype.call(this.value6) === '[object Null]' || this.value6 === []|| this.value6 === null) {
            this.value6 = [];
          };
          if (this.searchFromData.contactPhone === "" && this.searchFromData.areaName === ""
            && this.searchFromData.parklotName === "" && this.value6.length === 0) {
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
          } else {  // 当走到这里的时候，表示要进行第一次搜索
            // 不管好多页，搜索默认就开始第一页的方式, 长度不变
            this.start = 0;
            this.isSearch = 1;
            // 开始进行带参分页
            this.getTableDatas();
          }
        } else if (this.isSearch == 1) {
          if (this.searchFromData.contactPhone === "" && this.searchFromData.areaName === "" && this.searchFromData.parklotName === ""
            && this.value6 == null) {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
          }
          this.getTableDatas();
        }
      },

      // 导出数据
      exportEvent(){
        this.isLoading = true;
        var gettype = Object.prototype.toString;
        if (gettype.call(this.value6) === '[object Null]') {
          this.value6 = [];
        }
        if (this.searchFromData.contactPhone == "" && this.searchFromData.areaName == "" && this.searchFromData.parklotName == ""
          && this.value6.length == 0) {
          this.text = "没有导出数据的条件，数据无法进行导出";
          this.isflag = true;
          setInterval(() => {
            this.isLoading = false;
            this.isflag = false;
          }, 3000)
          return;
        } else {
          var exportDatas = {};
          exportDatas.start = this.start;
          exportDatas.sEcho = 3;
          exportDatas.length = this.display;
          if (this.searchFromData.contactPhone) exportDatas.contactPhone = this.searchFromData.contactPhone;
          if (this.searchFromData.areaName) exportDatas.areaName = this.searchFromData.areaName;
          if (this.searchFromData.parklotName) exportDatas.parklotName = this.searchFromData.parklotName;
          if (this.value6[0]) exportDatas.startApplyTime = this.value6[0];
          if (this.value6[1]) exportDatas.endApplyTime = this.value6[1];
          var data = Qs.stringify(exportDatas);
          this.$http.post('apply/excel', data, {responseType: 'blob'}).then(res => {
            this.isLoading = false;
            var filename = '车位申请列表表格'
            var blob = res.data;
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
              var a = document.createElement("a");
              a.download = filename + ".xls";
              a.href = e.target.result;
              a.click();
            }
          }).catch(err => {
            this.isLoading = false;
            this.$message.error("导出数据错误，请输入导出数据的条件");
          })
        }
      },

      // 下拉菜单的数据  和 分页都还没有做处理
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
        /*if (this.isSearch == 0) {
         this.getTableDatas();
         } else if (this.isSearch == 1) {
         this.paramsData();
         }*/
        this.getTableDatas();
      },
      // 分页菜单的数据
      pagechanges(val){
        this.page = val;
        this.compage = val;
        this.start = (val - 1) * this.display;
        /*if (this.isSearch == 0) {
         this.getTableDatas();
         } else if (this.isSearch == 1) {
         this.getTableDatas();
         }*/
        this.getTableDatas();
      },

      // 设置时间
      setTime(){
        this.compage = 1;
        this.start = 0; // 发生改变，从0开始搜索
        console.log(this.value6);
        if (this.value6 != null) {
          this.value6[0] = new Date(this.value6[0]).getTime();//开始时间
          this.value6[1] = new Date(this.value6[1]).getTime() + 1000 * 60 * 60 * 24 - 1;//结束时间
        }else{
          this.value6 = null;
        }
      },
      // 清空输入框的时候
      clearStart(){
        this.compage = 1;
        this.start = 0; // 改变从0开始搜索
      },

      // 点击通过还是不通过的时候（需要处理页面上的显示 和 把数据提交到后台，已方便数据进行同步）
      passEvent(index, tableDatas, item){
        // 需求做了更改
        if (item === 1) {
          this.open2(index, tableDatas, item);
        } else {
          // 变成公共的方法
          this.params.index = index;
          this.params.tableDatas = tableDatas;
          this.params.item = item;
          this.dialogFormVisible = true;
        }
      },
      open2(index, tableDatas, item) {
        this.$confirm('是否通过车位申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var webUserId = sessionStorage.getItem("adminId")
          var data = Qs.stringify({applyId: tableDatas[index].id,webUserId:webUserId, state: 1701, message: ' '});
          this.$http.post('apply/parkloc', data).then((res) => {
            if (res.data.error_code == 2000) {
              var arr = tableDatas;
              // 对参数status的判断（存在0 或者不存在）
              console.log(arr[index]);
              arr[index].state = item;
              tableDatas.splice(index, 1, arr[index]);
              this.getTableDatas();
            };
          }).catch((err) => {
            console.log(err);
          });
        }).catch(() => {
          console.log('数据不做任何处理');
        });
      },
      // 点击模态框返回按钮的时候
      returnPage(){
        // 1. 点击返回按钮，清空数据并且关闭模态框
        this.remark = '';
        this.params = {};
        this.dialogFormVisible = false;
      },
      // 模态框点击提交按钮的时候
      gitDatas(){
        // 1. 对文本域中的内容进行判断，错误提示用户
        if (this.remark === '') {
          this.errorFuntion('不通过车位申请不能为空！！');
        } else if (this.getStrLeng(this.remark) > 216) {
          this.errorFuntion('不通过的理由不能超过72个字，谢谢！！');
        } else {
          var webUserId = sessionStorage.getItem("adminId");
          // 2. 整合数据 ，并进行数据提交
          var data = Qs.stringify({
            applyId: this.params.tableDatas[this.params.index].id,
            webUserId:  webUserId,
            state: 1702,
            message: this.remark
          });
          this.$http.post('apply/parkloc', data).then((res) => {
            if (res.data.error_code == 2000) {
              // 3. 数据提交成功，清空已有的内容并且改变表格中的内容（关闭模态框）
              var arr = this.params.tableDatas;
              this.getTableDatas();
              arr[this.params.index].state = this.params.item;
              // 对参数status的判断（存在0 或者不存在）
              this.params.tableDatas.splice(this.params.index, 1, arr[this.params.index]);
              // 清空里面的数据
              this.remark = '';
              this.params = {};
              this.dialogFormVisible = false;
            } else {
              this.errorFuntion('web后台数据处理报错，请联系开发人员，谢谢！！');
              this.remark = '';
              this.params = {};
              this.dialogFormVisible = false;
            }
          }).catch((err) => {
            // 4. 如果数据，提交不成功，提示用户，5秒，之后清空文本框数据，并且关闭模态框
            this.errorFuntion('web后台数据处理报错，请联系开发人员，谢谢！！');
            this.NgLoading = false;
            this.errorTitle = '';
            this.errorShow = 0;
            this.dialogFormVisible = false;
            console.log(err);
          })
        }
      },
      errorFuntion(title){
        clearInterval(timeId);
        this.NgLoading = true;
        this.errorTitle = title;
        this.errorShow = 1;
        var timeId = setInterval(() => {
          this.NgLoading = false;
          this.errorTitle = '';
          this.errorShow = 0;
          clearInterval(timeId);
        }, 3000)
      },
      // 获取汉字长度
      getStrLeng(str) {
        var realLength = 0;
        var len = str.length;
        var charCode = -1;
        for (var i = 0; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) {
            realLength += 1;
          } else {
            // 如果是中文则长度加3
            realLength += 3;
          }
        }
        return realLength;
      },
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
