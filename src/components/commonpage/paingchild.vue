<template>
  <div>
    <nav>
      <ul class="paingchild pull-right numberStyle">
        <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(1)"> 首页 </a></li>
        <li :class="{'disabled': current == 1}"><a href="javascript:;" @click="setCurrent(current - 1)"> 上一页 </a></li>
        <li v-for="(p,index) in grouplist" :class="{'active': current == p.val}" :key="index"><a href="javascript:;"
                                                                            @click="setCurrent(p.val)"> {{ p.text
          }} </a></li>
        <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(current + 1)"> 下一页</a></li>
        <li :class="{'disabled': current == page}"><a href="javascript:;" @click="setCurrent(page)"> 尾页 </a></li>
      </ul>
      <ul class="paingchild pull-left pageStyle">
        <li><span> 共 {{ total }}  条数据 </span></li>
        <li><span> 每页显示 {{ display }}  条数据 </span></li>
        <li><span> 共 {{ page }} 页 </span></li>
        <li><span> 当前第 {{ current }} 页 </span></li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        current:this.compage,
      }
    },
    props: {
      total: {            // 数据总条数
        type: Number,
        default: 0
      },
      display: {            // 每页显示条数
        type: Number,
        default: 10
      },
      // 这个页码，可能有时需要从父组件中传递过去
     compage: {            // 当前页码
       type: Number,
       default: 1
     },
      pagegroup: {        // 分页条数 -- 奇数
        type: Number,
        default: 5,
      }
    },
    computed: {
      page: function () { // 总页数
        return Math.ceil(this.total / this.display);
      },
      pagegroups: function () {
        var val = this.pagegroup > 0 ? this.pagegroup : 5;
        return val % 2 === 1 ? val : val + 1;
      },
      currents:function(){
          return this.current;
      },
      grouplist: function () { // 获取分页页码
        var len = this.page, temp = [], list = [], count = Math.floor(this.pagegroups / 2), center = this.current;
        if (len <= this.pagegroups) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len});
          }
          ;
          return temp;
        }
        while (len--) {
          temp.push(this.page - len);
        }
        ;
        var idx = temp.indexOf(center);
        (idx < count) && ( center = center + count - idx);
        (this.currents > this.page - count) && ( center = this.page - count);
        temp = temp.splice(center - count - 1, this.pagegroups);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.page > this.pagegroups) {
          (this.current > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.current < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1});
        }
        return list;
      }
    },
    methods: {
      setCurrent: function (idx) {
//        console.log(idx,this.current);
        var data = {

        }
        if (this.current != idx && idx > 0 && idx < this.page + 1) {
          this.current = idx;
          this.$emit('pagechange', this.current);
        }
      }
    },
    watch:{
      compage:function(val){
        this.current = val;
      }
    }
  }
</script>
