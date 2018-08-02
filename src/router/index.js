import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
// 欢迎页
import welcome from '@/components/commonpage/ihome'
// 地区列表（省级）
import districtLevel1 from '@/components/community/district/district_level_1'
// 二级列表（市级）district_level_2
import districtLevel2 from '@/components/community/district/district_level_2'
// 三级列表（县、区）
import districtLevel3 from '@/components/community/district/district_level_3'

// 小区列表1
import estate from '@/components/community/estate/estate'
//新增小区
import estateAdd from '@/components/community/estate/estateAdd'
//小区详情
import estateDetail from '@/components/community/estate/estateDetail'
//修改小区
import estateRevamp from '@/components/community/estate/estateRevamp'

// 车位列表查看详情parking_detail
import parkingDetail from '@/components/community/parking/parking_detail'
// 车位列表
import parkingList from '@/components/community/parking/parking_list'
// 新增车位
import parkingAdd from '@/components/community/parking/parking_add'
//修改车位
import parkingEdit from '@/components/community/parking/parking_edit'

//车锁列表
import lockList from '@/components/community/lock/lockList'
//新增车位锁
import lock_add from '@/components/community/lock/lock_add'
//编辑车锁
import lock_edit from '@/components/community/lock/lock_edit'
//车锁日志详情
import lock_the_log from '@/components/community/lock/lock_the_log'
//车锁详情
import lock_details from '@/components/community/lock/lock_details'

// 门禁列表/accessControllerList
import accessControllerList from '@/components/community/accessController/accessControllerList'
//编辑门禁
import accessControllerEdit from '@/components/community/accessController/accessControllerEdit.vue'
//新增门禁
import addEntrance from '@/components/community/accessController/accessController_add.vue'

// 查看道闸列表1 barrier_list
import barrierList from '@/components/community/barrier/barrier_list'
// 新增道闸
import barrierAdd from '@/components/community/barrier/barrier_add'
// 编辑道闸
import barrierEdit from '@/components/community/barrier/barrier_edit'

// 编辑道闸
import gatewayEdit from '@/components/community/gateway/gateway_edit'
// 新增道闸
import gatewayAdd from '@/components/community/gateway/gateway_add'
// 道闸列表
import gatewayList from '@/components/community/gateway/gateway_list'

// 编辑继电器
import relayEdit from '@/components/community/relay/relay_edit'
// 新增继电器
import relayAdd from '@/components/community/relay/relay_add'
// 继电器列表
import relayList from '@/components/community/relay/relay_list'
// 继电器日志
import relayLog from '@/components/community/relay/relay_log'

// 编辑路由器
import routerEdit from '@/components/community/router/router_edit'
// 新增路由器
import routerAdd from '@/components/community/router/router_add'
// 路由器列表
import routerList from '@/components/community/router/router_list'
// 路由器详情
import routerLog from '@/components/community/router/router_log'

// 规则列表
import costRulesList from '@/components/community/costRules/costRules_list'
import costRules from '@/components/community/costRules/costRules'

// VIP车位列表门禁列表信息parking_ac_list
// import parkingAcList from "@/components/parkingManagementCenter/parking_ac_list";
// // VIP车位列表（新增绑定门禁）add_guard
// import addGuard from "@/components/parkingManagementCenter/add_guard";
// // VIP 车位（解绑门禁） untie_guard
// import untieGuard from "@/components/parkingManagementCenter/untie_guard";
// // 车位管理中心1（约车位信息）parking_list_yue
// import parkingListYue from "@/components/parkingManagementCenter/parking_list_yue";
// // 车位管理中心（车位申请列表）parking_apply_list
import parkingApplyList from '@/components/community/parking/parking_apply_list'
import parkingAreaList from '@/components/community/parkingarea/parking_area_list'
import addParkingarea from '@/components/community/parkingarea/add_parkingarea'

// // vip车位信息的修改 edit_vip
// import  editVip from "@/components/parkingManagementCenter/edit_vip";

//订单管理中心(1.停车位订单) parking_order
import parkingOrder from '@/components/oredercenter/parking_order'
//订单管理中心(3.发票申请订单)  invoice_apply
import invoiceApply from '@/components/oredercenter/invoice_apply'
//订单管理中心(3.提现申请订单) withdraw_apply
import withdrawApply from '@/components/oredercenter/withdraw_apply'
//订单管理中心(3.退款申请订单) order_refund_list
import orderRefundList from '@/components/oredercenter/order_refund_list'
//套餐订单列表
import package_order_list from '@/components/oredercenter/package_order_list'

