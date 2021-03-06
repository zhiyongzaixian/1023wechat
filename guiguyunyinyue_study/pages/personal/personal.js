let startY = 0; // 手指起始坐标
let moveY = 0; // 手指实时移动的坐标
let moveDistance = 0; // 手指移动的距离

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户最近播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo
      })
      this.getUserRecentPlay();
    }
   
    
    
  },
  
  // 获取用户最近播放记录
  async getUserRecentPlay(){
    let recentPlayData = await request('/user/record', {uid: this.data.userInfo.userId,type: 0});
    let id = 0;
    let recentPlayList = recentPlayData.allData.slice(0, 10).map(item => {
      item.id = id++;
      return item;
    });
    this.setData({
      recentPlayList
    })
  },
  
  handleTouchStart(event){
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    
    // 计算手指移动的距离
    moveDistance = moveY - startY;
    
    if(moveDistance < 0){
      return;
    }
    
    if(moveDistance >= 80){
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  
  },
  handleTouchEnd(){
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },
  
  // 跳转至login的回调
  toLogin(){
    // 判断用户是否登录
    if(this.data.userInfo.nickname){
      return;
    }
    wx.navigateTo({
      url: '/pages/login/login'
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
