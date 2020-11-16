const { exec, escape } = require('../db/mysql')
const { getPassword } = require('../utils/cryp')
const xss = require('xss')

const login = async (username, password) => {
    username = escape(username)
    password = getPassword(password)
    password = escape(password)
    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}
const register = async (userInfo = {}) => {
    const findsql = `
        select username from users where username=${escape(userInfo.username)}
    `
    const rows = await exec(findsql)
    if (rows && rows.length) {
        return {
            code: -1,
            message: '用户名已存在，请重新输入'
        }
    }

    const username = escape(xss(userInfo.username))
    let password = getPassword(xss(userInfo.password))
    password = escape(password)
    const realname = xss(userInfo.realname)
    const sql = `
        insert into users (username, password, realname)
        values (${username}, ${password}, '${realname}');
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}
module.exports = {
    login,
    register
}
