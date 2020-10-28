// pages/songDetail/songDetail.js
import request from "../../utils/request";
// 获取整个应用实例， 注意： 修改全局数据globalData直接对象.属性修改即可
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 音乐是否播放
    songDetail: {}, // 音乐详情对象
    musicId: '', // 音乐id
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
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId);
    
    // 判断当前页面的音乐是否在播放，如果在播放要修改当前页面的播放状态isPlay
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay: true
      })
    }
    
    // 创建控制音乐的实例对象
    this.backgroundAudioManager =  wx.getBackgroundAudioManager();
    // 部署监听音乐播放/暂停/停止的回调
    this.backgroundAudioManager.onPlay(() => {
      this.changeState(true);
      appInstance.globalData.musicId = musicId;
    })
    this.backgroundAudioManager.onPause(() => {
      this.changeState(false);
    })
  
    this.backgroundAudioManager.onStop(() => {
      this.changeState(false);
    })
  
  
  },
  
  // 封装修改状态的功能函数
  changeState(isPlay){
    this.setData({
      isPlay
    })
    // 修改全局状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  
  // 获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songDetailData = await request('/song/detail', {ids: musicId});
    this.setData({
      songDetail: songDetailData.songs[0]
    })
    
    // 动态设置窗口标题
    wx.setNavigationBarTitle({
      title: this.data.songDetail.name
    })
  },
  
  // 控制音乐播放的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    
    this.setData({
      isPlay
    })
    let {musicId} = this.data;
    this.musicControl(isPlay, musicId);
  },
  
  // 封装控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId){
    
   
    if(isPlay){ // 播放音乐
      
      // 获取当前音乐的播放链接
      let musicLinkData = await request('/song/url', {id: musicId});
      let musicLink = musicLinkData.data[0].url;
  
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.songDetail.name;
    }else { // 暂停音乐
      this.backgroundAudioManager.pause();
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
