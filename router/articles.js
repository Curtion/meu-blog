const Router = require("koa-router");
const public = require("../functions/publicFunc");
const publicFunc = new public();
const articles = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();
articles.post('/add', async (ctx, next) => {
    let data = ctx.request.body;
    let arr = ["title", "content", "tag", "kind"];//必填项
    // ctx.state 当前用户名
    let resarr = arr.filter(ele => {
        return data.hasOwnProperty(ele);
    });
    if(resarr.length === arr.length){
        let id = await sqlQuery.query("SELECT MAX(id) FROM post");
        id = publicFunc.checkMaxId(id);
        console.log(id);
        // let sql = "INSERT INTO post (id, name, title, content, time, tag, kind, last_time) VALUES ( value1, value2,...valueN )";
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