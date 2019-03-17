const Router = require("koa-router");
const public = require("../functions/publicFunc");
const publicFunc = new public();
const articles = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();
articles.post('/add', async (ctx) => {
    let data = ctx.request.body;
    let arr = ["title", "content", "tag", "kind"];//必填项
    let resarr = arr.filter(ele => {
        return data.hasOwnProperty(ele);
    });
    if(resarr.length !== arr.length) {
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "参数不能有为空",
            "status": "-1"
        }
        return;
    }
    try{
        let id = publicFunc.checkMaxId(await sqlQuery.query("SELECT MAX(id) FROM post")) + 1;
        let date = publicFunc.pattern("yyyy-MM-dd HH:mm:ss");
        let arg = [id, ctx.state.username, data.title, data.content, date, data.tag, data.kind, "NULL"];
        let sql = "INSERT INTO post (id, name, title, content, time, tag, kind, last_time) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
        let res = await sqlQuery.query(sql,arg); //执行文章添加语句
        if(res.affectedRows !== 1){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "发表失败",
                "status": "-1"
            }
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "提交成功",
            "status": "0"
        }
    } catch(err){
        ctx.response.status = 500;
        ctx.response.body = {
            "msg": err,
            "status": "-1"
        }
    }
});

articles.get('/lists', async (ctx, next) => {
    let data = ctx.request.query;
    if(data === undefined){
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "请限制查询条数",
            "status": "-1"
        }
        return;
    }
    if(data.limit === undefined || data.page === undefined){
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询限制参数有误",
            "status": "-1"
        }
        return;
    }
    try{
        let sql = "SELECT * FROM post LIMIT ?,?";
        let offset = (data.page-1) * data.limit;
        let res  = await sqlQuery.query(sql, [~~offset, ~~data.limit]);
        let count = await sqlQuery.query("SELECT COUNT(*) FROM post");
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "totalCount": count[0]["COUNT(*)"],
            "count": res.length,
            "page": ~~data.page,
            "data": res,
            "status": "0"
        }
        await next();
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {
            "msg": err,
            "status": "-1"
        }
    }
});
module.exports = articles;