<template>
  <div>
    <!--{{this.$route.query.estateId}}
    {{this.$route.query.parkingId}}-->

    <!--1.0 标题-->
    <h2>车位解绑门禁</h2>
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
      visibility:hidden;
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
        tableArray: [],
        flag: 1,
      }
    },
    created(){
      this.getTableDatas();
    },
    methods: {
      // 1.0 获取表格数据渲染
      getTableDatas(){
        /*parking/1364/access(解绑数据的接口)*/
        this.$http.get('parking/' + this.$route.query.parkingId + '/access').then(res => {
          if (res.data.errcode == 1 && res.data.data.accessList.length != 0) {
            this.tableData = res.data.data.accessList;
            console.log(res.data.data.accessList);
          }
        }).catch(err => {
          console.log('服务器报错' + err);
        });
      },

      // 实时获取 表格中的数据（获取的是ID）
      getRow(selection, row){
        var tableArray = [];
        console.log(selection, row);
        for (var i = 0; i < selection.length; i++) {
          tableArray.push({id: selection[i].id});
        }
        this.tableArray = tableArray;
      },


      // 提交数据进行解绑（ 不需要对优先级 和 返回字段类型进行判断 需要对空的类型进行判断）
      submitEvent(){
        // 对数据进行判断
        console.log(this.tableArray);
        if (this.tableArray.length == 0) {
          this.open1();
          return;
        } else (this.tableArray.length != 0)
        {

          // 开始提交数据（若返回的是501 表示 不能重复绑定同一个门禁）
          var data = {accessList: this.tableArray};
          /*parking/1364/unbindAccess*/
          this.$http.post("/parking/" + this.$route.query.parkingId + "/unbindAccess", data).then(res => {
            if(res.data.errcode == 1){
                this.open4();
            }else{
                this.open5();
            }
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
        this.$alert('请选择解绑门禁', '提示信息', {
          confirmButtonText: '确定',
        });
      },

      open4() {
        this.$alert('解绑门禁成功', '提示信息', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.go(-1);
          }
        });
      },
      open5() {
        this.$alert('解绑门禁失败', '提示信息', {
          confirmButtonText: '确定',
        });
      }
    },
  }
</script>
