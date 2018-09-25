var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({
        /**
         * 页面的初始数据
         */
        data: {
                showModal: false
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var goods_id = options.goods_id;
                // 默认地址 id
                var adr_id = wx.getStorageSync("adr_id");
                var that = this;
                this.setData({
                        goods_id: goods_id,
                        adr_id: adr_id
                })
                wx.request({
                        url: https + "IntegralMall/confirmOrder",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                goods_id: goods_id,
                                adr_id: adr_id,
                        },
                        success: function (res) {
                                var data = res.data.data;
                                if (res.data.flag == "error") {
                                        wx.showModal({
                                                title: '提示',
                                                content: res.data.message,
                                                success: function (res) {
                                                        if (res.confirm) {
                                                                wx.navigateBack({
                                                                        delta: 1
                                                                })
                                                        } else if (res.cancel) {
                                                                console.log('用户点击取消')
                                                        }
                                                }
                                        })
                                } else {
                                        that.setData({
                                                province_name: data.address.province_name,
                                                city_name: data.address.city_name,
                                                area_name: data.address.area_name,
                                                address: data.address.address,
                                                contacts: data.address.contacts,

                                                //商品
                                                goods_name: data.goods.goods_name,
                                                cover: data.goods.cover,
                                                price: data.goods.price
                                        })
                                }
                                //    console.log(res)
                        }
                })
        },

        //选择收货地址
        selectAddressTap: function () {
                wx.navigateTo({
                        url: '../../../mine/address/address',
                })
        },
        //立即兑换
        nowTap: function (e) {
                var that = this;
                var adr_id = this.data.adr_id;
                var goods_id = this.data.goods_id;
                var price = that.data.price;
                wx.showModal({
                        title: '确定兑换？',
                        content: '您将消耗' + price + '积分',
                        success: function (res) {
                                if (res.confirm) {
                                        wx.request({
                                                url: https + "IntegralMall/exchange",
                                                method: "POST",
                                                header: {
                                                        'content-type': 'application/x-www-form-urlencoded'
                                                },
                                                data: {
                                                        m_id: m_id,
                                                        goods_id: goods_id,
                                                        adr_id: adr_id
                                                },
                                                success: function (res) {
                                                        that.setData({
                                                                showModal: true,
                                                                message: res.data.message,
                                                                advert: res.data.data.advert
                                                        })
                                                }
                                        })
                                }
                        }
                })
        },


        /* 弹出框蒙层截断touchmove事件*/
        preventTouchMove: function () {
        },
        /**
         * 隐藏模态对话框
         */
        hideModal: function () {
                this.setData({
                        showModal: false
                });
        },
        /**对话框确认按钮点击事件*/
        onConfirm: function () {
                this.hideModal();
                wx.navigateBack({
                        delta: 1
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