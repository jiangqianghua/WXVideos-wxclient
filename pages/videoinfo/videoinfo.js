// pages/videoinfo/videoinfo.js
var videoUtil = require('../../utils/videoUtils.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover:'cover',
    src:'',
    video:'',
    videoInfo:{},
    publishUserInfo:{},
    userLikeVideo:false,
    placeholder:"说点什么",

    commentsPage:1,
    commentsTotalPage:1,
    commentsList:[]

  },
  //http://192.168.1.102:8081/180601HCP7AXFXKP/video/tmp_ee98e9cc60d8d12d73b5ff1e90b1d622.mp4

  showSearch:function(e){
    wx.navigateTo({
      url: '../searchVideo/searchVideo',
    })
  },
  videoCtx:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var me = this ;
    var videoInfo = JSON.parse(options.videoInfo);
    var height = videoInfo.videoHeight ; 
    var width = videoInfo.videoWidth ;
    var cover = 'cover';
    if(width >= height){
      cover = '';
    }

    this.setData({
      src: app.serverUrl + videoInfo.videoPath,
      videoInfo:videoInfo,
      videoId:videoInfo.id,
      cover:cover
    });

    var me = this ; 
    me.videoCtx = wx.createVideoContext("myVideo");

    var serverUrl = app.serverUrl ;
    var user = app.getGlobalUserInfo();
    var loginUserId = '';
    if (user != null && user != undefined ||
      user != ''){
      loginUserId = user.id;
    }

    var videoInfo = me.data.videoInfo;
    wx.request({
      url: serverUrl + "/user/queryPublisher?loginUserId=" + user.id + "&videoId=" + videoInfo.id +"&publishUserId="+videoInfo.userId,
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res);
        var publisher = res.data.data.usersVo;
        var userLikeVideo = res.data.data.userLikeVideo;
        me.setData({
          serverUrl:serverUrl,
          publisher:videoInfo,
          userLikeVideo: userLikeVideo
        });
      }
    })
    me.getCommentsList(1);
  },

  showIndex:function(){
    wx.redirectTo({
      url: '../list/list',
    })
  },

  upload:function(){
    var user = app.getGlobalUserInfo();
    var videoInfo  = JSON.stringify(this.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
    if (user == null || user == undefined ||
      user == '') {
      wx.navigateTo({
        url: '../login/login?redirectUrl='+realUrl,
      })
    } else {
      videoUtil.uploadVideo();
    }
  },

  videotap:function(e){
    var me = this;
    //me.videoCtx.pause();
  },

  showMine:function(e){
    var user = app.getGlobalUserInfo();
    if(user == null || user == undefined ||
    user == ''){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      wx.navigateTo({
        url: '../mine/mine',
      })
    }
  },

  likeVideoOrNot:function(e){
    var me = this ; 
    var videoInfo = me.data.videoInfo ;
    var user = app.getGlobalUserInfo();
    if (user == null || user == undefined ||
      user == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      var userLikeVideo = me.data.userLikeVideo ;
      var url = '/video/userLike?userId=' + user.id + '&videoId=' + videoInfo.id +'&videoCreateId='+videoInfo.userId;
      if(userLikeVideo){
        url = '/video/userUnLike?userId=' + user.id + '&videoId=' + videoInfo.id + '&videoCreateId=' + videoInfo.userId;
      }
      var serverUrl = app.serverUrl ;
      wx.request({
        url: serverUrl+url,
        method:'POST',
        header: {
          'content-type': 'application/json',
          'userId': user.id,
          'userToken': user.userToken
        },
        success:function(res){
            me.setData({
              userLikeVideo: !userLikeVideo
            });
        }

      })
    }

  },

  showPublisher:function(e){
    var me = this; 
    var user = app.getGlobalUserInfo();
    var videoInfo = me.data.videoInfo ;
    var realUrl = '../mine/mine#publisherId@' + videoInfo.userId;
    if (user == null || user == undefined ||
      user == '') {
      wx.navigateTo({
        url: '../login/login?redirectUrl=' + realUrl,
      })
    } else {
      wx.navigateTo({
        url: '../mine/mine?publisherId='+videoInfo.userId
      })
    }
    
    
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
    var me = this;
    me.videoCtx.play();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var me = this;
    me.videoCtx.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //debugger;
    var me = this;
    me.videoCtx.stop();
  },


  shareMe:function(){
    var me = this;
    var publishUserId = me.data.videoInfo.userId;
    var videoId = me.data.videoInfo.id;
    wx.showActionSheet({
      itemList: ['下载到本地','举报用户','分享到朋友圈'],
      success:function(res){
        res.tapIndex;
        if(res.tapIndex == 0){
          // 下载
          wx.showLoading({
            title: '下载中...'
          })
          wx.downloadFile({
            url:app.serverUrl+me.data.videoInfo.videoPath,
            success:function(res){
              if(res.statusCode === 200){
                console.log(res.tempFilePath);
                // 保存到相册
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success:function(res){    
                    wx.hideLoading();
                    console.log(res);
                  }
                })
              }
            }
          })
        }else if(res.tapIndex == 1){
          // 举报用户
          var user = app.getGlobalUserInfo();
          var videoInfo = JSON.stringify(this.data.videoInfo);
          var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
          if (user == null || user == undefined ||
            user == '') {
            wx.navigateTo({
              url: '../login/login?redirectUrl=' + realUrl,
            })
          } else {
            wx.navigateTo({
              url: '../report/report?publishUserId=' + publishUserId + '&videoId=' + videoId
            })
          }
        }else if(res.tapIndex == 2){
          // 分享到朋友圈
        }
      }
    })
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
    var me = this ; 
    var currentPage = me.data.commentsPage ; 
    var totalPage = me.data.commentsTotalPage;
    if(currentPage === totalPage){
      return ;
    }
    var page = currentPage + 1; 
    me.getCommentsList(page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var me = this ; 
    var videoInfo = me.data.videoInfo;
    if(res.from === 'button'){
      console.log(res.target);
    }
    return {
      title:'短视频分享',
      path: 'pages/videoinfo/videoinfo?videoInfo' + JSON.stringify(videoInfo)
    }
  },

  leaveComment:function(res){
    this.setData({
      commentFocus:true
    });
  },

  saveComment:function(e){
    var me = this ;
    var content = e.detail.value;
    var user = app.getGlobalUserInfo();
    var videoInfo = JSON.stringify(this.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;
    if (user == null || user == undefined ||
      user == '') {
      wx.navigateTo({
        url: '../login/login?redirectUrl=' + realUrl,
      })
    } else {
      wx.showLoading({
        title: '请稍后...',
      })
      wx.request({
        url: app.serverUrl +'/video/saveComment',
        method:'POST',
        header: {
          'content-type': 'application/json',
          'userId': user.id,
          'userToken': user.userToken
        },
        data:{
          videoId: this.data.videoInfo.id,
          fromUserId:user.id,
          comment:content
        },
        success:function(res){
          wx.hideLoading();
          console.log(res);
          me.setData({
            contentValue:'',
            commentsList:[]
          });

          me.getCommentsList(1);
        }
      })
    }
  },

  // commentsPage: 1,
  // commentsTotalPage: 1,
  // commentsList: []

  getCommentsList:function(page){
    var me = this ; 
    var videoId = me.data.videoInfo.id;
  
    wx.request({
      url: app.serverUrl + '/video/getVideoComments?videoId='+videoId+'&page='+page+'&pageSize='+5,
      method:'POST',
      success:function(res){
        console.log(res);
        var commentslist = res.data.data.rows;
        var newCommentsList = me.data.commentsList;
        // if(page == 1)
        //   newCommentsList = [];
        me.setData({
          commentsList:newCommentsList.concat(commentslist),
          commentsPage: page,
          commentsTotalPage: res.data.data.total
        });
      }
    })
  }
})