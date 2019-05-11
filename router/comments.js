const sendMail = require("../functions/mailer");
const Router = require("koa-router");
const public = require("../functions/publicFunc");
const publicFunc = new public();
const comments = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();

comments.post('/add', async (ctx, next) => { //添加评论
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
        sendMail.send({
            from: '"竹影流浪" <curtion@126.com>', // login user must equel to this user
            to: 'icurtion@gmail.com',
            subject: '竹影流浪：您有新的留言',
            html: `<div style="margin: 16px 40px; background-color: #eef2fa; border: 1px solid #d8e3e8; padding: 0 15px; -moz-border-radius:5px; -webkit-border-radius:5px; -khtml-border-radius:5px; border-radius:5px;">
                <p>竹影流浪：<a target="_blank" href="http://127.0.0.1:8080/articles/${data.cid}">http://127.0.0.1:8080/articles/${data.cid}</a></strong>&nbsp;有新的评论</p>
                <p><strong>${data.name}</strong>&nbsp;评论说：${data.post}</p> <p>时间：${date}<br />邮箱：${data.email}<br /></p>
            </div>`
        })
    } catch(err){
        ctx.response.status = 500;
        ctx.response.body = {
            "msg": err,
            "status": "-1"
        }
    }
})

comments.get('/lists/:cid', async ctx=> { //获得文章评论
    let cid = ctx.params.cid;
    if(cid === undefined){
        return;
    }
    try{
        let sql = "SELECT * FROM messages WHERE cid=?";
        let res  = await sqlQuery.query(sql, [~~cid]);
        if(res.length === 0){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "该文章还没有留言",
                "status": "-1"
            }
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                "data": res
            },
            "status": "0"
        }
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {
            "msg": err,
            "status": "-1"
        }
    }
})

comments.get('/lists', async ctx=> { //获得所有
    try{
        let sql = "SELECT * FROM messages";
        let res  = await sqlQuery.query(sql);
        if(res.length === 0){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "还没有留言",
                "status": "-1"
            }
            return;
        }
        for(let i = 0;i < res.length;i++) {
            let title = await sqlQuery.query("SELECT title FROM post WHERE id = ?", [res[i].cid]);
            res[i].title = title[0].title
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                "data": res
            },
            "status": "0"
        }
    } catch(err) {
        ctx.response.status = 500;
        ctx.response.body = {
            "msg": err,
            "status": "-1"
        }
    }
})

comments.delete('/delete', async ctx => {
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
        let sql = "DELETE FROM messages WHERE id=?";
        let res = await sqlQuery.query(sql, [+data.id]); //执行分类删除语句
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
module.exports = comments;