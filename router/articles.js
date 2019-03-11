const Router = require("koa-router");
const article = new Router();
const sqlLib = require("../config/sql");
const SqlQuery = new sqlLib();
article.post('/add', async (ctx, next) => {
    let data = ctx.request.body;
    let arr = [data.title, data.content, data.tag, data.kind]//必填项
    // ctx.state 当前用户名
    arr.forEach(ele => {
        if(data.hasOwnProperty(ele)){
            console.log("验证正确");
        }
    })
    let sql = "INSERT INTO table_name ( field1, field2,...fieldN ) VALUES ( value1, value2,...valueN )";
    let res = await SqlQuery("");
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