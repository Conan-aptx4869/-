var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: https + "AnswerTask/index",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id
      },
      success: function(res) {
        var data = res.data.data;
        console.log(res)
        that.setData({
          name: data.name,
          pictures: data.pictures,
          prompt: data.prompt,
          pro_id: data.pro_id
        });
        if(res.data.flag='error'){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel:false,
            success(res) {
              if (res.confirm) {
               wx.navigateBack({
                 delta:1
               })
              }else if(res.cancel){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      }
    });
    wx.request({
      url: https + "AnswerTask/getAnswerRecord",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        p: 1
      },
      success: function(res) {
        var list = res.data.data
        that.setData({
          list: list.list
        });
      }
    })
  },
  formSubmit: function(e) {
    var that = this;
    var answer = e.detail.value.answer;
    var pro_id = e.detail.target.dataset.proid;
    if (answer == "") {
      wx.showModal({
        title: '提示',
        content: '请输入答案后再确认！',
      })
    } else {
      wx.request({
        url: https + "AnswerTask/answer",
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          m_id: m_id,
          answer: answer,
          pro_id: pro_id
        },
        success: function(res) {
          if (res.data.flag == "error") {
            wx.showModal({
              title: '提示',
              content: res.data.message,
            })
          } else if (res.data.flag) {
            var message = res.data.message;
            that.setData({
              showView: false,
              answer: message.answer,
              msg_ans: message.msg_ans,
              msg_button: message.msg_button
            });
            //      console.log(message)
          }
        }
      })

    }

  },
  homrPageTap: function() {
    var flag = this.data.msg_button;
    if (flag == "去购物") {
      wx.switchTab({
        url: '../../index/index',
      })
    }
  },
  ruleTap: function() {
    wx.navigateTo({
      url: 'taskRule/taskRule',
    })
  },

  //跳转到详情
  taskDetailTap: function(e) {
    var a_id = e.currentTarget.dataset.aid;
    wx.navigateTo({
      url: 'taskDetail/taskDetail?a_id=' + a_id,
    })
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