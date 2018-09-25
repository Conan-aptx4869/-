var https = wx.getStorageSync("https");
var m_id = wx.getStorageSync("m_id");
Page({
        /**
         * 页面的初始数据
         */
        data: {
                condition: false,
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                var adr_id = options.adr_id;
                this.setData({
                        adr_id: adr_id
                })
                //获取地址标签
                wx.request({
                        url: https + "System/getAddress_tags",
                        success: function (res) {
                                var label = res.data.data;
                                that.setData({
                                        label: label
                                })
                        }
                })

                //获取省份
                wx.request({
                        url: https + "System/getRegion",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                reg_id: 100000
                        },
                        success: function (res) {
                                var provinces = res.data.data;
                                var pindex = provinces[0].reg_id;
                                that.setData({
                                        provinces: provinces,
                                        province: provinces[0].region_name,
                                        province_id: pindex
                                });
                                wx.request({
                                        url: https + "System/getRegion",
                                        method: "POST",
                                        header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: {
                                                reg_id: pindex
                                        },
                                        success: function (res) {
                                                //  console.log(res)
                                                var citys = res.data.data;
                                                var cindex = citys[0].reg_id;
                                                that.setData({
                                                        citys: citys,
                                                        city: citys[0].region_name,
                                                        city_id: cindex
                                                });
                                                wx.request({
                                                        url: https + "System/getRegion",
                                                        method: "POST",
                                                        header: {
                                                                'content-type': 'application/x-www-form-urlencoded'
                                                        },
                                                        data: {
                                                                reg_id: cindex
                                                        },
                                                        success: function (res) {
                                                                var countys = res.data.data;
                                                                var aindex = countys[0].reg_id;
                                                                that.setData({
                                                                        countys: countys,
                                                                        county: countys[0].region_name,
                                                                        county_id: aindex
                                                                });
                                                                //判断adr_id是否有值，有---> 修改，无--> 新增
                                                                if (adr_id == undefined) {

                                                                } else if (adr_id != undefined) {
                                                                        //获取地址信息
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
                                                                                                contacts: data.contacts,
                                                                                                mobile: data.mobile,
                                                                                                province: data.province_name,
                                                                                                city: data.city_name,
                                                                                                county: data.area_name,
                                                                                                province_id: data.province_id,
                                                                                                city_id: data.city_id,
                                                                                                county_id: data.county_id,
                                                                                                address: data.address,
                                                                                                address_tag: data.address_tag
                                                                                        });
                                                                                        //console.log(data.province_name, data.city_name, data.area_name)
                                                                                }
                                                                        })
                                                                }
                                                        }
                                                })
                                        }
                                })
                        }
                })

        },
        bindChange: function (e) {
                var that = this;
                var pIndex = (e.detail.value)[0];
                var provinces = this.data.provinces;
                var cReg_id = provinces[pIndex].reg_id;
                // console.log(provinces[pIndex].reg_id);
                //   console.log(provinces)
                that.setData({
                        province: provinces[pIndex].region_name,
                        province_id: cReg_id
                })
                wx.request({
                        url: https + "System/getRegion",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                reg_id: cReg_id,
                        },
                        success: function (res) {
                                var citys = res.data.data;
                                var cIndex = (e.detail.value)[1];
                                var aReg_id = citys[cIndex].reg_id;
                                that.setData({
                                        citys: citys,
                                        city: citys[cIndex].region_name,
                                        city_id: aReg_id
                                });
                                //   console.log(aReg_id);
                                wx.request({
                                        url: https + "System/getRegion",
                                        method: "POST",
                                        header: {
                                                'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: {
                                                reg_id: aReg_id
                                        },
                                        success: function (res) {
                                                var countys = res.data.data;
                                                var aIndex = (e.detail.value)[2];
                                                var xReg_id = countys[aIndex].reg_id;
                                                that.setData({
                                                        countys: countys,
                                                        county: countys[aIndex].region_name,
                                                        county_id: xReg_id
                                                });
                                                //  console.log(xReg_id);
                                                //  console.log("______________________________")
                                        }
                                })
                        }
                })


        },
        open: function () {
                this.setData({
                        condition: !this.data.condition
                })
        },

        formSubmit: function (e) {
                var adr_id = this.data.adr_id;
                console.log(adr_id);
                var value = e.detail.value;
                //姓名
                var contacts = value.name;
                //手机号
                var mobile = value.tel;
                // 所在省市区
                var area = value.input7;
                var areaStr = area.split(" ");
                var province_name = areaStr[0];
                var city_name = areaStr[1];
                var area_name = areaStr[2];

                //详细地址
                var address = value.address;
                //地址标签

                //省市区的id
                var province_id = e.detail.target.dataset.province_id;
                var city_id = e.detail.target.dataset.city_id;
                var area_id = e.detail.target.dataset.area_id;

                //地址标签
                var address_tag = this.data.address_tag;
                //正则
                var str1 = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$/;
                var str2 = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                if (str1.test(contacts) == false || contacts == "") {
                        wx.showModal({
                                title: '提示',
                                content: '请填写你的中文名字！',
                        })
                } else if (str2.test(mobile) == false || mobile == "") {
                        wx.showModal({
                                title: '提示',
                                content: '请正确填写手机号码！',
                        })
                } else if (address == "") {
                        wx.showModal({
                                title: '提示',
                                content: '请填写您的详细地址！',
                        })
                } else {
                        wx.request({
                                url: https + "Center/updAddress",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                        m_id: m_id,
                                        contacts: contacts,
                                        mobile: mobile,
                                        province_id: province_id,
                                        province_name: province_name,
                                        city_id: city_id,
                                        city_name: city_name,
                                        area_id: area_id,
                                        area_name: area_name,
                                        address: address,
                                        is_default: 0,
                                        address_tag: address_tag,


                                        adr_id: adr_id == "undefined" ? "" : adr_id,
                                },
                                success: function (res) {
                                        if (res.data.flag == "success") {
                                                wx.showToast({
                                                        title: res.data.message,
                                                        icon: "success",
                                                        success: function () {
                                                                setTimeout(function () {
                                                                        wx.navigateBack({
                                                                                delta: 1
                                                                        })
                                                                }, 1500)
                                                        }
                                                })


                                        }else{
                                               wx.showModal({
                                                       title: '提示',
                                                       content: res.data.message,
                                               })
                                        }
                                        console.log(res)

                                }
                        })
                }
        },

        //地址标签选择
        addrLabelSelect: function (e) {
                var selectId = e.currentTarget.dataset.cid;
                var address_tag = e.currentTarget.dataset.text;
                this.setData({
                        selectId: selectId,
                        address_tag: address_tag
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