import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 主页轮播图
    recommendList: [], // 推荐歌曲
    topList: [], // 排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送请求
    this.getInitData();
    
    this.getTopListData();
  },
  // 封装发送请求的函数
  async getInitData(){
    let bannerListData = await request('/banner', {type: 2});
    this.setData({
      bannerList: bannerListData.banners
    })
    
    // 获取推荐歌曲数据
    let recommendListData = await request('/personalized', {limit: 10})
    this.setData({
      recommendList: recommendListData.result
    })
  },
  
  // 封装获取排行榜数据的功能函数
  async getTopListData(){
    /*
    * idx取值范围： 0-20
    * idx要求值： 0-4
    * 发送5次请求
    *
    * */
    let index = 0;
    let resultArr = [];
    while (index < 5){
      let result = await request('/top/list', {idx: index++});
      // splice slice(start, end) 包含起始位置的元素，不包含结束的元素
      let topObj = {name: result.playlist.name, tracks: result.playlist.tracks.slice(0, 3)};
      resultArr.push(topObj);
      
      // 更新topList状态数据 1. 好处： 用户等待的时间少，用户体验较好， 2. 不好的地方： 渲染次数多  5次
      this.setData({
        topList: resultArr
      })
  
    }
    
    // // 更新topList状态数据 1. 不好的地方： 等待时间过长，导致长时间白屏，用户体验差  2. 好处： 页面重新渲染的次数少 1次
    // this.setData({
    //   topList: resultArr
    // })
    
  },
  
  // 跳转至 RecommendSong
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong'
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
