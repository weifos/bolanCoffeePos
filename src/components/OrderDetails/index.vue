<template>
  <div class="order-details rel section-2" v-if="show">
    <!-- <div class="section-tit text-gray tac">
            查看订单
    </div>-->
    <div class="section-con">
      <div class="con-wrap rel">
        <div class="form-1 bg-white rel">
          <div class="form-title font-size-middle pd10 bold bg-main text-white">基本信息</div>
          <div class="form-head list-inlineblock tac">
            <div class="head-item f-item w1 bg-gray text-white">小票号</div>
            <div class="head-item f-item w2 bg-gray text-white">订单编号</div>
            <div class="head-item f-item w2 bg-gray text-white">下单时间</div>
            <div class="head-item f-item w1 bg-gray text-white">订单金额</div>
            <div class="head-item f-item w2 bg-gray text-white">支付方式</div>
            <div class="head-item f-item w2 bg-gray text-white">优惠</div>
          </div>
          <div class="form-body tac text-gray">
            <div class="form-body-wrap list-inlineblock">
              <ul>
                <li class="row-item list-inlineblock">
                  <div class="body-item f-item w1">
                    <div class="align" style="color:#7F9EB6;">{{order.serial_num | GetSerialNum}}</div>
                  </div>
                  <div class="body-item f-item w2">
                    <div class="align">{{order.serial_no}}</div>
                  </div>
                  <div class="body-item f-item w2">
                    <div class="align">{{order.created_date}}</div>
                  </div>
                  <div class="body-item f-item w1">
                    <div class="align" style="color:red;">{{order.actual_amount | MoneyToF}}</div>
                  </div>
                  <div class="body-item f-item w2">
                    <div class="align">
                      <p v-for="(item1,index1) in flow">{{item1.pay_method | GetPayMethodName}}: {{item1.amount | MoneyToF}}元</p>
                    </div>
                  </div>
                  <div class="body-item f-item w2">
                    <div class="align">
                      <span v-if="order.total_amount - order.rece_amount > 0 ">{{order.total_amount - order.rece_amount | MoneyToF}}</span>
                      <span v-else>--</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 商品明细 -->
        <div class="form-1 bg-white rel mt20">
          <div class="form-title font-size-middle pd10 bold bg-main text-white">商品信息</div>
          <div class="form-head list-inlineblock tac">
            <div class="head-item f-item w3 bg-gray text-white">序号</div>
            <div class="head-item f-item w1 bg-gray text-white">商品图片</div>
            <div class="head-item f-item w4 bg-gray text-white">商品编号</div>
            <div class="head-item f-item w2 bg-gray text-white">商品名称</div>
            <div class="head-item f-item w1 bg-gray text-white">规格</div>
            <div class="head-item f-item w1 bg-gray text-white">价格</div>
            <div class="head-item f-item w1 bg-gray text-white">小计</div>
            <div class="head-item f-item w1 bg-gray text-white">数量/已退</div>
            <div class="head-item f-item w1 bg-gray text-white">操作</div>
          </div>
          <div class="form-body tac text-gray form-body2">
            <div class="form-body-wrap list-inlineblock">
              <ul>
                <li class="row-item list-inlineblock" v-for="(item,index) in order.store_details">
                  <div class="body-item f-item w3">
                    <div class="align">{{index + 1}}</div>
                  </div>
                  <div class="body-item f-item w1 item-img">
                    <div class="align">
                      <img alt :src="item.img_url" />
                    </div>
                  </div>
                  <div class="body-item f-item w4">
                    <div class="align">{{item.product_no}}</div>
                  </div>
                  <div class="body-item f-item w2">
                    <div class="align">{{item.product_name}}</div>
                  </div>
                  <div class="body-item f-item w1">
                    <div class="align">{{item.spec_msg}}</div>
                  </div>
                  <div class="body-item f-item w1">
                    <div class="align" style="color:red;">{{item.avg_unit_amount | MoneyToF}}</div>
                  </div>
                  <div class="body-item f-item w1">
                    <div class="align" style="color:red;">{{item.actual_amount | MoneyToF}}</div>
                  </div>
                  <div class="body-item f-item w1">
                    <div class="align">{{item.count}}/{{item.refund_count}}</div>
                  </div>
                  <div class="body-item f-item w1">
                    <div class="align" style="color:#0033FF;" v-if="!order.is_pay">
                      <span class="item-link">--</span>
                    </div>
                    <div class="align" v-if="!isRefund">
                      <span class="item-link">只能整单退</span>
                    </div>
                    <div class="align" style="color:#0033FF;" v-else-if="isRefund && item.count > item.refund_count && order.is_pay" @click="refund(item)">
                      <span class="item-link">退款</span>
                    </div>
                    <div class="align" v-else-if="isRefund && item.count == item.refund_count && order.is_pay">
                      <span class="item-link">退完</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bottom_nav">
          <button style="margin-top:8px;margin-right: 20px;" class="button round bg-white text-main button-size-middle2" @click="back">返回</button>
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
      curIndex: 0,
      isRefund: true,
      order: {},
      flow: []
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init(data) {
      this.order = data
      this.api_210()
    },
    //加载订单明细
    api_210() {
      let that = this
      api.post(api.api_210, api.getSign({
        StoreID: app_g.getPos().store_id,
        OrderNo: that.order.serial_no
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //订单信息
          that.order = res.data.Result

          res.data.Result.flow.forEach((item, index) => {
            //存在华润代金券，不能部分退
            if (item.pay_method == 105) {
              that.isRefund = false
            }
          })

          that.flow = res.data.Result.flow.filter(ele => ele.flow_type === 1)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 5000)
        }
      })
    },
    //退款
    refund(item) {
      //设置退款单原订单号
      this.order.order_no = this.order.serial_no
      this.order.serial_no = ''
      this.order.pos_no = app_g.getPos().no
      this.order.type = 2

      //更新父级组件
      this.$emit('goPopRefund', this.order, item)
    },
    //返回
    back() {
      if (this.order.type == 2) {
        this.$emit('nav', 'orderList')
        //线上订单
      } else if (this.order.type == 5) {
        this.$emit('nav', 'onLineOrderList')
      }
    }
  }
}
</script>
<style lang="scss">
.order-details {
  .section-con {
    padding-top: 0;
  }

  .bottom_nav {
    margin-bottom: 0px;
    bottom: 80px;
    position: fixed;
    text-align: center;
    width: 80%;
    height: 50px;
    line-height: 50px;
    vertical-align: text-center;
  }
  .item-img {
    padding-top: 5px;
    img {
      width: 60px;
      height: 60px;
    }
  }

  .form-1 {
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

      .body-item {
        position: relative;
        height: 50px;
        line-height: 1.3;
        border-bottom: 1px solid #acacac;
        border-right: 1px solid #acacac;
        box-sizing: border-box;
        &:last-child {
          border-right: none;
        }
      }

      .align {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .form-body2 {
      .body-item {
        height: 70px;
        line-height: 1.3;
        .align {
          position: absolute;
          width: 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
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
    .w5 {
      width: 30%;
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