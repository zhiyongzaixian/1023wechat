import config from './config.js'
export default (url, data={}, method='GET') => {
	return new Promise((resolve, reject) => {
		// 1. 初始化状态为pending
		// 2. 执行异步任务
		uni.request({
			url: config.host + url,
			data,
			method,
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				console.log(err)
				reject(err);
			}
		})
	})
}