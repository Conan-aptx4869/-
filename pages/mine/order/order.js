var https = wx.getStorageSync("https");
Page({
  /**
   * 页面的初始数据*/
  data: {
    cid: 0,
    page: 1,
    status: -1,
    noBody: false,
    old_list: [],
    order_type: [{
        type: "所有",
        status: -1
      },
      {
        type: "待付款",
        status: 1
      },
      {
        type: "待发货",
        status: 2
      },
      {
        type: "待收货",
        status: 3
      },
      {
        type: "已完成",
        status: 4
      },
      {
        type: "退换 / 售后",
        status: "5,6"
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var page = this.data.page;
    var status = this.data.status;
    var m_id = wx.getStorageSync("m_id");

    //默认显示全部
    wx.request({
      url: https + "/OrderInfo/myOrders",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        status: status,
        p: page
      },
      success: function(res) {
        var order_list = res.data.data;
        var old_list = that.data.old_list;
        if (JSON.stringify(order_list) != "{}") {
          var lists = old_list.concat(order_list);
          that.setData({
            order_list: lists,
          })
        } else {
          that.setData({
            noBody: true
          })
        }
        console.log(res)
      }
    })
  },

  //选择订单状态
  selectTap: function(e) {
    var that = this;
    var cid = e.currentTarget.dataset.cid;
    var status = e.currentTarget.dataset.status;
    var m_id = wx.getStorageSync("m_id");

    this.setData({
      cid: cid,
      page: 1,
      status: status
    });
    var page = this.data.page;
    wx.request({
      url: https + "OrderInfo/myOrders",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        status: status,
        p: page
      },
      success: function(res) {
        var order_list = res.data.data;
        that.setData({
          order_list: order_list
        });
        console.log("order_list")
        console.log(order_list)
      }
    })
  },
  //搜索
  formSubmit: function(e) {
    var word = e.detail.value.input;
    var m_id = wx.getStorageSync("m_id");

    this.setData({
      page: 1
    });
    var page = this.data.page;
    var that = this;
    if (word == "") {
      wx.showModal({
        title: '提示',
        content: '请输入您要搜索的内容',
      })
    } else {
      wx.request({
        url: https + "OrderInfo/myOrders",
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          m_id: m_id,
          status: -1,
          p: page,
          key_word: word
        },
        success: function(res) {
          var order_list = res.data.data;
          that.setData({
            order_list: order_list
          });
        }
      })
    }

  },

  //跳转到订单详情
  orderDetailTap: function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: 'order_detail/order_detail?order_id=' + order_id + "&status=" + status,
    })
  },


  //订单的操作 
  madeTap: function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var status = e.currentTarget.dataset.status;
    var idx = e.currentTarget.dataset.idx;
    var m_id = wx.getStorageSync("m_id");

    var that = this;
    var type;
    if (status == 7) {
      type = "取消申请"
    } else if (status == 5) {
      type = "取消换货"
    } else if (status == 3) {
      type = "确认收货"
    } else if (status == 1) {
      type = "去支付"
    } else if (status == 4) {
      type = "去评价"
    }
    wx.showModal({
      title: '提示',
      content: '是否' + type + '？',
      success: function(res) {
        if (res.confirm) {
          if (status == 7 || status == 5) {
            //取消申请退款和换货
            wx.request({
              url: https + "OrderInfo/cancelRefund",
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                m_id: m_id,
                order_id: order_id
              },
              success: function(res) {
                wx.showModal({
                  title: '提示',
                  content: res.data.message,
                  success: function(res) {

                  }
                })
                console.log(res)
              }
            })
          } else if (status == 3) {
            //确认收货
            wx.request({
              url: https + "OrderInfo/signFor",
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                m_id: m_id,
                order_id: order_id
              },
              success: function(res) {
                wx.showModal({
                  title: '提示',
                  content: res.data.message,
                  success: function(res) {

                  }
                })
              }
            })
          } else if (status == 1) {
            wx.navigateTo({
              url: '../../details/placeOrder/payType/payType?order_id=' + order_id,
            })
          } else if (status == 4) {
            //去评价
            wx.navigateTo({
              url: 'order_evaluation/order_evaluation?order_id=' + order_id + "&idx=" + idx,
            })
          }
        }
      }
    })



  },

  //删除订单
  deleteTap: function(e) {
    var order_id = e.currentTarget.dataset.order_id;
    var cid = e.currentTarget.dataset.cid;
    var that = this;
    var order_list = this.data.order_list
    var orderArr = [];
    var m_id = wx.getStorageSync("m_id");

    wx.showModal({
      title: '提示',
      content: '确认要删除该订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: https + "OrderInfo/deleteMyOrders",
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              m_id: m_id,
              order_ids: order_id
            },
            success: function(res) {
              for (let i = 0; i < order_list.length; i++) {
                if (i != cid) {
                  orderArr.push(order_list[i]);
                }
              }
              that.setData({
                order_list: orderArr
              });
              wx.showToast({
                title: res.data.message,
                icon: 'success',

              })

            }
          })
        }
      }
    })



  },
  //去评价
  evaluate: function(e) {

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
    var lists = this.data.order_list;
    var status = this.data.status;
    var page = this.data.page;
    page++;
    this.setData({
      old_list: lists,
      page: page
    })
    this.onLoad();
  },


  /* 用户点击右上角分享*/
  onShareAppMessage: function() {

  }

})