import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList: [], // 导航数据
    navId: '', // 导航的标签id
    videoList: [], // 视频的列表数据
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
  
  // 封装获取初始化的功能函数
  async getInitData(){
    let navListData = await request('/video/group/list');
    this.setData({
      navList: navListData.data.slice(0, 14),
      navId: navListData.data[0].id
    })
    
    
    // 获取视频列表数据
    let videoListData = await request('/video/group' , {id: this.data.navId});
    console.log(videoListData);
    this.setData({
      videoList: videoListData.datas
    })
  },

  // 点击导航的回调
  changeNavId(event){
    console.log(event);
    // let navId = event.currentTarget.dataset.id; // data-key=value
    let navId = event.currentTarget.id; // 会自动将number转换成字符串
    this.setData({
      navId: navId>>>0
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
