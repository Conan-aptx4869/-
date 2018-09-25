var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({
        /**
         * 页面的初始数据
         */
        data: {
                showView: false,
                shows: false,
                select_icon: "/imgs/icon/un_checked.png",
                text: true,
                text2: true,
                hidden: false,
                page: 1,
                noBody: false,
                old_list: [],

                old_best:[]
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },
        checkboxChange: function (e) {
                var checked = e.detail.value;
                var selectIds = [];
                var changed = {}
                var collectList = this.data.collectList;
                for (var i = 0; i < collectList.length; i++) {
                        if (checked.indexOf(collectList[i].goods_name) !== -1) {
                                changed['collectList[' + i + '].checked'] = true;
                                selectIds.push(collectList[i].id)
                        } else {
                                changed['collectList[' + i + '].checked'] = false
                        }
                }
                var selectIdStr = selectIds.join(",");
                this.setData(
                        changed
                )
                this.setData({
                        collectList: collectList,
                        changed: changed,
                        selectIdStr: selectIdStr
                })

                //  console.log(collectList)
        },
        //收藏管理
        adminTap: function () {
                this.setData({
                        showView: !this.data.showView,
                        shows: !this.data.shows,
                        text: !this.data.text
                })
        },

        //全选
        selectTap: function () {
                var selectIds = [];
                var collectList = this.data.collectList;
                if (this.data.select_icon == '/imgs/icon/un_checked.png') {
                        for (var i = 0; i < collectList.length; i++) {
                                collectList[i].checked = true;
                                selectIds.push(collectList[i].id)
                        }
                        var selectIdStr = selectIds.join(",");
                        this.setData({
                                select_icon: "/imgs/icon/checked.png",
                                collectList: collectList,
                                selectIdStr: selectIdStr,
                                text2: false
                        })
                } else {
                        for (var i = 0; i < collectList.length; i++) {
                                collectList[i].checked = false;
                        }
                        this.setData({
                                select_icon: "/imgs/icon/un_checked.png",
                                collectList: collectList,
                                text2: true
                        })
                }
        },

        //删除选中商品
        deleteTap: function () {
                var that = this;
                var collectList = this.data.collectList;
                var selectIdStr = this.data.selectIdStr;
                if (selectIdStr == "" || selectIdStr == undefined) {
                        wx.showModal({
                                title: '提示',
                                content: '请选择要删除的商品',
                        })
                        console.log(selectIdStr)
                } else {
                        let arr2 = [];
                        for (let i = 0; i < collectList.length; i++) {
                                if (collectList[i].checked == false) {
                                        arr2.push(collectList[i]);
                                }
                        }
                        wx.showModal({
                                title: '提示',
                                content: '是否删除？',
                                success: function (res) {
                                        if (res.confirm) {
                                                console.log(arr2);

                                                wx.request({
                                                        url: https + "Center/deleteMyCollection",
                                                        method: "POST",
                                                        header: {
                                                                'content-type': 'application/x-www-form-urlencoded'
                                                        },
                                                        data: {
                                                                m_id: m_id,
                                                                coll_ids: selectIdStr
                                                        },
                                                        success: function (res) {
                                                                that.setData({
                                                                        collectList: arr2,
                                                                        text2: true,
                                                                        select_icon: "/imgs/icon/un_checked.png",
                                                                });
                                                        }
                                                })
                                        }
                                }
                        })
                }

        },
        //跳转到详情
        detailTap: function (e) {
                var goods_id = e.currentTarget.dataset.id;

                var activity = e.currentTarget.dataset.activity;
                console.log(e)
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
                var that = this;
                var page = this.data.page;
                wx.request({
                        url: https + "Center/myCollGoods",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                p: page
                        },
                        success: function (res) {
                                var best = res.data.data.is_best;
                                console.log(res.data.data)
                                var collectList = res.data.data.collection;
                                for (var i = 0; i < best.length; i++) {
                                        best[i].isStar = 0
                                }
                                for (var i = 0; i < collectList.length; i++) {
                                        collectList[i].checked = false;
                                }
                                var old_list = that.data.old_list;
                                var lists = old_list.concat(collectList);
                                var old_best=that.data.old_best;
                                var bests=old_best.concat(best);
                                that.setData({
                                        best: bests,
                                        collectList: lists
                                });
                                if (collectList == false) {
                                        that.setData({
                                                noBody: true
                                        })
                                }
                              
                        
                        }
                })
        },
        //收藏
        fabTap: function (e) {
                var goodsId = e.currentTarget.dataset.id;
                //选中哪一项
                var cid = e.currentTarget.dataset.cid;
                var best = this.data.best;
                console.log(best)
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
                var lists = this.data.collectList;
                var bests=this.data.best;
                var page = this.data.page;
                page++;
                this.setData({
                        old_list: lists,
                        old_best:bests,
                        page: page
                })
                this.onShow();
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})