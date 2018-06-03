// pages/list/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 350,
    serverUrl:'',
    totalPage:1,
    page:1,
    videoList:[
      // {
      //   coverPath: "/18060277D28X28ZC/video/tmp_4649513b5adcf860b4acc08271fcecc7.jpg",
      //   faceImage: '/180601HCP7AXFXKP/face/wxf67373492f3bce91.o6zAJsz16WVof6bXd8lCMMadLBs4.GmfIagBZeauqb15c113aeddbeb606d938010b88cf8e6.png',
      //   nickName:'胡丹'
      // }
    ],
    searchContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var me = this;
    var serverUrl = app.serverUrl;
    me.setData({
      serverUrl:app.serverUrl
    });
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth,
    });
    var searchContent = options.search;
    var isSaveRecord = options.isSaveRecord ; 
    if(isSaveRecord == null || isSaveRecord == '' || isSaveRecord == undefined){
      isSaveRecord = 0 ;
    }
    if(searchContent != undefined){
      me.setData({
        searchContent: searchContent
      });
    }
    //当前分页数
    var page = me.data.page;
    this.getAllVideoList(page, isSaveRecord);
  },

  getAllVideoList: function (page, isSaveRecord){
    var me = this ;
    var serverUrl = app.serverUrl;
    wx.showLoading({
      title: '加载中...',
    });
    var searchContent = me.data.searchContent ;
    wx.request({
      url: serverUrl + '/video/showAll?page=' + page+"&isSaveRecord="+isSaveRecord,
      method: "POST",
      data:{
        videoDesc: searchContent
      },
      success: function (res) {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        console.log(res);
        // 设置上拉刷新
        if (page === 1) {
          me.setData({
            videoList: []
          });
        }

        var videoList = res.data.data.rows;
        var newVideoList = me.data.videoList;
        //concat 拼接数组
        me.setData({
          videoList: newVideoList.concat(videoList),
          page: page,
          totalPage: res.data.data.total,

        });
      }

    })
  },

  onReachBottom:function(){
    var me = this ; 
    var currentPage = me.data.page;
    var totalPage = me.data.totalPage ;
    if (currentPage === totalPage){
      wx.showToast({
        title: '已经到底了',
        icon:'none'
      });
      return ;
    }
    var page = currentPage + 1 ;
    me.getAllVideoList(page,0);
  },
  showVideoInfo:function(e){
   console.log(e);
   var serverUrl = app.serverUrl;
   var index = e.target.dataset.arrindex;
   var videoInfo = JSON.stringify(this.data.videoList[index]);
   wx.navigateTo({
     url: '../videoinfo/videoinfo?videoInfo=' + videoInfo,
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
    wx.showNavigationBarLoading();// 导航栏显示加载动画
    this.getAllVideoList(1,0);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})