const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {type: String},
  //设置ref可以,关联Category模型,这样当调用这个id的时候,服务器可以知道是从哪个模型可以查找到你想要的id匹配数据
  parent:{type: mongoose.SchemaTypes.ObjectID, ref: 'Category'}
})

module.exports = mongoose.model('Category', schema)