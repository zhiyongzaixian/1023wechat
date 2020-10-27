import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [], // 导航数据
    navId: '', // 导航的标签id
    videoList: [], // 视频的列表数据
    videoId: '', // 视频id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return;
    }
    this.getInitData();
    
  },
  
  // 封装获取导航标签的数据功能函数
  async getInitData(){
    let navListData = await request('/video/group/list');
    this.setData({
      navList: navListData.data.slice(0, 14),
      navId: navListData.data[0].id
    })
  
    this.getVideoList(this.data.navId);
  },
  // 获取视频列表数据
  async getVideoList(navId){
    let videoListData = await request('/video/group' , {id: navId});
    let id = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = id++;
      return item;
    })
    
    // 关闭消息提示框
    wx.hideLoading();
    this.setData({
      videoList
    })
  },

  // 点击导航的回调
  changeNavId(event){
    // 提示用户正在加载
    wx.showLoading({
      title: '正在加载'
    })
    // console.log(event);
    // let navId = event.currentTarget.dataset.id; // data-key=value
    let navId = event.currentTarget.id; // 会自动将number转换成字符串
    this.setData({
      navId: navId>>>0,
      videoList: [],
    })
  
    this.getVideoList(this.data.navId);
  },
  
  // 点击播放/继续播放的回调
  handlePlay(event){
    /*
    * 问题： 多个视频同时播放
    * 解决思路：
    *   1. 在播放当前视频的时候关闭上一个播放的视频
    *   2. 如何操作关闭视频: videoContext = wx.createVideoContext(vid)
    *   3. 如何找到上一个播放的视频,并且关闭
    *     1) 找到上一个上下文对象
    *     2) 保证两次点击的不是同一个视频再关闭
    * js设计模式： 单例模式
    *   1. 始终保持只有一个对象，如果需要创建新的对象会把之前的覆盖掉， 节省内存空间
    *
    *
    * */
    // 获取当前点击视频的id
    let vid = event.currentTarget.id;
  
  
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // if(this.vid !== vid){
    //   if(this.videoContext){
    //     this.videoContext.stop();
    //   }
    // }
    // 更新videoId的状态
    this.setData({
      videoId: vid
    })
    // this.vid = vid;
    this.videoContext = wx.createVideoContext(vid);
    this.videoContext.play();
    // this.videoContext.stop();
    
  },
  
  // 视频播放进度发生改变的回调
  handleTimeUpdate(event){
    console.log(event);
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
