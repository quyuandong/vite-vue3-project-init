import { RouteRecordNormalized } from 'vue-router'
/**
 * 菜单相关的一些操作
 */

import { getAllParentPath, transformMenuModule } from '../helper/menuHelper'
import { Menu, MenuModule } from '../types'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { useAppStoreWithOut } from '/@/store/modules/app'
import { usePermissionStore } from '/@/store/modules/permission'

import { router } from '/@/router'
import { filter } from '/@/utils/helper/treeHelper'
import { isUrl } from '/@/utils/is'
import { pathToRegexp } from 'path-to-regexp'

const modules = import.meta.globEager('./modules/**/*.ts')

const menuModules: MenuModule[] = []

Object.keys(modules).forEach(key => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  menuModules.push(...modList)
})

// 获取权限模式
const getPermissionMode = () => {
  const appStore = useAppStoreWithOut()
  return appStore.getProjectConfig.permissionMode
}

// 是否根据后端返回菜单生成路由
const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK
}

// 通过用户角色来过滤菜单(前端方式控制)，菜单由路由配置自动生成
const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING
}

// /通过用户角色来过滤菜单(前端方式控制)，菜单和路由分开配置
const isRoleMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROLE
}

const staticMenus: Menu[] = []
;(() => {
  menuModules.sort((a, b) => {
    return (a.orderNo || 0) - (b.orderNo || 0)
  })
  for (const menu of menuModules) {
    staticMenus.push(transformMenuModule(menu))
  }
})()

async function getAsyncMenus() {
  const permissionStore = usePermissionStore()
  if (isBackMode()) {
    return permissionStore.getBackMenuList.filter(item => !item.meta?.hideMenu && !item.hideMenu)
  }
  if (isRouteMappingMode()) {
    return permissionStore.getFrontMenuList.filter(item => !item.hideMenu)
  }
  return staticMenus
}

// 获取菜单
export const getMenus = async (): Promise<Menu[]> => {
  const menus = await getAsyncMenus()
  if (isRoleMode()) {
    const routes = router.getRoutes()
    return filter(menus, basicFilter(routes))
  }
  return menus
}

// 过滤菜单
function basicFilter(routes: RouteRecordNormalized[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find(route => {
      if (isUrl(menu.path)) return true

      if (route.meta?.carryParam) {
        return pathToRegexp(route.path).test(menu.path)
      }
      const isSame = route.path === menu.path
      if (!isSame) return false

      if (route.meta?.ignoreAuth) return true

      return isSame || pathToRegexp(route.path).test(menu.path)
    })

    if (!matchRoute) return false
    menu.icon = (menu.icon || matchRoute.meta.icon) as string
    menu.meta = matchRoute.meta
    return true
  }
}

// 获取子路由
export async function getChildrenMenus(parentPath: string) {
  const menus = await getMenus()
  const parent = menus.find(item => item.path === parentPath)
  // 路由不存在或者没有组件 或者隐藏菜单
  if (!parent || !parent.children || !!parent.meta?.hideChildrenInMenu) {
    return [] as Menu[]
  }
  if (isRoleMode()) {
    const routes = router.getRoutes()
    return filter(parent.children, basicFilter(routes))
  }
  return parent.children
}

/**
 * 获得一级菜单，删除子菜单
 * @returns
 */
export async function getShallowMenus(): Promise<Menu[]> {
  const menus = await getAsyncMenus()
  const shallowMenuList = menus.map(item => ({ ...item, children: undefined }))
  if (isRoleMode()) {
    const routes = router.getRoutes()
    return shallowMenuList.filter(basicFilter(routes))
  }
  return shallowMenuList
}

/**
 * 获取当前路径的父级路径
 * @param currentPath 当前路径
 * @returns
 */
export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus()
  const allParentPath = await getAllParentPath(menus, currentPath)
  return allParentPath?.[0]
}
