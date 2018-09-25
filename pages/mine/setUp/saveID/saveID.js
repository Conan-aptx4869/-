var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

        /**
         * 页面的初始数据
         */
        data: {
                idNum: "填写身份证号以便清关，身份信息保密"
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },
        bindFormSubmit: function (e) {
                var idNum = e.detail.value.input;
                var str = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (idNum == "" || str.test(idNum) == false) {
                        wx.showModal({
                                title: '提示',
                                content: '请正确填写你的身份证号码！',
                        })
                } else {
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2];
                        prevPage.setData({
                                idNum: idNum
                        })

                        wx.request({
                                url: https + "Center/modifyInfo",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        value: idNum,
                                        m_id: m_id,
                                        field: 2
                                },
                                success: function (res) {
                                        console.log(res)
                                        var title = res.data.message
                                        wx.showToast({
                                                title: title,
                                                icon: "sucess"
                                        })
                                }
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