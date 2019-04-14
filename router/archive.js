const Router = require("koa-router");
const public = require("../functions/publicFunc");
const publicFunc = new public();
const archive = new Router();
const sql = require("../config/sql");
const sqlQuery = new sql();
archive.get('/lists', async ctx => {
    try{
        let sql = "SELECT max(time),min(time) FROM post";
        let res  = await sqlQuery.query(sql);
        let maxTime = res[0]['max(time)'];
        let minTime = res[0]['min(time)'];
        let max = new Date(new Date(maxTime*1000).toLocaleString());
        let min = new Date(new Date(minTime*1000).toLocaleString());
        let monthNum = (max.getFullYear() - min.getFullYear())*12 + (max.getMonth() - min.getMonth()); //距离间隔月数
        let blogDate = new Date(`${min.getFullYear()}-${min.getMonth() + 1}-01 00:00:00`);
        let blogYear = 0; //递增年份
        let DateArr = []; //时间存储
        for(let i = 1; i <= monthNum + 3; i++) {
            let month = i % 12;
            if(month === 0) {
                blogYear++;
            }
            blogDate.setFullYear(min.getFullYear() + blogYear);
            blogDate.setMonth(min.getMonth() + month - 1);
            DateArr.push(Date.parse(blogDate)/1000);
        }
        let archiveBlogList = []; //最后结果
        let archiveBlogTime = ''; //月份
        for(let i = 0; i < DateArr.length; i++){
            if((i + 1) !== DateArr.length){
                let sql = 'SELECT id,title FROM post WHERE time > ? AND time < ?';
                let res  = await sqlQuery.query(sql, [DateArr[i], DateArr[i+1]]);
                archiveBlogTime = new Date(DateArr[i]*1000);
                archiveBlogList.push({
                    year: archiveBlogTime.getFullYear(),
                    month: archiveBlogTime.getMonth() + 1 < 10 ? '0' + (archiveBlogTime.getMonth() + 1): archiveBlogTime.getMonth() + 1,
                    list: res
                });
            }
        }
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "查询成功",
            "info": {
                "data": archiveBlogList
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