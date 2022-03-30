import { RouteLocationNormalized } from 'vue-router'
import { getRawRoute } from '/@/utils'
/**
 * 组件间的通信mitt之路由改变相关的逻辑处理
 * 用于监控路由变化，改变菜单和标签的状态。 不需要监控路由，因为路由状态的变化会受到页面呈现时间的影响，呈现时间会变慢
 */
import mitt from '/@/utils/mitt'

// 创建全局的eventBus
const emitter = mitt()

const key = Symbol()

let lastChangeTab: RouteLocationNormalized //最后改变的tab

/**
 *  当路由改变时 保存改变之后的路由
 * @param lastChangeRoute 改变的路由
 */
export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute)
  emitter.emit(key, r)
  lastChangeTab = r
}

/**
 * 监听路由改变
 * @param callback 回调返回最后一次更改的tab
 * @param immediate 是否立即
 */
export function listenerRouteChange(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(key, callback)
  immediate && lastChangeTab && callback(lastChangeTab)
}

/**
 * 清除所有的tab监控
 */
export function removeTabChangeListener() {
  emitter.clear()
}
