const Index = require('koa-router');
const lib = require('../lib/lib');
const logger = require('../lib/logger');

router = new Index({
    prefix: '/android'
});

//错误处理路由
router.use(async (ctx, next) => {
	try{
		await next()
	}
	catch (e) {
		logger.error(e);
		lib.msgTranslate(ctx,200,{},{code:500,msg:'服务器错误!'});
	}
});

lib.autoImport(__dirname + '/api', (tmpPath) => {
    require(tmpPath)(router);
});

const routes = router.routes();

module.exports = function a() {
    return routes;
};