<template>
  <div id="app" style="height: 100%;">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
    <loading v-model="isLoading"></loading>
  </div>
</template>
<script>

import { Loading, cookie, querystring } from "vux"
import { mapState } from "vuex"

export default {
  name: "app",
  data() {
    return {
      transitionName: "slide-right",
      isBack: false
    }
  },
  components: { Loading },
  computed: {
    ...mapState({
      isLoading: state => state.vux.isLoading
    })
  },
  watch: {
    $route(to, from) {
      sessionStorage.setItem("routerpath", from.name)
      this.isBack = !this.isBack;
      if (this.isBack) {
        this.transitionName = "slide-right"
      } else {
        this.transitionName = "slide-left"
      }
    }
  },
  methods: {},
  mounted() { },
  created() {
    localStorage.setItem("pageTitle", "博览读书·咖啡POS")
    document.getElementById("pageTitle").innerHTML = localStorage.getItem(
      "pageTitle"
    )
  }
};
</script>
<style lang="scss">
@import "./static/css/main.scss";
</style>


 