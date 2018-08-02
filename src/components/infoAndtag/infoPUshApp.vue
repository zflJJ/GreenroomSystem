<template>
  <div class="infoStyle">
    <h2>APP信息推送</h2>
    <template>
      <el-tabs type="border-card" v-model="activeWho" @tab-click="handleClick">
        <el-tab-pane label="逐个推送" name="first">

          <el-form :label-position="labelPosition" label-width="80px" label="活动区域" v-model="activeName">
            <el-form-item label="选择推送账户ID:" prop="user">
              <el-input class="input-with-select" v-model="input5" :disabled="true">
                <el-button slot="prepend" @click="getUserData">点击添加用户</el-button>
              </el-input>
            </el-form-item>

            <!--下拉菜单-->
            <el-form-item label="推送类型：">
              <el-select clearable placeholder="请选择推送类型" width="100%" v-model="activeName.type"
                         @change="clearStart" style="width: 100%">
                <el-option v-for="item in typeSelect" :label="item.text" :value="item.type" :key="item.type">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="推送标题：">
              <el-input v-model="activeName.title"></el-input>
            </el-form-item>

            <!--文本域-->
            <el-form-item label="推送内容： （请勿超过72个字数）">
              <el-input
                type="textarea"
                :rows="2"
                v-model="activeName.content"
                placeholder="请输入内容">
              </el-input>
            </el-form-item>


            <el-form-item label="跳转链接： （请以http://或https://开头）">
              <el-input v-model="activeName.href"></el-input>
            </el-form-item>


            <el-form-item label="标识图片：(运营人员上传图片请遵守以下规则 w:930px h:360px；使用JPG格式,图片大小限制在1M以内)">
              <div class="el-input__inner fileStyle">
                <a href="javascript:;" class="file">选择图片
                  <input type="file" name="" id="" @change="upFileImage" ref="file">
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="spanStyle imgNameStyle">{{imgName}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="spanStyle">{{imgError}}</span>
              </div>
              <el-button type="danger" size="mini" @click="clearFile">取消图片</el-button>
              <el-button type="primary" size="mini" @click="toImage" :disabled="isDisabled">上传图片</el-button>
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

            <!--下拉菜单-->
            <el-form-item label="推送类型：">
              <el-select clearable placeholder="请选择推送类型" width="100%" v-model="activeName2.type"
                         @change="clearStart" style="width: 100%">
                <el-option v-for="item in typeSelect" :label="item.text" :value="item.type" :key="item.type">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="推送标题：">
              <el-input v-model="activeName2.title"></el-input>
            </el-form-item>

            <!--文本域-->
            <el-form-item label="推送内容： （请勿超过72个字数）">
              <el-input
                type="textarea"
                :rows="2"
                v-model="activeName2.content"
                placeholder="请输入内容">
              </el-input>
            </el-form-item>


            <el-form-item label="跳转链接： （请以http://或https://开头）">
              <el-input v-model="activeName2.href"></el-input>
            </el-form-item>


            <el-form-item label="标识图片：(运营人员上传图片请遵守以下规则 w:930px h:360px；使用JPG格式,图片大小限制在1M以内)">
              <div class="el-input__inner fileStyle">
                <a href="javascript:;" class="file">选择图片
                  <input type="file" name="" @change="upTagFileImage" ref="file2">
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="spanStyle imgNameStyle">{{imgName2}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="spanStyle">{{imgError2}}</span>
              </div>
              <el-button type="danger" size="mini" @click="clearTagFile">取消图片</el-button>
              <el-button type="primary" size="mini" @click="toTagImage" :disabled="isDisabled2">上传图片</el-button>
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

    <!--6.1 模态框的内容是按用户ID做推送的-->
    <el-dialog
      title="选择推送账户"
      :show-close="showClose"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible"
      custom-class="modelTableStyle">
      <!--1.0 模态框的搜索区域-->
      <div class="modelSearch">
        <el-form :inline="true" class="demo-form-inline" :model="searchFromData">
          <el-form-item label='用户手机号'>
            <el-input placeholder="请输入用户手机号" v-model.trim="searchFromData.phone"></el-input>
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
          @select="getRowOne"
          @select-all="getRowAll"
          border>
          <!--多选框，是否为全选的时候-->
          <el-table-column
            :reserve-selection="true"
            type="selection">
          </el-table-column>
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
              <span v-if="scope.row.registerTime != undefined">{{scope.row.registerTime | moment}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

        </el-table>
      </template>

      <div slot="footer" class="dialog-footer">
        <div class="page">
          <paingchild :start="start" :currentss="currentss" :display="display" :total="total" :pagegroup="pagegroup" :compage="compage"
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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible2"
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
        <!--<th class="sorted">用户ID</th>
        <th>手机号</th>
        <th>创建日期</th>
        <th>选择</th>-->
        <el-table
          style="width: 100%"
          :data="tableDatas"
          ref="table"
          row-key="id"
          @select="getTagRowOne"
          @select-all="getTagRowAll"
          border>
          <!--多选框，是否为全选的时候-->
          <el-table-column
            :reserve-selection="true"
            type="selection">
          </el-table-column>
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
    /*position: absolute;*/
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
        // 分页要处理的数据
        display: 10,   // 每页显示条数
        compage: 1,     // 当前第n页 ， 也可以 watch current 的变化
        pagegroup: 5,
        page: 1,
        total: 0,
        start: 0,
        currentss: 1,
        tableDatas: [], // 要在表格中展示的数据
        pageDatas: [],   // 用户的总数据
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

        // 标签分页
        activeWho: 'first',  // 默认打开推送页面时的标签
        labelPosition: 'top', // 表单提示语
        showClose: false,      // 小叉不显示
        typeSelect: [         // 推送的信息列表
          {type: 0, text: '个人信息'},
          {type: 1, text: '活动信息'},
        ],
        dialogTableVisible: false, // 打开模态框的信息,
        input5: '',  // 在文本框中要显示的数据
        userIdList: '',  // 提交的用户ID的数据
        checkArray: [], // 这个是选中的元素的ID
        checkFlag: 0, // 这个表示是否是第一次进行添加数据
        imgName: '',   // 这个是图片信息
        imgError: '',  // 错误提示信息（如果为空表示没有提示）
        isImgGit: true,  // 能否进行图片推送
        activeName: {
          type: '',
          title: '',
          content: '',
          href: '',
          fileId: '',
        },
        isSubmitLoading: false,
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
          type: '',
          title: '',
          content: '',
          href: '',
          fileId: '',
        },
        isSubmitLoadingTag: false, // 表示提交失败的时候提示用户
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
        var titleLeng = this.getStrLeng(this.activeName2.title);
        var contentLeng = this.getStrLeng(this.activeName2.content);
        // 1. 先对数据做出验证，在进行数据提交
        if (this.tagIds === '') {
          this.errorFuntion('tag', '请选择推送的用户！！');
        } else if (this.activeName2.type === '') {
          this.errorFuntion('tag', '请选择推动的类型！！');
        } else if (this.activeName2.title === '') {
          this.errorFuntion('tag', '请填写要推送的标题！！');
        }  else if (titleLeng > 60) {
          this.errorFuntion('tag', '推送标题不能超过20个字！！');
        } else if (this.activeName2.content === '') {
          this.errorFuntion('tag', '请填写要推送的内容！！');
        } else if (contentLeng >= 216) {
          this.errorFuntion('tag', '推送内容不能超过72个字！！');
        }else {
          var datas = {};
          if (this.activeName2.type || this.activeName.type == 0) datas.type = this.activeName2.type;
          if (this.activeName2.title) datas.title = this.activeName2.title;
          if (this.activeName2.content) datas.content = this.activeName2.content;
          if (this.activeName2.href) datas.href = this.activeName2.href;
          if (this.activeName2.fileId) datas.fileId = this.activeName2.fileId;
          datas.webUserId = this.adminId;
          datas.tagIds = this.tagIds;
          console.log(data);
          var data = Qs.stringify(datas);
          this.$http.post('tag/message/sendJpushByTagId', data).then((res) => {
            if (res.data.error_code == 2000) {
              // 清空数据
              this.successTitleFlag2 = 1;
              this.successTitle2 = '消息推送成功！！';
              clearInterval(timeId);
              var timeId = setInterval(() => {
                this.successTitleFlag2 = 0;
                this.successTitle2 = '';
                clearInterval(timeId);
              },3000);
              this.tagIds = '';                 // 标签ID
              this.isDisabled2 = true;           // 上传图片是否禁用
              this.imgName2 = '';                // 图片名称
              this.imgError2 = '';               // 错误提示信息
              this.errorTitle2 = ''; // 错误的提示信息
              this.$refs.table.clearSelection();   // 数据提交成功之后，应该将模态框表格选中的状态给清空掉
              this.fileName2 = '';         // 表示上传图片的名称
              this.activeName2.type = '';
              this.activeName2.content = '';
              this.activeName2.title = '';
              this.activeName2.href = '';
              this.$refs.file.value = '';
            } else {
              this.errorFuntion('tag', '请检查推送的内容是否有误，若没有错误，请联系开发人员，谢谢！！');
            }
          }).catch((err) => {
            console.log(err);
          })
        }
      },

      // 2.8 上传图片的事件
      toTagImage(){
        console.log(1234);
        var filename = new FormData();
        this.imgError2 = "正在上传图片中..."
        filename.append('file', this.$refs.file2.files[0]);
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.$http.post('tag/message/upload', filename, config).then(res => {
          if (res.data.error_code == 2000) {
            this.activeName2.fileId = res.data.data.fileId;
            this.imgError2 = '上传图片成功';
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 2.7 取消图片
      clearTagFile(){
        this.imgName2 = '';
        this.imgError2 = '';
        this.$refs.file2.value = '';
      },

      // 2.6 选择图片之后需要做验证
      upTagFileImage(){
        var maxsize = 1 * 1024 * 1024;
        var imgSrc = this.$refs.file2.files[0];
        this.imgName2 = imgSrc.name;

        console.log(this.$refs.file2.files[0]);

        if (!/.(jpg|JPG)$/.test(imgSrc.name)) {
          this.isDisabled2 = true;
          this.imgError2 = "图片的类型必须是jpg格式的";
        } else if (imgSrc.size > maxsize) {
          this.isDisabled2 = true;
          this.imgError2 = "请上传小于1M的图片";
        } else {
          var reader = new FileReader();
          var _this = this;
          reader.onload = function (e) {
            var data = e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload = function () {
              var width = image.width;
              var height = image.height;
              if (width != 930) {
                _this.isDisabled2 = true;
                _this.imgError2 = "图片宽度必须是930px";
              } else if (height != 360) {
                _this.isDisabled2 = true;
                _this.imgError2 = "图片高度必须是360px";
              } else {
                _this.imgError2 = '';
                _this.isDisabled2 = false;
              }
            };
            image.src = data;
          };
          reader.readAsDataURL(imgSrc);
        }
        ;
      },


      // 2.5 关闭标签模态框按钮的时候（清空start compage）
      closeTagDialogTableVisible(){
//        this.$refs.table.clearSelection();
//        this.tagIds = '';
        this.start = 0;
        this.compage = 1;
        this.dialogTableVisible2 = false;
        if (this.searchFromData.name) this.searchFromData.name = '';
      },

      // 2.4 标签模态框点击提交数据按钮的时候  （跳转到第一页，start变成第一页）
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
          if (res.data.error_code == 2000 && res.data.data.dataList.length != 0) {
            this.total = res.data.data.itotalRecords;
            this.tableDatas = res.data.data.dataList;
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
        var titleLeng = this.getStrLeng(this.activeName.title);
        var contentLeng = this.getStrLeng(this.activeName.content);
        console.log(this.activeName.type);
        // 1. 先对数据做出验证，在进行数据提交
        if (this.input5 === '') {
          this.errorFuntion('user', '请选择推送的用户！！');
        } else if (this.activeName.type === '') {
          this.errorFuntion('user', '请选择推动的类型！！');
        } else if (this.activeName.title === '') {
          this.errorFuntion('user', '请选择推送的标题！');
        } else if (this.activeName.content === '') {
          this.errorFuntion('user', '请选择推送的内容！！');
        } else if (titleLeng > 60) {
          this.errorFuntion('user', '推送标题不能超过20个字！！');
        } else if (contentLeng >= 216) {
          this.errorFuntion('user', '推送内容不能超过72个字！！');
        } else {
          var datas = {};
          if (this.activeName.type || this.activeName.type == 0) datas.type = this.activeName.type;
          if (this.activeName.title) datas.title = this.activeName.title;
          if (this.activeName.content) datas.content = this.activeName.content;
          if (this.activeName.href) datas.href = this.activeName.href;
          if (this.activeName.fileId) datas.fileId = this.activeName.fileId;
          datas.userIds = this.userIdList;
          datas.webUserId = this.adminId;
          console.log(data);
          var data = Qs.stringify(datas);
          this.$http.post('tag/message/sendJpushByUserId', data).then((res) => {
            if (res.data.error_code == 2000) {
              this.successTitleFlag = 1;
              this.successTitle = '推送信息成功';
              clearInterval(timeId);
              var timeId = setInterval(() => {
                this.successTitleFlag = 0;
                this.successTitle = '';
                clearInterval(timeId);
              }, 3000)
              // 清空输入框的内容
              this.input5 = '';  // 在文本框中要显示的数据
              this.imgName = '';   // 这个是图片信息
              this.imgError = '';  // 错误提示信息（如果为空表示没有提示）
              this.checkArray = [];
              this.tableArray = [];
              this.tableDatas = [];
              this.userIdList = '';//选中用户的数据
              this.activeName.type = '';
              this.activeName.content = '';
              this.activeName.title = '';
              this.activeName.href = '';
              this.activeName.image = '';
              this.isDisabled = true; // 表示提交图片按钮，开始禁用，只有在在图片符合规则的时候才启用
              this.fileName = '';  // 上传图片返回的文件名
              this.errorTitle = ''; // 错误的提示信息
              this.$refs.table.clearSelection();
              this.$refs.file.value = '';
            } else {
              this.errorFuntion('user', '消息推送失败，请检查是否推送的字段有误，若没有请联系开发人员，谢谢！！');
            }
          }).catch((err) => {
            console.log(err);
          })
        }
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

      // 上传图片
      toImage(){
        var filename = new FormData();
        this.imgError = "正在上传图片中..."
        filename.append('file', this.$refs.file.files[0]);
        /*上传文件要设置的请求头*/
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.$http.post('tag/message/upload', filename, config).then(res => {
            console.log(res)
          if (res.data.error_code == 2000) {
            this.activeName.fileId = res.data.data;
            this.imgError = '上传图片成功'
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 取消图片
      clearFile(){
        this.imgName = '';
        this.imgError = '';
        this.$refs.file.value = '';
      },

      // 选择图片之后需要做验证
      upFileImage(){
        var maxsize = 1 * 1024 * 1024;
        var imgSrc = this.$refs.file.files[0];
        console.log(12312341234);
        this.imgName = imgSrc.name;
        console.log(this.imgName);
        if (!/.(jpg|JPG)$/.test(imgSrc.name)) {
          this.isDisabled = true;
          this.imgError = "图片的类型必须是jpg格式的";
        } else if (imgSrc.size > maxsize) {
          this.isDisabled = true;
          this.imgError = "请上传小于1M的图片";
        } else {
          var reader = new FileReader();
          var _this = this;
          reader.onload = function (e) {
            var data = e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload = function () {
              var width = image.width;
              var height = image.height;
              if (width != 930) {
                _this.isDisabled = true;
                _this.imgError = "图片宽度必须是930px";
              } else if (height != 360) {
                _this.isDisabled = true;
                _this.imgError = "图片高度必须是360px";
              } else {
                _this.imgError = '';
                _this.isDisabled = false;
              }
            };
            image.src = data;
          };
          reader.readAsDataURL(imgSrc);
        }
        ;
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
          if (res.data.error_code === 2000 && res.data.data.dataList.length != 0) {
            var paramDatas = res.data.data.dataList;
            // 赋值表格处理数据, 表格的总量（当前模态框只每页只显示10条数据，只需要计算，start即可）
            this.total = res.data.data.itotalRecords;
            this.tableDatas = res.data.data.dataList;
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
          if (res.data.error_code == 2000 && res.data.data.dataList.length != 0) {
            this.total = parseInt(res.data.data.iTotalRecords);
            this.total = res.data.data.itotalRecords;

            this.tableDatas = res.data.data.dataList;
          } else if (res.data.error_code == 0) {
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

      //思路： 选中过后添加一个状态，选中就是true,没有选中就是false;
      getUserData(){
        this.dialogTableVisible = true;
        // 1. 显示模态框
        // 2. 调用方法，获取表格里面的数据
        this.getTableDatas();
      },

      // 实时获取 表格中的单选数据的时候(单选的时候)
      getRowOne(selection, row){
          console.log(selection)
        this.tableArray = selection;
      },
      // 当点击多选的时候，选中的数据
      getRowAll(selection, row){
//        console.log(selection,row);
        this.tableArray = selection;
      },

      // 提交数据做数据处理
      tableToInputEvent(){
        var arrId = [];
        var obj = {};
        for (var i = 0; i < this.tableArray.length; i++) {
          if (!obj[this.tableArray[i].id]) {
            obj[this.tableArray[i].id] = 1;
            arrId.push(this.tableArray[i].phone);
            this.userIdList += this.tableArray[i].id;
          }
        }
//        this.userIdList = this.unique(this.userIdList);
        this.input5 = this.unique(arrId);
        // 确定数据
        this.start = 0;
        this.compage = 1;
        this.checkArray = arrId;
        this.input5 = arrId.toString();
        // 清空搜索框里面的数据
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        this.dialogTableVisible = false;
      },

      // 关闭数据
      closeDialogTableVisible(){
        // 点击关闭按钮的时候， 清空文本框中的数据，和选中状态
//        this.$refs.table.clearSelection();
        this.start = 0;
        this.compage = 1;
        // 清空搜索框里面的数据
        if (this.searchFromData.id) this.searchFromData.id = '';
        if (this.searchFromData.phone) this.searchFromData.phone = '';
        this.dialogTableVisible = false;
      },
      //数组去重
      unique(arr){
        var res =[];
        var json = {};
        for(var i=0;i<arr.length;i++){
          if(!json[arr[i]]){
            res.push(arr[i]);
            json[arr[i]] = 1;
          }
        }
        return res;
      }
    },
    mounted(){
      var data = {url: "tag/message/sendJpushByUserId"};
      data = Qs.stringify(data);
      this.$http.post("auth/check",data).then(res => {
        console.log(res)
      });
    },
    components: {
      paingchild,
      selectchild,
    },
  }
</script>
