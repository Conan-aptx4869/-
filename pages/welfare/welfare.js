// pages/welfare/welfare.js
var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https");
var avatarUrl = wx.getStorageSync("avatar");
Page({

        /**
         * 页面的初始数据
         */
        data: {
                avatarUrl: avatarUrl,
                indicatorDots: true,
                autoplay: true,
                interval: 2000,
                duration: 1000
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                wx.request({
                        url: https + "IntegralMall/index",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id
                        },
                        success: function (res) {
                                var data = res.data.data;
                                var myInfo = data.myinfo;
                                var grade_num = (myInfo.grade).substr(1, 1);
                                that.setData({
                                        avatarUrl: myInfo.head,
                                        name: myInfo.nickname,
                                        integral: myInfo.integral,
                                        grade: myInfo.grade,
                                        growth_value: myInfo.growth_value,

                                        advert: data.advert,
                                        slide: data.slide,
                                        grade_num: grade_num,
                                        list: data.list,

                                })
                                //把当前等级存入缓存
                                wx.setStorageSync("grade_num", grade_num)
                               
                        }

                })
        },

        //跳珠到“兑换记录”
        recordTap: function () {
                wx.navigateTo({
                        url: 'record/record',
                })
        },
        taskTap: function () {
                wx.navigateTo({
                        url: 'task/task',
                })
        },


        //跳转到兑换商品详情页
        exchTap: function (e) {
                var goods_id = e.currentTarget.dataset.goodsid;
                var grade = e.currentTarget.dataset.grade;
                var grade_num = this.data.grade_num;
                console.log(grade,grade_num);
                if(grade==grade_num){
                  wx.navigateTo({
                    url: 'exchGoodsDetail/exchGoodsDetail?goods_id=' + goods_id + "&grade_num=" + grade_num,
                  })
                }else{
                  wx.showModal({
                    title: '提示',
                    content: '您的当前等级不够',
                  })
                }
               
        },
 
        //充值送积分
        recharge:function(e){
          wx.navigateTo({
            url: 'recharge/recharge',
          })
        },

        //更多推荐
        recoMoreTap: function (e) {
                var m_grade = e.currentTarget.dataset.grade;
                wx.navigateTo({
                        url: "record/converReco/converReco?m_grade=" + m_grade
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