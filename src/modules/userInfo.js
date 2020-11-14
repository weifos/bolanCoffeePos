import { cookie } from 'vux'
import router from '../router'
import app_g from '@/modules/appGlobal'

export default {
    data: {
        user: {},
        member: {},
        confirmOrder: {},
        historyKeyWord: [],
        pdtListLayout: 1
    },
    methods: {
        //登录设置本地数据
        login(result) {
            try {
                //解决用app内嵌的webview打开网站时，localStorage就失效了
                //如果在app里面嵌入 ws.setDomStorageEnabled(true) 设置该属性
                this.user = result
                window.localStorage.setItem("user_info", JSON.stringify(result))
            }
            catch (err) {
                alert(err)
            }
        },
        //登录设置本地数据
        loginOut() {
            this.user = { token: '' }
            cookie.remove('token', { path: '/' })
            window.localStorage.removeItem("user_info")
        },
        //登录会员信息
        loginMember(result) {
            try {
                this.member = result
                window.localStorage.setItem("member_info", JSON.stringify(result))
            }
            catch (err) {
                alert(err)
            }
        },
        //登出会员信息
        loginOutMember() {
            this.member = { id: 0 }
            window.localStorage.removeItem("member_info")
        },
        //刷新登录
        refreshLogin(cb) {
            let $this = this
            this.post(app_g.api.api_300, this.GetSign(),
                function (vue, res) {
                    if (res.data.Basis.State == app_g.state.state_200) {
                        $this.login(res.data.Result)
                        cb(res.data.Result)
                    } else {
                        vue.$vux.toast.text(res.data.Basis.Msg, 'default')
                    }
                }
            )
        },
        //提交购物
        sumitSCart(result) {
            this.sCartOrder = result
            window.localStorage.removeItem('sCartOrder')
            window.localStorage.setItem("sCartOrder", JSON.stringify(result))
        },//提交立即购买
        buyNow(result) {
            this.buyNowOrder = result
            window.localStorage.removeItem('buyNowOrder')
            window.localStorage.setItem("buyNowOrder", JSON.stringify(result))
        },//设置历史查询关键词
        setHistoryKeyWord(result) {
            if (result == undefined || result == '') return
            let keyWords = window.localStorage.getItem("historyKeyWord")
            if (keyWords == null) {
                keyWords = []
                keyWords.push(result)
            } else {
                keyWords = JSON.parse(keyWords)
                if (!keyWords.some((ele) => { return ele == result })) {
                    keyWords.splice(0, 0, result)
                    if (keyWords.length > 10) {
                        keyWords.splice(keyWords.length - 1, 1)
                    }
                }
            }

            window.localStorage.setItem("historyKeyWord", JSON.stringify(keyWords))
            this.historyKeyWord = keyWords
        },//删除单个历史查询关键词
        delHistoryKeyWord(keyword) {
            if (this.historyKeyWord.length == 0) return
            this.historyKeyWord.forEach((ele, index) => {
                if (ele == keyword) {
                    this.historyKeyWord.splice(index, 1)
                }
            })
            window.localStorage.setItem("historyKeyWord", JSON.stringify(this.historyKeyWord))
            this.historyKeyWord = this.historyKeyWord
        },//清空历史查询关键词
        clearHistoryKeyWord() {
            if (this.historyKeyWord.length == 0) return
            this.$vux.confirm.show({
                title: '确认清空吗',
                onCancel() { },
                onConfirm() {
                    window.localStorage.setItem("historyKeyWord", JSON.stringify([]))
                    this.historyKeyWord = []
                }
            })

        },//是否登录
        islogin() {
            if (!this.user.token) {
                return false
            } else {
                return true
            }
        }
    },
    created() {
        //系统用户信息
        let userInfoData = window.localStorage.getItem("user_info")
        if (userInfoData) {
            this.user = JSON.parse(userInfoData)
        } else {
            this.user = { token: '' }
        }

        //会员用户信息
        let memberInfo = window.localStorage.getItem("member_info")
        if (memberInfo) {
            this.member = JSON.parse(memberInfo)
        } else {
            this.member = {}
        }

        //提交购物车
        let sCOrder = window.localStorage.getItem("sCartOrder")
        if (sCOrder) {
            this.sCartOrder = JSON.parse(sCOrder)
        }

        //立即购买
        let buyNow = window.localStorage.getItem("buyNowOrder")
        if (buyNow) {
            this.buyNowOrder = JSON.parse(buyNow)
        }

        let keyWords = window.localStorage.getItem("historyKeyWord")
        if (keyWords) {
            this.historyKeyWord = JSON.parse(keyWords)
        }

        let products = window.localStorage.getItem("historyProduct")
        if (products) {
            this.historyProduct = JSON.parse(products)
        }

        //商品布局
        let pdtListLayout = window.localStorage.getItem("pdtListLayout")
        if (pdtListLayout) {
            this.pdtListLayout = pdtListLayout
        }

    }
}

