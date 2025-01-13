import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由配置
 * @description 所有路由都在这里集中管理
 */
const routes: RouteRecordRaw[] = [
  /**
   * 首页
   */
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/detail/:id?',
    name: 'Detail',
    component: () => import('@/views/detail/index.vue'),
    meta: {
      title: '详情',
    },
  },
  {
    path: '/add',
    name: 'Add',
    component: () => import('@/views/add/index.vue'),
    meta: {
      title: '添加',
    },
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/my/index.vue'),
    meta: {
      title: '我的',
    },
  },
  {
    path: '/approve-list/:approveType?',
    name: 'ApproveList',
    component: () => import('@/views/approveList/index.vue'),
    meta: {
      title: '审批列表',
    },
  },
  {
    path: '/approve/:id?',
    name: 'Approve',
    component: () => import('@/views/approve/index.vue'),
    meta: {
      title: '审批',
    },
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('@/views/collect/index.vue'),
    meta: {
      title: '收藏',
    },
  },
  /**
   * 子路由示例
   */
  // {
  //   path: '/foo',
  //   name: 'foo',
  //   component: () => import('@/components/TransferStation.vue'),
  //   meta: {
  //     title: 'Foo',
  //   },
  //   redirect: {
  //     name: 'bar',
  //   },
  //   children: [
  //     {
  //       path: 'bar',
  //       name: 'bar',
  //       component: () => import('@/views/foo/bar.vue'),
  //       meta: {
  //         title: 'Bar',
  //       },
  //     },
  //   ],
  // },
]

export default routes
