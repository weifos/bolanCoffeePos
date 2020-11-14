<template>
  <div class="pop-tuikuan abs">
    <div class="pop-tit bg-main text-white tac">请确认退款数量</div>
    <div class="pop-con tac">
      <div class="dib vam value-bar">
        <button class="btn btn-subtract operate-btn-size-middle mr10" @click="sub"></button>
        <input type="text" class="dib vam font-size-big round bg-white text-gray tac input-size-normal no-border" v-model="buyCount" />
        <button class="btn btn-plus operate-btn-size-middle ml10" @click="add"></button>
      </div>
      <div class="btns nowrap">
        <button class="button round bg-main text-white button-size-normal f-item btn-submit" @click="submit()">提交</button>
        <button class="button round bg-gray text-white button-size-normal f-item" @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'
import app_m from "@/modules/appMiddleware"

export default {
  data() {
    return {
      order: {
        id: 0
      },
      //退的商品明细
      detail: {},
      buyCount: 1
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //初始化
    init(data, item) {
      this.buyCount = 1
      this.order = data
      this.detail = item
      this.detail.unit_price = item.avg_unit_amount
    },
    //减
    sub() {
      if (this.buyCount <= 1) {
        this.buyCount = 1
        return
      } else {
        this.buyCount--
      }
    },
    //添加数量
    add() {
      if (this.buyCount + this.order.refund_count >= this.detail.count) {
        this.buyCount = this.detail.count - this.order.refund_count
        return
      } else {
        this.buyCount++
      }
    },
    cancel() {
      this.$emit('cancelRefund')
    },
    //退款
    submit() {
      let that = this
      that.order.created_user_id = that.UserInfo.user.id
      that.detail.count = that.buyCount
      that.order.details = []
      //that.order.serial_no = ''
      that.order.details.push(that.detail)
      //流水退款金额
      let amount = that.detail.avg_unit_amount * that.detail.count
      //退款总额
      that.order.total_amount = amount
      //退款总额
      that.order.details[0].total_amount = amount
      //支付流水
      let flows = []
      //单一支付
      if (that.order.pay_method != 100) {
        let flow = that.getFlow()
        //退款金额
        flow.amount = amount
        //支付方式
        flow.pay_method = that.order.pay_method
        //加入到流水
        flows.push(flow)
        //混合支付情况
      } else {
        let flow = that.getFlow()
        //是否有电子钱包支付
        var hasEWallet = that.order.flow.filter(item => item.pay_method === 31 && item.flow_type === 1)
        //是否有储值卡支付
        var hasSVCard = that.order.flow.filter(item => item.pay_method === 41 && item.flow_type === 1)
        //是否有微信支付
        var hasWeChat = that.order.flow.filter(item => item.pay_method === 11 && item.flow_type === 1)
        //是否有支付宝支付
        var hasALi = that.order.flow.filter(item => item.pay_method === 21 && item.flow_type === 1)

        if (hasEWallet != null && hasEWallet.length > 0) {
          //支付方式
          flow.pay_method = 31
          //退款金额
          flow.amount = amount
        } else if (hasSVCard != null && hasSVCard.length > 0 && flow.pay_method == -1) {
          //支付方式
          flow.pay_method = 41
          //退款金额
          flow.amount = amount
          //此处一定是微信支付加现金支付
        } else if (hasWeChat != null && hasWeChat.length > 0 && flow.pay_method == -1) {
          let tmpAmount = 0, retAmount = 0, canRetAmount = 0
          //原订单微信支付流水
          that.order.flow.forEach((ele) => {
            if (ele.pay_method === 11 && ele.flow_type === 1) {
              tmpAmount += ele.amount
            }
          })

          //已经退过的移动支付流水
          that.order.flow.forEach((ele) => {
            if (ele.pay_method === 11 && ele.flow_type === -1) {
              retAmount += ele.amount
            }
          })

          //支付方式
          flow.pay_method = 11
          //计算可退的微信支付金额
          canRetAmount = tmpAmount - retAmount
          if (canRetAmount > 0) {
            //当前退款金额大于剩余移动可退金额，则生成两条退款流水
            if (amount - canRetAmount > 0) {
              //剩余移动支付可退金额
              flow.amount = canRetAmount
              //新的流水
              let flow1 = that.getFlow()
              //其余的退现金
              flow1.amount = amount - flow.amount
              //51现金支付
              flow1.pay_method = 51
              //加入到流水
              flows.push(flow1)
            } else {
              flow.amount = amount
            }
          } else {
            //全部退现金
            flow.pay_method = 51
            //剩余移动支付可退金额
            flow.amount = amount
          }

          //此处一定是阿里支付加现金支付
        } else if (hasALi != null && hasALi.length > 0 && flow.pay_method == -1) {
          let tmpAmount = 0, retAmount = 0, canRetAmount = 0
          //原订单支付宝支付流水
          that.order.flow.forEach((ele) => {
            if (ele.pay_method === 21 && ele.flow_type === 1) {
              tmpAmount += ele.amount
            }
          })

          //已经退过的移动支付流水
          that.order.flow.forEach((ele) => {
            if (ele.pay_method === 21 && ele.flow_type === -1) {
              retAmount += ele.amount
            }
          })

          //支付方式
          flow.pay_method = 21
          //计算可退的微信支付金额
          canRetAmount = tmpAmount - retAmount
          if (canRetAmount > 0) {
            //当前退款金额大于剩余移动可退金额，则生成两条退款流水
            if (amount - canRetAmount > 0) {
              //剩余移动支付可退金额
              flow.amount = canRetAmount
              //新的流水
              let flow1 = that.getFlow()
              //其余的退现金
              flow1.amount = amount - flow.amount
              //51现金支付
              flow1.pay_method = 51
              //加入到流水
              flows.push(flow1)
            } else {
              flow.amount = amount
            }
          } else {
            //全部退现金
            flow.pay_method = 51
            //剩余移动支付可退金额
            flow.amount = amount
          }
        }


        flows.push(flow)
      }

      //支付流水
      that.order.flow = flows
      //加入到流水
      this.api_211()
    },
    //退货退款
    api_211() {
      let that = this
      api.post(api.api_211, api.getSign({
        OrderReturns: that.order
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
          //调起打印
          app_m.print(app_g.getPos().store_id, that.UserInfo.user.id, res.data.Result, 1, () => {
            console.log('打印回调')
          })
          that.$emit('cancelRefund')
          //不是线上订单
          if (that.order.pay_method != 13) {
            that.$emit('nav', 'orderList')
          } else {
            that.$emit('nav', 'onLineOrderList')
          }

        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //获取支付流水
    getFlow() {
      return {
        store_id: app_g.getPos().store_id,
        serial_no: app_g.util.getSerialNum('T'),
        order_id: this.order.id,
        order_no: this.order.order_no,
        user_id: this.order.user_id,
        pos_no: app_g.getPos().no,
        amount: 0,
        coin_type: 0,
        coin_rate: 1,
        convert_amt: 0,
        pay_method: -1,
        pay_name: "",
        trade_type: 21,
        flow_type: -1,
        is_enable: true,
        created_date: app_g.util.date.getDateTimeNow(),
        created_user_id: this.UserInfo.user.id
      }
    }
  },
  created() {
  }
}

</script>

<style lang="scss">
.pop-tuikuan {
  width: 410px;
  // height:400px;
  background: rgba(255, 255, 255, 1);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .value-bar {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .font-size-big {
    font-size: 22px;
  }

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