const Router = require("koa-router");
const tags = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();
tags.get('/lists', async ctx => {
    try{
        let sql = "SELECT * FROM tag";
        let res  = await sqlQuery.query(sql);
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                "data": res
            },
            "status": "0"
        }
    } catch(err){
        ctx.response.status = 500;
        ctx.response.body = {
            "msg": err,
            "status": "-1"
        }
    }
})
module.exports = tags;