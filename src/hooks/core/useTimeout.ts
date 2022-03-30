import { tryOnUnmounted } from '@vueuse/core'
import { ref, watch } from 'vue'
import { isFunction } from '/@/utils/is'
/**
 * 延时器的代码加载方法
 */

export function useTimeoutFn(handle: Fn<any>, wait: number, native = false) {
  if (!isFunction(handle)) {
    throw new Error('handle is not function')
  }
  const { readyRef, start, stop } = useTimeoutRef(wait)
  if (native) {
    handle()
  } else {
    watch(
      readyRef,
      maturity => {
        maturity && handle()
      },
      { immediate: false },
    )
  }
  return { readyRef, start, stop }
}

/**
 * 是否开始使用定时器
 * @param wait 等待时间
 * @returns
 */
export function useTimeoutRef(wait: number) {
  const readyRef = ref(false)

  let timer: TimeoutHandle
  function stop(): void {
    readyRef.value = false
    timer && window.clearTimeout(timer)
  }

  function start(): void {
    stop()
    timer = setTimeout(() => {
      readyRef.value = true
    }, wait)
  }

  start()

  tryOnUnmounted(stop)

  return { readyRef, stop, start }
}
