import { ref, unref } from 'vue'
import { isFunction, isUnDef } from '/@/utils/is'

// 滚动到指定的位置 参数
export interface ScrollToParams {
  el: any
  to: number
  duration?: number
  callback?: () => any
}

/**
 *
 * @param t currentTime
 * @param b 开始位置
 * @param c 改变的位置
 * @param d 延迟
 * @returns
 */
const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

// 移动
const move = (el: HTMLElement, amount: number) => {
  el.scrollTop = amount
}

// 获取当前元素位置
const position = (el: HTMLElement) => {
  return el.scrollTop
}

// 滚动到指定的位置
export function useScrollTo({ el, to, duration = 500, callback }: ScrollToParams) {
  const isActiveRef = ref(false)
  const start = position(el)
  const change = to - start // 要改变的距离
  const increment = 20
  let currentTime = 0
  duration = isUnDef(duration) ? 500 : duration

  const animateScroll = function () {
    if (!unref(isActiveRef)) {
      return
    }
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    move(el, val)
    if (currentTime < duration && unref(isActiveRef)) {
      requestAnimationFrame(animateScroll)
    } else {
      if (callback && isFunction(callback)) {
        callback()
      }
    }
  }

  const run = () => {
    isActiveRef.value = true
    animateScroll()
  }

  const stop = () => {
    isActiveRef.value = false
  }

  return { start: run, stop }
}