// 查看用户详情
import orderuserDeatils from '@/components/oredercenter/user_details'

//财务统计
import financial from '@/components/financial/financial'
//发放优惠券
import ticket from '@/components/ticket/ticket'
//优惠券列表
import ticketList from '@/components/ticket/ticket_list'
//优惠券统计
import ticketUse from '@/components/ticket/ticket_use'
//合作商家
import ticket_business from '@/components/ticket/ticket_business'
//优惠券兑换
import ticket_conversion from '@/components/ticket/ticket_conversion'
// 优惠券套餐管理
import coupon_package_list from '@/components/coupon_package_list/coupon_package_list'
import add_edit_combo from '@/components/coupon_package_list/add_edit_combo'
import package_statistics from '@/components/coupon_package_list/package_statistics'
//消息推送和标签 短信推送 sms_push
import smsPush from '@/components/infoAndtag/sms_push'
//消息推送和标签 (app消息推送)info_push_app
import infoPushApp from '@/components/infoAndtag/infoPushApp'
//信息推送日志   info_push_list
import infoPushList from '@/components/infoAndtag/infoPushList'

// 用户管理中心（1.0 用户反馈）
import feedback from '@/components/userCenter/feedback'
// 用户管理中心（2.0 用户列表）
import user from '@/components/userCenter/user'
// 用户管理中心（2.1 查看详情）/user_detail
import userDetail from '@/components/userCenter/user_detail'
//  用户管理中心（3.0 用户日志） /user_log
import userLog from '@/components/userCenter/user_log'
//  用户管理中心信用积分
import userIntegral from '@/components/userCenter/userIntegral'
//标签tag_list（1. 标签列表）
import tagList from '@/components/userCenter/tag_list'
//标签 add_tag 新增标签
import addTag from '@/components/userCenter/add_tag'
// 标签 edit_tag 修改标签
import editTag from '@/components/userCenter/edit_tag'
//手动标签
import manualTag from '@/components/userCenter/manualTag'

// 系统管理中心（3.0 参数列表） /parameter_list
import parameterList from '@/components/systeCenter/parameter_list'
// 系统管理中心（3.0 管理员日志）/log
import log from '@/components/systeCenter/log'
// 系统管理中心 （app登陆日志）  /app_log
import appLog from '@/components/systeCenter/app_log'
//图片管理系统
import image from '@/components/systeCenter/image'
//强制升级
import versionSubmit from '@/components/systeCenter/versionSubmit'
//发票冲红
import red_invoice from '@/components/oredercenter/red_invoice'

//权限管理角色列表
import rolelist from '@/components/authorityManagement/rolelist'
import permissionlist from '@/components/authorityManagement/permissionlist'
import administratorlist from '@/components/authorityManagement/administratorlist'

