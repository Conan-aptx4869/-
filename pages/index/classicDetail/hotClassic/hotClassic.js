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
                var parentId = options.parentId;
                var titleName = options.titleName;

                this.setData({
                        parentId: parentId,
                        titleName: titleName
                })
                var that = this;
                wx.request({
                        url: https + "Goods/getGoodsCate",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                parent_id: parentId
                        },
                        success: function (res) {
                                var list = res.data.data.list;
                                that.setData({
                                        list: list
                                });
                                console.log(res)
                        }

                })
        },

        classicDetail: function (e) {
                var parentId = this.data.parentId;
                // var titleName = this.data.titleName;
                // var pages = getCurrentPages();
                // var prevPage = pages[pages.length - 2];
                // prevPage.setData({
                //         titleName: titleName
                // });
                // wx.navigateBack({
                //         delta: 1
                // })
                var name = e.currentTarget.dataset.name;
                var cate_id = e.currentTarget.dataset.id;
                wx.redirectTo({
                        url: '../classicDetail?name=' + name + "&cate_id=" + cate_id+ "&parentId=" + parentId,
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