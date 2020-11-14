//import 'babel-polyfill'
import Vue from 'vue'
import Print from 'vue-print-nb'
import { cookie, AlertPlugin, ToastPlugin, LoadingPlugin, ConfirmPlugin, DatetimePlugin, PopupPicker } from 'vux'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import $ from 'jquery'
import store from './store'
import Bridge from './modules/bridge.js'
import Dec from 'decimal.js'
import app_g from "./modules/appGlobal"
import user from "./modules/userInfo"
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(Print)
Vue.use(VueAwesomeSwiper)
Vue.prototype.$bridge = Bridge
Vue.prototype.$ = $
Vue.prototype.cookie = cookie
Vue.use(ConfirmPlugin)//弹出确认框
Vue.use(AlertPlugin)  //Alert弹窗 
Vue.use(ToastPlugin)  //Toast弹窗 
Vue.use(LoadingPlugin)//加载弹窗 
// Vue.use(DatetimePlugin)//选择日历 
// Vue.use(PopupPicker)//选择日历 
/* eslint-disable no-new */
var vm = new Vue({ el: "#appBox", router, store, render: h => h(App) })

//用户数据
Vue.prototype.UserInfo = new Vue(user);

//全局注册过滤器 获取支付方式名称
Vue.filter('GetPayMethodName', function (payMethod) {

    switch (payMethod) {
        case 11:
            return '微信支付'

        case 21:
            return '支付宝支付'

        case 31:
            return '电子钱包支付'

        case 41:
            return '储值卡支付'

        case 51:
            return '现金支付'

        case 100:
            return '混合支付'

        case 105:
            return '华润代金券'

        default:
            return ''
    }
})

//全局注册过滤器 获取小票流水号
Vue.filter('GetSerialNum', function (value) {
    if (value == undefined || value.toString().length == 0) return
    //获取字符
    return '00000'.substr(0, 5 - value.toString().length) + value
})

//全局注册过滤器 金额格式化
Vue.filter('MoneyToF', function (value) {
    // return parseFloat(value).toFixed(2)
    if (value == undefined || value.toString().length == 0) return '0'
    return new Dec(app_g.util.formatDecimal(value, 2)).toNumber()
})

//比较日期
Vue.filter('CompareDateNow', function (t) {
    return app_g.util.date.CompareDateNow(t)
})

//日期格式化
Vue.filter('DateFormat', function (t, format) {
    if (t == null || t == '') { return '' }
    return app_g.util.date.DateFormat(t, format)
})

//字符串截取
Vue.filter('cutSubString', function (str, len) {
    if (str == null || str == '') { return '' }
    return app_g.util.cutSubString(str, len)
})

//隐藏手机
Vue.filter('getHideMobile', function (t) {
    return app_g.util.getHideMobile(t)
})

FastClick.attach(document.body)

Vue.config.productionTip = false

//加载前弹出加载框
router.beforeEach(function (to, from, next) {
    store.commit('loadingStatus', { isLoading: true })
    sessionStorage.setItem("BackUrl", from.path)
    next()
})

//加载前弹出加载框
router.afterEach(function (to) {
    store.commit('loadingStatus', { isLoading: false })
})