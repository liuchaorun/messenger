const Index = require('koa-router');
const lib = require('../lib/lib');

router = new Index({
    prefix: '/android'
});

router.use(async (ctx, next) => {
    //ctx.state.user = 0;
    await next();
});

lib.autoImport(__dirname + '/api', (tmpPath) => {
    require(tmpPath)(router);
});

const routes = router.routes();

module.exports = function a() {
    return routes;
};