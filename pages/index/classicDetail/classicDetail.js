var m_id = wx.getStorageSync("m_id");
var https = wx.getStorageSync("https");
Page({

        /* 页面的初始数据*/
        data: {
                sort: [
                        { name: "上新", sort: 3 },
                        { name: "销量", sort: 1 },
                        { name: "价格", sort: 5 }
                ],
                showView: false,
                sortId: 0,

                n_sort: 3,
                page: 1,
                noBody: false,
                old_list: [],
                old_list2: [],
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var parentId = options.parentId;
                var cate_id = options.cate_id;
                var titleName = options.name;
                var that = this;
                wx.setNavigationBarTitle({
                        title: titleName,
                })
                this.setData({
                        parentId: parentId,
                        cate_id: cate_id,
                        titleName: titleName
                });
                wx.request({
                        url: https + "Goods/getGoodsCate",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: "POST",
                        data: {
                                parent_id: parentId
                        },
                        success: function (res) {
                                var list = res.data.data.list;
                                that.setData({
                                        list: list,
                                })

                        }
                })
        },

        classicDetailTap: function (e) {
                var that = this;
                var cate_id = e.currentTarget.dataset.id;
                var name = e.currentTarget.dataset.name;
                var n_sort = this.data.n_sort;

                wx.setNavigationBarTitle({
                        title: name,
                });
                this.setData({
                        page: 1,
                        cate_id: cate_id
                });
                var page = this.data.page;
                wx.request({
                        url: https + "Goods/goodsList",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: "POST",
                        data: {
                                goods_cate_id: cate_id,
                                //默认  上新升序
                                sort: n_sort,
                                p: page,
                                m_id: m_id
                        },
                        success: function (res) {
                                var goods = res.data.data;
                                for (var i = 0; i < goods.length; i++) {
                                        goods[i].isStar = 0
                                }
                                var old_list2 = that.data.old_list2;
                                var lists = old_list2.concat(goods);
                                if (JSON.stringify(goods) == "{}") {
                                        lists = {};
                                        that.setData({
                                                goods: lists,
                                                page: page
                                        });
                                        console.log("空对象")
                                } else {
                                        that.setData({
                                                goods: lists,
                                                page: page
                                        });
                                }

                                // console.log(goods);
                                // console.log(lists)
                                // console.log(old_list2);
                        }
                })
        }, 
        //排序
        sortTap: function (e) {
                var id = e.currentTarget.dataset.id;
                var that = this;
                var n_sort = e.currentTarget.dataset.sort;
                
                this.setData({
                        page: 1,
                        sortId: id,
                        n_sort: n_sort
                });
                console.log(this.data.sortId)
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
                                url: https + "Goods/goodsList",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        goods_cate_id: that.data.cate_id,
                                        //默认  上新升序
                                        sort: n_sort,
                                        p: page,
                                        m_id: m_id
                                },
                                success: function (res) {
                                        var goods = res.data.data;
                                        for (var i = 0; i < goods.length; i++) {
                                                goods[i].isStar = 0
                                        }
                                        console.log(goods)
                                        that.setData({
                                                goods: goods,
                                        })

                                }
                        })
                }

        },




        //收藏
        fabTap: function (e) {
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
        maskView: function () {
                this.setData({
                        showView: !this.data.showView
                })
        },



        //查看全部跳转
        seeAllTap: function () {
                var parentId = this.data.parentId;
                var titleName = this.data.titleName;
                wx.redirectTo({
                        url: 'hotClassic/hotClassic?parentId=' + parentId + "&titleName=" + titleName,
                })
        },


        //跳转到详情
        detailTap: function (e) {
                var activity = e.currentTarget.dataset.activity;
                var goods_id = e.currentTarget.dataset.id;
                wx.navigateTo({
                        url: '../../details/goodsDetails/goodsDetails?goods_id=' + goods_id + "&activity=" + activity,

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
                var parentId = this.data.parentId;
                var cate_id = this.data.cate_id;
                var titleName = this.titleName;
                var n_sort = this.data.n_sort;
                var page = this.data.page;
                var that = this;
                wx.request({
                        url: https + "Goods/goodsList",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        method: "POST",
                        data: {
                                goods_cate_id: cate_id,
                                //默认  上新升序
                                sort: n_sort,
                                p: page,
                                m_id: m_id
                        },
                        success: function (res) {
                                var goods = res.data.data;
                                var old_list = that.data.old_list;
                                var lists = old_list.concat(goods);
                                for (var i = 0; i < goods.length; i++) {
                                        goods[i].isStar = 0
                                }
                                if (JSON.stringify(goods) != "{}") {
                                        that.setData({
                                                goods: lists,
                                                page: page
                                        });
                                } else {
                                        that.setData({
                                                noBody: true
                                        })
                                }
                                // console.log(goods);
                                // console.log(lists)
                                // console.log(old_list);
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
                var lists = this.data.goods;
                var page = this.data.page;
                page++;
                this.setData({
                        old_list: lists,
                        page: page,
                });
                this.onShow();
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})

