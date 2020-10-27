// pages/songDetail/songDetail.js
import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    songDetail: {}, // 音乐详情对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // console.log(options.song);
    // // JSON.parse 将json的对象或者json的数组转换成原生js对象或者数组
    //
    // // 原生小程序对url长度有限制，如果url长度过长会自动截取掉超出的部分
    // let song = JSON.parse(options.song);
    
    
    // 获取路由参数
    let musicId = options.musicId;
    this.getMusicInfo(musicId);
    
  },
  
  // 获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songDetailData = await request('/song/detail', {ids: musicId});
    this.setData({
      songDetail: songDetailData.songs[0]
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
