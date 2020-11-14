<template>
  <div class="order-pay rel section-2" v-if="show">
    <div class="con-wrap rel" style="overflow: hidden;">
      <div class="form-pay abs border-box">
        <div class="form-wrap bg-white rel">
          <div class="form-tit abs w100 bg-main-dark text-white rel font-size-middle tac">
            订单结算
            <div class="form-close abs bg-main text-white" @click="close">X</div>
          </div>
          <div class="form-con list-inlineblock text-gray h100 border-box">
            <div class="left-part f-item h100 border-box pd10">
              <div class="part-wrap h100 rel">
                <!-- type-mobile 移动支付 -->
                <div class="type-mobile type-bar height3 pb10 border-box" v-show="curIndex == 0">
                  <div class="bg-white w100 h100 rel">
                    <p class="font-size-middle tac text-tit">【请扫描微信或支付宝二维码支付】</p>
                    <div class="text-wrap">
                      <p class="mt15 tac">
                        付款码：
                        <input type="text" class="text-code" ref="pCode" v-model="payCodeText" @keyup.enter="enterPayCode" @blur="payCodeBlur" />
                      </p>
                    </div>
                  </div>
                </div>

                <!-- type-e-wallet 电子钱包支付-->
                <div class="type-e-wallet type-bar height3 pb10 border-box" v-show="curIndex == 1">
                  <div class="bg-white w100 h100 rel">
                    <p class="font-size-middle tac text-tit">【请扫描十点小程序会员中心的付款码】</p>
                    <div class="text-wrap">
                      <p class="mt15 tac">
                        付款码：
                        <input type="text" class="text-code" ref="eWallet" v-model="eWalletText" @keyup.enter="enterEWalle" @blur="eWalletBlur" />
                      </p>
                      <div class="pay_content">
                        <p>手机号码： {{member.mobile}}</p>
                        <p>当前余额： {{member.balance | MoneyToF}}</p>
                        <p>
                          需要支付：
                          <span style="color:red">{{unpaidAmount | MoneyToF}}</span>
                        </p>
                        <p v-if="member.id > 0 && member.balance - unpaidAmount < 0">
                          支付状态：
                          <span style="color:red">余额不足</span>
                        </p>
                        <p v-if="member.balance - unpaidAmount >= 0">
                          付清余额：
                          <span style="color:red">{{eWalletPayOffBalance | MoneyToF}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- type-card 储值卡 -->
                <div class="type-card type-bar height3 pb10 border-box" v-show="curIndex == 2">
                  <div class="bg-white w100 h100 rel">
                    <p class="font-size-middle tac text-tit">【请出示刷储值卡进行刷卡操作】</p>
                    <div class="text-wrap">
                      <p class="mt15 tac">
                        请刷卡：
                        <input type="text" class="text-code" ref="svCard" v-model="svCardText" @keyup.enter="enterSVCard" @blur="svCardBlur" />
                      </p>
                      <div class="pay_content">
                        <p>储值卡号：{{svCard.no }}</p>
                        <p>当前余额：{{svCard.balance | MoneyToF}}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- type-cash 现金支付 -->
                <div class="type-cash type-bar height3" v-show="curIndex == 3">
                  <div class="value-bar font-size-normal w100 abs">
                    <div class="pd10 border-box bg-white">
                      <ul>
                        <li class="hidden">
                          <div class="t-val fr" style="color:red">+{{inputAmount | MoneyToF}}</div>
                          <div class="t-name">实收：</div>
                        </li>
                        <li class="hidden mt10">
                          <div class="t-val fr" style="color:#22DD48">-{{changeAmount | MoneyToF}}</div>
                          <div class="t-name">找零：</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="input-bar w100 abs">
                    <input type="text" class="input-text-1 input-normal" style="font-size:20px;" v-model="inputAmountText" placeholder="请输入金额" />
                  </div>
                  <div class="btns-bar border-box h100 rel">
                    <div class="f-item btn-sure">
                      <div class="item-wrap w100 h100 rel">
                        <button class="btn-number font-size-normal" @click="confirmCash">确认</button>
                      </div>
                    </div>
                    <div class="list-inlineblock h100">
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(7)">7</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(8)">8</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(9)">9</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number font-size-normal" @click="del(0)">退格</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(4)">4</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(5)">5</button>
                        </div>
                      </div>
                      <div class="f-item item-right">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(6)">6</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(1)">1</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(2)">2</button>
                        </div>
                      </div>
                      <div class="f-item item-right">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(3)">3</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum(0)">0</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getNum('.')">.</button>
                        </div>
                      </div>
                      <div class="f-item item-right">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number font-size-normal" @click="clearAmountText(0)">清空</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- type-other 其它支付过渡界面 -->
                <div class="type-e-wallet type-bar height3 pb10 border-box" v-show="curIndex == 4">
                  <div class="bg-white w100 h100 rel">
                    <p class="font-size-middle tac text-tit">【请选择支付方式】</p>
                  </div>
                </div>

                <!-- type-other 商场提货卡-->
                <div class="type-e-wallet type-bar height3 pb10 border-box" v-show="curIndex == 10">
                  <div class="bg-white w100 h100 rel">
                    <p class="font-size-middle tac text-tit">【商场提货卡取货】</p>
                    <div class="text-wrap">
                      <p class="mt15 tac" style="color:red;">该支付方式不支持组合支付</p>
                    </div>
                  </div>
                </div>

                <!-- type-other 其他支付，显示金额键盘 -->
                <div class="type-cash type-bar height3" v-show="curIndex == 11 || curIndex == 12">
                  <div class="value-bar font-size-normal w100 abs">
                    <div class="pd10 border-box bg-white">
                      <ul>
                        <li class="hidden">
                          <div class="t-val fr" style="color:red">+{{inputOAmount | MoneyToF}}</div>
                          <div class="t-name">{{otherPay.inputText }}：</div>
                        </li>
                        <li class="hidden mt10">
                          <div class="t-val fr" style="color:red"></div>
                          <div v-if="curIndex == 11" class="t-name" style="color:red;">该支付方式不支持组合支付</div>
                          <!-- <div v-if="curIndex == 12" class="t-name" style="color:red;">该支付方式不支持组合支付</div> -->
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="input-bar w100 abs">
                    <input type="text" class="input-text-1 input-normal" style="font-size:20px;" v-model="inputOAmountText" placeholder="请输入金额" />
                  </div>
                  <div class="btns-bar border-box h100 rel">
                    <div class="f-item btn-sure">
                      <div class="item-wrap w100 h100 rel">
                        <button class="btn-number font-size-normal" @click="confirmOCash">确认</button>
                      </div>
                    </div>
                    <div class="list-inlineblock h100">
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(7)">7</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(8)">8</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(9)">9</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number font-size-normal" @click="del(1)">退格</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(4)">4</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(5)">5</button>
                        </div>
                      </div>
                      <div class="f-item item-right">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(6)">6</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(1)">1</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(2)">2</button>
                        </div>
                      </div>
                      <div class="f-item item-right">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(3)">3</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum(0)">0</button>
                        </div>
                      </div>
                      <div class="f-item">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number" @click="getONum('.')">.</button>
                        </div>
                      </div>
                      <div class="f-item item-right">
                        <div class="item-wrap w100 h100 rel">
                          <button class="btn-number font-size-normal" @click="clearAmountText(1)">清空</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 支付列表-->
                <div class="result-bar height2 bg-white hidden">
                  <div class="sec-top list-inlineblock tac bg-gray text-white">
                    <div class="t-item f-item w1">序号</div>
                    <div class="t-item f-item w2">支付方式</div>
                    <div class="t-item f-item w3">支付金额</div>
                  </div>
                  <div class="sec-middle bg-white">
                    <ul>
                      <li class="list-inlineblock tac" v-for="(item,index) in tmpFlows" :key="item.id">
                        <div class="t-item f-item w1">{{index + 1}}</div>
                        <div class="t-item f-item w2">{{item.pay_method | getPayMethodName}}</div>
                        <div class="t-item f-item w3">{{item.amount | MoneyToF}}</div>
                      </li>
                    </ul>
                  </div>
                  <div class="sec-bottom bg-gray text-white abs hidden">
                    <div class="text-total fr mr20">合计：{{payAmount | MoneyToF}}</div>
                    <div class="text-due ml20">{{unpaidAmountText}}：{{unpaidAmount | MoneyToF}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-part f-item h100 tac">
              <ul class="h100">
                <template v-for="(item,index) in payList">
                  <li class="pay-item height1 rel" :key="index" v-if="index < 4 && !otherPayClick">
                    <button class="btn h100 w100 abs text-gray" :class="[curIndex==index?'clicked':'']" @click="selectPay(index)">{{item.text}}</button>
                  </li>
                  <li class="pay-item height1 rel" :key="index" v-else-if="index == 4">
                    <button class="btn h100 w100 abs text-gray" :class="[curIndex==index?'clicked':'']" @click="selectPay(index)">{{item.text}}</button>
                    <div class="arrow" v-if="otherPayClick"></div>
                  </li>
                </template>
                <li class="pay-item2 height1 rel" v-for="(item,index) in payList[4].list" :key="index" v-if="otherPayClick">
                  <button class="btn h100 w100 abs text-gray" :class="[curIndex== 10 + index?'clicked':'']" @click="selectOtherPay(10+index)">{{item.text}}</button>
                </li>
                <li class="pay-item height2 rel">
                  <button class="btn h100 w100 abs bg-main text-white btn-submit" @click="api_205">确认支付</button>
                </li>
              </ul>
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
import app_m from "@/modules/appMiddleware"
import Decimal from 'decimal.js'

export default {
  data() {
    return {
      curIndex: 0,
      //订单详情
      order: { id: 0 },
      //付款码
      payCode: '',
      //电子钱包
      eWalletCode: '',
      //储值卡
      svCardCode: '',
      //付款码文本
      payCodeText: '',
      //电子钱包文本
      eWalletText: '',
      //电子钱包付清余额
      eWalletPayOffBalance: 0,
      //储值卡文本
      svCardText: '',
      //现金支付输入的金额
      inputAmount: 0,
      //显示现金输入金额
      inputAmountText: '',
      //其它支付输入的金额
      inputOAmount: 0,
      //显示其它输入金额
      inputOAmountText: '',
      //未付款的金额
      unpaidAmount: 0,
      //尚欠金额/抹零
      unpaidAmountText: '尚欠金额',
      //抹零金额
      dis_odd: 0,
      //找零的金额
      changeAmount: 0,
      //电子钱包会员信息
      member: {},
      //储值卡信息
      svCard: {},
      //是否支付完成
      isPay: false,
      //扫码状态
      isEnterLoading: false,
      //支付方式
      payMethod: {
        //微信支付
        weChatCode: 11,
        //支付宝支付
        aliPayCode: 21,
        //微信支付
        eWallet: 31,
        //储值卡支付
        sVCard: 41,
        //现金支付
        cash: 51,
        //商场提货卡
        deliveryCard: 103,
        //美团
        meiTuan: 104,
        //华润代金券
        huarunVouchers: 105
      },
      //其它支付类型
      otherPay: {
        //实收显示
        inputText: ''
      },
      //其它支付类型点击
      otherPayClick: false,
      //支付类型
      payList: [
        {
          text: "移动支付"
        },
        {
          text: "电子钱包"
        },
        {
          text: "储值卡"
        },
        {
          text: "现金"
        },
        {
          text: "其他支付",
          list: [
            {
              text: "商场提货卡"
            },
            {
              text: "美团"
            },
            {
              text: "华润代金券"
            }
          ]
        }
      ],
      //支付流水
      payFlows: []
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
  props: {
    show: {
      type: Boolean,
      default: false
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
    },
    payAmount() {
      let amount = 0
      if (this.order.coupon_amount > this.order.mkt_dis_amount && this.order.coupon_amount > this.order.vip_dis_amount) {
        amount = this.order.total_amount - this.order.coupon_amount
      } else if (this.order.mkt_dis_amount > this.order.coupon_amount && this.order.mkt_dis_amount > this.order.vip_dis_amount) {
        amount = this.order.total_amount - this.order.mkt_dis_amount
      } else if (this.order.vip_dis_amount > this.order.coupon_amount && this.order.vip_dis_amount > this.order.mkt_dis_amount) {
        amount = this.order.total_amount - this.order.vip_dis_amount - this.order.mkt_dis_amount
      }
      return amount < 0 ? 0 : amount
    }
  },
  methods: {
    init(data) {
      setTimeout(() => { this.$refs.pCode.focus() }, 100)
      this.isEnterLoading = false
      this.isPay = false
      this.clearMember()
      this.clearSVDetails()
      this.curIndex = 0
      this.order = data
      this.order.user_coupon_id = 0
      this.payCode = ''
      this.payCodeText = ''
      //清空付款流水
      this.payFlows = []
      //未支付的金额
      this.changeAmount = 0
      this.member = { balance: 0 }
      this.updateAmount()
    },
    //获取支付流水
    getFlow() {
      return {
        store_id: app_g.getPos().store_id,
        serial_no: app_g.util.getSerialNum('F'),
        order_id: this.order.id,
        order_no: this.order.serial_no,
        user_id: 0,
        pos_no: app_g.getPos().no,
        amount: 0,
        coin_type: 0,
        coin_rate: 1,
        convert_amt: 0,
        pay_method: -1,
        pay_name: "",
        trade_type: 1,
        flow_type: 1,
        is_enable: true,
        created_date: app_g.util.date.getDateTimeNow(),
        created_user_id: this.UserInfo.user.id
      }
    },
    //删除
    del(n) {
      //现金退格删除
      if (n == 0) {
        let len = this.inputAmountText.length
        if (len > 0) {
          if (len - 1 <= 0) {
            this.inputAmount = 0
            this.inputAmountText = ''
          } else {
            this.inputAmountText = this.inputAmountText.substring(0, len - 1)
            this.inputAmount = this.inputAmountText
          }
        }
      } else {
        let len = this.inputOAmountText.length
        if (len > 0) {
          if (len - 1 <= 0) {
            this.inputOAmount = 0
            this.inputOAmountText = ''
          } else {
            this.inputOAmountText = this.inputOAmountText.substring(0, len - 1)
            this.inputOAmount = this.inputOAmountText
          }
        }
      }
    },
    //显示的金额
    clearAmountText(payType) {
      this.unpaidAmountText = '尚欠金额'
      this.unpaidAmount = 0
      //现金支付情况
      if (payType == 0) {
        this.inputAmount = 0
        this.inputAmountText = ''
        this.changeAmount = 0
        this.dis_odd = 0
        //删除
        this.payFlows.splice(this.payFlows.findIndex(item => item.pay_method === 51), 1)
        this.updateAmount()
      } else {
        this.inputOAmount = 0
        this.inputOAmountText = ''
        if (this.curIndex == 11) {
          this.payFlows.splice(this.payFlows.findIndex(item => item.pay_method === 11), 1)
        } else if (this.curIndex == 12) {
          this.payFlows.splice(this.payFlows.findIndex(item => item.pay_method === 12), 1)
        }
      }
    },
    //现金支付点击
    getNum(n) {
      //首个输入为.的情况
      if (this.inputAmountText.length == 0 && n == '.') return
      if (this.inputAmountText.length > 8) return
      let str1 = this.inputAmountText.split('.')[1]
      if (str1 != undefined && str1.length > 1) return

      //匹配小数点次数
      let mt = this.inputAmountText.match(/[.]/g)
      //限制只能输入一个点
      if (mt == null || mt.length && n != '.') {
        this.inputAmountText = this.inputAmountText + '' + n
      }

      //金额输入正确情况下
      if (app_g.verifyStr.isPrice(this.inputAmountText)) {
        this.inputAmount = this.inputAmountText
        //计算找零
        let tmpAmount = this.inputAmount - this.order.actual_amount
        if (tmpAmount > 0) {
          this.changeAmount = tmpAmount
        }
      }
    },
    //其它支付点击
    getONum(n) {

      //首个输入为.的情况
      if (this.inputOAmountText.length == 0 && n == '.') return
      if (this.inputOAmountText.length > 8) return
      let str1 = this.inputOAmountText.split('.')[1]
      if (str1 != undefined && str1.length > 1) return

      //匹配小数点次数
      let mt = this.inputOAmountText.match(/[.]/g)
      //限制只能输入一个点
      if (mt == null || mt.length && n != '.') {
        this.inputOAmountText = this.inputOAmountText + '' + n
      }

      //金额输入正确情况下
      if (app_g.verifyStr.isPrice(this.inputOAmountText)) {
        this.inputOAmount = this.inputOAmountText
        //计算找零
        // let tmpAmount = this.inputOAmount - this.order.actual_amount
        // if (tmpAmount > 0) {
        //   this.changeAmount = tmpAmount
        // }
      }
    },
    //移动支付失去焦点事件
    payCodeBlur() {
      if (this.curIndex == 0 && this.$refs.pCode != undefined) {
        setTimeout(() => { try { this.$refs.pCode.focus() } catch (ex) { } }, 100)
      }
    },
    //电子钱包失去焦点事件
    eWalletBlur() {
      if (this.curIndex == 1 && this.$refs.eWallet != undefined) {
        setTimeout(() => { try { this.$refs.eWallet.focus() } catch (ex) { } }, 100)
      }
    },
    //储值卡失去焦点事件
    svCardBlur() {
      if (this.curIndex == 2 && this.$refs.svCard != undefined) {
        setTimeout(() => { try { this.$refs.svCard.focus() } catch (ex) { } }, 100)
      }
    },
    //选择支付方式
    selectPay(index) {
      let that = this

      //如果是优惠券
      if (that.order.pay_method == 109 && that.order.coupon_amount >= that.order.actual_amount) {
        this.$vux.toast.text('该订单为免费优惠券支付，请确认支付', 'default', 3000)
        return
      }

      this.curIndex = index
      let item = this.payList[index]

      if (item.text == '移动支付') {
        setTimeout(() => { this.$refs.pCode.focus() }, 100)
      } else if (item.text == '电子钱包') {
        setTimeout(() => { this.$refs.eWallet.focus() }, 100)
        // let nowtime = new Date().getTime()
        // let codes = "000000000039438000000000000000" + nowtime
        // this.api_208(codes, 0)
      } else if (item.text == '储值卡') {
        setTimeout(() => { this.$refs.svCard.focus() }, 100)
      } else if (item.text == '其他支付') {
        //从其它支付方式切换到正常支付
        if (this.otherPayClick) {
          //清空提货卡支付
          let index = this.payFlows.findIndex(ele => ele.pay_method === this.payMethod.deliveryCard)
          //清空美团支付
          let index1 = this.payFlows.findIndex(ele => ele.pay_method === this.payMethod.meiTuan)
          if (index != -1) this.payFlows.splice(index, 1)
          if (index1 != -1) this.payFlows.splice(index1, 1)
          this.otherPayClick = false
        } else {
          this.otherPayClick = true
        }
      }
    },
    //选择其他支付方式
    selectOtherPay(index) {
      if (index != this.curIndex) {
        //清空其它支付流水
        this.curIndex = index
        //清空支付流水
        this.payFlows = []
        this.updateAmount()

        if (this.curIndex == 11) {
          this.otherPay.inputText = '美团收款'
        } else if (this.curIndex == 12) {
          this.otherPay.inputText = '华润代金券'
        } else if (this.curIndex == 10) {
          let curFlow = this.getFlow()
          curFlow.pay_method = this.payMethod.deliveryCard
          this.payFlows.push(curFlow)
        }
        //清空其它支付方式
        this.inputOAmount = 0
        this.inputOAmountText = ''
      }
    },
    //提交现金支付
    confirmCash() {
      //输入金额不能为0
      if (this.inputAmount == 0) return
      //检测是否存在现金支付
      let cIndex = -1
      this.payFlows.forEach((item, index) => {
        if (item.pay_method == this.payMethod.cash) {
          cIndex = index
          return
        }
      })
      //删除老的小金支付
      if (cIndex != -1) this.payFlows.splice(cIndex, 1)
      //更新金额
      this.updateAmount()
      //抹零金额(= 未缴纳金额 - 抹零后金额)
      this.dis_odd = new Decimal(this.unpaidAmount).sub(new Decimal(app_g.util.formatDecimal(this.unpaidAmount, 1))).toNumber()

      //获取支付流水
      let curFlow = this.getFlow()
      //现金支付方式
      curFlow.pay_method = this.payMethod.cash
      //输入金额大于未缴纳金额
      if (this.inputAmount > (this.unpaidAmount - this.dis_odd)) {
        curFlow.amount = this.unpaidAmount - this.dis_odd
        this.changeAmount = this.inputAmount - curFlow.amount
      } else {
        curFlow.amount = this.inputAmount
        this.changeAmount = 0
      }

      //加入支付流水
      this.payFlows.push(curFlow)
      //清空显示的输入金额
      this.inputAmountText = ''
      //显示的实收金额
      this.inputAmount = 0
      this.updateAmount()
      this.clearMember()
      this.clearSVDetails()

      let sub = new Decimal(this.unpaidAmount).sub(new Decimal(this.dis_odd)).toNumber()
      if (this.dis_odd > 0 && sub == 0) {
        this.unpaidAmountText = '抹零金额'
      } else {
        this.unpaidAmountText = '尚欠金额'
      }
    },
    //提交其它支付
    confirmOCash() {
      this.unpaidAmountText = '尚欠金额'
      //获取支付流水
      let curFlow = this.getFlow()
      //美团收款
      if (this.curIndex == 11 && this.inputOAmount > 0) {
        this.otherPay.inputText = '美团收款'
        curFlow.pay_method = this.payMethod.meiTuan
        curFlow.amount = this.inputOAmount

        let index = this.payFlows.findIndex(item => item.pay_method === curFlow.pay_method)
        if (index != -1) this.payFlows.splice(index, 1)

        this.payFlows.push(curFlow)
        this.updateAmount()
      } else if (this.curIndex == 12 && this.inputOAmount > 0) {
        this.otherPay.inputText = '华润代金券'
        curFlow.pay_method = this.payMethod.huarunVouchers

        let index = this.payFlows.findIndex(item => item.pay_method === curFlow.pay_method)
        if (index != -1) this.payFlows.splice(index, 1)

        curFlow.amount = this.inputOAmount
        this.payFlows.push(curFlow)
        this.updateAmount()
      }
    },
    //根据移动支付提交
    enterPayCode() {
      this.unpaidAmountText = '尚欠金额'
      let that = this
      if (!this.isEnterLoading) {
        //设置扫描中
        this.isEnterLoading = true
        setTimeout(() => {
          that.isEnterLoading = false
        }, 4000)
        if (this.unpaidAmount > 0) {
          //微信支付
          if (this.payCodeText.length == 18 && /^[1]+[0,1,2,3,4,5]+\d{16}/.test(this.payCodeText)) {
            this.payCode = this.payCodeText
            this.payCodeText = ''
            //支付失败情况下，删除上次的微信流水
            let index = this.payFlows.findIndex(item => item.pay_method === this.payMethod.weChatCode)
            if (index != -1) this.payFlows.splice(index, 1)
            let index1 = this.payFlows.findIndex(item => item.pay_method === this.payMethod.aliPayCode)
            if (index1 != -1) this.payFlows.splice(index, 1)

            //如果未付款的金额大于零
            if (this.payFlows.length > 0 && this.unpaidAmount <= 0) return
            let curFlow = this.getFlow()
            //金额
            curFlow.amount = parseFloat(this.unpaidAmount).toFixed(2)
            //设置支付方式
            curFlow.pay_method = this.payMethod.weChatCode
            //加入支付流水
            this.payFlows.push(curFlow)
            //立即支付
            this.api_205(this.unpaidAmount)
          }//支付宝支付二维码
          else if (this.payCodeText.length == 18 && /^[28]+\d{16}/.test(this.payCodeText)) {
            this.payCode = this.payCodeText
            this.payCodeText = ''
            //支付失败情况下，删除上次的支付宝流水
            let index = this.payFlows.findIndex(item => item.pay_method === this.payMethod.weChatCode)
            if (index != -1) this.payFlows.splice(index, 1)
            let index1 = this.payFlows.findIndex(item => item.pay_method === this.payMethod.aliPayCode)
            if (index1 != -1) this.payFlows.splice(index, 1)
            //如果未付款的金额大于零
            if (this.payFlows.length > 0 && this.unpaidAmount <= 0) return

            let curFlow = this.getFlow()
            //金额
            curFlow.amount = parseFloat(this.unpaidAmount).toFixed(2)
            //支付方式
            curFlow.pay_method = this.payMethod.aliPayCode
            //加入支付流水
            this.payFlows.push(curFlow)
            //立即支付
            this.api_205(this.unpaidAmount)
          } else {
            this.payCodeText = ''
            this.$vux.toast.text('请使用微信或支付宝付款码', 'default', 3000)
          }
        } else {
          //   that.$vux.toast.text('当前订单无需使用其他支付方式，直接提交即可', 'default', 3000)
          //   return

          //直接提交
          this.api_205(this.unpaidAmount)
        }
      }

      this.payCode = ''
      this.payCodeText = ''
    },
    //提交电子钱包支付
    enterEWalle() {
      this.unpaidAmountText = '尚欠金额'
      let that = this
      //扫码中
      if (!this.isEnterLoading) {
        //是否在扫描中
        this.isEnterLoading = true

        setTimeout(() => {
          that.isEnterLoading = false
        }, 4000)

        //电子钱包支付
        if (this.eWalletText.length > 40) {
          this.eWalletCode = this.eWalletText
          //清空文本
          this.eWalletText = ''
          //如果未付款的金额大于零
          if (this.unpaidAmount <= 0) return
          let user_id = parseInt(this.eWalletCode.substring(0, 15))
          let coupon_id = parseInt(this.eWalletCode.substring(16, 30))
          //用户ID 
          if (user_id == undefined || user_id == 0) {
            that.isEnterLoading = false
            return
          }

          //当前电子钱包和订单所属用户信息是否一致
          if (this.order.user_id > 0 && this.order.user_id != user_id) {
            that.isEnterLoading = false
            that.$vux.toast.text('当前会员信息不匹配', 'default', 3000)
            return
          }

          //优惠券ID
          if (coupon_id > 0) that.order.user_coupon_id = coupon_id

          //扫描会员码
          this.api_208(this.eWalletCode, user_id, coupon_id)
        }
      } else {
        this.eWalletText = ''
      }
    },
    //提交储值卡支付
    enterSVCard() {
      this.unpaidAmountText = '尚欠金额'
      //如果已付清
      if (this.unpaidAmount <= 0) {
        that.$vux.toast.text('当前已付清，请勿再次刷卡', 'default', 3000)
        return
      }

      //微信支付
      if (this.svCardText.length > 25) {
        this.svCardCode = this.svCardText.replace(';', '').replace('?', '')
        //清空文本
        this.svCardText = ''
        //获取储值卡
        this.api_209(this.svCardCode)
      }

      this.clearMember()
    },
    //清空会员信息
    clearMember() {
      this.member = { id: 0, mobile: '----', balance: 0, dis_count: 0.99, integral: 0, coupon: { type: 0, amount: 0.0 } }
    },
    //清空储值卡信息
    clearSVDetails() {
      this.svCard = { id: 0, no: "----", dm: 0, status: 0, balance: 0 }
    },
    //更新页面显示金额
    updateAmount() {
      let tmpAmount = 0
      this.payFlows.forEach((ele) => {
        tmpAmount += parseFloat(parseFloat(ele.amount).toFixed(2))
      })

      //支付的余额
      let balance = this.order.total_amount - this.getMaxDisCount()
      //订单支付流水-所有优惠力度最大金额
      //let amountResult = tmpAmount - (balance < 0 ? 0 : balance)
      let amountResult = new Decimal(tmpAmount).sub(new Decimal((balance < 0 ? 0 : balance))).toNumber()

      //有找零
      if (amountResult >= 0) {
        //不存在未付清
        this.unpaidAmount = 0
        //存在未付清
      } else {
        this.unpaidAmount = -amountResult
      }
    },
    //获取订单优惠力度最大的优惠
    getMaxDisCount() {
      if (this.order.coupon_amount > this.order.mkt_dis_amount && this.order.coupon_amount > this.order.vip_dis_amount) {
        return this.order.coupon_amount
      }
      if (this.order.mkt_dis_amount > this.order.coupon_amount && this.order.mkt_dis_amount > this.order.vip_dis_amount) {
        return this.order.mkt_dis_amount
      }
      if (this.order.vip_dis_amount > this.order.coupon_amount && this.order.vip_dis_amount > this.order.mkt_dis_amount) {
        return this.order.vip_dis_amount
      }
      return 0
    },
    //立即支付
    api_205(unpaidAmount) {
      let that = this
      if (this.payAmount != 0 && that.payFlows.length == 0) {
        that.$vux.toast.text('当前订单未支付，不能提交', 'default', 3000)
        return
      }

      //更新支付金额
      that.updateAmount()

      //优惠券支付
      if (that.order.pay_method == 109) {

      } else {
        //美团、提货卡 单一支付
        if ((that.payFlows.length == 1 && that.payFlows[0].pay_method == that.payMethod.meiTuan || that.payFlows[0].pay_method == that.payMethod.deliveryCard)) {
          //美团 单一支付
          if (that.payFlows[0].pay_method == that.payMethod.meiTuan) {
            that.order.actual_amount = this.inputOAmount
            that.order.rece_amount = this.inputOAmount
            that.order.whole_dis_amount = that.order.total_amount - this.inputOAmount
          }
        } else {
          //支付金额是否达到支付条件
          if (this.unpaidAmount - this.dis_odd > 0) {
            that.$vux.toast.text('支付金额不足，不能提交', 'default', 3000)
            return
          }
        }
      }
      that.order.dis_odd = this.dis_odd
      that.order.give_change_amount = this.changeAmount
      const res = new Map()
      let arr = that.payFlows.filter((a) => !res.has(a.pay_method) && res.set(a.pay_method, 1))
      if (arr.length == 1) {
        that.order.pay_method = that.payFlows[0].pay_method
      } else if (arr.length == 2) {
        that.order.pay_method = 100
      } else if (arr.length > 2) {
        that.$vux.toast.text('只允许两种支付方式叠加', 'default', 3000)
        return
      }

      //付款流水
      that.order.flow = that.payFlows
      let params = {
        PayCode: that.payCode,
        Order: that.order
      }
      console.log(params)
      //   return
      if (!that.isPay) {
        api.post(api.api_205, api.getSign(params), function (vue, res) {
          if (res.data.Basis.State == api.state.state_200) {
            that.isPay = true
            //调起打印
            app_m.print(app_g.getPos().store_id, that.UserInfo.user.id, that.order.serial_no, 0, () => {
              console.log('打印回调')
            })
            //支付成功
            that.$emit('paySuccess')
            //打印
          } else {
            //微信或支付宝支付失败情况下
            if (unpaidAmount) {
              that.unpaidAmount = unpaidAmount
            }
            that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
          }
        })
      }

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


            setTimeout(() => {
              that.api_205()
            }, 1000)
          }
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //刷储值卡
    api_209(code) {
      let that = this
      api.post(api.api_209, api.getSign({
        Type: 1,
        Ticket: code
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          let exist_card_no = false
          that.payFlows.forEach((item, index) => {
            //如果是储值卡支付
            if (item.pay_method == that.payMethod.sVCard && item.card_no == res.data.Result.no) {
              that.$vux.toast.text('请勿重复刷卡', 'default', 3000)
              exist_card_no = true
              return
            }
          })
          if (exist_card_no) return
          //储值卡
          that.svCard = res.data.Result
          //获取当前流水
          let curFlow = that.getFlow()
          //储值卡支付
          curFlow.pay_method = that.payMethod.sVCard
          //储值卡号
          curFlow.card_no = that.svCard.no
          //此处外部已经判断为未付清，这里只需要判断余额够不够付清未付的
          let amount = that.svCard.balance - that.unpaidAmount
          //余额够不够付清
          if (amount <= 0) {
            //金额
            curFlow.amount = that.svCard.balance
          } else {
            curFlow.amount = that.unpaidAmount
          }
          //加入支付流水
          that.payFlows.push(curFlow)
          that.updateAmount()

          if (amount >= 0) {
            setTimeout(() => {
              that.api_205()
            }, 1000)
          }
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //关闭
    close() {
      this.$emit('closeOrderPay')
    }
  }
}
</script>

<style lang="scss">
.form-pay {
  width: 607px;
  top: 55%;
  left: 50%;
  height: 662px;
  // height:100%;
  transform: translate(-50%, -50%);
  padding: 13px;

  .form-wrap {
    height: 90%;
  }
  .form-tit {
    height: 57px;
    line-height: 57px;
  }
  .form-con {
    padding-top: 57px;
  }
  .form-close {
    width: 57px;
    height: 57px;
    right: 0;
    top: 0;
  }
  .height1 {
    height: (70/4) * 1%;
  }
  .height2 {
    height: 30%;
  }
  .height3 {
    height: 70%;
  }

  .w1 {
    width: 20%;
  }
  .w2 {
    width: 50%;
  }
  .w3 {
    width: 30%;
  }
  .input-normal {
    border: none;
  }
  .left-part {
    width: 70%;
    background-color: #f4f4f4;

    .value-bar {
      top: 0;
      left: 0;
      height: 71px;
    }
    .input-bar {
      top: 75px;
    }
    .btns-bar {
      padding-top: 75px+47px+10px;
      // padding-bottom: 10px;

      .list-inlineblock {
        margin-right: -10px;
      }

      .f-item {
        height: 25%;
        width: 25%;
        position: relative;
        box-sizing: border-box;
        padding: 0 10px 10px 0;

        &.btn-sure {
          position: absolute;
          right: -10px;
          bottom: 0;
          height: 47%;
        }
      }
      .item-right {
        margin-right: 25%;
      }
      .btn-number {
        color: #000;
        font-size: 24px;
        border: none;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .font-size-normal {
        font-size: 15px;
      }
    }

    .sec-top {
      height: 30px;
      line-height: 30px;
    }
    .sec-middle {
      padding: 5px 0;
      overflow: auto;
      box-sizing: border-box;
      height: 100%;

      .t-item {
        height: 30px;
        line-height: 30px;
      }
    }
    .sec-bottom {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 36px;
      line-height: 36px;
    }
    .text-tit {
      padding-top: 40px;
    }
    .text-wrap {
      //   padding: 10px 20px 40px 20px;
      // position: absolute;
      left: 0;
      // top: 50%;
      width: 100%;
      // transform: translateY(-50%);
      line-height: 1.5;

      .pay_content {
        border-top: 1px dashed #acacac;
        padding: 10px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 15px;
        width: 90%;
      }
    }
    .text-code {
      border-left-width: 0px;
      border-top-width: 0px;
      border-right-width: 0px;
      border-bottom-width: 1px;
      border-bottom-color: black;
    }
  }
  .right-part {
    width: 30%;

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .pay-item {
      box-sizing: border-box;
      &:nth-child(3),
      &:nth-child(4) {
        width: 50%;
      }
      &:nth-child(3) {
        border-right: 1px solid #efefef;
      }
      &:nth-child(4) {
        border-left: 1px solid #efefef;
      }
    }
    .pay-item,
    .pay-item2 {
      width: 100%;
      position: relative;
      .arrow {
        background: url("../../../static/img/arrow.png") no-repeat 0 0/100% auto;
        display: block;
        width: 10px;
        height: 7px;
        position: absolute;
        right: 40px;
        top: 50%;
        transform: translate(0, -50%);
        z-index: 1;
      }
      .btn {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: none;
        font-size: 15px;
        box-sizing: border-box;
        border-bottom: 2px solid #f4f4f4;

        &:active,
        &.clicked {
          background-color: #f4f4f4;
          color: #7f9eb6;
        }
      }
      .btn-submit {
        &:active,
        &.clicked {
          background-color: #5a7494;
          color: #fff;
        }
      }
    }
  }
}
</style>
