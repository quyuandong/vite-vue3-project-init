import type { RouteRecordRaw } from 'vue-router'
import { basicRoutes } from './routes/index'
/**
 * 路由配置--主入口
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'

// 白名单 应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []

/**
 *  获取所有的路由名字
 * @param array 路由列表
 */
const getRouteNames = (array: any[]) => {
  array.forEach(item => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
}

getRouteNames(basicRoutes)

// 主路由
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true, //严格路由模式
  scrollBehavior: () => ({ left: 0, top: 0 }), // 切换路由时，页面滚动（回到顶部/保持原先的滚动位置）
})

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

// 设置路由
export function setupRouter(app: App<Element>) {
  app.use(router)
}
