<template>
  <div class="pages abs tar">
    <button class="item-page w80" @click="first">首页</button>
    <button class="item-page w80" @click="prev">上页</button>
    <button class="item-page" :class="[item == index + 1?'cur':'']" v-for="item in pageNums" @click="itemClick(item - 1)">{{item}}</button>
    <button class="item-page w80" @click="next">下页</button>
    <button class="item-page w80" @click="last">尾页</button>
  </div>
</template>

<script>
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'

export default {
  data() {
    return {
      //请求参数
      params: {},
      index: 0,
      totalPage: 0,
      totalRow: 0,
      //页码
      pageNums: []
    }
  },
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    init(data) {
      this.params = data
      this.pageNums = []
      this.load()
    },
    //外部触发翻页查询事件
    execute(data) {
      this.params = data
      this.pageNums = []
      //加载翻页
      this.load()
    },
    //上一页
    prev() {
      if (this.index >= 1) {
        this.index--
        this.load()
      }
    },
    //首页
    first() {
      if (this.index != 0) {
        this.index = 0
        this.load()
      }
    },
    //下一页
    next() {
      if (this.index + 1 < this.totalPage) {
        this.index++
        this.load()
      }
    },
    //最后一页
    last() {
      if (this.index != this.totalPage - 1) {
        this.index = this.totalPage - 1
        this.load()
      }
    },
    //页码
    itemClick(index) {
      this.index = index
      this.pageNums = []
      this.load()
    },
    //加载订单
    load() {
      let that = this
      this.pageNums = []
      //翻页参数
      let pageParam = { Index: that.index, Size: that.pageSize }
      //合并请求参数
      let merged = { ...pageParam, ...that.params }
      //加载数据
      api.post(this.url, api.getSign(merged), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          //更新数据
          that.$emit('pagerUpdate', res.data.Result)
          //绑定页码
          that.dataBind(res.data.Result)
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 3000)
        }
      })
    },
    //数据绑定 
    dataBind(result) {
      let that = this
      //总行数   
      that.totalRow = result.totalRow
      //总页数
      that.totalPage = parseInt(result.totalRow / that.pageSize) + (result.totalRow % that.pageSize == 0 ? 0 : 1)
      //每10页开始
      let start10Page = parseInt(this.index / 10) * 10
      //绑定页码
      for (var i = 0; i < 10; i++) {
        if (start10Page + i + 1 > that.totalPage) break
        that.pageNums.push(start10Page + i + 1)
      }
    }
  }
}
</script>
<style lang="scss">
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
  .w80 {
    width: 80px !important;
  }
}
</style>