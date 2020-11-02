const KoaRouter = require('koa-router');
const Fly=require("flyio/src/node")
const fly=new Fly;
// 生成路由器
const router = new KoaRouter();



// ctx上下文对象， 等同于expres： req + res
router.get('/test', (ctx, next) => {
	// ctx.response.body
	ctx.body = '测试返回数据';
});

// 主页的数据接口
let indexData = require('../datas/index.json');
// console.log(indexData, typeof indexData);
router.get('/getIndexData', (ctx) => {
	ctx.body = indexData;
});


// 分类页的数据接口
let cateGoryData = require('../datas/categoryDatas.json');
router.get('/getCateGoryData', (ctx) => {
	ctx.body = cateGoryData;
});



// 主页分类列表的数据接口
let indexCateList = require('../datas/indexCateList.json');
router.get('/getIndexCateListData', (ctx) => {
	ctx.body = indexCateList;
});





// 获取用户openId的接口
router.get('/getOpenId', async (ctx) => {
	// 1.获取请求参数
	let code = ctx.query.code;
	// console.log('code: ', code);
	// 2. 根据请求及请求参数处理响应数据
	// 2.1 准备请求的参数数据
	let appId = 'wx810e8b1fde386fde';
	let appSecret = '7d5e744c38766ac8f2e50fcfe719d3f9';
	let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
	// 2.2 发请求给微信服务器端获取用户的唯一标识
	let result = await fly.get(url);
	// console.log('result: ', result.data, typeof result.data);
	let openId = JSON.parse(result.data).openid;
	console.log('openId: ', openId)
	// 2.3 自定义登录态
	let person = {
		nickname: 'curry',
		age: 33,
		money: 1000000000000000,
		openId
	}
	// 2.4 对原数据进行加密
	
	
	// 3. 返回响应数据
	ctx.body = '返回的假数据'
});

module.exports = router;