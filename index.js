const Koa = require("koa");//web服务库
const Router = require("koa-router");//koa路由
const Koapost = require("koa-body");//基于koa的post接收库
const app = new Koa();
const router = new Router();
const RLRouter = new Router(); //登陆注册接口，单独设置一个路由提前挂载

app.use(Koapost());//获得post信息

let token = require(__dirname + '/config/token.js');//加载登陆注册中间件
RLRouter.use('/user', token.routes(), token.allowedMethods());
app.use(RLRouter.routes()); //挂载

const fs = require("fs");
const urls = fs.readdirSync(__dirname + '/router');//获得所有子路由文件
urls.forEach(element => {//循环注册所有子路由
    let url = require(__dirname + '/router/' + element);
    router.use('/' + element.replace('.js', ''), url.routes(), url.allowedMethods());
});

app.use(async (ctx, next)=>{
    ctx.response.status = 200;
    ctx.response.body = {
        "msg": "网站已经正常运行中...",
        "status": "0"
    }
    await next();
})

app.use(router.routes());//把子路由挂载到koa之上
app.listen(3000);
