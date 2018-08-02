<template>
  <div>
    <div class="manage_page">
      <el-row style="height: 100%;">
        <el-col :span="3" style="min-height: 100% ;" class="panel">
          <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#0F0F8B" text-color="#fff" active-text-color="#ffd04b" style="min-height: 100%" unique-opened router @open="handleOpen" @select="handleSelect" theme="dark" @close="handleClose">
            <el-submenu index="1">
              <template slot="title">&nbsp;
                <i class="icon-ali-relationship-o iconStyle"></i>&nbsp;&nbsp;小区管理中心</template>
              <el-menu-item index="/district_level_1">地区列表</el-menu-item>
              <el-menu-item index="/estate">小区列表</el-menu-item>
              <el-menu-item index="/parking_list">车位列表</el-menu-item>
              <el-menu-item index="/parking_apply_list">车位申请列表</el-menu-item>
              <el-menu-item index="/parking_area_list">车位区域</el-menu-item>
              <el-menu-item index="/lockList">车锁列表</el-menu-item>
              <el-menu-item index="/gateway_list">网关列表</el-menu-item>
              <el-menu-item index="/accessControllerList">门禁列表</el-menu-item>
              <el-menu-item index="/barrier_list">道闸列表</el-menu-item>
              <el-menu-item index="/relay_list">继电器列表</el-menu-item>
              <el-menu-item index="/router_list">路由器列表</el-menu-item>
              <el-menu-item index="/costRules_list">费用规则</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">&nbsp;
                <i class="icon-ali-news-o iconStyle"></i>&nbsp;&nbsp;订单管理中心</template>
              <el-menu-item index="/parking_order">停车订单列表</el-menu-item>
              <el-menu-item index="/invoice_apply">发票申请列表</el-menu-item>
              <el-menu-item index="/red_invoice">发票冲红</el-menu-item>
              <el-menu-item index="/withdraw_apply">提现申请列表</el-menu-item>
              <el-menu-item index="/order_refund_list">退款订单列表</el-menu-item>
              <el-menu-item index="/package_order_list">套餐订单列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">&nbsp;
                <i class="icon-ali-refund iconStyle"></i>&nbsp;&nbsp;财务中心</template>
              <el-menu-item index="/financial">财务统计报表</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">&nbsp;
                <i class="icon-ali-moneys-o iconStyle"></i>&nbsp;&nbsp;优惠券管理中心</template>
              <el-menu-item index="/ticket">发放优惠券</el-menu-item>
              <el-menu-item index="/ticketList">优惠券列表</el-menu-item>
              <el-menu-item index="/ticket_use">优惠券统计</el-menu-item>
              <el-menu-item index="/ticket_business">合作商家</el-menu-item>
              <el-menu-item index="/ticket_conversion">优惠券兑换</el-menu-item>
              <!-- <el-menu-item index="/coupon_package_list">优惠套餐列表</el-menu-item> -->
            </el-submenu>
            <el-submenu index="10">
              <template slot="title">&nbsp;
                <i class="el-icon-news iconStyle"></i>&nbsp;优惠套餐管理中心</template>
              <el-menu-item index="/coupon_package_list">优惠套餐列表</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">&nbsp;
                <i class="icon-ali-message iconStyle"></i>&nbsp;&nbsp;消息推送</template>
              <el-menu-item index="/info_push_app">APP消息推送</el-menu-item>
              <el-menu-item index="/info_push_list">信息推送日志</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">&nbsp;
                <i class="icon-ali-profile iconStyle"></i>&nbsp;&nbsp;权限管理中心</template>
              <el-menu-item index="/rolelist">角色列表</el-menu-item>
              <el-menu-item index="/permissionlist">权限列表</el-menu-item>
              <el-menu-item index="/administratorlist">管理员列表</el-menu-item>
            </el-submenu>
            <el-submenu index="7">
              <template slot="title">&nbsp;
                <i class="icon-ali-set iconStyle"></i>&nbsp;&nbsp;用户管理中心</template>
              <el-menu-item index="/feedback">用户反馈</el-menu-item>
              <el-menu-item index="/user">用户列表</el-menu-item>
              <el-menu-item index="/userIntegral">信用积分</el-menu-item>
              <el-menu-item index="/user_log">用户日志</el-menu-item>
              <el-menu-item index="/tag_list">标签列表</el-menu-item>
            </el-submenu>
            <el-submenu index="8">
              <template slot="title">&nbsp;
                <i class="icon-ali-set iconStyle"></i>&nbsp;&nbsp;系统管理中心</template>
              <el-menu-item index="/app_log">APP登陆日志</el-menu-item>
              <el-menu-item index="/log">管理员日志</el-menu-item>
              <el-menu-item index="/parameter_list">参数列表</el-menu-item>
              <el-menu-item index="/image">WEB后台图片管理</el-menu-item>
              <el-menu-item index="/versionSubmit">强制升级</el-menu-item>
            </el-submenu>
            <el-submenu index="9">
              <template slot="title">&nbsp;
                <i class="el-icon-star-off"></i>运营活动</template>
              <el-menu-item index="/activityManagement">活动管理</el-menu-item>
              <el-menu-item index="/prizeManagement">奖品管理</el-menu-item>
              <el-menu-item index="/activitiesList">注册来源标记</el-menu-item>
              <!--<el-menu-item index="/operatingActivities">运营活动</el-menu-item>-->
            </el-submenu>
            <span>用户名:{{loginUserName}}</span>
            <el-button size='medium' @click='pullOut'>退出登录</el-button>
          </el-menu>
        </el-col>
        <el-col :span="20" style="height: 100%;overflow: auto;" class="mainStyle">
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>

