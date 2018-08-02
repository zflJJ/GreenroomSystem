<template>
  <div class="infoStyle">
    <!-- 查看闸道列表页面 -->
    <h2>短信推送</h2>
    <template>
      <el-tabs type="border-card" v-model="activeWho" @tab-click="handleClick">
        <el-tab-pane label="逐个推送" name="first">

          <el-form :label-position="labelPosition" label-width="80px" label="活动区域" v-model="activeName">
            <el-form-item label="选择推送账户ID:" prop="user">
              <el-input class="input-with-select" v-model="userIds" :disabled="true">
                <el-button slot="prepend" @click="getUserData">点击添加用户</el-button>
              </el-input>
            </el-form-item>
            <!--文本域-->
            <el-form-item label="推送内容： （请勿超过300个字数）">
              <el-input
                type="textarea"
                :rows="5"
                v-model="activeName.content"
                :maxlength="300"
                placeholder="请输入内容">
              </el-input>
            </el-form-item>
          </el-form>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-alert v-show="errorTitleFlag == 1" :title="errorTitle" type="error" show-icon></el-alert>
          <el-alert v-show="successTitleFlag == 1" :title="successTitle" type="success" show-icon></el-alert>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" style='width:100%;' @click="pushInfoToUserId" :loading="isSubmitLoading">提交<i
            class="el-icon-upload el-icon--right"></i></el-button>
        </el-tab-pane>


        <el-tab-pane label="标签推送" name="second">
          <el-form :label-position="labelPosition" label-width="80px" v-model="activeName2">
            <el-form-item label="选择推送标签：" prop="user">
              <el-input class="input-with-select" v-model="tagIds" :disabled="true">
                <el-button slot="prepend" @click="getTagList">点击添加标签</el-button>
              </el-input>
            </el-form-item>
            <!--文本域-->
            <el-form-item label="推送内容： （请勿超过300个字数）">
              <el-input
                type="textarea"
                :rows="5"
                :maxlength="300"
                v-model="activeName2.content"
                placeholder="请输入内容">
              </el-input>
            </el-form-item>
          </el-form>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-alert v-show="errorTitleFlag2 == 1" :title="errorTitle2" type="error" show-icon></el-alert>
          <el-alert v-show="successTitleFlag2 == 1" :title="successTitle2" type="success" show-icon></el-alert>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" style='width:100%;' @click="pushInfoToTag" :loading="isSubmitLoadingTag">提交<i
            class="el-icon-upload el-icon--right"></i></el-button>
        </el-tab-pane>
        <!--<el-tab-pane label="短信推送" name="third" disabled="true">角色管理</el-tab-pane>-->
        <!--<el-tab-pane label="预留推送类型" name="fourth">定时任务补偿</el-tab-pane>-->
      </el-tabs>
    </template>

    <!--6.0 模态框-->
    <!--6.1 模态框的内容是按用户ID做推送的-->
    <el-dialog
      title="选择推送账户"
      :show-close="showClose"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible"
      custom-class="modelTableStyle">
      <div class="modelSearch">
        <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
          <el-form-item label="用户ID">
            <el-input placeholder="请输入用户ID" v-model.trim="searchFromData.id"></el-input>
          </el-form-item>
          <el-form-item label='用户手机号'>
            <el-input placeholder="请输入用户手机号" v-model.trim="searchFromData.phone"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchEvent">搜索</el-button>
          <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
        </el-form>
      </div>
      <template>
        <!--<th class="sorted">用户ID</th>
        <th>手机号</th>
        <th>创建日期</th>
        <th>选择</th>-->
        <el-table
          style="width: 100%"
          :data="tableDatas"
          ref="table"
          row-key="id"
          @select="getRowOne"
          @select-all="getRowAll"
          border>
          <el-table-column
            prop="id"
            width="100px"
            label="用户ID">
          </el-table-column>

          <el-table-column
            label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.phone || '暂无'}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="创建日期">
            <template slot-scope="scope">
              <span v-if="scope.row.activeTime != undefined">{{scope.row.activeTime | moment}}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>

          <!--多选框，是否为全选的时候-->
          <el-table-column
            :reserve-selection="true"
            type="selection">
          </el-table-column>

        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                      v-on:pagechange="pagechanges"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeDialogTableVisible">关闭</el-button>
          <el-button type="primary" @click="tableToInputEvent">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--6.2 模态框的内容是标签类型做推送的-->
    <el-dialog
      title="选择推送标签"
      :show-close="showClose"
      width="60%"
      :visible.sync="dialogTableVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="modelTableStyle">
      <!--2.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
          <el-form-item label="标签名称">
            <el-input placeholder="请输入标签名称" v-model.trim="searchFromData.name"></el-input>
          </el-form-item>
          <el-button type="primary" @click="searchEvent">搜索</el-button>
          <span class="isInfoStyle isShowStyle" v-show="isflag">{{text}}</span>
        </el-form>
      </div>
      <template>
        <el-table
          style="width: 100%"
          :data="tableDatas"
          ref="table"
          row-key="id"
          @select="getTagRowOne"
          @select-all="getTagRowAll"
          border>
          <el-table-column
            prop="id"
            width="100px"
            label="标签ID">
          </el-table-column>

          <el-table-column
            label="标签名">
            <template slot-scope="scope">
              <span>{{scope.row.name || '暂无'}}</span>
            </template>
          </el-table-column>

          <!--多选框，是否为全选的时候-->
          <el-table-column
            :reserve-selection="true"
            type="selection">
          </el-table-column>

        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :compage="compage" :display="display" :total="total" :pagegroup="pagegroup"
                      v-on:pagechange="pagechanges"></paingchild>
        </div>
        <div class="btnStyle">
          <el-button type="danger" @click="closeTagDialogTableVisible">关闭</el-button>
          <el-button type="primary" @click="tableTagToInputEvent">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
  /*上面是一些样式*/
  .spanStyle {
    display: inline-block;
    height: 100%;
    vertical-align: top;
    color: red;
  }

  .imgNameStyle {
    color: #2e6da4;
  }

  .file {
    margin-top: 4px;
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
  }

  .file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }

  .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }

  .fileStyle {
    line-height: 40px;
  }

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

  .infoStyle .el-form-item__label {
    line-height: 20px;
  }
