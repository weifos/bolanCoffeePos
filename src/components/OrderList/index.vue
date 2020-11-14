<template>
  <div class="order-normal rel section-2" v-if="show">
    <div class="con-wrap rel">
      <div class="tab-tit abs cloumn-3">
        <div class="tab-t f-item" :class="[curIndex == index?'cur':'']" v-for="(item,index) in statusList" @click="onClickItem(index)">{{item.name}}</div>
      </div>
      <div class="tab-con h100">
        <div class="form-1 bg-white rel">
          <div class="form-head list-inlineblock tac abs">
            <div class="head-item f-item w3 bg-gray text-white">小票号</div>
            <div class="head-item f-item w4 bg-gray text-white">订单编号</div>
            <div class="head-item f-item w2 bg-gray text-white">下单时间</div>
            <div class="head-item f-item w1 bg-gray text-white">用户账号</div>
            <div class="head-item f-item w1 bg-gray text-white">订单金额</div>
            <div class="head-item f-item w1 bg-gray text-white">商品数/已退数</div>
            <div class="head-item f-item w1 bg-gray text-white">订单状态</div>
            <div class="head-item f-item w2 bg-gray text-white">操作</div>
          </div>
          <div class="tab-c h100 cur">
            <div class="form-body tac text-gray">
              <div class="form-body-wrap list-inlineblock">
                <ul>
                  <li class="row-item list-inlineblock" v-for="(item,index) in result" :key="index">
                    <div class="body-item f-item w3">
                      <div class="align" style="color:#7F9EB6;">{{item.serial_num | GetSerialNum}}</div>
                    </div>
                    <div class="body-item f-item w4">
                      <div class="align">{{item.serial_no}}</div>
                    </div>
                    <div class="body-item f-item w2">
                      <div class="align">{{item.created_date}}</div>
                    </div>
                    <div class="body-item f-item w1">
                      <div class="align">{{item.login_name == undefined ?'--':item.login_name}}</div>
                    </div>
                    <div class="body-item f-item w1">
                      <div class="align" style="color:red;">{{item.actual_amount | MoneyToF}}</div>
                    </div>
                    <div class="body-item f-item w1">
                      <div class="align">{{item.count}}/{{item.refund_count}}</div>
                    </div>
                    <div class="body-item f-item w1">
                      <div class="align">已完成</div>
                    </div>
                    <div class="body-item f-item w2">
                      <div class="align">
                        <span class="item-link mr20" style="color:#0033FF;" @click="printReceipt(item)">打印小票</span>
                        <span class="item-link mr20" style="color:#0033FF;" @click="goDetails(item)">查看</span>
                        <span class="item-link" style="color:#0033FF;" v-if="item.status == 1 && !item.is_pay" @click="goPay(item)">继续付款</span>
                        <template v-else>
                          <span class="item-link" style="color:#0033FF;" @click="refund(item)" v-if="item.count > item.refund_count">全部退款</span>
                          <span class="item-link" v-else>全部退完</span>
                        </template>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <Pager ref="page" v-on:pagerUpdate="pagerUpdate" :url="pagerUrl" :pageSize="8"></Pager>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'
import app_m from "@/modules/appMiddleware"
import Pager from '@/components/Pager'
import PopWrap from '@/components/PopWrap'

