const router = require('koa-router')()
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { getList, addQuestion, updateQuestion, getDetail, delQuestion } = require('../controller/question')
const validLogin = require('../middleware/validLogin')
router.prefix('/api/question')

router.get('/list', validLogin, async (ctx, next) => {
  const rows = await getList(ctx.query)
  ctx.body = new SuccessModel(rows)
})

router.post('/add', validLogin, async function (ctx, next) {
  ctx.request.body.author = ctx.session.username
  const data = await addQuestion(ctx.request.body)
  if (data.id) {
    return ctx.body = new SuccessModel(data)
  }
  ctx.body = new ErrorModel('保存失败')
})

router.post('/update', validLogin, async function (ctx, next) {
  const val = await updateQuestion(ctx.query.id, ctx.request.body)
  if (val) {
      ctx.body = new SuccessModel('保存成功')
  } else {
      ctx.body = new ErrorModel('更新失败')
  }
})
router.get('/detail', validLogin, async function (ctx, next) {
  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(data)
})
router.get('/del', async function (ctx, next) {
  const data = await delQuestion(ctx.query.id)
  ctx.body = new SuccessModel(data)
})

module.exports = router;
