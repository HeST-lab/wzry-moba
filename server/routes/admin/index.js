const express = require('express')
const path = require('path')
const inflection = require('inflection')
const multer = require('multer')

const router = express.Router({
  //合并参数,要不然动态的resource参数只能在app.use中使用,这样就也可以在router中使用
  mergeParams: true
})

module.exports = app => {
  //接受新建分类信息,在数据库创建数据
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })

  //当页面get请求时,从数据库查找到所有数据,并发送
  router.get('/', async (req, res) => {
    const queryOptions = {}
    //此时req.Model就相当于一个数据库,modelName是他的一个属性
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    //setOptions:设置查询选项，某些选项仅对某些操作有意义。
    const items = await req.Model.find().setOptions(queryOptions).limit(10)

    res.send(items)
  })

  //页面请求编辑分类
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  //编辑分类页面点击编辑按钮
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  //编辑分类页面点击删除按钮
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  app.use('/admin/api/rest/:resource', async (req, res, next) => {
    const modelName = inflection.classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)

    next()
  }, router)

  const upload = multer({dest: path.join(__dirname, '../../uploads')})
  //single表示接受单个文件,file表示上传时用到的字段名
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    file.url =`http://loacalhost:3000/uploads/${file.filename}`
    res.send(file)
  })
}



