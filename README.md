# wzry-moba

## 〇、整体结构

- admin -- 后台管理页面
  - 基于Element UI展示一个后台数据管理页面
- server -- 服务器
  - 用nodejs编写后台数据库
- web  -- 前端App页面
  - 显示前端页面



## 一、后台管理 -- 基于Element UI

### 1.找到Element UI 布局容器

- 在admin中 vue add element  和 vue add router
- 在views中创建Main.vue在Element官网找到合适的布局容器,复制到Main.vue中,把不需要的代码删除,再设置一下各部分样式
- 再给Main设置路由,在router中把首页设置为Main
- 在App.vue中删除多余代码,只留router-view,修改一下样式,去除边距

### 2.创建分类

#### 客户端

- 先把UI布局内容进行修改
- 为了让页面左边菜单有电机跳转的效果,需要在el-menu标签中添加router属性,再在el-menu-item标签的index属性写入跳转的params地址
- 在views中创建CategoryEdit.vue页面,编写跳转后的页面内容
- 在Main.vue中把el-main标签内部写入router-view,让他根据router变化视图
- 在router中给Main添加子路由CategoryEdit.vue
- 在CategoryEdit.vue中给input双向绑定一个数据,这个数据是要传给数据库的
- 在input上级父元素el-from中加入 @submit.native.prevent = "submit"
- submit方法用来**请求接口**和**提交数据**
- **请求接口**需要axios
  - 先安装axios  
  - 新建目录network,在目录下面新建http.js,来创建axios,编写baseURl等属性,然后导出
  - 在main.js中引入http : Vue.prototype.$http = http
- **提交数据**就在CategoryEdit.vue中的submit方法中,用this.$http.post()来请求接口和提交数据

#### 服务端

- 在server文件中先安装express mongoose cors 插件
- 在server中创建indedx文件,然后编写express常规步骤,引入各模块,app.use各种中间件
- 把各路由创建到router中
- 首先创建admin路由,导出一个函数形式,接受index传来的app
- 然后接收从客户端CategoryEdit传来的数据,这时候又需要数据库
- 创建数据库
  - 新建plugins目录,创建db.js
  - 在index中引用db.js
  - 在db.js写入数据库常规代码
  - 创建一个数据库模型目录models
  - 在里面创建Category.js用来定义分类数据的数据类型和结构
- 在admin路由中引入Category数据模型
- 用Category.create(req.body)来接受并创建数据,然后res.send()创建出来的数据

#### 客户端

- 有了数据库之后,就可以进行操作了
- 在submit中写 this.$http.post('请求端口', 发送数据)
- 发送完数据后,用this.$router.push()跳转页面
- 再用this.$message({...})来发送通知

### 3.分类列表

#### 客户端

- 在views目录中创建CategoryList.vue,编写内容
- 在router中引用CategoryList,并设置为子路由
- CategoryList中在methods()添加一个函数,在create()中调用页面创建时**获取数据**
- 此函数用get方法请求端口,获取数据

#### 服务端

- 在admin中通过router.get调用Category.find(),来查找和发送数据库内容,

### 4.分类编辑

#### 客户端

- 在CategoryList中添加编辑按钮
- 点击编辑按钮,触发click函数,调用$router.push()根据id跳转页面

```js
@click="$router.push(`/categories/edit/${scope.row._id}`)"
```

- 在路由router中添加路径,指向CategoryEdit组件,并且添加属性prop:true  ,这样可以把params传给组件
  - 这样可以不用this.$route.params._id,路由和组件之间的解耦
- 在跳转后的CategoryEdit中的methods中编写获取数据的方法
- create()钩子中添加方法

```js
this.$http.get(`/categories/edit/${id}`)
```

- 在点击保存按钮后,客户端向服务端发送需要修改的数据

```js
this.$http.put(`categories/${this.id}`, this.model)
```



#### 服务端

- admin中使用router.get方法根据传来的params中的id,来在数据库中查找到数据,并且返回
- 使用router.get根据传来的params中的id,findByIdAndUpdate数据库中的req.body

