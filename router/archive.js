const Router = require("koa-router");
const public = require("../functions/publicFunc");
const publicFunc = new public();
const archive = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();

archive.get('/list', async ctx => {
    let tody = new Date();
    console.log(tody)
    console.log(new Date(`{$tody.getFullYear()}-08-03 00:00:00`))
    try{
        // let sql = "SELECT * FROM post order by id desc LIMIT ?,?";
        // let res  = await sqlQuery.query(sql, );
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                // "count": res.length,
                // "data": res
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

archive.get('/list/:time', async ctx => { //查询归档
    let data = ctx.request.body;
    let arr = ["cid", "post", "name", "parent"];//必填项
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
        let id = publicFunc.checkMaxId(await sqlQuery.query("SELECT MAX(id) FROM messages")) + 1;
        let date = publicFunc.pattern("yyyy-MM-dd HH:mm:ss");
        let arg = [id, data.cid, data.post, date, data.name, data.email||"NULL", data.url||"NULL", data.parent];
        let sql = "INSERT INTO messages (id, cid, post, time, name, email, url, parent) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
        let res = await sqlQuery.query(sql,arg); //执行留言添加语句
        if(res.affectedRows !== 1){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "留言失败",
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
module.exports = archive;