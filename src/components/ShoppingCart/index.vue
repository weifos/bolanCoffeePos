<template>
  <div class="order-list h100">
    <div class="form-order rel border-box">
      <div class="form-wrap h100">
        <div class="order-tit abs text-white tac list-inlineblock">
          <div class="f-item item-name bg-gray">品名</div>
          <div class="f-item item-price bg-gray">单价</div>
          <div class="f-item item-num bg-gray">数量</div>
          <div class="f-item item-operate bg-gray">操作</div>
        </div>
        <div class="order-con">
          <ul class="font-size-small list-order">
            <li class="list-inlineblock tac item-order" :class="[cindex == index?'selected':'']" v-for="(item,index) in list" :key="index" @click="selected(index)">
              <div class="f-item hidden item-name ellipsis">{{item.product_name}} {{item.spec_msg}}</div>
              <div class="f-item hidden item-price">{{item.unit_price|MoneyToF}}</div>
              <div class="f-item hidden item-num">{{item.count}}</div>
              <div class="f-item hidden item-operate">
                <button class="btn btn-subtract" @click="sub(item)"></button>
                <button class="btn btn-plus" @click="add(item)"></button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="tool-bar abs bg-main text-white">
      <div class="accounts-info" style="padding: 12px 0 0 10px;">
        <div>数量：{{count}}</div>
        <div class="mt5">总计：{{total|MoneyToF}}</div>
      </div>
      <div class="btns-bar abs">
        <button class="button bg-white text-main button-size-small round" @click="api_212">挂单</button>
        <button class="button bg-white text-main button-size-small round btn-account" @click="api_203">结算</button>
        <button class="button bg-white text-main button-size-small round" @click="del">删除</button>
      </div>
    </div>
  </div>
</template>
<script>
import router from '@/router'
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'
import user from '@/modules/userInfo'

export default {
  data() {
    return {
      cindex: -1,
      count: 0,
      total: 0,
      list: []
    }
  },
  methods: {
    //获取本地购物车
    upShoppingCart() {
      this.list = app_g.getShoppingCart()
      this.updateStats()
    },
    //清空本地购物车
    clearShoppingCart() {
      this.list = []
      app_g.clearShoppingCart()
    },
    //加
    add(item) {
      if (item.count + 1 >= 99) {
        this.$vux.toast.text('最大数量不能超过99', 'default', 3000)
        return
      }
      let tmp = {
        sto_product_id: item.sto_product_id,
        specset: item.specset,
        count: 1
      }
      app_g.setShoppingCart(tmp)
      this.upShoppingCart()
    },
    //减
    sub(item) {
      if (item.count - 1 < 1) return
      let tmp = {
        sto_product_id: item.sto_product_id,
        specset: item.specset,
        count: -1
      }
      app_g.setShoppingCart(tmp)
      this.upShoppingCart()
    },
    //选中
    selected(index) {
      this.cindex = index
    },
    //删除
    del() {
      if (this.cindex != -1) {
        app_g.delShoppingCart(this.cindex)
        this.list = app_g.getShoppingCart()
      }
    },
    //更新统计
    updateStats() {
      this.count = 0
      this.total = 0
      let tmps = app_g.getShoppingCart()
      tmps.forEach((ele, index) => {
        this.count += ele.count
        this.total += ele.unit_price * ele.count
      })
    },
    //结算
    api_203() {
      let that = this
      let tmps = app_g.getShoppingCart()

      if (tmps.length > 0) {
        this.member = this.UserInfo.member
        let user_id = this.member == undefined ? 0 : this.member.id
        let data = {
          store_id: app_g.getPos().store_id,
          pos_no: app_g.getPos().no,
          //会员信息
          user_id: user_id,
          //收银员
          created_user_id: that.UserInfo.user.id,
          store_details: tmps
        }
        api.post(api.api_203, api.getSign({
          Order: data,
        }), function (vue, res) {
          if (res.data.Basis.State == api.state.state_200) {
            that.count = 0
            that.total = 0
            that.clearShoppingCart()
            that.UserInfo.member = { id: 0 }
            //更新父级组件
            that.$emit('submitOrder', res.data.Result)
            //更新父级组件
            that.$emit('clearMember', res.data.Result)
          } else {
            that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
          }
        })
      }
    },
    //挂单
    api_212() {
      let that = this
      let tmps = app_g.getShoppingCart()
      if (tmps.length > 0) {
        let data = {
          store_id: app_g.getPos().store_id,
          pos_no: app_g.getPos().no,
          //收银员
          created_user_id: that.UserInfo.user.id,
          details: tmps
        }

        api.post(api.api_212, api.getSign({
          OrderEntry: data,
        }), function (vue, res) {
          if (res.data.Basis.State == api.state.state_200) {
            that.clearShoppingCart()
            //更新父级组件
            that.$emit('submitEntryOrder', res.data.Result)
          } else {
            that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
          }
        })
      }
    }
  },
  created() {
    this.upShoppingCart()
  }
}
</script>

<style lang="scss">
.order-list {
  .btn-account {
    transform: scale(1.3);
    margin: 0 10px 0 10px;
  }
  .selected {
    background-color: rgb(164, 202, 231) !important;
  }
  .form-order {
    padding: 32px 0 62px 0;
    height: 100%;
    .form-wrap {
      overflow-y: auto;
      overflow-x: hidden;
    }
    .item-name {
      width: 45%;
      box-sizing: border-box;
    }
    .item-price,
    .item-num {
      width: 15%;
      box-sizing: border-box;
    }
    .item-operate {
      width: 25%;
      box-sizing: border-box;

      .btn {
        margin: 0 5px;
      }
    }
    .order-tit {
      .item-name,
      .item-price,
      .item-num {
        border-right: 2px solid #fff;
      }
      .item-price,
      .item-num,
      .item-operate {
        height: 28px;
        line-height: 28px;
      }
    }
    .order-tit {
      height: 28px;
      line-height: 28px;
      width: 100%;
      top: 4px;
      left: 0;
    }
    .order-con {
      height: 100%;
    }
    .list-order {
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      .item-order {
        height: 40px;
        line-height: 40px;
        &:nth-child(2n) {
          background-color: #f0f0f0;
        }
      }
    }
  }
}
</style>

