<template>
  <div class="order-entry rel section-2" v-if="show">
    <div class="con-wrap">
      <div class="form-1 bg-white rel">
        <div class="form-head list-inlineblock tac abs">
          <div class="head-item f-item w3 bg-gray text-white">序号</div>
          <div class="head-item f-item w2 bg-gray text-white">单据</div>
          <div class="head-item f-item w9 bg-gray text-white">品名</div>
          <div class="head-item f-item w15 bg-gray text-white">规格</div>
          <div class="head-item f-item w1 bg-gray text-white">数量</div>
          <div class="head-item f-item w1 bg-gray text-white">单价</div>
          <div class="head-item f-item w1 bg-gray text-white">小计</div>
        </div>
        <div class="form-body tac text-gray">
          <div class="form-body-wrap list-inlineblock">
            <div class="left-part f-item">
              <ul class="cont" style="-webkit-overflow-scrolling: touch;overflow-x: hidden;overflow-y: auto;width: 100%;height: 100%;" @scroll="scroll">
                <li :class="`row-item list-inlineblock ${curIndex == index ? 'cur' : ''}`" @click="selectCur(index)" v-for="(item,index) in result" :key="item.no">
                  <div class="body-item f-item w4">
                    <div class="align">{{index + 1}}</div>
                  </div>
                  <div class="body-item f-item w5">
                    <div class="align">
                      <p>{{item.serial_num | GetSerialNum}}</p>
                      <p>{{item.created_date}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="right-part f-item rel">
              <ul v-if="result.length > 0">
                <li class="row-item list-inlineblock" v-for="(item1,index) in result[curIndex].details" :key="item1.no">
                  <div class="body-item f-item w6">
                    <div class="align">{{item1.product_name}}</div>
                  </div>
                  <div class="body-item f-item w8">
                    <div class="align">
                      <span class="db">{{item1.spec_msg}}</span>
                    </div>
                  </div>
                  <div class="body-item f-item w7 body-item__num">
                    <div class="align">{{item1.count}}</div>
                  </div>
                  <div class="body-item f-item w7">
                    <div class="align" style="color:red;">{{item1.unit_price | MoneyToF}}</div>
                  </div>
                  <div class="body-item f-item w7">
                    <div class="align" style="color:red;">{{item1.total_amount | MoneyToF}}</div>
                  </div>
                </li>
              </ul>
              <div class="status-bar abs bg-main text-white tar">
                <button class="button round bg-white text-main button-size-middle2" @click="delOrderEntry">删除</button>
                <button class="button round bg-white text-main button-size-middle2" @click="recoverOrderEntry">恢复</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/modules/api'
import app_g from '@/modules/appGlobal'

export default {
  data() {
    return {
      //旧数据，初始为0
      oldTop: 0,
      curIndex: 0,
      firstLoad: true,
      loading: false,
      pageSize: 12,
      pageIndex: 0,
      totalPage: 0,
      result: []
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //选择
    selectCur(index) {
      this.curIndex = index
    },
    //获取本地购物车
    init() {
      this.pageIndex = 0
      this.totalPage = 0
      this.firstLoad = true
      this.result = []
      this.api_213()
      this.api_221()
    },
    //删除挂单
    delOrderEntry() {
      let that = this
      if (that.result.length == 0) return
      this.$vux.confirm.show({
        title: '确认删除该数据吗',
        onCancel() { },
        onConfirm() {
          that.api_214()
        }
      })
    },
    //恢复挂单
    recoverOrderEntry() {
      let that = this
      this.$vux.confirm.show({
        title: '确认恢复该数据吗',
        onCancel() { },
        onConfirm() {
          that.api_214(true)
        }
      })
    },
    //加载数据
    api_221() {
      let that = this
      //门店
      api.post(api.api_221, api.getSign({
        StoreID: app_g.getPos().store_id,
        PosNo: app_g.getPos().no
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          console.log(res.data.Result)
        }
      })

    },
    //加载数据
    api_213() {
      let that = this
      //是否加载中，是否加载完成
      if (!that.loading && that.pageIndex < that.totalPage || that.firstLoad) {
        that.loading = true
        //如果是第一次加载
        if (that.firstLoad) that.firstLoad = false
        //加载数据
        api.post(api.api_213, api.getSign({
          //门店
          StoreID: app_g.getPos().store_id,
          //每页大小
          Size: that.pageSize,
          //当前页
          Index: that.pageIndex,
          //POS机编号
          PosNo: app_g.getPos().no
        }), function (vue, res) {
          if (res.data.Basis.State == api.state.state_200) {
            //当前页
            that.pageIndex = that.pageIndex + 1
            //总行数
            let totalRow = res.data.Result.totalRow
            //总页数
            that.totalPage = parseInt(totalRow / that.pageSize) + (totalRow % that.pageSize == 0 ? 0 : 1)
            //订单信息
            res.data.Result.orders.forEach((ele, index) => {
              that.result.push(ele)
            })
          }
          //设置加载状态
          that.loading = false
        })
      }
    },
    //删除挂单
    api_214(isRecover) {
      let that = this
      let item = that.result[that.curIndex]
      api.post(api.api_214, api.getSign({
        ID: item.id
      }), function (vue, res) {
        if (res.data.Basis.State == api.state.state_200) {
          let _index = -1
          that.result.forEach((ele, index) => {
            if (ele.id == item.id) {
              _index = index
              return
            }
          })
          that.result.splice(_index, 1)
          //恢复到本地购物车
          if (isRecover) {
            //清空购物车
            app_g.clearShoppingCart()
            item.details.forEach((ele, index) => {
              let tmp = {
                specset: ele.specset,
                sku_name: ele.spec_msg,
                sto_product_id: ele.sto_product_id,
                product_name: ele.product_name,
                product_no: ele.product_no,
                count: ele.count,
                sale_price: ele.unit_price
              }

              //加入购物车
              app_g.setShoppingCart(tmp)
            })

            //跟着页面
            that.$emit('setShoppingCart')
          }
        }
      })
    },
    //页面滚动加载数据
    scroll(e) {
      //隐藏的滚动条高度
      let top = e.currentTarget.scrollTop
      //整个区域的高度（包含隐藏区域）
      let heigth = e.currentTarget.scrollHeight
      //可视区域的高度
      let clientHeight = e.currentTarget.clientHeight
      //旧数据大于当前位置，表示滚动条top向上滚动
      if (this.oldTop < top) {
        //判断是否滚动到底部
        if (heigth - clientHeight - top == 0 && !this.loadding) {
          this.api_213()
        }
      }
      this.oldTop = top
    }
  }
}
</script>
<style lang="scss">
.order-entry {
  .form-1 {
    height: 100%;

    .form-head {
      width: 100%;
      left: 0;
      top: 0;

      .head-item {
        box-sizing: border-box;
        height: 35px;
        line-height: 35px;
        border-right: 1px solid #fff;

        &:last-child {
          border: none;
        }
      }
    }
    .form-body {
      box-sizing: border-box;
      height: 100%;
      padding-top: 35px;

      .body-item {
        position: relative;
        height: 67px;
      }

      .align {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .form-body-wrap {
      height: 100%;
      box-sizing: border-box;
      overflow: auto;
    }
    .w1 {
      width: 10%;
    }
    .w2 {
      width: 25%;
    }
    .w3 {
      width: 5%;
    }
    .w9 {
      width: 25%;
    }
    .w15 {
      width: 15%;
    }

    .w4 {
      width: 100/30 * 5%;
    }
    .w5 {
      width: 100/30 * 25%;
    }

    .w6 {
      width: 100/70 * 25%;
    }
    .w7 {
      width: 100/70 * 10%;
    }
    .w8 {
      width: 100/70 * 15%;
    }

    .left-part {
      height: 100%;
      width: 30%;
      box-sizing: border-box;
      // border-right: 1px solid #ACACAC;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        right: 0px;
        top: 0;
        height: 100%;
        width: 1px;
        background-color: #acacac;
      }

      ul {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .cont {
        width: 200px;
        height: 200px;
        border: 0px;
        overflow-x: hidden;
      }

      .cont::-webkit-scrollbar {
        display: none;
      }

      .row-item {
        border-bottom: 1px solid #acacac;

        &:last-child {
          border-bottom: 0;
        }
        &:first-child {
          border-bottom: 1px solid #acacac;
        }
      }
      .row-item.cur {
        position: relative;

        &:after {
          content: "";
          position: absolute;
          right: -2px;
          top: 0;
          height: 67px;
          width: 4px;
          background-color: #fff;
          z-index: 2;
        }
      }
    }
    .right-part {
      height: 100%;
      width: 70%;
      box-sizing: border-box;

      ul {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .body-item {
        overflow: hidden;
      }
      .body-item__num {
        position: relative;
      }
      .btn-subtract,
      .btn-plus {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .btn-subtract {
        left: 5px;
      }
      .btn-plus {
        right: 5px;
      }
    }
    .status-bar {
      width: 100%;
      height: 54px;
      left: 0;
      bottom: 0;

      .button {
        margin-top: 10px;
        margin-right: 20px;
      }
    }
  }
}
</style>