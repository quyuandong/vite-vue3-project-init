/**
 * 路由相关的辅助方法
 */
import { AppRouteRecordRaw } from '/@/router/types'
import { createWebHashHistory, Router, RouteRecordNormalized } from 'vue-router'
import { cloneDeep, omit } from 'lodash-es'
import { createRouter } from 'vue-router'
import { AppRouteModule } from '../types'
import { EXCEPTION_COMPONENT, getParentLayout, LAYOUT } from '../constant'
import { warn } from '/@/utils/log'

export type LayoutMapKey = 'LAYOUT'
const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue')

// 创建一个不就框架map
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()
LayoutMap.set('LAYOUT', LAYOUT)
LayoutMap.set('IFRAME', IFRAME)

type DynamicViewsType = Record<string, () => Promise<Recordable>>

// 动态引入视图组件
let dynamicViewsModules: DynamicViewsType

/**
 * 动态引入路由
 * @param routes 路由
 */
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}')
  if (!routes) return
  routes.forEach(item => {
    if (!item.component && item.meta.frameSrc) {
      item.component = 'IFRAME'
    }
    const { component, name, children } = item
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase())
      item.component = layoutFound
        ? layoutFound
        : dynamicImport(dynamicViewsModules, component as string)
    } else if (name) {
      item.component = getParentLayout(name)
    }
    // 递归引入所有的
    children && asyncImportRoute(children)
  })
}

/**
 * 动态引入视图文件 views
 * @param dynamicViewsModules 所有的视图文件
 * @param component 视图路径
 * @returns
 */
function dynamicImport(dynamicViewsModules: DynamicViewsType, component: string) {
  const keys = Object.keys(dynamicViewsModules)
  const matchKeys = keys.filter(key => {
    const k = key.replace('../../views', '')
    const startFlag = component.startsWith('/')
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx')
    const startIndex = startFlag ? 0 : 1
    const lastIndex = endFlag ? key.length : k.lastIndexOf('.')
    return k.substring(startIndex, lastIndex) === component
  })
  if (matchKeys.length === 1) {
    const matchKey = matchKeys[0]
    return dynamicViewsModules[matchKey]
  } else if (matchKeys.length > 0) {
    warn('动态引入失败！请不要创建同名的 【.vue】和【.tsx】类型的文件')
    return
  } else {
    warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!')
    // 找不到页面
    return EXCEPTION_COMPONENT
  }
}

/**
 * 将后端返回的对象转换成路由对象
 * @param routeList 路由数组
 * @returns
 */
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  routeList.forEach(route => {
    const component = route.component as string
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase())
      } else {
        route.children = [cloneDeep(route)]
        route.component = LAYOUT
        route.name = `${route.name}Parent`
        route.path = ''
        const meta = route.meta || {}
        meta.single = true
        meta.affix = false
        route.meta = meta
      }
    } else {
      warn(`请正确配置路由：${route.name}的component属性！`)
    }
    route.children && asyncImportRoute(route.children)
  })
  return routeList as unknown as T[]
}

/**
 * 将多级路由转换为二级路由
 * @param routeModules 路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules)
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index]
    // 判断是否超过二级
    if (!isMultipleRoute(routeModule)) {
      continue
    }
    promoteRouteLevel(routeModule)
  }
  return modules
}

/**
 * 路由水平升级
 * @param routeModule
 */
function promoteRouteLevel(routeModule: AppRouteModule) {
  //使用vue-router来拼接菜单
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  })
  const routes = router.getRoutes()
  addToChildren(routes, routeModule.children || [], routeModule)
  router = null
  routeModule.children = routeModule.children?.map(item => omit(item, 'children'))
}

// 将所有子路由添加到副路由中
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find(item => (item.name = child.name))
    if (!route) continue
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find(item => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}

// 判断路由级别是否超过2级
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false
  }
  return routeModule.children.some(child => child.children?.length)
}
