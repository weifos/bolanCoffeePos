<template>
  <div class="f-frame">
    <!-- frame-left s -->
    <div class="frame-left rel">
      <div class="info-bar abs">
        <div class="fr text-gray font-size-small">收银台：{{pos.no}}</div>
        <div class="text-gray font-size-small">{{nowTime}}</div>
        <div class="text-gray font-size-small mt5">联网状态：在线</div>
        <div class="user-info hidden mt10">
          <div class="user-img fl">
            <img alt :src="userInfo.head_img" width="100%" height="100%" />
          </div>
          <div class="user-txt">
            <div class="user-name bold">收银员：{{userInfo.login_name}}</div>
            <div class="user-identity mt5">
              <span class="icon icon-arrow dib vam"></span>
              <span class="dib vam" v-if="member.id > 0" style="font-size:12px;">
                会员手机：{{member.login_name}}，{{member.level}}折扣：{{member.dis_count * 10}}折
                <span class="button-border-cur" @click="cLoginOutMember">退出</span>
              </span>
              <!-- <span class="dib vam ml10">{{userInfo.user_name}}</span> -->
            </div>
          </div>
        </div>
        <!-- <div class="machine-info mt15">
          <div class="mt5">会 员：139812345432【十点会员】</div>
        </div>-->
      </div>
      <div class="content-bar">
        <slot name="left"></slot>
      </div>
    </div>
    <!-- frame-left e -->
    <!-- frame-right s -->
    <div class="frame-right rel">
      <!-- top-bar s -->
      <div class="top-bar bg-main text-white abs">
        <div class="text-tips">{{title}}</div>
        <div class="search-bar abs" style="display:none;">
          <input class="input-search" />
        </div>
      </div>
      <!-- top-bar e -->
      <div class="content-bar bg-light-gray">
        <slot name="right"></slot>
      </div>
      <!-- tool-bar s -->
      <div class="tool-bar abs bg-white hidden">
        <div class="right-side fr">
          <Icon type="daily"></Icon>
          <Icon type="transformDuty"></Icon>
          <Icon type="loginOut"></Icon>
        </div>
        <div class="left-side">
          <Icon type="dataDownLoad" v-on:nav="nav"></Icon>
          <Icon type="statementInfo" v-on:nav="nav"></Icon>
          <Icon type="notDoneOrder" v-on:nav="nav" :num="iconNum.notDoneOrderNum"></Icon>
          <Icon type="notGetOrder" v-on:nav="nav" :num="iconNum.notGetOrderNum"></Icon>
          <Icon type="orderList" v-on:nav="nav"></Icon>
          <Icon type="onLineOrderList" v-on:nav="nav"></Icon>
          <Icon type="memberInfo" v-on:memberLogin="memberLogin"></Icon>
        </div>
      </div>
      <!-- tool-bar e -->
    </div>
    <!-- frame-right e -->
  </div>
</template>

<script>
import axios from "axios";
import api from "@/modules/api";
import app_m from "@/modules/appMiddleware";
import app_g from "@/modules/appGlobal";
import Icon from "@/components/Icon";
import { mapState } from "vuex";

