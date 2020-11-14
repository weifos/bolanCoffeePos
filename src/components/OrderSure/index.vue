<template>
  <div class="order-sure rel section-2" v-if="show">
    <!-- <div class="section-tit">订单结算</div> -->
    <div class="section-con2 h100">
      <div class="con-wrap rel h100">
        <div class="form-order-sure abs border-box">
          <div class="form-wrap bg-white rel">
            <div class="bg-main text-white tac font-size-middle font-tit">订单确认</div>
            <div class="form-con h100 border-box pd20">
              <div class="row hidden">
                <div class="order-time fr">下单时间：{{result.created_date }}</div>
                <div class="order-no">订单编号：{{result.serial_no }}</div>
              </div>
              <div class="row mt20">
                <!-- <div class="row-name">商品信息：</div> -->
                <div class="form-1 bg-white rel mt10">
                  <div class="form-head list-inlineblock tac">
                    <div class="head-item f-item w2 bg-gray text-white">品名</div>
                    <div class="head-item f-item w1 bg-gray text-white">数量</div>
                    <div class="head-item f-item w1 bg-gray text-white">单价</div>
                    <div class="head-item f-item w1 bg-gray text-white">小计</div>
                  </div>
                  <div class="form-body tac">
                    <div class="form-body-wrap">
                      <ul class="text-gray">
                        <li class="list-inlineblock tac" v-for="(item,index) in result.store_details" :key="index">
                          <div class="body-item f-item w2">
                            {{item.product_name}}
                            <span>{{item.spec_msg}}</span>
                          </div>
                          <div class="body-item f-item w1">{{item.count}}</div>
                          <div class="body-item f-item w1">{{item.actual_amount}}</div>
                          <div class="body-item f-item w1">{{item.total_amount}}</div>
                        </li>
                      </ul>
                      <div class="total-bar">
                        <div class="row list-inlineblock">
                          <div class="total-name w3 f-item tal border-box pl20">合计</div>
                          <div class="total-num w1 f-item">{{result.totalCount}}</div>
                          <div class="total-price w1 f-item">{{result.total_amount | MoneyToF}}</div>
                        </div>
                        <div class="row list-inlineblock text-red mt10" v-if="result.mkt_dis_amount > 0 && result.mkt_dis_amount > result.vip_dis_amount&& result.mkt_dis_amount > result.coupon_amount">
                          <div class="total-name w4 f-item tal border-box pl20">活动优惠</div>
                          <div class="total-price w1 f-item">-{{result.mkt_dis_amount | MoneyToF}}</div>
                        </div>
                        <div class="row list-inlineblock text-red mt10" v-if="result.vip_dis_amount > 0 && result.vip_dis_amount > result.coupon_amount && result.vip_dis_amount  > result.mkt_dis_amount">
                          <div class="total-name w4 f-item tal border-box pl20">会员优惠</div>
                          <div class="total-price w1 f-item">-{{result.vip_dis_amount | MoneyToF}}</div>
                        </div>
                        <div class="row list-inlineblock text-red mt10" v-if="result.coupon_amount > 0 && result.coupon_amount > result.vip_dis_amount && result.coupon_amount  > result.mkt_dis_amount">
                          <div class="total-name w4 f-item tal border-box pl20">优惠券</div>
                          <div class="total-price w1 f-item">-{{result.coupon_amount | MoneyToF}}</div>
                        </div>
                        <div class="row list-inlineblock mt10 bold">
                          <div class="total-name w4 f-item tal border-box pl20 size-big">实付金额</div>
                          <div class="total-price w1 f-item size-big">{{discounts | MoneyToF}}</div>
                        </div>
                        <div class="row list-inlineblock mt10">
                          <div class="total-name w4 f-item tal border-box pl20 size-big">
                            使用优惠券
                            <input type="text" placeholder="扫码优惠券" ref="userCouponCode" @keyup.enter="enterCouponCode" style="width: 200px;height:23px;" maxlength="50" v-model="couponCodeText" @blur="couponCodeBlur" class="text-code" />
                          </div>
                          <div class="total-price w1 f-item size-big"></div>
                        </div>
                      </div>
                      <div class="btns-bar">
                        <button class="button round bg-main text-white button-size-normal" @click="submit">确认</button>
                        <button class="button round bg-gray text-white button-size-normal" @click="cancel">取消</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import api from '@/modules/api'
import app_g from '@/modules/appGlobal'

