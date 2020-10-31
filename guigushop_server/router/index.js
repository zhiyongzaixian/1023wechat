const KoaRouter = require('koa-router');
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
// 主页的数据接口
let cateGoryData = require('../datas/categoryDatas.json');
router.get('/getCateGoryData', (ctx) => {
	ctx.body = cateGoryData;
});


module.exports = router;