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

        },
        bindFormSubmit: function (e) {
                var name = e.detail.value.input;
                var str = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$/;
                if (name == "" || str.test(name) == false) {
                        wx.showModal({
                                title: '提示',
                                content: '请正确填写你的中文名字！',
                        })
                } else {

                        wx.request({
                                url: https + "Center/modifyInfo",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        value: name,
                                        m_id: m_id,
                                        field: 1
                                },
                                success: function (res) {
                                        var title = res.data.message
                                        wx.showToast({
                                                title: title,
                                                icon: "sucess"
                                        })
                                }
                        })
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2];
                        prevPage.setData({
                                name: name
                        })
                        setTimeout(function () {
                                wx.navigateBack({
                                        delta: 1
                                })
                        }, 1500)

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