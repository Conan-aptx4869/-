var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
var wxParse = require("../../../../wxParse/wxParse.js");
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
          var that=this;
        wx.request({
                url: https +"Article/artInfo",
                method: "POST",
                header: {
                        'content-type': 'application/x-www-form-urlencoded'
                },
                data:{
                        flag: "answer_rule",
                },
                success:function(res){
                        var data=res.data.data;
                        var content = data.content
                        that.setData({
                                content: wxParse.wxParse('content', 'html', content, that, 5),
                                cover:data.cover,
                                title:data.title
                        });
                        console.log(data)
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