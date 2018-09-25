var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https");

Page({

        /**
         * 页面的初始数据
         */
        data: {
                page: 1,
                noBody: false,
                old_list: []
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var m_grade = options.m_grade;
                this.setData({
                        m_grade: m_grade
                })

        },
        //跳转到兑换商品详情页
        exchTap: function (e) {
                var goods_id = e.currentTarget.dataset.goodsid;
                var grade = e.currentTarget.dataset.grade;
                var grade_num = wx.getStorageSync("grade_num");
                console.log(grade_num)
                wx.navigateTo({
                        url: '../../exchGoodsDetail/exchGoodsDetail?goods_id=' + goods_id + "&grade=" + grade + "&grade_num=" + grade_num,
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
                var m_grade = this.data.m_grade;
                var page=this.data.page;
                wx.request({
                        url: https + "IntegralMall/goodsList",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                m_grade: m_grade,
                                p: page
                        },
                        success: function (res) {
                                var list = res.data.data;

                                var old_list = that.data.old_list;
                                var lists = old_list.concat(list.list);
                                that.setData({
                                        grade_name: list.grade_name,
                                        grade_sign: list.grade_sign,
                                        growth_value: list.growth_value,
                                        list: lists
                                });
                                if (list.list == false) {
                                        that.setData({
                                                noBody: true
                                        })

                                }
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