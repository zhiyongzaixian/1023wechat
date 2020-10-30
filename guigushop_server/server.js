const Koa = require('koa');
const router = require('./router/index.js');
// 1. 生成应用实例
const app = new Koa();


// 声明使用中间件
app
	.use(router.routes()) // 声明使用route
	.use(router.allowedMethods()) // 允许使用路由的方法： GET, POST PUT DELETE



// 2. 监听端口号
app.listen('3001', (err) => {
	if(err){
		console.log('服务器启动失败');
		console.log(err);
		return;
	}
	
	console.log('服务器启动成功');
	console.log('服务器地址： http://localhost:3001');
})