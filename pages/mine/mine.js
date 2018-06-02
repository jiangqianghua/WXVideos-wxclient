// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faceUrl:"../resource/images/noneface.png",
    fansCounts:0,
    followCounts:0,
    receiveLikeCounts:0,
    nickname:''
  },

  logout:function(e){
    var serverUrl = app.serverUrl;
    var user = app.userInfo;
    if(user == undefined)
      return ;
    wx.request({
      url: serverUrl + '/logout',
      method: 'POST',
      data: {
        userId: user.userid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '注销成功',
          icon: 'success',
          duration: 2000
        });
        app.userInfo = null ;
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })
  },

  changeFace:function(e){
    var that = this ;
    wx.chooseImage({
      count:1,
      //sourceType:['album'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        var serverUrl = app.serverUrl;
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId='+app.userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json'
          },
          success:function(res){
            var data = JSON.parse(res.data);
            if (data.status == 200){
              console.log(data);
              wx.hideLoading();
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              });

              that.setData({
                faceUrl: serverUrl + data.data
              });
            }else{
              wx.hideLoading();
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
              });
            }
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 从服务器获取当前对象
    var me = this;
    var user = app.userInfo ;
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/user/query?userId=' + user.id,
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res);
        if(res.data.status == 200){
          var userInfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png" ; 
          if (userInfo != null &&  userInfo.faceImage != undefined && userInfo.faceImage.length > 0){
            faceUrl = serverUrl + userInfo.faceImage ;
          }
          app.userInfo = userInfo ;
          me.setData({
            faceUrl: faceUrl,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts,
            nickname: userInfo.username
          });
        }
      }
    })
  },

  uploadVideo:function(e){
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: function (res) {
        console.log(res);
        var duration = res.duration;
        var tempFilePath = res.tempFilePath ; 
        var size = res.size ; 
        var height = res.height ; 
        var width = res.width ;

        if(duration > 11){
          wx.showToast({
            title: '视频长度不能超过10秒',
            icon: 'none',
            duration: 2500
          });
        } else if(duration < 1){
          wx.showToast({
            title: '你拍摄的视频太短',
            icon: 'none',
            duration: 2500
          });
        }
        else{
          // 打开选择pgm的页面
          wx.navigateTo({
            url: '../choosebgm/choosebgm?duration=' + duration + "&tempFilePath=" + tempFilePath + "&size=" + size + "&height=" + height + "&width=" + width,
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