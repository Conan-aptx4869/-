var m_id=wx.getStorageSync("m_id");
var https=wx.getStorageSync("https");
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
  bindFormSubmit: function (e) {
          var mail = e.detail.value.input;
          var str = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
          if (mail == "" || str.test(mail) == false) {
                  wx.showModal({
                          title: '提示',
                          content: '请正确填写你的邮箱！',
                  })
          } else {
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 2];
                  prevPage.setData({
                          mail: mail
                  })
               
                  wx.request({
                          url: https + "Center/modifyInfo",
                          method: "POST",
                          header: {
                                  'content-type': 'application/x-www-form-urlencoded'
                          },
                          data: {
                                  value: mail,
                                  m_id: m_id,
                                  field: 3
                          },
                          success: function (res) {
                                  var title = res.data.message
                                  wx.showToast({
                                          title: title,
                                          icon: "sucess"
                                  })
                          }
                  });
                  setTimeout(function(){
                          wx.navigateBack({
                                  delta: 1
                          })
                  },1500)
          }

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