<template>
  <div class="product-list rel" v-if="show" style="padding: 0px 0px 10px 0px;">
    <div class="product-cate bg-white">
      <ul class="list-cate-1 list-inlineblock">
        <li class="f-item item-cate" v-for="(item,index) in result" :key="index" @click="onClickItem(index)">
          <div :class="`button round border-gray text-gray ${curIndex == index ? 'button-cur' : ''}`">{{item.name}}</div>
        </li>
      </ul>
    </div>
    <div class="product-items">
      <ul class="list-product-1" style="margin: 0px 0px 50px 0px;">
        <li class="item-product" v-for="(item1,index) in result[curIndex].list" :key="index" @click="loadDetails(item1)">
          <div class="item-img">
            <img :alt="item1.name" :src="item1.img_url" width="100%" height="100%" />
          </div>
          <div class="item-info text-gray">
            <div class="item-no ellipsis">NO.{{item1.no}}</div>
            <div class="item-name ellipsis2">{{item1.name}}</div>
          </div>
        </li>
      </ul>
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
      //数据集合
      result: [{
        name: '',
        list: []
      }]
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClickItem(index) {
      this.curIndex = index
      let item = this.result[this.curIndex]
      if (!item.isLoad) {
        this.api_201()
      }
    },
    //加载商品列表数据
    api_200() {
      let that = this
      api.post(api.api_200, api.getSign({
        StoreID: app_g.getPos().store_id,
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.catgList = res.data.Result.catgs
          //处理数据
          res.data.Result.catgs.forEach(function (item, index) {
            item.list = []
            item.isLoad = false
            res.data.Result.productList.forEach(function (item1, index1) {
              if (item.id == item1.gcatg_id) {
                item.isLoad = true
                item.list.push(item1)
              }
            })
          })

          that.result = res.data.Result.catgs
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 5000)
        }
      })
    },
    //根据导购分类ID获取
    api_201() {
      let that = this
      api.post(api.api_201, api.getSign({
        StoreID: app_g.getPos().store_id,
        CatgID: that.result[that.curIndex].id
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.result[that.curIndex].isLoad = true
          //处理数据
          res.data.Result.forEach(function (item, index) {
            that.result[that.curIndex].list.push(item)
          })
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 5000)
        }
      })
    },
    //获取商品详情
    loadDetails(item) {
      this.isShow = false
      this.$emit('getSKU', item)
    }
  },
  created() {
    //只有登录后，才获取商品信息
    if (this.UserInfo.islogin()) {
      this.api_200()
    }
  }
}
</script>

<style lang="scss">
.list-cate-1 {
  padding: 8px 30px 8px 30px;
  .item-cate {
    margin: 8px 16px 0px 0px;
    // &:last-child {
    //   margin: 0;
    // }
  }
}
.product-cate {
  //height: 67px;
  width: 100%;
  left: 0;
  top: 0;
}
.product-list {
  padding: 67px 0 0 0;
  height: 100%;
  box-sizing: border-box;
}
.product-items {
  box-sizing: border-box;
  overflow: auto;
  height: 100%;
  padding: 18px 0 0 16px;
}
.list-product-1 {
  font-size: 0;
  .item-product {
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    font-size: 15px;
    width: 161px;
    height: 210px;
    background-color: #fff;
    margin: 0 22px 20px 0;
  }
  .item-img {
    height: 132px;
  }
  .item-info {
    padding: 14px;
  }
  .item-name {
    margin-top: 7px;
    line-height: 25px;
  }
}
</style>
