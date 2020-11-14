<template>
  <swiper ref="mySwiper" :options="swiperOption">
    <swiper-slide :key="banner.imgurl" v-for="banner in banners">
      <img :src="banner.imgurl" style="width:100%" />
    </swiper-slide>

    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'
import app_m from "@/modules/appMiddleware"
import 'swiper/css/swiper.css'

export default {
  data() {
    return {
      pageTitle: '轮播图',
      banners: [],
      swiperOption: {
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
        },
        pagination: {
          el: '.swiper-pagination'
        },
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  mounted() {
    console.log('Current Swiper instance object', this.swiper)
    //this.$refs.mySwiper.slideTo(3, 1000, false)
  },
  methods: {
    //检查设备
    api_100(pos) {
      let that = this
      api.post(api.api_100, api.getSign({
        Pos: pos
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.api_290(res.data.Result.store_id)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
          router.push({ path: "./auth" })
        }
      })
    },
    api_290(store_id) {
      let that = this
      api.post(api.api_290, api.getSign({ StoreID: store_id }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.banners = res.data.Result
        }
      })
    }
  },
  created() {
    let that = this
    let pos = app_g.getPos()
    if (pos == null || pos.state_id == undefined || pos.state_id == 0) {
      let appInit = function (result) {
        if (result.length) {
          let tmp = JSON.parse(result)
          if (tmp.Basis.State == api.state.state_200) {
            //浏览器测试环境
            if (tmp.Result.product == "browser") { }

            that.api_100(tmp.Result)
          } else {
            that.$vux.toast.text('POS信息加载失败', 'default', 3000)
          }
        }
      }
      //初始化设备
      app_m.init(appInit)
    }

    localStorage.setItem('pageTitle', this.pageTitle)
    document.getElementById('pageTitle').innerHTML = localStorage.getItem('pageTitle')
  }
}
</script> 