var uploadVideo = function() {
  wx.chooseVideo({
    sourceType: ['album', 'camera'],
    camera: 'back',
    success: function (res) {
      console.log(res);
      var duration = res.duration;
      var tempFilePath = res.tempFilePath;
      var size = res.size;
      var height = res.height;
      var width = res.width;

      if (duration > 11) {
        wx.showToast({
          title: '视频长度不能超过10秒',
          icon: 'none',
          duration: 2500
        });
      } else if (duration < 1) {
        wx.showToast({
          title: '你拍摄的视频太短',
          icon: 'none',
          duration: 2500
        });
      }
      else {
        // 打开选择pgm的页面
        wx.navigateTo({
          url: '../choosebgm/choosebgm?duration=' + duration + "&tempFilePath=" + tempFilePath + "&size=" + size + "&height=" + height + "&width=" + width,
        })

      }
    }
  })
}

module.exports = {
  uploadVideo: uploadVideo
}