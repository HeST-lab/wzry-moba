const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const admin = require('./routes/admin/index')
const db = require('./plugins/db')

const app = express()

app.use('/uploads', express.static(__dirname + '/uploads'))
//配置req.body中间件
app.use(bodyParser.json())
//配置跨域中间件
app.use(cors())


admin(app)
db(app)

app.listen(3000, () => {
  console.log('http://loaclhost:3000')
  // console.log(app.use('/uploads/', express.static(path.join(__dirname, './uploads'))))
})
