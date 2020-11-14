<template>
  <div class="icon">
    <template v-if="type == 'statementInfo'">
      <div class="icon-img" @click="nav('menu')">
        <img src="./img/i7.png" />
      </div>
      <div class="icon-text">咖啡点单</div>
    </template>
    <template v-if="type == 'notDoneOrder'">
      <div class="icon-img" @click="nav('notDoneOrder')">
        <img src="./img/i2.png" />
      </div>
      <div class="icon-text">未作订单</div>
    </template>
    <template v-if="type == 'notGetOrder'">
      <div class="icon-img" @click="nav('notGetOrder')">
        <img src="./img/i5.png" />
      </div>
      <div class="icon-text">未取订单</div>
    </template>
    <template v-if="type == 'orderList'">
      <div class="icon-img" @click="nav('orderList')">
        <img src="./img/i8.png" />
      </div>
      <div class="icon-text">订单列表</div>
    </template>
    <template v-if="type == 'onLineOrderList'">
      <div class="icon-img" @click="nav('onLineOrderList')">
        <img src="./img/i8.png" />
      </div>
      <div class="icon-text">线上订单</div>
    </template>
    <template v-if="type == 'dataDownLoad'">
      <div class="icon-img" @click="nav('orderEntry')">
        <img src="./img/i1.png" />
      </div>
      <div class="icon-text">挂单/恢复</div>
    </template>
    <template v-if="type == 'memberInfo'">
      <div class="icon-img" @click="loginMember">
        <img src="./img/i4.png" />
      </div>
      <div class="icon-text">会员信息</div>
    </template>

    <!-- 打印日结 -->
    <template v-if="type == 'daily'">
      <div class="icon-img" @click="printDaily">
        <img src="./img/i2.png" />
      </div>
      <div class="icon-text">打印日结</div>
    </template>
    <template v-if="type == 'transformDuty'">
      <div class="icon-img">
        <img src="./img/i3.png" />
      </div>
      <div class="icon-text">交接班</div>
    </template>
    <template v-if="type == 'loginOut'">
      <div class="icon-img" @click="loginOut">
        <img src="./img/i6.png" />
      </div>
      <div class="icon-text">退出登录</div>
    </template>

    <div class="icon-num" v-if="num > 0">{{num>99?"99+":num}}</div>
  </div>
</template>

<script>

//import api from "@/modules/api"
import app_g from '@/modules/appGlobal'
import app_m from '@/modules/appMiddleware'

export default {
  props: {
    'type': {
      type: String
    },
    'num': {
      type: Number,
      default: 0
    }
  },
  methods: {
    //检查设备
    nav(type) {
      this.$emit('nav', type)
    },
    //登录会员
    loginMember() {
      this.$emit('memberLogin')
    },
    //退出登录
    loginOut(item) {
      let that = this
      this.$vux.confirm.show({
        title: '确认退出登录吗',
        onCancel() { },
        onConfirm() {
          that.UserInfo.loginOut()
          window.location.reload()
          return
        }
      })
    },
    //打印小票日结
    printDaily() {
      let that = this
      //调起打印
      app_m.print(app_g.getPos().store_id, that.UserInfo.user.id, "", 3, () => {
        console.log('打印回调')
      })

      //测试获取数据用
      //   let that = this
      //   //门店
      //   api.post(api.api_221, api.getSign({
      //     StoreID: app_g.getPos().store_id,
      //     PosNo: app_g.getPos().no,
      //     Date: '2020-07-31'
      //   }), function (vue, res) {
      //     if (res.data.Basis.State == api.state.state_200) {
      //       console.log(res.data.Result)
      //     }
      //   })
    }

  }
}
</script>

<style lang="scss">
.icon {
  display: inline-block;
  text-align: center;
  position: relative;
}
.icon-img {
  height: 27px;
  margin-bottom: 6px;
  vertical-align: middle;
}
.icon-num {
  position: absolute;
  background-color: #ff3d3d;
  width: 25px;
  height: 19px;
  line-height: 18px;
  color: #fff;
  font-size: 12px;
  border-radius: 100%;
  right: 5px;
  top: -5px;
}
</style>
