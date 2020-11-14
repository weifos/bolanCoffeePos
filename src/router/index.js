import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const index = () => import(/*webpackChunkName: "home" */ "@/view/home/index")
const banner = () => import(/*webpackChunkName: "home" */ "@/view/home/banner")
const auth = () => import(/*webpackChunkName: "home" */ "@/view/home/auth")


//实例化路由
const vueRouter = new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        //控制每次切换到新页面滚动的顶部
        return { x: 0, y: 0 }
    },
    routes: [
        { path: '*', redirect: '/home/index', component: index },
        { path: '/', redirect: '/home/index', component: index },
        { path: '/home/index', name: 'index', component: index },
        { path: '/home/banner', name: 'banner', component: banner },
        { path: '/home/auth', name: 'auth', component: auth }
    ]
})

export default vueRouter