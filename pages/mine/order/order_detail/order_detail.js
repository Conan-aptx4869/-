var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

        /**
         * 页面的初始数据
         */
        data: {

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var order_id = options.order_id;
                var status = options.status;
                var that = this;
                wx.request({
                        url: https + "OrderInfo/orderDetail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                order_id: order_id
                        },
                        success: function (res) {
                                var data = res.data.data;
                                that.setData({
                                        order_id: data.order_id,
                                        //订单状态
                                        status: status,


                                        order_sn: data.order_sn,
                                        status_name: data.status_name,
                                        goods_list: data.goods_list,
                                        //商品金额
                                        goods_amounts: data.goods_amounts,
                                        discount_msg: data.discount_msg,
                                        discount_card_amounts: data.discount_card_amounts,
                                        freight: data.freight,

                                        pay_amounts: data.pay_amounts,
                                        address: data.address,

                                        province_name: data.province_name,
                                        city_name: data.city_name,
                                        area_name: data.area_name,
                                        mobile: data.mobile,
                                        consignee: data.consignee,


                                })
                                console.log(res)
                        }
                })
        },


        //操作
        madeTap: function (e) {
                var order_id = e.currentTarget.dataset.order_id;
                var type = e.currentTarget.dataset.type;
                if (type == "a") {
                        //取消订单
                        wx.request({
                                url: https + "OrderInfo/applyRefund",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        order_id: order_id,
                                        reason:"不想要了",
                                        action_sign:7
                                },
                                success: function (res) {
                                        wx.showToast({
                                                title: res.data.message,
                                                icon: "success",
                                                success: function () {
                                                        wx.showToast({
                                                                title: res.data.message,
                                                                icon: "success",
                                                                success: function (res) {
                                                                        setTimeout(function () {
                                                                                wx.navigateBack({
                                                                                        delta: 1
                                                                                })
                                                                        }, 1500)

                                                                }
                                                        })
                                                }
                                        });


                                        console.log(res)
                                }
                        })
                } else if (type == "b") {
                        //确认收货
                        wx.request({
                                url: https + "OrderInfo/signFor",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        order_id: order_id
                                },
                                success: function (res) {
                                        wx.showToast({
                                                title: res.data.message,
                                                icon: "success",
                                                success: function (res) {
                                                        setTimeout(function () {
                                                                wx.navigateBack({
                                                                        delta: 1
                                                                })
                                                        }, 1500)

                                                }
                                        })
                                }
                        })
                } else if (type == "c") {
                        //申请售后
                        wx.navigateTo({
                                url: '../after_sale/after_sale?order_id=' + order_id,
                        })
                } else if (type == "d") {
                        //再次购买
                        wx.navigateTo({
                                url: '',
                        })
                } else if (type == "e" || type == "f") {
                        //取消换货 和退款
                        wx.request({
                                url: https + "OrderInfo/cancelRefund",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        order_id: order_id
                                },
                                success: function (res) {
                                        wx.showToast({
                                                title: res.data.message,
                                                icon: "success",
                                                success: function (res) {
                                                        setTimeout(function () {
                                                                wx.navigateBack({
                                                                        delta: 1
                                                                })
                                                        }, 1500)

                                                }
                                        })
                                }
                        })
                } else if (type == "g") {
                        //去支付(进入支付页面)
                        wx.navigateTo({
                                url: '../../../details/placeOrder/payType/payType?order_id=' + order_id,
                        })
                }
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

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

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