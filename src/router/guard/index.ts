import { warn } from '/@/utils/log'
/**
 * 路由守卫
 */

import { Modal, notification } from 'ant-design-vue'
import { unref } from 'vue'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'
import { setRouteChange } from '/@/logics/mitt/routeChange'
import projectSetting from '/@/settings/projectSetting'
import { useAppStoreWithOut } from '/@/store/modules/app'
import { useUserStoreWithOut } from '/@/store/modules/user'
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel'
import nProgress from 'nprogress'
import { createPermissionGuard } from './permissionGuard'
import { createParamMenuGuard } from './paramMenuGuard'
import { createStateGuard } from './stateGuard'

/**
 * 设置路由守卫（注：不要改变顺序）
 * @param router 路由
 */
export function setupRouterGuard(router: Router) {
  // 全局路由守卫
  createPageGuard(router)
  // 路由切换 页面加载动画
  createPageLoadingGuard(router)
  // 路由切换 是否取消前一个路由未请求完的请求
  createHttpGuard(router)
  // 路由切换 是否回到顶部
  createScrollGuard(router)
  // 路由切换 是否关闭前一个路由的消息提示
  createMessageGuard(router)
  // 路由切换 是否打开页面切换顶部进度条
  cerateProgressGuard(router)
  // 路由鉴权
  createPermissionGuard(router)
  // 处理带有参数的菜单（必须在构建之后）
  createParamMenuGuard(router)
  // 处理store中的状态初始化
  createStateGuard(router)
}

/**
 * 处理路由全局守卫
 * @param router 路由
 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>()

  router.beforeEach(to => {
    // 页面是否已加载，避免再次打开进行加载
    to.meta.loaded = !!loadedPageMap.get(to.path)
    // 通知路由改变
    setRouteChange(to)

    return true
  })

  router.afterEach(to => {
    loadedPageMap.set(to.path, true)
  })
}

/**
 * 路由切换 页面加载动画
 * @param router
 */
function createPageLoadingGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const appStore = useAppStoreWithOut()
  const { getOpenPageLoading } = useTransitionSetting()
  router.beforeEach(async to => {
    if (!userStore.getToken) return true
    if (to.meta.loaded) return true
    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true)
      return true
    }
    return true
  })
  router.afterEach(async () => {
    // 计时器模拟加载时间，以防止闪烁太快
    if (unref(getOpenPageLoading)) {
      setTimeout(() => {
        appStore.setPageLoading(false)
      }, 220)
    }
  })
}

/**
 * 当路由被切换时，用来关闭当前页面以完成请求的接口
 * @param router
 */
function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting
  let axiosCanceler: Nullable<AxiosCanceler>
  // 切换路由是否取消所有请求
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler()
  }
  router.beforeEach(async () => {
    // 切换路由将删除之前的请求
    axiosCanceler?.removeAllPending()
    return true
  })
}

/**
 *  当路由切换时，是否回到顶部
 * @param router
 */
function createScrollGuard(router: Router) {
  // 是否是hash模式
  const isHash = (href: string) => /^#/.test(href)
  const body = document.body

  router.afterEach(async to => {
    //TODO: 此处暂时未出来非history模式
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0)
    return true
  })
}

/**
 * 当路由切换时 是否关闭消息提示(弹框，notify类型消息)
 * @param router
 */
export function createMessageGuard(router: Router) {
  const { closeMessageOnSwitch } = projectSetting
  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll()
        notification.destroy()
      }
    } catch (error) {
      warn(`路由守卫-消息提示控制错误！${error}`)
    }
    return true
  })
}

/**
 * 当路由切换时 是否打开页面切换顶部进度条
 * @param router
 */
export function cerateProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting()
  router.beforeEach(async to => {
    if (to.meta.loaded) return true
    unref(getOpenNProgress) && nProgress.start()
    return true
  })

  router.afterEach(async () => {
    unref(getOpenNProgress) && nProgress.done()
    return true
  })
}
