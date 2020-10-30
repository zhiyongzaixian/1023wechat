import request from '../../utils/request.js'
let state = {
	initData: '测试数据',
	indexData: {}, // 主页的数据
}


let mutations = {
	changeIndexDataMutation(state, indexData){
		state.indexData = indexData;
	}
}

let actions = {
	async getIndexDataAction({commit}){
		// 1. 执行异步任务
		let indexData = await request('/getIndexData')
		// 2. 通过commit触发mutation，同时将异步数据交给对应的mutation
		commit('changeIndexDataMutation', indexData)
	}
}


let getters = {
	
}



export default {
	state,
	mutations,
	actions,
	getters
}