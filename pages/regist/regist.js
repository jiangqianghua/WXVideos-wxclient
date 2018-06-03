// pages/regist/regist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  doRegist:function(e){
    var fromObject = e.detail.value;
    var username = fromObject.username;
    var password = fromObject.password;
    if(username.length == 0 ||
    password.length == 0){
      wx.showToast({
        title: '用户名或密码不能为空',
        icon:'none',
        duration:3000
      })
    }else{
      var serverUrl = app.serverUrl ;
      wx.showLoading({
        title: '请等待...',
      });
      wx.request({
        url: serverUrl+'/regist',
        method:'POST' ,
        data:{
          username:username,
          password:password
        },
        header:{
          'content-type':'application/json'
        },
        success:function(res){
          wx.hideLoading();
          console.log(res);
          var status = res.data.status;
          if(status == 200){
            wx.showToast({
              title: '用户注册成功!!!',
              icon: 'none',
              duration: 3000
            })
            //app.userInfo = res.data.data;
            app.setGlobalUserInfo(res.data.data);
          } else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },

  goLoginPage:function(e){
    wx.redirectTo({
      url: '../login/login',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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