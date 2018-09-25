var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
var article = require("../../../wxParse/wxParse.js");
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
                var that = this;
                wx.request({
                        url: https + "Article/getArticles",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                art_cate_id: 9
                        },
                        success: function (res) {
                                var list = res.data.data;
                                that.setData({
                                        list: list
                                });
                               
                        }
                })
        },


        //帮助详情页
        helpDetail: function (e) {
                var art_id = e.currentTarget.dataset.artid;
                // wx.navigateTo({
                //         url: 'helpDetail/helpDetail?art_id=' + art_id
                // })
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