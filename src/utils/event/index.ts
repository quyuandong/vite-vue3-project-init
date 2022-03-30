/**
 * 构造一个 ResizeObserver 对象以观察者模式监听任意 Element / SvgElement 的尺寸变化
 */
import ResizeObserver from 'resize-observer-polyfill'

const isServer = typeof window === 'undefined'

function resizeHandler(entries: any[]) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || []
    if (listeners.length) {
      listeners.forEach((fn: () => any) => {
        fn()
      })
    }
  }
}

/**
 * 添加尺寸变化监听
 * @param element 元素
 * @param fn
 * @returns
 */
export function addResizeListener(element: any, fn: () => any) {
  if (isServer) return
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    element.__ro__ = new ResizeObserver(resizeHandler)
    // 观察element 是否变化
    element.__ro__.observe(element)
  }
  element.__resizeListeners__.push(fn)
}

/**
 * 移除变化监听
 * @param element
 * @param fn
 * @returns
 */
export function removeResizeListener(element: any, fn: () => any) {
  if (!element || !element.__resizeListeners__) return
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect()
  }
}

/**
 * 自定义一个浏览器尺寸变动时间
 */
export function triggerWindowResize() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  ;(event as any).eventType = 'message'
  window.dispatchEvent(event)
}