export default {
  components: {
    Pager,
    PopWrap
  },
  data() {
    return {
      curIndex: 0,
      //显示退款
      showPopRefund: false,
      //翻页地址
      pagerUrl: api.api_206,
      //订单状态
      statusList: [
        { name: '已支付', isPay: 1 },
        { name: '待支付', isPay: 0 },
        { name: '全部', isPay: -1 }
      ],
      result: []
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init() {
      let params = this.getSearchData()
      //
      this.result = []
      //组件加载延迟100毫秒
      setTimeout(() => { this.$refs.page.init(params) }, 10)
    },
    //获取查询数据
    getSearchData() {
      let that = this
      let item = that.statusList[that.curIndex]
      let status = -1
      //已付款
      if (item.isPay == 1) {
        status = 3
        //未付款
      } else if (item.isPay == 0) {
        status = 1
      }
      console.log(app_g.getPos())
      return {
        //已付款
        IsPay: item.isPay,
        //订单状态
        Status: status,
        //门店
        StoreID: app_g.getPos().store_id,
        //POS机编号
        PosNo: app_g.getPos().no
      }
    },
    //页码点击事件
    onClickItem(index) {
      this.curIndex = index
      this.result = []
      let params = this.getSearchData()
      this.$refs.page.execute(params)
    },
    //加载订单
    pagerUpdate(data) {
      this.result = []
      if (data.orders.length) {
        data.orders.forEach((ele, index) => {
          this.result.push(ele)
        })
      }
    },
    //查看订单详情
    goDetails(item) {
      this.$emit('goOrderDetails', item)
    },
    //继续付款
    goPay(item) {
      this.$emit('confirmOrder', item.serial_no)
    },
    //获取支付流水
    getFlow(order) {
      return {
        store_id: app_g.getPos().store_id,
        serial_no: app_g.util.getSerialNum('T'),
        order_id: order.id,
        order_no: order.serial_no,
        user_id: order.user_id,
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
    },
    //全部退款
    refund(item) {
      let that = this
      this.$vux.confirm.show({
        title: '确认全部退款吗',
        onCancel() { },
        onConfirm() {
          that.api_215(item)
          return
        }
      })
    },
    //打印小票
    printReceipt(item) {
      let that = this
      //调起打印
      app_m.print(app_g.getPos().store_id, that.UserInfo.user.id, item.serial_no, 0, () => {
        console.log('打印回调')
      })
    },
    //退货退款
    api_211(order, returnOrder) {
      let that = this
      //临时订单
      let tmpOrder = { ...{}, ...order }
      //设置退款单对象
      tmpOrder.order_no = order.serial_no
      tmpOrder.created_user_id = that.UserInfo.user.id
      //流水号
      tmpOrder.serial_no = ''
      //退详情
      let tmpDetails = []
      order.store_details.forEach((ele, i) => {
        if (ele.count > ele.refund_count) {
          let tmp = { ...{}, ...ele }
          tmp.count -= tmp.refund_count
          tmp.unit_price = tmp.avg_unit_amount
          tmp.total_amount = (tmp.unit_price * tmp.count).toFixed(2)
          tmpDetails.push(tmp)
        }
      })

      //当前流水
      let flows = []
      //当前可以退的余额
      let amount = returnOrder.balance
      //可退的商品总金额
      tmpOrder.total_amount = amount
      //退的商品详情
      tmpOrder.details = tmpDetails
      //原订单流水
      tmpOrder.flow = returnOrder.flows
      //单一支付
      if (tmpOrder.pay_method != 100) {
        let flow = that.getFlow(tmpOrder)
        //退款金额
        flow.amount = amount
        //支付方式
        flow.pay_method = tmpOrder.pay_method
        //加入到流水
        flows.push(flow)
        //混合支付情况
      } else {
        let flow = that.getFlow(tmpOrder)
        //是否有电子钱包支付
        var hasEWallet = tmpOrder.flow.filter(item => item.pay_method === 31 && item.flow_type === 1)
        //是否有储值卡支付
        var hasSVCard = tmpOrder.flow.filter(item => item.pay_method === 41 && item.flow_type === 1)
        //是否有微信支付
        var hasWeChat = tmpOrder.flow.filter(item => item.pay_method === 11 && item.flow_type === 1)
        //是否有支付宝支付
        var hasALi = tmpOrder.flow.filter(item => item.pay_method === 21 && item.flow_type === 1)
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
          returnOrder.flows.forEach((ele) => {
            if (ele.pay_method === 11 && ele.flow_type === 1) {
              tmpAmount += ele.amount
            }
          })

          //已经退过的移动支付流水
          returnOrder.flows.forEach((ele) => {
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
              let flow1 = that.getFlow(tmpOrder)
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
          //原订单阿里支付流水
          returnOrder.flows.forEach((ele) => {
            if (ele.pay_method === 21 && ele.flow_type === 1) {
              tmpAmount += ele.amount
            }
          })

          //已经退过的移动支付流水
          returnOrder.flows.forEach((ele) => {
            if (ele.pay_method === 21 && ele.flow_type === -1) {
              retAmount += ele.amount
            }
          })

          //支付方式
          flow.pay_method = 21
          //计算可退的阿里支付金额
          canRetAmount = tmpAmount - retAmount
          if (canRetAmount > 0) {
            //当前退款金额大于剩余移动可退金额，则生成两条退款流水
            if (amount - canRetAmount > 0) {
              //剩余移动支付可退金额
              flow.amount = canRetAmount
              //新的流水
              let flow1 = that.getFlow(tmpOrder)
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

      //设置退款流水
      tmpOrder.flow = flows
      api.post(api.api_211, api.getSign({
        OrderReturns: tmpOrder
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //修改状态
          that.result.forEach((ele) => {
            //if (ele.serial_no == tmpOrder.serial_no) {
            if (ele.serial_no == tmpOrder.order_no) {
              ele.refund_count = ele.count
            }
          })

          //调起打印
          app_m.print(app_g.getPos().store_id, that.UserInfo.user.id, res.data.Result, 1, () => {
            console.log('打印回调')
          })
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //可退订单（流水和金额）
    api_215(order) {
      let that = this
      api.post(api.api_215, api.getSign({
        StoreID: order.store_id,
        SerialNo: order.serial_no
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.api_211(order, res.data.Result)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.weui-dialog__btn_primary {
  color: #7f9eb6;
}
.pages {
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  font-size: 0;
  padding: 20px 20px;
  box-sizing: border-box;
  .item-page {
    text-align: center;
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 1px solid #acacac;
    background-color: #fff;
    margin: 0 5px;
    font-size: 15px;
    line-height: 38px;
    &:active,
    &.cur {
      background-color: #7f9eb6;
      color: #fff;
    }
  }
}
.order-normal {
  .tab-tit {
    height: 30px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    left: 0;
    top: 0;
    padding: 10px 13px;
    .tab-t {
      background-color: #fff;
      height: 50px;
      line-height: 50px;

      &.cur {
        background-color: #7f9eb6;
        color: #fff;
      }
    }
  }
  .tab-con {
    padding: 60px 0px 0px 0px;
    box-sizing: border-box;
  }
  .cloumn-3 {
    font-size: 0;
    .f-item {
      width: 33.33%;
      display: inline-block;
      vertical-align: top;
      font-size: 15px;
    }
  }
  .tab-c {
    display: none;

    &.cur {
      display: block;
    }
  }
  .form-1 {
    height: 100%;

    .form-head {
      width: 100%;
      left: 0;
      top: 0;

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
      padding-top: 35px;
      padding-bottom: 80px;
      position: relative;

      .body-item {
        position: relative;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #acacac;
        border-right: 1px solid #acacac;
        box-sizing: border-box;
      }

      .align {
        //    position: absolute;
        //    width: 100%;
        //    top:50%;
        //    left: 50%;
        //    transform:translate(-50%,-50%)
      }
    }
    .form-body-wrap {
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
    }
    .w1 {
      width: 10%;
    }
    .w2 {
      width: 20%;
    }
    .w3 {
      width: 5%;
    }
    .w4 {
      width: 15%;
    }

    .status-bar {
      width: 100%;
      height: 54px;
      left: 0;
      bottom: 0;

      .button {
        margin-top: 10px;
        margin-right: 20px;
      }
    }
  }
}
</style>