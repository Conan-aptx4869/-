var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
var wxParse = require("../../../wxParse/wxParse.js");
Page({

        /* 页面的初始数据*/
        data: {
                //所有图片的高度
                imgheights: [],
                //图片宽度
                imgwidth: 750,
                //默认
                current: 0,


                indicatorDots: true,
                autoplay: true,
                interval: 2000,
                duration: 1000,


                showModal: false
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var goods_id = options.goods_id;
                var grade_num = options.grade_num;
                //      console.log(grade_num)
                var that = this;
                wx.request({
                        url: https + "IntegralMall/detail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                goods_id: goods_id,

                        },
                        success: function (res) {
                                var data = res.data.data;
                                var content = data.goods_desc;
                                that.setData({
                                        goods_id: data.goods_id,
                                        goods_name: data.goods_name,
                                        goods_type: data.goods_type,
                                        lock_type: data.lock_type,
                                        //等级要求
                                        grade: data.m_grade,
                                        //我的等级
                                        grade_num: grade_num,
                                        //兑换商品类型
                                        goods_type: data.goods_type,
                                        imgUrls: data.pictures,
                                        price: data.price,
                                        stock: data.stock,
                                        content: wxParse.wxParse('content', 'html', content, that, 5),
                                        button_msg: data.button_msg
                                });
                                //console.log(data)
                        }
                })
        },
 


        imageLoad: function (e) {
                //获取图片真实宽度
                var imgwidth = e.detail.width,
                        imgheight = e.detail.height,
                        //宽高比
                        ratio = imgwidth / imgheight;
                console.log(imgwidth, imgheight)
                //计算的高度值
                var viewHeight = 750 / ratio;
                var imgheight = viewHeight
                var imgheights = this.data.imgheights
                //把每一张图片的高度记录到数组里
                imgheights.push(imgheight)
                this.setData({
                        imgheights: imgheights,
                })
        },
        bindchange: function (e) {
                console.log(e.detail.current)
                this.setData({ current: e.detail.current })
        },

        //确认订单
        exchangeTap: function () {
                var that = this;
                //兑换商品类型
                var goods_type = this.data.goods_type;
                var goods_id = this.data.goods_id;
                console.log(goods_type)
                //判断是否是优惠券
                if (goods_type == 0) {
                        //优惠券
                        wx.request({
                                url: https + "IntegralMall/confirmOrder",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        goods_id: goods_id,
                                },
                                success: function (res) {
                                        if (res.data.flag == "error") {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                })
                                        } else {
                                                wx.showModal({
                                                        title: '确定兑换？',
                                                        content: '您将消耗' + res.data.data.goods.price+'积分',
                                                        success: function (res) {
                                                                if (res.confirm) {
                                                                        wx.request({
                                                                                url: https + "IntegralMall/exchange",
                                                                                method: "POST",
                                                                                header: {
                                                                                        'content-type': 'application/x-www-form-urlencoded'
                                                                                },
                                                                                data: {
                                                                                        m_id: m_id,
                                                                                        goods_id: goods_id,
                                                                                },
                                                                                success: function (res) {
                                                                                        that.setData({
                                                        showModal: true,
                                                        button_msg: res.data.data.button_msg,
                                                        advert: res.data.data.advert
                                                })
                                                                                        console.log(res)
                                                                                }
                                                                        })
                                                                } else if (res.cancel) {
                                                                        console.log('用户点击取消')
                                                                }
                                                        }
                                                })
                                                

                                        }
                                   //     console.log(res)
                                }
                        })
                } else if (goods_type == 1) {
                        //普通商品
                        wx.redirectTo({
                                url: 'confirm/confirm?goods_id=' + goods_id,
                        })
                }
        },
        /* 弹出框蒙层截断touchmove事件*/
        preventTouchMove: function () {
        },
        /**
         * 隐藏模态对话框
         */
        hideModal: function () {
                this.setData({
                        showModal: false
                });
        },
        /**对话框确认按钮点击事件*/
        onConfirm: function () {
                wx.navigateBack({
                        delta: 1
                })
                this.hideModal();
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