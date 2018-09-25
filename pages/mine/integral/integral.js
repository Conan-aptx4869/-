// pages/mine/integral/integral.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
                page: 1,
                noBody: false,
                old_list: []
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
               
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
                var https = wx.getStorageSync("https");
                var m_id = wx.getStorageSync("m_id");
                var page = this.data.page;
                var that = this;
                wx.request({
                        url: https + "Center/myIntegrals",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: "POST",
                        data: {
                                m_id: m_id,
                                p: page
                        },
                        success: function (res) {
                                var integral = res.data.data.integral;
                                var list = res.data.data.list;
                                var old_list = that.data.old_list;
                                var lists = old_list.concat(list);
                                that.setData({
                                        integral: integral,
                                        list: lists
                                });
                                if (list == false) {
                                        that.setData({
                                                noBody: true
                                        })

                                }
                        }
                })
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
                var lists = this.data.list;
                var page = this.data.page;
                page++;
                this.setData({
                        old_list: lists,
                        page: page
                })
                this.onShow();
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})