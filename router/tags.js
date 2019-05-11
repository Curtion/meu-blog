const Router = require("koa-router");
const tags = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();
const public = require("../functions/publicFunc");
const publicFunc = new public();
tags.get('/lists', async ctx => {
    try{
        let sql = "SELECT * FROM tag";
        let res  = await sqlQuery.query(sql);
        let rescount = "SELECT COUNT(*) FROM post WHERE tag LIKE '%?%'";
        for (index in res)  {
            res[index].count = (await sqlQuery.query(rescount, [res[index].id]))[0]['COUNT(*)']; // 查询标签所属文章数量
        }
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
tags.post('/add', async ctx => {
    if(!await publicFunc.checkPermission(ctx)){ //检查是否授权
        return;
    }
    let data = ctx.request.body;
    let arr = ["name"];//必填项
    let resarr = arr.filter(ele => {
        return data.hasOwnProperty(ele);
    });
    if(resarr.length !== arr.length) {
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "必要参数不能有空",
            "status": "-1"
        }
        return;
    }
    try{
        let date = Math.floor(new Date().getTime()/1000);
        let id = publicFunc.checkMaxId(await sqlQuery.query("SELECT MAX(id) FROM tag")) + 1;
        let sql = "INSERT INTO tag (id, name, count, time) VALUES (?, ?, ?, ?)";
        let res = await sqlQuery.query(sql, [id, data.name, 0, date]); //执行标签添加语句
        if(res.affectedRows !== 1){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "添加失败",
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
})
tags.delete('/delete', async ctx => {
    if(!await publicFunc.checkPermission(ctx)){ //检查是否授权
        return;
    }
    let data = ctx.query;
    if(data.id === '' || data.id === undefined) {
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "必要参数不能有空",
            "status": "-1"
        }
        return;
    }
    try{
        let sql = "DELETE FROM tag WHERE id=?";
        let res = await sqlQuery.query(sql, [+data.id]); //执行标签删除语句
        if(res.affectedRows !== 1){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "删除失败",
                "status": "-1"
            }
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "删除成功",
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