// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

/**
 * https://github.com/sendya/ant-design-pro-vue/blob/master/src/router/generator-routers.js
 */
export const defaultRouterMap = [
  {
    'title': '监控页面',
    'key': 'monitor',
    'component': 'PageView',
    'icon': 'area-chart',
    'children': [
      {
        'title': '单机实时监控',
        'key': 'singleMonitor'
      }
    ]
  },
  {
    'title': '系统管理',
    'key': 'system',
    'component': 'PageView',
    'icon': 'rocket',
    'children': [
      {
        'title': '风机管理',
        'key': 'FanList'
      }
    ]
  },
  { //外部链接
    'title': 'DEMO（外链）',
    'path': 'http://ruoyi.ant.zmrit.com/dashboard/weclome',
    'icon': 'pic-right',
    'target': '_blank'
  },
  {
    'title': '个人中心',
    'key': 'personal',
    'component': 'PageView',
    'hidden': true,
    'children': [
      {
        'title': '个人资料',
        'key': 'center'
      }
    ]
  },
  {
    'title': '错误页面',
    'key': 'exception',
    'component': 'RouteView',
    'hidden': true,
    'children': [
      {
        'title': '404',
        'key': '404'
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '',
    children: [
      // 外部链接
      {
        path: 'http://ruoyi.ant.zmrit.com/dashboard/weclome',
        name: 'Monitor',
        meta: { title: '监控页（外部）', target: '_blank' }
      }
    ]
  }]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/personal',
    component: UserLayout,
    redirect: '/personal/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/personal/Login')
      }
    ]
  },
  // {
  //   path: '/test',
  //   component: BasicLayout,
  //   redirect: '/test/home',
  //   children: [
  //     {
  //       path: 'home',
  //       name: 'TestHome',
  //       component: () => import('@/views/Home')
  //     }
  //   ]
  // },
  // {
  //   path: '/404',
  //   component: () => import(/* webpackChunkName: 'fail' */ '@/views/exception/404')
  // }

]
