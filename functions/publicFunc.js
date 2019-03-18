const sql = require("../config/sql");//mysql封装类
const config = require("../config/config");//配置文件
const jwt = require("jwt-simple");//json web token库
const jstSecret = config.jstSecret;//token密钥
const SqlQuery = new sql();
class publicFunc {
    
    /**
     * 检测最大ID
     *
     * @param {Array} id
     * @returns {Number}
     * @memberof publicFunc
     */
    checkMaxId(id){
        let maxId = id[0]["MAX(id)"];
        if(maxId === null){
            maxId = 0;
        }
        return ~~maxId;
    }

    
    /**
     * Author:https://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html
     * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
     * eg: 
     * yyyy-MM-dd hh:mm:ss.S==> 2006-07-02 08:09:04.423      
     * yyyy-MM-dd E HH:mm:ss ==> 2009-03-10 二 20:09:04      
     * yyyy-MM-dd EE hh:mm:ss ==> 2009-03-10 周二 08:09:04      
     * yyyy-MM-dd EEE hh:mm:ss ==> 2009-03-10 星期二 08:09:04      
     * yyyy-M-d h:m:s.S ==> 2006-7-2 8:9:4.18
     *
     * @param {String} fmt
     * @returns {String}
     * @memberof publicFunc
     */
    pattern(fmt) {
        let date = new Date();         
        let o = {         
        "M+" : date.getMonth()+1, //月份         
        "d+" : date.getDate(), //日         
        "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时         
        "H+" : date.getHours(), //小时         
        "m+" : date.getMinutes(), //分         
        "s+" : date.getSeconds(), //秒         
        "q+" : Math.floor((date.getMonth()+3)/3), //季度         
        "S" : date.getMilliseconds() //毫秒         
        };         
        let week = {         
        "0" : "/u65e5",         
        "1" : "/u4e00",         
        "2" : "/u4e8c",         
        "3" : "/u4e09",         
        "4" : "/u56db",         
        "5" : "/u4e94",         
        "6" : "/u516d"        
        };         
        if(/(y+)/.test(fmt)){         
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));         
        }         
        if(/(E+)/.test(fmt)){         
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);         
        }         
        for(let k in o){         
            if(new RegExp("("+ k +")").test(fmt)){         
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
            }         
        }         
        return fmt;         
    }


    /**
     * 
     * 检查用户是否授权
     *
     * @param {Object} ctx
     * @returns  {Boolean}
     * @memberof publicFunc
     */
    async checkPermission(ctx){
        if(ctx.request.header.authorization === undefined){
            ctx.response.status = 401;
            ctx.response.body = {
                "msg": "非授权操作！",
                "status": "-1"
            }
            return false;
        }
        try{
            let user = jwt.decode(ctx.request.header.authorization, jstSecret);
            let res = await SqlQuery.query("SELECT * FROM user WHERE name=?", [user.sub]);
            if(res.length !== 1){
                ctx.response.status = 401;
                ctx.response.body = {
                    "msg": "账号授权失效，请重新授权！",
                    "status": "-1"
                }
                return false;
            }
            if(Date.now() > user.exp){
                ctx.response.status = 403;
                ctx.response.body = {
                    "msg": "token已过期，请重新授权",
                    "status": "-1"
                }
                return false;
            }
            ctx.state.username = user.sub;
            return true;
        } catch(err){
            ctx.response.status = 500;
            ctx.response.body = {
                "msg": err,
                "status": "-1"
            }
            return false;
        }
    }
}
module.exports = publicFunc;