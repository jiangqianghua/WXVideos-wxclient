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
    userLikeVideo:true

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

  },

  showIndex:function(){
    wx.redirectTo({
      url: '../list/list',
    })
  },

  upload:function(){
    videoUtil.uploadVideo();
  },

  videotap:function(e){
    var me = this;
    //me.videoCtx.pause();
  },

  showMine:function(e){
    wx.navigateTo({
      url: '../mine/mine',
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
    //me.videoCtx.stop();
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