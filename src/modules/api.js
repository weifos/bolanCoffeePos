import axios from 'axios'
import store from '../store'
import md5 from 'blueimp-md5'
import user from './userInfo'

//接口域名
let domain = "http://coffeeapi.sdibook.com/"
let res_domain = "http://res.sdibook.com/"
// let domain = "http://test.coffeeapi.sdibook.com/"
// let res_domain = "http://test.res.sdibook.com/"
//测试环境配置
if (process.env.NODE_ENV !== 'production') {
    domain = "/api/"
    res_domain = "/res/"
}

/// <summary>
/// 全局配置类
/// @author   叶委
/// @date     2014-05-23
/// </summary>
export default {
    //资源站点
    res: res_domain,
    //咖啡系统初始化
    api_100: domain + "100",
    //咖啡系统用户登录
    api_101: domain + "101",
    //咖啡POS首页数据
    api_200: domain + "200",
    //咖啡POS根据导购分类获取
    api_201: domain + "201",
    //咖啡POS加载商品详情
    api_202: domain + "202",
    //咖啡POS提交订单
    api_203: domain + "203",
    //咖啡POS订单详情
    api_204: domain + "204",
    //咖啡POS订单支付
    api_205: domain + "205",
    //咖啡POS订单支付
    api_206: domain + "206",
    //咖啡POS订单完成
    api_207: domain + "207",
    //根据用户码获取会员信息
    api_208: domain + "208",
    //使用储值卡刷卡
    api_209: domain + "209",
    //加载订单明细
    api_210: domain + "210",
    //退款
    api_211: domain + "211",
    //立即挂单
    api_212: domain + "212",
    //挂单列表
    api_213: domain + "213",
    //删除挂单
    api_214: domain + "214",
    //可退订单（流水和金额）
    api_215: domain + "215",
    //会员登录
    api_216: domain + "216",
    //扫码获取优惠券
    api_217: domain + "217",
    //更新订单优惠券金额
    api_218: domain + "218",
    //接收小程序实时订单
    api_219: domain + "219",
    //查询线上订单
    api_220: domain + "220",
    //日结接口
    api_221: domain + "221",
    //轮播banner
    api_290: domain + "290",
    //获取签名
    getSign(obj = {}) {
        let { token } = user.data.user
        function sort(obj) {
            if (obj instanceof Array) {
                //如果数组里面存放的为对象,通过map更改数组结构，排序
                obj = obj.map((ele, index) => {
                    if (ele instanceof Object) {
                        var newObj = {}
                        Object.keys(ele).sort().forEach(function (key) {
                            var o = ele[key]
                            if (o instanceof Object) {
                                o = sort(o)
                            }
                            newObj[key] = o
                        })
                        ele = newObj
                    }
                    return ele
                })
                return obj
            }

            var newObj = {}
            //默认情况下，对字符串排序，是按照ASCII的大小比较的，现在，我们提出排序应该忽略大小写，按照字母序排序。要实现这个算法，
            //不必对现有代码大加改动，只要我们能定义出忽略大小写的比较算法就可以
            Object.keys(obj).sort((s1, s2) => {
                let x1 = s1.toUpperCase()
                let x2 = s2.toUpperCase()
                if (x1 < x2) {
                    return -1
                }
                if (x1 > x2) {
                    return 1
                }
                return 0
            }).forEach(function (key) {
                var o = obj[key]
                if (o instanceof Object) {
                    o = sort(o)
                }
                newObj[key] = o
            })
            return newObj
        }

        const sign_data = {
            Data: obj,
            Global: {
                IMEI: "",
                IMSI: "",
                IP: "",
                OS: 3,
                Sign: "",
                Token: token
            }
        }

        //console.log(JSON.stringify(sort(sign_data)))
        return {
            Data: obj,
            Global: {
                IMEI: "",
                IMSI: "",
                IP: "",
                OS: 3,
                Sign: md5(JSON.stringify(sort(sign_data)) + ')(4AzEdr5J6a`@#$*%'),
                Token: token
            }
        }
    },
    //请求对象
    post(url, data, cb, ch) {
        let that = this
        //加载框
        store.commit("loadingStatus", { isLoading: true })
        axios(url, {
            method: "post",
            data: data
        }).then(res => {
            if (res.data.Basis != undefined && res.data.Basis.State == 205) {
                that.$vux.toast.text(res.data.Basis.Msg, "default")
            } else {
                cb(this, res)
            }
            store.commit("loadingStatus", { isLoading: false })
        }).catch(err => {
            console.log("错误来自于err" + err)
            if (ch != undefined) {
                ch(err)
            }
        })
    },
    //状态码
    state: {
        // 系统错误
        state_500: 500,
        // 响应成功
        state_200: 200,
        // 验证通过
        state_0: 0,
        // 验证未通过
        state_1: 1,
        // 用户未登陆
        state_30045: 30045
    }
}