// 封装发送请求的模块
/**
  作者: Created by zhiyongzaixian
  说明: 封装
  1. 封装函数：
    1) 功能函数功能点明确
    2) 复用性要高，灵活度
    3) 在函数内部保留静态的代码
    4) 将动态的数据抽取形参，由使用者根据实际注入实参
    5) 一个良好的功能函数要规定参数的必要性和参数的类型和参数的默认值
  2. 封装组件:
    1) 分类： UI组件 || js组件
    2) 功能明确
    3) 在组件内部保留静态代码
    4) 将动态的数据抽取成props数据，由使用者根据情况以标签属性的形式动态传入
    5) 一个良好的组件应该规定props数据的必要性, 及数据类型还有默认值
 
    props: ['arr']
    props: {
      arr: {
        type: Array,
        required: true,
        default: []
      }
    }
  
*/
import config from './config'
export default (url, data={}, method='GET') => {
 return new Promise((resolve, reject) => {
   // 1. new Promise 会初始化promise实例的状态为pending 初始化
   
   // 2. 执行任务
   wx.request({
     url: config.host + url,
     data,
     method,
     header: {
       cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
     },
     success: (res) =>{
       if(data.isLogin){ // 登录请求
         // 保存cookie至本地
         wx.setStorageSync('cookies', res.cookies);
       }
       resolve(res.data);  // 修改promise实例的状态resolved 成功状态
     },
     fail: (err) => {
       reject(err);   // 修改promise实例的状态为rejected 失败状态
       // resolve([]);
     }
   })
 })

}
