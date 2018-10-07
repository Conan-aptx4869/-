var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var order_id = options.order_id;
    var that = this;
    wx.request({
      url: https + "Flow/pay",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        order_id: order_id
      },
      success: function(res) {
        var data = res.data.data;
        that.setData({
          pay_amounts: data.pay_amounts,
          order_id: order_id
        })
       // console.log(res)
      }
    })
  },
  radioChange: function(e) {
    var payment = e.detail.value;
    this.setData({
      payment: payment
    })


  },

  //支付
  payTap: function(e) {
    var order_id = this.data.order_id;
    var payment = this.data.payment;
    //3为余额支付 2为微信支付
    if (payment == 3 || payment == 2) {
      wx.request({
        url: https + "Flow/doPay",
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          m_id: m_id,
          order_id: order_id,
          payment: payment
        },
        success: function(res) {
          if (res.data.flag == "error") {
            wx.showModal({
              title: '提示',
              content: res.data.message,
            })
          } else if (res.data.flag == "success") {
            var flag;
            if (payment == 2) {
              let data = res.data.data;
              let timeStamp = data.timeStamp.toString();
              wx.requestPayment({
                'timeStamp': timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': 'MD5',
                'paySign': data.sign,
                'success': function (res) {
                  wx.showToast({
                    title: '支付成功',
                    icon: "success",
                    success:function(){
                        wx.request({
                          url: https +'Flow/appCallback',
                          method: "POST",
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          data: {
                            m_id: m_id,
                            order_id: order_id,
                          }
                        })
                    }
                  });
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1500)
                },

              });
              flag = payment;
            } else if (payment == 3) {
              wx.showToast({
                title: res.data.message,
                icon: "success",
                success: function () {
                  wx.request({
                    url: https + 'Flow/appCallback',
                    method: "POST",
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      m_id: m_id,
                      order_id: order_id,
                    }
                  })
                }
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500);
              flag = payment;
            
            }
             // 将支付的方式返给后台

          

          }
         
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择支付方式',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})