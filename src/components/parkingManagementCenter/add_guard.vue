<template>
  <div>
    <!--1.0 标题-->
    <h2>车位绑定门禁</h2>
    <!--2.0 表格处理的数据-->
    <template>
      <el-table
        border
        :data="tableData"
        @select="getRow"
        header-cell-class-name="headerStyle"
        ref="multipleTable"
        style="width: 100%">
        <!--选择框-->
        <el-table-column
          type="selection"
          className="checkBoxStyle"
          width="80">
        </el-table-column>

        <el-table-column
          label="ID"
          prop="id"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="门禁名称">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state == 1">可用</span>
            <span v-else-if="scope.row.state == 2">不可用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="优先级">
          <template slot-scope="scope">
            <el-select v-model="scope.row.options" placeholder="请选择" @change="toggleSelection(scope.row)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!--3.0 表格底部-->
    <div class="footStyle">
      <el-button type="primary" size="small" @click="toBefore">返回</el-button>
      <el-button type="primary" size="small" @click="submitEvent">提交</el-button>
    </div>
  </div>
</template>

<style scope>
    .headerStyle.checkBoxStyle .el-checkbox__inner{
      /* visibility:hidden; */
      display: none;
      disabled:true;
    }
    .el-table_1_column_1{
      border-bottom: 1px solid #ebeef5 !important;
    }
</style>
<script>
  export default{
    data(){
      return {
        checked: false, // 多选框的选中状态
        tableData: [],// 表格中的数据
        value: '',
        options: [
          {value: 1, laber: 1},
          {value: 2, laber: 2},
          {value: 3, laber: 3},
          {value: 4, laber: 4},
          {value: 5, laber: 5},
          {value: 6, laber: 6},
          {value: 7, laber: 7},
          {value: 8, laber: 8},
          {value: 9, laber: 9},
          {value: 10, laber: 10},
        ],
        tableArray: [],
        selection: [],
        flag: 1,
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 1.0 获取表格数据渲染
      getTableDatas(){
        this.$http.get('estate/' + this.$route.query.estateId + '/access').then(res => {
          if (res.data.errcode == 1) {
            var paramsData = res.data.data.accessList;
            for (var i = 0; i < paramsData.length; i++) {
              paramsData[i].options = 1;
            }
            this.tableData = res.data.data.accessList;
            console.log(res.data.data.accessList);
          }
        }).catch(err => {
          console.log('服务器报错' + err);
        });
      },

      // 实时获取 表格中的数据
      getRow(selection, row){
        var tableArray = [];
        this.selection = selection;
        console.log(selection, row);
        for (var i = 0; i < selection.length; i++) {
          tableArray.push({id: selection[i].id, priority: selection[i].options});
        }
        this.tableArray = tableArray;
      },
      // 下拉框发生改变，对应行的多选框要发生改变,thi.tableArray也要发生改变(根据id，删除对应的数据即可)
      toggleSelection(row) {
        // 判断this.tableArray 长度，不存在 返回，存在处理里面的数据
        if (this.tableArray.length == 0) {
          return;
        } else if (this.tableArray.length != 0) {
          console.log(this.tableArray);
          var num;
          for (var i = 0; i < this.tableArray.length; i++) {
            if (this.tableArray[i].id == row.id) {
              num = i;
            }
          }
          ;
          this.tableArray.splice(num, 1);
        }
        ;
        this.$refs.multipleTable.toggleRowSelection(row, false);
      },
      // 提交数据进行审核
      submitEvent(){
        // 对数据进行判断
        console.log(this.tableArray);
        if (this.tableArray.length == 0) {
          this.open1();
        } else if (this.tableArray.length != 0) {
          // 对优先级进行判断
          var obj = {};
          for (var i = 0; i < this.tableArray.length; i++) {
            if (obj[this.tableArray[i].priority] == undefined) {
              obj[this.tableArray[i].priority] = 1;
            } else {
              this.open2();
              return;
            }
          }
          // 开始提交数据（若返回的是501 表示 不能重复绑定同一个门禁）
          var data = {accessList: this.tableArray};
          this.$http.post("/parking/" + this.$route.query.parkingId + "/bindAccess", data).then(res => {
            if (res.data.errcode == 501) {
              this.open3()
            } else {
              this.open4();
            };
          }).catch(err => {
            console.log('提交数据失败' + err);
          })
        }
      },
      // 返回上一页
      toBefore(){
        this.$router.go(-1);
      },
      // 错误提示信息
      open1() {
        this.$alert('请选择门禁', '提示信息', {
          confirmButtonText: '确定',
        });
      },
      open2() {
        this.$alert('门禁优先级重复', '提示信息', {
          confirmButtonText: '确定',
        });
      },
      open3() {
        this.$alert('不能重复绑定同一个门禁', '提示信息', {
          confirmButtonText: '确定',
        });
      },
      open4() {
        this.$alert('提交数据成功', '提示信息', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.go(-1);
          }
        });
      },
    },
  }
</script>
