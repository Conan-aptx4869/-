var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({
        /* 页面的初始数据*/
        data: {

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var adr_id = wx.getStorageSync("adr_id")
                if (adr_id == undefined) {
                        wx.showModal({
                                title: '提示',
                                content: '您还没有填写收货地址，先去填写吧',
                        })
                } else {
                        var cart_id = options.cart_id;
                        var that = this;
                        console.log(cart_id)
                        wx.request({
                                url: https + "Flow/confirmOrder",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        adr_id: adr_id,
                                        cart_ids: cart_id
                                },
                                success: function (res) {
                                        var address = res.data.data.address;
                                        var data = res.data.data;
                                        that.setData({
                                                cart_id: cart_id,
                                                address: address.address,
                                                contacts: address.contacts,
                                                province_name: address.province_name,
                                                city_name: address.city_name,
                                                area_name: address.area_name,

                                                //商品列表
                                                goods_list: data.goods_list,

                                                //积分
                                                available_integral: data.integral_info.available_integral,
                                                integral_ded_amounts: data.integral_info.integral_ded_amounts,

                                                //金额
                                                goods_amounts: data.goods_amounts,
                                                discount_amounts: data.discount_amounts,
                                                freight: data.freight,
                                                order_amounts: data.order_amounts,
                                                pay_amounts: data.pay_amounts

                                        })
                                        console.log(res)
                                }
                        })
                }

        },


        radioChange: function (e) {
                var type = e.detail.value;
                var that = this;
                var cart_id = this.data.cart_id;
                console.log(cart_id)
                var selecType;
                if (type == 2) {
                        selecType = 2;
                        this.setData({
                                selecType: selecType
                        })
                        wx.navigateTo({
                                url: 'disCard/disCard?cart_id=' + cart_id,
                        })
                } else if (type == 4) {
                        selecType = 4;
                        this.setData({
                                selecType: selecType
                        })
                        wx.navigateTo({
                                url: 'coupon/coupon',
                        })
                } else {
                        var uer_itg;
                        if (type == 3) {
                                uer_itg = 1;
                                selecType = 3
                                this.setData({
                                        uer_itg: true,
                                        selecType: selecType
                                })
                        } else if (type == 1) {
                                uer_itg = "";
                                selecType = 1;
                                this.setData({
                                        selecType: selecType
                                })
                        };

                        wx.request({
                                url: https + "Flow/confirmOrder",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        cart_ids: cart_id,
                                        uer_itg: uer_itg,
                                },
                                success: function (res) {
                                        var data = res.data.data;
                                        if (res.data.flag = "error" && res.data.message!="" ) {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                })
                                        } else {
                                                that.setData({
                                                        goods_amounts: data.goods_amounts,
                                                        discount_amounts: data.discount_amounts,
                                                        freight: data.freight,
                                                        order_amounts: data.order_amounts,
                                                        pay_amounts: data.pay_amounts
                                                });
                                        }


                                        console.log(res)
                                }
                        })
                }

        },

        //跳转到收货地址
        selectAddressTap: function () {
                wx.navigateTo({
                        url: '../../mine/address/address',
                })
        },

        //提交订单
        bindFormSubmit: function (eve) {
                var that = this;
                var cart_id = this.data.cart_id;

                var remark = eve.detail.value.textarea;
                var adr_id = wx.getStorageSync("adr_id");
                //折扣卡
                var cardNum = eve.detail.target.dataset.cardnum;
                //优惠券
                var m_cpn_id = eve.detail.target.dataset.m_cpn_id;
                //积分
                var uer_itg = eve.detail.target.dataset.uer_itg;
                //选择的优惠方式
                var selecType = this.data.selecType;

                wx.request({
                        url: https + "Flow/submitOrder",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                cart_ids: cart_id,
                                m_id: m_id,
                                adr_id: adr_id,
                                remark: remark == "" ? "" : remark,
                                discount_card_num: selecType == 2 ? cardNum : "",
                                uer_itg: selecType == 3 ? 1 : "",
                                m_cpn_id: selecType == 4 ? m_cpn_id : "",
                        },
                        success: function (res) {
                                var order_id = res.data.data.order_id;
                                if (res.data.flag == "success") {
                                        wx.navigateTo({
                                                url: 'payType/payType?order_id=' + order_id
                                        })
                                } else {
                                        wx.showModal({
                                                title: '提示',
                                                content: res.data.message,
                                        })
                                }
                                console.log(res);
                        }
                })

        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                var cart_id = this.data.cart_id;
                var adr_id = wx.getStorageSync("adr_id");
                var that = this;
                console.log(cart_id);

                // wx.request({
                //         url: https + "Flow/confirmOrder",
                //         method: "POST",
                //         header: {
                //                 'content-type': 'application/x-www-form-urlencoded'
                //         },
                //         data: {
                //                 m_id: m_id,
                //                 adr_id: adr_id,
                //                 cart_ids: cart_id
                //         },
                //         success: function (res) {
                //                 var address = res.data.data.address;
                //                 var data = res.data.data;
                //                 that.setData({
                //                         cart_id: cart_id,
                //                         address: address.address,
                //                         contacts: address.contacts,
                //                         province_name: address.province_name,
                //                         city_name: address.city_name,
                //                         area_name: address.area_name,

                //                         //商品列表
                //                         goods_list: data.goods_list,

                //                         //积分
                //                         available_integral: data.integral_info.available_integral,
                //                         integral_ded_amounts: data.integral_info.integral_ded_amounts,

                //                         //金额
                //                         goods_amounts: data.goods_amounts,
                //                         discount_amounts: data.discount_amounts,
                //                         freight: data.freight,
                //                         order_amounts: data.order_amounts,
                //                         pay_amounts: data.pay_amounts

                //                 })
                //                 console.log(res)
                //         }
                // })
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },
        onPageScroll:function(res){ 
                // if (res.scrollTop>100){
                //         console.log("触发元素")
                // }
        },
        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})