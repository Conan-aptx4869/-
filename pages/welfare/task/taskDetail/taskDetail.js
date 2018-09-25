var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https");
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
                var a_id = options.a_id;
                var that = this;
                wx.request({
                        url: https + "AnswerTask/detail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                a_id: a_id
                        },
                        success: function (res) {
                                var data = res.data.data;
                                that.setData({
                                        answer:data.answer,
                                        msg:data.msg,
                                        periods: data.periods,
                                        pictures: data.pictures,
                                        msg_button: data.msg_button,
                                        is_luck: data.is_luck,
                                        notice: data.notice,
                                        licky_list: data.licky_list
                                });
                                console.log(data)
                        }
                })
        },
        ruleTap: function () {
                wx.navigateTo({
                        url: '../taskRule/taskRule',
                })
        },

        //跳转到首页
        homrPageTap:function(){
                var flag = this.data.msg_button;
                if(flag=="去购物"){
                       wx.switchTab({
                               url: '../../../index/index',
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