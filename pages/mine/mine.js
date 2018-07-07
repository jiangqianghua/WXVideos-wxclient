// pages/mine/mine.js
var videoUtil = require('../../utils/videoUtils.js');
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
    nickname:'',
    isMe:true,
    isFollow:false,
    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",

    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,

    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    followVideoList: [],
    followVideoPage: 1,
    followVideoTotal: 1,

    myWorkFalg: false,
    myLikesFalg: true,
    myFollowFalg: true
  },

  logout:function(e){
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
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
        // wx.showToast({
        //   title: '注销成功',
        //   icon: 'success',
        //   duration: 2000
        // });
        //app.userInfo = null ;
        wx.removeStorageSync("userInfo");
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
        var user = app.getGlobalUserInfo();
        wx.showLoading({
          title: '上传中...',
        })
        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + user.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json',
            'userId': user.id,
            'userToken': user.userToken
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
    var user = app.getGlobalUserInfo();
    var userId = user.id;
    var publisherId = options.publisherId ;
    if (publisherId != null && publisherId != '' && publisherId != undefined && publisherId
    != userId)    {
      userId = publisherId ;
      me.setData({
        isMe:false,
        publisherId: publisherId
      });
    }else{
      me.setData({
        isMe: true,
        publisherId: userId
      });
    } 
    me.updateUserData();

    me.getMyVideoList(1);
    
  },

  updateUserData:function(){
    var me = this;
    var publisherId = me.data.publisherId;
    var user = app.getGlobalUserInfo();
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/user/query?userId=' + publisherId + "&fanId=" + user.id,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'userId': user.id,
        'userToken': user.userToken
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 200) {
          var userInfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if (userInfo != null && userInfo.faceImage != undefined && userInfo.faceImage.length > 0) {
            faceUrl = serverUrl + userInfo.faceImage;
          }
          //app.userInfo = userInfo ;
          me.setData({
            faceUrl: faceUrl,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts,
            nickname: userInfo.username,
            isFollow: userInfo.follow
          });
        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
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
  uploadVideo:function(e){
    videoUtil.uploadVideo();
  },

  followMe:function(e){
    var me = this ;
    var user = app.getGlobalUserInfo();
    var userId = user.id ;
    var publisherId = me.data.publisherId;
    var followType = e.currentTarget.dataset.followtype;

    var url = '';
    if(followType == '1'){
      url = '/user/beyourfans?userId='+publisherId+'&fanId='+userId;

    }else{
      url = '/user/dontbeyourfans?userId=' + publisherId + '&fanId=' + userId;
    }

    wx.showLoading();
    wx.request({
      url: app.serverUrl + url,
      method:'POST',
      header: {
        'content-type': 'application/json',
        'userId': user.id,
        'userToken': user.userToken
      },
      success:function(res){
        wx.hideLoading();
        // if(followType == '1'){
        //   me.setData({
        //     isFollow:true
        //   });
        // }else{
        //   me.setData({
        //     isFollow: false
        //   });
        // }

        me.updateUserData();
      }
    })
  },


  doSelectWork: function () {
    this.setData({
      isSelectedWork: "video-info-selected",
      isSelectedLike: "",
      isSelectedFollow: "",

      myWorkFalg: false,
      myLikesFalg: true,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });
    this.getMyVideoList(1);
  },

  doSelectLike: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "video-info-selected",
      isSelectedFollow: "",

      myWorkFalg: true,
      myLikesFalg: false,
      myFollowFalg: true,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });
    this.getMyLikesList(1)
  },  

  doSelectFollow: function () {
    this.setData({
      isSelectedWork: "",
      isSelectedLike: "",
      isSelectedFollow: "video-info-selected",

      myWorkFalg: true,
      myLikesFalg: true,
      myFollowFalg: false,

      myVideoList: [],
      myVideoPage: 1,
      myVideoTotal: 1,

      likeVideoList: [],
      likeVideoPage: 1,
      likeVideoTotal: 1,

      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1
    });

    this.getMyFollowList(1);

  },


  getMyVideoList: function (page) {
    var me = this;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showAll/?page=' + page + '&pageSize=6',
      method: "POST",
      data: {
        userId: me.data.publisherId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var myVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.myVideoList;
        me.setData({
          myVideoPage: page,
          myVideoList: newVideoList.concat(myVideoList),
          myVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },


  getMyFollowList: function (page) {
    var me = this;
    var userId = me.data.publisherId ;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyFollow/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var followVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.followVideoList;
        me.setData({
          followVideoPage: page,
          followVideoList: newVideoList.concat(followVideoList),
          followVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },

  getMyLikesList: function (page) {
    var me = this;
    var userId = me.data.publisherId;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyLike/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var likeVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.likeVideoList;
        me.setData({
          likeVideoPage: page,
          likeVideoList: newVideoList.concat(likeVideoList),
          likeVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },

  getMyFollowList: function (page) {
    var me = this;
    var userId = me.data.publisherId;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyFollow/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var followVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.followVideoList;
        me.setData({
          followVideoPage: page,
          followVideoList: newVideoList.concat(followVideoList),
          followVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl
        });
      }
    })
  },


  // 到底部后触发加载
  onReachBottom: function () {
    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;

    if (!myWorkFalg) {
      var currentPage = this.data.myVideoPage;
      var totalPage = this.data.myVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyVideoList(page);
    } else if (!myLikesFalg) {
      var currentPage = this.data.likeVideoPage;
      var totalPage = this.data.myLikesTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyLikesList(page);
    } else if (!myFollowFalg) {
      var currentPage = this.data.followVideoPage;
      var totalPage = this.data.followVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyFollowList(page);
    }

  },

  // 点击跳转到视频详情页面
  showVideo: function (e) {

    console.log(e);

    var myWorkFalg = this.data.myWorkFalg;
    var myLikesFalg = this.data.myLikesFalg;
    var myFollowFalg = this.data.myFollowFalg;

    if (!myWorkFalg) {
      var videoList = this.data.myVideoList;
    } else if (!myLikesFalg) {
      var videoList = this.data.likeVideoList;
    } else if (!myFollowFalg) {
      var videoList = this.data.followVideoList;
    }

    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(videoList[arrindex]);

    wx.redirectTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})