//活动管理
import activityManagement from '@/components/actives/activityManagement'
//新增活动
import activity from '@/components/actives/activity'
//活动的查看统计
import activityStatistics from '@/components/actives/activityStatistics'
//奖品管理
import prizeManagement from '@/components/actives/prizeManagement'
//新建奖品
import prize from '@/components/actives/prize'
//奖品统计
import prizeStatistics from '@/components/actives/prizeStatistics'
//运营活动
import activitiesList from '@/components/actives/activitiesList'
//运营活动
import operatingActivities from '@/components/actives/operatingActivities'
import OperatingActivities_add from '@/components/actives/OperatingActivities_add'
import OperatingActivities_edit from '@/components/actives/OperatingActivities_edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/home',
      component: home,
      children: [
        { path: '/estate', component: estate },
        { path: '/parking_detail', component: parkingDetail },
        { path: '/accessControllerList', component: accessControllerList },
        { path: '/accessControllerEdit', component: accessControllerEdit },
        { path: '/addentrance', component: addEntrance },
        { path: '/parking_add', component: parkingAdd },
        { path: '/welcome', component: welcome },
        { path: '/estateAdd', component: estateAdd },
        { path: '/estateDetail', component: estateDetail },
        { path: '/estateRevamp', component: estateRevamp },
        { path: '/barrier_list', component: barrierList },
        { path: '/barrier_add', component: barrierAdd },
        { path: '/barrier_edit', component: barrierEdit },
        { path: '/district_level_1', component: districtLevel1 },
        { path: '/district_level_2', component: districtLevel2 },
        { path: '/district_level_3', component: districtLevel3 },
        { path: '/lockList', component: lockList },
        { path: '/lock_the_log', component: lock_the_log },
        { path: '/lock_details', component: lock_details },
        { path: '/lock_add', component: lock_add },
        { path: '/lock_edit', component: lock_edit },
        { path: '/parking_detail', component: parkingDetail },
        { path: '/parking_edit', component: parkingEdit },
        { path: '/gateway_list', component: gatewayList },
        { path: '/gateway_add', component: gatewayAdd },
        { path: '/gateway_edit', component: gatewayEdit },
        { path: '/relay_edit', component: relayEdit },
        { path: '/relay_add', component: relayAdd },
        { path: '/relay_list', component: relayList },
        { path: '/relay_log', component: relayLog },
        { path: '/router_edit', component: routerEdit },
        { path: '/router_add', component: routerAdd },
        { path: '/router_list', component: routerList },
        { path: '/router_log', component: routerLog },
        { path: '/costRules_list', component: costRulesList },
        { path: '/costRules', component: costRules },

        // 车位管理中心
        { path: '/parking_list', component: parkingList },
        // { path: '/parking_list_yue', component: parkingListYue},
        // { path: '/parking_ac_list', component: parkingAcList},
        // { path: '/add_guard', component: addGuard},
        // { path: '/untie_guard', component: untieGuard},
        { path: '/parking_apply_list', component: parkingApplyList },
        { path: '/parking_area_list', component: parkingAreaList },
        { path: '/add_parkingarea', component: addParkingarea },
        // { path: '/edit_vip', component: editVip},

        // 订单管理中心
        { path: '/parking_order', component: parkingOrder },
        { path: '/invoice_apply', component: invoiceApply },
        { path: '/withdraw_apply', component: withdrawApply },
        { path: '/order_refund_list', component: orderRefundList },
        { path: '/user_detailes', component: orderuserDeatils },
        { path: '/red_invoice', component: red_invoice },
        { path: '/package_order_list', component: package_order_list },

        //财务中心
        { path: '/financial', component: financial },
        //优惠券管理中心
        { path: '/ticket', component: ticket },
        { path: '/ticketList', component: ticketList },
        { path: '/add_tag', component: addTag },
        { path: '/edit_tag', component: editTag },
        { path: '/ticket_use', component: ticketUse },
        { path: '/ticket_business', component: ticket_business },
        { path: '/ticket_conversion', component: ticket_conversion },
        { path: '/coupon_package_list', component: coupon_package_list },
        { path: '/add_edit_combo', component: add_edit_combo },
        { path: '/package_statistics', component: package_statistics },

        // 消息推送和标签(1.0 )
        { path: '/tag_list', component: tagList },
        { path: '/manualTag', component: manualTag },
        { path: '/info_push_app', component: infoPushApp },
        { path: '/sms_push', component: smsPush },
        { path: '/info_push_list', component: infoPushList },

        // 系统管理中心列表
        { path: '/feedback', component: feedback },
        { path: '/user', component: user },
        { path: '/user_detail', component: userDetail },
        { path: '/log', component: log },
        { path: '/parameter_list', component: parameterList },
        { path: '/user_log', component: userLog },
        { path: '/app_log', component: appLog },
        { path: '/userIntegral', component: userIntegral },

        //权限管理
        { path: '/rolelist', component: rolelist },
        { path: '/permissionlist', component: permissionlist },
        { path: '/administratorlist', component: administratorlist },
        //图片管理
        { path: '/image', component: image },
        //强制升级
        { path: '/versionSubmit', component: versionSubmit },

        //活动管理
        { path: '/activityManagement', component: activityManagement },
        { path: '/activity', component: activity },
        { path: '/activityStatistics', component: activityStatistics },
        { path: '/prizeManagement', component: prizeManagement },
        { path: '/prize', component: prize },
        { path: '/prizeStatistics', component: prizeStatistics },
        { path: '/activitiesList', component: activitiesList },
        { path: '/operatingActivities', component: operatingActivities },
        {
          path: '/OperatingActivities_add',
          component: OperatingActivities_add
        },
        {
          path: '/OperatingActivities_edit',
          component: OperatingActivities_edit
        }
      ]
    }
  ]
})
