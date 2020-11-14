<template>
    <div class="order-list-2 h100">
        <div class="form-order rel border-box">
            <div class="order-tit abs text-white tac list-inlineblock">
                <div class="f-item item-name bg-gray">品名</div>
                <div class="f-item item-price bg-gray">单价</div>
                <div class="f-item item-num bg-gray">数量</div>
            </div>
            <div class="order-con">
                <ul class="font-size-small list-order">
                    <li class="list-inlineblock tac item-order" v-for="(item,index) in list" :key="index">
                        <div class="f-item hidden item-name ellipsis">{{item.name}}</div>
                        <div class="f-item hidden item-price">{{item.price}}</div>
                        <div class="f-item hidden item-num">{{item.num}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="pay-bar border-box tac rel">
            <div class="list-inlineblock account-bar text-gray abs w100 top0 left0">
                <div class="f-item">数量： 0</div>
                <div class="f-item">总计： ¥0</div>
                <div class="f-item">找零： ¥0</div>
            </div>
            <div class="h100 rel">
                <div class="pay-tit list-inlineblock bg-main text-white abs w100">
                    <div class="f-item w1">序号</div>
                    <div class="f-item w2">支付方式</div>
                    <div class="f-item w1">金额</div>
                </div>
                <div class="pay-con h100 border-box"><div class="h100 scroll-y">
                    <ul class="text-gray">
                        <li class="list-inlineblock">
                            <div class="f-item w1">1</div>
                            <div class="f-item w2">支付宝</div>
                            <div class="f-item w1">20.00</div>
                        </li>
                        <li class="list-inlineblock">
                            <div class="f-item w1">2</div>
                            <div class="f-item w2">现金</div>
                            <div class="f-item w1">20.00</div>
                        </li>
                    </ul>
                </div></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list:[{
                name:"摩卡咖啡",
                price:"135.00",
                num:"11"
            },{
                name:"摩卡咖啡2",
                price:"15.00",
                num:"11"
            },{
                name:"摩卡咖啡34",
                price:"135.00",
                num:"11"
            },{
                name:"摩卡咖啡56",
                price:"35.00",
                num:"11"
            },{
                name:"摩卡咖啡78",
                price:"15.00",
                num:"11"
            },{
                name:"摩卡咖啡",
                price:"135.00",
                num:"11"
            },{
                name:"摩卡咖啡",
                price:"35.00",
                num:"11"
            }]
        }
    },
}
</script>

<style lang="scss">
.order-list-2{
    
    .form-order{
        padding: 32px 0 0 0;
        height: 70%;

        .item-name{
            width: 60%;
            box-sizing: border-box;
        }
        .item-price,.item-num{
            width: 20%;
            box-sizing: border-box;
        }
        .order-tit{
            .item-name,.item-price,.item-num{border-right: 2px solid #fff;}
            .item-price,.item-num,.item-operate{
            height: 28px;
            line-height: 28px;
            }
        }
        .order-tit{
            height: 28px;
            line-height: 28px;
            width: 100%;
            top: 4px;
            left: 0;
        }
        .order-con{
            height: 100%;
        }
        .list-order{
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;
            .item-order{
                height: 40px;
                line-height: 40px;

                &:nth-child(2n){
                    background-color: #f0f0f0;
                }
            }
        }
    }
    .account-bar{
        height: 40px;
        line-height: 40px;
        text-align: center;

        .f-item{width: 33.33%;}
    }
    .pay-bar{
        height: 30%;
        padding-top: 40px;
    }
    .w1{width: 20%;}
    .w2{width: 60%;}

    .pay-tit{
        height: 41px;
        line-height: 41px;
        top: 0;
        left: 0;
    }
    .pay-con{
        padding-top: 41px;
        li{
            height: 40px;
            line-height: 40px;
        }
    }
}
</style>