export default {
  components: {
    Icon
  },
  props: {
    result: Object
  },
  watch: {
    result: function (newData, oldData) {
      if (newData.id) {
        if (
          newData.head_img == undefined ||
          newData.head_img == null ||
          newData.head_img.length == 0
        ) {
          newData.head_img = "../../static/img/user.png";
        }
        this.userInfo = newData;
      }
    }
  },
  data() {
    return {
      userInfo: {
        head_img: "../../static/img/user.png",
        user_name: "未登录",
        login_name: "--"
      },
      nowTime: "",
      member: {
        login_name: "--"
      },
      pos: {
        no: ""
      },
      //小程序订单通知对象
      notifier: {
        //消息提醒地址
        //audio: new Audio('../static/music/remind.mp3'),
        //定时通知对象
        timer: null,
        //是否开始播放
        isPlaying: false
      },
      printTimer: null,
      //角标
      iconNum: {
        //未作订单
        notDoneOrderNum: 0,
        //未取订单
        notGetOrderNum: 0
      }
    };
  },
  computed: {
    ...mapState({
      title: state => state.vux.title
    })
  },
  methods: {
    //小程序订单实时处理
    initOrderNty() {
      let that = this;
      if (process.env.NODE_ENV === 'production') {
        if (that.notifier.timer == null) {
          that.notifier.timer = setInterval(() => {
            setTimeout(that.api_219(), 500);
          }, 6000);
        }
      }

    },
    //检查设备
    nav(type) {
      this.$emit("nav", type);
    },
    //会员登录
    memberLogin() {
      this.$emit("memberLogin");
    },
    //登出登录会员信息
    cLoginOutMember() {
      let that = this;
      this.$vux.confirm.show({
        title: "确认退出登录吗",
        onCancel() { },
        onConfirm() {
          that.loginOutMember();
        }
      });
    },
    //更新登录会员信息
    updateMember(result) {
      this.member = result;
    },
    //更新角标
    updateIconNum(result) {
      console.log(result)
      if (result.status == 3) this.iconNum.notDoneOrderNum = result.num
      else if (result.status == 10) {
        if (result.iconType == 1) {
          this.iconNum.notDoneOrderNum = result.num
          this.iconNum.notGetOrderNum += 1
        } else if (result.iconType == 2) this.iconNum.notGetOrderNum = result.num
      }
      else if (result.status == 18) {
        if (result.iconType == 1) this.iconNum.notDoneOrderNum = result.num
        else if (result.iconType == 2) this.iconNum.notGetOrderNum = result.num
      }
    },
    //登出登录会员信息
    loginOutMember() {
      //清空会员信息
      this.UserInfo.loginOutMember();
      this.member = { id: 0 };
    },
    //显示当前时间（年月日时分秒）
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      let ss =
        new Date(timeStamp).getSeconds() < 10
          ? "0" + new Date(timeStamp).getSeconds()
          : new Date(timeStamp).getSeconds();
      this.nowTime =
        year +
        "年" +
        month +
        "月" +
        date +
        "日" +
        " " +
        hh +
        ":" +
        mm +
        ":" +
        ss;
    },
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 1000);
      this.clear();
    },
    clear() {
      clearInterval(this.nowTimes);
      this.nowTimes = null;
    },
    //咖啡pos实时查询
    api_219() {
      let that = this;
      let pos = app_g.getPos();

      if (pos != null) {
        //console.log(pos);
        axios(api.api_219, {
          method: "post",
          data: api.getSign({ StoreID: pos.store_id, PosNo: pos.no, LastID: (pos.last_online_id == undefined ? 0 : pos.last_online_id) })
        }).then(res => {

          if (res.data.Basis != undefined && res.data.Basis.State == 205) {
            that.$vux.toast.text(res.data.Basis.Msg, "default")
          } else {

            if (res.data.Basis.State == api.state.state_200) {
              //未制作角标数
              that.iconNum.notDoneOrderNum = res.data.Result.not_made
              //未取角标数
              that.iconNum.notGetOrderNum = res.data.Result.not_get

              if (res.data.Result.ret_order.length > 0) {
                //that.notifier.audio.play()
                if (pos.last_online_id != res.data.Result.ret_order[res.data.Result.ret_order.length - 1].id) {
                  //上一个订单在返回结果中的索引
                  var start_index = res.data.Result.ret_order.findIndex((v) => {
                    return v.id == pos.last_online_id;
                  })
                  //记录上一个订单的id
                  pos.last_online_id = res.data.Result.ret_order[res.data.Result.ret_order.length - 1].id
                  app_g.setPos(pos)
                  app_m.playNty()
                  //打印起始索引
                  let time_length = start_index + 1
                  let is_printing = false
                  if (that.printTimer == null) {
                    that.printTimer = setInterval(() => {
                      if (time_length < res.data.Result.ret_order.length) {
                        if (is_printing == false) {
                          is_printing = true
                          let item = res.data.Result.ret_order[time_length]
                          //打印线上订单
                          app_m.print(app_g.getPos().store_id, item.user_id, item.serial_no, 0, () => {
                            time_length++
                            is_printing = false
                            if (time_length == res.data.Result.ret_order.length) {
                              clearInterval(that.printTimer)
                              that.printTimer = null
                            }
                          })
                        }
                      }
                    }, 1000)
                  }
                }
              }
            } else {
              that.$vux.toast.text(res.data.Basis.Msg, "default", 3000);
            }
          }

        });
      }
    }
  },
  created() {
    this.nowTimes();
    this.initOrderNty();
    //如果已登录，刷新用户信息
    if (this.UserInfo.islogin()) {
      this.userInfo = this.UserInfo.user;
      if (
        this.userInfo.head_img == undefined ||
        this.userInfo.head_img == null ||
        this.userInfo.head_img.length == 0
      ) {
        this.userInfo.head_img = "../../static/img/user.png";
      }
    }
    //消费的会员信息
    this.member = this.UserInfo.member;
    let pos = app_g.getPos();
    if (pos) {
      this.pos = pos;
    }
  }
};
</script>

<style lang="scss">
.frame-left {
  .info-bar {
    width: 100%;
    left: 0;
    top: 0;
    height: 126px;
    border-bottom: 1px solid #acacac;
    box-sizing: border-box;
    padding: 10px 10px 0px 10px;
  }
  .tool-bar {
    height: 62px;
    width: 100%;
    left: 0;
    bottom: 0;
  }
  .content-bar {
    height: 100%;
    box-sizing: border-box;
    padding-top: 126px;
  }
  .user-txt {
    padding-top: 5px;
  }
  .user-info {
    .user-name,
    .user-identity {
      font-size: 18px;
    }
    .user-img {
      width: 59px;
      height: 59px;
      overflow: hidden;
      border-radius: 100%;
      margin-right: 17px;
    }
  }
  .accounts-info {
    padding: 12px 0 0 20px;
  }
  .btns-bar {
    text-align: right;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 18px;
    padding-right: 13px;
  }
}

.frame-right {
  .top-bar {
    width: 100%;
    height: 58px;
    left: 0;
    top: 0;
    line-height: 58px;
    text-align: center;
    overflow: hidden;
    .text-tips {
      // padding-right: 253px;
    }
  }
  .tool-bar {
    width: 100%;
    height: 62px;
    left: 0;
    bottom: 0;
  }
  .content-bar {
    height: 100%;
    box-sizing: border-box;
    padding: 58px 0 62px 0;
  }
  .search-bar {
    right: 10px;
    top: 50%;
    width: 243px;
    height: 30px;
    transform: translateY(-50%);

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      background: url("../../../static/img/search.png") no-repeat 0 0/100% auto;
      z-index: 1;
      width: 16px;
      height: 16px;
      transform: translate(15px, 50%);
    }
  }
  .input-search {
    background-color: #fff;
    border: none;
    width: 183px;
    border-radius: 15px;
    padding: 0 20px 0 40px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    vertical-align: top;
  }
  .right-side,
  .left-side {
    padding-top: 6px;
  }
  .left-side {
    padding-left: 10px;
  }
  .right-side {
    padding-right: 10px;
  }
  .icon {
    margin: 0 15px;
  }
}
</style>
