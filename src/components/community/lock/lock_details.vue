<template>
  <div>
    <h2>车锁详情</h2>
    <el-form label-position="top" label-width="80px" :model="formLabelAlign">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*蓝牙名称（必须以CrAm_开头)" prop="btName">
              <el-input v-model.trim="formLabelAlign.btName" placeholder="请输入蓝牙名称（必须以CrAm_开头)" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*蓝牙密码" prop="btPassword">
              <el-input v-model.trim="formLabelAlign.btPassword" placeholder="请输入蓝牙密码" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*锁MAC地址" prop="mac">
              <el-input v-model.trim="formLabelAlign.mac" placeholder="请输入锁MAC地址" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="*类型" prop="type">
              <el-input v-model="formLabelAlign.type" placeholder="" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :gutter="20" v-if="formLabelAlign.type==0 || formLabelAlign.type=='zigbee车锁' || formLabelAlign.type==3 || formLabelAlign.type=='Lora车锁'">
          <div class="grid-content bg-purple">
            <el-form-item label="网关ID">
              <el-input v-model.trim="formLabelAlign.gatewayId" placeholder="" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-form-item label="车位编号">
              <el-input v-model="formLabelAlign.parklocNumber" placeholder="" disabled></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="toBefore">返回</el-button>
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

.bindButton {
  position: absolute;
  top: 50px;
}
</style>

<script>
import Qs from 'qs';
import selectchild from '@/components/commonpage/selectchild';
import paingchild from '@/components/commonpage/paingchild';
export default {
  data() {
    return {
      formLabelAlign: {
        mac: '',
        gatewayId: '',
        btName: 'CrAm_',
        btPassword: '',
        parklocId: '',
        parklocNumber: '',
        type: '',
      },
      types: [{
        value: '0',
        label: 'zigbee车锁'
      }, {
        value: '1',
        label: 'NB车锁'
      }, {
        value: '2',
        label: '蓝牙车锁'
      }, {
        value: '3',
        label: 'Lora车锁'
      }],
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //进入页面获取数据
    getData() {
      this.$http.get("lock/" + this.$route.query.lockId).then(res => {
        var data = res.data.data;
        this.formLabelAlign.name = data.name;
        this.formLabelAlign.serialNumber = data.serialNumber;
        this.formLabelAlign.mac = data.mac;
        this.formLabelAlign.btName = data.btName;
        this.formLabelAlign.btPassword = data.btPassword;
        this.formLabelAlign.gatewayId = data.gatewayId;
        this.formLabelAlign.parklocId = data.parklocId;
        this.formLabelAlign.parklocNumber = data.parklocNumber;
        if (data.type == 1) {
          this.formLabelAlign.type = "NB车锁"
        } else if (data.type == 0) {
          this.formLabelAlign.type = "zigbee车锁"
        } else if (data.type == 2) {
          this.formLabelAlign.type = "蓝牙车锁"
        } else if (data.type == 3) {
          this.formLabelAlign.type = "Lora车锁"
        } else {
          this.formLabelAlign.type = data.type;
        }
      })
    },

    toBefore() {
      this.$router.go(-1);
    },
  },
}
</script>
