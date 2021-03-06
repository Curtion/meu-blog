const Router = require("koa-router");
const public = require("../functions/publicFunc");
const publicFunc = new public();
const articles = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();
const mysql = require("mysql");//mysql操作库
articles.post('/add', async (ctx) => {
    if(!await publicFunc.checkPermission(ctx)){ //检查是否授权
        return;
    }
    let data = ctx.request.body;
    let arr = ["title", "content", "tag", "kind"];//必填项
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
        let id = publicFunc.checkMaxId(await sqlQuery.query("SELECT MAX(id) FROM post")) + 1;
        let date = Math.floor(new Date().getTime()/1000);
        let userid = await sqlQuery.query("SELECT id FROM user WHERE name=?", [ctx.state.username]);
        let arg = [id, userid[0].id, data.title, data.content, date, data.tag, data.kind, date];
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

articles.put('/updata', async (ctx) => {
    if(!await publicFunc.checkPermission(ctx)){ //检查是否授权
        return;
    }
    let data = ctx.request.body;
    let arr = ["title", "content", "tag", "kind"];//必填项
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
        let sql = "UPDATE post SET title=?, content=?, tag=?, kind=?, last_time=? where id = ?";
        let arg = [data.title, data.content,data.tag, data.kind, date, data.id];
        let res = await sqlQuery.query(sql,arg); //执行文章更新语句
        if(res.affectedRows !== 1){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "更新失败",
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

articles.get('/lists', async ctx => {
    let data = ctx.request.query;
    if(data === undefined){
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "请携带参数提交查询",
            "status": "-1"
        }
        return;
    }
    if(data.limit === undefined || data.page === undefined){
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "请求参数错误",
            "status": "-1"
        }
        return;
    }
    try{
        let sql = "SELECT * FROM post order by id desc LIMIT ?,?";
        let offset = (data.page-1) * data.limit;
        let res  = await sqlQuery.query(sql, [~~offset, ~~data.limit]);
        let count = await sqlQuery.query("SELECT COUNT(*) FROM post");
        for(let i = 0;i < res.length; i++){
            let msgcount = await sqlQuery.query("SELECT count(*) FROM messages WHERE cid = ?", [res[i].id]);
            res[i].msgnum = msgcount[0]["count(*)"]
            let kind = await sqlQuery.query("SELECT name FROM kinds WHERE id = ?", [res[i].kind]);
            if(kind[0] !== undefined ) {
                if (kind[0].hasOwnProperty('name')) {
                    res[i].kindname = kind[0].name
                }
            }
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                "totalCount": count[0]["COUNT(*)"],
                "count": res.length,
                "page": ~~data.page,
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
});

articles.get('/lists/:id', async ctx=> {
    let id = ctx.params.id;
    if(id === undefined){
        return;
    }
    try{
        let sql = "SELECT * FROM post WHERE id=?";
        let res  = await sqlQuery.query(sql, [~~id]);
        let kind = await sqlQuery.query("SELECT * FROM kinds WHERE id=?", [~~res[0].kind]);
        let name = await sqlQuery.query("SELECT * FROM user WHERE id=?", [~~res[0].name]);
        if(kind.length !== 0){
            res[0].kind = kind[0].name;
        }
        res[0].name = name[0].name;
        if(res.length === 0){
            ctx.response.status = 200;
            ctx.response.body = {
                "msg": "文章ID不正确",
                "status": "-1"
            }
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                "data": res[0]
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
articles.delete('/delete', async ctx => {
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
        let sql = "DELETE FROM post WHERE id=?";
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
articles.get('/search', async ctx=> {
    let content = decodeURI(ctx.request.url.split('content=')[1]);
    if( content === ''){
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "请携带参数提交查询",
            "status": "-1"
        }
        return;
    }
    try{
        let sql = "SELECT * FROM post WHERE title LIKE " + mysql.escape("%"+content+"%");
        let res  = await sqlQuery.query(sql);
        for(let i = 0;i < res.length; i++){
            let msgcount = await sqlQuery.query("SELECT count(*) FROM messages WHERE cid = ?", [res[i].id]);
            res[i].msgnum = msgcount[0]["count(*)"]
            let kind = await sqlQuery.query("SELECT name FROM kinds WHERE id = ?", [res[i].kind]);
            if(kind[0] !== undefined ) {
                if (kind[0].hasOwnProperty('name')) {
                    res[i].kindname = kind[0].name
                }
            }
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
module.exports = articles;