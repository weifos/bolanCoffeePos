<template>
  <div class="pop-work abs">
    <div class="pop-tit bg-main text-white tac">当前POS未授权，请联系管理员</div>
    <div class="pop-con"></div>
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
}
</style>