var name = wx.getStorageSync("name");
var avatarUrl = wx.getStorageSync("avatar");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: name,
    avatarUrl: avatarUrl,
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var https = wx.getStorageSync("https");
    var m_id = wx.getStorageSync("m_id");
    var that = this;
    wx.request({
      url: https + "Center/myinfo",
      data: {
        m_id: m_id
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var myInfo = res.data.data.myinfo;
        that.setData({
          name: myInfo.nickname,
          avatarUrl: myInfo.head,
          growth_value: myInfo.growth_value,
          balance: myInfo.balance,
          advert: res.data.data.advert
        });
        console.log(res)
      }
    })

    // 获取用户信息



  },
  //跳转到会员任务
  taskTap: function() {
    wx.navigateTo({
      url: '../welfare/task/task',
    })
  },
  //跳转我的收藏
  collecTap: function() {
    wx.navigateTo({
      url: 'collection/collection',
    })
  },

  //跳转到我的订单
  orderTap: function() {
    wx.navigateTo({
      url: 'order/order',
    })
  },

  //跳转到帮助
  helpTap: function() {
    wx.navigateTo({
      url: 'help/help',
    })
  },

  //跳转到反馈
  feedbackTap: function() {
    wx.navigateTo({
      url: 'feedback/feedback',
    })
  },

  //跳到设置
  setUpTap: function() {
    wx.navigateTo({
      url: 'setUp/setUp',
    })
  },

  //跳转到收货地址
  addresTap: function() {
    wx.navigateTo({
      url: 'address/address',
    })
  },

  //跳转到优惠券
  couponTap: function() {
    wx.navigateTo({
      url: 'coupon/coupon',
    })
  },

  //跳转到我的余额
  balanceTap: function() {
    wx.navigateTo({
      url: 'myBalance/myBalance'
    })
  },

  activityTap: function(e) {
    var https = wx.getStorageSync("https");
    var param = e.currentTarget.dataset.param;
    var targetrule = Number(e.currentTarget.dataset.targetrule);
    var that = this;
    // wx.request({
    //   url: https + "Goods/getParentCate",
    //   method: "POST",
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: {
    //     cate_id: param
    //   },
    //   success: function(res) {
    //     var parent_id = res.data.data.parent_id;
    //     var title = res.data.data.title;
    //     if (parent_id != undefined) {
    //       that.setData({
    //         parent_id: parent_id,
    //         title: title
    //       })
    //     }

    //   }
    // });
    setTimeout(function() {
      var parent_id = that.data.parent_id;
      var title = that.data.title;
      switch (targetrule) {
        case 0: //不跳转
          break;
        case 1: //分类商品类表
          wx.navigateTo({
            url: '../index/classicDetail/classicDetail?parentId=' + parent_id + "&cate_id=" + param + "&name=" + title,
          });
          break;
        case 2: //专题商品列表
          wx.navigateTo({
            url: '../index/popularActivity/popularActivity?param=' + param,
          });

          break;
        case 3: //商品详情
          wx.navigateTo({
            url: '../details/goodsDetails/goodsDetails?goods_id=' + param,
          });
          break;
        case 4: //积分商城
          wx.switchTab({
            url: '../welfare/welfare'
          });
          break;
        case 5: //积分商城详情
          wx.navigateTo({
            url: '../welfare/exchGoodsDetail/exchGoodsDetail?goods_id=' + param,
          });
          break;
        case 6: //答题活动页
          wx.navigateTo({
            url: '../welfare/task/task'
          });
          break;
        case 7: //我要定制
          wx.navigateTo({
            url: '../index/customized/customized'
          });
          break;
      }

    }, 0)

  },
  //跳到积分
  integralTap: function() {
    wx.navigateTo({
      url: 'integral/integral',
    })
  },

  /*弹窗 */
  showDialogBtn: function() {
    var m_id = wx.getStorageSync("m_id");
    var https = wx.getStorageSync("https");
    var that = this;
    wx.request({
      url: https + "Center/sign",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id
      },
      success: function(res) {
        var data = res.data.data;
        that.setData({
          showModal: true,
          message: res.data.message,
          advertz: data.advert,
          text3: data.sign_integral,
        });
      }


    })

  },

  /* 弹出框蒙层截断touchmove事件*/
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**对话框确认按钮点击事件*/
  onConfirm: function() {
    this.hideModal();
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
    this.onLoad();
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