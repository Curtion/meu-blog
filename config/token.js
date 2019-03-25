const Router = require("koa-router");//koa路由
const jwt = require("jwt-simple");//json web token库
const utility = require("utility");//sh1、md5加密库
const sql = require("./sql");//mysql封装类
const config = require("./config");//配置文件
const sqlQuery = new sql();
const token = new Router();
const tokenExpiresTime = config.tokenExpiresTime;//token超时时间
const jstSecret = config.jstSecret;//token密钥

token.post('/login', async ctx => {
    if(ctx.request.body.user !== undefined && ctx.request.body.password !== undefined){
        //检查是否存在post数据
        ctx.response.status = 400;
        ctx.response.body = {
            "msg": "登陆参数不正确！",
            "status": "-1"
        }
        return;
    }
    let post_user = ctx.request.body.user;
    let post_password = utility.md5(utility.md5(ctx.request.body.password));
    let con = await sqlQuery.query("SELECT * FROM user WHERE name=? AND password=?", [post_user, post_password]);
    if(con.length !== 1){
        //验证账号密码的正确性
        ctx.response.status = 200;
        ctx.response.body = {
            "msg": "账号或者密码错误！",
            "status": "-1"
        }
        return;
    }
    const payload = {
        'sub': post_user,
        'exp': Date.now() + tokenExpiresTime
    };
    const tokenid = jwt.encode(payload, jstSecret);
    ctx.response.status = 200;
    ctx.response.body = {
        "msg": "授权成功！",
        "info": {
            "user": post_user,
            "token": tokenid,
        },
        "status": "0",
    };
})
module.exports = token;