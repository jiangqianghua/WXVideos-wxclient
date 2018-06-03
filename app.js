//app.js
App({
  serverUrl:"http://192.168.1.102:8081",
  resUrl:"http://192.168.1.102/wxvideos/",
  userInfo:null,
  setGlobalUserInfo:function(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo: function (user) {
    return wx.getStorageSync("userInfo")
  }
})