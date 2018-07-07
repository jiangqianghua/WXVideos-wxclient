//app.js
App({
  serverUrl:"http://192.168.1.103:8081",
  userInfo:null,
  setGlobalUserInfo:function(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo: function (user) {
    return wx.getStorageSync("userInfo")
  }
})