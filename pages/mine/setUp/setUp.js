var https = wx.getStorageSync("https");
Page({
        /**
         * 页面的初始数据
         */
        data: {
                avatarSrc: "/imgs/icon/avatar.png",
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var https = wx.getStorageSync("https");
                var m_id = wx.getStorageSync("m_id");
                var that = this;
                var name = options.name;
                var idNum = options.indNum;
                var telNumber = options.telNumber;
                var mail = mail;
                if (name == undefined || idNum == undefined) {
                        this.setData({
                                name: "起个名字吧",
                                idNum: "填写身份证号以便清关，身份信息保密",
                                telNumber: "请输入手机号",
                                mail: "输入邮箱",
                        })
                } else {
                        this.setData({
                                nickname: name,
                                idNum: idNum,
                                mail: mail,
                                telNumber: telNumber
                        })
                };
                wx.request({
                        url: https + "Center/getInfo",
                        data: {
                                m_id: m_id
                        },
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                                var data = res.data.data
                                that.setData({
                                        avatarSrc: data.head,
                                        name: data.nickname,
                                        idNum: data.idcard_num,
                                        mail: data.email,
                                        telNumber: data.mobile
                                })
                                //    console.log(res)
                                        var mobile=res.data.data.mobile;
                                    //    console.log(mobile)
                                        that.setData({
                                                mobile:mobile
                                        })
                        }

                })

        },

        nameSaveTap: function () {
                wx.navigateTo({
                        url: 'saveName/saveName',
                })
        },
        idSaveTap: function () {
                wx.navigateTo({
                        url: 'saveID/saveID',
                })
        },
        telNumberTap: function () {
                var mobile=this.data.mobile;
                wx.navigateTo({
                        url: 'saveTelNum/saveTelNum?mobile=' + mobile,
                })
        },
        mailTap: function () {
                wx.navigateTo({
                        url: 'saveMail/saveMail',
                })
        },

        //上传头像
        uploadImg: function () {
                var m_id = wx.getStorageSync("m_id");
                var that = this;
                wx.chooseImage({
                        count: 1,
                        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者有
                        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
                        success: function (res) {
                                // 获取成功,将获取到的地址赋值给临时变量
                                var tempFilePaths = res.tempFilePaths;
                                wx.uploadFile({
                                        url: https + "System/upload",
                                        filePath: tempFilePaths[0],
                                        name: "head",
                                        method: "POST",
                                        header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        success: function (res) {
                                                var data = JSON.parse(res.data);
                                                var avatarSrc = data.data.list[0].abs_url;
                                                var avaId = data.data.list[0].id;
                                                wx.request({
                                                        url: https + "Center/modifyHead",
                                                        data: {
                                                                m_id: m_id,
                                                                id: avaId
                                                        },
                                                        method: "POST",
                                                        header: {
                                                                'content-type': 'application/x-www-form-urlencoded'
                                                        },
                                                        success: function () {
                                                                that.setData({
                                                                        avatarSrc: avatarSrc
                                                                })
                                                                wx.showToast({

                                                                        title: '正在上传，请稍后',
                                                                        icon: "loading",
                                                                        success: function () {
                                                                                wx.hideToast();

                                                                        }
                                                                })

                                                        }
                                                })
                                        },

                                });
                        }
                });

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