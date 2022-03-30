import { useMultipleTabStore } from '/@/store/modules/multipleTab'
import { useTabs } from './useTabs'
import { resetRouter, router } from '/@/router'
import { useAppStore } from '/@/store/modules/app'
import { usePermissionStore } from '/@/store/modules/permission'
import { useUserStore } from '/@/store/modules/user'
import projectSetting from '/@/settings/projectSetting'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { RouteRecordRaw } from 'vue-router'
import { RoleEnum } from '/@/enums/roleEnum'
import { isArray } from '/@/utils/is'
import { intersection } from 'lodash-es'
/**
 * 用户权限相关的操作
 */

export function usePermission() {
  const userStore = useUserStore()
  const appStore = useAppStore()
  const permissionStore = usePermissionStore()
  const { closeAll } = useTabs(router)

  // 切换权限模式
  async function togglePermissionMode() {
    appStore.setProjectConfig({
      permissionMode:
        projectSetting.permissionMode === PermissionModeEnum.BACK
          ? PermissionModeEnum.ROUTE_MAPPING
          : PermissionModeEnum.BACK,
    })
  }

  // 重置并重新获取授权资源信息
  async function resume() {
    const tabStore = useMultipleTabStore()
    tabStore.clearCacheTabs()
    resetRouter()
    const routes = await permissionStore.buildRoutesAction()
    routes.forEach(route => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })
    permissionStore.setLastBuildMenuTime()
    closeAll()
  }

  // 确认是否有权限
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    if (!value) return def

    const permMode = projectSetting.permissionMode
    if ([PermissionModeEnum.ROUTE_MAPPING, PermissionModeEnum.ROLE].includes(permMode)) {
      if (!isArray(value)) {
        userStore.getRoleList?.includes(value as RoleEnum)
      }
      return (intersection(value, userStore.getRoleList) as RoleEnum[]).length > 0
    }

    if (PermissionModeEnum.BACK === permMode) {
      const allCodeList = permissionStore.getPermCodeList as string[]
      if (!isArray(value)) return allCodeList.includes(value)
      return (intersection(value, allCodeList) as string[]).length > 0
    }
    return true
  }

  // 切换角色
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
      throw new Error(
        'Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!',
      )
    }

    if (!isArray(roles)) {
      roles = [roles]
    }
    userStore.setRoleList(roles)
    await resume()
  }

  // 刷新菜单
  async function refreshMenu() {
    resume()
  }

  return { changeRole, hasPermission, togglePermissionMode, refreshMenu }
}
