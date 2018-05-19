/*
 * Creat by liuchaorun
 * Date 18-5-16
 * Time 下午12:33
 **/
const Index = require('koa-router');
const lib = require('../lib/lib');
const logger = require('../lib/logger');

router = new Index({
	prefix: '/cloudExhibition'
});

//错误处理路由
router.use(async (ctx, next) => {
	try{
		await next()
	}
	catch (e) {
        logger.error(e);
        lib.msgTranslate(ctx,500,{},{code:0,msg:'服务器错误!'});
    }
});

lib.autoImport(__dirname + '/api', (tmpPath) => {
	require(tmpPath)(router);
});

const routes = router.routes();

module.exports = function a() {
	return routes;
};