var https = wx.getStorageSync("https");
Page({

        /**
         * 页面的初始数据
         */
        data: {
                a: 0
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var mobile = options.mobile;
                this.setData({
                        mobile: mobile
                })
                if (mobile == 0) {
                        wx.setNavigationBarTitle({
                                title: "绑定手机号"
                        })
                } else {
                        wx.setNavigationBarTitle({
                                title: "修改手机号"
                        })
                }
        },
        //失去焦点时，获取电话号码
        telBlur: function (e) {
                var telNumber = e.detail.value;
                this.setData({
                        telNumber: telNumber
                })
        },
        //短信验证码
        countTap: function (e) {
                var m_id = wx.getStorageSync("m_id");
                var that = this;
                var num = 60;
                var telNumber = this.data.telNumber;
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
                                                unique_code: mobile == 0 ? "register" : "modify_account"
                                        },
                                        success: function (res) {
                                                var flag = res.data.flag;
                                                //   console.log(res)
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
                                                   //     console.log(res);
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
                var that = this;
                var tel = e.detail.value.input;
                var code_num = e.detail.value.code_num;
                var m_id = wx.getStorageSync("m_id");
                var str = /^[1][3,4,5,7,8,9][0-9]{9}$/;
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
                        var mobile = that.data.mobile;
                        //验证验证码是否正确
                        wx.request({
                                url: https + "Verify/checkVerify",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        account: tel,
                                        verify: code_num,
                                        unique_code: mobile == 0 ? "register" : "modify_account"
                                },
                                success: function (res) {
                                        if (res.data.flag == "success") {
                                                if (mobile == 0) {
                                                 //       console.log("绑定")
                                                        wx.request({
                                                                url: https + "Center/setmobile",
                                                                method: "POST",
                                                                header: {
                                                                        'content-type': 'application/x-www-form-urlencoded'
                                                                },
                                                                data: {
                                                                        m_id: m_id,
                                                                        account: tel,
                                                                        verify: code_num,
                                                                        unique_code: "register"
                                                                },
                                                                success: function (res) {
                                                                        //  console.log(res.data)
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
                                                                                                delta: 1
                                                                                        })
                                                                                }, 1500)
                                                                        }
                                                                }
                                                        })
                                                } else {
                                                   //     console.log("修改", mobile)
                                                        wx.navigateTo({
                                                                url: 'modifyTelNum/modifyTelNum?mobile=' + mobile,
                                                        })
                                                }

                                        } else {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                })
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