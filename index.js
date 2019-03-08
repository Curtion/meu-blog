const Koa = require("koa");//web服务库
const Router = require("koa-router");//koa路由
const Koapost = require("koa-body");//基于koa的post接收库
const jwt = require("jwt-simple");//json web token库
const config = require("./config/config");//配置文件
const sql = require("./config/sql");//mysql封装类
const jstSecret = config.jstSecret;//token密钥
const app = new Koa();
const router = new Router();
const sqlQuery = new sql();

app.use(Koapost());//获得post信息

let token = require(__dirname + '/config/token.js');//加载登陆注册中间件
router.use('/user', token.routes(), token.allowedMethods());
app.use(router.routes());//挂载登陆注册中间件


app.use(async (ctx, next) => {
    if (ctx.request.header.authorization !== undefined) {
        let user = jwt.decode(ctx.request.header.authorization, jstSecret);
        let con = await sqlQuery.query("SELECT * FROM user WHERE name=?", [user.sub]);
        if(con.length === 1){
            if(Date.now() > user.exp){
                ctx.response.status = 403;
                ctx.response.body = {
                    msg: "token已过期，请重新授权",
                    "status": "-1"
                }
            }else{
                await next();
            }
        }else{
            ctx.response.status = 401;
            ctx.response.body = {
                msg: "账号授权失效，请重新授权！",
                "status": "-1"
            }
        }
    }else{
        ctx.response.status = 401;
        ctx.response.body = {
            msg: "非授权操作！",
            "status": "-1"
        }
    }
});

const fs = require("fs");
const urls = fs.readdirSync(__dirname + '/router');//获得所有子路由文件
urls.forEach(element => {//循环注册所有子路由
    let url = require(__dirname + '/router/' + element);
    router.use('/' + element.replace('.js', ''), url.routes(), url.allowedMethods());
});

app.use(router.routes());//把子路由挂载到koa之上
app.listen(3000);
