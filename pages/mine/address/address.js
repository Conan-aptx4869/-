var https = wx.getStorageSync("https");
<<<<<<< HEAD
var m_id = wx.getStorageSync("m_id");
Page({

        /**
         * 页面的初始数据
         */
        data: {
                color: false,
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },

        //编辑
        editTap: function (e) {
                var address_list = this.data.address_list;
                if (address_list.length >= 10) {
                        wx.showModal({
                                title: '提示',
                                content: '您最多只能设置10个收货地址',
                        })
                } else {
                        var adr_id = e.currentTarget.dataset.adr_id;
                        wx.navigateTo({
                                url: 'edit/edit?adr_id=' + adr_id,
                        })
                }

        },


        //删除
        deteleTap: function (e) {
                var that = this;
                var adr_id = e.currentTarget.dataset.adr_id;
                var cid = e.currentTarget.dataset.cid;
                var address_list = this.data.address_list;
                wx.showModal({
                        title: '提示',
                        content: '确定删除这个收货地址吗？',
                        success: function (res) {
                                if (res.confirm) {
                                        address_list[cid].delete = true;
                                        that.setData({
                                                cid: cid
                                        })
                                        let arr2 = [];
                                        for (let i = 0; i < address_list.length; i++) {
                                                if (address_list[i].delete == false) {
                                                        arr2.push(address_list[i]);
                                                }
                                        }
                                        that.setData({
                                                address_list: arr2
                                        });
                                        wx.request({
                                                url: https + "Center/delAddress",
                                                method: "POST",
                                                header: {
                                                        'content-type': 'application/x-www-form-urlencoded'
                                                },
                                                data: {
                                                        adr_id: adr_id,
                                                        m_id: m_id
                                                },
                                                success: function (res) {
                                                        wx.showToast({
                                                                title: res.data.message,
                                                                icon: "success",
                                                        })
                                                }
                                        })
                                }
                        }
                })

                //    console.log(address_list)
        },

        //设为默认
        radioChange: function (e) {
                var adr_id = e.detail.value;
                var address_list = this.data.address_list;
                var that = this;
                console.log(address_list)
                wx.request({
                        url: https + "Center/setDefault",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                adr_id: adr_id
                        },
                        success: function (res) {
                                if (res.data.flag == "success") {
                                        for (var i = 0; i < address_list.length; i++) {
                                                if (address_list[i].adr_id == adr_id) {
                                                        var pages = getCurrentPages();
                                                        var prevPage = pages[pages.length - 2];
                                                        prevPage.setData({
                                                                contacts: address_list[i].contacts,
                                                                province_name: address_list[i].province_name,
                                                                city_name: address_list[i].city_name,
                                                                area_name: address_list[i].area_name,
                                                                address: address_list[i].address
                                                        })
                                                }
                                        }
                                        wx.showToast({
                                                title: res.data.message,
                                                icon: "success",
                                                success: function () {
                                                        wx.setStorageSync("adr_id", adr_id);

                                                        setTimeout(function () {
                                                                wx.navigateBack({
                                                                        delta: 1
                                                                })
                                                        }, 1500)
                                                }
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
                var that = this;
                wx.request({
                        url: https + "Center/addresses",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id
                        },
                        success: function (res) {
                                var address_list = res.data.data.list;
                                for (var i = 0; i < address_list.length; i++) {
                                        if (address_list[i].is_default == 1) {
                                                address_list[i].checked = true;
                                                var adr_id = address_list[i].adr_id;
                                                wx.setStorageSync("adr_id", adr_id)
                                        }
                                        address_list[i].delete = false
                                }
                                that.setData({
                                        address_list: address_list
                                });
                                   
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

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
=======

Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //编辑
  editTap: function(e) {
    var address_list = this.data.address_list;
    if (address_list.length >= 10) {
      wx.showModal({
        title: '提示',
        content: '您最多只能设置10个收货地址',
      })
    } else {
      var adr_id = e.currentTarget.dataset.adr_id;
      wx.navigateTo({
        url: 'edit/edit?adr_id=' + adr_id,
      })
    }

  },


  //删除
  deteleTap: function(e) {
    var that = this;
    var m_id = wx.getStorageSync("m_id");
    var adr_id = e.currentTarget.dataset.adr_id;
    var cid = e.currentTarget.dataset.cid;
    var address_list = this.data.address_list;
    wx.showModal({
      title: '提示',
      content: '确定删除这个收货地址吗？',
      success: function(res) {
        if (res.confirm) {
          address_list[cid].delete = true;
          that.setData({
            cid: cid
          })
          let arr2 = [];
          for (let i = 0; i < address_list.length; i++) {
            if (address_list[i].delete == false) {
              arr2.push(address_list[i]);
            }
          }
          that.setData({
            address_list: arr2
          });
          wx.request({
            url: https + "Center/delAddress",
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              adr_id: adr_id,
              m_id: m_id
            },
            success: function(res) {
              wx.showToast({
                title: res.data.message,
                icon: "success",
              })
            }
          })
        }
      }
    })

    //    console.log(address_list)
  },

  //设为默认
  radioChange: function(e) {
    var adr_id = e.detail.value;
    var address_list = this.data.address_list;
    var m_id = wx.getStorageSync("m_id");
    var that = this;
    console.log(address_list)
    wx.request({
      url: https + "Center/setDefault",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        adr_id: adr_id
      },
      success: function(res) {
        if (res.data.flag == "success") {
          for (var i = 0; i < address_list.length; i++) {
            if (address_list[i].adr_id == adr_id) {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                contacts: address_list[i].contacts,
                province_name: address_list[i].province_name,
                city_name: address_list[i].city_name,
                area_name: address_list[i].area_name,
                address: address_list[i].address
              })
            }
          }
          wx.showToast({
            title: res.data.message,
            icon: "success",
            success: function() {
              wx.setStorageSync("adr_id", adr_id);

              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        }
      }
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
    var that = this;
    var m_id = wx.getStorageSync("m_id");
    wx.request({
      url: https + "Center/addresses",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id
      },
      success: function(res) {
        var address_list = res.data.data.list;
        for (var i = 0; i < address_list.length; i++) {
          if (address_list[i].is_default == 1) {
            address_list[i].checked = true;
            var adr_id = address_list[i].adr_id;
            wx.setStorageSync("adr_id", adr_id)
          }
          address_list[i].delete = false
        }
        that.setData({
          address_list: address_list
        });

      }
    })
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
>>>>>>> 20180925
})