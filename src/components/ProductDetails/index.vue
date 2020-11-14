<template>
  <div class="order-parameter rel section" v-if="isShow">
    <div class="con-wrap">
      <div class="product-info hidden">
        <div class="img-bar fl">
          <img :src="product.img_url" alt />
        </div>
        <div class="text-bar text-gray">
          <div class="text-name mt10">{{product.name}}</div>
          <div class="text-no mt10">{{product.no}}</div>
          <div class="text-num">库存：{{selectSku.stock}}件</div>
        </div>
      </div>
      <ul class="list-para">
        <li class="list-item" v-for="(item,index) in pResult.specNames" :key="index">
          <div class="para-label text-gray fl">{{item.name}}：</div>
          <div class="para-value list-inlineblock">
            <button
              class="f-item button square bg-white text-gray button-size-middle dib mr20 mb20"
              v-for="(citem,index) in pResult.specValues"
              v-if="citem.specname_id == item.id"
              @click="check(citem)"
              :class="[citem.is_enable?'':'disable',citem.checked?'clicked':'']"
            >{{pResult.specCustoms,item.id,citem.id,citem.val | getCustomName}}</button>
          </div>
        </li>
        <li class="list-item">
          <div class="row">
            <div class="dib vam text-gray para-label">数量：</div>
            <div class="dib vam">
              <button class="btn btn-subtract operate-btn-size-middle mr10" @click="sub"></button>
              <input type="text" class="dib vam font-size-middle round bg-white text-gray tac input-size-middle no-border" v-model="buyCount" />
              <button class="btn btn-plus operate-btn-size-middle ml10" @click="add"></button>
            </div>
          </div>
          <div class="row mt20">
            <div class="dib vam text-gray para-label">单价：</div>
            <div class="dib vam font-size-middle text-gray">
              ￥{{unitPrice|MoneyToF}}
              <!-- <input type="text" class="font-size-middle round bg-white text-gray tac input-size-normal no-border" v-model="selectSku.sale_price" /> -->
            </div>
          </div>
          <div class="row mt10">
            <div class="dib vam text-gray para-label">小计：</div>
            <div class="dib vam text-total">
              ￥{{totalPrice|MoneyToF}}
              <!-- <input type="text" class="font-size-middle round bg-white text-gray tac input-size-normal no-border" value="1" /> -->
            </div>
          </div>
        </li>
      </ul>
      <div class="operate-bar tac">
        <div class="row">
          <button class="button round bg-main text-white button-size-normal" :class="[(isCanSubmit?'':'bg-gray')]" @click="submit">确认</button>
          <button class="button round bg-gray text-white button-size-normal" @click="close">取消</button>
        </div>
      </div>
    </div>
    <div class="dib vam text-gray para-label">小计：</div>
    <div class="dib vam">
      <input type="text" class="font-size-middle round bg-white text-gray tac input-size-normal no-border" v-model="selectSku.sale_price * buyCount" />
    </div>
    <div class="row mt20">
      <div class="dib vam text-gray para-label">库存：</div>
      <div class="dib vam">
        <input type="text" class="font-size-middle round bg-white text-gray tac input-size-normal no-border" v-model="selectSku.stock" />
      </div>
    </div>
  </div>
</template>
 
<script>
import api from '@/modules/api'
import app_g from "@/modules/appGlobal"
import store from '@/store'

