<template>
  <div id="main">
    <!-- 框架 s -->
    <Frame :result="user" v-on:nav="nav" v-on:memberLogin="memberLogin" ref="frame">
      <div class="content-wrap h100" slot="left">
        <!-- 本地购物车——收银员 -->
        <ShoppingCart ref="shoppingCart" v-on:clearMember="loginOutMember" v-on:submitOrder="confirmOrder" v-on:submitEntryOrder="submitEntryOrder"></ShoppingCart>
        <!-- 本地购物车——客显 -->
        <!-- <CustomerOrder></CustomerOrder> -->
      </div>
      <div class="content-wrap h100" slot="right">
        <!-- 选择商品列表 -->
        <ProductList ref="pList" :show="showProductList" v-on:getSKU="loadSKU"></ProductList>

        <!-- 选择商品SKU-->
        <ProductDetails ref="pSKU" :show="showProductSku" v-on:cancelSKU="closeSKU" v-on:setShoppingCart="updateShoppingCart"></ProductDetails>

        <!-- 确认订单 -->
        <OrderSure ref="orderSure" :show="showConfirmOrder" v-on:paySuccess="paySuccess" v-on:goPay="goPay" v-on:cancelOrder="cancelOrder"></OrderSure>

        <!-- 订单付款 -->
        <OrderPay ref="payOrder" :show="showOrderPay" v-on:paySuccess="paySuccess" v-on:closeOrderPay="closeOrderPay"></OrderPay>

        <!-- 未制作订单 -->
        <NotDoneOrder ref="notDoneOrder" :show="showNotDoneOrder" v-on:num="num"></NotDoneOrder>

        <!-- 未取订单 -->
        <NotGetOrder ref="notGetOrder" :show="showNotGetOrder" v-on:num="num"></NotGetOrder>

        <!-- 挂单/恢复 -->
        <OrderEntry ref="orderEntry" :show="showOrderEntry" v-on:setShoppingCart="updateShoppingCart"></OrderEntry>

        <!-- 订单列表 -->
        <OrderList ref="orderList" :show="showOrderList" v-on:goOrderDetails="goOrderDetails" v-on:confirmOrder="confirmOrder" v-on:goPay="goPay"></OrderList>

        <!-- 线上订单列表 -->
        <OnLineOrderList ref="onLineOrderList" :show="showOnLineOrderList" v-on:goOrderDetails="goOrderDetails" v-on:goPay="goPay"></OnLineOrderList>

        <!-- 订单详情 -->
        <OrderDetails ref="orderDetails" v-on:nav="nav" :show="showOrderDetails" v-on:goPopRefund="goPopRefund"></OrderDetails>
      </div>
    </Frame>
    <!-- 框架 e -->

    <!-- 上下班弹层 s -->
    <PopWrap></PopWrap>

    <!-- 会员弹出框 -->
    <!-- <div v-if="isMemberLogin" class="pop-content" slot="content"></div> -->
    <PopMember v-show="isMemberLogin" ref="popMember" v-on:loginMember="loginMember" v-on:cancelMember="cancelMember"></PopMember>

    <!-- 登录弹出框 -->
    <div v-if="!isLogin" class="pop-content" slot="content">
      <PopWork v-on:loginSuccess="lgSuccess"></PopWork>
    </div>

    <!-- 退款弹出框 -->
    <div v-show="showPopRefund" class="pop-content" slot="content">
      <PopRefund ref="popRefund" v-on:cancelRefund="cancelRefund" v-on:nav="nav"></PopRefund>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapState } from "vuex"
import router from '@/router'
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'
import app_m from "@/modules/appMiddleware"
import { Swiper as BannerSwiper, SwiperItem, Drawer } from 'vux'
import Frame from '@/components/Frame'
import ProductList from '@/components/ProductList'
import ShoppingCart from '@/components/ShoppingCart'
import CustomerOrder from '@/components/CustomerOrder'
import PopWrap from '@/components/PopWrap'
import PopMember from '@/components/PopMember'
import PopWork from '@/components/PopWork'
import PopRefund from '@/components/PopRefund'
import ProductDetails from '@/components/ProductDetails'
import NotDoneOrder from '@/components/NotDoneOrder'
import NotGetOrder from '@/components/NotGetOrder'
import OrderPay from '@/components/OrderPay'
import OrderList from '@/components/OrderList'
import OnLineOrderList from '@/components/OnLineOrderList'
import OrderEntry from '@/components/OrderEntry'
import OrderSure from '@/components/OrderSure'
import OrderDetails from '@/components/OrderDetails'

