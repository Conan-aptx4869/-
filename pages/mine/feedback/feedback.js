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

        bindTextAreaBlur: function (e) {
                // console.log(e.detail.value)
        },
        bindFormSubmit: function (e) {
                var contact = e.detail.value.input;
                var content = e.detail.value.textarea;
                if (content == "") {
                        wx.showModal({
                                title: '提示',
                                content: '您还没有写您的意见呢！',
                        })
                } else if (contact == "") {
                        wx.showModal({
                                title: '提示',
                                content: '请输入您的有效联系方式！',
                        })
                } else {
                        wx.request({
                                url: https + "System/feedback",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        contact: contact,
                                        content: content
                                },
                                success: function (res) {
                                        if (res.data.flag == "success") {
                                                setTimeout(function () {
                                                        wx.showToast({
                                                                title: '提交成功',
                                                                icon: "success",
                                                                success: function () {
                                                                        wx.navigateBack({
                                                                                delta: 1
                                                                        })
                                                                }
                                                        })
                                                }, 1500)

                                        }
                                }

                        })
                }

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