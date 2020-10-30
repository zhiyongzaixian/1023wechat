import Vue from 'vue'
import App from './App'

// 关闭生产提示
Vue.config.productionTip = false


// 声明App组件在小程序的类型是应用
App.mpType = 'app'// application


// 生成应用实例
const app = new Vue({
    ...App
})

// 挂载应用
app.$mount()

