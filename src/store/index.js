import Vue from 'vue'
import Vuex from 'vuex'
import vux from './vux'  //导入

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: { vux },
  strict: debug
})