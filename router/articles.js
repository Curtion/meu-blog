const Router = require("koa-router");
const articles = new Router();
const Sql = require("../config/sql");
const SqlQuery = new Sql();
articles.post('/add', async (ctx, next) => {
    console.log(ctx.method);
    let data = ctx.request.body;
    let arr = ["title", "content", "tag", "kind"];//必填项
    // ctx.state 当前用户名
    let resarr = arr.filter(ele => {
        return data.hasOwnProperty(ele);
    });
    if(resarr.length === arr.length){
        // let sql = "INSERT INTO table_name ( field1, field2,...fieldN ) VALUES ( value1, value2,...valueN )";
        // let res = await SqlQuery("");
    }else{
        ctx.response.status = 200;
        ctx.response.body = {
            msg: "参数不能有为空",
            "status": "-1"
        }
    }
    await next();
});
articles.get('/list', async (ctx, next) => {
    ctx.response.status = 200;
    ctx.response.body = "article/list";
    await next();
});
module.exports = articles;