export default {
  data() {
    return {
      imgUrl: '',
      isShow: false,
      //是否能够购买
      isCanSubmit: true,
      store_id: 0,
      product: { name: '' },
      //是否加入购物车
      isJoinSCart: false,
      //显示sku模态框
      showDialog: false,
      //购买数量
      buyCount: 1,
      //选择的sku
      selectSku: {
        stock: 0,
        specset: '',
        sale_price: 0,
        product_id: 0
      },
      //单价
      unitPrice: 0,
      //总计
      totalPrice: 0,
      pResult: {}
    }
  },
  filters: {
    getCustomName: function (specCustoms, name_id, val_id, val) {
      var custom_name = val
      specCustoms.forEach(function (item, index) {
        if (
          name_id == item.specname_id &&
          val_id == item.specvalue_id &&
          item.custom_value != ''
        ) {
          custom_name = item.custom_value
          return
        }
      })
      return custom_name
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show: function (newData, oldData) {
      this.isShow = newData
    }
  },
  methods: {
    //初始化
    init: function () {
      if (this.product.is_open_spec) {
        if (this.pResult.specNames.length == 0) return
        this.totalPrice = 0
        //获购买数量
        this.buyCount = 1
        //获取首行规格名称id
        let one_name_id = this.pResult.specNames[0].id
        //绑定首行状态
        this.bindSKU(one_name_id)
      } else {
        this.selectSku = this.pResult.skus[0]
        this.totalPrice = this.selectSku.sale_price
        this.checkUpdate()
      }
      this.isCanSubmit = this.pResult.skus.filter(sku => sku.is_enable).length > 0
    },
    //规格选中事件
    check(item) {
      let that = this
      //是否可用点击
      if (!item.is_enable) return
      //当前索引      
      var i = this.pResult.specNames.findIndex((val) => val.id == item.specname_id)
      //设置点击状态
      that.pResult.specValues.map((obj, index, arr) => {
        if (obj.specname_id == item.specname_id) {
          obj.checked = false
          if (item.id == obj.id) {
            obj.checked = true
          }
        }
      })

      //判断下一行索引是否大于数组总长度 
      if (i + 1 > this.pResult.specNames.length - 1) {
        //全部选中
        this.getSelectSkuVal()
      } else {
        //清除未选择的状态
        let clearSpecNames = this.pResult.specNames.filter((val, index) => index > i)
        clearSpecNames.forEach(function (item, index) {
          that.pResult.specValues.map(function (obj, i) {
            if (obj.specname_id == item.id) {
              obj.checked = false
              obj.is_enable = false
            }
          })
        })

        //绑定下一行
        this.bindSKU(this.pResult.specNames[i + 1].id, item)
      }
    },
    //绑定每行sku状态
    bindSKU(spec_name_id, specVal) {
      //SKU集合
      let skus = this.pResult.skus
      let checkedVal = this.pResult.specValues.filter(val => val.checked).map(item => item.specname_id + "_" + item.id).join(',')
      //处理规格值
      this.pResult.specValues.filter(val => val.specname_id == spec_name_id).map((obj, index) => {
        //在sku集合里面获取首行可点的规格
        skus.forEach(function (item, index) {
          if (item.stock <= 0) {
            obj.is_enable = false
            return
          }
          let exist = 0
          let pass = false
          let arr = checkedVal.split(',')
          let arr1 = item.specset.split(',')
          arr.forEach(function (o, i) {
            arr1.forEach(function (oo, ii) {
              if (oo == o) {
                exist++
              }
            })
          })

          //是否是第一次加载
          if (checkedVal.length) {
            pass = exist == arr.length
          } else {
            pass = true
          }

          item.specset.split(',').forEach(function (o, i) {
            if (pass && o.split('_')[0] == spec_name_id && obj.specname_id + "_" + obj.id == o) {
              obj.is_enable = true
              return
            }
          })
        })

        if (specVal != undefined && specVal.id == obj.id) {
          obj.checked = true
        }
      })
    },
    //获取选中完成的sku
    getSelectSkuVal() {
      let items = this.pResult.specValues.filter(val => val.checked == true)
      if (items.length < this.pResult.specNames.length) {
        let name = this.pResult.specNames[items.length].name
        this.$vux.toast.text("请选择" + name, 'default', 3000)
        return null
      }

      let data = null
      if (this.product.is_open_spec) {
        //获取选中数据
        let sku_id = items.map(item => item.specname_id + "_" + item.id).join(',')
        //在当前sku集合中获取
        this.pResult.skus.forEach(function (item, index) {
          if (app_g.util.compareSku(sku_id, item.specset)) {
            data = item
            return
          }
        })
      } else {
        data = this.selectSku
      }

      this.selectSku = data
      this.checkUpdate()
      return data
    },
    //提交
    submit() {
      if (!this.isCanSubmit) return
      //选中的商品SKU
      let tmp = this.getSelectSkuVal()

      if (tmp != null) {
        //门店商品ID
        tmp.sto_product_id = this.product.id
        //平台商品ID
        tmp.product_id = this.product.product_id
        //加入购物车的数量
        tmp.count = this.buyCount
        //加入本地购物车
        app_g.setShoppingCart(tmp)
      }
      //加入本地购物车
      this.$emit('setShoppingCart')

      this.$emit('cancelSKU')
    },
    //关闭当前页
    close() {
      this.selectSku.specset = ''
      this.selectSku.sale_price = 0
      this.selectSku.product_id = 0
      this.$emit('cancelSKU')
    },
    //加
    add() {
      if (this.buyCount >= 99) return
      this.buyCount = this.buyCount + 1
      this.checkUpdate()
    },
    //减
    sub() {
      if (this.buyCount <= 1) return
      this.buyCount = this.buyCount - 1
      this.checkUpdate()
    },
    //勾选改变更新小计
    checkUpdate() {
      this.unitPrice = this.selectSku.sale_price
      //设置总计
      this.totalPrice = this.selectSku.sale_price * this.buyCount
    },
    //处理输入方式
    handleInput() {
      let value = this.validateNumber(e.detail.value)
      val.replace(/\D/g, '')
    },
    //获取商品详情
    api_202(item) {
      let that = this
      this.product = item

      api.post(api.api_202, api.getSign({
        StoreID: app_g.getPos().store_id,
        ID: item.id,
        TID: item.product_type_id
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          that.isShow = true
          res.data.Result.specValues.forEach((obj, i) => {
            that.$set(obj, "checked", false)
            that.$set(obj, "is_enable", false)
          })
          that.pResult = res.data.Result
          that.init()
        } else {
          that.$vux.toast.text(res.data.Basis.Msg, 'default', 5000)
        }
        store.commit("loadingStatus", { isLoading: false })
      })
    },
    /**
     * 加载商品详情
     */
    api_203: function () {
      var that = this
      //是否包邮
      let is_postage = this.pResult.product.is_postage == undefined ? false : this.pResult.product.is_postage
      //立即购买
      if (this.isJoinSCart) {
        let list = [{
          store_id: this.store_id,
          product_id: this.selectSku.product_id,
          is_postage: is_postage,
          specset: this.selectSku.specset,
          img_url: this.pResult.product.img_url,
          product_name: this.selectSku.product_name,
          product_en_name: this.selectSku.product_en_name,
          product_price: this.selectSku.sale_price,
          subtotal: this.selectSku.sale_price * this.buyCount,
          count: this.buyCount
        }]

        //提交到本地存储临时数据
        user.methods.buyNow(list)
        //加入购物车
      } else {
        let that = this
        api.post(api.api_306,
          api.getSign({
            StoreId: this.store_id,
            SPID: this.selectSku.product_id,
            PID: this.pResult.product.product_id,
            SpecSet: this.selectSku.specset,
            Count: this.buyCount
          }),
          function (vue, res) {
            if (res.data.Basis.State == api.state.state_200) {
              //更新父级页面事件
              that.triggerEvent('updateSCart', res.data)
            } else {
              wx.showToast({
                title: res.data.Basis.Msg,
                icon: 'none',
                duration: 3000
              })
            }
          }
        )
      }
    },
    /**
     * 提交订单
     */
    api_314: function () {
      var that = this;
      api.post(api.api_314, api.getSign({}), function (app, res) {
        if (res.data.Basis.State != api.state.state_200) {
          wx.showToast({
            title: res.data.Basis.Msg,
            icon: 'none',
            duration: 3000
          })
        } else {
          //   that.setData({
          //     result: res.data.Result.catgs
          //   })

          //初始化数据
          that.initData(res.data.Result.catgs, res.data.Result.productList)
          //设置选中类别
          that.setCatgId(catg_id)
        }
      })
    }
  },
  created() {
  }
}
</script>

<style lang="scss">
.order-parameter {
  overflow: hidden;
  height: 100%;
  .section-tit {
    height: 67px;
    width: 100%;
    left: 0;
    top: 0;
    line-height: 67px;
  }
  .section-con {
    box-sizing: border-box;
    height: 100%;
    padding: 67px 0 0 0;
  }
  .con-wrap {
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding: 20px 30px;
  }

  .section-tit {
    .text-no {
      width: 30%;
      border-right: 1px solid #acacac;
    }
    .text-name {
      width: 70%;
    }
  }
  .product-info {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #acacac;
    .img-bar {
      width: 150px;
      height: 150px;
      margin: 0 40px 0 25px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text-name {
      font-size: 22px;
    }
    .text-num {
      margin-top: 50px;
    }
  }
  .operate-bar {
    margin-top: 0px;
    .button {
      margin: 0 50px;
    }
  }
  .text-total {
    font-size: 24px;
  }
}
.list-para {
  .list-item {
    margin-bottom: 1px;
    overflow: hidden;
  }
  .para-label {
    width: 100px;
    line-height: 44px;
    text-align: center;
  }
  .para-value {
    margin-left: 100px;
  }
  .button {
    &.disable {
      background: #acacac;
      color: #ffffff;
    }
  }
}
</style>