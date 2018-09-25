var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https")
Page({
        /**
         * 页面的初始数据
         */
        data: {
                num: 4,//后端给的分数,显示相应的星星
                one_1: '',
                two_1: '',
                one_2: 0,
                two_2: 5,


                images: [],
                uploadedImages: [],
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var order_id = options.order_id;
                var idx = options.idx;
                var that = this;
                wx.request({
                        url: https + "OrderInfo/orderDetail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                order_id: order_id,
                                m_id: m_id
                        },
                        success: function (res) {
                                var data = res.data.data.goods_list[idx];
                                that.setData({
                                        order_id: order_id,
                                        goods_name: data.goods_name,
                                        goods_attr_desc: data.goods_attr_desc,
                                        cover: data.cover,
                                        goods_id: data.goods_id
                                });
                                console.log(res)
                        }
                })
        },
        in_xin: function (e) {
                var in_xin = e.currentTarget.dataset.in;
                var one_2;
                if (in_xin === 'use_sc2') {
                        one_2 = Number(e.currentTarget.id);
                } else {
                        one_2 = Number(e.currentTarget.id) + this.data.one_2;
                }
                this.setData({
                        one_2: one_2,
                        two_2: 5 - one_2
                })
        },

        chooseImage: function () {
                var that = this;
                var images = that.data.images;
                // console.log(images.length)
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
                //console.log(this.data.images);
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
        bindFormSubmits: function (e) {
                var that = this;
                var order_id = e.detail.target.dataset.order_id;
                var images = e.detail.target.dataset.images;
                //  console.log(images)
                //星级
                var star = e.detail.target.dataset.star;
                var goods_id = e.detail.target.dataset.goods_id;
                //评价内容
                var content = e.detail.value.textarea;
                //存放图片的数组
                var imgSrc = [];

                var successUp = 0;
                var failUp = 0;
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
                if (star == 0) {
                        wx.showModal({
                                title: '提示',
                                content: '您还没有对商品进行评级',
                        })
                } else if (content == "") {
                        wx.showModal({
                                title: '提示',
                                content: '您还没有对商品进行评价',
                        })
                } else {
                        if (images === []) {
                                console.log("aaa")

                        } else {
                                //存储promise对象的数组
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
                                                                        formData: {
                                                                                save_path: 'comment'
                                                                        },
                                                                        filePath: images[i],
                                                                        name: "head",
                                                                        success: function (res) {
                                                                                //可以对res进行处理，然后resolve返回
                                                                                var data = JSON.parse(res.data);
                                                                                successUp++;//已成功上传的图片数目;
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
                                                        wx.hideLoading()
                                                        var imgs_list = flatten(result);
                                                        var obj = {};
                                                        var data = [];
                                                        obj["goods_id"] = goods_id;
                                                        obj["level"] = star;
                                                        obj["content"] = content;
                                                        data.push(obj);
                                                        console.log(imgs_list)
                                                        var picture_ids = {}
                                                        for (let i = 0; i < imgs_list.length; i++) {
                                                                picture_ids["file_" + goods_id + "_" + (i + 1)] = { "id": imgs_list[i].id }
                                                        }

                                                        var pic = JSON.stringify(picture_ids);
                                                        var contents = JSON.stringify(data);
                                                        //提交订单
                                                        wx.request({
                                                                url: https + "OrderInfo/comment",
                                                                method: "POST",
                                                                header: {
                                                                        'content-type': 'application/x-www-form-urlencoded'
                                                                },
                                                                data: {
                                                                        m_id: m_id,
                                                                        order_id: order_id,
                                                                        data: contents,
                                                                        picture_ids: pic,
                                                                        is_pic: imgs_list == false ? "" : 1
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