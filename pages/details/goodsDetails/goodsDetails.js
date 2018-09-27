var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
var WxParse = require('../../../wxParse/wxParse.js');
Page({
        /* 页面的初始数据*/
        data: {
                number: 1,
                textArr: [],
                isIdArr: [],
                indicatorDots: true,
                autoplay: true,
                interval: 2000,
                duration: 1000,
                //所有图片的高度  （必须）
                imgheights: [],
                //图片宽度 
                imgwidth: 750,
                //默认  （必须）
                current: 0,


        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                var activity = options.activity;


                var goods_id = options.goods_id;
                console.log(goods_id, activity)
                //商品属性id
                var goods_attr_id = [];
                //商品属性名
                var goods_attr_name = [];

                this.setData({
                        goods_id: goods_id
                })
                wx.request({
                        url: https + "Goods/detail",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                goods_id: goods_id,
                                m_id: m_id,
                                activity: activity == 0 || activity == undefined ? "" : "ltbuy"
                        },
                        success: function (res) {
                                var data = res.data.data;
                                var imgUrls = data.pictures;
                                var is_coll = data.is_coll;
                                var goods_attr = data.goods_attr;

                                var comments_list = data.comments

                                //商品详情
                                var article = data.goods_desc;
                                var attrArr = [];
                                for (let i = 0; i < goods_attr.length; i++) {
                                        attrArr.push(null);
                                        goods_attr_id.push(goods_attr[i].attr_id);
                                        goods_attr_name.push(goods_attr[i].attr_name);
                                }
                                for (let i = 0; i < comments_list.length; i++) {
                                        var star = 5 - Number(comments_list[i].level);
                                        comments_list[i].level = Number(comments_list[i].level);
                                        comments_list[i].unlevel = star;

                                }

                                that.setData({
                                        activity: activity,


                                        attrArr: attrArr,
                                        imgUrls: imgUrls,
                                        goods_name: data.goods_name,
                                        stock: data.stock,
                                        market_price: data.market_price,
                                        price: data.price,
                                        cardPrice: data.discount_card_price,
                                        carts: data.carts,
                                        //评论总数
                                        comm_count: data.comm_count,
                                        //商品属性
                                        goods_attr: goods_attr,

                                        //评价列表
                                        comments_list: comments_list,

                                        //商品详情
                                        article: WxParse.wxParse('article', 'html', article, that, 5),

                                        //是否收藏
                                        is_coll: is_coll,
                                        //商品属性id
                                        goods_attr_id: goods_attr_id,
                                        //商品属性name
                                        goods_attr_name: goods_attr_name,

                                });
                                console.log(res)
                        }

                });

                //获取用户地址
                var adr_id = wx.getStorageSync("adr_id");
                if (adr_id == undefined || adr_id == "") {
                        this.setData({
                                adr_id: adr_id
                        })
                } else {
                        var that = this;
                        wx.request({
                                url: https + "Center/address",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        adr_id: adr_id
                                },
                                success: function (res) {
                                        var data = res.data.data;
                                        that.setData({
                                                province_name: data.province_name,
                                                city_name: data.city_name,
                                                area_name: data.area_name,
                                                address: data.address,
                                                adr_id: adr_id
                                        })

                                        console.log(res)
                                }
                        })
                }

        },

        //跳转到收货地址
        addressTap: function () {
                wx.navigateTo({
                        url: '../../mine/address/address',
                })
        },
        //选择商品规格
        selecteSpeTap: function (e) {
                var that = this;
                var sid = e.currentTarget.dataset.sid;
                var pid = e.currentTarget.dataset.pid;
                //商品属性名
                var text = e.currentTarget.dataset.text;
                var goods_attr = this.data.goods_attr;
                var isIdArr = this.data.isIdArr;
                var attrArr = this.data.attrArr;
                attrArr[pid] = sid;

                var goods_attrid = (goods_attr[pid].attr_values)[sid].goods_attr_id;

                isIdArr.push({ pid: pid, goods_attrid: goods_attrid, text: text });
                for (var k = 0; k < isIdArr.length; k++) {
                        for (var l = k + 1; l < isIdArr.length; l++) {
                                if (isIdArr[k].pid == isIdArr[l].pid) {
                                        isIdArr.splice(k, 1);
                                }
                        }
                }
                this.setData({
                        attrArr: attrArr,
                        //     textArr: textArr,
                        isIdArr: isIdArr

                });
                function compare(property) {
                        return function (a, b) {
                                var value1 = a[property];
                                var value2 = b[property];
                                return value1 - value2;
                        }
                }
                isIdArr.sort(compare('pid'));
                this.setData({
                        isIdArr: isIdArr
                })
                var isIdArr2 = [];
                for (var m = 0; m < isIdArr.length; m++) {
                        isIdArr2.push(isIdArr[m].goods_attrid)
                }

                var isIdstr = isIdArr2.join("|");
                //判断商品属性是否全部选择完
                for (var i = 0; i < attrArr.length; i++) {
                        if (attrArr[i] != null && attrArr[i + 1] != null) {
                                wx.request({
                                        url: https + "Goods/getStockPrice",
                                        method: "POST",
                                        header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: {
                                                goods_id: that.data.goods_id,
                                                goods_attr_ids: isIdstr,
                                        },
                                        success: function (res) {
                                                var data = res.data.data;
                                                that.setData({
                                                        stock: data.stock,
                                                        cardPrice: data.discount_card_price,
                                                        price: data.price,
                                                        isIdstr: isIdstr
                                                })
                                        }
                                })
                        }

                }

        },


        //数量加减
        subTap: function () {
                var n = this.data.number;
                n--;
                if (n < 0) {
                        this.setData({
                                number: 0
                        })
                } else {
                        this.setData({
                                number: n
                        })
                }

        },
        addTap: function () {
                var n = this.data.number;
                n++;
                this.setData({
                        number: n
                })
        },


        //加入购物车
        addShopCart: function (e) {
                var activity = this.data.activity;
                console.log("activity:" + activity)
                var cart_id;
                var that = this;
                //是购买还是购物车
                var goods_id = that.data.goods_id;
                var num = this.data.number;
                //商品属性值ID字符串
                var isIdstr = that.data.isIdstr;
                //商品属性名字符串
                var goods_attr_name = that.data.goods_attr_name;
                var isIdArr = that.data.isIdArr;
                var goodsInfo = [];
                for (let i = 0; i < isIdArr.length; i++) {
                        goodsInfo.push(goods_attr_name[i] + ":" + isIdArr[i].text)
                };
                var goodsInfoStr = goodsInfo.join(" ");
                var attrArr = that.data.attrArr;
                //商品属性未选择完不允许加入购物车
                if (goodsInfo.length != attrArr.length) {
                        for (var i = 0; i < attrArr.length; i++) {
                                if (attrArr[i] == null) {
                                        wx.showModal({
                                                title: '提示',
                                                content: '请选择商品的属性',
                                        })
                                }
                        }
                } else if (num <= 0) {
                        wx.showModal({
                                title: '提示',
                                content: '请选择商品的数量',
                        })
                } else {
                        wx.request({
                                url: https + "cart/addToCart",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        goods_id: goods_id,
                                        number: num,
                                        goods_attr_ids: isIdstr == undefined ? "" : isIdstr,
                                        goods_attr_desc: goodsInfoStr,
                                        activity: activity == 0 ? "" : "ltbuy"
                                },
                                success: function (res) {
                                        cart_id = res.data.data.cart_id;
                                        if (res.data.flag == "error") {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                });
                                        } else {
                                                wx.showModal({
                                                        title: '提示',
                                                        content: res.data.message,
                                                });
                                                that.setData({
                                                        cart_id: cart_id
                                                });
                                        };

                                }
                        });

                }

        },

        //跳转到购物车页面
        shoppingCart: function (e) {
                console.log(e)
                wx.switchTab({
                        url: '../../shop/shop',
                });
        },

        //购买
        spnedTap: function (e) {
                var activity = this.data.activity;
                var that = this;
                //商品数量
                var num = this.data.number;
                var attrArr = this.data.attrArr;
                var isIdArr = this.data.isIdArr;
                //商品属性未选择完不允许购买
                if (isIdArr.length != attrArr.length) {
                        for (var i = 0; i < attrArr.length; i++) {
                                if (attrArr[i] == null) {
                                        wx.showModal({
                                                title: '提示',
                                                content: '请选择商品的属性',
                                        })
                                }
                        }
                } else if (num <= 0) {
                        wx.showModal({
                                title: '提示',
                                content: '请选择商品的数量',
                        })
                } else {
                        this.addShopCart(e);
                        setTimeout(function () {
                                var cart_id = that.data.cart_id;
                                console.log(cart_id)
                                wx.navigateTo({
                                        url: '../placeOrder/placeOrder?cart_id=' + cart_id + "&activity=" + activity,
                                })
                      
                        }, 1000)

        

                }

        },

        //图片高度自适应
        imageLoad: function (e) {//获取图片真实宽度  
                var imgwidth = e.detail.width,
                        imgheight = e.detail.height,
                        //宽高比  
                        ratio = imgwidth / imgheight;
                //计算的高度值  
                var viewHeight = 750 / ratio;
                var imgheight = viewHeight;
                var imgheights = this.data.imgheights;
                //把每一张图片的对应的高度记录到数组里  
                imgheights[e.target.dataset.id] = imgheight;
                this.setData({
                        imgheights: imgheights
                })
        },

        //收藏
        collectionTap: function () {
                var is_coll = this.data.is_coll;
                var goods_id = this.data.goods_id;
                var that = this;
                wx.request({
                        url: https + "Goods/goodsCollection",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                m_id: m_id,
                                goods_id: goods_id,
                                is_coll: is_coll == 0 ? "0" : "1"
                        },
                        success: function (res) {
                                if (is_coll == 0) {
                                        that.setData({
                                                is_coll: 1
                                        });
                                        wx.showToast({
                                                title: res.data.message,
                                        })
                                } else {
                                        that.setData({
                                                is_coll: 0
                                        });
                                        wx.showToast({
                                                title: res.data.message,
                                        })
                                }
                        },
                        fail: function (res) {
                                console.log(res)
                        }
                })
        },
        // 图片预览
        // previewImage: function (e) {
        //         var current = e.target.dataset.src
        //         wx.previewImage({
        //                 current: current,
        //                 urls: this.data.images
        //         })
        // },

        //查看全部商品列表
        allCommentTap: function (e) {
                var goods_id = e.currentTarget.dataset.goodsid;
                wx.navigateTo({
                        url: 'allComment/allComment?goods_id=' + goods_id,
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
})