</style>
<script>
  import Qs from 'qs';
  import  selectchild from '@/components/commonpage/selectchild';
  import  paingchild from '@/components/commonpage/paingchild';
  export default{
    data(){
      return {
        content: '',
        // 分页要处理的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,

        tableDatas: [], // 要在表格中展示的数据
        tableArray: [],

        // 搜索区域的内容
        isflag: false,
        isLoading: false,
        seachLoading: false,
        text: '',
        isSearch: 0, // 表示是否要加搜索条件去做请求数据
        searchFromData: {
          id: '',
          phone: '',
          name: '',
        },
        name: 'first',//表示当前选中的是哪个

        // 选择用户来选择数据
        activeWho: 'first',  // 默认打开推送页面时的标签
        labelPosition: 'top', // 表单提示语
        isSubmitLoading: false,
        showClose: false,      // 小叉不显示
        typeSelect: [         // 推送的信息列表
          {type: 1, text: '个人信息'},
          {type: 2, text: '活动信息'},
        ],
        dialogTableVisible: false, // 打开模态框的信息,
        userIds: '',  // 在文本框中要显示的数据
        checkArray: [], // 这个是选中的元素的ID
        checkFlag: 0, // 这个表示是否是第一次进行添加数据
        imgName: '',   // 这个是图片信息
        imgError: '',  // 错误提示信息（如果为空表示没有提示）
        isImgGit: true,  // 能否进行图片推送
        activeName: {
          content: '',
        },
        adminId: sessionStorage.getItem("adminId"),
        isDisabled: true, // 表示提交图片按钮，开始禁用，只有在在图片符合规则的时候才启用
        fileName: '',  // 上传图片返回的文件名
        errorTitle: '', // 错误的提示信息
        errorTitleFlag: 0,  // 是否显示错误提示信息
        successTitle: '',    // 成功显示的内容
        successTitleFlag: 0, // 上传和提交数据成功的时候应该展示的内容
        /*我提交数据的时候判断是否存在图片，如果存在先上传图片，在上传字段，不存在就直接上传字段*/

        /*这个是按标签推送的模态框*/
        dialogTableVisible2: false,    // 第二个模态框
        isSubmitLoadingTag: false,
        tagIds: '',                  // 标签ID
        isDisabled2: true,           // 上传图片是否禁用
        imgName2: '',                // 图片名称
        imgError2: '',               // 错误提示信息
        errorTitle2: '', // 错误的提示信息
        errorTitleFlag2: 0,  // 是否显示错误提示信息
        successTitle2: '',    // 成功显示的内容
        successTitleFlag2: 0, // 上传和提交数据成功的时候应该展示的内容
        fileName2: '',         // 表示上传图片的名称
        activeName2: {              // 标签推送内容
          content: '',
        },
        remnant:0,
      }
    },
    methods: {
      // 点击切换顶部状态栏的时候
      handleClick(tab, event){
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        if (this.searchFromData.name) this.searchFromData.name = '';
        this.start = 0;
        this.compage = 1;
        this.name = tab.name;
      },
      // 2.7 按照标签推送按钮
      pushInfoToTag(){
        var contentLeng = this.getStrLeng(this.activeName2.content);
        // 1. 先对数据做出验证，在进行数据提交
        if (this.tagIds === '') {
          this.errorFuntion('tag', '请选择推送的用户！！');
        } else if (this.activeName2.content === '') {
          this.errorFuntion('tag', '请填写要推送的内容！！');
        } else if (contentLeng >= 900) {
          this.errorFuntion('tag', '推送内容不能超过300个字！！');
        } else {
          var datas = {};
          if (this.activeName2.content) datas.content = this.activeName2.content;
          datas.adminId = this.adminId;
          datas.tagIds = this.tagIds;
          datas.type = 3;
          console.log(data);
          var data = Qs.stringify(datas);
          this.$http.post('message/save', data).then((res) => {
            if (res.data.errcode == 1) {
              // 清空数据
              this.successTitleFlag2 = 1;
              this.successTitle2 = '消息推送成功！！';
              clearInterval(timeId);
              var timeId = setInterval(() => {
                this.successTitleFlag2 = 0;
                this.successTitle2 = '';
                clearInterval(timeId);
              }, 3000);
              this.tagIds = '';                 // 标签ID
              this.isDisabled2 = true;           // 上传图片是否禁用
              this.imgName2 = '';                // 图片名称
              this.imgError2 = '';               // 错误提示信息
              this.errorTitle2 = ''; // 错误的提示信息
              this.$refs.table.clearSelection();   // 数据提交成功之后，应该将模态框表格选中的状态给清空掉
              this.activeName2.content = '';
            } else {
              this.errorFuntion('tag', '请检查推送的内容是否有误，若没有错误，请联系开发人员，谢谢！！');
            }
          }).catch((err) => {
            console.log(err);
          })
        }
      },

      // 2.5 关闭模态框按钮的时候（清空start compage）
      closeTagDialogTableVisible(){
        this.$refs.table.clearSelection();
        this.tagIds = '';
        this.start = 0;
        this.compage = 1;
        this.dialogTableVisible2 = false;
        if (this.searchFromData.name) this.searchFromData.name = '';
      },
      // 2.4 模态框点击提交数据按钮的时候  （跳转到第一页，start变成第一页）
      tableTagToInputEvent(){
        var arrId = [];
        var obj = {};
        for (var i = 0; i < this.tableArray.length; i++) {
          if (!obj[this.tableArray[i].id]) {
            obj[this.tableArray[i].id] = 1;
            arrId.push(this.tableArray[i].id);
          }
        }
        // 确定数据
        this.compage = 1;
        this.start = 0;
        this.tagIds = arrId.toString();
        if (this.searchFromData.name) this.searchFromData.name = '';
        this.dialogTableVisible2 = false;
      },

      // 2.3 获取所有数据
      getTagRowAll(selection){
        this.tableArray = selection;
      },
      // 2.2 获取单个数据
      getTagRowOne(selection, row){
        this.tableArray = selection;
      },

      // 2.1 获取数据
      getTagListDatas(){
        var data = {
          length: this.display,
          sEcho: 3,
          start: this.start,
        };
        var datas = Qs.stringify(data);
        this.$http.post('tag/pageable', datas).then((res) => {
          console.log(res);
          if (res.data.errcode == 1 && res.data.data.aaData.length != 0) {
            this.total = res.data.data.iTotalDisplayRecords;
            this.tableDatas = res.data.data.aaData;
          }
        }).catch((err) => {
          console.log(err);
        });
      },

      // 2.0 点击选择按标签推送的时候
      getTagList(){
        /*1. 显示模态框 2. 获取数据*/
        this.dialogTableVisible2 = true;
        this.getTagListDatas();
      },


      // 错误提示信息
      errorFuntion(flag, errorTitle){
        if (flag === 'user') {
          this.isSubmitLoading = true;
          this.errorTitleFlag = 1;
          this.errorTitle = errorTitle;
        } else if (flag === 'tag') {
          this.errorTitle2 = errorTitle;
          this.errorTitleFlag2 = 1;
          this.isSubmitLoadingTag = true;
        }
        clearInterval(timeId);

        var timeId = setInterval(() => {
          if (flag === 'user') {
            this.errorTitleFlag = 0;
            this.errorTitle = '';
            this.isSubmitLoading = false;
          } else if (flag === 'tag') {
            this.errorTitle2 = '';
            this.errorTitleFlag2 = 0;
            this.isSubmitLoadingTag = false;
          }

          clearInterval(timeId);
        }, 3000);
      },

      // 按照用户推送信息按钮
      pushInfoToUserId(){
        var contentLeng = this.getStrLeng(this.activeName.content);
        // 1. 先对数据做出验证，在进行数据提交
        if (this.userIds === '') {
          this.errorFuntion('user', '请选择推送的用户！！');
        } else if (this.activeName.content === '') {
          this.errorFuntion('user', '请添加推送内容！！');
        } else if (contentLeng >= 900) {
          this.errorFuntion('user', '推送内容不能超过300个字！！');
        } else {
          var datas = {};
          if (this.activeName.content) datas.content = this.activeName.content;
          datas.adminId = this.adminId;
          datas.userIds = this.userIds;
          datas.type = 3;
          console.log(data);
          var data = Qs.stringify(datas);
          this.$http.post('message/save', data).then((res) => {
            if (res.data.errcode == 1) {
              this.successTitleFlag = 1;
              this.successTitle = '推送信息成功';
              clearInterval(timeId);
              var timeId = setInterval(() => {
                this.successTitleFlag = 0;
                this.successTitle = '';
                clearInterval(timeId);
              }, 3000)
              // 清空输入框的内容
              this.userIds = '';  // 在文本框中要显示的数据
              this.imgName = '';   // 这个是图片信息
              this.imgError = '';  // 错误提示信息（如果为空表示没有提示）
              this.checkArray = [];
              this.tableArray = [];
              this.tableDatas = [];
              this.activeName.content = '';
              this.isDisabled = true; // 表示提交图片按钮，开始禁用，只有在在图片符合规则的时候才启用
              this.fileName = '';  // 上传图片返回的文件名
              this.errorTitle = ''; // 错误的提示信息
              this.$refs.table.clearSelection();
            } else {
              this.errorFuntion('user', '消息推送失败，请检查是否推送的字段有误，若没有请联系开发人员，谢谢！！');
            }
          }).catch((err) => {
            console.log(err);
          })
        }
        console.log(this.activeName.type);
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

      // 获取用户ID的表格数据
      getTableDatas(){
        // 这里用的是客服端的分页
        // 整合信息
        var datas = {
          start: this.start,
          sEcho: 3,
          length: this.display
        };
        var data = Qs.stringify(datas);
        this.$http.post('user/pageable', data).then(res => {
          this.seachLoading = false;
          console.log(res);
          if (res.data.errcode === 1 && res.data.data.aaData.length != 0) {
            // 赋值表格处理数据, 表格的总量（当前模态框只每页只显示10条数据，只需要计算，start即可）
            this.total = res.data.data.iTotalDisplayRecords;
            this.tableDatas = res.data.data.aaData;
          } else {
            console.log('状态码返回错误')
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //获取搜索的内容(对发票类型数据做处理，)
      searchEvent(){ // 做判断和验证
        this.seachLoading = true;
        if (this.isSearch == 0) {  // 点击了一次搜索，过后这里的判断就会失效
          if (this.searchFromData.id == "" && this.searchFromData.phone == '' && this.searchFromData.name == '') {
            // 第一次搜索没有字段提示用户信息
            this.isflag = true;
            this.text = "输入的搜索内容不能为空，请填入搜索字段";
            clearInterval(timeId1);
            var timeId1 = setInterval(() => {
              this.isflag = false;
              this.seachLoading = false;
              clearInterval(timeId1);
            }, 3000);
            return;
          } else {
            // 不管好多页，搜索默认就开始第一页的方式, 长度不变
            this.start = 0;
            // 开始进行带参分页  [第一次搜索]
            this.paramsData();
          }
        } else if (this.isSearch == 1) {
          // 如果为空搜索，那么开启默认搜索， 如果为非空搜索进行分页搜索，但是发生变化之后，this.start = 0 从0 开始作为搜索的目标
          if (this.searchFromData.id == "" && this.searchFromData.phone == '' && this.searchFromData.name == '') {
            // 为空，开启默认搜索
            this.isSearch = 0;
            this.start = 0;
            if (this.name == 'first') {
              this.getTableDatas();
            } else if (this.name == 'second') {
              this.getTagListDatas();
            }
          } else {
            this.paramsData();
          }
        }
      },

      // 带参请求数据
      paramsData(){
        // 把标签搜索 和 用户 搜索放在一起  （更改的是搜索的url 即可）
        var url = '';
        if (this.name == 'first') {
          url = 'user/pageable';
        } else if (this.name == 'second') {
          url = 'tag/pageable';
        }
        this.isSearch = 1;
        var datas = {};
        datas.start = this.start;
        datas.sEcho = 3;
        datas.length = this.display;
        this.compage = 1;
        if (this.searchFromData.id) datas.id = this.searchFromData.id;
        if (this.searchFromData.phone) datas.phone = this.searchFromData.phone;
        if (this.searchFromData.name) datas.name = this.searchFromData.name;
        var data = Qs.stringify(datas);
        this.$http.post(url, data).then(res => {
          // 按钮不用禁用了
          this.seachLoading = false;
          if (res.data.errcode == 1 && res.data.data.aaData.length != 0) {
            this.total = parseInt(res.data.data.iTotalRecords);
            this.tableDatas = res.data.data.aaData;
          } else if (res.data.errcode == 0) {
            this.isflag = true;
            this.text = '未能搜索到匹配的条件，请重新数据搜索条件！！';
            clearInterval(timeId);
            var timeId = setInterval(() => {
              this.text = '';
              clearInterval(timeId);
              this.isflag = false;
            }, 3000);
          } else {
            console.log('输入内容出错');
          }
        }).catch(err => {
          this.seachLoading = false;
          console.log('服务端错误' + err);
        })
      },

      // 分页菜单的数据
      pagechanges(val){
        var start = 0;
        this.page = val;
        // 计算位置
        this.compage = val;
        start = (val - 1) * this.display;
        this.start = start;
        console.log(this.name);
        if (this.name === 'first') {
          this.getTableDatas();
        } else if (this.name === 'second') {
          this.getTagListDatas();
        }
      },

      // 清空文本框里面的内容
      clearStart(){
        this.compage = 1;
        this.start = 0;
      },

      // 点击推送用户的时候
      getUserData(){
        this.dialogTableVisible = true;
        // 1. 显示模态框
        // 2. 调用方法，获取表格里面的数据
        this.getTableDatas();
      },

      // 实时获取 表格中的单选数据的时候(单选的时候)
      getRowOne(selection, row){
        this.tableArray = selection;
        console.log(this.tableArray);
      },
      // 当点击多选的时候，选中的数据
      getRowAll(selection){
        this.tableArray = selection;
        console.log(this.tableArray);
      },

      // 提交数据的时候做的验证
      tableToInputEvent(){
        var arrId = [];
        var obj = {};
        for (var i = 0; i < this.tableArray.length; i++) {
          if (!obj[this.tableArray[i].id]) {
            obj[this.tableArray[i].id] = 1;
            arrId.push(this.tableArray[i].id);
          }
        }
        // 确定数据
        this.start = 0;
        this.compage = 1;
        this.checkArray = arrId;
        this.userIds = arrId.toString();
        // 清空搜索框里面的数据
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        this.dialogTableVisible = false;
      },
      // 关闭数据
      closeDialogTableVisible(){
        this.$refs.table.clearSelection();
        this.userIds = '';
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        this.dialogTableVisible = false;
      },
    },
//    watch: {
//      content(){
//        if (this.getStrLeng(this.content) > 10) {
//          this.content = String(this.getStrLeng(this.content)).slice(0, 10);
//        }
//      }
//    },

    components: {
      paingchild,
      selectchild,
    },
  }
</script>





