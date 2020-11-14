<template>
  <div class="pop-member abs">
    <div class="pop-tit bg-main text-white tac">会员号</div>
    <div class="pop-con">
      <div class="pop-input">
        <input type="text" placeholder="请输入手机号" ref="inputLoginName" @keyup.enter="enterInputLoginName" @blur="loginNameBlur" v-model="inputLoginName" maxlength="11" class="input-phone input-text-1" />
      </div>
      <div class="pop-btns list-inlineblock">
        <button class="btn-number f-item" @click="getNum(7)">7</button>
        <button class="btn-number f-item" @click="getNum(8)">8</button>
        <button class="btn-number f-item" @click="getNum(9)">9</button>
        <button class="btn-number f-item" @click="del()">删除</button>
        <button class="btn-number f-item" @click="getNum(4)">4</button>
        <button class="btn-number f-item" @click="getNum(5)">5</button>
        <button class="btn-number f-item" @click="getNum(6)">6</button>
        <button class="btn-number f-item" @click="clearInputText()">清除</button>
        <button class="btn-number f-item" @click="getNum(1)">1</button>
        <button class="btn-number f-item" @click="getNum(2)">2</button>
        <button class="btn-number f-item" @click="getNum(3)">3</button>
        <button class="btn-number f-item" @click="getNum(0)">0</button>
      </div>
      <div class="mt5 nowrap">
        <button class="button round bg-main text-white button-size-normal f-item btn-submit" @click="api_216">提交</button>
        <button class="button round bg-gray text-white button-size-normal f-item" @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'
import app_m from "@/modules/appMiddleware"

export default {
  data() {
    return {
      curIndex: 0,
      //是否回车加载中
      isEnterLoading: false,
      //会员码
      userCode: '',
      //显示现金输入金额
      inputLoginName: ''
    }
  },
  filters: {
    //获取支付方式名称
    getPayMethodName(payMethod) {
      if (payMethod == 11) {
        return '微信支付'
      } else if (payMethod == 21) {
        return '支付宝支付'
      } else if (payMethod == 31) {
        return '电子钱包支付'
      } else if (payMethod == 41) {
        return '储值卡支付'
      } else if (payMethod == 51) {
        return '现金支付'
      } else if (payMethod == 104) {
        return '美团收款'
      } else if (payMethod == 103) {
        return '商场提货卡'
      } else if (payMethod == 105) {
        return '华润代金券'
      }
    }
  },
  directives: {
    payCodeFocus: {
      inserted: function (el, { value }) {
        el.focus()
      }
    },
    eWalletFocus: {
      inserted: function (el, { value }) {
        el.focus()
        // el.onfocus = function () { }
        // el.onblur = function () {
        //   el.focus()
        // }
      }
    }
  },
  computed: {
    tmpFlows() {
      let tmp = []
      let svItem = {}
      let total_amount = 0
      this.payFlows.forEach((item, index) => {
        //如果是储值卡支付
        if (item.pay_method == this.payMethod.sVCard) {
          total_amount += item.amount
          svItem = item
        } else {
          tmp.push(item)
        }
      })

      if (svItem.card_no != undefined) {
        tmp.push({
          pay_method: this.payMethod.sVCard,
          amount: total_amount
        })
      }

      return tmp
    }
  },
  methods: {
    init() {
      setTimeout(() => { this.$refs.inputLoginName.focus() }, 100)
      this.inputLoginName = ''
      this.isEnterLoading = false
    },
    //扫会员码
    enterInputLoginName() {

      if (!this.isEnterLoading) {
        this.isEnterLoading = true
        if (this.inputLoginName.length == 11) {
          this.userCode = this.inputLoginName
          this.api_216()
        } else {
          this.isEnterLoading = false
        }
      }
    },
    loginNameBlur() {
      if (this.$refs.inputLoginName != undefined) {
        setTimeout(() => {
          try {
            let length = this.inputLoginName.length
            this.$refs.inputLoginName.focus()
            this.$refs.inputLoginName.selectionStart = length
            this.$refs.inputLoginName.selectionEnd = length
          } catch (ex) { }
        }, 100)
      }
    },
    //删除
    del(n) {
      let len = this.inputLoginName.length
      if (len > 0) {
        if (len - 1 <= 0) {
          this.inputLoginName = ''
        } else {
          this.inputLoginName = this.inputLoginName.substring(0, len - 1)
        }
      }
    },
    //显示的金额
    clearInputText(payType) {
      this.inputLoginName = ''
    },
    //现金支付点击
    getNum(n) {
      if (this.inputLoginName.length < 11) {
        this.inputLoginName = this.inputLoginName + '' + n
      }
    },
    //会员登录
    api_216() {
      let that = this
      if (this.inputLoginName.length == 0) {
        that.$vux.toast.text('请输入用户名', 'default', 3000)
        that.isEnterLoading = false
        return
      }

      api.post(api.api_216, api.getSign({
        LoginName: this.inputLoginName
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //写入会员信息在本地
          that.UserInfo.loginMember(res.data.Result.member)
          //关闭模态窗口
          that.$emit('loginMember', res.data.Result.member)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
        that.inputLoginName = ''
        that.isEnterLoading = false
      })
    },
    //取消会员弹出框
    cancel() {
      this.$emit('cancelMember')
    },
    //清空会员信息
    clearMember() {
      this.member = { id: 0, mobile: '----', balance: 0, dis_count: 0.99, integral: 0, coupon: { type: 0, amount: 0.0 } }
    },
    //根据用户码获取会员信息
    api_208(code, user_id) {
      let that = this
      api.post(api.api_208, api.getSign({ UserCode: code }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //会员信息
          that.member = res.data.Result.member
          if (that.member.balance - that.unpaidAmount >= 0) {
            let curFlow = that.getFlow()
            curFlow.pay_method = that.payMethod.eWallet
            curFlow.user_id = user_id
            //订单所属用户
            that.order.user_id = user_id
            //订单所属用户账户
            that.order.login_name = that.member.login_name
            //金额
            curFlow.amount = that.unpaidAmount
            //加入支付流水
            that.payFlows.push(curFlow)
            //显示电子钱包付清余额
            that.eWalletPayOffBalance = that.member.balance - that.unpaidAmount

            //
            setTimeout(() => {
              that.api_205()
            }, 1000)
          }
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
        setTimeout(() => {
          that.isEnterLoading = false
        }, 2000)
      })
    }
  }
}
</script>


<style lang="scss">
.pop-member {
  width: 310px;
  // height:400px;
  background: rgba(255, 255, 255, 1);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .pop-tit {
    line-height: 61px;
    height: 61px;
    font-size: 20px;
    font-weight: 400;
  }
  .pop-con {
    padding: 13px;
  }
  .pop-btns {
    margin: 19px -5px 0 0;
    .f-item {
      margin-right: 11px;
      margin-bottom: 15px;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .btn-submit {
    margin-right: 18px;
  }
}
</style>