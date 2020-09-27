var router = require('koa-router')();
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { register, login } = require('../controller/users')

router.prefix('/api/users');

router.post('/register', async function (ctx, next) {
  const data = await register(ctx.request.body)
  if (data.id) {
    return ctx.body = new SuccessModel(data)
  }
  ctx.body = new ErrorModel('用户名重复')
})

router.post('/login', async function (ctx, next) {
  const { username, password } = ctx.request.body
  const data = await login(username, password)
  if (data.username) {
    ctx.session.username = data.username
    ctx.session.realname = data.realname
    ctx.body = new SuccessModel('登录成功')
    return
  }
  ctx.body = new ErrorModel('登录失败')
})

module.exports = router;
