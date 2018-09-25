var WxParse = require('../../../../wxParse/wxParse.js');
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
        var https=wx.getStorageSync("https");
        var that=this;
        wx.request({
                url: https +"Article/artInfo",
                method: "POST",
                header: {
                        'content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                        flag: "coupon_rule" 
                },
                success:function(res){
                        var content = res.data.data.content;
                        that.setData({
                                // article: WxParse.wxParse('article', 'html', article, that, 5),
                                content: WxParse.wxParse('content', 'html', content, that, 5),
                        })
                }
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