import PubSub from 'pubsub-js';
import moment from 'moment'
import MyPubSub from '../../../utils/myPubsub/index.js';
import request from "../../../utils/request";
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
    currentTime: '00:00', // 实时播放的时长
    durationTime: '00:00', // 总时长
    currentWidth: 0, // 实时进度条的长度
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
    
    // 监听音乐自然播放结束，自动切换至下一首
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换至下一首
      // 发布消息给recommendSong页面
      MyPubSub.publish('switchType', 'next')
    })
  
    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('总时长： ', this.backgroundAudioManager.duration);
      // console.log('实时播放的时间： ', this.backgroundAudioManager.currentTime);
      
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
  
    // 订阅recommendSong发布的消息
    MyPubSub.subscribe('musicId', (msg, musicId) => {
      // console.log('songDetail: ', musicId);
      
      // 获取当前音乐musicId对应的音乐详情
      this.getMusicInfo(musicId);
      
      // 自动播放当前音乐
      this.musicControl(true, musicId);
      // 取消订阅
      MyPubSub.unsubscribe('musicId')
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
    // moment(传入的时间单位是ms)
    // 格式化时间
    let durationTime = moment(songDetailData.songs[0].dt).format('mm:ss');
    this.setData({
      songDetail: songDetailData.songs[0],
      durationTime
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

  // 点击切歌的回调
  handleSwitchSong(event){
    // // 订阅recommendSong发布的消息
    // MyPubSub.subscribe('musicId', (msg, musicId) => {
    //   console.log('songDetail: ', musicId);
    //
    //
    //   // 取消订阅
    //   MyPubSub.unsubscribe('musicId')
    // })
    
    // 停止当前音乐播放
    this.backgroundAudioManager.stop();
    let type = event.currentTarget.id;
    // 发布消息给recommendSong页面
    MyPubSub.publish('switchType', type)
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
