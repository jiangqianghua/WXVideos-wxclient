// pages/choosebgm/choosebgm.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resUrl: app.serverUrl,
    bgmList:[
      {
        id:0,
        poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
        name: '此时此刻',
        author: '许巍',
        path: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
      }
    ],
    videoParams: {}
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      videoParams:options
    });    
    var me = this ; 
    wx.showLoading({
      title: '获取bgm列表',
    });
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl+'/bgm/list',
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        wx.hideLoading();
        console.log(res);
        if(res.data.status == 200){
          me.setData({
            bgmList:res.data.data
          });
        }else{

        }
      }
    })
  },

  upload:function(e){
    var me = this ;
    var bgmId = e.detail.value.bgmId;
    var desc = e.detail.value.desc ;
    var duration = me.data.videoParams.duration;
    var tempFilePath = me.data.videoParams.tempFilePath;
    var size = me.data.videoParams.size;
    var height = me.data.videoParams.height;
    var width = me.data.videoParams.width;
    wx.showLoading({
      title: '上传中...',
    })
    // 上传
    var serverUrl = app.serverUrl;
    var userInfo = app.getGlobalUserInfo();
    wx.uploadFile({
      url: serverUrl+'/video/upload',
      formData:{
        userId: userInfo.id,
        bgmId:bgmId,
        desc:desc,
        videoSeconds:duration,
        videoWidth: width,
        videoHeight: height
      },
      filePath: tempFilePath,
      name: 'file',
      header: {
        'content-type': 'application/json',
        'userId': userInfo.id,
        'userToken': userInfo.userToken
      },
      success:function(res){
        wx.hideLoading();
        var data = JSON.parse(res.data);
        if(data.status == 200){
          wx.showToast({
            title: '上传成功',
            icon:'success'
          });
          wx.navigateBack({
            delta:1
          })
        }else if(data.status == 500){
          wx.showToast({
            title: '上传失败',
            icon:'none'
          })
        } else if (data.status == 502) {
          wx.showToast({
            title: data.msg,
            icon: "none",
            duration: 3000,
            success: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        }
      }

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