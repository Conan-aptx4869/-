var https = wx.getStorageSync("https");
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
                var goods_id = options.goods_id;
                this.setData({
                        goods_id: goods_id
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
                var goods_id = this.data.goods_id;
                var page = this.data.page;
                var that = this;
                wx.request({
                        url: https + "Goods/getGoodsComments",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                goods_id: goods_id,
                                p: page
                        },
                        success: function (res) {
                                var list = res.data.data.list;
                                for (let i = 0; i < list.length; i++) {
                                        var star = 5 - Number(list[i].level);
                                        list[i].level = Number(list[i].level);
                                        list[i].unlevel = star;
                                }
                                var old_list = that.data.old_list;
                                var lists = old_list.concat(list);
                                that.setData({
                                        list: lists
                                })
                                if (list == false) {
                                        that.setData({
                                                noBody: true
                                        })

                                }
                                console.log(res)
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