### 5.分类删除

- CategoryList中添加删除按钮
- 编写删除方法,在方法里添加一个弹框效果
- 用this.$http.delete传送id

- 在服务端,用router.delete接受id并删除数据,返回一个正确提示即可
- 然后删除完毕后,在CategoryList再次调用fetch(),更新页面数据

### 6.子分类

#### 客户端

- 首先在CategoryEdit页面添加一个Select 选择器
- 首先,这个选择器要从数据库请求list列表数据
- 其次这个选择器需要被选择的parent的id数据添加到数据库的parent类别中
- 点击保存,添加完成后,在CategoryList页面显示出保存的parent数据,
- 虽然保存的是id属性,但是要展示name属性

#### 服务端

- 给数据库添加parent数据

```js
  //设置ref可以,关联Category模型,这样当调用这个id的时候,服务器可以知道是从哪个模型可以查找到你想要的id匹配数据
  parent:{type: mongoose.SchemaTypes.ObjectID, ref: 'Category'} 
```

- 为了让客户端获取到是根据id数据查找到的name数据,所以要修改List页面的请求端口返回数据

```js
    const items = await Category.find().populate('parent').limit(10)
	// populate()方法获取根据当前数据返回关联的数据 ---> 根据id返回关联的Categoty模型中跟id匹配的name数据,返回的是一个对象
    
```

### 7. 通用CRUD接口

- 在客户端来说,需要的数据操作基本上都是一样的
- 所以需要在客户端把CRUD操作改成通用的
- 方法就是把传过来的接口路径名变成单数,然后首字母大写,用变化过的名字匹配数据模型
- 总的来说就是接口通用,数据模型不通用



- 首先改造接口,在后面把传来的地址动态化
- 在客户端把接口改一下
- 根据动态params参数来require数据模型
- 添加inflection插件,使用它的classify()方法可以把动态params变成类名格式
- 在app.use中添加这个处理中间件

```js
 app.use('/admin/api/rest/:resource',async (req, res, next) =>{
    const modelName = inflection.classify(req.params.resource)
    req.model = require(`../../models/${modelName}`)
    next()
  },router)
```

- 在有些特殊操作 (比如populate) 时,就要进行特殊化处理

```js
   const queryOptions = {}
    //此时req.Model就相当于一个数据库,modelName是他的一个属性
    if(req.Model.modelName === 'Category'){
      queryOptions.populate = 'parent'
    }
    //setOptions:设置查询选项，某些选项仅对某些操作有意义。
    const items = await req.Model.find().setOptions(queryOptions).limit(10)

```

### 8. 装备物品管理

#### 客户端

- 编写两个侧边栏,新建物品和物品列表
- 在router中添加跳转路由
- 修改新建物品和物品列表页面,修改内部请求端口

#### 服务端

- 创建物品数据模型
- 使用CEUD通用接口



### 9. 图片上传

#### 客户端

- 在ItemEdit里面添加Element上传UI
- 设置相关属性

```html
<el-upload
            class="avatar-uploader "
            accept="image/*"
            :action="$http.default.baseURL + '/upload'"
            :show-file-list="false"
            :on-success="afterUpload">
          <img v-if="model.icon" :src="model.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
```

- 但是action提交数后没接口接受,提交的字段名叫file

#### 服务端

- express本身获取不了上传的文件
- 安装中间件 multer
- 对multer进行配置,在app.post中使用

```js
 const upload = multer({dest: path.join(__dirname, '../../uploads')})
  //single表示接受单个文件,file表示上传时用到的字段名
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = res.file
    res.send(file)
  })
```

- 要把存储的图片以URL地址的形式发给前端,就要把upload文件夹开放
- 给file一个url属性



- 在客户端ItemEdit中使用Vue.$set()，给model添加icon属性，并赋值res.url
- 给页面添加一列，内部默认是地址，可以去element中找一个自定义table中显示内容的代码





























































