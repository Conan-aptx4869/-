var https=wx.getStorageSync("https");
var m_id=wx.getStorageSync("m_id");
Page({
        /**
         * 页面的初始数据
         */
        data: {
                index1: 0,
                index2: 0,
                index3: 0,
                index4: 0,
                region: ['北京市', '北京市', '东城区'],
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that=this;
                
                wx.request({
                        url: https +"Customize/getAttribute",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data:{
                                flag:"house_type"
                        },
                        success:function(res){
                                var house=res.data.data;
                                that.setData({
                                        house: house
                                })
                        }
                });
                wx.request({
                        url: https + "Customize/getAttribute",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                flag: "acreage"
                        },
                        success: function (res) {
                                var area = res.data.data;
                                that.setData({
                                        area: area
                                })
                        }
                });
                wx.request({
                        url: https + "Customize/getAttribute",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                flag: "style"
                        },
                        success: function (res) {
                            
                                var style = res.data.data;
                                that.setData({
                                        style: style
                                })
                        }
                });
                wx.request({
                        url: https + "Customize/getAttribute",
                        method: "POST",
                        header: {
                                'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                                flag: "price"
                        },
                        success: function (res) {
                                var price = res.data.data;
                                that.setData({
                                        price: price
                                })
                        }
                })
        },
        formSubmit: function (e) {
                //手机号
                var mobile = e.detail.value.tel;
                var str = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                //位置
                var province_name = e.detail.target.dataset.province;
                var city_name = e.detail.target.dataset.city;
                var area_name = e.detail.target.dataset.areas;
                //风格
                var style = e.detail.target.dataset.style;
                //户型
                var house_type = e.detail.target.dataset.house;
                //面积
                var acreage = e.detail.target.dataset.area;
                //价位
                var price = e.detail.target.dataset.price;
                if (str.test(mobile) == false) {
                        wx.showModal({
                                title: '提示',
                                content: '请正确填写手机号码！',
                        })
                }else{
                        wx.request({
                                url: https +"Customize/submit",
                                method: "POST",
                                header: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                data:{
                                        m_id:m_id,
                                        mobile: mobile,
                                        province_name:city_name,
                                        city_name: city_name,
                                        area_name: area_name,
                                        style: style,
                                        house_type: house_type,
                                        acreage: acreage,
                                        price: price
                                },
                                success:function(res){
                                      if(res.data.flag=="success"){
                                              console.log(res)
                                             wx.showToast({
                                                     title: res.data.message,
                                                     icon:"success",
                                                     mask:true,
                                                     success:function(){
                                                             setTimeout(function(){
                                                                wx.navigateBack({
                                                                        delta:1
                                                                })
                                                             },1500)
                                                     },
                                                
                                             })
                                      }
                                }
                        })
                }
              
        },
        //位置选择
        bindRegionChange: function (e) {
             //   console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
                        region: e.detail.value
                })
        },

        //户型选择
        household: function (e) {
            //    console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
                        index1: e.detail.value
                })
        },
        //风格选择
        acreage: function (e) {
//                console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
                        index2: e.detail.value
                })
        },
        //面积选择
        styleChange: function (e) {
             //   console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
                        index3: e.detail.value
                })
        },



        //价位选择
        priceChange: function (e) {
              //  console.log('picker发送选择改变，携带值为', e.detail.value)
                this.setData({
                        index4: e.detail.value
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