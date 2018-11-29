var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sort: [{
        name: "上新",
        sort: 3
      },
      {
        name: "销量",
        sort: 1
      },
      {
        name: "价格",
        sort: 5
      }
    ],
    showView: false,
    sortId: 0,

    n_sort: 3,
    page: 1,
    noBody: false,
    old_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var param = options.param;
    this.setData({
      param: param
    })
  },
  //排序
  sortTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    var n_sort = e.currentTarget.dataset.sort;

    this.setData({
      sortId: id,
      page: 1,
      n_sort: n_sort
    });
    var page = this.data.page;
    if (id == 2) {
      this.setData({
        showView: !this.data.showView
      })
    } else {
      this.setData({
        showView: false
      });
      wx.request({
        url: https + "Goods/speGoodsList",
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          spe_id: that.data.param,
          //默认  上新升序
          sort: n_sort,
          p: page,
          m_id: m_id
        },
        success: function(res) {
          var goods = res.data.data.list;
          for (var i = 0; i < goods.length; i++) {
            goods[i].isStar = 0
          }
          that.setData({
            goods: goods,
          })
          console.log(goods)
        }
      })
    }

  },

  //收藏
  fabTap: function(e) {
    var goodsId = e.currentTarget.dataset.id;
    //选中哪一项
    var cid = e.currentTarget.dataset.cid;
    var goods = this.data.goods;
    wx.showToast({
      title: goods[cid].is_coll == 0 ? "收藏成功" : "取消收藏",
    })
    if (goods[cid].is_coll == 0) {
      //收藏          
      goods[cid].is_coll = 1;

    } else {
      //取消收藏
      goods[cid].is_coll = 0;
    }
    this.setData({
      cid: cid,
      goods: goods
    })
    var ss = goods[cid].is_coll;
    wx.request({
      url: https + "Goods/goodsCollection",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        goods_id: goodsId,
        is_coll: ss == 0 ? "1" : "0"
      },
    })
  },
  //点击遮罩消失
  maskView: function() {
    this.setData({
      showView: !this.data.showView
    })
  },

  //跳转到详情
  detailTap: function(e) {
    var goods_id = e.currentTarget.dataset.id;
    var activity = 0;
    wx.navigateTo({
      url: '../../details/goodsDetails/goodsDetails?goods_id=' + goods_id + "&activity=" + activity,

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
    var param = this.data.param;

    var page = this.data.page;
    var n_sort = this.data.n_sort;
    //默认  上新升序
    wx.request({
      url: https + "Goods/speGoodsList",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        m_id: m_id,
        spe_id: param,
        sort: n_sort,
        p: page,
      },
      success: function(res) {
        var goods = res.data.data.list;
        if (goods != undefined) {
          wx.setNavigationBarTitle({
            title: res.data.data.spe_name
          })
          for (var i = 0; i < goods.length; i++) {
            goods[i].isStar = 0
          }
          var old_list = that.data.old_list;
          var lists = old_list.concat(goods);
          console.log(lists)
          that.setData({
            bannerUrl: res.data.data.cover,
            goods: lists,
            param: param
          });
        } else {
          that.setData({
            noBody: true
          })
        }

        //  console.log(goods)
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
    var lists = this.data.goods;
    var page = this.data.page;
    page++;
    this.setData({
      old_list: lists,
      page: page
    })
    this.onShow();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})