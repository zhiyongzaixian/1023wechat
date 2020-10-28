import PubSub from 'pubsub-js';
import MyPubSub from '../../utils/myPubsub/index.js';

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [], // 推荐歌曲列表
    index: 0, // 点击个体的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    
    this.getRecommendList();
    
    // 订阅songDetail发布的消息
    MyPubSub.subscribe('switchType', (msg, switchType) => {
      // console.log('recommendSong: ', msg, switchType);
      let {recommendList, index} = this.data;
      if(switchType === 'pre'){ // 上一首
        (index === 0) && (index = recommendList.length)
        index -= 1;
      }else { // 下一首
        (index === recommendList.length - 1) && (index = -1)
        index += 1;
      }
      
      // 切歌以后动态更新下标
      this.setData({
        index
      })
      
      // 获取即将要切歌的musicId
      let musicId = recommendList[index].id;
      // 发布消息给songDetail
      MyPubSub.publish('musicId', musicId);
      
    })
  },

  // 获取推荐歌曲列表的方法
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList: recommendListData.recommend
    })
  },
  
  // 跳转至歌曲详情songDetail
  toSongDetail(event){
    // let song = event.currentTarget.dataset.song;
    // let index = event.currentTarget.datast.index;
    let {song, index} = event.currentTarget.dataset;
    // console.log(song);
    
    // 更新index的状态数据
    this.setData({
      index
    })
    // 路由传参： query  url?key=value&key1=value1
    wx.navigateTo({
      // url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
      url: '/pages/songDetail/songDetail?musicId=' + song.id
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