</template>
<style scoped>
.iconStyle {
  font-size: 20px;
}
span {
  position: relative;
  text-align: center;
  font-size: 14px;
  left: 30px;
  /*margin:0 auto;*/
  color: #ffffff;
}
.el-submenu [class^=el-icon-]{
  margin-right: 0px;
}
</style>

<script>
export default {
  data() {
    return {
      loginUserName: "",
      defaultActive: "",
      path: "",
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      //        console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //        console.log(key, keyPath);
    },
    handleSelect(key) {
      //        console.log(key);
      this.defaultActive = "/parking_list";
    },
    pullOut() {
      sessionStorage.removeItem('adminId');
      this.$router.push({ path: "/" });
      this.$http("user/logout").then((res) => {
        this.$message({
          message: '恭喜你，成功退出登录',
          type: 'success'
        });
      })
    }
  },
  mounted() {
    var h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    $('.panel').css('height', h);
    this.loginUserName = sessionStorage.getItem("loginUserName")
  },
  beforeUpdate() {
    var path = this.$route.path;
    if (path == "/district_level_1") {
      this.defaultActive = "/district_level_1";
    } else if (path == "/estate") {
      this.defaultActive = "/estate";
    } else if (path == "/parking_list") {
      this.defaultActive = "/parking_list";
    } else if (path == "/parking_apply_list") {
      this.defaultActive = "/parking_apply_list";
    } else if (path == "/parking_area_list") {
      this.defaultActive = "/parking_area_list";
    } else if (path == "/lockList") {
      this.defaultActive = "/lockList";
    } else if (path == "/gateway_list") {
      this.defaultActive = "/gateway_list";
    } else if (path == "/accessControllerList") {
      this.defaultActive = "/accessControllerList";
    } else if (path == "/barrier_list") {
      this.defaultActive = "/barrier_list";
    } else if (path == "/relay_list") {
      this.defaultActive = "/relay_list";
    } else if (path == "/router_list") {
      this.defaultActive = "/router_list";
    } else if (path == "/costRules_list") {
      this.defaultActive = "/costRules_list";
    }
    else if (path == "/parking_order") {
      this.defaultActive = "/parking_order";
    } else if (path == "/invoice_apply") {
      this.defaultActive = "/invoice_apply";
    } else if (path == "/red_invoice") {
      this.defaultActive = "/red_invoice";
    } else if (path == "/withdraw_apply") {
      this.defaultActive = "/withdraw_apply";
    } else if (path == "/order_refund_list") {
      this.defaultActive = "/order_refund_list";
    } else if (path == "/package_order_list") {
      this.defaultActive = "/package_order_list";
    }
    else if (path == "/financial") {
      this.defaultActive = "/financial";
    }
    else if (path == "/ticket") {
      this.defaultActive = "/ticket";
    } else if (path == "/ticketList") {
      this.defaultActive = "/ticketList";
    } else if (path == "/ticket_use") {
      this.defaultActive = "/ticket_use";
    } else if (path == "/ticket_business") {
      this.defaultActive = "/ticket_business";
    } else if (path == "/ticket_conversion") {
      this.defaultActive = "/ticket_conversion";

    } else if (path == "/coupon_package_list") {
      this.defaultActive = "/coupon_package_list"
    }

    else if (path == "/tag_list") {
      this.defaultActive = "/tag_list";
    } else if (path == "/info_push_app") {
      this.defaultActive = "/info_push_app";
    } else if (path == "/info_push_list") {
      this.defaultActive = "/info_push_list";
    }
    else if (path == "/rolelist") {
      this.defaultActive = "/rolelist";
    } else if (path == "/permissionlist") {
      this.defaultActive = "/permissionlist";
    } else if (path == "/administratorlist") {
      this.defaultActive = "/administratorlist";
    }
    else if (path == "/feedback") {
      this.defaultActive = "/feedback";
    } else if (path == "/user") {
      this.defaultActive = "/user";
    } else if (path == "/user_log") {
      this.defaultActive = "/user_log";
    } else if (path == "/userIntegral") {
      this.defaultActive = "/userIntegral";
    }
    else if (path == "/app_log") {
      this.defaultActive = "/app_log";
    } else if (path == "/log") {
      this.defaultActive = "/log";
    } else if (path == "/parameter_list") {
      this.defaultActive = "/parameter_list";
    } else if (path == "/image") {
      this.defaultActive = "/image";
    } else if (path == "/versionSubmit") {
      this.defaultActive = "/versionSubmit";
    }
    else if (path == "/activityManagement") {
      this.defaultActive = "/activityManagement";
    } else if (path == "/prizeManagement") {
      this.defaultActive = "/prizeManagement";
    } else if (path == "/activitiesList") {
      this.defaultActive = "/activitiesList";
    } else if (path == "/operatingActivities") {
      this.defaultActive = "/operatingActivities";
    }
  }
}
</script>

