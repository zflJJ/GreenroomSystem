<template>
  <div class="estate">
    <div class="ihomeStyle">欢迎使用iHome管理系统</div>
  </div>
</template>
<style scoped>
  .ihomeStyle {
    width: 100%;
    font-size: 80px;
    font-family: '宋体';
    font-weight: 900;
    text-align: center;
    margin-top: 250px;

  }
</style>
<script>
  import Qs from 'qs';
  export default{
    data(){
      return {
        display: 10,
        start: 0,
      }
    },

  }
</script>
