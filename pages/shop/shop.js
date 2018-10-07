var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({
        /**
         * 页面的初始数据
         */
        data: {
                showView: false,
                shows: true,
                select_icon: "/imgs/icon/un_checked.png",
                
                text2: true,
                total_price: 0,
                hidden: false
        }, 
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
 
        },


        //全选
        selectTap: function () {
                var selectIds = [];
                var shop_list = this.data.shop_list;
                if (this.data.select_icon == '/imgs/icon/un_checked.png') {
                        for (var i = 0; i < shop_list.length; i++) {
                                shop_list[i].checked = true;
                                selectIds.push(shop_list[i].cart_id)
                        }
                        var selectIdStr = selectIds.join(",");
                        //         console.log(selectIdStr)
                        this.setData({
                                select_icon: "/imgs/icon/checked.png",
                                shop_list: shop_list,
                                selectIdStr: selectIdStr,
                                text2: false
                        });
                        //      console.log(shop_list)
                } else {
                        for (var i = 0; i < shop_list.length; i++) {
                                shop_list[i].checked = false;
                        }
                        this.setData({
                                select_icon: "/imgs/icon/un_checked.png",
                                shop_list: shop_list,
                                text2: true
                        });

                }

                this.getTotalPrice();
        },

        checkboxChange: function (e) {
                var selectIds = [];
                var checked = e.detail.value;
                var shop_list = this.data.shop_list;
                var changed = {}
                for (var i = 0; i < shop_list.length; i++) {
                        if (checked.indexOf(shop_list[i].cart_id) !== -1) {
                                changed['shop_list[' + i + '].checked'] = true;
                                selectIds.push(shop_list[i].cart_id)
                        } else {
                                changed['shop_list[' + i + '].checked'] = false;
                        }
                }
                //  console.log(shop_list)
                var selectIdStr = selectIds.join(",");
                //         console.log(selectIdStr)
                this.setData(changed);
                this.setData({
                        changed: changed,
                        shop_list: shop_list,
                        selectIdStr: selectIdStr
                })
                this.getTotalPrice();
        },

        //数量加减
        subTap: function (e) {
                var index = e.currentTarget.dataset.index;
                var shop_list = this.data.shop_list;
                var number = Number(shop_list[index].number);
                number = number - 1;
                if (number <= 0) {
                  this.deleteTap();
                        return false;
                } else {
                        shop_list[index].number = number;
                        this.setData({
                              shop_list: shop_list
                        });
                        this.getTotalPrice();
                }

        },
        addTap: function (e) {
                var index = e.currentTarget.dataset.index;
                var shop_list = this.data.shop_list;
                var number = parseInt(shop_list[index].number);
                number = number + 1;
                shop_list[index].number = number;
                this.setData({
                        shop_list: shop_list
                });
                this.getTotalPrice();
        },

        //管理
        adminTap: function () {
                this.setData({
                   showView: !this.data.showView
                })
        },


        //计算总价
        getTotalPrice: function () {
                let shop_list = this.data.shop_list;
                let total_price = 0;
                for (let i = 0; i < shop_list.length; i++) {
                        if (shop_list[i].checked == true) {
                                total_price = total_price + shop_list[i].number * shop_list[i].price;
                        }
                }
                this.setData({
                        shop_list: shop_list,
                        total_price: total_price
                })
        },

        //删除
        deleteTap: function (e) {
                var that = this;
                var shop_list = this.data.shop_list;
                var selectIdStr = this.data.selectIdStr;
                //   console.log("选择的字符串：" + selectIdStr)
                if (selectIdStr == undefined || selectIdStr == "") {
                        wx.showModal({
                                title: '提示',
                                content: '请选择要删除的商品',
                        })

                } else {
                        let arr2 = [];
                        for (let i = 0; i < shop_list.length; i++) {
                                if (shop_list[i].checked == false) {
                                        arr2.push(shop_list[i]);
                                }
                        }
                        wx.showModal({
                                title: '提示',
                                content: '是否删除选择的商品？',
                                success: function (res) {
                                        if (res.confirm) {
                                                console.log(arr2);

                                                wx.request({
                                                        url: https + "cart/delFromCart",
                                                        method: "POST",
                                                        header: {
                                                                'content-type': 'application/x-www-form-urlencoded'
                                                        },
                                                        data: {
                                                                m_id: m_id,
                                                                cart_ids: selectIdStr
                                                        },
                                                        success: function (res) {
                                                                that.setData({
                                                                        shop_list: arr2,
                                                                        text2: true,
                                                                        select_icon: "/imgs/icon/un_checked.png",
                                                                });
                                                                that.onShow();
                                                                //    console.log(res);
                                                        }
                                                })
                                        }
                                }
                        })
                }
                this.getTotalPrice();
        },

        //结算
        settTap: function (e) {
                var shop_list = this.data.shop_list;
                var activity = e.currentTarget.dataset.activity;
                //  console.log(shop_list);
                var cartArr = [];
                for (let i = 0; i < shop_list.length; i++) {
                        if (shop_list[i].checked == true) {
                                cartArr.push(shop_list[i].cart_id);
                        }
                }

                var cart_id = cartArr.join(",");
                console.log(cart_id);
                if (cart_id == "" || cart_id == []) {
                        wx.showModal({
                                title: '提示',
                                content: '您还没有选择商品',
                        })
                } else {
                        wx.navigateTo({
                                url: '../details/placeOrder/placeOrder?cart_id=' + cart_id + "&activity=" + activity,
                        })
                }

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
                that.setData({
                  total_price:0,
                  text2:true,
                  select_icon: "/imgs/icon/un_checked.png",
                })
                wx.request({
                        url: https + "cart/cartList",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id
                        },
                        success: function (res) {
                                var shop_list = res.data.data;
                                for (var i = 0; i < shop_list.length; i++) {
                                        shop_list[i].checked = false;
                                        if (shop_list[i].status == 0 || shop_list[i].status == null) {
                                                shop_list[i].number = 0;
                                        };
                                        if (shop_list[i].activity == "ltbuy") {
                                                that.setData({
                                                        activity: shop_list[i].activity
                                                })
                                        }
                                }
                                that.setData({
                                        shop_list: shop_list
                                })
                                console.log(shop_list)
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
                this.onLoad();
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})