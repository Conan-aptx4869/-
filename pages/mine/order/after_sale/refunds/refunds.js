var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https");
Page({

        /**
         * 页面的初始数据
         */
        data: {
                images: [],
                uploadedImages: [],
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var type = options.type;
                var order_id = options.order_id;
                if (type == "hh") {
                        wx.setNavigationBarTitle({
                                title: '申请换货',
                        })
                } else {
                        wx.setNavigationBarTitle({
                                title: '申请退款'
                        })
                }
                var that = this;
                wx.request({
                        url: https + "OrderInfo/orderDetail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                order_id: order_id
                        },
                        success: function (res) {
                                var goods_list = res.data.data.goods_list;
                                that.setData({
                                        order_id: order_id,
                                        type: type,
                                        goods_list: goods_list
                                })
                                console.log(goods_list)
                        }
                });

                //换货原因
                wx.request({
                        url: https + "System/getReasons",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                flag: type == "hh"?"h":"t"
                        },
                        success: function (res) {
                               var list=res.data.data.list;
                               that.setData({
                                       list:list
                               })
                                console.log(res)
                        }
                });
                

        },
        chooseImage: function () {
                var that = this;
                var images = that.data.images;
                if (images.length >= 4) {
                        wx.showModal({
                                title: '提示',
                                content: '您最多只能上传4张',
                        })
                } else {
                        // 选择图片
                        wx.chooseImage({
                                count: 4, // 默认9
                                sizeType: ['compressed'],
                                sourceType: ['album', 'camera'],
                                // 可以指定来源是相册还是相机，默认二者都有
                                success: function (res) {
                                        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                                        var tempFilePaths = res.tempFilePaths;

                                        that.setData({
                                                images: that.data.images.concat(tempFilePaths)
                                        });
                                }
                        })
                }

        },
        // 图片预览
        previewImage: function (e) {       
                var current = e.target.dataset.src
                wx.previewImage({
                        current: current,
                        urls: this.data.images
                })
        },
        delete: function (e) {
                var that = this;
                var index = e.currentTarget.dataset.index;
                var images = that.data.images;
                images.splice(index, 1);
                that.setData({
                        images: images
                });
        },

        //提交
        formSubmit: function (e) {
                var input = e.detail.value.input;
                var order_id = this.data.order_id;
                var type = this.data.type;
                var that = this;
                var radioGroup = e.detail.value.radioGroup
                var reason = radioGroup + input;

                var images = this.data.images;
                function flatten(array) {
                        var result = [];
                        var toStr = Object.prototype.toString;
                        for (var i = 0; i < array.length; i++) {
                                var element = array[i];
                                if (toStr.call(element) === "[object Array]") {
                                        result = result.concat(flatten(element));
                                }
                                else {
                                        result.push(element);
                                }
                        }
                        return result;
                }
                if (radioGroup == "") {
                        wx.showModal({

                                title: '提示',
                                content: type == 'tk' ? '您还没有填写退款原因' : '您还没有填写换货原因',
                        })
                } else if (input == "") {
                        wx.showModal({
                                title: '提示',
                                content: type == 'hh' ? '您还没有填写已寄出的快递单号' : '您还没有填写退款原因',
                        })
                } else {
                        let promiseArr = [];
                        wx.showLoading({
                                title: '正在上传',
                                success: function (res) {
                                        for (var i = 0; i < images.length; i++) {
                                                let promise = new Promise((resolve, reject) => {
                                                        //微信图片上传
                                                        wx.uploadFile({
                                                                url: https + 'System/upload',
                                                                method: "POST",
                                                                header: {
                                                                        'content-type': 'application/x-www-form-urlencoded'
                                                                },

                                                                filePath: images[i],
                                                                name: "head",
                                                                success: function (res) {
                                                                        //可以对res进行处理，然后resolve返回
                                                                        var data = JSON.parse(res.data);
                                                                        resolve(data.data.list);
                                                                },
                                                                fail: function (error) {
                                                                        reject(error);
                                                                },
                                                                complete: function (res) {
                                                                },
                                                        })
                                                });
                                                promiseArr.push(promise)

                                        }

                                        //评价内容的参数
                                        Promise.all(promiseArr).then((result) => {
                                                wx.hideLoading();
                                                var pic = flatten(result);
                                                var picArr = [];
                                                for (let i = 0; i < pic.length; i++) {
                                                        picArr.push(pic[i].id)
                                                }
                                                var picStr = picArr.join(",");
                                                console.log(picStr)
                                                //提交订单
                                                wx.request({
                                                        url: https + "OrderInfo/applyRefund",
                                                        method: "POST",
                                                        header: {
                                                                'content-type': 'application/x-www-form-urlencoded'
                                                        },
                                                        data: {
                                                                m_id: m_id,
                                                                order_id: order_id,
                                                                //退换货原因
                                                                reason: type == "hh" ? radioGroup : reason,
                                                                //操作标识符
                                                                action_sign: type == "hh" ? 5 : 7,
                                                                //运单编号
                                                                waybill_number: type == "hh" ? input : "",

                                                                pictures: picStr

                                                        },
                                                        success: function (res) {

                                                                wx.showToast({
                                                                        title: res.data.message,
                                                                        icon: "success",
                                                                        success: function () {
                                                                                wx.hideToast();
                                                                                setTimeout(function () {
                                                                                        wx.navigateBack({
                                                                                                delta: 1
                                                                                        })
                                                                                }, 1500)

                                                                        }
                                                                })

                                                                console.log(res)
                                                        }
                                                })

                                        })
                                },

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