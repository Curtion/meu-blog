const Router = require("koa-router");
const article = new Router();
article.get('/', async (ctx, next) => {
    ctx.response.status = 200;
    ctx.response.body = "article";
    await next();
});
article.get('/list', async (ctx, next) => {
    ctx.response.status = 200;
    ctx.response.body = "article/list";
    await next();
});
module.exports = article;