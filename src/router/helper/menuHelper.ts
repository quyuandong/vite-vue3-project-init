/**
 * 菜单相关的辅助方法
 */
import { cloneDeep } from 'lodash-es'
import { toRaw } from 'vue'
import { RouteParams } from 'vue-router'
import { AppRouteModule, AppRouteRecordRaw, Menu, MenuModule } from '/@/router/types'
import { findPath, treeMap } from '/@/utils/helper/treeHelper'
import { isUrl } from '/@/utils/is'

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  // 获取匹配的菜单路由的路径
  const menuList = findPath(treeData, n => n.path === path) as Menu[]
  return (menuList || []).map(item => item.path)
}

/**
 * 为所有的菜单添加父级路径
 * @param menus 菜单
 * @param parentPath 父级路径
 */
function joinParentPath(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index]
    // 注意，以/开头的嵌套路径将被视为根路径,
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      menu.path = `${parentPath}/${menu.path}`
    }
    if (menu.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path)
    }
  }
}

/**
 * 解析菜单模块
 * @param menuModule 菜单模块
 * @returns
 */
export function transformMenuModule(menuModule: MenuModule): Menu {
  const { menu } = menuModule
  const menuList = [menu]
  joinParentPath(menuList)
  return menuList[0]
}

/**
 * 根据路由生成菜单
 * @param routeModList 路由
 * @param routerMapping
 * @returns
 */
export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList)
  const routeList: AppRouteRecordRaw[] = []

  cloneRouteModList.forEach(item => {
    // 是否隐藏所有子菜单
    if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect
    }
    if (item.meta.single) {
      const realItem = item?.children?.[0]
      realItem && routeList.push(realItem)
    } else {
      routeList.push(item)
    }
  })
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node
      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      }
    },
  })
  // 加入父级路径
  joinParentPath(list)
  return cloneDeep(list)
}

const menuParamRegex = /(?::)([\s\S]+?)((?=\/)|$)/g

/**
 * 配置带有参数的菜单
 * @param menu 菜单
 * @param params 参数
 */
export function configureDynamicParamsMenu(menu: Menu, params: RouteParams) {
  const { path, paramPath } = toRaw(menu)
  let realPath = paramPath ? paramPath : path
  const matchArr = realPath.match(menuParamRegex)
  matchArr?.forEach(it => {
    const realIt = it.substr(1)
    if (params[realIt]) {
      realPath = realPath.replace(`:${realIt}`, params[realIt] as string)
    }
  })
  // 保留原始参数路径
  if (!paramPath && matchArr && matchArr.length > 0) {
    menu.paramPath = path
  }
  menu.path = realPath
  menu.children?.forEach(item => configureDynamicParamsMenu(item, params))
}
