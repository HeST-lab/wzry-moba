import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './views/Main'
import CategoryEdit from "./views/CategoryEdit";
import CategoryList from "./views/CategoryList";
import ItemEdit from "./views/ItemEdit";
import ItemList from "./views/ItemList";

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    children: [
      {
        path: '/categories/create',
        component: CategoryEdit
      },
      {
        path: '/categories/edit/:id',
        component: CategoryEdit,
        props: true  //把这个url参数全部传入CategoryEdit组件内
      },
      {
        path: '/categories/list',
        component: CategoryList
      },
      {
        path: '/items/create',
        component: ItemEdit
      },
      {
        path: '/items/edit/:id',
        component: ItemEdit,
        props: true  //把这个url参数全部传入ItemEdit组件内
      },
      {
        path: '/items/list',
        component: ItemList
      },

    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
