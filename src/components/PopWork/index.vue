<template>
  <div class="pop-work abs">
    <div class="pop-tit bg-main text-white tac">上/下班</div>
    <div class="pop-con">
      <div class="pop-input">
        <input type="text" placeholder="账号" maxlength="20" v-model="login_name" @focus="focusln" v-focus="true" class="input-phone input-text-1" />
      </div>
      <div class="pop-input mt10">
        <input type="password" placeholder="密码" maxlength="20" v-model="pass_word" @focus="focuspw" class="input-phone input-text-1" />
      </div>
      <div class="pop-btns list-inlineblock">
        <button class="btn-number f-item" @click="getNum(7)">7</button>
        <button class="btn-number f-item" @click="getNum(8)">8</button>
        <button class="btn-number f-item" @click="getNum(9)">9</button>
        <button class="btn-number f-item" @click="del">删除</button>
        <button class="btn-number f-item" @click="getNum(4)">4</button>
        <button class="btn-number f-item" @click="getNum(5)">5</button>
        <button class="btn-number f-item" @click="getNum(6)">6</button>
        <button class="btn-number f-item" @click="clearInputText">清除</button>
        <button class="btn-number f-item" @click="getNum(1)">1</button>
        <button class="btn-number f-item" @click="getNum(2)">2</button>
        <button class="btn-number f-item" @click="getNum(3)">3</button>
        <button class="btn-number f-item" @click="getNum(0)">0</button>
      </div>
      <div class="mt5 nowrap">
        <button class="button round bg-main text-white button-size-normal f-item btn-submit" @click="api_101">提交</button>
        <button class="button round bg-gray text-white button-size-normal f-item">取消</button>
      </div>
    </div>
  </div>
</template>

<script> 
import api from '@/modules/api'
import store from '@/store'

export default {
  data() {
    return {
      fln: true,
      login_name: '',
      pass_word: ''
    }
  },
  directives: {
    focus: {
      inserted: function (el, { value }) {
        console.log(el, { value })
        if (value) {
          el.focus()
        }
      }
    }
  },
  methods: {
    focusln() {
      this.fln = true
    },
    focuspw() {
      this.fln = false
    },
    clearInputText() {
      this.login_name = ''
      this.pass_word = ''
    },
    //删除
    del(n) {
      //登录用户名
      if (this.fln) {
        let len = this.login_name.length
        if (len > 0) {
          if (len - 1 <= 0) {
            this.login_name = ''
          } else {
            this.login_name = this.login_name.substring(0, len - 1)
          }
        }
        //登录密码
      } else {
        let len = this.pass_word.length
        if (len > 0) {
          if (len - 1 <= 0) {
            this.pass_word = ''
          } else {
            this.pass_word = this.pass_word.substring(0, len - 1)
          }
        }
      }
    },
    //获取号码
    getNum(n) {
      if (this.fln) {
        if (this.login_name.length > 30) return
        this.login_name = this.login_name + n
      } else {
        if (this.pass_word.length > 30) return
        this.pass_word = this.pass_word + n
      }
    },
    //立即登录
    api_101() {
      let that = this
      api.post(api.api_101, api.getSign({
        LoginName: this.login_name,
        Psw: this.pass_word
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.UserInfo.login(res.data.Result)
          //关闭模态窗口
          store.commit('setShowDialog', { showDialog: false })
          //更新父级组件
          that.$emit('loginSuccess', res.data.Result)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 5000)
        }
      })
    }
  },
  created() {
  }
}

</script>

<style lang="scss">
.pop-work {
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