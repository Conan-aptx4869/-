Page({

        /**
         * 页面的初始数据
         */
        data: {
                a:0
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var mobile = options.mobile;
                this.setData({
                        mobile: mobile
                })
        },

        telBlur: function (e) {
                var telNumber = e.detail.value;
                this.setData({
                        telNumber: telNumber
                })
        },
        //短信验证码
        countTap: function (e) {
                var https = wx.getStorageSync("https");
                var m_id = wx.getStorageSync("m_id");
                var that = this;
                var num = 60;
                //新号码
                var telNumber = this.data.telNumber;

                //老号码
                var mobile = this.data.mobile;
                var str = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                if (telNumber == "" || str.test(telNumber) == false) {
                        wx.showModal({
                                title: '提示',
                                content: '请正确填写手机号码！',
                        })
                } else {
                        var a = this.data.a;
                        a++;
                        this.setData({ a: a })
                        if (a == 1) {
                                // 获验证码
                                wx.request({
                                        url: https + "Verify/getVerify",
                                        method: "POST",
                                        header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: {
                                                account: telNumber,
                                                unique_code:  "register"
                                        },
                                        success: function (res) {
                                                var flag = res.data.flag;
                                                 
                                                if (flag == "success") {
                                                        wx.showToast({
                                                                title: res.data.message,
                                                                icon: "success"
                                                        });
                                                        var timer = setInterval(function () {
                                                                num--;
                                                                if (num == 0) {
                                                                        that.setData({
                                                                                value: ""
                                                                        });
                                                                        clearInterval(timer)
                                                                        that.setData({
                                                                                a: 0
                                                                        });
                                                                } else {
                                                                        that.setData({
                                                                                value: num + "s后重新获取"
                                                                        })
                                                                }
                                                        }, 1000)
                                                        console.log(res);
                                                } else {
                                                        wx.showModal({
                                                                title: '提示',
                                                                content: res.data.message,
                                                        })
                                                        that.setData({
                                                                a: 0
                                                        });
                                                }
                                        }
                                })
                        } else {
                                wx.showModal({
                                        title: '提示',
                                        content: '您已经获取过验证码，现在无法获取...',
                                })
                        }
                }

        },

        //保存
        bindFormSubmit: function (e) {
                var https = wx.getStorageSync("https");
                var that = this;
                var tel = e.detail.value.input;
                var code_num = e.detail.value.code_num;
                var m_id = wx.getStorageSync("m_id");
                var str = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                var mobile = this.data.mobile;
                if (tel == "" || str.test(tel) == false) {
                        wx.showModal({
                                title: '提示',
                                content: '请正确填写手机号码！',
                        })
                } else if (code_num == "") {
                        wx.showModal({
                                title: '提示',
                                content: '请填写验证码',
                        })
                } else {
                        wx.request({
                                url: https + "Center/modifyAccount",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        account: mobile,
                                        new_account:tel,
                                        verify: code_num,
                                        unique_code: "modify_account"
                                },
                                success: function (res) {
                                        console.log(res.data)
                                        if (res.data.flag == "error") {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                })
                                        } else {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                })
                                                setTimeout(function () {
                                                        var pages = getCurrentPages();
                                                        var prevPage = pages[pages.length - 2];
                                                        prevPage.setData({
                                                                telNumber: tel
                                                        })
                                                        wx.navigateBack({
                                                                delta: 2
                                                        })
                                                }, 1500)
                                        }
                                }
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