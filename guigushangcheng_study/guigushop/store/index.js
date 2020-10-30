import Vue from 'vue'
import Vuex from 'vuex'
import indexModule from './modules/indexModule'
Vue.use(Vuex);


// 1. 创建store对象
const store = new Vuex.Store({
	modules:{
		indexModule
	}
})


export default store;