// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '初始化测试数据',
    userInfo: {}, // 用户基本信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad() 监听页面加载');
    // 发请求
    // debugger;
    // 数据绑定
    // console.log(this);
    // setTimeout(() => {
    //   // 修改状态数据
    //   this.setData({
    //     msg: '修改之后的数据'
    //   })
    //   console.log(this.data.msg);// 同步： 修改之后的数据
    // }, 2000)

    // wx.getUserInfo(Object object)获取用户基本信息
    wx.getUserInfo({
      success: (res) => {
        console.log('获取成功: ', res)
        // 更新userInfo的状态数据
        this.setData({
          userInfo: res.userInfo
        })
      },
      fail: (err) => {
        console.log('获取用户信息失败');
      }
    })

  },

  handleParent(){
    console.log('parent');
  },
  handleChild(){
    console.log('child');
  },

  // 跳转至logs页面
  toLogs(){
    wx.redirectTo({
      url: '/pages/logs/logs',
    })
  },

  // 获取用户基本信息的回调
  handleGetUserInfo(res){
    // console.log('用户点击了。。。')
    // console.log(res);
    if(res.detail.userInfo){ // 允许
      // 更新userInfo的状态数据
      this.setData({
        userInfo: res.detail.userInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady() 监听页面初次渲染完成');
    // 发请求
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow() 监听页面显示');
    // 会执行多次，数据更新频率高
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide() 监听页面隐藏');

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload() 监听页面卸载');

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