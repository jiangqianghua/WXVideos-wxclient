//app.js
App({
  serverUrl:"http://192.168.1.103:8081",
  userInfo:null,
  setGlobalUserInfo:function(user){
    wx.setStorageSync("userInfo", user)
  },
  getGlobalUserInfo: function (user) {
    return wx.getStorageSync("userInfo")
  },

  reportReasonArray:[
    '色情低俗',
    '政治敏感',
    '涉嫌诈骗',
    '侮辱谩骂',
    '广告垃圾',
    '诱导分享',
    '其他原因'
  ]
})