export default {
  data() {
    return {
      curIndex: 1,
      //最终优惠金额
      discounts: 0,
      //用户优惠券
      userCoupon: {},
      totalCount: 0,
      //优惠券码
      couponCode: '',
      //优惠券文本
      couponCodeText: '',
      //是否回车加载中
      isEnterLoading: false,
      result: {
        no: "",
        time: "",
        list: []
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    eWalletFocus: {
      inserted: function (el, { value }) {
        el.focus()
      }
    }
  },
  methods: {
    init() {
      setTimeout(() => { this.$refs.userCouponCode.focus() }, 100)
      this.isEnterLoading = false
      this.couponCode = ''
      this.couponCodeText = ''
    },
    //加载订单明细
    api_204(order_no) {
      let that = this
      that.init()
      that.totalCount = 0
      api.post(api.api_204, api.getSign({
        StoreID: app_g.getPos().store_id,
        OrderNo: order_no
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.result = res.data.Result
          let maxAmount = that.result.vip_dis_amount > that.result.mkt_dis_amount ? that.result.vip_dis_amount : that.result.mkt_dis_amount
          that.discounts = that.result.total_amount - maxAmount

          //优惠券力度最大
          if (that.result.coupon_amount > that.result.vip_dis_amount && that.result.coupon_amount > that.result.mkt_dis_amount) {
            that.discounts = that.result.total_amount - that.result.coupon_amount
            //会员优惠优惠力度最大
          } else if (that.result.vip_dis_amount > that.result.coupon_amount && that.result.vip_dis_amount > that.result.mkt_dis_amount) {
            that.discounts = that.result.total_amount - that.result.vip_dis_amount
            //活动优惠力度最大
          } else if (that.result.mkt_dis_amount > that.result.coupon_amount && that.result.mkt_dis_amount > that.result.vip_dis_amount) {
            that.discounts = that.result.total_amount - that.result.mkt_dis_amount
          }

          if (that.discounts < 0) that.discounts = 0
          res.data.Result.store_details.forEach((ele) => {
            that.totalCount += ele.count
          })
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //扫码获取优惠券
    api_217(couponCode) {
      let that = this
      api.post(api.api_217, api.getSign({
        No: couponCode,
        Module: 2,
        Order: that.result
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.userCoupon = res.data.Result
          //优惠券 优惠最优
          if (that.userCoupon.amount > that.result.vip_dis_amount && that.userCoupon.amount > that.result.mkt_dis_amount) {
            that.discounts = that.result.total_amount - that.userCoupon.amount
            if (that.discounts < 0) that.discounts = 0

            that.result.coupon_amount = that.userCoupon.amount
            that.result.user_coupon_id = that.userCoupon.user_coupon_id
          } else {
            if (that.userCoupon.amount > 0) {
              that.$vux.toast.text('优惠券优惠力度小于当前优惠不能使用', 'default', 5000)
              that.isEnterLoading = false
              return
            }
          }

          //会员优惠 优惠最优
          if (that.result.vip_dis_amount > that.result.coupon_amount && that.result.vip_dis_amount > that.result.mkt_dis_amount) {
            that.discounts = that.result.total_amount - that.result.vip_dis_amount
          }

          //活动优惠 优惠最优
          if (that.result.mkt_dis_amount > that.result.coupon_amount && that.result.mkt_dis_amount > that.result.vip_dis_amount) {
            that.discounts = that.result.total_amount - that.result.mkt_dis_amount
          }
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
        that.isEnterLoading = false
      })
    },
    //更新订单优惠券
    api_218() {
      let that = this
      api.post(api.api_218, api.getSign({
        StoreID: that.result.store_id,
        OrderNo: that.result.serial_no,
        CouponID: that.result.user_coupon_id,
        CouponAmount: that.result.coupon_amount
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //优惠券金额
          that.result.coupon_amount = that.result.coupon_amount
          //优惠券支付
          that.result.pay_method = 109
          //去付款
          that.$emit('goPay', that.result)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //扫优惠券码
    enterCouponCode() {

      if (!this.isEnterLoading) {
        this.isEnterLoading = true
        if (this.couponCodeText.length == 21) {
          this.couponCode = this.couponCodeText
          this.couponCodeText = ''
          this.api_217(this.couponCode)
        }
      }
    },
    //优惠券码输入框失去焦点事件
    couponCodeBlur() {
      if (this.$refs.userCouponCode != undefined) {
        setTimeout(() => { try { this.$refs.userCouponCode.focus() } catch (ex) { } }, 100)
      }
    },
    //确认提交
    submit() {
      if (this.result.coupon_amount > this.result.vip_dis_amount && this.result.coupon_amount > this.result.mkt_dis_amount) {
        this.api_218()
      } else {
        this.$emit('goPay', this.result)
      }
    },
    //取消订单
    cancel() {
      this.$emit('cancelOrder', this.result.serial_no)
    }
  }
}
</script>

<style lang="scss">
.order-sure {
  .font-tit {
    height: 57px;
    line-height: 57px;
  }
  .form-order-sure {
    width: 700px;
    left: 50%;
    top: 50%;
    height: 580px;
    background-color: #fff;
    transform: translate(-50%, -50%);
  }
  .form-1 {
    height: 100%;

    .form-head {
      .head-item {
        box-sizing: border-box;
        height: 35px;
        line-height: 35px;
        border-right: 1px solid #fff;

        &:last-child {
          border: none;
        }
      }
    }
    .form-body {
      box-sizing: border-box;
      height: 100%;

      .body-item {
        position: relative;
        height: 35px;
        line-height: 35px;
      }

      .text-code {
        border-left-width: 0px;
        border-top-width: 0px;
        border-right-width: 0px;
        border-bottom-width: 1px;
        border-bottom-color: black;
      }
    }
    .form-body-wrap {
      ul {
        overflow-x: hidden;
        overflow-y: auto;
        height: 200px;
        // background: #888;
      }
    }
    .w1 {
      width: 15%;
    }
    .w2 {
      width: 55%;
    }
    .w3 {
      width: 70%;
    }
    .w4 {
      width: 85%;
    }

    .total-bar {
      border-top: 1px solid #acacac;
      padding-top: 20px;
      height: 85px;

      .size-big {
        font-size: 18px;
      }

      .total-name {
        padding-left: 20px;
      }
    }
    .btns-bar {
      margin-top: 35px;
      .button {
        margin: 0 30px;
      }
    }
  }
}
</style>
