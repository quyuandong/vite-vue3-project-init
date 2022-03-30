import { PageEnum } from './../../enums/pageEnum'
import projectSetting from '/@/settings/projectSetting'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { useAppStoreWithOut } from './app'
import { useUserStore } from './user'
import { store } from '/@/store'
/**
 * 权限相关仓库
 */

import { AppRouteRecordRaw, Menu } from '/@/router/types'
import { PermissionModeEnum } from '/@/enums/appEnum'
import { filter } from '/@/utils/helper/treeHelper'
import { asyncRoutes } from '/@/router/routes'
import { flatMultiLevelRoutes, transformObjToRoute } from '/@/router/helper/routeHelper'
import { transformRouteToMenu } from '/@/router/helper/menuHelper'
import { useMessage } from '/@/hooks/web/useMessage'
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'

interface PermissionState {
  permCodeList: string[] | number[] // 权限码列表
  isDynamicAddedRoute: boolean // 是否动态添加路由
  lastBuildMenuTime: number // 最后触发菜单更新时间
  backMenuList: Menu[] // 后台返回的菜单列表
  frontMenuList: Menu[] // 菜单列表
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    backMenuList: [],
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute
    },
  },
  actions: {
    // 设置权限码
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList
    },
    // 设置菜单
    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },
    // 设置后台返回的菜单
    setBackMenuList(list: Menu[]) {
      this.backMenuList = list
      list?.length > 0 && this.setLastBuildMenuTime()
    },
    // 设置最后触发菜单更新时间
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },
    // 设置是否使用动态路由
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    // 重置state状态
    resetState(): void {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.backMenuList = []
      this.lastBuildMenuTime = 0
    },
    // 改变权限码
    async changePermissionCode() {
      // TODO: 获取权限码
      // const codeList =
      this.setPermCodeList([])
    },
    // 构建路由
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const userStore = useUserStore()
      const appStore = useAppStoreWithOut()

      // 路由
      let routes: AppRouteRecordRaw[] = []
      // 获取角色
      const roleList = toRaw(userStore.getRoleList) || []
      // 获取权限模式
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig

      /**
       * 根据角色过滤对应的路由
       * @param route
       * @returns
       */
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        const { roles } = meta || {}
        if (!roles) return true
        return roleList.some(role => roles.includes(role))
      }

      /**
       * 根据设置的首页path，修正routes中的affix标记（固定首页）
       * @param routes 路由
       * @returns
       */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return
        // 默认首页路径
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath += '/'
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                // 找到首页之后终止
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }
        try {
          patcher(routes)
        } catch (error) {}
        return
      }

      /**
       * 移除忽略的路由
       * @param route 路由
       * @returns
       */
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        const { ignoreRoute } = meta || {}
        return !ignoreRoute
      }

      switch (permissionMode) {
        // 角色来过滤菜单(前端方式控制)，菜单和路由分开配置
        case PermissionModeEnum.ROLE:
          // 根据角色进行路由过滤
          routes = filter(asyncRoutes, routeFilter)
          routes = routes.filter(routeFilter)
          // 将多级路由转为二级路由
          routes = flatMultiLevelRoutes(routes)
          break

        // 角色来过滤菜单(前端方式控制)，菜单由路由配置自动生成
        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filter(asyncRoutes, routeFilter)
          routes.filter(routeFilter)
          const menuList = transformRouteToMenu(asyncRoutes, true)
          // 移除忽略的路由
          routes = filter(routes, routeRemoveIgnoreFilter)
          routes.filter(routeRemoveIgnoreFilter)
          // 菜单进行排序
          menuList.sort((a, b) => {
            return (a.meta.orderNo || 0) - (b.meta.orderNo || 0)
          })
          this.setFrontMenuList(menuList)
          routes = flatMultiLevelRoutes(routes)
          break

        // 通过后台来动态生成路由表(后台方式控制)
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage()
          createMessage.loading('菜单加载中...', 1)

          // TODO: 待做
          // 模拟从后台获取权限码， 这个函数可能只需要执行一次，实际的项目本身可以放置在正确的时间

          // 路由
          let routeList: AppRouteRecordRaw[] = []
          // 获取权限码
          this.changePermissionCode()
          //TODO: 获取菜单列表
          // routeList = (await getMenuList()) as AppRouteRecordRaw[]

          // 动态引入组件(component)
          routes = transformObjToRoute(routeList)
          // 将后台返回的路由转成菜单
          const backMenuList = transformRouteToMenu(routeList)
          this.setBackMenuList(backMenuList)

          // 移除忽略的路由
          routeList = filter(routeList, routeRemoveIgnoreFilter)
          routeList = routeList.filter(routeRemoveIgnoreFilter)
          // 将多级路由转为二级路由
          routeList = flatMultiLevelRoutes(routeList)
          // 加入404路由
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
          break

        default:
          break
      }
      // 加入错误日志路由
      routes.push(ERROR_LOG_ROUTE)
      // 据设置的首页path，修正routes中的affix标记（固定首页）
      patchHomeAffix(routes)
      return routes
    },
  },
})

// 提供外部使用的store
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
