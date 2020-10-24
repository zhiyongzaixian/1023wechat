import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 主页轮播图
    recommendList: [], // 推荐歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送请求
    this.getInitData();
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
