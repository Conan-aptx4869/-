var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
const app = getApp()
Page({
  data: {
    //所有图片的高度
    imgheights: [],
    //图片宽度
    imgwidth: 750,
    //默认 
    current: 0,

    selected: true,
    tabItemId: 0,

    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,


    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    showModal: false
  },



  onLoad: function() {
    var https = wx.getStorageSync("https");
    var that = this;
    //   console.log(this.data)
    wx.request({
      url: https + "System/getCategorys",
      success: function(res) {
        var tabArr = res.data.data.list;
        that.setData({
          tabArr: tabArr
        })
        var param = tabArr[0].param;
        wx.request({
          url: https + "Index/index",
          data: {
            param: param,
            m_id: m_id
          },
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function(res) {
            var imgUrls = res.data.data.list_slide;
            var adv = res.data.data.list_center;
            //商品图
            var goods = res.data.data.list_active;
            //推荐
            var best = res.data.data.list_best;

            for (var i = 0; i < best.length; i++) {
              best[i].isStar = 0
            }
            var dz = res.data.data.list.list_pic_dz;
            var qd = res.data.data.list.list_pic_qd;
            var hd = res.data.data.list.list_pic_hd;
            var jf = res.data.data.list.list_pic_jf;
            that.setData({
              imgUrls: imgUrls,
              adv: adv,
              dz: dz,
              qd: qd,
              hd: hd,
              jf: jf,
              goods: goods,
              best: best
            })
          }
        })

      }
    });


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  tabTap: function(e) {
    var https = wx.getStorageSync("https");
    var that = this;
    var id = e.currentTarget.dataset.id;
    var param = e.currentTarget.dataset.param;
    this.setData({
      tabItemId: id
    })
    wx.request({
      url: https + "Index/index",
      data: {
        param: param
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var imgUrls = res.data.data.list_slide;
        var adv = res.data.data.list_center;
        //商品图
        var goods = res.data.data.list_active;
        //推荐
        var best = res.data.data.list_best;
        for (var i = 0; i < best.length; i++) {
          best[i].isStar = 0
        }
        console.log(best)
        var list = res.data.data.list;
        that.setData({
          list: list,
          imgUrls: imgUrls,
          goods: goods,
          best: best,
          adv: adv,
        })
      }
    })
  },

  //跳转到“我的定制”
  cusTap: function() {
    wx.navigateTo({
      url: 'customized/customized',
    })
  },

  //跳转到"会员积分"
  integralTap: function() {
    wx.navigateTo({
      url: '../mine/integral/integral',
    })
  },

  //跳转到“热门活动”
  activityTap: function(e) {
    var param = e.currentTarget.dataset.param;
    var targetrule = Number(e.currentTarget.dataset.targetrule);
    var that = this;
    wx.request({
      url: https + "Goods/getParentCate",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cate_id: param
      },
      success: function(res) {
        var parent_id = res.data.data.parent_id;
        var title = res.data.data.title;
        if (parent_id != undefined) {
          that.setData({
            parent_id: parent_id
          })
        }
      }
    });


    setTimeout(function() {
      var parent_id = that.data.parent_id;
      var title = that.data.title;
      switch (targetrule) {
        case 0: //不跳转
          break;
        case 1: //分类商品类表
          wx.navigateTo({
            url: 'classicDetail/classicDetail?parentId=' + parent_id + "&cate_id=" + param + "&name=" + title,
          });
          break;
        case 2: //专题商品列表
          wx.navigateTo({
            url: 'popularActivity/popularActivity?param=' + param,
          });

          break;
        case 3: //商品详情
          wx.navigateTo({
            url: '../details/goodsDetails/goodsDetails?goods_id=' + param,
          });
          break;
        case 4: //积分商城
          wx.switchTab({
            url: '../welfare/welfare',
          });
          break;
        case 5: //积分商城详情
          wx.navigateTo({
            url: '../welfare/exchGoodsDetail/exchGoodsDetail?goods_id=' + param,
          });
          break;
        case 6: //答题活动页
          wx.navigateTo({
            url: '../welfare/task/task',
          });
          break;
        case 7: //我要定制
          wx.navigateTo({
            url: 'customized/customized'
          });
          break;
      }
    }, 500)


  },

  //收藏
  fabTap: function(e) {
    var goodsId = e.currentTarget.dataset.id;
    //选中哪一项
    var cid = e.currentTarget.dataset.cid;
    var best = this.data.best;
    // console.log(best)
    wx.showToast({
      title: best[cid].is_coll == 0 ? "收藏成功" : "取消收藏",
    })
    if (best[cid].is_coll == 0) {
      //收藏          
      best[cid].is_coll = 1;

    } else {
      //取消收藏
      best[cid].is_coll = 0;
    }

    this.setData({
      cid: cid,
      best: best
    })
    var ss = best[cid].is_coll;
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

  //跳转到分类详情
  classicDetailTap: function(e) {
    var parentId = e.currentTarget.dataset.parentid;
    var name = e.currentTarget.dataset.name;
    var cate_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'classicDetail/classicDetail?parentId=' + parentId + "&name=" + name + "&cate_id=" + cate_id,
    })
  },

  //跳转到商品详情
  detailTap: function(e) {
    var activity = e.currentTarget.dataset.activity;
    var goods_id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../details/goodsDetails/goodsDetails?goods_id=' + goods_id + "&activity=" + activity,

    })
  },

  // 轮播图跳转
  wheelJump(e){
    const param = Number(e.currentTarget.dataset.param);
    const rule = Number(e.currentTarget.dataset.targetrule);
    console.log(rule,param)
    switch (rule) {
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
  },

  /* 页面上拉触底事件的处理函数*/
  onReachBottom: function() {

  },
  getUserInfo: function(e) {
    //    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /*弹窗 */
  showDialogBtn: function() {
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
          text3: data.sign_integral,
          advert: data.advert
        });
        //   console.log(res);
      }


    })

  },

  imageLoad: function(e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    //     console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function(e) {
    //    console.log(e.detail.current)
    this.setData({
      current: e.detail.current
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
  }
})