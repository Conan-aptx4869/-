var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

        /**
         * 页面的初始数据
         */
        data: {
                type: "Y",
                page: 1,
                noBody: false,
                old_list: []
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },

        //tab切换


        ruleTap: function () {
                wx.navigateTo({
                        url: 'rule/rule',
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
                var that = this;
                var page = this.data.page;
                var type = this.data.type;
                
                //可用(默认)
                wx.request({
                        url: https + "Center/myCoupons",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                p: page,
                                type: type
                        },
                        success: function (res) {
                                var list = res.data.data.list;
                                var data = res.data.data;
                                var old_list = that.data.old_list;
                                var lists = old_list.concat(list);
                                var unTatal = data.Total_all - data.total;                           
                                that.setData({
                                        list: lists,
                                        unTatal: unTatal,
                                        total: data.total
                                });
                                if (list == false) {
                                        that.setData({
                                                noBody: true
                                        })
                                }
                            //    console.log(res)
                        },
                });

        },

        //切换
        tab: function (e) {
                var type = e.currentTarget.dataset.type;
                var that = this;
                this.setData({
                        page: 1
                });
                var page = this.data.page;
                wx.request({
                        url: https + "Center/myCoupons",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                p: page,
                                type: type == "Y" ? "Y" : "N"
                        },
                        success: function (res) {
                                var list = res.data.data.list;
                                
                                that.setData({
                                        list: list,
                                        type: type
                                })

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