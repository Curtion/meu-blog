const mysql = require("mysql");//mysql操作库
const config = require("./config");//配置文件
const _db = Symbol("db");
class Sql {
    constructor() {
        this[_db] = mysql.createPool({
            host: config.mysql.host,
            port: config.mysql.port,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
        });
    }
    query(sql, value) {
        return new Promise((resove, reject) => {
            this[_db].getConnection((err, connection) => {
                if(err){
                    reject(err);
                }else{
                    connection.query(sql, value, (err, rows)=>{
                        if(err){
                            reject(err);
                        }else{
                            resove(rows);
                        }
                    })
                    connection.release();
                }
            })
        })
    }
}
module.exports = Sql;