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
        for(var k in o){         
            if(new RegExp("("+ k +")").test(fmt)){         
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
            }         
        }         
        return fmt;         
    }
    
}
module.exports = publicFunc;