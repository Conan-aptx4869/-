var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https");
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
  formSubmit:function(e){
    const price=e.detail.value.number;
    wx.request({
      url: https +'Center/doBR',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        m_id:m_id,
        recharge_amounts:price,
        order_type:2
      },
      success:function(res){
        if (res.data.flag =='success'){
          const rec_order_id = res.data.data.rec_order_id;
          wx.request({
            url: https +'Center/doBRPay',
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data:{
              m_id:m_id,
              payment:2,
              rec_order_id: rec_order_id 
            },
            success:function(res){
              let data=res.data.data;
              wx.requestPayment({
                'timeStamp': data.timeStamp.toString(),
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': 'MD5',
                'paySign': data.sign,
                'success': function (res) {
                  console.log(res)
                },
                'fail': function (res) {
                }
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.message,
          })
        }
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