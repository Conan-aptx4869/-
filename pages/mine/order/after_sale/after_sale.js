var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https")
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
                var that=this;
                wx.request({
                        url: https +"OrderInfo/orderDetail" ,
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data:{
                                m_id:m_id,
                                order_id: order_id
                        },
                        success:function(res){
                                var goods_list = res.data.data.goods_list;
                                that.setData({
                                        goods_list: goods_list,
                                        order_id: res.data.data.order_id
                                })
                                console.log(res)
                        }
                })
        },


        saleTap: function (e) {
                var type=e.currentTarget.dataset.type;
                var order_id = e.currentTarget.dataset.order_id;
                console.log(e)
                wx.navigateTo({
                        url: 'refunds/refunds?type=' + type+"&order_id="+order_id,
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