export default {
  components: {
    Frame,
    ProductList,
    ShoppingCart,
    CustomerOrder,
    PopWrap,
    PopMember,
    PopWork,
    PopRefund,
    ProductDetails,
    NotDoneOrder,
    NotGetOrder,
    OrderPay,
    OrderList,
    OnLineOrderList,
    OrderEntry,
    OrderSure,
    OrderDetails
  },
  data() {
    return {
      pageTitle: '十点书店·咖啡POS',
      //显示登录弹框
      isLogin: false,
      //显示会员登录弹框
      isMemberLogin: false,
      //显示商品列表
      showProductList: true,
      //显示sku信息
      showProductSku: false,
      //显示确认订单
      showConfirmOrder: false,
      //显示订单付款
      showOrderPay: false,
      //是否绑定门店
      isBindStore: false,
      //未制作完成
      showNotDoneOrder: false,
      //未取订单
      showNotGetOrder: false,
      //挂单/恢复
      showOrderEntry: false,
      //订单详情
      showOrderDetails: false,
      //订单列表
      showOrderList: false,
      //线上订单列表
      showOnLineOrderList: false,
      //退款框
      showPopRefund: false,
      user: {},
      products: {}
    }
  },
  computed: {
    ...mapState({
      isShowDrawer: state => state.vux.isShowDrawer
    })
  },
  methods: {
    //子组件通知父组件，处理关闭
    closeOrderPay() {
      this.clearScreen()
      this.showProductList = true
    },
    //子组件通知父组件，会员登录弹框
    memberLogin() {
      store.commit('setShowDialog', { showDialog: true })
      this.isMemberLogin = true
      this.$refs.popMember.init()
    },
    //子组件通知父组件，会员登录
    loginMember(result) {
      store.commit('setShowDialog', { showDialog: false })
      this.isMemberLogin = false
      this.$refs.frame.updateMember(result)
    },
    //子组件通知父组件，修改角标
    num(result) {
      this.$refs.frame.updateIconNum(result)
    },
    //子组件通知父组件，会员登录
    loginOutMember() {
      this.$refs.frame.loginOutMember()
    },
    //子组件通知父组件，处理组件登录成功
    lgSuccess(data) {
      this.isLogin = true
      this.user = data
      this.loadProducts()
    },
    //子组件通知父组件，加载商品信息
    loadProducts() {
      //同时父组件通知商品列表子组件
      this.$refs.pList.api_200()
    },
    //子组件通知父组件，加载商品SKU信息
    loadSKU(data) {
      this.clearScreen()
      this.showProductSku = true
      this.$store.commit('setTitle', { title: data.name })
      //同时父组件通知商品列表子组件
      this.$refs.pSKU.api_202(data)
    },
    //更新购物车信息
    updateShoppingCart() {
      this.$refs.shoppingCart.upShoppingCart()
    },
    //确认订单
    confirmOrder(data) {
      this.$store.commit('setTitle', { title: '单号：' + data })
      this.clearScreen()
      this.showConfirmOrder = true
      this.$refs.orderSure.api_204(data)
    },
    //订单付款
    goPay(data) {
      this.clearScreen()
      this.$store.commit('setTitle', { title: '订单结算：' + data.serial_no })
      this.showOrderPay = true
      this.$refs.payOrder.init(data)
    },
    //订单详情
    goOrderDetails(data) {
      this.clearScreen()
      this.showOrderDetails = true
      this.$refs.orderDetails.init(data)
    },
    //显示退款框
    goPopRefund(data, item) {
      store.commit('setShowDialog', { showDialog: true })
      this.showPopRefund = true
      this.$refs.popRefund.init(data, item)
    },
    //取消订单
    cancelOrder() {
      this.clearScreen()
      this.$refs.orderList.init()
      this.showOrderList = true
    },
    //取消会员登录
    cancelMember() {
      store.commit('setShowDialog', { showDialog: false })
      this.isMemberLogin = false
    },
    //支付成功
    paySuccess() {
      this.clearScreen()
      this.$store.commit('setTitle', { title: '订单列表' })
      this.showNotDoneOrder = true
      this.$refs.notDoneOrder.init()
    },
    //挂单
    submitEntryOrder() {
      this.clearScreen()
      this.showOrderEntry = true
      this.$refs.orderEntry.init()
    },
    //取消退款
    cancelRefund() {
      this.showPopRefund = false
      store.commit('setShowDialog', { showDialog: false })
    },
    //子组件通知父组件，关闭商品SKU信息
    closeSKU() {
      this.clearScreen()
      this.showProductList = true
    },
    //清屏
    clearScreen() {
      this.showOrderEntry = false
      this.showProductList = false
      this.showProductSku = false
      this.showConfirmOrder = false
      this.showOrderPay = false
      this.showNotDoneOrder = false
      this.showNotGetOrder = false
      this.showOrderDetails = false
      this.showOrderList = false
      this.showOnLineOrderList = false
    },
    //底部菜单导航
    nav(type) {
      //清屏
      this.clearScreen()

      //点单
      if (type == 'menu') {
        this.$store.commit('setTitle', { title: '选择商品' })
        this.showProductList = true

        //挂单
      } else if (type == 'orderEntry') {
        this.$store.commit('setTitle', { title: '挂单/恢复' })
        this.showOrderEntry = true
        this.$refs.orderEntry.init()

        //未作订单
      } else if (type == 'notDoneOrder') {
        this.$store.commit('setTitle', { title: '未作订单' })
        this.showNotDoneOrder = true
        this.$refs.notDoneOrder.init()

        //未取订单
      } else if (type == 'notGetOrder') {
        this.$store.commit('setTitle', { title: '未取订单' })
        this.showNotGetOrder = true
        this.$refs.notGetOrder.init()

        //订单列表
      } else if (type == 'orderList') {
        this.$store.commit('setTitle', { title: '订单列表' })
        this.showOrderList = true
        this.$refs.orderList.init()

        //线上订单列表
      } else if (type == 'onLineOrderList') {
        this.$store.commit('setTitle', { title: '线上订单' })
        this.showOnLineOrderList = true
        this.$refs.onLineOrderList.init()
      }

    },
    //检查设备
    api_100(pos) {
      let that = this
      api.post(api.api_100, api.getSign({
        Pos: pos
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          let pos = app_g.getPos()
          res.data.Result.last_online_id = ((pos == undefined || pos.last_online_id == undefined) ? 0 : pos.last_online_id)
          app_g.setPos(res.data.Result)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
          router.push({ path: "./auth" })
        }
      })
    }
  },
  created() {
    this.$store.commit('setTitle', { title: '选择商品' })
    let that = this
    //当前POS设备是否绑定
    let pos = app_g.getPos()
    if (pos == null || pos.state_id == undefined || pos.state_id == 0) {
      let appInit = function (result) {
        if (result.length) {
          let tmp = JSON.parse(result)
          if (tmp.Basis.State == api.state.state_200) {
            //浏览器测试环境
            if (tmp.Result.product == "browser") { }
            that.api_100(tmp.Result)
          } else {
            that.$vux.toast.text('POS信息加载失败', 'default', 3000)
          }
        }
      }
      //初始化设备
      app_m.init(appInit)
    }

    this.isLogin = this.UserInfo.islogin()
    //如果未登录，弹出登录对话框
    if (!this.isLogin) {
      store.commit('setShowDialog', { showDialog: true })
    }

    localStorage.setItem('pageTitle', this.pageTitle)
    document.getElementById('pageTitle').innerHTML = localStorage.getItem('pageTitle')
  }
}
</script>

<style lang="scss">
// .content-wrap{
//   height: 100%;
//   overflow: auto;
// }
</style>