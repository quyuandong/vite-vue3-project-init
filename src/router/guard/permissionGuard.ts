/**
 * 路由守卫--权限保护
 */
import { Router, RouteRecord, RouteRecordRaw } from 'vue-router'
import { RootRoute } from '../routes'
import { PAGE_NOT_FOUND_ROUTE } from '../routes/basic'
import { PageEnum } from '/@/enums/pageEnum'
import { usePermissionStoreWithOut } from '/@/store/modules/permission'
import { useUserStoreWithOut } from '/@/store/modules/user'

// 登陆路由
const LOGIN_PATH = PageEnum.BASE_LOGIN

// 基础路由
const ROOT_PATH = RootRoute.path

// 白名单
const whitePathList: PageEnum[] = [LOGIN_PATH]

/**
 * 创建权限路由守卫
 * @param router
 */
export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const permissionStore = usePermissionStoreWithOut()

  router.beforeEach(async (to, from, next) => {
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getUserInfo.homePath &&
      userStore.getUserInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getUserInfo.homePath)
      return
    }

    const token = userStore.getToken

    // 白名单可以直接跳过
    if (whitePathList.includes(to.path as PageEnum)) {
      if (to.path === LOGIN_PATH && token) {
        const isSessionTimeout = userStore.getSessionTimeout
        await userStore.afterLoginAction()
        if (!isSessionTimeout) {
          next((to.query.redirect as string) || '/')
          return
        }
      }
      next()
      return
    }

    // 没有token
    if (!token) {
      // 是否忽略路由权限认证，是否设置路由源
      if (to.meta.ignoreAuth) {
        next()
        return
      }

      // 重定向到登陆页面
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        }
      }
      next(redirectData)
      return
    }

    // 处理完登陆之后跳转到404界面
    if (
      to.path === LOGIN_PATH &&
      to.name === PAGE_NOT_FOUND_ROUTE.name &&
      to.fullPath !== (userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
    ) {
      next(userStore.getUserInfo.homePath || PageEnum.BASE_HOME)
      return
    }

    // 当上次获取时间为空时获取用户信息
    if (userStore.getLastUpdateTime === 0) {
      await userStore.getUserInfoAction()
    }

    // 是否动态添加路由
    if (permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }

    const routes = await permissionStore.buildRoutesAction()

    routes.forEach(route => {
      router.addRoute(route as unknown as RouteRecordRaw)
    })
    router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecord)
    permissionStore.setDynamicAddedRoute(true)
    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 动态添加路由后，此处应重定向到fullPath,否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query })
    } else {
      const redirectPath = (from.query.redirect || to.path) as string
      const redirect = decodeURIComponent(redirectPath)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      next(nextData)
    }
  })
}
