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
                var cart_id = options.cart_id;
                this.setData({
                        cart_id: cart_id
                })
        },
        bindFormSubmit: function (e) {
                var cardNum = e.detail.value.input;
                if (cardNum == "") {
                        wx.showModal({
                                title: '提示',
                                content: '您还没有填写折扣卡号，确定要离开？',
                                success: function (res) {
                                        if (res.confirm) {
                                                wx.navigateBack({
                                                        delta: 1
                                                })
                                        }
                                }
                        })
                } else {
                        var cart_id = this.data.cart_id;
                        //获取折扣卡号后，刷新商品金额数据
                        wx.request({
                                url: https + "Flow/confirmOrder",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        discount_card_num: cardNum,
                                        cart_ids: cart_id
                                },
                                success: function (res) {
                                        if (res.data.flag == "error") {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                        success:function(res){
                                                                if (res.confirm) {
                                                                       
                                                                }
                                                        }
                                                })
                                        } else {
                                                var data = res.data.data;
                                                var pages = getCurrentPages();
                                                var prevPage = pages[pages.length - 2];
                                               
                                                prevPage.setData({
                                                        cardNum: cardNum,
                                                        goods_amounts: data.goods_amounts,
                                                        discount_amounts: data.discount_amounts,
                                                        freight: data.freight,
                                                        order_amounts: data.order_amounts,
                                                        pay_amounts: data.pay_amounts
                                                });
                                        
                                                wx.navigateBack({
                                                        delta: 1
                                                })
                                        }
                                        console.log(res)
                                        
                                }

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