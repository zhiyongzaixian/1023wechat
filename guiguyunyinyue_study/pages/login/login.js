/**
  作者: Created by zhiyongzaixian
  说明: 登录流程
    1. 收集表单项内容
    2. 前端验证
      1) 前端验证不通过，提示用户数据不合法(格式不正确，如： 手机号登录，用户名必须是手机号格式)，不需要发请求
      2) 前端验证通过，需要发请求(携带用户名，密码)给服务器进行后端验证
    3. 后端验证
      1) 验证用户名是否存在，根据请求提交的用户参数查询数据库
        1. 用户名存在，验证当前用户对应的密码是否正确
          -1 如果密码正确， 返回登录成功的数据
          -2 如果密码不正确，返回密码不正确的提示信息
        2. 用户名不存在，直接返回用户不存在的信息
*/
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机号
    password: '' // 密码
  },

  // 表单项内容发生改变的回调
  handleInputChange(event){
    let type = event.currentTarget.id;
    // console.log(type, event.detail.value);
    
    this.setData({
      [type]: event.detail.value
    })
  },
  
  // 登录的回调
  async login(){
    // 前端验证
    let {phone, password} = this.data;
    /*
    * 手机号验证：
    *   1. 手机号为空
    *   2. 手机号格式不正确
    *   3. 手机号格式正确
    *
    * */
    // 手机号为空
    if(!phone.trim()){
      // 提示用户
      // alert('xx');
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    // 手机号格式不正确
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return;
    }
    
    // 密码为空
    if(!password.trim()){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    
    // 后端验证
    let result = await request('/login/cellphone', {phone, password});
    if(result.code === 200){
      wx.showToast({
        title: '登录成功'
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码不正确',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
