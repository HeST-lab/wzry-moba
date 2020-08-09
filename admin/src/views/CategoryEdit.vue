<template>
  <div id="about">
    <h1>{{id ? '编辑' : '新建'}}分类</h1>
    <!--    native:表示原生表单，prevent表示阻止默认提交跳转页面-->
    <el-form label-width="120px" @submit.native.prevent="submit">
      <el-form-item label="上级分类">
        <el-select v-model="model.parent" placeholder="请选择">
          <el-option
              v-for="item in parents"
              :key="item._id"
              :label="item.name"
              :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "CategoryEdit",
    props: {
      id: {}  //这样可以尽可能根路由解耦,就不用写this.$route.params.id
    },
    data() {
      return {
        model: {},
        parents: [],
      }
    },
    methods: {
      async submit() {
        //新建和修改点击按钮不一样
        if (this.id) {
          await this.$http.put(`rest/categories/${this.id}`, this.model)
        } else {
          //点击提交,发送数据,跳转页面
          await this.$http.post('rest/categories', this.model)
        }
        this.$router.push('/categories/list')
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      },
      async fetch() {
        const res = await this.$http.get(`rest/categories/${this.id}`)
        this.model = res.data
      },
      async fetchParent() {
        const res = await this.$http.get(`rest/categories`)
        this.parents = res.data
      }
    },
    created() {
      this.id && this.fetch()
      this.fetchParent()
    }
  }
</script>

<style scoped>

</style>