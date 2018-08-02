<template>
  <div class="selectStyle">
    <span>显示</span>
    <select class="selectpicker" @change="getDeatlength($event)">
      <option v-for="(ite,index) in selectData" :value="ite" :key="index">{{ite}}</option>
    </select>
    <span>结果</span>
  </div>
</template>
<style scoped>
  .selectStyle{
    height: 40px;
    /*width: 49px;*/
    padding: 14px 0px;
    line-height: 38px;
    font-size: 16px;
  }
  .selectStyle select{
    height: 36px;
    /*width: 34px;!**!*/
  }
</style>

<script>
  export default{
    data(){
      return {
        selectData: [10, 25, 50, 100],
      }
    },
    methods: {
      getDeatlength(event){
        var length = event.target.value;
        this.$emit('getlength',length);
      },
    }
  }
</script>
