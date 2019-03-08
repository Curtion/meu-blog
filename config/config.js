module.exports = {
    jstSecret: 'Curtion',//jwt密钥
    tokenExpiresTime: 1000 * 60 * 60 * 24 * 7,//token过期时间
    mysql:{
        host: "127.0.0.1",//数据库地址
        port: "3306",//端口
        user: "Curtion",//用户名
        password: "123456",//密码
        database: "node_blog"//数据库名
    }
}