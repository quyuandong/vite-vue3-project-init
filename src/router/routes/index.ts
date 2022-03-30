import { REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE } from './basic'
import { PageEnum } from '/@/enums/pageEnum'
import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types'

// 直接导入所有的路由
const modules = import.meta.globEager('./modules/**/*.ts')

const routeModuleList: AppRouteModule[] = []

Object.keys(modules).forEach(key => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

// 导出异步路由(需要权限的)
export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

// 导出基本路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

// 登陆路由
export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  // TODO: 待进行对应
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: '登陆',
  },
}

// 无需权限的基础路由
export const basicRoutes = [LoginRoute, RootRoute, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE]
