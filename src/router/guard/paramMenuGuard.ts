import { Router } from 'vue-router'
import { configureDynamicParamsMenu } from '../helper/menuHelper'
import { Menu } from '../types'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { useAppStoreWithOut } from '/@/store/modules/app'
import { usePermissionStoreWithOut } from '/@/store/modules/permission'

/**
 * 获取权限模式
 * @returns
 */
const getPermissionMode = () => {
  const appStore = useAppStoreWithOut()
  return appStore.getProjectConfig.permissionMode
}

/**
 * 是否是后端返回的路由
 * @returns
 */
const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK
}

/**
 * 菜单是否由路由配置自动生成
 * @returns
 */
const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING
}

export function createParamMenuGuard(router: Router) {
  const permissionStore = usePermissionStoreWithOut()
  router.beforeEach(async (to, _, next) => {
    // 过滤无名称路由
    if (!to.name) {
      next()
      return
    }
    // 已经构建完了菜单
    if (!permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }
    let menus: Menu[] = []
    if (isBackMode()) {
      menus = permissionStore.getBackMenuList
    } else if (isRouteMappingMode()) {
      menus = permissionStore.getFrontMenuList
    }
    menus.forEach(item => configureDynamicParamsMenu(item, to.params))
    next()
  })
}
