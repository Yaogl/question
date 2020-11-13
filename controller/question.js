const { exec, escape } = require('../db/mysql')
const xss = require('xss')
const querystring = require('querystring')
const json = require('koa-json')

const getList = async (query) => {
    query.page = query.page || 1;
    query.size = query.size || 10;
    let sql = `
        select * from question where author='${query.username}'
    `
    let totalSql = `select count(*) from question where author='${query.username}'`

    if (query.content) {
        sql+= ` and content like '%${query.content}%'`
        totalSql+= ` and content like '%${query.content}%'`
    }
    sql+= ` order by createtime desc limit ${ (query.page - 1) * query.size }, ${query.size}`
    const rows = await exec(sql)
    const count = await exec(totalSql)
    return { data: rows, total: count[0]['count(*)'] }
}
const addQuestion = async (question = {}) => {
    const content = xss(question.content)
    const author = question.author
    const createTime = Date.now()
    const answers = JSON.stringify(question.answers)
    const rightkeys = JSON.stringify(question.rightkeys)
    const sql = `
        insert into question (content, answers, rightkeys, createtime, author)
        values ('${content}', '${answers}', '${rightkeys}', ${createTime}, '${author}');
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}
const updateQuestion = async (id, question = {}) => {
    const content = xss(question.content)
    const createTime = Date.now()
    const answers = JSON.stringify(question.answers)
    const rightkeys = JSON.stringify(question.rightkeys)
    const sql = `
        update question set content='${content}', createTime=${createTime},
        answers='${answers}', rightkeys='${rightkeys}' where id=${id};
    `
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
}
const getDetail = async (id) => {
    const sql = `
        select * from question where id=${id}
    `
    const data = await exec(sql)
    return data[0] || {}
}
const delQuestion = async (id) => {
    const sql = `
        delete from question where id=${id}
    `
    const data = await exec(sql)
    if (data.affectedRows > 0) {
        return true
    }
    return false
}
module.exports = {
    getList,
    addQuestion,
    updateQuestion,
    getDetail,
    delQuestion
}