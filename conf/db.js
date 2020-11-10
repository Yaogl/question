const env =  process.env.NODE_ENV  // 环境参数

let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    MYSQL_CONF = {
        host: '182.92.153.233',
        user: 'root',
        password: 'root@123',
        port: '3306',
        database: 'question',
        useConnectionPooling: true
    }
    REDIS_CONF = {
        port: '6379',
        host: '182.92.153.233'
    }
}
if (env === 'production') {
    MYSQL_CONF = {
        host: '182.92.153.233',
        user: 'root',
        password: 'root@123',
        port: '3306',
        database: 'question',
        useConnectionPooling: true
    }
    REDIS_CONF = {
        port: '6379',
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}