var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

        /*
         * 页面的初始数据
         */
        data: {

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var orderid = options.orderid;
                var that = this;
                wx.request({
                        url: https + "IntegralMall/integralOrderDetail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                order_id: orderid
                        },
                        success: function (res) {
                                var data = res.data.data;
                                that.setData({
                                        pay_time: data.pay_time,
                                        price: data.price,
                                        goods_id: data.goods_id,
                                        goods_type: data.goods_type,

                                        //优惠券
                                        face_value: data.face_value,
                                        use_condition: data.use_condition,
                                        effective_date: data.effective_date,
                                        invalid_date: data.invalid_date,
                                        can_use: data.can_use,
                                        desc: data.desc,

                                        //商品
                                        goods_name: data.goods_name,
                                        cover: data.cover,
                                        consignee: data.consignee,
                                        province_name: data.province_name,
                                        city_name: data.city_name,
                                        area_name: data.area_name,
                                        address: data.address,
                                        mobile: data.mobile,
                                        address_tag: data.address_tag,
                                        number: data.number
                                })
                                console.log(res)
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